import {
  BoxGeometry,
  CanvasTexture,
  CapsuleGeometry,
  CircleGeometry,
  CatmullRomCurve3,
  CylinderGeometry,
  ExtrudeGeometry,
  Group,
  LatheGeometry,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  ShadowMaterial,
  Shape,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  TubeGeometry,
  Vector2,
  Vector3,
} from "three";

import { CARD_HALF_WIDTH, DOMAINS } from "./domains";

/* ---------------------------------------------------------------------- */
/* The robot-sign model                                                    */
/*                                                                         */
/* Ported from "Robot sign three.js model/Robot Sign.html". Geometry,      */
/* proportions and naming are the model author's (units are metres, y-up, */
/* the pedestal's underside on y = 0). What changed for the site:          */
/*   - the pedestal has its own material, so it can go light in day theme  */
/*     while the elbows, wrists and neck stay dark metal;                  */
/*   - the glass tiles are gone: each programme is a labelled DOM card     */
/*     (drawn by the scene), and the model keeps only the wires to them,   */
/*     one per programme from domains.js, each with its own material so    */
/*     the one being presented can light up on its own;                    */
/*   - the sign face is a canvas the scene redraws per programme;          */
/*   - the flow pulses are four meshes the scene moves along whichever     */
/*     wire is active, instead of three permanently on every wire;         */
/*   - a shadow-catcher plane, since the page shows through the canvas.    */
/* ---------------------------------------------------------------------- */

const V = (x, y, z) => new Vector3(x, y, z);

function rrShape(w, h, r) {
  const s = new Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function canvasTexture(width, height, draw) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const g = canvas.getContext("2d");
  draw(g, width, height);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return { texture, canvas, g };
}

export function buildRobotSign() {
  const model = new Group();
  model.name = "robot_sign";

  const M = {
    shell: new MeshStandardMaterial({ name: "shell_white", color: 0xe9e4f2, roughness: 0.28, metalness: 0.05 }),
    purple: new MeshStandardMaterial({ name: "accent_purple", color: 0x7b3fe4, roughness: 0.3, metalness: 0.2 }),
    dark: new MeshStandardMaterial({ name: "dark_metal", color: 0x2a2238, roughness: 0.35, metalness: 0.35 }),
    plinth: new MeshStandardMaterial({ name: "plinth", color: 0x2a2238, roughness: 0.3, metalness: 0.35 }),
    visor: new MeshStandardMaterial({ name: "visor_black", color: 0x08060c, roughness: 0.08, metalness: 0.2 }),
    glow: new MeshStandardMaterial({ name: "glow", color: 0xf3e8ff, emissive: 0xc98bff, emissiveIntensity: 1.6, roughness: 0.4 }),
    neon: new MeshStandardMaterial({ name: "neon_purple", color: 0xb46bff, emissive: 0x9d4dff, emissiveIntensity: 1.4, roughness: 0.4 }),
    glass: new MeshStandardMaterial({ name: "glass_panel", color: 0x2a1846, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.72 }),
  };

  function add(name, geometry, material, position, parent = model) {
    const mesh = new Mesh(geometry, material);
    mesh.name = name;
    if (position) mesh.position.copy(position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }

  /* Horizontal rounded slab whose top face sits at y. */
  function slab(name, w, d, h, r, y, material, bevel = 0.01) {
    const g = new ExtrudeGeometry(rrShape(w - 2 * bevel, d - 2 * bevel, r), {
      depth: h - 2 * bevel,
      bevelEnabled: true,
      bevelSize: bevel,
      bevelThickness: bevel,
      bevelSegments: 4,
      curveSegments: 12,
    });
    g.rotateX(-Math.PI / 2);
    g.translate(0, y - h + bevel, 0);
    return add(name, g, material);
  }

  /* Neon strip around a rounded rectangle. */
  function ringLine(name, w, d, r, y, t, material) {
    const points = rrShape(w, d, r).getSpacedPoints(160).map((p) => V(p.x, y, -p.y));
    return add(name, new TubeGeometry(new CatmullRomCurve3(points, true), 160, t, 8, true), material);
  }

  function limb(name, a, b, r, material, parent = model) {
    const dir = b.clone().sub(a);
    const length = dir.length();
    const mesh = add(
      name,
      new CapsuleGeometry(r, Math.max(length - 2 * r, 0.001), 8, 24),
      material,
      a.clone().add(b).multiplyScalar(0.5),
      parent,
    );
    mesh.quaternion.setFromUnitVectors(V(0, 1, 0), dir.normalize());
    return mesh;
  }

  /* ---------- pedestal ---------- */
  slab("base_lower", 1.0, 0.9, 0.07, 0.1, 0.07, M.plinth, 0.015);
  /* The model had these strips at y 0.05 and 0.12, inside the slabs they
     outline, where they never showed. They sit on each top face instead. */
  ringLine("base_neon", 0.93, 0.83, 0.08, 0.073, 0.006, M.neon);
  slab("base_upper", 0.78, 0.7, 0.06, 0.08, 0.13, M.plinth, 0.012);
  ringLine("base_upper_neon", 0.72, 0.64, 0.07, 0.133, 0.005, M.neon);
  add("plinth", new CylinderGeometry(0.2, 0.29, 0.09, 64), M.plinth, V(0, 0.175, 0));
  add("plinth_neon", new TorusGeometry(0.29, 0.005, 8, 96).rotateX(Math.PI / 2), M.neon, V(0, 0.132, 0));
  add("plinth_cap", new CylinderGeometry(0.19, 0.2, 0.02, 64), M.shell, V(0, 0.23, 0));

  /* ---------- body ---------- */
  const bodyProfile = [
    [0, 0.24], [0.12, 0.24], [0.15, 0.27], [0.17, 0.34], [0.175, 0.42],
    [0.165, 0.5], [0.14, 0.56], [0.09, 0.585], [0, 0.59],
  ].map(([x, y]) => new Vector2(x, y));
  add("torso", new LatheGeometry(bodyProfile, 64), M.shell);
  add("waist_band", new TorusGeometry(0.135, 0.012, 12, 64).rotateX(Math.PI / 2), M.purple, V(0, 0.255, 0));

  const core = new Group();
  core.name = "chest_core";
  core.position.set(0, 0.44, 0.168);
  core.rotation.x = -0.05;
  model.add(core);
  add("core_ring", new TorusGeometry(0.052, 0.013, 16, 64), M.purple, V(0, 0, 0), core);
  add("core_rim", new CylinderGeometry(0.062, 0.062, 0.01, 64).rotateX(Math.PI / 2), M.dark, V(0, 0, -0.006), core);
  add("core_light", new SphereGeometry(0.042, 32, 16).scale(1, 1, 0.45), M.glow, V(0, 0, 0.004), core);
  add("neck", new CylinderGeometry(0.06, 0.075, 0.05, 32), M.dark, V(0, 0.6, 0));

  /* ---------- head ---------- */
  const head = new Group();
  head.name = "head";
  head.position.set(0, 0.78, 0);
  model.add(head);
  add("head_shell", new SphereGeometry(0.2, 64, 48).scale(1.12, 0.95, 1), M.shell, V(0, 0, 0), head);
  add("visor", new SphereGeometry(0.15, 64, 32).scale(1.05, 0.72, 0.6), M.visor, V(0, -0.01, 0.12), head);
  const eyes = [];
  for (const s of [-1, 1]) {
    const k = s < 0 ? "L" : "R";
    eyes.push(add(`eye_${k}`, new SphereGeometry(0.034, 32, 16).scale(0.85, 1, 0.4), M.glow, V(s * 0.052, -0.005, 0.205), head));
    add(`ear_${k}`, new CylinderGeometry(0.055, 0.06, 0.04, 48).rotateZ(Math.PI / 2), M.purple, V(s * 0.222, 0, 0), head);
    add(`ear_ring_${k}`, new TorusGeometry(0.035, 0.007, 12, 48).rotateY(Math.PI / 2), M.neon, V(s * 0.244, 0, 0), head);
    add(`ear_cap_${k}`, new CylinderGeometry(0.03, 0.03, 0.01, 32).rotateZ(Math.PI / 2), M.shell, V(s * 0.243, 0, 0), head);
  }
  add("antenna_base", new CylinderGeometry(0.02, 0.028, 0.02, 24), M.dark, V(0, 0.19, 0), head);
  add("antenna", new CylinderGeometry(0.005, 0.005, 0.08, 12), M.dark, V(0, 0.235, 0), head);
  add("antenna_light", new SphereGeometry(0.022, 24, 16), M.glow, V(0, 0.285, 0), head);

  /* ---------- arms, raised, holding the sign ---------- */
  for (const s of [-1, 1]) {
    const k = s < 0 ? "L" : "R";
    const sh = V(s * 0.2, 0.51, 0);
    const el = V(s * 0.33, 0.75, 0.02);
    const wr = V(s * 0.37, 1.0, 0.03);
    add(`shoulder_${k}`, new SphereGeometry(0.068, 40, 24), M.purple, sh);
    limb(`upper_arm_${k}`, sh.clone().lerp(el, 0.22), el.clone().lerp(sh, 0.14), 0.048, M.shell);
    add(`elbow_${k}`, new SphereGeometry(0.04, 32, 20), M.dark, el);
    limb(`forearm_${k}`, el.clone().lerp(wr, 0.15), wr.clone().lerp(el, 0.12), 0.045, M.shell);
    add(`wrist_${k}`, new SphereGeometry(0.032, 32, 20), M.dark, wr);
    const hand = new Group();
    hand.name = `hand_${k}`;
    hand.position.copy(wr).add(V(0, 0.05, 0));
    model.add(hand);
    add(`palm_${k}`, new BoxGeometry(0.06, 0.05, 0.04), M.shell, V(0, 0, 0), hand);
    for (let i = 0; i < 3; i++) {
      limb(`finger_${k}${i}`, V(-0.02 + i * 0.02, 0.02, 0.01), V(-0.02 + i * 0.02, 0.07, 0.012), 0.008, M.shell, hand);
    }
    limb(`thumb_${k}`, V(-s * 0.03, 0.0, 0.015), V(-s * 0.04, 0.05, 0.03), 0.009, M.shell, hand);
  }

  /* ---------- sign ---------- */
  const sign = new Group();
  sign.name = "sign";
  sign.position.set(0, 1.34, 0.03);
  model.add(sign);
  const SW = 1.3;
  const SH = 0.44;
  const SD = 0.03;
  const signGeometry = new ExtrudeGeometry(rrShape(SW, SH, 0.04), {
    depth: SD,
    bevelEnabled: true,
    bevelSize: 0.006,
    bevelThickness: 0.006,
    bevelSegments: 3,
    curveSegments: 12,
  });
  signGeometry.translate(0, 0, -SD / 2);
  add("sign_glass", signGeometry, M.glass, V(0, 0, 0), sign);
  const edge = rrShape(SW + 0.004, SH + 0.004, 0.042).getSpacedPoints(200).map((p) => V(p.x, p.y, SD / 2 + 0.002));
  add("sign_neon_edge", new TubeGeometry(new CatmullRomCurve3(edge, true), 200, 0.005, 8, true), M.neon, V(0, 0, 0), sign);

  /* Blank until the scene draws the first programme into it. */
  const face = canvasTexture(2600, 880, () => {});
  const faceMaterial = new MeshStandardMaterial({
    name: "sign_face",
    map: face.texture,
    emissiveMap: face.texture,
    emissive: 0xffffff,
    emissiveIntensity: 0.9,
    transparent: true,
    roughness: 0.5,
  });
  add("sign_face", new PlaneGeometry(SW - 0.04, SH - 0.04 * (SH / SW)), faceMaterial, V(0, 0, SD / 2 + 0.008), sign);

  /* ---------- circuit wires out to the programme cards ---------- */
  /* The cards themselves are DOM, laid over the canvas by the scene; the
     model only draws the wires that connect them to the chest core. */
  const CORE_END = (s) => V(s * 0.06, 0.44, 0.18);
  const wires = [];

  DOMAINS.forEach((domain, i) => {
    /* Each wire ends just outside its card's inner edge, level with the
       card's middle, so its end dot sits against the card rather than
       disappearing underneath it. */
    const side = Math.sign(domain.position[0]);
    const start = V(
      domain.position[0] - side * (CARD_HALF_WIDTH + 0.02),
      domain.position[1],
      domain.position[2],
    );
    const end = CORE_END(side);
    /* Two waypoints following the model's original hand-drawn curves: most
       of the height change happens early, then the wire runs in level with
       the core. */
    const a = V(
      start.x + (end.x - start.x) * 0.4,
      start.y + (end.y - start.y) * 0.45,
      start.z + (end.z - start.z) * 0.4,
    );
    const b = V(
      start.x + (end.x - start.x) * 0.75,
      end.y + (start.y - end.y) * 0.12,
      start.z + (end.z - start.z) * 0.75,
    );
    const curve = new CatmullRomCurve3([start, a, b, end]);
    const wireMaterial = M.neon.clone();
    add(`circuit_line_${i}`, new TubeGeometry(curve, 64, 0.0035, 8, false), wireMaterial).castShadow = false;
    for (const [j, u] of [0, 0.4].entries()) {
      add(`circuit_node_${i}_${j}`, new SphereGeometry(0.012, 16, 12), M.glow, curve.getPoint(u)).castShadow = false;
    }
    wires.push({ curve, material: wireMaterial });
  });

  /* Flow pulses, moved along the active wire by the scene. */
  const pulses = [];
  for (let j = 0; j < 4; j++) {
    const pulse = add(`flow_pulse_${j}`, new SphereGeometry(0.009, 16, 12), M.glow);
    pulse.castShadow = false;
    pulses.push(pulse);
  }

  /* The page shows through the canvas, so rather than a floor, a plane that
     renders nothing but the shadow falling on it. */
  const ground = new Mesh(new CircleGeometry(1.1, 64), new ShadowMaterial({ opacity: 0.2 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  model.add(ground);

  return { model, M, head, eyes, face: { ...face, material: faceMaterial }, wires, pulses, ground };
}

/* Free everything the model allocated when the scene unmounts. */
export function disposeRobotSign(model) {
  model.traverse((object) => {
    if (!object.isMesh) return;
    object.geometry?.dispose();
    const materials = Array.isArray(object.material) ? object.material : [object.material];
    for (const material of materials) {
      material?.map?.dispose();
      material?.dispose();
    }
  });
}
