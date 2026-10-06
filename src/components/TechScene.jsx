import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useTheme } from "../lib/theme";

/* three.js and react-three-fiber are a large dependency for a single scene,
   so they load in their own chunk (hinted from the home page's HTML so it
   downloads alongside the main bundle). Until the scene is up, the square
   shows a still of it; the canvas then fades in over the still. Without
   WebGL the still is all there is. */
/* The robot-sign scene. (The previous robot is archived outside the project
   in bittrix-technologies-archive/hero-backup, with notes on restoring it.) */
const HeroScene = lazy(() => import("./robot-sign/RobotSignScene"));

/* ---------------------------------------------------------------------- */

/* One probe, cached: creating a throwaway context per mount is wasteful and
   some drivers cap how many live contexts a page may hold. */
let webglSupport = null;
function supportsWebGL() {
  if (webglSupport !== null) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    webglSupport = Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

/* A phone on a shared connection should not be asked to run the full scene.
   These are coarse signals, but they only pick the quality tier. */
function pickQuality() {
  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (cores <= 4 || memory <= 4) return "low";
  return coarse ? "medium" : "high";
}

export function TechScene() {
  const sceneRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const theme = useTheme();

  const [enabled, setEnabled] = useState(false);
  const [quality, setQuality] = useState("high");
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!supportsWebGL()) return;
    setQuality(pickQuality());
    setEnabled(true);
  }, []);

  /* Stop the render loop once the hero has left the viewport. */
  useEffect(() => {
    const node = sceneRef.current;
    if (!node || !enabled) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { rootMargin: "120px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled]);

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ["start end", "end start"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.7,
  });

  /* The ring still parallaxes in CSS: it sits outside the canvas and gives
     the scene an outer edge to read against. */
  const backgroundY = useTransform(progress, [0, 1], [-35, 55]);
  const ringRotation = useTransform(progress, [0, 1], [-35, 110]);

  return (
    <div ref={sceneRef} className="hero-scroll-stage">
      <motion.div
        aria-hidden="true"
        className="scroll-depth-ring"
        style={reduceMotion ? undefined : { y: backgroundY, rotate: ringRotation }}
      />

      <div className={`hero3d ${ready ? "is-live" : ""}`} aria-hidden="true">
        {/* A still of the scene's first frame, there from the first paint.
            The live canvas fades in over it, so the robot is on screen while
            three.js loads, and stays there without WebGL. */}
        <div className="hero3d-poster" />
        {enabled && (
          <Suspense fallback={null}>
            <HeroScene
              theme={theme}
              progress={progress}
              still={Boolean(reduceMotion)}
              paused={paused}
              quality={quality}
              onReady={() => setReady(true)}
            />
          </Suspense>
        )}
      </div>

    </div>
  );
}

/* The two floating CSS cubes that used to sit here were faking depth around
   a flat scene. The WebGL scene has real depth and its own node tiles, and
   the cubes landed on top of the labels, so they have gone. The dashed ring
   stays: it sits behind everything and gives the canvas an outer edge. */
