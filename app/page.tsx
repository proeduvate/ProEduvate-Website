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
import {
  getClientLogos,
  getProducts,
  getServices,
  getInternReviews,
  getJobs,
  getInternships,
  getSectors,
  getStats,
  getValues,
} from "@/lib/content";

export default async function Home() {
  const [clientLogos, stats, sectors, values, internReviews, jobs, internships, products, services] =
    await Promise.all([
      getClientLogos(),
      getStats(),
      getSectors(),
      getValues(),
      getInternReviews(),
      getJobs(),
      getInternships(),
      getProducts(),
      getServices(),
    ]);

  return (
    <>
      <Hero openRoles={jobs.length + internships.length} />
      <LogoStrip items={clientLogos} />
      <SloganBand />
      <StatsBand stats={stats} />
      <SectorRing sectors={sectors} />
      <CapabilityGraph products={products} services={services} />
      <SignalShowcase />
      <GrowthRoadmap values={values} />
      <InternReviews internReviews={internReviews} />
      <CareersTeaser jobs={jobs} internships={internships} />
      <FinalCta />
    </>
  );
}
