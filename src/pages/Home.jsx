import {
  About,
  FaqTeaser,
  Hero,
  InternshipTeaser,
  PageCta,
  Programs,
  TrustSection,
} from "../components/sections";
import { Curriculum } from "../components/Curriculum";
import { Testimonials } from "../components/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustSection />
      <About compact />
      <Programs />
      <Curriculum />
      <InternshipTeaser />
      <Testimonials />
      <FaqTeaser />

      <PageCta to="/contact" label="Start the conversation" afterBand />
    </>
  );
}
