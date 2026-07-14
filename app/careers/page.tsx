import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BenefitsGrid } from "@/components/sections/BenefitsGrid";
import { CareersBrowser } from "@/components/sections/CareersBrowser";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Full-time and part-time roles at ProEduvate across engineering, design, AI/ML, EdTech content, marketing, and operations.",
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build your career at ProEduvate."
        description="We hire full-time and part-time across engineering, design, AI/ML, and content — for people who want their work to matter beyond the sprint."
      />

      <BenefitsGrid />

      <section className="bg-off-white py-20 md:py-28">
        <Container>
          <SectionHeading eyebrow="Open Positions" title="Find your next role." />
          <div className="mt-10">
            <CareersBrowser />
          </div>
        </Container>
      </section>

      <CtaBand
        title="Don't see your role?"
        description="Send us your resume anyway — we review general applications for every department."
        ctaLabel="Send General Application"
        ctaHref="mailto:careers@proeduvate.in"
      />
    </>
  );
}
