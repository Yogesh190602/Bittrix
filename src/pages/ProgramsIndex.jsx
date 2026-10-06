import { Link } from "react-router-dom";
import { programs } from "../data/programs";
import { Icon, PageCrumbs, Pill, Reveal, SectionHeading } from "../components/ui";
import { PageCta } from "../components/sections";

export default function ProgramsIndex() {
  return (
    <>
      <section className="section-space page-first">
        <div className="container-shell">
          <PageCrumbs current="Programs" />

          {/* One straight line from lg up; the break only applies on smaller
              screens, where the title would not fit on one line. */}
          <SectionHeading
            wide
            eyebrow="SIX DOMAINS. ONE STANDARD."
            title={<>Choose the field.{" "}<br className="lg:hidden" /><span className="text-brand">We’ll handle the structure.</span></>}
            description="Every program runs the same way: foundations first, then guided builds, then real projects, then an internship where a mentor reviews your work. Pick the domain that interests you."
          />

          <div className="grid gap-6 lg:grid-cols-2">
          {programs.map((program, index) => (
            <Reveal key={program.id} delay={(index % 2) * 0.06}>
              <article className="flex h-full flex-col rounded-3xl border border-line bg-raised p-8 transition-shadow hover:shadow-[0_26px_56px_var(--c-shadow-brand)]">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fill text-onfill">
                    <Icon name={program.icon} size={24} />
                  </span>
                  <div>
                    <p className="font-mono text-[11px] tracking-widest text-purple">
                      {program.code} / DOMAIN
                    </p>
                    <h2 className="text-2xl font-bold tracking-tight">{program.name}</h2>
                  </div>
                </div>

                <p className="mt-5 text-sm leading-7 text-muted">{program.description}</p>

                <h3 className="mb-3 mt-6 text-xs font-bold">Skills you’ll build</h3>
                <div className="flex flex-wrap gap-1.5">
                  {program.skills.map((skill) => <Pill key={skill}>{skill}</Pill>)}
                </div>

                <h3 className="mb-2 mt-6 text-xs font-bold">Roles it opens</h3>
                <p className="text-xs leading-6 text-muted">{program.careers.join(" · ")}</p>

                <Link
                  to={`/programs/${program.id}`}
                  className="btn-primary mt-8 self-start"
                >
                  Explore {program.name} <Icon name="arrow" size={18} />
                </Link>
              </article>
            </Reveal>
          ))}
          </div>
        </div>
      </section>

      <PageCta to="/contact" label="Talk to a mentor" />
    </>
  );
}
