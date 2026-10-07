import { LandingNav } from "../components/landing/LandingNav";
import { Hero } from "../components/landing/Hero";
import { StickyScrollStory } from "../components/landing/StickyScrollStory";
import { SwipeableContactCards } from "../components/landing/SwipeableContactCards";
import { StatsStrip } from "../components/landing/StatsStrip";
import { FeatureGrid } from "../components/landing/FeatureGrid";
import { CtaBanner } from "../components/landing/CtaBanner";
import { Footer } from "../components/landing/Footer";

export function Landing() {
  return (
    <div className="min-h-svh bg-white">
      <LandingNav />
      <Hero />
      <StickyScrollStory />
      <SwipeableContactCards />
      <StatsStrip />
      <FeatureGrid />
      <CtaBanner />
      <Footer />
    </div>
  );
}
