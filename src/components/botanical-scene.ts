import {
  ACESFilmicToneMapping, Box3, DirectionalLight, Float32BufferAttribute, Group,
  HemisphereLight, MathUtils, Mesh, OrthographicCamera, Quaternion, Scene, Texture, Vector3,
  WebGLRenderer, type Material,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// The authored leaf blades grow along local +X. Bend across their surface,
// keeping the roots fixed. The normal delta follows the slope of the bend.
function addLeafBend(mesh: Mesh) {
  const geometry = mesh.geometry;
  const positions = geometry.getAttribute("position");
  const normals = geometry.getAttribute("normal");
  geometry.computeBoundingBox();
  const length = geometry.boundingBox?.max.x ?? 0;
  if (length <= 0 || !normals) return;
  const positionDelta = new Float32Array(positions.count * 3);
  const normalDelta = new Float32Array(normals.count * 3);
  const bentNormal = new Vector3();
  for (let index = 0; index < positions.count; index++) {
    const alongBlade = Math.max(0, positions.getX(index) / length);
    const offset = index * 3;
    positionDelta[offset + 1] = length * 0.18 * alongBlade ** 2;
    const x = normals.getX(index);
    const y = normals.getY(index);
    const z = normals.getZ(index);
    bentNormal.set(x - y * 0.36 * alongBlade, y, z).normalize();
    normalDelta[offset] = bentNormal.x - x;
    normalDelta[offset + 1] = bentNormal.y - y;
    normalDelta[offset + 2] = bentNormal.z - z;
  }
  geometry.morphTargetsRelative = true;
  geometry.morphAttributes.position = [new Float32BufferAttribute(positionDelta, 3)];
  geometry.morphAttributes.normal = [new Float32BufferAttribute(normalDelta, 3)];
  mesh.updateMorphTargets();
}

function cameraBounds(plant: Group, camera: OrthographicCamera) {
  plant.updateMatrixWorld(true);
  camera.updateMatrixWorld(true);
  const bounds = new Box3();
  const point = new Vector3();
  plant.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    const positions = object.geometry.getAttribute("position");
    for (let i = 0; i < positions.count; i++) {
      point.set(positions.getX(i), positions.getY(i), positions.getZ(i));
      point.applyMatrix4(object.matrixWorld).applyMatrix4(camera.matrixWorldInverse);
      bounds.expandByPoint(point);
    }
  });
  return bounds;
}

function disposePlant(plant: Group) {
  const materials = new Set<Material>();
  const textures = new Set<Texture>();
  plant.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    object.geometry.dispose();
    const meshMaterials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of meshMaterials) materials.add(material);
  });
  for (const material of materials) {
    for (const value of Object.values(material)) {
      if (value instanceof Texture) textures.add(value);
    }
    material.dispose();
  }
  const bitmaps = new Set<ImageBitmap>();
  for (const texture of textures) {
    if (typeof ImageBitmap !== "undefined" && texture.image instanceof ImageBitmap) {
      bitmaps.add(texture.image);
    }
    texture.dispose();
  }
  for (const bitmap of bitmaps) bitmap.close();
}

export function mountBotanicalScene(host: HTMLDivElement, hero: HTMLElement) {
  const canvas = document.createElement("canvas");
  let renderer: WebGLRenderer;
  try {
    const context = canvas.getContext("webgl2", { alpha: true, antialias: true });
    if (!context) return;
    renderer = new WebGLRenderer({ canvas, context, alpha: true, antialias: true });
  } catch {
    return;
  }

  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  host.append(canvas);

  const scene = new Scene();
  const sway = new Group();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.set(1.26, 1.92, 1.96);
  camera.lookAt(0, 0.52, 0);
  camera.rotateZ(0.27);

  const key = new DirectionalLight(0xffebcb, 2.3);
  key.position.set(-2.5, 2.2, 1.8).applyQuaternion(camera.quaternion);
  const fill = new DirectionalLight(0xf1f0df, 0.46);
  fill.position.set(1, 0.4, 2.2).applyQuaternion(camera.quaternion);
  const rim = new DirectionalLight(0xfff1ce, 1.35);
  rim.position.set(1.8, 1.4, -2.5).applyQuaternion(camera.quaternion);
  scene.add(sway, new HemisphereLight(0xf7f7e7, 0x63744a, 0.95), key, fill, rim);

  const mouse = window.matchMedia("(hover: hover) and (pointer: fine)");
  const desktop = window.matchMedia("(min-width: 1024px)");
  const controller = new AbortController();
  const hingeAxis = new Vector3(0, 0, 1);
  const hinge = new Quaternion();
  const petals: { mesh: Mesh; rest: Quaternion }[] = [];
  const leaves: { mesh: Mesh; rest: Quaternion; side: number; flex: number }[] = [];
  let model: Group | undefined;
  let bounds: Box3 | undefined;
  let disposed = false;
  let visible = false;
  let painted = false;
  let frame = 0;
  let previous = 0;
  let elapsed = 0;
  let mouseX = 0;
  let mouseY = 0;
  let easedX = 0;
  let easedY = 0;
  let scroll = 0;
  let easedScroll = 0;

  function resize() {
    const { clientWidth: width, clientHeight: height } = host;
    if (!width || !height) return;
    const ratio = Math.min(window.devicePixelRatio, mouse.matches ? 1.5 : 1.25);
    if (renderer.getPixelRatio() !== ratio) renderer.setPixelRatio(ratio);
    renderer.setSize(width, height, false);
    if (!bounds) return;
    const center = bounds.getCenter(new Vector3());
    const size = bounds.getSize(new Vector3());
    const aspect = width / height;
    // Keep a margin around the projected silhouette for sway and pointer movement.
    const coverage = desktop.matches ? 0.94 : 0.82;
    const halfHeight = Math.max(size.y, size.x / aspect) / (2 * coverage);
    const halfWidth = halfHeight * aspect;
    camera.left = center.x - halfWidth;
    camera.right = center.x + halfWidth;
    camera.top = center.y + halfHeight;
    camera.bottom = center.y - halfHeight;
    camera.updateProjectionMatrix();
  }

  function draw(now: number) {
    if (!mouse.matches && previous && now - previous < 1000 / 30 - 1) {
      frame = requestAnimationFrame(draw);
      return;
    }
    const dt = previous ? Math.min((now - previous) / 1000, 0.08) : 0;
    previous = now;
    elapsed += dt;
    easedX = MathUtils.damp(easedX, mouseX, 5, dt);
    easedY = MathUtils.damp(easedY, mouseY, 5, dt);
    easedScroll = MathUtils.damp(easedScroll, scroll, 5, dt);
    const settling = (1 - MathUtils.clamp(elapsed / 1.3, 0, 1)) ** 3;
    const breeze = Math.sin(elapsed * 0.93) * 0.021 + Math.sin(elapsed * 0.41) * 0.009;
    sway.position.set(easedX * 0.026, -settling * 0.04 + easedY * 0.012 + easedScroll * 0.035, 0);
    sway.rotation.set(
      -easedY * 0.085,
      easedX * 0.19 + easedScroll * 0.12 - settling * 0.055,
      breeze - easedX * 0.047,
    );
    petals.forEach(({ mesh, rest }, index) => {
      const opening = MathUtils.smoothstep(elapsed - index * 0.1, 0.05, 1.05);
      const breath = Math.sin(elapsed * 0.8 - index * 0.7) * 0.023 * opening;
      hinge.setFromAxisAngle(hingeAxis, 0.16 * (1 - opening) + breath);
      mesh.quaternion.copy(rest).multiply(hinge);
    });
    leaves.forEach((leaf, index) => {
      const breeze = Math.sin(elapsed * 1.24 - index * 1.8) * 0.36;
      const response = breeze + mouseY * 0.43 + mouseX * leaf.side * 0.47 - easedScroll * 0.2;
      leaf.flex = MathUtils.damp(leaf.flex, MathUtils.clamp(response, -1, 1), 3.4 - index * 0.6, dt);
      hinge.setFromAxisAngle(hingeAxis, leaf.flex * 0.12);
      leaf.mesh.quaternion.copy(leaf.rest).multiply(hinge);
      const weights = leaf.mesh.morphTargetInfluences;
      if (weights) weights[0] = leaf.flex;
    });

    try {
      renderer.render(scene, camera);
    } catch {
      dispose();
      return;
    }
    if (!painted) {
      host.dataset.sceneReady = "true";
      painted = true;
    }
    frame = requestAnimationFrame(draw);
  }

  function updateActivity() {
    const active = !disposed && model && visible && !document.hidden;
    host.toggleAttribute("data-scene-active", Boolean(active));
    if (!active && frame) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else if (active && !frame) {
      previous = 0;
      frame = requestAnimationFrame(draw);
    }
  }

  function onPointerMove(event: PointerEvent) {
    if (!visible || !mouse.matches || event.pointerType !== "mouse") return;
    const rect = host.getBoundingClientRect();
    const horizontal = (event.clientX - rect.left) / rect.width;
    const influence = MathUtils.lerp(0.14, 1, MathUtils.smoothstep(horizontal, -0.6, 0.16));
    mouseX = MathUtils.clamp(horizontal * 2 - 1, -1, 1) * influence;
    mouseY = MathUtils.clamp(1 - (event.clientY - rect.top) / rect.height * 2, -1, 1) * influence;
  }

  function resetPointer() {
    mouseX = 0;
    mouseY = 0;
  }

  function onScroll() {
    if (!visible) return;
    const rect = hero.getBoundingClientRect();
    scroll = MathUtils.clamp(-rect.top / rect.height, 0, 1);
  }

  function onPointerChange() {
    resetPointer();
    resize();
  }

  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (!visible) resetPointer();
    onScroll();
    updateActivity();
  });
  const sizeObserver = new ResizeObserver(resize);
  intersection.observe(host);
  sizeObserver.observe(host);
  hero.addEventListener("pointermove", onPointerMove, { passive: true });
  hero.addEventListener("pointerleave", resetPointer);
  mouse.addEventListener("change", onPointerChange);
  desktop.addEventListener("change", resize);
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", updateActivity);
  canvas.addEventListener("webglcontextlost", dispose);

  function dispose() {
    if (disposed) return;
    disposed = true;
    controller.abort();
    updateActivity();
    intersection.disconnect();
    sizeObserver.disconnect();
    hero.removeEventListener("pointermove", onPointerMove);
    hero.removeEventListener("pointerleave", resetPointer);
    mouse.removeEventListener("change", onPointerChange);
    desktop.removeEventListener("change", resize);
    window.removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", updateActivity);
    canvas.removeEventListener("webglcontextlost", dispose);
    if (model) disposePlant(model);
    renderer.dispose();
    if (!renderer.getContext().isContextLost()) renderer.forceContextLoss();
    canvas.remove();
    delete host.dataset.sceneReady;
  }

  void (async () => {
    const response = await fetch("/hero/trillium.glb", { signal: controller.signal });
    if (!response.ok) throw new Error("Unable to load the flower");
    const { scene: plant } = await new GLTFLoader().parseAsync(await response.arrayBuffer(), "");
    if (disposed) {
      disposePlant(plant);
      return;
    }
    model = plant;
    const size = new Box3().setFromObject(plant);
    const height = size.max.y - size.min.y;
    if (!(height > 0 && Number.isFinite(height))) throw new Error("Invalid flower bounds");
    plant.position.y -= size.min.y;
    sway.scale.setScalar(1 / height);
    sway.add(plant);
    // Move the complete bloom around the junction at the top of the stem.
    const crown = new Group();
    const receptacle = plant.getObjectByName("Receptacle");
    if (receptacle) {
      crown.position.copy(receptacle.position);
      const floralParts = plant.children.filter(({ name }) =>
        /^(Anther|Filament|Ovary|Petal|Receptacle|Sepal|Stigma)([ _]|$)/.test(name));
      plant.add(crown);
      for (const part of floralParts) {
        part.position.sub(crown.position);
        crown.add(part);
      }
      const towardViewer = new Vector3(camera.position.z, 0, -camera.position.x).normalize();
      crown.quaternion.setFromAxisAngle(towardViewer, 0.24);
      crown.scale.setScalar(1.23);
    }
    const inverseCameraRotation = camera.quaternion.clone().invert();
    plant.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      if (/^Petal[ _][1-3]$/.test(object.name)) {
        petals.push({ mesh: object, rest: object.quaternion.clone() });
      } else if (/^Leaf[ _][1-3]$/.test(object.name)) {
        addLeafBend(object);
        const side = new Vector3(1, 0, 0).applyQuaternion(object.quaternion)
          .applyQuaternion(inverseCameraRotation).x;
        leaves.push({ mesh: object, rest: object.quaternion.clone(), side, flex: 0 });
      }
    });
    bounds = cameraBounds(sway, camera);
    resize();
    updateActivity();
  })().catch(dispose);

  return dispose;
}
