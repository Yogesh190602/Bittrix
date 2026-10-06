import { MotionConfig } from "framer-motion";
import { useRoutes } from "react-router-dom";
import { routes } from "./routes";

export default function App() {
  const element = useRoutes(routes);
  return <MotionConfig reducedMotion="user">{element}</MotionConfig>;
}
