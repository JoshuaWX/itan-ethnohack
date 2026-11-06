"""Open this script in Blender's Text Editor in Object Mode and click Run Script.

Each run rebuilds the Trillium collection's generated plant and exports
stylized_flower.glb to your Desktop. Dimensions are in meters.
"""

import ctypes
import sys
from itertools import product
from math import cos, pi, radians, sin, tau
from pathlib import Path
from uuid import UUID

import bpy
import numpy as np
from mathutils import Matrix, Vector


STEM_HEIGHT = 0.32
GENERATED = "ethnohack_stylized_trillium"


def desktop_directory():
    if sys.platform != "win32":
        return Path.home() / "Desktop"

    # FOLDERID_Desktop follows Windows folder redirection, including OneDrive.
    desktop_id = UUID("B4BFCC3A-DB2C-424C-B029-7FE99A87C641")
    guid = (ctypes.c_ubyte * 16).from_buffer_copy(desktop_id.bytes_le)
    get_path = ctypes.windll.shell32.SHGetKnownFolderPath
    get_path.argtypes = (
        ctypes.c_void_p, ctypes.c_uint32, ctypes.c_void_p,
        ctypes.POINTER(ctypes.c_void_p),
    )
    get_path.restype = ctypes.c_long
    free_path = ctypes.windll.ole32.CoTaskMemFree
    free_path.argtypes = (ctypes.c_void_p,)
    free_path.restype = None

    path = ctypes.c_void_p()
    try:
        result = get_path(ctypes.byref(guid), 0, None, ctypes.byref(path))
        if result < 0 or not path.value:
            raise OSError(f"Could not locate the Windows Desktop (0x{result & 0xFFFFFFFF:08X}).")
        return Path(ctypes.wstring_at(path))
    finally:
        free_path(path)


def remove_factory_cube(scene):
    cube = scene.objects.get("Cube")
    if cube is None or cube.type != "MESH" or cube.data.name != "Cube":
        return

    corners = set(product((-1.0, 1.0), repeat=3))
    mesh = cube.data
    if (
        cube.matrix_world.is_identity
        and len(cube.users_scene) == 1
        and not cube.modifiers
        and cube.animation_data is None
        and len(mesh.vertices) == 8
        and len(mesh.edges) == 12
        and len(mesh.polygons) == 6
        and {tuple(vertex.co) for vertex in mesh.vertices} == corners
    ):
        bpy.data.objects.remove(cube, do_unlink=True)


def prepare_collection(scene):
    for collection in scene.collection.children:
        if collection.get(GENERATED):
            break
    else:
        collection = bpy.data.collections.new("Trillium")
        collection[GENERATED] = True
        scene.collection.children.link(collection)

    for obj in list(collection.objects):
        if obj.get(GENERATED):
            if len(obj.users_collection) == 1:
                bpy.data.objects.remove(obj, do_unlink=True)
            else:
                collection.objects.unlink(obj)

    for datablocks in (bpy.data.meshes, bpy.data.materials, bpy.data.images):
        for block in list(datablocks):
            if block.users == 0 and block.get(GENERATED):
                datablocks.remove(block)

    return collection


def linear_color(srgb):
    return tuple(c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in srgb)


def make_material(name, color, roughness, *, textures=None, double_sided=False):
    material = bpy.data.materials.new(name)
    material[GENERATED] = True
    if material.node_tree is None:
        material.use_nodes = True
    material.diffuse_color = (*linear_color(color), 1.0)
    material.use_backface_culling = not double_sided

    shader = material.node_tree.nodes.get("Principled BSDF")
    shader.inputs["Base Color"].default_value = material.diffuse_color
    shader.inputs["Metallic"].default_value = 0.0
    shader.inputs["Roughness"].default_value = roughness
    if textures is not None:
        nodes = material.node_tree.nodes
        links = material.node_tree.links
        color_texture = nodes.new("ShaderNodeTexImage")
        color_texture.image, color_texture.extension = textures[0], "EXTEND"
        color_texture.location = (-560, 280)
        links.new(color_texture.outputs["Color"], shader.inputs["Base Color"])
        normal_texture = nodes.new("ShaderNodeTexImage")
        normal_texture.image, normal_texture.extension = textures[1], "EXTEND"
        normal_texture.location = (-560, -40)
        normal_map = nodes.new("ShaderNodeNormalMap")
        normal_map.location = (-270, -40)
        links.new(normal_texture.outputs["Color"], normal_map.inputs["Color"])
        links.new(normal_map.outputs["Normal"], shader.inputs["Normal"])
    return material


def make_mesh(name, vertices, faces, material, uv=None):
    mesh = bpy.data.meshes.new(name)
    mesh[GENERATED] = True
    mesh.from_pydata(vertices, [], faces)
    mesh.materials.append(material)
    mesh.polygons.foreach_set("use_smooth", np.ones(len(faces), dtype=bool))
    if uv is not None:
        loop_vertices = np.empty(len(mesh.loops), dtype=np.int32)
        mesh.loops.foreach_get("vertex_index", loop_vertices)
        layer = mesh.uv_layers.new(name="Blade UV")
        layer.data.foreach_set("uv", uv[loop_vertices].astype(np.float32).ravel())
    mesh.update()
    return mesh


def smooth_noise(rng, t, s, columns, rows):
    grid = rng.random((rows + 1, columns + 1)) - 0.5
    x, y = t * columns, (s + 1.0) * (rows / 2)
    column = np.minimum(x.astype(int), columns - 1)
    row = np.minimum(y.astype(int), rows - 1)
    u, v = x - column, y - row
    u, v = u * u * (3 - 2 * u), v * v * (3 - 2 * v)
    bottom = grid[row, column] * (1 - u) + grid[row, column + 1] * u
    top = grid[row + 1, column] * (1 - u) + grid[row + 1, column + 1] * u
    return bottom * (1 - v) + top * v


def leaf_veins(t, s):
    across = np.abs(s)
    midrib = np.exp(-((s / (0.027 - 0.016 * t)) ** 2)) * (1 - 0.65 * t)
    branches = np.zeros_like(t)
    for index, start in enumerate((0.12, 0.23, 0.35, 0.47, 0.59, 0.70, 0.80)):
        curve = start + (0.18 - 0.014 * index) * across + 0.045 * across**2
        curve += 0.008 * s * np.sin(4.2 * s + index)
        width = (0.008 - 0.0004 * index) * (1 - 0.48 * across)
        strength = (0.92 - 0.07 * index) * (1 - 0.7 * across**1.4)
        branches += np.exp(-(((t - curve) / width) ** 2)) * strength
    return midrib, branches


def petal_veins(t, s):
    veins = np.zeros_like(t)
    for index, start in enumerate((-0.83, -0.63, -0.43, -0.22, 0.0, 0.21, 0.41, 0.62, 0.82)):
        curve = start * (0.90 + 0.10 * t) + 0.032 * t * np.sin(5 * t + index * 0.7)
        width = 0.020 - 0.008 * t
        veins += np.exp(-(((s - curve) / width) ** 2))
    return veins * np.sin(pi * t) ** 0.6 * (1 - 0.56 * t)


def pack_texture(name, rgb, colorspace):
    height, width, _ = rgb.shape
    pixels = np.ones((height, width, 4), dtype=np.float32)
    pixels[..., :3] = np.clip(rgb, 0, 1)
    image = bpy.data.images.new(name, width, height, alpha=False)
    image[GENERATED] = True
    image.colorspace_settings.name = colorspace
    image.pixels.foreach_set(pixels.ravel())
    image.update()
    image.pack()
    return image


def blade_textures(kind):
    width, height = 1024, 512
    t, s = np.meshgrid(np.linspace(0, 1, width), np.linspace(-1, 1, height))
    rng = np.random.default_rng(183 if kind == "Leaf" else 294)
    coarse = smooth_noise(rng, t, s, 8, 6)
    fine = smooth_noise(rng, t, s, 95, 70)
    grain = rng.random(t.shape) - 0.5
    if kind == "Leaf":
        midrib, branches = leaf_veins(t, s)
        base = np.array((0.27, 0.38, 0.16))
        shade = 0.105 * coarse + 0.027 * fine + 0.008 * grain
        shade += 0.038 * np.sin(pi * t) - 0.033 * s**4
        rib_color = np.array((0.26, 0.25, 0.10))
        veins = 0.56 * midrib + 0.20 * branches
        rgb = base + shade[..., None] + veins[..., None] * rib_color
        relief = 0.00035 * coarse + 0.000065 * fine + 0.00016 * branches
        length_m, width_m = 0.14, 0.092
    else:
        base = np.array((0.985, 0.973, 0.923))
        shade = 0.030 * coarse + 0.012 * fine + 0.004 * grain
        throat = np.exp(-((t / 0.24) ** 1.45))
        rgb = base + shade[..., None] - throat[..., None] * (0.15, 0.15, 0.39)
        veins = petal_veins(t, s)
        rgb -= veins[..., None] * (0.036, 0.040, 0.068)
        relief = 0.00018 * coarse + 0.000035 * fine + 0.000085 * veins
        length_m, width_m = 0.09, 0.068

    # Convert the surface relief to tangent-space normals in the blade UV frame.
    dv, du = np.gradient(relief, width_m / (height - 1), length_m / (width - 1))
    normal = np.stack((-du, -dv, np.ones_like(du)), axis=-1)
    normal /= np.linalg.norm(normal, axis=-1, keepdims=True)
    return (
        pack_texture(f"Trillium {kind} Color", rgb, "sRGB"),
        pack_texture(f"Trillium {kind} Normal", 0.5 * normal + 0.5, "Non-Color"),
    )


def make_blade(name, kind, length, half_width, rise, phase, material):
    rows, columns = 85, 45
    t, s = np.meshgrid(np.linspace(0, 1, rows), np.linspace(-1, 1, columns), indexing="ij")
    edge = np.abs(s)
    if kind == "Petal":
        outline = np.sin(pi * t**1.13) ** 0.86
        width = half_width * outline + 0.0038 * (1 - t)**12
        ripple = np.sin(25 * t + phase + 2 * s) + 0.35 * np.sin(57 * t - 3 * s)
        width *= 1 + 0.046 * ripple * t * edge**2
        height = 0.019 * (1 - np.exp(-7 * t)) - 0.009 * t + rise * t**3
        twist = -0.055 + 0.56 * sin(phase * 1.9) * t**1.6
        height += width * (0.27 * edge**1.8 + twist * s)
        height += 0.0033 * ripple * edge**3 * np.sin(pi * t)**0.65
        height += 0.00055 * petal_veins(t, s)
        root = 0.0032
    else:
        outline = np.sin(pi * t**0.79) ** 0.96
        width = half_width * outline + 0.0017 * (1 - t)**13
        ripple = np.sin(17 * t + phase + 2.4 * s) + 0.35 * np.sin(43 * t - 5 * s)
        width *= 1 + 0.044 * ripple * edge**2
        height = rise * t + 0.014 * np.sin(pi * t) - 0.014 * t**4
        height += width * (-0.25 * edge**1.5 + 0.12 * s * np.sin(4 * t + phase))
        height += 0.052 * width * ripple * edge**3
        midrib, branches = leaf_veins(t, s)
        height += width / half_width * (0.0012 * midrib + 0.00058 * branches)
        root = 0.0014
        if kind == "Sepal":
            height *= 0.48

    x = root + length * t - 0.10 * width * edge**2
    y = width * s + length * (0.038 * np.sin(pi * t + phase) * t + 0.032 * t**2)
    grid = np.stack((x, y, height), axis=-1)
    uv_grid = np.stack((t, (s + 1) / 2), axis=-1)
    # Use one vertex at the tip to keep the margins joined and the normals smooth.
    vertices = np.concatenate((grid[:-1].reshape(-1, 3), grid[-1, columns // 2:columns // 2 + 1]))
    uv = np.concatenate((uv_grid[:-1].reshape(-1, 2), ((1.0, 0.5),)))
    faces = []
    for row in range(rows - 2):
        for column in range(columns - 1):
            near = row * columns + column
            far = near + columns
            faces.append((near, far, far + 1, near + 1))
    last = (rows - 2) * columns
    tip = len(vertices) - 1
    faces.extend((last + col, tip, last + col + 1) for col in range(columns - 1))
    return make_mesh(name, vertices.tolist(), faces, material, uv)


def make_tube(name, stations, material, *, sides=16, lobes=0):
    points = [Vector(center) for center, _ in stations]
    vertices = []
    for index, (_, radius) in enumerate(stations):
        tangent = (points[min(index + 1, len(points) - 1)] - points[max(0, index - 1)]).normalized()
        u = tangent.cross(Vector((0, 1, 0))).normalized()
        v = tangent.cross(u)
        for side in range(sides):
            angle = tau * side / sides
            section_radius = radius * (1 + 0.09 * cos(lobes * angle)) if lobes else radius
            vertices.append(points[index] + section_radius * (cos(angle) * u + sin(angle) * v))

    last = len(vertices) - sides
    faces = [tuple(reversed(range(sides))), tuple(range(last, last + sides))]
    for start in range(0, last, sides):
        for side in range(sides):
            near = start + side
            following = start + (side + 1) % sides
            faces.append((near, following, following + sides, near + sides))
    mesh = make_mesh(name, vertices, faces, material)
    for cap in mesh.polygons[:2]:
        cap.use_smooth = False
    return mesh


def place_mesh(collection, mesh, location=(0, 0, 0), rotation=None):
    obj = bpy.data.objects.new(mesh.name, mesh)
    obj[GENERATED] = True
    collection.objects.link(obj)
    obj.location = location
    if rotation is not None:
        obj.rotation_euler = rotation.to_euler()
    return obj


def build_plant(collection):
    leaf = make_material("Leaf | Olive Green", (0.32, 0.44, 0.21), 0.48,
                         textures=blade_textures("Leaf"), double_sided=True)
    petal = make_material("Petal | Warm White", (0.985, 0.973, 0.923), 0.47,
                          textures=blade_textures("Petal"), double_sided=True)
    stem_green = make_material("Stem | Spring Green", (0.45, 0.56, 0.25), 0.47)
    sepal_green = make_material("Sepal | Yellow Green", (0.49, 0.54, 0.24), 0.53, double_sided=True)
    filament_ivory = make_material("Filament | Ivory", (0.86, 0.83, 0.52), 0.55)
    pollen_gold = make_material("Anther | Pollen Yellow", (0.91, 0.67, 0.20), 0.67)
    pistil_green = make_material("Pistil | Pale Green", (0.69, 0.75, 0.37), 0.51)

    stem_stations = [((0, 0, z), radius) for z, radius in (
        (0, 0.0035), (0.008, 0.0038), (0.09, 0.0036), (0.145, 0.0034),
        (0.159, 0.0046), (0.166, 0.0035), (0.22, 0.0029), (0.306, 0.0025),
        (STEM_HEIGHT, 0.0033),
    )]
    stem = place_mesh(collection, make_tube("Stem", stem_stations, stem_green, sides=48, lobes=5))
    for index, (length, width, rise, phase) in enumerate((
        (0.137, 0.046, -0.007, 0.2), (0.149, 0.052, 0.016, 1.8), (0.128, 0.043, 0.024, 3.6),
    )):
        angle = Matrix.Rotation(radians(15 + 120 * index), 3, "Z")
        mesh = make_blade(f"Leaf {index + 1}", "Leaf", length, width, rise, phase, leaf)
        place_mesh(collection, mesh, (0, 0, 0.159), angle)

    crown = Vector((0, 0, STEM_HEIGHT))
    tilt = Matrix.Rotation(radians(31), 3, "Y")
    for index, (length, width, rise, phase) in enumerate((
        (0.086, 0.034, 0.024, 0.7), (0.094, 0.034, 0.011, 2.4), (0.083, 0.032, -0.011, 3.9),
    )):
        angle = radians(42 + 120 * index)
        petal_rotation = tilt @ Matrix.Rotation(angle, 3, "Z")
        mesh = make_blade(f"Petal {index + 1}", "Petal", length, width, rise, phase, petal)
        place_mesh(collection, mesh, crown, petal_rotation)

        sepal_rotation = tilt @ Matrix.Rotation(angle + pi / 3, 3, "Z")
        mesh = make_blade(f"Sepal {index + 1}", "Sepal", 0.051 + 0.004 * index,
                          0.010, -0.009 + 0.013 * index, phase, sepal_green)
        place_mesh(collection, mesh, crown + tilt @ Vector((0, 0, -0.003)), sepal_rotation)

    cup = make_tube("Receptacle", [((0, 0, z), r) for z, r in (
        (-0.008, 0.0028), (-0.004, 0.0051), (0.0, 0.0091), (0.004, 0.0097), (0.007, 0.0062),
    )], sepal_green, sides=32, lobes=3)
    place_mesh(collection, cup, crown, tilt)
    ovary = make_tube("Ovary", [((0, 0, z), r) for z, r in (
        (0.003, 0.0034), (0.006, 0.0049), (0.011, 0.0045), (0.016, 0.0028), (0.018, 0.0018),
    )], pistil_green, sides=32, lobes=6)
    place_mesh(collection, ovary, crown, tilt)

    for index in range(6):
        angle = tau * index / 6 + 0.19
        rotate = tilt @ Matrix.Rotation(angle, 3, "Z")
        lean = (0.001, -0.0012, 0.002, -0.0007, 0.0016, -0.0003)[index]
        filament = make_tube(f"Filament {index + 1}", (
            ((0.005, 0, 0.005), 0.00086), ((0.0068, 0, 0.010), 0.00079),
            ((0.009 + lean / 2, 0, 0.015 + lean), 0.00067),
        ), filament_ivory)
        place_mesh(collection, filament, crown, rotate)
        anther = make_tube(f"Anther {index + 1}", (
            ((0.0088 + lean / 2, 0, 0.014 + lean), 0.00066),
            ((0.010 + lean / 2, 0, 0.0165 + lean), 0.00128),
            ((0.0118 + lean, 0.00025, 0.0225 + lean), 0.00116),
            ((0.0137 + lean, 0.0004, 0.0271 + lean), 0.00082),
            ((0.0142 + lean, 0.0004, 0.0281 + lean), 0.00029),
        ), pollen_gold, lobes=2)
        place_mesh(collection, anther, crown, rotate)

    for index in range(3):
        rotate = tilt @ Matrix.Rotation(tau * index / 3 + 0.55, 3, "Z")
        stigma = make_tube(f"Stigma {index + 1}", (
            ((0.0007, 0, 0.016), 0.00085), ((0.0017, 0, 0.022), 0.00072),
            ((0.0035, 0.0004, 0.027), 0.00064), ((0.0055, 0.0006, 0.029), 0.00067),
            ((0.0067, 0.0008, 0.0294), 0.00033),
        ), pistil_green)
        place_mesh(collection, stigma, crown, rotate)
    return stem


output_path = desktop_directory() / "stylized_flower.glb"
if not output_path.parent.is_dir():
    raise FileNotFoundError(f"Desktop folder does not exist: {output_path.parent}")
if bpy.context.mode != "OBJECT":
    raise RuntimeError("Switch to Object Mode before running the Trillium generator.")

scene = bpy.context.scene
remove_factory_cube(scene)
collection = prepare_collection(scene)

stem = build_plant(collection)

bpy.context.view_layer.update()
for obj in bpy.context.selected_objects:
    obj.select_set(False)
for obj in collection.objects:
    if obj.get(GENERATED):
        obj.select_set(True)
bpy.context.view_layer.objects.active = stem

bpy.ops.export_scene.gltf(
    filepath=str(output_path),
    export_format="GLB",
    use_selection=True,
    export_yup=True,
    export_cameras=False,
    export_lights=False,
    export_animations=False,
)
