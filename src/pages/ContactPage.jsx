import { PageCrumbs } from "../components/ui";
import { ContactSection, PageCta } from "../components/sections";

export default function ContactPage() {
  return (
    <>
      <ContactSection crumbs={<PageCrumbs current="Contact" />} />
      <PageCta />
    </>
  );
}
