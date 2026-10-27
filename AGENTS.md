# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

Marketing site for BitTrix Technologies (a technology training institute in Theni, Tamil Nadu). React 19 + Vite 8 + Tailwind v4 + framer-motion + react-three-fiber, written in plain JSX (no TypeScript). Every route is prerendered to static HTML at build time.

## Commands

- `npm run dev` — Vite dev server (client-only rendering, no prerender)
- `npm run build` — full build: client bundle → SSR bundle (`dist-ssr/`) → `scripts/prerender.mjs` writes one static HTML file per route plus `sitemap.xml` and `robots.txt` into `dist/`
- `npm run build:client` — client bundle only (no prerendered HTML)
- `npm run preview` — serve `dist/`
- `npm run lint` — oxlint (config in `.oxlintrc.json`; rules-of-hooks is an error)

There is no test suite.

## Architecture

**Prerender/hydrate pipeline.** `src/routes.jsx` is the single route table, shared by the client (`src/App.jsx` via `useRoutes`) and the server entry (`src/entry-server.jsx`). It also exports `staticPaths`, the list of URLs the prerenderer emits — adding a route means adding it to both `routes` and `staticPaths` (program pages are derived from `programSlugs`). `src/main.jsx` hydrates when `#root` already has children and falls back to `createRoot` in dev. Anything rendered must be SSR-safe: no `window`/`document` access during render (guard with `typeof document === "undefined"` or defer to effects).

**SEO.** `src/lib/seo.js` `metaFor(pathname)` is the one source of title/description/canonical/JSON-LD per route. It is used twice: `headTagsFor` at prerender time (injected into `<head>`), and `src/components/Seo.jsx` on client navigation. Tags in `index.html` marked `data-default` are dev-only fallbacks that the prerenderer strips — keep that attribute on any fallback head tag you add.

**Content lives in data files, not components.** `src/data/site.js` (business facts, contact info, nav, `SITE.origin` used for canonicals/sitemap), `src/data/programs.js` (program catalogue; `id` is the URL slug for `/programs/:slug`), `src/data/content.js` (FAQs, journey stages, etc.). Contact fields in `site.js` are intentionally empty until verified — the UI hides anything empty rather than showing placeholders. The contact form posts to `VITE_CONTACT_ENDPOINT` (from `.env`). All "talk to us" CTAs route through `useEnquire()` (`src/lib/enquire.js`) → `/contact?interest=...`.

**Theme.** Light is the default; dark applies only once a visitor picks it with the toggle (the OS preference is ignored). The theme is owned by `data-theme` on `<html>`, set by a blocking inline script in `index.html` before first paint (localStorage key `bittrix-theme`). `src/lib/theme.js` only reads/writes that attribute via `useSyncExternalStore`; React never owns it. Keep the inline script and `THEME_COLOR` in `theme.js` in sync with the CSS surface colors in `src/index.css`.

**3D hero.** `src/components/TechScene.jsx` lazy-loads `robot-sign/RobotSignScene.jsx` (three.js in its own chunk), probes WebGL, picks a quality tier, and pauses when off-screen. Until the canvas is live, a static poster from `src/assets/hero/` is shown; regenerate it with `scripts/render-hero-poster.mjs` (requires Playwright and a running `npm run preview`) whenever the robot, palettes, or camera change. `prerender.mjs` adds a `modulepreload` hint for the `RobotSignScene-*.js` chunk by filename, so renaming that component breaks the hint.

**Deployment.** `Dockerfile` builds the site and serves `dist/` with nginx (`nginx.conf`) as the `bittrix-web` container. Per `compose.yaml` it joins the server's shared Docker network `web`, where a separate reverse proxy handles 80/443 and HTTPS; it is also bound to `127.0.0.1:8080` for local checks. `VITE_CONTACT_ENDPOINT` is baked in at build time (copy `.env.example` to `.env`), so changing it needs a rebuild. Deploy on the VPS with `git pull && docker compose up -d --build` in `/var/www/bittrix-technologies`.

## Conventions

Comments are block-style `/* ... */` explaining *why*, written in full sentences; match that tone. British spelling appears in copy and comments ("programme", "organisation").
