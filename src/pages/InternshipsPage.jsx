import { PageCrumbs } from "../components/ui";
import { Internships, PageCta } from "../components/sections";

export default function InternshipsPage() {
  return (
    <>
      <Internships crumbs={<PageCrumbs current="Internships" />} />

      <PageCta to="/contact" label="Ask about internships" />
    </>
  );
}
