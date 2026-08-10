import type { Metadata } from "next";
import { AboutHero } from "@/components/sections/AboutHero";
import { FoundingStory } from "@/components/sections/FoundingStory";
import { CeoSpotlight } from "@/components/sections/CeoSpotlight";
import { GrowthRoadmap } from "@/components/sections/GrowthRoadmap";
import { TimelineRail } from "@/components/sections/TimelineRail";
import { Achievements } from "@/components/sections/Achievements";
import { OrgChart } from "@/components/sections/OrgChart";
import { CultureGallery } from "@/components/sections/CultureGallery";
import {
  getAchievementHighlights,
  getProducts,
  getSectors,
  getServices,
  getCeo,
  getCoreTeam,
  getMilestones,
  getMonthlyStars,
  getOrgSeats,
  getRecognitions,
  getStats,
  getValues,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "ProEduvate's story, mission, values, and the team building AI-powered products for EdTech and enterprise.",
};

export default async function AboutPage() {
  const [
    stats, ceo, timeline, highlights, stars, recognitions, values, orgSeats, coreTeam,
    products, sectors, services,
  ] = await Promise.all([
      getStats(),
      getCeo(),
      getMilestones(),
      getAchievementHighlights(),
      getMonthlyStars(),
      getRecognitions(),
      getValues(),
      getOrgSeats(),
      getCoreTeam(),
      getProducts(),
      getSectors(),
      getServices(),
    ]);

  return (
    <>
      <AboutHero stats={stats} />
      <FoundingStory
        productCount={products.length}
        sectorCount={sectors.length}
        serviceCount={services.length}
      />
      <CeoSpotlight ceo={ceo} />
      <TimelineRail timeline={timeline} />
      <Achievements highlights={highlights} monthlyStars={stars} recognitions={recognitions} />
      <GrowthRoadmap values={values} expanded />
      <OrgChart spine={orgSeats.spine} branch={orgSeats.branch} coreTeam={coreTeam} />
      <CultureGallery />
    </>
  );
}
