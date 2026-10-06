import { Link } from "react-router-dom";
import { CONTACT, SITE } from "../data/site";
import { PageCrumbs } from "../components/ui";

function Prose({ title, updated, children }) {
  return (
    <section className="section-space page-first">
      <div className="container-shell max-w-3xl">
        <PageCrumbs current={title} />

        <h1 className="section-title">{title}</h1>
        <p className="mt-4 text-xs font-semibold tracking-[0.12em] text-muted">
          LAST UPDATED {updated}
        </p>

        <div className="prose-legal mt-10">{children}</div>

        <p className="mt-12 rounded-2xl border border-line bg-tint/50 p-6 text-sm leading-7 text-muted">
          Questions about anything on this page?{" "}
          <Link to="/contact" className="font-semibold text-brand">Contact us</Link>
          {CONTACT.email ? <> or email <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.</> : "."}
        </p>
      </div>
    </section>
  );
}

export function PrivacyPage() {
  return (
    <Prose title="Privacy Policy" updated="SEPTEMBER 2026">
      <p>
        This policy describes what {SITE.name} collects through this website
        and what we do with it. It covers this website only.
      </p>

      <h2>What this site collects</h2>
      <p>
        The enquiry form is the only place this website collects personal
        information. When you submit it, you send us:
      </p>
      <ul>
        <li>your name;</li>
        <li>your phone number;</li>
        <li>your email address;</li>
        <li>the program or topic you selected;</li>
        <li>the learning mode you selected;</li>
        <li>anything you type into the message field.</li>
      </ul>
      <p>
        You choose what to put in these fields. Please do not include payment
        details, identity document numbers or other sensitive information in
        the message box — we do not need them to answer an enquiry.
      </p>

      <h2>What we use it for</h2>
      <p>
        We use what you send to reply to your enquiry: to answer your
        questions, to share syllabus, schedule and fee details, and to arrange
        a demo class or a conversation with a mentor. We do not sell it, rent
        it, or pass it to third parties for their own marketing.
      </p>

      <h2>Cookies and tracking</h2>
      <p>
        This website sets no cookies. It runs no advertising pixels and no
        third-party analytics. Nothing about your visit is stored in your
        browser, and we do not build a profile of you from your browsing.
      </p>

      <h2>How the form is delivered</h2>
      <p>
        Submitting the form sends your details over an encrypted connection to
        the form service we use to receive enquiries. That service processes
        the message on our behalf so it reaches our team.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask us what enquiry details we hold about you, ask us to
        correct them, or ask us to delete them. Contact us and we will act on
        the request. You can also simply not use the form — the site lists
        other ways to reach us.
      </p>

      <h2>Changes</h2>
      <p>
        If we change how this site handles information, we will update this
        page and the date above.
      </p>
    </Prose>
  );
}

export function TermsPage() {
  return (
    <Prose title="Terms of Use" updated="SEPTEMBER 2026">
      <p>
        These terms apply to your use of this website. They are not an
        enrolment agreement — enrolling in a program is a separate arrangement
        made directly with {SITE.name}.
      </p>

      <h2>About the information on this site</h2>
      <p>
        We publish this site to describe our programs accurately. Even so,
        details change. Program duration, fees, batch schedules,
        prerequisites, certifications and internship availability are{" "}
        <strong>confirmed by a mentor at the time you enquire</strong>, not by
        this website. Where those details are not stated here, that is
        deliberate rather than an omission.
      </p>

      <h2>Outcomes</h2>
      <p>
        We provide training, mentorship, project work, internship stages and
        placement support as described in each program. We do not guarantee
        employment, a particular salary, or a specific interview outcome. Job
        titles listed under a program indicate common career directions in
        that field, not offers.
      </p>

      <h2>Using the enquiry form</h2>
      <p>
        Please submit accurate contact details and use the form for genuine
        enquiries. We may decline to respond to submissions that are abusive,
        automated or misleading.
      </p>

      <h2>Content on this site</h2>
      <p>
        The text, design, illustrations and code of this website belong to{" "}
        {SITE.name}. You are welcome to read, link to and share it. Please ask
        before republishing it as your own.
      </p>

      <h2>External links</h2>
      <p>
        Where this site links to another organisation, we are not responsible
        for that site’s content or its handling of your information.
      </p>
    </Prose>
  );
}
