import { useSyncExternalStore } from "react";

/* ---------------------------------------------------------------------- */
/* Day / night theme                                                       */
/*                                                                         */
/* Day is the default. Night is used only once a visitor picks it with the */
/* toggle; the device's own light/dark setting is not followed.            */
/*                                                                         */
/* The source of truth is the data-theme attribute on <html>, set by the   */
/* blocking snippet in index.html before first paint. Pages here are       */
/* prerendered to static HTML, so anything that waited for React would     */
/* show a white flash on every single page load for a visitor in dark      */
/* mode. React never owns the attribute; it only reads and writes it.      */
/* ---------------------------------------------------------------------- */

export const STORAGE_KEY = "bittrix-theme";

/* Kept in step with --c-surface / --c-brand-panel so the mobile browser
   chrome matches the page it is sitting above. */
const THEME_COLOR = { light: "#fdf4d2", dark: "#150a1e" };

export function readTheme() {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function applyTheme(theme) {
  const root = document.documentElement;
  if (root.dataset.theme === theme) return;

  /* Cross-fade the page, but only for as long as the swap takes. Leaving a
     transition on permanently would make every later hover feel laggy. */
  root.classList.add("theme-switching");
  window.clearTimeout(applyTheme.timer);
  applyTheme.timer = window.setTimeout(() => {
    root.classList.remove("theme-switching");
  }, 320);

  root.dataset.theme = theme;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLOR[theme]);

  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* Private browsing and blocked storage are fine; the choice simply
       lasts for this page view. */
  }

  /* Nudge useSyncExternalStore subscribers that are not watching the DOM. */
  window.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
}

export function toggleTheme() {
  applyTheme(readTheme() === "dark" ? "light" : "dark");
}

/* One MutationObserver feeds every consumer, so components stay in step
   with the attribute no matter who changed it. */
function subscribe(onChange) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

/* The server snapshot is always "light" so the prerendered markup and the
   first hydration render agree. The real value arrives immediately after,
   and only the WebGL hero reads it, which mounts on the client regardless. */
export function useTheme() {
  return useSyncExternalStore(subscribe, readTheme, () => "light");
}
