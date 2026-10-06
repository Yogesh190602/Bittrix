import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  AdditiveBlending,
  CanvasTexture,
  Color,
  MathUtils,
  PMREMGenerator,
  Sprite,
  SpriteMaterial,
  Vector3,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

import { Icon } from "../ui";
import { buildRobotSign, disposeRobotSign } from "./buildRobotSign";
import { CARD_HALF_WIDTH, DOMAINS } from "./domains";
import { drawSignFace } from "./signFace";

/* ---------------------------------------------------------------------- */
/* Robot sign hero                                                         */
/*                                                                         */
/* The robot-sign model, presenting the six programmes one at a time: the  */
/* sign face names the programme, its tile lifts and brightens, and pulses */
/* run out along its wire from the chest core.                             */
/* ---------------------------------------------------------------------- */

const DWELL_MS = 3200;
const lerp = MathUtils.lerp;
const SWAP_MS = 340;
/* Longer than the hero's cross-fade from its still to the canvas (.hero3d). */
const POSTER_HOLD_MS = 900;

const c = (hex) => new Color(hex);

/* Night is the model as authored. Day moves the whole robot onto the site's
   plum and cream: cream plinth and glass, plum icons, neon and accents. */
const THEME = {
  light: {
    plinth: c("#efe2bc"), glass: c("#fffbea"), glassOpacity: 0.88,
    faceGlow: 0.35, neonGlow: 0.9, glowGlow: 1.25, halo: 0.14, shadow: 0.18,
    neon: c("#7b3fa8"), neonEmissive: c("#6e3196"), accent: c("#5a2780"),
    ambient: c("#fffaf0"), ambientI: 1.25, key: c("#fff8e8"), keyI: 2.1,
    rim: c("#b78fd6"), rimI: 1.0, sky: c("#fffaf0"), ground: c("#efe2bc"),
  },
  /* Night follows the site: plum-black plinth and glass, lilac neon from
     the plum hue, a warm cream key light, and the active tile inverted to
     cream with a plum icon, like the night buttons. */
  dark: {
    plinth: c("#241430"), glass: c("#231233"), glassOpacity: 0.78,
    faceGlow: 0.9, neonGlow: 1.35, glowGlow: 1.6, halo: 0.5, shadow: 0.35,
    neon: c("#c9a2e6"), neonEmissive: c("#9b6cc4"), accent: c("#6e3196"),
    ambient: c("#3a2248"), ambientI: 0.9, key: c("#f3e6c8"), keyI: 1.6,
    rim: c("#c9a2e6"), rimI: 2.6, sky: c("#5a3278"), ground: c("#150a1e"),
  },
};
const mixC = (target, key, t) => target.lerpColors(THEME.light[key], THEME.dark[key], t);
const mixN = (key, t) => MathUtils.lerp(THEME.light[key], THEME.dark[key], t);

/* A soft radial falloff, shared by the halos on the glowing parts. */
function glowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const g = canvas.getContext("2d");
  const gradient = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.25, "rgba(255,255,255,0.5)");
  gradient.addColorStop(0.6, "rgba(255,255,255,0.12)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gradient;
  g.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

/* ------------------------------------------------------------------ */

function Studio() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useLayoutEffect(() => {
    const pmrem = new PMREMGenerator(gl);
    const target = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = target.texture;
    scene.environmentIntensity = 0.45;
    return () => {
      scene.environment = null;
      target.texture.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

function Lights({ mix }) {
  const ambient = useRef();
  const key = useRef();
  const rim = useRef();
  const hemi = useRef();

  useFrame(() => {
    const t = mix.current;
    if (ambient.current) {
      mixC(ambient.current.color, "ambient", t);
      ambient.current.intensity = mixN("ambientI", t);
    }
    if (key.current) {
      mixC(key.current.color, "key", t);
      key.current.intensity = mixN("keyI", t);
    }
    if (rim.current) {
      mixC(rim.current.color, "rim", t);
      rim.current.intensity = mixN("rimI", t);
    }
    if (hemi.current) {
      mixC(hemi.current.color, "sky", t);
      mixC(hemi.current.groundColor, "ground", t);
    }
  });

  return (
    <>
      <ambientLight ref={ambient} />
      <hemisphereLight ref={hemi} intensity={0.6} />
      <directionalLight
        ref={key}
        position={[1.6, 3.2, 2.2]}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-camera-left={-1.6}
        shadow-camera-right={1.6}
        shadow-camera-top={2}
        shadow-camera-bottom={-0.4}
        shadow-camera-near={0.5}
        shadow-camera-far={8}
      />
      <pointLight ref={rim} position={[-1.1, 1.6, -1.4]} distance={6} decay={1.5} />
    </>
  );
}

/* Front-on, drifting a little with scroll and pointer rather than orbiting:
   the sign has to stay readable. */
function Rig({ progress, pointer, still }) {
  const { camera } = useThree();
  const target = useMemo(() => new Vector3(0, 0.8, 0), []);
  const current = useRef({ azimuth: 0, elevation: 0.42, distance: 3.5 });
  /* For its first moments the camera holds the pose the hero's still was
     rendered in (the resting pose), so the cross-fade from the still to the
     live scene has no seam at any screen size. Then it eases to wherever
     scroll and pointer put it. */
  const firstFrameAt = useRef(null);

  useFrame((_, delta) => {
    firstFrameAt.current ??= performance.now();
    const holding = performance.now() - firstFrameAt.current < POSTER_HOLD_MS;
    const rest = still || holding;
    const p = rest ? 0.5 : (progress?.get?.() ?? 0.5);
    const px = rest ? 0 : pointer.current.x;
    const py = rest ? 0 : pointer.current.y;
    const want = {
      azimuth: lerp(-0.1, 0.1, p) + px * 0.07,
      elevation: 0.42 - py * 0.08,
      distance: lerp(3.62, 3.42, Math.sin(p * Math.PI)),
    };
    for (const k of Object.keys(want)) {
      current.current[k] = rest ? want[k] : MathUtils.damp(current.current[k], want[k], 3.2, delta);
    }
    const { azimuth: a, elevation: e, distance: d } = current.current;
    camera.position.set(Math.sin(a) * d, target.y + e, Math.cos(a) * d);
    camera.lookAt(target);
  });

  return null;
}

/* ------------------------------------------------------------------ */

/* The cards are sized from the canvas width, which only the scene knows.
   Publishing it as a CSS variable on the canvas wrapper the cards live in
   keeps each card a fixed share of the canvas, so it stays the same size in
   the world and its wire keeps meeting its edge. */
function SizeSync() {
  const gl = useThree((s) => s.gl);
  const width = useThree((s) => s.size.width);
  useEffect(() => {
    gl.domElement.parentElement?.style.setProperty("--hero-w", `${width}px`);
  }, [gl, width]);
  return null;
}

/* Where an anchor lands on the canvas. Placed straight onto its point, a
   card near an edge would hang part-way out of the canvas and be clipped,
   so the point is clamped back into frame. */
const projected = new Vector3();
function clampedPosition(object, camera, size) {
  object.updateWorldMatrix(true, false);
  projected.setFromMatrixPosition(object.matrixWorld).project(camera);
  const halfW = size.width / 2;
  const halfH = size.height / 2;
  const marginX = Math.min(size.width * 0.15, halfW - 4);
  return [
    MathUtils.clamp(projected.x * halfW + halfW, marginX, size.width - marginX),
    MathUtils.clamp(-projected.y * halfH + halfH, 24, size.height - 24),
  ];
}

/* The wires end where a full card’s inner edge would be. An icon-only card
   is far narrower, so it slides inward to put its own edge back on the wire
   instead of leaving a stretch of wire leading to nothing. */
const COMPACT_HALF_WIDTH = 0.13;
function compactPosition(domain) {
  const [x, y, z] = domain.position;
  const side = Math.sign(x);
  return [x - side * (CARD_HALF_WIDTH + 0.02 - COMPACT_HALF_WIDTH), y, z];
}

/* The programme cards: icon, caption and name, as on the old hero. DOM
   rather than rendered text so they stay crisp and take the site's theme
   tokens. Below ~480px of canvas the full card would crowd the robot, so
   it drops to the icon alone.

   The scene's renderer cannot hold DOM, so the cards get a small React root
   of their own beside the canvas, and every frame moves each card to where
   its anchor lands on screen. (This used to be drei's <Html>; drei was the
   only reason to load a library several times the size of the scene.) */
function DomainCards({ active }) {
  const gl = useThree((s) => s.gl);
  const width = useThree((s) => s.size.width);
  const compact = width < 480;
  const anchors = useRef([]);
  const cards = useRef([]);
  const root = useRef(null);

  /* Runs before the effect below in the same commit, so the first render
     always finds the root. */
  useLayoutEffect(() => {
    const host = document.createElement("div");
    host.className = "hero3d-cards";
    gl.domElement.parentElement.appendChild(host);
    const cardsRoot = createRoot(host);
    root.current = cardsRoot;
    return () => {
      /* React warns about unmounting a root in the middle of a render, so
         let the current one finish first. */
      setTimeout(() => {
        cardsRoot.unmount();
        host.remove();
      });
    };
  }, [gl]);

  useLayoutEffect(() => {
    root.current?.render(
      DOMAINS.map((domain, i) => (
        <span
          key={domain.id}
          ref={(el) => {
            cards.current[i] = el;
          }}
          className="hero3d-overlay"
        >
          <span
            className={`robot-card${compact ? " is-compact" : ""}${i === active ? " is-active" : ""}`}
            style={{ animationDelay: `${i * -0.9}s` }}
            aria-hidden="true"
          >
            <span className="robot-card-icon"><Icon name={domain.icon} size={20} /></span>
            {!compact && (
              <span className="robot-card-text">
                <small>{domain.kicker}</small>
                <strong>{domain.name}</strong>
              </span>
            )}
          </span>
        </span>
      )),
    );
  }, [gl, active, compact]);

  useFrame(({ camera, size }) => {
    for (let i = 0; i < DOMAINS.length; i++) {
      const anchor = anchors.current[i];
      const card = cards.current[i];
      if (!anchor || !card) continue;
      const [x, y] = clampedPosition(anchor, camera, size);
      card.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    }
  });

  return DOMAINS.map((domain, i) => (
    <group
      key={domain.id}
      ref={(el) => {
        anchors.current[i] = el;
      }}
      position={compact ? compactPosition(domain) : domain.position}
    />
  ));
}

/* ------------------------------------------------------------------ */

function RobotSign({ theme, pointer, still }) {
  const invalidate = useThree((s) => s.invalidate);
  const robot = useMemo(() => buildRobotSign(), []);

  /* Soft halos on the parts that glow — eyes, antenna and chest core — so
     they read as light sources on the dark stage. */
  const halos = useMemo(() => {
    const texture = glowTexture();
    const make = (parent, position, size, strength) => {
      const sprite = new Sprite(
        new SpriteMaterial({ map: texture, transparent: true, depthWrite: false, blending: AdditiveBlending, color: 0xb86bff }),
      );
      sprite.position.copy(position);
      sprite.scale.setScalar(size);
      parent.add(sprite);
      return { sprite, strength };
    };
    const head = robot.head;
    const core = robot.model.getObjectByName("chest_core");
    return [
      make(core, new Vector3(0, 0, 0.05), 0.36, 1),
      make(head, new Vector3(0, 0.285, 0.02), 0.13, 0.8),
      make(head, new Vector3(-0.052, -0.005, 0.23), 0.14, 0.7),
      make(head, new Vector3(0.052, -0.005, 0.23), 0.14, 0.7),
    ];
  }, [robot]);

  useEffect(() => () => disposeRobotSign(robot.model), [robot]);

  const mix = useRef(theme === "dark" ? 1 : 0);
  const [active, setActive] = useState(0);

  /* One programme at a time. Paused under reduced motion, where content that
     changes itself on a timer is what the setting asks against. */
  useEffect(() => {
    if (still) return undefined;
    const id = window.setInterval(() => setActive((i) => (i + 1) % DOMAINS.length), DWELL_MS);
    return () => window.clearInterval(id);
  }, [still]);

  /* The sign is drawn inside the canvas, so nothing in the DOM says which
     programme is up. Mirror it onto the wrapper for tests and debugging. */
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    const wrapper = gl.domElement.parentElement;
    if (wrapper) wrapper.dataset.programme = DOMAINS[active].id;
  }, [gl, active]);

  /* Redraw the sign face whenever the programme or the theme changes. */
  const swapAt = useRef(-Infinity);
  useEffect(() => {
    const { g, canvas, texture } = robot.face;
    drawSignFace(g, canvas.width, canvas.height, DOMAINS[active], theme);
    texture.needsUpdate = true;
    swapAt.current = performance.now();
    /* Under reduced motion the loop only runs on request. */
    invalidate();
  }, [active, theme, robot, invalidate]);

  const strength = useRef(DOMAINS.map(() => 0));
  const blink = useRef({ next: 2.4, closing: 0 });

  useFrame(({ clock }, delta) => {
    const target = theme === "dark" ? 1 : 0;
    mix.current = still ? target : MathUtils.damp(mix.current, target, 6, delta);
    const t = mix.current;
    const time = clock.elapsedTime;
    const { M } = robot;

    mixC(M.plinth.color, "plinth", t);
    mixC(M.glass.color, "glass", t);
    M.glass.opacity = mixN("glassOpacity", t);
    M.neon.emissiveIntensity = mixN("neonGlow", t);
    mixC(M.neon.color, "neon", t);
    mixC(M.neon.emissive, "neonEmissive", t);
    mixC(M.purple.color, "accent", t);
    const pulse = still ? 1 : 0.88 + Math.sin(time * 1.6) * 0.12;
    M.glow.emissiveIntensity = mixN("glowGlow", t) * pulse;
    robot.ground.material.opacity = mixN("shadow", t);

    /* Sign face: glows at the theme's level, and eases in after each swap.
       It never starts from zero — the old text is already gone, so fading
       up from nothing would leave the sign blank for a moment. */
    const face = robot.face.material;
    face.emissiveIntensity = mixN("faceGlow", t);
    const since = (performance.now() - swapAt.current) / SWAP_MS;
    const eased = 1 - (1 - MathUtils.clamp(since, 0, 1)) ** 3;
    face.opacity = still ? 1 : 0.25 + 0.75 * eased;

    const neon = mixN("neonGlow", t);
    robot.wires.forEach((wire, i) => {
      const want = i === active ? 1 : 0;
      const s = still ? want : MathUtils.damp(strength.current[i], want, 6, delta);
      strength.current[i] = s;
      mixC(wire.material.color, "neon", t);
      mixC(wire.material.emissive, "neonEmissive", t);
      wire.material.emissiveIntensity = neon * (0.5 + 1.0 * s);
    });

    /* Pulses run from the chest core out to the active programme's card. */
    const curve = robot.wires[active].curve;
    robot.pulses.forEach((p, j) => {
      const u = still ? (j + 0.5) / robot.pulses.length : (time * 0.45 + j / robot.pulses.length) % 1;
      p.position.copy(curve.getPoint(1 - u));
      p.scale.setScalar(0.6 + Math.sin(u * Math.PI) * 0.8);
    });

    const haloOpacity = mixN("halo", t);
    for (const { sprite, strength: k } of halos) sprite.material.opacity = haloOpacity * k * pulse;

    if (still) return;

    /* The head follows the pointer, clamped so the antenna stays under the
       sign's bottom edge. */
    const head = robot.head;
    head.rotation.y = MathUtils.damp(head.rotation.y, MathUtils.clamp(pointer.current.x * 0.34, -0.3, 0.3), 3.4, delta);
    head.rotation.x = MathUtils.damp(head.rotation.x, MathUtils.clamp(pointer.current.y * 0.12, -0.08, 0.1), 3.4, delta);

    /* Blink at irregular intervals. */
    const b = blink.current;
    b.next -= delta;
    if (b.next <= 0) {
      b.closing = 1;
      b.next = 2.6 + Math.random() * 3.4;
    }
    if (b.closing > 0) {
      b.closing = Math.max(0, b.closing - delta * 7.5);
      const shut = Math.sin((1 - b.closing) * Math.PI);
      for (const eye of robot.eyes) eye.scale.y = 1 - shut * 0.9;
    }
  });

  return (
    <>
      <primitive object={robot.model} />
      <DomainCards active={active} />
    </>
  );
}

/* ------------------------------------------------------------------ */

function Scene({ theme, progress, pointer, still }) {
  const mix = useRef(theme === "dark" ? 1 : 0);
  useFrame((_, delta) => {
    const target = theme === "dark" ? 1 : 0;
    mix.current = still ? target : MathUtils.damp(mix.current, target, 6, delta);
  });

  return (
    <>
      <Studio />
      <SizeSync />
      <Lights mix={mix} />
      <Rig progress={progress} pointer={pointer} still={still} />
      <RobotSign theme={theme} pointer={pointer} still={still} />
    </>
  );
}

export default function RobotSignScene({
  theme,
  progress,
  still = false,
  paused = false,
  quality = "high",
  onReady,
}) {
  const pointer = useRef({ x: 0, y: 0 });

  return (
    <Canvas
      className="hero3d-canvas"
      /* The model was authored without tone mapping; keep its colours. */
      flat
      shadows={quality !== "low"}
      dpr={[1, quality === "low" ? 1.5 : 2]}
      /* Scrolled past the hero there is nothing to look at, so stop drawing. */
      frameloop={still ? "demand" : paused ? "never" : "always"}
      camera={{ fov: 34, near: 0.05, far: 30, position: [0, 1.22, 3.5] }}
      gl={{ antialias: quality !== "low", alpha: true, powerPreference: "high-performance" }}
      onCreated={onReady}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        pointer.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.current.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      }}
      onPointerLeave={() => {
        pointer.current.x = 0;
        pointer.current.y = 0;
      }}
    >
      <Scene theme={theme} progress={progress} pointer={pointer} still={still} />
    </Canvas>
  );
}
