import { BlendsSection } from "@/components/landing/blends-section";
import { CtaSection } from "@/components/landing/cta-section";
import { DiscoverSection } from "@/components/landing/discover-section";
import { FeedbackSection } from "@/components/landing/feedback-section";
import { HeroSection } from "@/components/landing/hero-section";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingNav } from "@/components/landing/landing-nav";
import { SubscribeSection } from "@/components/landing/subscribe-section";
import { WhySection } from "@/components/landing/why-section";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#fffefc]">
      <LandingNav />
      <HeroSection />
      <DiscoverSection />
      <BlendsSection />
      <WhySection />
      <CtaSection />
      <FeedbackSection />
      <SubscribeSection />
      <LandingFooter />
    </main>
  );
}