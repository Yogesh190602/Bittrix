import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { programs } from "../data/programs";
import { Icon, Reveal, SectionHeading } from "./ui";

const domains = programs.map((program, index) => ({
  id: program.id,
  code: `${program.code.toLowerCase()} / domain`,
  no: String(index + 1).padStart(2, "0"),
  icon: program.icon,
  name: program.name,
  description: program.description,
  skills: program.skills,
  careers: program.careers,
}));

/* Each leaf is printed on both sides, like a real book. Turning a leaf lays
   its back on the left, opposite the front of the next leaf; so a domain
   (the back of one leaf) always faces its own careers (the front of the
   next), and the inside back page carries the last domain's careers. */
export const bookLeaves = [
  { id: "cover", front: { kind: "cover" }, back: { kind: "welcome" } },
  ...domains.map((domain, index) => ({
    id: domain.id,
    front: index === 0 ? { kind: "contents" } : { kind: "careers", domain: domains[index - 1] },
    back: { kind: "domain", domain },
  })),
];

const lastPage = { kind: "careers", domain: domains.at(-1), end: true };

/* Scroll per page turn, then a pause after the last turn so the final
   spread can be read before the section scrolls away. Per-turn distance
   stays fixed, so adding a programme never squeezes every turn shorter. */
const TURN_VH = 70;
const END_HOLD_VH = 60;
const SCROLL_VH = bookLeaves.length * TURN_VH + END_HOLD_VH;

export const LEAF_SPAN = TURN_VH / SCROLL_VH;

export const SLAB_COUNT = 6;

export const clamp01 = (value) => Math.min(1, Math.max(0, value));

export const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

const easeOutQuad = (t) => 1 - (1 - t) ** 2;

export const mix = (from, to, t) => from + (to - from) * t;

function CoverPage() {
  return (
    <div className="leaf-cover">
      <span className="grid h-10 w-10 place-items-center rounded-xl border border-onfill/35 bg-onfill/20 text-[15px] font-extrabold">
        BT
      </span>
      <div>
        <p className="book-mono text-onfill/70">bittrix technologies</p>
        <p className="mt-2.5 text-[clamp(20px,2.4vw,32px)] font-[750] leading-[1.08] tracking-[-0.034em]">
          The Program<br />Handbook
        </p>
        <p className="mt-3.5 text-[clamp(11px,1.15vw,13.5px)] text-onfill/75">
          Six domains · Projects · Internships
        </p>
      </div>
    </div>
  );
}

/* Inside the cover: the first left-hand page. */
function WelcomePage() {
  return (
    <div className="leaf-sheet leaf-sheet-airy justify-center">
      <p className="book-mono text-purple">how to read this</p>
      <p className="book-lead">
        Each spread pairs a domain with the skills you practise and the roles
        it opens.
      </p>
      <p className="book-text book-welcome-more text-muted">
        Same model across every track: foundations, guided builds, real
        projects, internship.
      </p>
      <div className="book-icon-row text-purple">
        {domains.map((domain) => (
          <Icon key={domain.id} name={domain.icon} size={18} />
        ))}
      </div>
    </div>
  );
}

function ContentsPage() {
  return (
    <div className="leaf-sheet leaf-sheet-airy justify-center">
      <p className="book-mono text-purple">contents</p>
      <p className="book-contents-title">
        Learn. Build.<br />Innovate.
      </p>
      <span className="h-px shrink-0 bg-[var(--page-soft)]" />
      <ol className="book-contents text-muted">
        {domains.map((domain) => (
          <li key={domain.id}>
            <span className="book-mono text-[var(--page-accent)]">{domain.no}</span>
            <Icon name={domain.icon} size={15} className="book-list-icon text-purple" />
            <span>{domain.name}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function DomainPage({ domain }) {
  return (
    <div className="leaf-sheet">
      <div className="flex items-center justify-between gap-2.5">
        <span className="book-mono text-purple">{domain.code}</span>
        <span className="book-mono text-[var(--page-accent)]">{domain.no}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="book-emblem">
          <Icon name={domain.icon} size={24} />
        </span>
        <h3 className="book-heading">{domain.name}</h3>
      </div>
      <p className="book-text text-muted">{domain.description}</p>
      <div className="mt-auto flex flex-wrap gap-1.5">
        {domain.skills.map((skill) => (
          <span key={skill} className="book-chip">{skill}</span>
        ))}
      </div>
    </div>
  );
}

function CareersPage({ domain, end }) {
  return (
    <div className="leaf-sheet leaf-sheet-airy">
      <p className="book-mono text-purple">career opportunities</p>
      <p className="book-careers-name flex items-center gap-2 text-[clamp(14px,1.5vw,19px)] font-[750] tracking-[-0.02em]">
        <Icon name={domain.icon} size={18} className="book-list-icon text-purple" />
        {domain.name}
      </p>
      <ul className="book-careers grid gap-2">
        {domain.careers.map((career) => (
          <li key={career} className="book-text flex items-start gap-2.5 text-muted">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple" />
            {career}
          </li>
        ))}
      </ul>
      {end && (
        <p className="book-mono mt-auto text-[var(--page-accent)]">end of syllabus</p>
      )}
    </div>
  );
}

const PAGES = {
  cover: CoverPage,
  welcome: WelcomePage,
  contents: ContentsPage,
  domain: DomainPage,
  careers: CareersPage,
};

export function BookPage({ page }) {
  const { kind, ...props } = page;
  const Page = PAGES[kind];
  return <Page {...props} />;
}

/* Inside a preserve-3d scene the browser draws by depth and ignores
   z-index, so every page is given a real height above the book, measured in
   the book's own frame before the page rotates. Unturned pages stack on the
   right with the cover on top; turned pages stack on the left with the most
   recently turned one on top; a page mid-turn lifts clear of both. */
const LEAF_GAP = 1.5; // px between resting pages
const TURN_LIFT = 16; // px a page rises at the top of its turn

export function BookLeaf({ leaf, index, progress }) {
  const turn = useTransform(progress, (p) =>
    clamp01((p - index * LEAF_SPAN) / LEAF_SPAN),
  );
  const spin = useTransform(turn, (t) => -180 * easeInOutQuad(t));
  const depth = useTransform(turn, (t) => {
    const onRight = (bookLeaves.length - index) * LEAF_GAP;
    const onLeft = (index + 1) * LEAF_GAP;
    return mix(onRight, onLeft, easeInOutQuad(t)) + Math.sin(t * Math.PI) * TURN_LIFT;
  });
  /* translateZ first, so the height is along the book's normal and not
     along the page's own (which flips over when it turns). */
  const transform = useMotionTemplate`translateZ(${depth}px) rotateY(${spin}deg)`;
  const shade = useTransform(turn, (t) => Math.sin(t * Math.PI) * 0.5);

  return (
    <motion.div className="book-leaf" style={{ transform }}>
      <div className="leaf-face leaf-recto">
        <BookPage page={leaf.front} />
      </div>
      <div className="leaf-face leaf-verso">
        <BookPage page={leaf.back} />
      </div>
      <motion.div aria-hidden="true" className="leaf-shade" style={{ opacity: shade }} />
    </motion.div>
  );
}

export function BookSlab({ side, index, progress, visible }) {
  const opacity = useTransform([progress, visible], ([p, v]) => {
    const filled = side === "left" ? p * SLAB_COUNT : (1 - p) * SLAB_COUNT;
    return (filled > index ? 1 : 0.08) * v;
  });

  return (
    <motion.div
      aria-hidden="true"
      className={`book-slab ${side === "left" ? "slab-left" : "slab-right"}`}
      style={{ opacity, transform: `translateZ(${-4 - index * 4}px)` }}
    />
  );
}

export function CurriculumBook() {
  const sectionRef = useRef(null);

  const { scrollYProgress: progress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const opened = useTransform(progress, (p) =>
    easeInOutQuad(clamp01(p / LEAF_SPAN)),
  );
  /* The book finishes leaning back by the time the cover stands upright.
     A standing page reaches above the book by the sine of that lean, so
     turning the cover at the steeper closed-book angle would push it up
     into the headline. */
  const settled = useTransform(progress, (p) =>
    easeOutQuad(clamp01(p / (LEAF_SPAN * 0.5))),
  );
  const rigX = useTransform([progress, settled], ([p, s]) => mix(19, 11, s) - p * 4);
  const rigZ = useTransform(opened, (o) => mix(-5, -1.5, o));
  const rigY = useTransform(progress, (p) => Math.sin(p * Math.PI * 1.6) * 6);
  const rig = useMotionTemplate`rotateX(${rigX}deg) rotateZ(${rigZ}deg) rotateY(${rigY}deg)`;

  const shift = useTransform(opened, (o) => `${(1 - o) * -18}%`);
  const inside = useTransform(progress, (p) =>
    clamp01((clamp01(p / LEAF_SPAN) - 0.18) / 0.42),
  );
  /* A closed book has nothing to the left of its cover. The left board and
     page edges appear only in the last moment of the cover's turn, when it
     is nearly flat on top of them and hides them arriving. */
  const coverDown = useTransform(progress, (p) =>
    clamp01((p / LEAF_SPAN - 0.8) / 0.2),
  );
  const always = useMotionValue(1);
  /* How far through the pages: 0 closed, 1 once the last page is down. */
  const read = useTransform(progress, (p) =>
    clamp01(p / (bookLeaves.length * LEAF_SPAN)),
  );
  /* The rail runs from the contents to the last domain's spread. */
  const rail = useTransform(progress, (p) =>
    clamp01((p - LEAF_SPAN) / ((bookLeaves.length - 1) * LEAF_SPAN)),
  );

  const slabs = Array.from({ length: SLAB_COUNT }, (_, index) => index);

  return (
    <section ref={sectionRef} id="curriculum" className="tone-plum book-section border-y border-line">
      <div aria-hidden="true" className="book-dots" />

      <div className="book-viewport">
        <div className="book-head container-shell relative text-center">
          <Reveal>
            <p className="eyebrow text-brand">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
              THE CURRICULUM
            </p>
            <h2 className="book-headline">Scroll to turn the pages</h2>
          </Reveal>
        </div>

        <div className="book-stage">
          <div className="book-perspective tone-paper">
            <motion.div className="book-rig" style={{ transform: rig }}>
              <div aria-hidden="true" className="book-drop" />

              <motion.div className="book" style={{ x: shift }}>
                <div aria-hidden="true" className="book-case case-right" />
                <motion.div aria-hidden="true" className="book-case case-left" style={{ opacity: coverDown }} />

                {slabs.map((index) => (
                  <BookSlab key={`l${index}`} side="left" index={index} progress={read} visible={coverDown} />
                ))}
                {slabs.map((index) => (
                  <BookSlab key={`r${index}`} side="right" index={index} progress={read} visible={always} />
                ))}

                {/* The inside back page: the last domain's careers, shown
                    once its page has turned. */}
                <motion.div className="book-inside inside-end" style={{ opacity: inside }}>
                  <BookPage page={lastPage} />
                </motion.div>

                {/* Just above the tallest resting stack, so the gutter line
                    shows on every spread. */}
                <motion.div
                  aria-hidden="true"
                  className="book-spine"
                  style={{ opacity: inside, z: (bookLeaves.length + 1) * LEAF_GAP }}
                />

                {bookLeaves.map((leaf, index) => (
                  <BookLeaf key={leaf.id} leaf={leaf} index={index} progress={progress} />
                ))}
              </motion.div>
            </motion.div>

            <div aria-hidden="true" className="book-rail">
              <span className="book-mono text-[10.5px] text-[var(--page-accent)]">01</span>
              <div className="book-rail-track">
                <motion.div className="book-rail-fill" style={{ scaleX: rail }} />
              </div>
              <span className="book-mono text-[10.5px] text-[var(--page-accent)]">
                {String(programs.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div aria-hidden="true" style={{ height: `${SCROLL_VH}vh` }} />
    </section>
  );
}

export function CurriculumPages() {
  return (
    <section id="curriculum" className="tone-plum book-section section-space border-y border-line">
      <div aria-hidden="true" className="book-dots" />

      <div className="container-shell relative">
        <SectionHeading
          eyebrow="THE CURRICULUM"
          title="The Program Handbook"
          description="Each spread pairs a domain with the skills you practise and the roles it opens. Same model across every track: foundations, guided builds, real projects, internship."
          centered
        />

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {domains.map((domain) => (
            <div
              key={domain.id}
              className="tone-paper rounded-2xl border border-[var(--page-soft)] bg-[var(--page-raise)] p-7"
            >
              <div className="flex items-center justify-between gap-2.5">
                <span className="book-mono text-purple">{domain.code}</span>
                <span className="book-mono text-[var(--page-accent)]">{domain.no}</span>
              </div>
              <h3 className="mt-3 text-xl font-bold tracking-tight">{domain.name}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{domain.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {domain.skills.map((skill) => (
                  <span key={skill} className="book-chip">{skill}</span>
                ))}
              </div>
              <p className="book-mono mt-6 text-purple">career opportunities</p>
              <ul className="mt-2 grid gap-2">
                {domain.careers.map((career) => (
                  <li key={career} className="flex items-start gap-2.5 text-sm text-muted">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple" />
                    {career}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Curriculum() {
  const reduceMotion = useReducedMotion();
  return reduceMotion ? <CurriculumPages /> : <CurriculumBook />;
}

