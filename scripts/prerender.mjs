import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url)) + "/..";
const dist = path.join(root, "dist");

const { render, staticPaths, headTagsFor, SITE } = await import(
  path.join(root, "dist-ssr/entry-server.js")
);

const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");

/* The home page's 3D hero is a lazy chunk, which the browser would only
   request once the page had started up. Hinting it in the HTML lets it
   download alongside the main bundle; low priority, so it never holds up
   what the page needs first. */
const heroChunk = fs
  .readdirSync(path.join(dist, "assets"))
  .find((file) => /^RobotSignScene-[\w-]+\.js$/.test(file));
const heroHint = heroChunk
  ? `<link rel="modulepreload" crossorigin href="/assets/${heroChunk}" fetchpriority="low">\n  `
  : "";

let written = 0;
const urls = [];

for (const url of staticPaths) {
  const routeUrl = url === "/404" ? "/this-page-does-not-exist" : url;
  const appHtml = render(routeUrl);
  const head = headTagsFor(routeUrl);

  /* Drop every dev-only fallback tag (marked data-default in index.html)
     before injecting the real per-route head. Marker-based rather than
     regex-matching tag names, so a reworded comment can never break it. */
  let html = template
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(title|meta|link)\b[^>]*\bdata-default\b[^>]*>(?:[\s\S]*?<\/\1>)?/g, "")
    .replace("</head>", `  ${head}\n  ${url === "/" ? heroHint : ""}</head>`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  const outPath =
    url === "/"
      ? path.join(dist, "index.html")
      : url === "/404"
        ? path.join(dist, "404.html")
        : path.join(dist, url.slice(1), "index.html");

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html);
  written += 1;
  if (url !== "/404") urls.push(url);
}

/* sitemap.xml + robots.txt, generated from the same route list so they can
   never drift from what actually exists. */
const origin = SITE.origin;
const today = new Date().toISOString().slice(0, 10);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) =>
      `  <url>\n    <loc>${origin}${url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${url === "/" ? "1.0" : url.startsWith("/programs/") ? "0.9" : "0.7"}</priority>\n  </url>`,
  )
  .join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(dist, "sitemap.xml"), sitemap);

fs.writeFileSync(
  path.join(dist, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
);

console.log(`prerendered ${written} pages, ${urls.length} in sitemap`);
