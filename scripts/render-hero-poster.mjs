/* Renders the hero robot's still (.hero3d-poster) from the live scene, one
   per theme, into src/assets/hero/. The still is shown while three.js
   loads and the canvas fades in over it, so it has to match the scene's
   first frame: run this again whenever the robot, its palettes or its
   camera change.

     npm run build && npm run preview      # in one terminal
     node scripts/render-hero-poster.mjs   # in another (needs Playwright:
                                           # npm i -D playwright)

   Pass the preview URL as the first argument if it is not the default. */

import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const url = process.argv[2] || "http://localhost:4173/";
const out = path.join(path.dirname(fileURLToPath(import.meta.url)), "../src/assets/hero");
const SIZE = 1000; // px square; the hero is at most ~680px wide, shown at up to 2x
const DWELL_MS = 3200; // the sign's programme interval in RobotSignScene

const browser = await chromium.launch();

for (const theme of ["light", "dark"]) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  await context.addInitScript((value) => localStorage.setItem("bittrix-theme", value), theme);
  /* Hold the sign on its first programme, which is what the live scene
     shows on its first frame. */
  await context.addInitScript((dwell) => {
    const every = window.setInterval;
    window.setInterval = (fn, ms, ...rest) => (ms === dwell ? 0 : every(fn, ms, ...rest));
  }, DWELL_MS);

  const page = await context.newPage();
  await page.goto(url, { waitUntil: "load" });
  await page.waitForFunction(() => document.querySelector(".hero3d.is-live"), null, {
    timeout: 120000,
  });
  /* Two animation frames: the first draw (which compiles the shaders and
     can take a while) has happened. Then late enough for the sign face to
     have eased in, early enough that the camera still holds its resting
     pose (POSTER_HOLD_MS, 900ms from the first frame). */
  await page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));
  await page.waitForTimeout(400);

  /* Only the canvas, on a transparent page: the still keeps the scene's
     alpha so it sits on the hero exactly as the canvas does. */
  await page.addStyleTag({
    content: `html, body, body * { background: transparent !important; box-shadow: none !important; }
      body * { visibility: hidden !important; }
      .hero3d canvas { visibility: visible !important; }
      .hero3d-cards { display: none !important; }`,
  });
  await page.waitForTimeout(100);
  const clip = await page.evaluate(() => {
    const r = document.querySelector(".hero3d canvas").getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  const png = await page.screenshot({ clip, omitBackground: true });

  /* Encode to WebP in the browser, so nothing beyond Playwright is needed. */
  const encoder = await context.newPage();
  const webp = await encoder.evaluate(
    async ({ data, size }) => {
      const image = new Image();
      image.src = `data:image/png;base64,${data}`;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const g = canvas.getContext("2d");
      g.imageSmoothingQuality = "high";
      g.drawImage(image, 0, 0, size, size);
      return canvas.toDataURL("image/webp", 0.82).split(",")[1];
    },
    { data: png.toString("base64"), size: SIZE },
  );

  const file = path.join(out, `robot-${theme}.webp`);
  const bytes = Buffer.from(webp, "base64");
  writeFileSync(file, bytes);
  console.log(`${path.relative(process.cwd(), file)}  ${(bytes.length / 1024).toFixed(0)} KB`);
  await context.close();
}

await browser.close();
