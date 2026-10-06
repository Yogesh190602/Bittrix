import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import { MotionConfig } from "framer-motion";
import { useRoutes } from "react-router-dom";
import { routes } from "./routes";

function ServerApp() {
  const element = useRoutes(routes);
  return <MotionConfig reducedMotion="user">{element}</MotionConfig>;
}

export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <ServerApp />
    </StaticRouter>,
  );
}

export { staticPaths } from "./routes";
export { headTagsFor } from "./lib/seo";
export { SITE } from "./data/site";
