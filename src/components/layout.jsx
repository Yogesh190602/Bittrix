import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { apps, navigation, footerLinks, CONTACT } from "../data/site";
import { programs } from "../data/programs";
import { useEnquire } from "../lib/enquire";
import { Brand, Icon, ScrollProgress, ThemeToggle } from "./ui";
import { SocialLinks } from "./sections";
import { Seo } from "./Seo";

/* Nav entries are either a route ("/contact") or a home-page anchor
   ("/#about"). Anchors need a real <a> when we are already on the home
   page so the browser handles the scroll, and a <Link> otherwise. */
function SiteLink({ to, className, children, ...rest }) {
  const { pathname } = useLocation();
  const [path, hash] = to.split("#");
  const target = path || "/";

  if (hash && pathname === target) {
    return (
      <a href={`#${hash}`} className={className} {...rest}>
        {children}
      </a>
    );
  }

  if (hash) {
    return (
      <Link to={to} className={className} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) => `${className}${isActive ? " is-active" : ""}`}
      {...rest}
    >
      {children}
    </NavLink>
  );
}

/* The header gets out of the way while you read down the page and comes
   back the moment you scroll up. */
const ALWAYS_SHOWN_WITHIN = 96; // px from the top of the page
const SCROLL_STEP = 12; // px travelled in one direction before it reacts

function useHideOnScroll(pinned) {
  const [hidden, setHidden] = useState(false);
  const pinnedRef = useRef(pinned);

  /* While pinned (the mobile menu is open) it never hides. */
  useEffect(() => {
    pinnedRef.current = pinned;
    if (pinned) setHidden(false);
  }, [pinned]);

  useEffect(() => {
    /* Distance is measured from the last point the header changed state,
       not frame to frame: a slow scroll still adds up, and a jitter of a
       few pixels can never flick it back and forth. */
    let last = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      if (pinnedRef.current || y <= ALWAYS_SHOWN_WITHIN) {
        setHidden(false);
        last = y;
        return;
      }
      if (Math.abs(y - last) >= SCROLL_STEP) {
        setHidden(y > last);
        last = y;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return [hidden, setHidden];
}

/* The grid button that jumps to the other BitTrix platforms. Its panel is
   positioned against the header bar rather than the button, so on a phone
   it can sit flush with the page gutter instead of hanging off the left
   edge of the screen. */
function AppSwitcher({ open, onOpenChange }) {
  const root = useRef(null);
  const button = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handlePointer = (event) => {
      if (!root.current?.contains(event.target)) onOpenChange(false);
    };
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onOpenChange(false);
        button.current?.focus();
      }
    };
    document.addEventListener("pointerdown", handlePointer);
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onOpenChange]);

  return (
    <div ref={root}>
      <button
        ref={button}
        type="button"
        className={`icon-button app-switcher-button${open ? " is-open" : ""}`}
        onClick={() => onOpenChange(!open)}
        aria-expanded={open}
        aria-controls="app-switcher"
        aria-label={open ? "Close the BitTrix apps menu" : "Open the BitTrix apps menu"}
      >
        <Icon name="apps" size={20} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="app-switcher"
            className="app-switcher-panel"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="app-switcher-head">
              <p className="text-sm font-bold">BitTrix Technologies</p>
              <p className="mt-0.5 text-xs text-muted">Visit our other platforms</p>
            </div>

            <ul className="p-2">
              {apps.map((app) => {
                const body = (
                  <>
                    <span className="app-switcher-icon">
                      <Icon name={app.icon} size={19} />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-sm font-bold">
                        {app.name}
                        {!app.href && <span className="app-switcher-soon">Coming soon</span>}
                      </span>
                      <span className="mt-0.5 block text-xs leading-5 text-muted">
                        {app.description}
                      </span>
                    </span>
                  </>
                );

                return (
                  <li key={app.name}>
                    {app.href ? (
                      <a href={app.href} className="app-switcher-item">
                        {body}
                      </a>
                    ) : (
                      <div className="app-switcher-item is-disabled" aria-disabled="true">
                        {body}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Header() {
  const onEnquire = useEnquire();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [appsOpen, setAppsOpen] = useState(false);
  const menuButton = useRef(null);
  const [hidden, setHidden] = useHideOnScroll(open || appsOpen);

  useEffect(() => {
    setOpen(false);
    setAppsOpen(false);
  }, [pathname]);

  /* One panel at a time: opening either menu closes the other. */
  useEffect(() => {
    if (open) setAppsOpen(false);
  }, [open]);
  useEffect(() => {
    if (appsOpen) setOpen(false);
  }, [appsOpen]);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open]);

  return (
    <header
      className={`site-header sticky top-0 z-40 border-b border-line/80 bg-surface${hidden ? " is-hidden" : ""}`}
      /* A keyboard user tabbing into the header must never land on it while
         it is off screen. */
      onFocusCapture={() => setHidden(false)}
    >
      <div className="container-shell relative flex h-20 items-center justify-between gap-5">
        <Brand />

        <nav aria-label="Main navigation" className="hidden items-center gap-7 lg:flex">
          {navigation.map(([label, href]) => (
            <SiteLink key={href} to={href} className="nav-link">
              {label}
            </SiteLink>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <AppSwitcher open={appsOpen} onOpenChange={setAppsOpen} />
          <ThemeToggle />

          <button
            /* !hidden / md:!inline-flex for the same reason as the menu
               button above: .btn-primary is unlayered and would otherwise
               outrank both utilities, leaving the CTA on screen at every
               width. */
            className="btn-primary !hidden !px-5 !py-3 md:!inline-flex"
            onClick={() => onEnquire("Free Demo Class")}
          >
            Let’s Get Started <Icon name="arrowUp" size={17} />
          </button>
        </div>

        <button
          ref={menuButton}
          /* lg:!hidden, not lg:hidden: .icon-button is unlayered CSS and so
             outranks Tailwind utilities, which live in @layer utilities. */
          className="icon-button lg:!hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close navigation" : "Open navigation"}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line bg-surface lg:hidden"
          >
            {/* The header is sticky, so a menu taller than the screen could
               never be scrolled to its last links. On a short screen (a
               phone on its side) the links go in three columns so the whole
               menu fits; anything shorter still is capped at the screen
               below the header bar (h-20) and scrolls itself. */}
            <div className="container-shell grid max-h-[calc(100dvh-5rem)] gap-1 overflow-y-auto overscroll-contain py-5 [@media(max-height:500px)]:grid-cols-3 [@media(max-height:500px)]:py-3">
              {navigation.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="rounded-lg px-3 py-3 font-medium hover:bg-tint"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </a>
              ))}
              <button
                className="btn-primary col-span-full mt-3"
                onClick={() => {
                  setOpen(false);
                  onEnquire("Free Demo Class");
                }}
              >
                Book Free Demo Class <Icon name="arrow" size={18} />
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-panel text-onpanel">
      <div className="container-shell pb-7 pt-14">
        <div className="grid gap-10 border-b border-onpanel/20 pb-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_1fr_1fr]">
          <div>
            <Brand light />
            <p className="mb-6 mt-6 max-w-xs text-sm leading-7 text-onpanel/75">
              Practical education. Purposeful innovation. A stronger foundation
              for your future in technology.
            </p>
            <SocialLinks light />
          </div>

          <div>
            <h2 className="footer-title">Quick Links</h2>
            <ul className="space-y-3">
              {footerLinks.map(([label, href]) => (
                <li key={label}>
                  <SiteLink to={href} className="footer-link">{label}</SiteLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="footer-title">Our Programs</h2>
            <ul className="space-y-3">
              {programs.map((program) => (
                <li key={program.id}>
                  <Link to={`/programs/${program.id}`} className="footer-link">
                    {program.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="footer-title">Find Us</h2>
            <p className="text-sm leading-7 text-onpanel/75">Theni, Tamil Nadu<br />India</p>
            {(CONTACT.phone || CONTACT.email) && (
              <p className="mt-4 break-all text-xs leading-6 text-onpanel/65">
                {CONTACT.phone}
                {CONTACT.phone && CONTACT.email && <br />}
                {CONTACT.email}
              </p>
            )}
            <p className="mt-5 text-xs text-onpanel/75">Classroom · Remote · Hybrid</p>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 pt-7 text-[11px] text-onpanel/65 md:flex-row">
          <p>© {new Date().getFullYear()} BitTrix Technologies. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            <Link to="/privacy" className="hover:text-onpanel">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-onpanel">Terms of Use</Link>
            <button
              type="button"
              className="inline-flex items-center gap-1 hover:text-onpanel"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Back to top <span className="-rotate-90"><Icon name="arrow" size={13} /></span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}


/* Route changes must not leave the viewport mid-page, and must move focus
   so keyboard and screen-reader users land on the new content. */
function RouteTransition() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }
    }
    window.scrollTo(0, 0);
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [pathname, hash]);

  return null;
}

export function Layout() {
  return (
    <>
      <Seo />
      <RouteTransition />
      <ScrollProgress />

      <a href="#main" className="skip-link">Skip to content</a>

      <Header />

      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
