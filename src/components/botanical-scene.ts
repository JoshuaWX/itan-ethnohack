import {
  ACESFilmicToneMapping, Box3, DirectionalLight, Group, HemisphereLight,
  MathUtils, Mesh, OrthographicCamera, Quaternion, Scene, Texture, Vector3,
  WebGLRenderer, type Material,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

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
  scene.add(sway, new HemisphereLight(0xfffbef, 0x60794e, 1.35));
  const key = new DirectionalLight(0xfff2dc, 2.65);
  key.position.set(2, 3, 2);
  const rim = new DirectionalLight(0xffffeb, 1.4);
  rim.position.set(-2, 2, -1);
  scene.add(key, rim);

  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.set(1.72, 1.42, 1.68);
  camera.lookAt(0, 0.5, 0);
  camera.rotateZ(0.1);

  const mouse = window.matchMedia("(hover: hover) and (pointer: fine)");
  const controller = new AbortController();
  const hingeAxis = new Vector3(0, 0, 1);
  const hinge = new Quaternion();
  const petals: { mesh: Mesh; rest: Quaternion }[] = [];
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
    const halfHeight = Math.max(size.y, size.x / aspect) / 1.64;
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
    easedX = MathUtils.damp(easedX, mouseX, 4, dt);
    easedY = MathUtils.damp(easedY, mouseY, 4, dt);
    easedScroll = MathUtils.damp(easedScroll, scroll, 5, dt);
    const settling = (1 - MathUtils.clamp(elapsed / 1.3, 0, 1)) ** 3;
    const breeze = Math.sin(elapsed * 0.93) * 0.014 + Math.sin(elapsed * 0.41) * 0.007;
    sway.position.set(easedX * 0.024, -settling * 0.045 + easedY * 0.012 + easedScroll * 0.035, 0);
    sway.rotation.set(
      -easedY * 0.05,
      easedX * 0.085 + easedScroll * 0.11 - settling * 0.075,
      breeze,
    );
    petals.forEach(({ mesh, rest }, index) => {
      const opening = MathUtils.smoothstep(elapsed - index * 0.07, 0.08, 0.95);
      hinge.setFromAxisAngle(hingeAxis, 0.13 * (1 - opening));
      mesh.quaternion.copy(rest).multiply(hinge);
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
    const rect = hero.getBoundingClientRect();
    mouseX = MathUtils.clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1);
    mouseY = MathUtils.clamp(1 - (event.clientY - rect.top) / rect.height * 2, -1, 1);
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
    plant.traverse((object) => {
      if (object instanceof Mesh && /^Petal[ _][1-3]$/.test(object.name)) {
        petals.push({ mesh: object, rest: object.quaternion.clone() });
      }
    });
    bounds = cameraBounds(sway, camera);
    resize();
    updateActivity();
  })().catch(dispose);

  return dispose;
}
