import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { programs } from "../data/programs";
import { usePrefersReducedMotion } from "../lib/motion";
import { Icon } from "./ui";

/* The programmes on a wheel that turns to bring one to the front, with its
   details in a card beside it. Ported from RadialCourseCarousel.tsx: same
   wheel, card and controls, drawn in the site's colour tokens (see .rcc in
   index.css) and fed from the programme catalogue. */

const INTERVAL_MS = 2000;
const ROTATION_S = 0.9;
const EASE = [0.65, 0, 0.25, 1];
/* The selected photo grows to this; the others shrink to INACTIVE_SCALE. */
const ACTIVE_SCALE = 1.14;
const INACTIVE_SCALE = 0.92;
/* The card lists this many of a programme's skills. */
const OUTCOMES = 4;

const rad = (degrees) => (degrees * Math.PI) / 180;
const point = (r, angle) =>
  `${(r * Math.cos(rad(angle))).toFixed(3)} ${(r * Math.sin(rad(angle))).toFixed(3)}`;
const pad = (n) => String(n).padStart(2, "0");

function Wheel({ items, step, active, onSelect, duration }) {
  const count = items.length;
  const seg = 360 / count;
  /* step keeps counting past the last item, so the wheel always turns the
     short way round instead of spinning back to the start. */
  const rotation = -step * seg;
  const transition = { duration, ease: EASE };
  const wedge = (angle) => {
    const start = angle - seg / 2;
    const end = angle + seg / 2;
    return `M ${point(30, start)} L ${point(98, start)} A 98 98 0 0 1 ${point(98, end)} L ${point(30, end)} A 30 30 0 0 0 ${point(30, start)} Z`;
  };

  return (
    <div className="rcc-wheel relative mx-auto aspect-square w-full max-w-[560px]">
      <div aria-hidden="true" className="rcc-glow" />
      <div aria-hidden="true" className="absolute inset-0 rounded-full border border-brand/15" />

      <motion.div
        className="absolute inset-[2%] will-change-transform"
        animate={{ rotate: rotation }}
        transition={transition}
      >
        <svg viewBox="-100 -100 200 200" aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <radialGradient id="rcc-active" cx="0" cy="0" r="100" gradientUnits="userSpaceOnUse">
              <stop offset="30%" className="rcc-stop-from" />
              <stop offset="100%" className="rcc-stop-to" />
            </radialGradient>
          </defs>
          {items.map((item, index) => (
            <path
              key={item.id}
              d={wedge(index * seg)}
              className={`rcc-wedge${index === active ? " is-active" : ""}`}
            />
          ))}
          <circle r={98} className="rcc-rim" />
        </svg>

        {items.map((item, index) => {
          const angle = index * seg;
          const isActive = index === active;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`Show ${item.name}`}
              aria-current={isActive ? "true" : undefined}
              className="absolute -ml-[12.5%] -mt-[12.5%] aspect-square w-1/4 rounded-full"
              style={{ left: `${50 + 32 * Math.cos(rad(angle))}%`, top: `${50 + 32 * Math.sin(rad(angle))}%` }}
            >
              {/* Counter-rotated so the photos stay upright as the wheel turns. */}
              <motion.span
                className="flex h-full w-full flex-col items-center gap-0.5 will-change-transform"
                animate={{ rotate: -rotation, scale: isActive ? ACTIVE_SCALE : INACTIVE_SCALE }}
                transition={transition}
              >
                <span className={`rcc-photo${isActive ? " is-active" : ""}`}>
                  <img src={item.image} alt="" loading="lazy" draggable="false" />
                </span>
                {/* The selected name sits on the plum wedge, so it is cream. It
                    cancels the photo's enlargement: grown with it, the name
                    reaches across the wedge's dividing lines. */}
                <motion.span
                  className={`rcc-label font-semibold tracking-tight transition-colors duration-500 ${
                    isActive ? "text-onpanel" : "text-muted"
                  }`}
                  style={{ transformOrigin: "top center" }}
                  animate={{ scale: isActive ? 1 / ACTIVE_SCALE : 1 }}
                  transition={transition}
                >
                  {item.name}
                </motion.span>
              </motion.span>
            </button>
          );
        })}
      </motion.div>

      <div className="rcc-hub">
        <span className="rcc-hub-count text-xl font-bold tracking-tighter sm:text-3xl">{pad(active + 1)}</span>
        <span className="rcc-hub-total text-[9px] font-semibold uppercase tracking-[0.16em] sm:text-[11px]">
          of {pad(count)}
        </span>
      </div>
      {/* Marks the front of the wheel, where the selected programme stops. */}
      <div aria-hidden="true" className="rcc-notch" />
    </div>
  );
}

/* One programme's card content. `still` renders it without the entrance
   animation, for the hidden copies that size the card. */
function ProgramContent({ program, index, reduce, still = false }) {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-brand">
          Domain {pad(index + 1)}
        </span>
        <img src={program.image} alt="" className="h-11 w-11 rounded-xl border border-line object-cover" />
      </div>

      <div className="flex flex-col gap-3.5">
        <p className="text-[11px] font-bold tracking-[0.17em] text-brand">{program.label}</p>
        <h3 className="text-3xl font-bold leading-[1.08] tracking-tight text-ink sm:text-4xl lg:text-[44px]">
          {program.name}
        </h3>
        <p className="text-pretty text-base leading-8 text-muted">{program.description}</p>
      </div>

      <div className="flex flex-col gap-3.5">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          Key learning outcomes
        </span>
        <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {program.skills.slice(0, OUTCOMES).map((skill, i) => (
            <motion.li
              key={skill}
              initial={still ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduce ? 0 : 0.08 + i * 0.05 }}
              className="flex items-center gap-3 rounded-2xl border border-line bg-raised/60 px-4 py-3.5 text-[15px] font-semibold text-ink"
            >
              <span aria-hidden="true" className="rcc-check">
                <Icon name="check" size={13} />
              </span>
              {skill}
            </motion.li>
          ))}
        </ul>
      </div>

      <div>
        <Link to={`/programs/${program.id}`} className="btn-primary">
          Explore this program <Icon name="arrow" size={18} />
        </Link>
      </div>
    </>
  );
}

/* Every programme is also laid out, invisibly, in the same grid cell as the
   one on show. A grid cell is as tall as its tallest child, so the card is
   always the height of the longest programme at the current width and keeps
   one size while the wheel turns, instead of resizing and pulling the
   centred wheel up and down with it. The hidden copies are out of view,
   out of the tab order and out of the accessibility tree. */
function ProgramDetails({ items, program, index, reduce }) {
  return (
    <article className="rcc-card relative overflow-hidden rounded-[24px] border border-line p-7 sm:p-10 lg:p-12">
      <div className="grid">
        {items.map((item, i) => (
          <div
            key={item.id}
            aria-hidden="true"
            inert
            className="invisible flex flex-col gap-7 [grid-area:1/1]"
          >
            <ProgramContent program={item} index={i} still />
          </div>
        ))}

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={program.id}
            className="flex flex-col gap-7 [grid-area:1/1]"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -10, transition: { duration: 0.22 } }}
          >
            <ProgramContent program={program} index={index} reduce={reduce} />
          </motion.div>
        </AnimatePresence>
      </div>
    </article>
  );
}

function Controls({ items, active, step, running, paused, interval, onPrev, onNext, onSelect, onTogglePause }) {
  return (
    <nav aria-label="Program carousel controls" className="flex flex-wrap items-center justify-center gap-5">
      <button type="button" onClick={onPrev} aria-label="Previous program" className="icon-button">
        <Icon name="arrow" size={18} className="rotate-180" />
      </button>

      <div className="flex items-center gap-4 px-2">
        <span className="min-w-11 text-[15px] font-semibold tabular-nums text-ink">
          {active + 1}/{items.length}
        </span>
        <div className="flex items-center gap-2">
          {items.map((item, index) => (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`Go to ${item.name}`}
              aria-current={index === active ? "true" : undefined}
              animate={{ width: index === active ? 32 : 6 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-1.5 overflow-hidden rounded-full bg-brand/20"
            >
              {/* Keyed by step so it restarts on every move; it pauses along
                  with the timer, so it always shows the time left. */}
              {index === active && (
                <span
                  key={step}
                  className="rcc-progress"
                  style={{ animationDuration: `${interval}ms`, animationPlayState: running ? "running" : "paused" }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>

      <button type="button" onClick={onNext} aria-label="Next program" className="icon-button">
        <Icon name="arrow" size={18} />
      </button>

      <button
        type="button"
        onClick={onTogglePause}
        aria-label={paused ? "Resume auto-rotation" : "Pause auto-rotation"}
        className="h-10 rounded-full border border-line px-4 text-[13px] font-semibold text-muted transition-colors hover:bg-tint"
      >
        {paused ? "Resume" : "Pause"}
      </button>
    </nav>
  );
}

export function RadialCourseCarousel({ items = programs, interval = INTERVAL_MS }) {
  const reduce = usePrefersReducedMotion();
  const rootRef = useRef(null);
  const inView = useInView(rootRef, { amount: 0.4 });
  const [step, setStep] = useState(0);
  /* null until the visitor presses pause or resume. Until then it rotates,
     unless they have asked their device for reduced motion. */
  const [choice, setChoice] = useState(null);
  const [focused, setFocused] = useState(false);
  const elapsed = useRef(0);

  const count = items.length;
  const mod = (n) => ((n % count) + count) % count;
  const active = mod(step);
  const paused = choice ?? reduce;
  /* Rotation keeps going under the mouse. It only waits while keyboard focus
     is inside the carousel and while it is scrolled out of view. */
  const running = !paused && inView && !focused;

  const go = (delta) => setStep((current) => current + delta);
  /* Jump to an item the short way round the wheel. */
  const goTo = (index) =>
    setStep((current) => {
      let delta = mod(index - mod(current));
      if (delta > count / 2) delta -= count;
      return current + delta;
    });

  /* Any move, automatic or not, starts the next wait from zero. */
  useEffect(() => {
    elapsed.current = 0;
  }, [step]);

  /* Time already waited is kept across a pause, so resuming finishes the
     current wait instead of starting a new one. */
  useEffect(() => {
    if (!running) return undefined;
    const started = performance.now();
    const id = window.setTimeout(
      () => setStep((current) => current + 1),
      Math.max(interval - elapsed.current, 0),
    );
    return () => {
      window.clearTimeout(id);
      elapsed.current += performance.now() - started;
    };
  }, [running, step, interval]);

  const onKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(-1);
    }
  };

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Programs"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onFocus={(event) => event.target.matches(":focus-visible") && setFocused(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setFocused(false)}
      className="rcc mx-auto flex max-w-[1240px] flex-col gap-10 rounded-[28px]"
    >
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-20">
        <Wheel items={items} step={step} active={active} onSelect={goTo} duration={reduce ? 0 : ROTATION_S} />
        <ProgramDetails items={items} program={items[active]} index={active} reduce={reduce} />
      </div>

      <Controls
        items={items}
        active={active}
        step={step}
        running={running}
        paused={paused}
        interval={interval}
        onPrev={() => go(-1)}
        onNext={() => go(1)}
        onSelect={goTo}
        onTogglePause={() => setChoice(!paused)}
      />

      {/* Silent while it rotates, or it would announce every few seconds. */}
      <p className="sr-only" aria-live={running ? "off" : "polite"}>
        {`${items[active].name}, ${active + 1} of ${count}`}
      </p>
    </div>
  );
}
