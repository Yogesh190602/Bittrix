import { SITE, CONTACT } from "../data/site";
import { programs, programBySlug } from "../data/programs";
import { faqs, journey } from "../data/content";

const DEFAULT_IMAGE = "/og-cover.png";

function abs(path) {
  return `${SITE.origin}${path}`;
}

const organisation = {
  "@type": "EducationalOrganization",
  "@id": abs("/#organisation"),
  name: SITE.name,
  url: SITE.origin,
  slogan: SITE.tagline,
  description:
    "Technology education in Theni, Tamil Nadu: cybersecurity, artificial intelligence, blockchain, networking, web engineering and game development, taught through practical projects, mentorship and internships.",
  address: {
    "@type": "PostalAddress",
    addressLocality: SITE.locality,
    addressRegion: SITE.region,
    addressCountry: SITE.country,
  },
  ...(CONTACT.email ? { email: CONTACT.email } : {}),
  ...(CONTACT.phone ? { telephone: CONTACT.phone } : {}),
  ...(() => {
    const profiles = [CONTACT.instagram, CONTACT.linkedin, CONTACT.youtube].filter(Boolean);
    return profiles.length ? { sameAs: profiles } : {};
  })(),
};

function breadcrumbs(trail) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, path], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: abs(path),
    })),
  };
}

function courseFor(program) {
  return {
    "@type": "Course",
    name: `${program.name} Program`,
    description: program.description,
    url: abs(`/programs/${program.id}`),
    provider: { "@id": abs("/#organisation") },
    teaches: program.skills,
    occupationalCredentialAwarded: "Program completion certificate",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: ["Onsite", "Online", "Blended"],
      courseWorkload: "Varies by track — confirm with a mentor",
      location: {
        "@type": "Place",
        address: {
          "@type": "PostalAddress",
          addressLocality: SITE.locality,
          addressRegion: SITE.region,
          addressCountry: SITE.country,
        },
      },
    },
  };
}

/* One function drives <head> for both the prerenderer and the client. */
export function metaFor(pathname) {
  const path = pathname.replace(/\/+$/, "") || "/";
  const graph = [organisation];

  if (path === "/") {
    graph.push(
      {
        "@type": "WebSite",
        url: SITE.origin,
        name: SITE.name,
        publisher: { "@id": abs("/#organisation") },
      },
    );

    return {
      title: `${SITE.name} | Technology Training in Theni, Tamil Nadu`,
      description:
        "Learn cybersecurity, artificial intelligence, blockchain, networking, web engineering or game development in Theni. Project-based training, industry mentorship, internships and placement support.",
      path: "/",
      graph,
    };
  }

  if (path === "/about") {
    graph.push(breadcrumbs([["Home", "/"], ["About", "/about"]]), {
      "@type": "AboutPage",
      url: abs("/about"),
      mainEntity: { "@id": abs("/#organisation") },
    });
    return {
      title: `About ${SITE.name} | Technology Training in Theni`,
      description:
        "Who we are and how we teach: BitTrix Technologies builds future engineers in Theni, Tamil Nadu through practical education, real projects, internships and career mentorship.",
      path,
      graph,
    };
  }

  if (path === "/approach") {
    graph.push(breadcrumbs([["Home", "/"], ["Our Approach", "/approach"]]), {
      "@type": "HowTo",
      name: "How a BitTrix program runs, from enrolment to placement",
      description:
        "Eleven tracked stages grouped into three phases: foundation, build and launch.",
      step: journey.map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step,
      })),
    });
    return {
      title: `Our Approach | ${SITE.name}`,
      description:
        "Eleven tracked stages from enrolment to placement, grouped into three phases. See exactly how a BitTrix program runs before you enrol.",
      path,
      graph,
    };
  }

  if (path === "/faq") {
    graph.push(breadcrumbs([["Home", "/"], ["FAQ", "/faq"]]), {
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    });
    return {
      title: `Frequently Asked Questions | ${SITE.name}`,
      description:
        "Prerequisites, internships, certificates, duration, remote learning and placement support — the questions students ask before enrolling at BitTrix Technologies.",
      path,
      graph,
    };
  }

  if (path === "/programs") {
    graph.push(
      breadcrumbs([["Home", "/"], ["Programs", "/programs"]]),
      {
        "@type": "ItemList",
        itemListElement: programs.map((program, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: abs(`/programs/${program.id}`),
          name: program.name,
        })),
      },
    );

    return {
      title: `Technology Programs | ${SITE.name}`,
      description:
        "Six technology programs — cybersecurity, artificial intelligence, blockchain, networking, web engineering and game development. Compare the skills each one builds and the roles it opens.",
      path,
      graph,
    };
  }

  if (path.startsWith("/programs/")) {
    const program = programBySlug(path.slice("/programs/".length));
    if (program) {
      graph.push(
        breadcrumbs([
          ["Home", "/"],
          ["Programs", "/programs"],
          [program.name, `/programs/${program.id}`],
        ]),
        courseFor(program),
      );

      return {
        title: `${program.name} Course in Theni | ${SITE.name}`,
        description: `${program.description} Learn ${program.skills.slice(0, 3).join(", ")} and more, with mentorship, real projects and an internship stage.`,
        path,
        graph,
      };
    }
  }

  if (path === "/internships") {
    graph.push(breadcrumbs([["Home", "/"], ["Internships", "/internships"]]));
    return {
      title: `Internship Program | ${SITE.name}`,
      description:
        "Move from training into a real team. The BitTrix internship stage puts your work in front of a mentor with real tickets, workflows and deadlines.",
      path,
      graph,
    };
  }

  if (path === "/contact") {
    graph.push(breadcrumbs([["Home", "/"], ["Contact", "/contact"]]));
    return {
      title: `Contact & Free Demo Class | ${SITE.name}`,
      description:
        "Book a free demo class or talk to a mentor about a learning path that fits your goals. BitTrix Technologies, Theni, Tamil Nadu.",
      path,
      graph,
    };
  }

  if (path === "/privacy") {
    return {
      title: `Privacy Policy | ${SITE.name}`,
      description: "How BitTrix Technologies handles the information you submit through this website.",
      path,
      graph,
      noindex: false,
    };
  }

  if (path === "/terms") {
    return {
      title: `Terms of Use | ${SITE.name}`,
      description: "The terms that apply to your use of the BitTrix Technologies website.",
      path,
      graph,
    };
  }

  return {
    title: `Page not found | ${SITE.name}`,
    description: "This page does not exist.",
    path,
    graph: [],
    noindex: true,
  };
}

export function headTagsFor(pathname) {
  const meta = metaFor(pathname);
  const url = abs(meta.path);
  const image = abs(DEFAULT_IMAGE);

  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE.name)}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
  ];

  if (meta.noindex) tags.push(`<meta name="robots" content="noindex, follow" />`);

  if (meta.graph.length) {
    const jsonLd = JSON.stringify({ "@context": "https://schema.org", "@graph": meta.graph });
    tags.push(
      `<script type="application/ld+json">${jsonLd.replace(/</g, "\\u003c")}</script>`,
    );
  }

  return tags.join("\n    ");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
