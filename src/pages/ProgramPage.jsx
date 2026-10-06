import { Link, useParams } from "react-router-dom";
import { programBySlug, programs } from "../data/programs";
import { journeyPhases } from "../data/content";
import { Icon, PageCrumbs, Pill, Reveal, SectionHeading } from "../components/ui";
import { useEnquire } from "../lib/enquire";
import NotFound from "./NotFound";

export default function ProgramPage() {
  const { slug } = useParams();
  const program = programBySlug(slug);
  const enquire = useEnquire();

  if (!program) return <NotFound />;

  const others = programs.filter((item) => item.id !== program.id);

  return (
    <>
      {/* Hero ------------------------------------------------------- */}
      <section className="tone-plum border-b border-line bg-surface pb-16 pt-10">
        <div className="container-shell">
          <PageCrumbs trail={[["Programs", "/programs"]]} current={program.name} />

          <Reveal className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="eyebrow text-brand">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                {program.label}
              </p>
              <h1 className="max-w-2xl text-[clamp(2.25rem,4.4vw,3.6rem)] font-extrabold leading-[1.08] tracking-[-0.05em]">
                {program.name}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-muted">
                {program.description}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button className="btn-primary" onClick={() => enquire(program.name)}>
                  Enquire about this program <Icon name="arrowUp" size={19} />
                </button>
                <button className="btn-secondary" onClick={() => enquire("Free Demo Class")}>
                  <Icon name="chat" size={19} /> Book a free demo class
                </button>
              </div>
            </div>

            <div className="program-art relative hidden aspect-square max-w-sm rounded-3xl border border-brand/15 bg-raised lg:block">
              <div className="program-art-grid" />
              <div className="program-art-ring ring-large" />
              <div className="program-art-ring ring-small" />
              <div className="program-emblem">
                <Icon name={program.icon} size={64} />
              </div>
              <span className="absolute bottom-5 left-6 font-mono text-[11px] tracking-widest text-brand/65">
                BT / {program.code}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Skills ----------------------------------------------------- */}
      <section className="section-space">
        <div className="container-shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="WHAT YOU’LL LEARN"
              title="The skills this program builds"
              description="Each area is taught through guided builds rather than lectures alone, so you finish with something that runs."
            />
          </div>

          <ul className="grid gap-4 sm:grid-cols-2">
            {program.skills.map((skill, index) => (
              <Reveal key={skill} delay={(index % 2) * 0.05}>
                <li className="flex h-full items-start gap-3 rounded-2xl border border-line bg-raised p-5">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-tint text-brand">
                    <Icon name="check" size={15} />
                  </span>
                  <span className="text-sm font-semibold leading-6">{skill}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* How it runs ------------------------------------------------ */}
      <section className="section-space border-y border-line bg-tint/40">
        <div className="container-shell">
          <SectionHeading
            eyebrow="HOW THE PROGRAM RUNS"
            title="From first concept to placement support"
            description="Every BitTrix program follows the same three phases. Only the domain content changes."
            centered
          />

          <div className="grid gap-6 md:grid-cols-3">
            {journeyPhases.map((phase, index) => (
              <Reveal key={phase.phase} delay={index * 0.07}>
                <div className="h-full rounded-3xl border border-line bg-raised p-7">
                  <span className="font-mono text-xs text-purple">{phase.no}</span>
                  <h3 className="mt-2 text-xl font-bold tracking-tight">{phase.phase}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{phase.note}</p>
                  <ul className="mt-5 space-y-3 border-t border-line pt-5">
                    {phase.steps.map((step) => (
                      <li key={step} className="flex items-start gap-2.5 text-sm text-muted">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Careers ---------------------------------------------------- */}
      <section className="section-space">
        <div className="container-shell">
          <SectionHeading
            eyebrow="WHERE IT LEADS"
            title={<>Roles this program prepares you for</>}
            description="Job titles vary between companies. These are the directions graduates of this track typically aim for."
            centered
          />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {program.careers.map((career, index) => (
              <Reveal key={career} delay={index * 0.05}>
                <div className="h-full rounded-2xl border border-brand/15 bg-tint/50 p-6">
                  <span className="font-mono text-[11px] text-purple">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-base font-bold leading-6 tracking-tight">
                    {career}
                  </h3>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-10 rounded-2xl border border-line bg-raised p-6 text-sm leading-7 text-muted">
            <strong className="font-semibold text-ink">Before you enrol:</strong>{" "}
            duration, fees, batch schedule, prerequisites and certification
            details depend on the track and the mode you choose. Ask a mentor for
            the current syllabus and schedule — we will not quote figures here
            that may be out of date by the time you read them.
          </p>
        </div>
      </section>

      {/* Other programs --------------------------------------------- */}
      <section className="section-space border-t border-line bg-tint/40">
        <div className="container-shell">
          <h2 className="section-title mb-8 text-2xl">Other programs</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((item) => (
              <Link
                key={item.id}
                to={`/programs/${item.id}`}
                className="group flex items-center gap-3 rounded-2xl border border-line bg-raised p-5 transition-colors hover:border-brand/40"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tint text-brand">
                  <Icon name={item.icon} size={20} />
                </span>
                <span className="text-sm font-bold leading-5 tracking-tight">
                  {item.name}
                </span>
                <span className="ml-auto text-brand opacity-0 transition-opacity group-hover:opacity-100">
                  <Icon name="arrow" size={16} />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {program.skills.map((skill) => <Pill key={skill}>{skill}</Pill>)}
          </div>
        </div>
      </section>
    </>
  );
}
