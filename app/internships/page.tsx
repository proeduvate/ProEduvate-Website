import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProgramOverview } from "@/components/sections/ProgramOverview";
import { TracksGrid } from "@/components/sections/TracksGrid";
import { InternshipsBrowser } from "@/components/sections/InternshipsBrowser";
import { WhatYoullGain } from "@/components/sections/WhatYoullGain";
import { HowToApply } from "@/components/sections/HowToApply";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata: Metadata = {
  title: "Internships",
  description:
    "Remote internships at ProEduvate across AI/ML, full stack, backend, product development, digital marketing, social media, and HR.",
};

export default function InternshipsPage() {
  return (
    <>
      <PageHero
        eyebrow="Internships"
        title="Start your career on real products, not busywork."
        description="Our internship program puts you on shipped features with a mentor from day one — across AI/ML, engineering, design, content, and marketing."
      />

      <ProgramOverview />
      <TracksGrid />

      <section id="open-roles" className="bg-surface py-20 md:py-28">
        <Container>
          <SectionHeading eyebrow="Open Internship Roles" title="Current openings." />
          <div className="mt-10">
            <InternshipsBrowser />
          </div>
        </Container>
      </section>

      <WhatYoullGain />
      <HowToApply />

      <CtaBand
        title="Ready to apply?"
        description="Browse open roles above, or reach out if you don't see your track yet."
        ctaLabel="View Open Roles"
        ctaHref="#open-roles"
      />
    </>
  );
}
