import { DemoSection } from "@/features/landing/demo-section";
import { Engineering } from "@/features/landing/engineering";
import { Features } from "@/features/landing/features";
import { Hero } from "@/features/landing/hero";
import { HowItWorks } from "@/features/landing/how-it-works";
import { LandingFooter } from "@/features/landing/landing-footer";
import { LandingNav } from "@/features/landing/landing-nav";
import { Showcase } from "@/features/landing/showcase";

export default function LandingPage() {
  return (
    <>
      <LandingNav />
      <main id="main" className="flex-1">
        <Hero />
        <HowItWorks />
        <Features />
        <Showcase />
        <DemoSection />
        <Engineering />
      </main>
      <LandingFooter />
    </>
  );
}
