import { Fragment, useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toggleTheme } from "../lib/theme";
import { DOMAIN_ICONS } from "./iconShapes";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

/* The six programme icons come from iconShapes.js, the same data the robot's
   sign draws from, so a programme's icon is identical everywhere. */
function renderIconShape(shape, index) {
  if (shape.rect) {
    const [x, y, width, height, rx] = shape.rect;
    return <rect key={index} x={x} y={y} width={width} height={height} rx={rx} />;
  }
  if (shape.circle) {
    const [cx, cy, r] = shape.circle;
    return <circle key={index} cx={cx} cy={cy} r={r} />;
  }
  return <path key={index} d={shape.path} />;
}

/* Inline SVG keeps the implementation within the requested stack. */
export function Icon({ name = "code", size = 22, className = "" }) {
  const paths = {
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    arrowUp: <path d="M6 18 18 6M6 6h12v12" />,
    check: <path d="m5 12 4 4L19 6" />,
    plus: <path d="M12 5v14M5 12h14" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    people: (
      <>
        <circle cx="9" cy="7" r="3" />
        <path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 4v3" />
      </>
    ),
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path d="M8 7V3h8v4M3 12l9 3 9-3m-9 1v4" />
      </>
    ),
    compass: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m16 8-3 5-5 3 3-5z" />
      </>
    ),
    layers: <path d="m12 3 10 5-10 5L2 8zm-10 9 10 5 10-5M2 16l10 5 10-5" />,
    book: (
      <>
        <path d="M12 5C8 2 3 3 2 4v15c4-2 7-1 10 1 3-2 6-3 10-1V4c-1-1-6-2-10 1Zm0 0v15" />
      </>
    ),
    award: (
      <>
        <circle cx="12" cy="8" r="5" />
        <path d="m8 12-2 10 6-3 6 3-2-10" />
      </>
    ),
    folder: <path d="M3 7V4h7l3 3h8v13H3Z" />,
    chat: <path d="M21 11a9 9 0 0 1-9 9H4l-3 2 2-6a9 9 0 1 1 18-5Z" />,
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="4" ry="9" />
        <path d="M3 12h18" />
      </>
    ),
    pin: (
      <>
        <path d="M19 10c0 5-7 12-7 12S5 15 5 10a7 7 0 0 1 14 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 6 9 7 9-7" />
      </>
    ),
    phone: <path d="m5 3 4 4-2 3c2 4 3 5 7 7l3-2 4 4-2 3C10 22 2 14 2 5Z" />,
    spark: <path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" />,
    stack: (
      <>
        <rect x="5" y="5" width="14" height="14" rx="2" />
        <path d="M8 2h8M8 22h8" />
      </>
    ),
    fan: (
      <>
        <path d="m5 17 3.1-11.6a2 2 0 0 1 2.45-1.41l7.73 2.07a2 2 0 0 1 1.41 2.45l-3.1 11.6a2 2 0 0 1-2.45 1.41L6.42 19.45A2 2 0 0 1 5 17Z" />
        <path d="M8.5 18.8 4.1 17.6a2 2 0 0 1-1.42-2.45L5.5 4.62" />
      </>
    ),
    shuffle: (
      <>
        <path d="M3 7h3.5c5 0 5 10 10 10H21" />
        <path d="m18 14 3 3-3 3M3 17h3.5c1.5 0 2.6-.9 3.55-2.1M14 8.9C14.9 7.8 16 7 17.5 7H21" />
        <path d="m18 4 3 3-3 3" />
      </>
    ),
    expand: <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" />,
    pause: <path d="M9 5v14M15 5v14" />,
    play: <path d="M7 5v14l12-7Z" />,
    sun: (
      <>
        <circle cx="12" cy="12" r="4.2" />
        <path d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
      </>
    ),
    moon: <path d="M20 14.2A8.4 8.4 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z" />,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {DOMAIN_ICONS[name]
        ? DOMAIN_ICONS[name].map(renderIconShape)
        : paths[name] || DOMAIN_ICONS.code.map(renderIconShape)}
    </svg>
  );
}

export function Brand({ light = false }) {
  return (
    <Link
      to="/"
      aria-label="BitTrix Technologies home"
      className={`inline-flex items-center gap-3 ${light ? "text-onpanel" : "text-ink"}`}
    >
      <span className={`brand-mark ${light ? "brand-mark-light" : ""}`}>
        <span />
        <span />
        <span />
      </span>
      <span>
        <span className="block text-2xl font-extrabold leading-none tracking-tight">
          BitTrix<span className={light ? "text-onpanel/70" : "text-brand"}>.</span>
        </span>
        <span className="mt-1 block text-[9px] font-semibold tracking-[0.29em]">
          TECHNOLOGIES
        </span>
      </span>
    </Link>
  );
}

/* A reveal should register and get out of the way. The old 24px travel on a
   linear-ish ease read as the same generic entrance on every block; 12px on
   a decelerating curve lands sooner and draws less attention to itself. */
const EASE_OUT = [0.22, 1, 0.36, 1];

export function Reveal({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.5, delay, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* The hero's page-load sequence — the one orchestrated moment on the site.
   Everything else reveals quietly; this is the part that is allowed to be
   choreographed, and it runs once, on load, rather than on scroll. */
const introContainer = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

export const introItem = {
  hidden: { opacity: 0, y: 18 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.66, ease: EASE_OUT } },
};

export function HeroIntro({ children, className = "" }) {
  return (
    <motion.div
      variants={introContainer}
      initial="hidden"
      animate="shown"
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* `wide` lets a left-aligned heading run the full width from lg up, so a
   short title can sit on one line instead of leaving the right side empty.
   The description stays at a readable measure. */
/* "Home / … / This page" at the top of an inner page. It goes inside the
   page's first section (see the `crumbs` prop on the shared sections), so it
   sits on that section's background with no strip of its own. */
export function PageCrumbs({ trail = [], current }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <Link to="/">Home</Link>
      {trail.map(([label, to]) => (
        <Fragment key={to}>
          <span aria-hidden="true">/</span>
          <Link to={to}>{label}</Link>
        </Fragment>
      ))}
      <span aria-hidden="true">/</span>
      <span aria-current="page">{current}</span>
    </nav>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
  light = false,
  wide = false,
}) {
  const width = centered
    ? "mx-auto max-w-3xl text-center"
    : wide
      ? "max-w-2xl lg:max-w-none"
      : "max-w-2xl";

  return (
    <Reveal className={`mb-12 ${width}`}>
      <p className={`eyebrow ${light ? "text-onpanel/75" : "text-brand"}`}>
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
        {eyebrow}
      </p>
      <h2 className={`section-title ${light ? "text-onpanel" : "text-ink"}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-5 text-base leading-8 ${wide ? "lg:max-w-4xl " : ""}${light ? "text-onpanel/75" : "text-muted"}`}>
          {description}
        </p>
      )}
    </Reveal>
  );
}

export function Pill({ children, light = false }) {
  return <span className={`pill ${light ? "pill-light" : ""}`}>{children}</span>;
}

export function Dialog({ title, children, onClose }) {
  const ref = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    dialog.showModal();
    document.body.style.overflow = "hidden";

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className="site-dialog"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative p-6 sm:p-9">
        <button
          className="icon-button absolute right-4 top-4"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <Icon name="close" />
        </button>
        <h2 id={titleId} className="pr-10 text-2xl font-bold tracking-tight">
          {title}
        </h2>
        <div className="mt-6">{children}</div>
      </div>
    </dialog>
  );
}

export function Scroll3D({
  children,
  className = "",
  intensity = 1,
}) {
  const containerRef = useRef(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 28,
    mass: 0.6,
  });

  const rotateX = useTransform(
    progress,
    [0, 0.5, 1],
    [12 * intensity, 0, -10 * intensity],
  );

  const rotateY = useTransform(
    progress,
    [0, 0.5, 1],
    [-9 * intensity, 0, 9 * intensity],
  );

  const y = useTransform(
    progress,
    [0, 0.5, 1],
    [42 * intensity, 0, -42 * intensity],
  );

  const scale = useTransform(
    progress,
    [0, 0.5, 1],
    [0.96, 1, 0.96],
  );

  return (
    <div ref={containerRef} className="scroll-3d-stage">
      <motion.div
        className={`scroll-3d-object ${className}`}
        style={
          reduceMotion
            ? undefined
            : {
                rotateX,
                rotateY,
                y,
                scale,
                transformPerspective: 1200,
              }
        }
      >
        {children}
      </motion.div>
    </div>
  );
}

export function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 30,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="scroll-progress"
      style={{
        scaleX: reduceMotion ? scrollYProgress : smoothProgress,
      }}
    />
  );
}

export const MASCOT = {
  coding: "/mascot/coding.webp",
  sign: "/mascot/sign.webp",
  sleepy: "/mascot/sleepy.webp",
  secure: "/mascot/secure.webp",
  hoodie: "/mascot/hoodie.webp",
  coffee: "/mascot/coffee.webp",
  build: "/mascot/build.webp",
  hero: "/mascot/hero.webp",
};

export const heroPoses = [
  { pose: "coding", say: "shipping something\u2026" },
  { pose: "build", say: "build. learn. grow." },
  { pose: "secure", say: "locking it down" },
  { pose: "coffee", say: "one more commit" },
  { pose: "hoodie", say: "debugging, brb" },
];

export function MascotDeco({ pose, anim = "sway", width, className = "" }) {
  return (
    <div aria-hidden="true" className={`mascot-deco ${className}`} style={{ width }}>
      <img
        src={MASCOT[pose]}
        alt=""
        loading="lazy"
        decoding="async"
        className={`mascot-img mascot-${anim}`}
      />
    </div>
  );
}

export function MascotPeek({ pose, width, className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={`mascot-peek-window ${className}`}
      style={{ width, height: `calc(${width} * 0.62)` }}
    >
      <img src={MASCOT[pose]} alt="" loading="lazy" decoding="async" className="mascot-img" />
    </div>
  );
}

export function HeroMascot() {
  const [index, setIndex] = useState(0);
  const current = heroPoses[index % heroPoses.length];

  return (
    <div className="mascot-hero">
      <span aria-hidden="true" className="mascot-hero-glow" />

      <button
        type="button"
        className="mascot-hero-body"
        onClick={() => setIndex((value) => value + 1)}
        aria-label="Show the BitTrix mascot in another pose"
      >
        <span key={current.pose} className="mascot-hero-pose block">
          <img src={MASCOT[current.pose]} alt="" className="mascot-img" />
        </span>
        <span aria-hidden="true" className="mascot-scan" />
      </button>

      <p key={current.say} className="mascot-say" aria-live="polite">
        {current.say}
      </p>
    </div>
  );
}


/* Day / night switch.
   Both icons and both labels are always in the DOM, and CSS picks which one
   shows based on the data-theme attribute. That keeps the button correct in
   the prerendered HTML and during hydration, before any React state exists —
   driving it from state instead would flash the wrong icon on every load. */
export function ThemeToggle({ className = "" }) {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`icon-button theme-toggle ${className}`}
    >
      <span className="theme-toggle-icon theme-toggle-sun"><Icon name="sun" size={19} /></span>
      <span className="theme-toggle-icon theme-toggle-moon"><Icon name="moon" size={19} /></span>
      <span className="sr-only theme-toggle-sun">Switch to the light theme</span>
      <span className="sr-only theme-toggle-moon">Switch to the dark theme</span>
    </button>
  );
}
