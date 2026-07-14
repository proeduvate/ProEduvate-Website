import { Hero } from "@/components/sections/Hero";
import { LogoStrip } from "@/components/sections/LogoStrip";
import { StatsBand } from "@/components/sections/StatsBand";
import { Pillars } from "@/components/sections/Pillars";
import { ProductsPreview } from "@/components/sections/ProductsPreview";
import { ServicesPreview } from "@/components/sections/ServicesPreview";
import { Statement } from "@/components/sections/Statement";
import { ValuesGrid } from "@/components/sections/ValuesGrid";
import { Testimonials } from "@/components/sections/Testimonials";
import { CareersTeaser } from "@/components/sections/CareersTeaser";
import { FinalCta } from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <LogoStrip />
      <StatsBand />
      <Pillars />
      <ProductsPreview />
      <ServicesPreview />
      <Statement text="We don't just build software. We build what education and enterprise will run on next." />
      <ValuesGrid />
      <Testimonials />
      <CareersTeaser />
      <FinalCta />
    </>
  );
}
