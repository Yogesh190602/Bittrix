import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { useEnquire } from "../lib/enquire";
import { CONTACT } from "../data/site";
import { programs } from "../data/programs";
import {
  benefits,
  faqs,
  features,
  internship,
  journey,
  trust,
} from "../data/content";
import {
  Icon,
  MascotDeco,
  MascotPeek,
  Pill,
  Reveal,
  Scroll3D,
  SectionHeading,
  HeroIntro,
  introItem,
} from "./ui";
import { TechScene } from "./TechScene";
import { RadialCourseCarousel } from "./RadialCourseCarousel";
import { HeroMascot } from "./ui";

export function Hero() {
  const onEnquire = useEnquire();

  return (
    <section id="home" className="tone-plum hero-section relative overflow-hidden">
      <div className="container-shell relative">
        <div className="grid items-center gap-3 pb-12 pt-14 lg:min-h-[740px] lg:grid-cols-[1.05fr_1fr] lg:gap-0 lg:py-20">
          <HeroIntro className="relative z-10">
            <motion.div variants={introItem} className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-brand/15 bg-tint px-4 py-2 text-xs font-semibold text-brand">
              <span className="status-dot" />
              NOT JUST COURSES. CAREER FOUNDATIONS.
            </motion.div>

            <motion.h1 variants={introItem} className="max-w-2xl text-[clamp(2.75rem,5.2vw,4.6rem)] font-extrabold leading-[1.08] tracking-[-0.055em]">
              Build Skills.
              <br />
              Create Solutions.
              <br />
              <span className="gradient-text">Shape the Future.</span>
            </motion.h1>

            <motion.p variants={introItem} className="mt-7 max-w-xl text-base leading-8 text-muted sm:text-lg">
              Master Cybersecurity, Artificial Intelligence, Blockchain,
              Networking, Web Engineering, and Game Development through
              practical learning, real-world projects, internships, and
              industry-focused mentorship.
            </motion.p>

            <motion.div variants={introItem} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button className="btn-primary" onClick={() => onEnquire("Free Demo Class")}>
                Book Free Demo Class <Icon name="arrowUp" size={19} />
              </button>
              <button className="btn-secondary" onClick={() => onEnquire("Talk To A Mentor")}>
                <Icon name="chat" size={19} /> Talk To A Mentor
              </button>
            </motion.div>

            <motion.div variants={introItem} className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-xs font-medium text-muted">
              <span className="inline-flex items-center gap-2">
                <Icon name="pin" size={16} className="text-brand" />
                Theni, Tamil Nadu
              </span>
              <span className="hidden h-4 w-px bg-line sm:block" />
              <span>Classroom · Remote · Hybrid</span>
            </motion.div>
          </HeroIntro>

          <Reveal delay={0.15} className="min-w-0">
            <TechScene />
          </Reveal>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-line py-5">
          <p className="text-[10px] font-semibold tracking-[0.15em] text-muted sm:text-xs">
            LEARN WITH PURPOSE. BUILD WITH CONFIDENCE.
          </p>

          <HeroMascot />

          <a href="#programs" className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold text-brand">
            Explore the possibilities
            <span className="rotate-90"><Icon name="arrow" size={17} /></span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function TrustSection() {
  return (
    <section aria-label="Our learning commitments" className="border-y border-line bg-tint/60">
      <div className="container-shell grid grid-cols-2 gap-px py-7 md:grid-cols-3 lg:grid-cols-6">
        {trust.map(([icon, title], index) => (
          <Reveal
            key={title}
            delay={index * 0.035}
            className="flex items-center gap-3 rounded-xl p-4 transition-colors hover:bg-raised lg:flex-col lg:text-center"
          >
            <Icon name={icon} size={25} className="shrink-0 text-brand" />
            <h2 className="max-w-36 text-xs font-semibold leading-5">{title}</h2>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* The shared sections below take an optional `crumbs`: when one opens an
   inner page it carries that page's breadcrumb, and starts close under the
   header (.page-first) instead of after a full section's spacing. */

export function About({ compact = false, crumbs }) {
  /* overflow-x-clip: while it tilts with the scroll, the mindset card's
     near edge swings past the screen edge on a phone on its side; this trims
     only what is off screen, so the page never scrolls sideways. */
  return (
    <section id="about" className={`section-space overflow-x-clip${crumbs ? " page-first" : ""}`}>
      <div className="container-shell">
        {crumbs}
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-20">
          <Scroll3D className="about-visual" intensity={0.8}>
            <div className="flex items-center justify-between text-xs font-semibold text-brand">
              <span className="inline-flex items-center gap-2"><Icon name="spark" size={16} /> THE BITTRIX MINDSET</span>
              <span>01 / ∞</span>
            </div>

            <div className="my-12 flex items-center justify-center">
              <div className="mindset-orbit">
                <div className="mindset-center"><Icon name="code" size={44} /></div>
                <span className="mindset-label label-one">Think.</span>
                <span className="mindset-label label-two">Build.</span>
                <span className="mindset-label label-three">Become.</span>
                <span className="mindset-small small-one"><Icon name="brain" /></span>
                <span className="mindset-small small-two"><Icon name="cube" /></span>
                <span className="mindset-small small-three"><Icon name="shield" /></span>
              </div>
            </div>

            <div className="rounded-2xl border border-raised bg-raised/80 p-5">
              <p className="text-lg font-bold tracking-tight">Less passive learning. More possibility.</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                A place to ask better questions, build meaningful things, and find your direction.
              </p>
            </div>
          </Scroll3D>

          <div>
            <SectionHeading
              eyebrow="WHO WE ARE"
              title={<>Where ambition meets <span className="text-brand">real-world skills.</span></>}
            />
            <div className="-mt-5 space-y-5 text-base leading-8 text-muted">
              <p>
                BitTrix Technologies is a technology-focused organization dedicated
                to developing future software engineers, cybersecurity specialists,
                AI professionals, blockchain innovators, and networking experts.
              </p>
              <p>
                Our mission is to bridge the gap between academic learning and
                industry requirements through practical education, real-world
                projects, internships, certifications, and career-focused mentorship.
              </p>
              {!compact && (
                <p>
                  Students gain hands-on experience while building professional
                  portfolios that prepare them for real careers in technology.
                </p>
              )}
            </div>
            <div className="mt-7 flex flex-wrap items-end justify-between gap-6">
              {compact ? (
                <Link to="/about" className="btn-secondary">
                  Read our full story <Icon name="arrow" size={18} />
                </Link>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <Pill>Technology Education</Pill>
                  <Pill>Career Development</Pill>
                  <Pill>Technology Innovation</Pill>
                </div>
              )}
              <MascotDeco pose="coffee" anim="sway" width="clamp(96px, 11vw, 128px)" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function WhyChoose() {
  return (
    <section className="section-space bg-tint/60">
      <div className="container-shell">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="THE BITTRIX ADVANTAGE"
            title={<>Not just a course.<br />Your complete growth ecosystem.</>}
          />
          <p className="mb-12 max-w-sm text-sm leading-7 text-muted">
            Technical depth. Professional confidence. A practical path from
            learning a concept to applying it where it matters.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {features.map(([icon, title], index) => (
            <Reveal key={title} delay={(index % 4) * 0.035}>
              <motion.div
                whileHover={{ y: -5 }}
                className="feature-card h-full"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="icon-tile"><Icon name={icon} /></span>
                  <span className="font-mono text-[10px] text-muted/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-sm font-semibold leading-6">{title}</h3>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* An accordion card. Collapsed, the image and headline fill the card;
   expanded, they shrink and hand the space to the details. The card's height
   is fixed either way (see .program-card), so opening one never shifts the
   grid around it.

   The accessible part follows the standard accordion pattern: the name is a
   real button inside the heading, announcing its expanded state and pointing
   at the region it controls. Its click area is stretched over the image as
   well, but stops at the details, so the link in there stays clickable. */
export function ProgramCard({ program, index, expanded, onToggle }) {
  const buttonId = `program-toggle-${program.id}`;
  const regionId = `program-details-${program.id}`;

  return (
    <Reveal delay={(index % 3) * 0.06} className="h-full">
      <motion.article
        whileHover={{ y: -7 }}
        transition={{ duration: 0.2 }}
        className={`program-card group${expanded ? " is-open" : ""}`}
      >
        <div className="program-trigger">
          <div className="program-art" aria-hidden="true">
            <div className="program-art-grid" />
            <div className="program-art-stage">
              <div className="program-art-ring ring-large" />
              <div className="program-art-ring ring-small" />
              <div className="program-emblem">
                <Icon name={program.icon} size={45} />
              </div>
            </div>
            <span className="program-track absolute bottom-4 left-5 font-mono text-[10px] tracking-widest text-brand/65">
              BT / TRACK_0{index + 1}
            </span>
          </div>

          <div className="program-head">
            <p className="text-[9px] font-bold tracking-[0.17em] text-brand">
              {program.label}
            </p>
            <h3 className="program-title">
              <button
                id={buttonId}
                type="button"
                className="program-toggle"
                aria-expanded={expanded}
                aria-controls={regionId}
                onClick={onToggle}
              >
                <span>{program.name}</span>
                <span className="program-toggle-icon" aria-hidden="true">
                  <Icon name="plus" size={18} />
                </span>
              </button>
            </h3>
          </div>
        </div>

        {/* inert while collapsed: invisible content must not take focus or
            be read out. */}
        <div
          id={regionId}
          role="region"
          aria-labelledby={buttonId}
          className="program-details"
          inert={!expanded}
        >
          <div className="program-details-clip">
          <div className="program-details-body">
          <p className="text-[13px] leading-6 text-muted">{program.description}</p>

          <h4 className="mb-2 mt-4 text-xs font-bold">Skills you’ll build</h4>
          <div className="flex flex-wrap gap-1.5">
            {program.skills.map((skill) => <Pill key={skill}>{skill}</Pill>)}
          </div>

          <div className="mb-4 mt-4 border-t border-line pt-3">
            <h4 className="mb-1.5 text-xs font-bold">Career opportunities</h4>
            <p className="text-xs leading-6 text-muted">
              {program.careers.join(" · ")}
            </p>
          </div>

          <Link
            to={`/programs/${program.id}`}
            aria-label={`${program.name} program details`}
            className="mt-auto flex w-full items-center justify-between rounded-xl border border-brand/15 bg-tint/50 px-4 py-2.5 text-sm font-semibold text-brand transition-colors hover:bg-fill hover:text-onfill"
          >
            Explore this program <Icon name="arrow" size={18} />
          </Link>
          </div>
          </div>
        </div>
      </motion.article>
    </Reveal>
  );
}

export function Programs() {
  const onEnquire = useEnquire();

  /* overflow-x-clip: the carousel's soft glow reaches a little past the
     wheel, and on a phone past the screen edge; this trims only what is off
     screen, so the page never scrolls sideways. */
  return (
    <section id="programs" className="section-space overflow-x-clip">
      <div className="container-shell relative">
        <MascotPeek
          pose="secure"
          width="clamp(112px, 13vw, 152px)"
          className="absolute right-0 top-0 hidden lg:block"
        />
        <SectionHeading
          eyebrow="FIND YOUR DIRECTION"
          title={<>Six powerful paths.<br /><span className="text-brand">Limitless possibilities.</span></>}
          description="Choose a domain that excites you. Build the practical skills to create something that matters."
          centered
        />

        <Reveal>
          <RadialCourseCarousel />
        </Reveal>

        <Reveal className="mt-16">
          <div className="flex h-full flex-col items-start gap-6 rounded-3xl border border-brand/15 bg-tint p-8 lg:flex-row lg:items-center lg:gap-10 lg:p-10">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-raised text-brand shadow-sm">
              <Icon name="compass" size={32} />
            </span>
            <div className="flex-1">
              <p className="eyebrow text-brand">YOUR JOURNEY, YOUR WAY</p>
              <h3 className="text-3xl font-bold leading-tight tracking-tight">
                Curious about tech. Not sure where to start?
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
                You don’t have to figure it out alone. Talk to a mentor about
                your interests, current skills, and career goals.
              </p>
            </div>
            <button className="btn-primary shrink-0" onClick={() => onEnquire("Talk To A Mentor")}>
              Find My Learning Path <Icon name="arrowUp" size={18} />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function LearningJourney({ crumbs }) {
  const modes = [
    ["book", "Classroom Training", "Learn in person. Collaborate, ask questions, and build alongside others."],
    ["globe", "Remote Learning", "Connect with guided learning and mentorship from wherever you are."],
    ["layers", "Hybrid Learning", "Combine in-person interaction with the flexibility of remote learning."],
  ];

  return (
    <section id="journey" className={`section-space${crumbs ? " page-first" : ""} relative overflow-hidden bg-panel text-onpanel`}>
      <div className="dark-grid absolute inset-0 opacity-30" aria-hidden="true" />
      <div className="container-shell relative">
        {crumbs}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <SectionHeading
            light
            eyebrow="A CLEAR PATH FORWARD"
            title={<>From your first step.<br />To your next opportunity.</>}
          />
          <p className="mb-10 self-center text-base leading-8 text-onpanel/75">
            Growth doesn’t happen in a single lesson. Our learning journey
            connects foundations, practical experience, and career preparation
            into one purposeful path.
          </p>
        </div>

        <ol className="journey-grid">
          {journey.map((step, index) => (
            <Reveal key={step} delay={(index % 6) * 0.045}>
              <li className="journey-step">
                <span className="journey-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 max-w-36 text-sm font-semibold leading-6">{step}</h3>
                {index !== journey.length - 1 && (
                  <Icon name="arrow" size={16} className="journey-arrow" />
                )}
              </li>
            </Reveal>
          ))}
          <Reveal>
            <li className="flex min-h-36 flex-col justify-center rounded-2xl border border-onpanel/20 bg-onpanel/10 p-5">
              <Icon name="spark" size={25} />
              <p className="mt-4 text-sm font-semibold">Your future is a work in progress. Keep building.</p>
            </li>
          </Reveal>
        </ol>

        <div className="mt-16 border-t border-onpanel/20 pt-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-xl font-semibold tracking-tight">One ambition. Three ways to learn.</h3>
            <span className="text-xs text-onpanel/65">Choose the mode that fits your life</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {modes.map(([icon, title, text]) => (
              <div key={title} className="rounded-2xl border border-onpanel/20 bg-onpanel/5 p-6">
                <Icon name={icon} size={26} />
                <h4 className="mb-2 mt-5 text-lg font-semibold">{title}</h4>
                <p className="text-sm leading-7 text-onpanel/75">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Internships({ crumbs }) {
  const onEnquire = useEnquire();

  /* overflow-x-clip: as with About, the tilting code window's edge can
     swing past the screen edge; only what is off screen is trimmed. */
  return (
    <section id="internships" className={`section-space overflow-x-clip${crumbs ? " page-first" : ""}`}>
      <div className="container-shell">
        {crumbs}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
          <div>
            <SectionHeading
              eyebrow="EXPERIENCE THAT BUILDS CONFIDENCE"
              title={<>Learn Beyond<br /><span className="text-brand">the Classroom.</span></>}
              description="Understanding a concept is the beginning. Applying it with a team, a workflow, and a real problem is where your perspective changes."
            />

            <MascotDeco
              pose="hero"
              anim="hop"
              width="clamp(106px, 12vw, 140px)"
              className="-mt-4 mb-10"
            />

            <Scroll3D className="internship-window" intensity={0.65}>
              <div className="flex items-center gap-1.5 border-b border-brand/10 px-5 py-4">
                {[1, 2, 3].map((n) => <span key={n} className="h-2 w-2 rounded-full bg-brand/20" />)}
                <span className="ml-3 font-mono text-[10px] text-brand/70">your-next-chapter.md</span>
              </div>
              <div className="p-6 font-mono text-xs leading-8 sm:p-8 sm:text-sm">
                <p className="text-muted">// Move from learning to doing</p>
                <p className="mt-3"><span className="text-brand">const</span> yourJourney = {"{"}</p>
                <p className="pl-5">mindset: <span className="text-brand">"curious"</span>,</p>
                <p className="pl-5">approach: <span className="text-brand">"hands-on"</span>,</p>
                <p className="pl-5">environment: <span className="text-brand">"collaborative"</span>,</p>
                <p className="pl-5">nextStep: <span className="text-brand">"build something real"</span></p>
                <p>{"};"}</p>
                <p className="mt-4 text-brand">yourJourney.start();<span className="code-cursor">▌</span></p>
              </div>
            </Scroll3D>

            <button className="btn-primary mt-7" onClick={() => onEnquire("Internship Enquiry")}>
              Explore Internship Opportunities <Icon name="arrowUp" size={18} />
            </button>
            <p className="mt-3 text-xs leading-6 text-muted">
              Ask about current availability, eligibility, and program-specific terms.
            </p>
          </div>

          <ol className="relative space-y-9 pt-3">
            <div className="absolute bottom-12 left-[23px] top-9 w-px bg-brand/15" aria-hidden="true" />
            {internship.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <li className="relative flex gap-6">
                  <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-brand/15 bg-raised font-mono text-sm font-semibold text-brand">
                    0{index + 1}
                  </span>
                  <div className="pb-4 pt-2">
                    <h3 className="text-xl font-bold tracking-tight">{item.title}</h3>
                    <p className="mb-4 mt-3 text-sm leading-7 text-muted">{item.text}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => <Pill key={tag}>{tag}</Pill>)}
                    </div>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* The home page links through to /internships rather than repeating it,
   so the two pages do not compete for the same search terms. */
export function InternshipTeaser() {
  return (
    <section className="section-space border-y border-line bg-tint/50">
      <div className="container-shell grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="EXPERIENCE THAT BUILDS CONFIDENCE"
            title={<>Learn Beyond<br /><span className="text-brand">the Classroom.</span></>}
            description="Clear the project stage and you move into an internship with real tickets, real workflows and a mentor reviewing your deliverables."
          />
          <Link to="/internships" className="btn-primary">
            See how the internship works <Icon name="arrow" size={18} />
          </Link>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {internship.map((stage, index) => (
            <li
              key={stage.title}
              className="rounded-2xl border border-line bg-raised p-5"
            >
              <span className="font-mono text-[11px] text-purple">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 text-base font-bold tracking-tight">{stage.title}</h3>
              <p className="mt-2 text-xs leading-6 text-muted">{stage.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Benefits() {
  return (
    <section className="section-space">
      <div className="container-shell">
        <SectionHeading
          eyebrow="BUILT AROUND YOUR GROWTH"
          title="Skills open doors. Preparation helps you walk through."
          description="Build more than technical knowledge. Develop the proof, presence, and confidence to take your next step."
          centered
        />

        <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(([icon, title], index) => (
            <Reveal key={title} delay={(index % 3) * 0.04}>
              <motion.div
                whileHover={{ x: 5 }}
                className="flex items-center gap-4 border-b border-line py-5"
              >
                <span className="icon-tile"><Icon name={icon} size={22} /></span>
                <h3 className="flex-1 text-sm font-semibold">{title}</h3>
                <Icon name="check" size={16} className="text-brand" />
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQ({ crumbs }) {
  const onEnquire = useEnquire();
  const [active, setActive] = useState(0);

  return (
    <section id="faq" className={`section-space${crumbs ? " page-first" : ""} border-y border-line bg-tint/40`}>
      <div className="container-shell">
        {crumbs}
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="GOOD QUESTIONS. CLEAR ANSWERS."
              title={<>A little clarity.<br />A confident next step.</>}
              description="Choosing a learning path is a big decision. Let’s make it a more informed one."
            />
            <button className="btn-secondary" onClick={() => onEnquire("Talk To A Mentor")}>
              Still have questions? <Icon name="chat" size={18} />
            </button>

            <MascotDeco
              pose="sleepy"
              anim="breathe"
              width="146px"
              className="mt-9 hidden sm:block"
            />
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = active === index;
              return (
                <div
                  key={faq.question}
                  className={`overflow-hidden rounded-2xl border bg-raised transition-colors ${isOpen ? "border-brand/25" : "border-line"}`}
                >
                  <h3>
                    <button
                      id={`faq-button-${index}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${index}`}
                      onClick={() => setActive(isOpen ? null : index)}
                      className="flex w-full items-center justify-between gap-5 p-5 text-left text-sm font-semibold sm:p-6"
                    >
                      {faq.question}
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        className="shrink-0 text-brand"
                      >
                        <Icon name="plus" size={19} />
                      </motion.span>
                    </button>
                  </h3>

                  <div
                    id={`faq-answer-${index}`}
                    role="region"
                    aria-labelledby={`faq-button-${index}`}
                    hidden={!isOpen}
                  >
                    <p className="px-5 pb-6 text-sm leading-7 text-muted sm:px-6">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Home shows a handful of questions and links to /faq, so the full list and
   its FAQPage structured data live on exactly one URL. */
export function FaqTeaser() {
  return (
    <section className="section-space border-y border-line bg-tint/40">
      <div className="container-shell grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="GOOD QUESTIONS. CLEAR ANSWERS."
            title={<>A little clarity.<br />A confident next step.</>}
            description="Choosing a learning path is a big decision. Let’s make it a more informed one."
          />
          <Link to="/faq" className="btn-secondary">
            Read all questions <Icon name="arrow" size={18} />
          </Link>
        </div>

        <ul className="space-y-3">
          {faqs.slice(0, 4).map((faq) => (
            <li key={faq.question} className="rounded-2xl border border-line bg-raised p-6">
              <h3 className="text-base font-bold tracking-tight">{faq.question}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{faq.answer}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ContactLink({ icon, label, value, href }) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-4">
      <span className="icon-tile shrink-0"><Icon name={icon} size={21} /></span>
      <div>
        <p className="mb-1 text-xs text-muted">{label}</p>
        <a href={href} className="break-all text-sm font-semibold hover:text-brand">
          {value}
        </a>
      </div>
    </div>
  );
}

export function SocialLinks({ light = false }) {
  const profiles = [
    ["Instagram", CONTACT.instagram],
    ["LinkedIn", CONTACT.linkedin],
    ["YouTube", CONTACT.youtube],
  ].filter(([, url]) => Boolean(url));

  /* An empty social row reads as an unfinished site. Render nothing until
     the URLs in data/site.js are filled in. */
  if (!profiles.length) return null;

  return (
    <div className="flex flex-wrap gap-4 text-xs">
      {profiles.map(([name, url]) => (
        <a
          key={name}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1 ${light ? "text-onpanel/80 hover:text-onpanel" : "text-brand"}`}
        >
          {name} <Icon name="arrowUp" size={13} />
        </a>
      ))}
    </div>
  );
}

/* The closing call to action. Used inside the contact page (where the form
   lives just below) and as the last band on the home page (where it links
   through to /contact). */
/* The call-to-action banner that closes a page, in its own section. Below
   it, a full section's space before the footer. Above it, the section before
   already ends with that space; a coloured band does not (its colour stops
   at its edge), so after one pass `afterBand` and the space goes on top. */
export function PageCta({ to, label, afterBand = false }) {
  return (
    <section className={`closing-cta${afterBand ? " after-band" : ""}`}>
      <div className="container-shell">
        <CtaBand to={to} label={label} />
      </div>
    </section>
  );
}

export function CtaBand({ to = "#contact-form", label = "Let’s Talk" }) {
  const isRoute = to.startsWith("/");

  return (
    <div className="overflow-hidden rounded-[2rem] bg-panel p-8 text-onpanel sm:p-12">
      <div className="flex flex-col justify-between gap-7 md:flex-row md:items-center">
        <div>
          <p className="eyebrow text-onpanel/70">YOUR NEXT CHAPTER STARTS HERE</p>
          <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Don’t just follow technology.<br />Help shape what comes next.
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-7">
          <MascotDeco
            pose="sign"
            anim="wave"
            width="clamp(98px, 11vw, 126px)"
            className="hidden lg:block"
          />
          {isRoute ? (
            <Link to={to} className="btn-white shrink-0">
              {label} <Icon name="arrowUp" size={19} />
            </Link>
          ) : (
            <a href={to} className="btn-white shrink-0">
              {label} <Icon name="arrowUp" size={19} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export const enquiryOptions = [
  "Free Demo Class",
  "Talk To A Mentor",
  "Internship Enquiry",
  "General Enquiry",
  ...programs.map((program) => program.name),
];

export function ContactSection({ crumbs }) {
  const [searchParams] = useSearchParams();
  const requested = searchParams.get("interest") || "";
  const defaultInterest = enquiryOptions.includes(requested)
    ? requested
    : enquiryOptions[0];

  const [status, setStatus] = useState({ type: "", message: "" });
  const [interest, setInterest] = useState(defaultInterest);
  const abortRef = useRef(null);
  const mounted = useRef(true);

  useEffect(() => {
    setInterest(defaultInterest);
  }, [defaultInterest]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      abortRef.current?.abort();
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (status.type === "loading") return;

    const form = event.currentTarget;

    if (!CONTACT.endpoint) {
      setStatus({
        type: "error",
        message:
          "Online enquiries are not connected yet. No message has been sent. Please use a published phone number or email once the institute adds its contact details.",
      });
      return;
    }

    const payload = Object.fromEntries(new FormData(form));
    if (payload.website) return;

    const controller = new AbortController();
    abortRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 15000);

    setStatus({ type: "loading", message: "Sending your enquiry…" });

    try {
      const response = await fetch(CONTACT.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error("Unable to submit enquiry.");

      if (!mounted.current) return;
      setStatus({
        type: "success",
        message: "Your enquiry has been received. The team will contact you using the details you provided.",
      });
      form.reset();
      setInterest(defaultInterest);
    } catch {
      if (!mounted.current) return;
      setStatus({
        type: "error",
        message:
          "We couldn’t confirm delivery. Please try again or contact the institute directly.",
      });
    } finally {
      window.clearTimeout(timeout);
    }
  }

  return (
    <section id="contact" className={`section-space${crumbs ? " page-first" : ""}`}>
      <div className="container-shell">
        {crumbs}

        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="LET’S BUILD YOUR FUTURE"
              title="Start with a conversation."
              description="Tell us what you’re interested in. Let’s explore a learning path that aligns with your goals."
            />

            <div className="space-y-6">
              <ContactLink
                icon="pin"
                label="Our location"
                value="Theni, Tamil Nadu, India"
                href="https://www.google.com/maps/search/?api=1&query=Theni%2C%20Tamil%20Nadu%2C%20India"
              />
              <ContactLink
                icon="phone"
                label="Call us"
                value={CONTACT.phone}
                href={`tel:${CONTACT.phone}`}
              />
              <ContactLink
                icon="mail"
                label="Email us"
                value={CONTACT.email}
                href={`mailto:${CONTACT.email}`}
              />
            </div>

            {CONTACT.whatsapp ? (
              <a
                className="btn-secondary mt-7"
                href={`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Hi BitTrix Technologies, I’d like to learn more about your programs.")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="chat" size={18} /> Chat on WhatsApp
              </a>
            ) : (
              <button disabled className="btn-secondary mt-7 disabled:cursor-not-allowed disabled:opacity-60">
                <Icon name="chat" size={18} /> WhatsApp — coming soon
              </button>
            )}

            <div className="map-placeholder mt-8">
              <div className="map-road road-one" />
              <div className="map-road road-two" />
              <div className="map-road road-three" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <span className="mb-2 rounded-full bg-raised p-3 text-brand shadow-sm"><Icon name="pin" size={25} /></span>
                <p className="text-sm font-bold">Theni, Tamil Nadu</p>
                <p className="mt-1 text-[11px] text-muted">Classroom · Remote · Hybrid</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Theni%2C%20Tamil%20Nadu%2C%20India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand"
                >
                  View Theni on Google Maps <Icon name="arrowUp" size={13} />
                </a>
              </div>
            </div>

            <div className="mt-6"><SocialLinks /></div>
          </div>

          <Reveal>
            <form
              id="contact-form"
              onSubmit={handleSubmit}
              className="rounded-3xl border border-line bg-raised p-6 shadow-[0_20px_80px_-45px_var(--c-shadow-brand)] sm:p-9"
            >
              <h3 className="text-2xl font-bold tracking-tight">Make your next move.</h3>
              <p className="mb-8 mt-2 text-sm leading-6 text-muted">
                Share a few details to enquire about a demo, a program, or mentorship.
              </p>

              <fieldset disabled={status.type === "loading"} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="field-label">
                    Full name <span className="text-brand">*</span>
                    <input name="name" autoComplete="name" required maxLength={100} placeholder="Your full name" className="form-input" />
                  </label>
                  <label className="field-label">
                    Phone number <span className="text-brand">*</span>
                    <input name="phone" type="tel" autoComplete="tel" required minLength={7} maxLength={25} placeholder="+91" className="form-input" />
                  </label>
                </div>

                <label className="field-label">
                  Email address <span className="text-brand">*</span>
                  <input name="email" type="email" autoComplete="email" required maxLength={254} placeholder="you@example.com" className="form-input" />
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="field-label">
                    I’m interested in
                    <select
                      id="enquiry-interest"
                      name="interest"
                      value={interest}
                      onChange={(event) => setInterest(event.target.value)}
                      className="form-input"
                    >
                      {enquiryOptions.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </label>

                  <label className="field-label">
                    Preferred learning mode
                    <select name="mode" defaultValue="" className="form-input" required>
                      <option value="" disabled>Select a mode</option>
                      <option>Classroom Training</option>
                      <option>Remote Learning</option>
                      <option>Hybrid Learning</option>
                      <option>Help me decide</option>
                    </select>
                  </label>
                </div>

                <label className="field-label">
                  Tell us about your goals
                  <textarea
                    name="message"
                    rows={4}
                    maxLength={3000}
                    placeholder="What would you love to learn or build?"
                    className="form-input resize-y"
                  />
                </label>

                <div className="hidden" aria-hidden="true">
                  <label>
                    Leave this field empty
                    <input name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>

                <label className="flex items-start gap-3 text-xs leading-6 text-muted">
                  <input type="checkbox" name="consent" value="yes" required className="mt-1.5 h-4 w-4 shrink-0 accent-brand" />
                  <span>
                    I agree to be contacted by BitTrix Technologies about this enquiry
                    using the phone number or email I provide.
                  </span>
                </label>

                <button
                  type="submit"
                  className="btn-primary w-full disabled:cursor-wait disabled:opacity-70"
                >
                  {status.type === "loading" ? "Sending…" : "Send My Enquiry"}
                  <Icon name="arrowUp" size={18} />
                </button>
              </fieldset>

              <div aria-live="polite" aria-atomic="true">
                {status.message && (
                  <p className="mt-5 rounded-xl border border-brand/20 bg-tint p-4 text-sm leading-6 text-brand">
                    {status.message}
                  </p>
                )}
              </div>

              <p className="mt-4 text-center text-[11px] leading-5 text-muted">
                A conversation, not a commitment. Let’s find the right fit.
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

