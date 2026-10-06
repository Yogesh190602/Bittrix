import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { metaFor } from "../lib/seo";
import { SITE } from "../data/site";

function upsert(selector, create, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

/* Keeps <head> correct during client-side navigation. The prerendered HTML
   already carries the right tags on first paint; this only maintains them. */
export function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = metaFor(pathname);
    const url = `${SITE.origin}${meta.path}`;

    document.title = meta.title;

    upsert('meta[name="description"]', () => document.createElement("meta"), {
      name: "description",
      content: meta.description,
    });
    upsert('link[rel="canonical"]', () => document.createElement("link"), {
      rel: "canonical",
      href: url,
    });

    const social = [
      ['meta[property="og:title"]', "property", "og:title", meta.title],
      ['meta[property="og:description"]', "property", "og:description", meta.description],
      ['meta[property="og:url"]', "property", "og:url", url],
      ['meta[name="twitter:title"]', "name", "twitter:title", meta.title],
      ['meta[name="twitter:description"]', "name", "twitter:description", meta.description],
    ];
    social.forEach(([selector, keyAttr, key, content]) => {
      upsert(selector, () => document.createElement("meta"), { [keyAttr]: key, content });
    });

    const robots = document.head.querySelector('meta[name="robots"]');
    if (meta.noindex) {
      upsert('meta[name="robots"]', () => document.createElement("meta"), {
        name: "robots",
        content: "noindex, follow",
      });
    } else if (robots) {
      robots.remove();
    }

    const previous = document.head.querySelector("script[data-route-jsonld]");
    if (previous) previous.remove();
    if (meta.graph.length) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.routeJsonld = "true";
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": meta.graph,
      });
      document.head.appendChild(script);
    }
  }, [pathname]);

  return null;
}
