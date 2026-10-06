import { PageCrumbs } from "../components/ui";
import { FAQ, PageCta } from "../components/sections";

export default function FaqPage() {
  return (
    <>
      <FAQ crumbs={<PageCrumbs current="FAQ" />} />

      <PageCta to="/contact" label="Ask your question" afterBand />
    </>
  );
}
