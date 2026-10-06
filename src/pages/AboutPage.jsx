import { PageCrumbs } from "../components/ui";
import { About, PageCta, TrustSection, WhyChoose } from "../components/sections";

export default function AboutPage() {
  return (
    <>
      <About crumbs={<PageCrumbs current="About" />} />
      <TrustSection />
      <WhyChoose />

      <PageCta to="/contact" label="Talk to a mentor" afterBand />
    </>
  );
}
