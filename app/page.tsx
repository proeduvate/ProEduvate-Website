import { Hero } from "@/components/sections/Hero";
import { LogoStrip } from "@/components/sections/LogoStrip";
import { StatsBand } from "@/components/sections/StatsBand";
import { SectorRing } from "@/components/sections/SectorRing";
import { ProductsPreview } from "@/components/sections/ProductsPreview";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { SignalShowcase } from "@/components/sections/SignalShowcase";
import { ValuesGrid } from "@/components/sections/ValuesGrid";
import { InternReviews } from "@/components/sections/InternReviews";
import { CareersTeaser } from "@/components/sections/CareersTeaser";
import { FinalCta } from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <LogoStrip />
      <StatsBand />
      <SectorRing />
      <ProductsPreview />
      <ServicesPreview />
      <SignalShowcase />
      <ValuesGrid />
      <InternReviews />
      <CareersTeaser />
      <FinalCta />
    </>
  );
}
