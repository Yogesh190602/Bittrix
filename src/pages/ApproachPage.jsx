import { PageCrumbs } from "../components/ui";
import { Benefits, LearningJourney, PageCta } from "../components/sections";

export default function ApproachPage() {
  return (
    <>
      <LearningJourney crumbs={<PageCrumbs current="Our Approach" />} />
      <Benefits />

      <PageCta to="/contact" label="Ask how it works" />
    </>
  );
}
