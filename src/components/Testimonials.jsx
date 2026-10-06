import { useEffect, useEffectEvent, useRef, useState } from "react";
import { testimonials } from "../data/content";
import { usePrefersReducedMotion } from "../lib/motion";
import { Dialog, Icon, Reveal, SectionHeading } from "./ui";

/* Placeholders render on the dev server only, so a stand-in photo can never
   reach the live site. */
const entries = testimonials.filter(
  (entry) => import.meta.env.DEV || !entry.placeholder,
);

const THROW_MS = 340;
/* A new card comes to the top this often while autoplay runs. */
const AUTOPLAY_MS = 3000;
/* How far the top card has to be dragged before letting go throws it. */
const THROW_DISTANCE = 92;
const STACK_TILT = [-2.5, 2.2, -1.4, 3.5, -3];
/* Cards deeper than this share the last visible offset, so a long list
   still reads as one tidy stack. */
const STACK_DEPTH = 4;

function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function details(entry) {
  return [entry.program, entry.batch && `Batch of ${entry.batch}`]
    .filter(Boolean)
    .join(" · ");
}

/* Where a card sits for its position in the deck (0 is the top card). The
   fan narrows its spacing as the list grows so it keeps the same width, and
   layers from the middle out so the centre card is the one fully in view. */
function placement(position, count, mode) {
  if (mode === "fan") {
    const spread = Math.min(112, 460 / Math.max(count - 1, 1));
    const scale = spread / 112;
    const offset = position - (count - 1) / 2;
    return {
      x: offset * spread,
      y: Math.abs(offset) * 22 * scale,
      r: offset * 7 * scale,
      z: Math.round((count - Math.abs(offset)) * 2),
    };
  }

  const depth = Math.min(position, STACK_DEPTH);
  return { x: depth * 5, y: depth * 5, r: STACK_TILT[depth], z: (count - position) * 2 };
}

/* The photo fills the card above its caption. Without one, the student's
   initials take its place. */
function Photo({ entry }) {
  return (
    <span className="tstack-pic" aria-hidden="true">
      {entry.photo ? <img src={entry.photo} alt="" draggable="false" /> : initials(entry.name)}
    </span>
  );
}

function CardStack({ items, onOpen, paused }) {
  const count = items.length;
  /* order[p] is the index of the card at deck position p. The cards are
     always rendered in their original order and only their position changes,
     so React never moves DOM nodes and every change animates. */
  const [order, setOrder] = useState(() => items.map((_, index) => index));
  const [mode, setMode] = useState("stack");
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false });
  const [thrown, setThrown] = useState(null);
  const [shuffling, setShuffling] = useState(false);
  const start = useRef({ x: 0, y: 0 });
  const moved = useRef(false);
  const timers = useRef([]);
  const busy = Boolean(thrown) || shuffling;

  const reduceMotion = usePrefersReducedMotion();
  /* null until the visitor presses play or pause. Until then autoplay is on,
     unless they have asked their device for reduced motion. */
  const [choice, setChoice] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const stageRef = useRef(null);
  const playing = choice ?? !reduceMotion;

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.5 },
    );
    observer.observe(stageRef.current);
    return () => observer.disconnect();
  }, []);

  const later = (ms, callback) => timers.current.push(window.setTimeout(callback, ms));
  const advance = () => setOrder((current) => [...current.slice(1), current[0]]);

  const throwTop = (direction) => {
    if (busy || mode !== "stack") return;
    setThrown(direction);
    later(THROW_MS, () => {
      advance();
      setThrown(null);
      setDrag({ x: 0, y: 0, active: false });
    });
  };

  /* Autoplay only runs while nobody is using the stack. It waits while the
     mouse is over it, while keyboard focus is inside it, during a drag, while
     a card is open, in the fan, and while the stack is scrolled out of view.
     Any move, automatic or not, restarts the wait. */
  const autoplay =
    playing &&
    visible &&
    !hovered &&
    !focused &&
    !paused &&
    !busy &&
    !drag.active &&
    mode === "stack" &&
    count > 1;

  const autoAdvance = useEffectEvent(() => throwTop("right"));

  useEffect(() => {
    if (!autoplay) return undefined;
    /* The throw itself takes THROW_MS, so the wait is the rest of the
       interval and a new card reaches the top every AUTOPLAY_MS. */
    const id = window.setTimeout(autoAdvance, AUTOPLAY_MS - THROW_MS);
    return () => window.clearTimeout(id);
  }, [autoplay, order]);

  const previous = () => {
    if (busy || mode !== "stack") return;
    setOrder((current) => [current[current.length - 1], ...current.slice(0, -1)]);
  };

  /* Throws two cards off the top, one each way. From the fan it first lets
     the cards settle back into the stack. */
  const shuffle = () => {
    if (busy) return;
    const settle = mode === "fan" ? 430 : 0;
    setShuffling(true);
    setMode("stack");
    later(settle, () => setThrown("right"));
    later(settle + THROW_MS, () => {
      advance();
      setThrown(null);
    });
    later(settle + THROW_MS + 100, () => setThrown("left"));
    later(settle + THROW_MS * 2 + 100, () => {
      advance();
      setThrown(null);
      setShuffling(false);
    });
  };

  const pointerDown = (event) => {
    if (busy || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    start.current = { x: event.clientX, y: event.clientY };
    moved.current = false;
    setDrag({ x: 0, y: 0, active: true });
  };

  const pointerMove = (event) => {
    if (!drag.active) return;
    const x = event.clientX - start.current.x;
    const y = event.clientY - start.current.y;
    if (Math.abs(x) + Math.abs(y) > 7) moved.current = true;
    setDrag({ x, y, active: true });
  };

  /* A throw keeps the drag offset, so the card leaves from where it was let
     go rather than snapping back to the centre first. */
  const pointerUp = () => {
    if (!drag.active) return;
    if (Math.abs(drag.x) > THROW_DISTANCE) {
      setDrag((current) => ({ ...current, active: false }));
      throwTop(drag.x > 0 ? "right" : "left");
    } else {
      setDrag({ x: 0, y: 0, active: false });
    }
  };

  /* A drag ends with a click event too; that one must not open the card. */
  const cardClick = (entry) => {
    if (moved.current) {
      moved.current = false;
      return;
    }
    if (!busy) onOpen(entry);
  };

  const top = items[order[0]];

  return (
    <div
      ref={stageRef}
      className={`tstack-stage tone-plum is-${mode}${visible ? "" : " is-offscreen"}`}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && setHovered(false)}
      onFocus={(event) => event.target.matches(":focus-visible") && setFocused(true)}
      onBlur={(event) => !event.currentTarget.contains(event.relatedTarget) && setFocused(false)}
    >
      <span className="tstack-bg" aria-hidden="true" />

      {count > 1 && (
        <div className="tstack-controls">
          <button
            type="button"
            className="tstack-play"
            aria-label={playing ? "Pause autoplay" : "Play autoplay"}
            onClick={() => setChoice(!playing)}
          >
            <Icon name={playing ? "pause" : "play"} size={16} />
          </button>
          <div className="tstack-switch" role="group" aria-label="Layout">
            <button
              type="button"
              aria-label="Stack view"
              aria-pressed={mode === "stack"}
              onClick={() => !busy && setMode("stack")}
            >
              <Icon name="stack" size={16} />
            </button>
            <button
              type="button"
              aria-label="Fan view"
              aria-pressed={mode === "fan"}
              onClick={() => !busy && setMode("fan")}
            >
              <Icon name="fan" size={16} />
            </button>
          </div>
          <button type="button" className="tstack-shuffle" aria-label="Shuffle" onClick={shuffle}>
            <Icon name="shuffle" size={16} />
            <span>Shuffle</span>
          </button>
        </div>
      )}

      <div className="tstack-deck">
        {items.map((entry, index) => {
          const position = order.indexOf(index);
          const isTop = position === 0;
          const draggable = isTop && mode === "stack" && count > 1;
          const place = placement(position, count, mode);
          const x = draggable ? place.x + drag.x : place.x;
          const y = draggable ? place.y + drag.y : place.y;
          const r = draggable ? place.r + drag.x * 0.045 : place.r;

          const className = [
            "tstack-card tone-paper",
            isTop && "is-top",
            draggable && drag.active && "is-dragging",
            isTop && thrown && `is-thrown-${thrown}`,
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={index}
              type="button"
              className={className}
              style={{ "--x": `${x}px`, "--y": `${y}px`, "--r": `${r}deg`, zIndex: place.z }}
              inert={mode === "stack" && !isTop}
              aria-label={`View ${entry.name}'s card`}
              onClick={() => cardClick(entry)}
              onPointerDown={draggable ? pointerDown : undefined}
              onPointerMove={draggable ? pointerMove : undefined}
              onPointerUp={draggable ? pointerUp : undefined}
              onPointerCancel={draggable ? pointerUp : undefined}
            >
              <Photo entry={entry} />
              <span className="tstack-who">
                <b>{entry.name}</b>
                <small>{details(entry)}</small>
              </span>
              <span className="tstack-open" aria-hidden="true">
                <Icon name="expand" size={13} />
              </span>
            </button>
          );
        })}
      </div>

      {count > 1 && (
        <p className="tstack-hint">
          {mode === "stack" ? "Drag the top card aside for the next student." : "Pick any card to see it up close."}
        </p>
      )}

      {count > 1 && mode === "stack" && (
        <div className="tstack-nav">
          <button type="button" className="icon-button" aria-label="Previous testimonial" onClick={previous}>
            <Icon name="arrow" size={18} className="rotate-180" />
          </button>
          <button type="button" className="icon-button" aria-label="Next testimonial" onClick={() => throwTop("right")}>
            <Icon name="arrow" size={18} />
          </button>
        </div>
      )}

      {/* Silent while autoplay runs, or it would announce every few seconds. */}
      <p className="sr-only" aria-live={autoplay ? "off" : "polite"}>
        {`Showing ${top.name}, ${order[0] + 1} of ${count}`}
      </p>
    </div>
  );
}

export function Testimonials() {
  const [open, setOpen] = useState(null);

  if (entries.length === 0) return null;

  return (
    <section className="section-space">
      <div className="container-shell">
        <SectionHeading
          eyebrow="IN THEIR OWN WORDS"
          title={<>Real students.<br /><span className="text-brand">Real stories.</span></>}
          description="What learners say about building with us: the projects, the mentors, and the step that came next."
          centered
        />

        <Reveal>
          <CardStack items={entries} onOpen={setOpen} paused={Boolean(open)} />
        </Reveal>
      </div>

      {open && (
        <Dialog title={open.name} onClose={() => setOpen(null)}>
          {open.photo && <img className="tstack-photo" src={open.photo} alt={open.name} />}
          <p className="text-sm font-semibold text-brand">{details(open)}</p>
        </Dialog>
      )}
    </section>
  );
}
