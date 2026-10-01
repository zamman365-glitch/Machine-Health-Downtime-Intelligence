import React from "react";
import { HeroSection } from "../components/landing/HeroSection";
import { TechStrip } from "../components/landing/TechStrip";
import { ProblemSolution } from "../components/landing/ProblemSolution";
import { FeaturesGrid } from "../components/landing/FeaturesGrid";
import { HowItWorks } from "../components/landing/HowItWorks";
import { LiveDemoTeaser } from "../components/landing/LiveDemoTeaser";
import { ModelDataSection } from "../components/landing/ModelDataSection";
import { FaqAccordion } from "../components/landing/FaqAccordion";
import { Footer } from "../components/landing/Footer";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <main>
        <HeroSection />
        <TechStrip />
        <ProblemSolution />
        <FeaturesGrid />
        <HowItWorks />
        <LiveDemoTeaser />
        <ModelDataSection />
        <FaqAccordion />
      </main>
      <Footer />
    </div>
  );
}
