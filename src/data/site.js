/* Single source of truth for business facts, routes and shared content. */

/* ------------------------------------------------------------------ */
/* VERIFY BEFORE LAUNCH — every value below is published on the site.  */
/* Leave a field empty and the UI degrades honestly instead of showing */
/* a placeholder that looks real.                                      */
/* ------------------------------------------------------------------ */
export const SITE = {
  name: "BitTrix Technologies",
  tagline: "Build Skills. Create Solutions. Shape the Future.",
  locality: "Theni",
  region: "Tamil Nadu",
  country: "IN",
  /* Set to the final domain before launch: used for canonical URLs, */
  /* sitemap.xml, robots.txt and social share cards. */
  origin: "https://www.bittrixtechnologies.com",
};

/* Replace placeholders with verified business information before launch. */
export const CONTACT = {
  phone: "",
  email: "",
  whatsapp: "", // International digits only, e.g. 91XXXXXXXXXX
  instagram: "",
  linkedin: "",
  youtube: "",
  endpoint: import.meta.env.VITE_CONTACT_ENDPOINT || "",
};

export const navigation = [
  ["Home", "/"],
  ["About", "/about"],
  ["Programs", "/programs"],
  ["Our Approach", "/approach"],
  ["Internships", "/internships"],
  ["FAQ", "/faq"],
  ["Contact", "/contact"],
];

export const footerLinks = [
  ["About Us", "/about"],
  ["Programs", "/programs"],
  ["Our Approach", "/approach"],
  ["Internships", "/internships"],
  ["FAQ", "/faq"],
  ["Contact", "/contact"],
];
