import { Link } from "react-router-dom";
import { programs } from "../data/programs";
import { Icon } from "../components/ui";

export default function NotFound() {
  return (
    <section className="section-space">
      <div className="container-shell max-w-2xl text-center">
        <p className="font-mono text-sm tracking-widest text-purple">404</p>
        <h1 className="section-title mt-4">This page doesn’t exist.</h1>
        <p className="mt-5 text-base leading-8 text-muted">
          The link may be out of date, or the page may have moved. Here’s the
          way back.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary">
            Back to home <Icon name="arrow" size={18} />
          </Link>
          <Link to="/contact" className="btn-secondary">
            <Icon name="chat" size={18} /> Contact us
          </Link>
        </div>

        <div className="mt-14 border-t border-line pt-10">
          <h2 className="mb-5 text-xs font-bold tracking-[0.15em] text-muted">
            OR JUMP TO A PROGRAM
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {programs.map((program) => (
              <Link
                key={program.id}
                to={`/programs/${program.id}`}
                className="pill hover:border-brand/40"
              >
                {program.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
