import { Layout } from "./components/layout";
import Home from "./pages/Home";
import ProgramsIndex from "./pages/ProgramsIndex";
import AboutPage from "./pages/AboutPage";
import ApproachPage from "./pages/ApproachPage";
import FaqPage from "./pages/FaqPage";
import ProgramPage from "./pages/ProgramPage";
import InternshipsPage from "./pages/InternshipsPage";
import ContactPage from "./pages/ContactPage";
import { PrivacyPage, TermsPage } from "./pages/LegalPage";
import NotFound from "./pages/NotFound";
import { programSlugs } from "./data/programs";

export const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <AboutPage /> },
      { path: "approach", element: <ApproachPage /> },
      { path: "programs", element: <ProgramsIndex /> },
      { path: "programs/:slug", element: <ProgramPage /> },
      { path: "internships", element: <InternshipsPage /> },
      { path: "faq", element: <FaqPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "privacy", element: <PrivacyPage /> },
      { path: "terms", element: <TermsPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];

/* Every URL the prerenderer turns into a static HTML file. */
export const staticPaths = [
  "/",
  "/about",
  "/approach",
  "/programs",
  ...programSlugs.map((slug) => `/programs/${slug}`),
  "/internships",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
  "/404",
];
