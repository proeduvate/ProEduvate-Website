import { Hero } from "@/components/sections/Hero";
import { LogoStrip } from "@/components/sections/LogoStrip";
import { SloganBand } from "@/components/sections/SloganBand";
import { StatsBand } from "@/components/sections/StatsBand";
import { SectorRing } from "@/components/sections/SectorRing";
import { CapabilityGraph } from "@/components/sections/CapabilityGraph";
import { SignalShowcase } from "@/components/sections/SignalShowcase";
import { GrowthRoadmap } from "@/components/sections/GrowthRoadmap";
import { InternReviews } from "@/components/sections/InternReviews";
import { CareersTeaser } from "@/components/sections/CareersTeaser";
import { FinalCta } from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <LogoStrip />
      <SloganBand />
      <StatsBand />
      <SectorRing />
      <CapabilityGraph />
      <SignalShowcase />
      <GrowthRoadmap />
      <InternReviews />
      <CareersTeaser />
      <FinalCta />
    </>
  );
}
