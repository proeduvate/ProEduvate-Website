import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { DomainsGrid } from "@/components/sections/DomainsGrid";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { CustomProjectsGrid } from "@/components/sections/CustomProjectsGrid";
import { Process } from "@/components/sections/Process";
import { LogoStrip } from "@/components/sections/LogoStrip";
import { CtaBand } from "@/components/sections/CtaBand";
import {
  getCustomProjects,
  getDomains,
  getReasons,
  getServices,
  getTechStack,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Custom AI and software development for EdTech and enterprise clients — from platform builds to AI/ML solutions and cloud infrastructure.",
};

export default async function ServicesPage() {
  const [services, domains, reasons, customProjects, techStack] = await Promise.all([
    getServices(),
    getDomains(),
    getReasons(),
    getCustomProjects(),
    getTechStack(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Custom software, built for how you actually work."
        description="ProEduvate's services arm builds custom AI and software solutions for EdTech institutions and enterprise clients — the same craft we apply to our own products."
      />

      <ServicesGrid services={services} />
      <DomainsGrid domains={domains} />
      <WhyChooseUs reasons={reasons} />
      <CustomProjectsGrid customProjects={customProjects} />
      <Process />
      <LogoStrip dark={false} label="Technologies we build with" items={techStack} />

      <CtaBand
        title="Have a project in mind?"
        description="Tell us what you're building — we'll get back to you within two business days."
        ctaLabel="Start a Project"
        ctaHref="/contact"
      />
    </>
  );
}
