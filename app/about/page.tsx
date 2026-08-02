import type { Metadata } from "next";
import { AboutHero } from "@/components/sections/AboutHero";
import { FoundingStory } from "@/components/sections/FoundingStory";
import { GrowthRoadmap } from "@/components/sections/GrowthRoadmap";
import { TimelineRail } from "@/components/sections/TimelineRail";
import { Achievements } from "@/components/sections/Achievements";
import { OrgChart } from "@/components/sections/OrgChart";
import { CultureGallery } from "@/components/sections/CultureGallery";

export const metadata: Metadata = {
  title: "About",
  description:
    "ProEduvate's story, mission, values, and the team building AI-powered products for EdTech and enterprise.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <FoundingStory />
      <TimelineRail />
      <Achievements />
      <GrowthRoadmap expanded />
      <OrgChart />
      <CultureGallery />
    </>
  );
}
