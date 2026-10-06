import { useSyncExternalStore } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

/* Whether the visitor has asked for reduced motion. Hydration uses the
   server's answer (no preference) and switches after, so markup that depends
   on it, such as a play button's label, never mismatches the prerendered
   HTML. framer-motion's useReducedMotion reads the real value on the first
   client render, which does. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}
