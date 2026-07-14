import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { ValuesGrid } from "@/components/sections/ValuesGrid";
import { Timeline } from "@/components/sections/Timeline";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { CultureGallery } from "@/components/sections/CultureGallery";

export const metadata: Metadata = {
  title: "About",
  description:
    "ProEduvate's story, mission, values, and the team building AI-powered products for EdTech and enterprise.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Software built by people who care what it's for."
        description="ProEduvate started as a small team frustrated with clunky institutional software — and grew into a product company building for EdTech and enterprise alike."
      />

      <section className="bg-white py-24 md:py-32">
        <Container className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <AnimatedReveal>
            <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-accent uppercase">
              Our Story
            </p>
            <h2 className="text-3xl font-medium text-black md:text-4xl">Why we started.</h2>
            <p className="mt-5 text-base leading-relaxed text-gray-600">
              {/* STUB: replace with the real founding story before launch. */}
              ProEduvate began with a simple frustration: the software institutions
              relied on to teach, assess, and administer was years behind the
              software everyone used everywhere else. We set out to close that
              gap with our first product, and quickly found the same gap in
              enterprise software built without AI-native thinking. Today we
              build both — our own products, and custom work for clients who
              need the same standard applied to their software.
            </p>
          </AnimatedReveal>

          <div className="grid grid-cols-1 gap-8">
            <AnimatedReveal delay={0.1}>
              <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                Mission
              </p>
              <p className="text-xl font-medium text-black md:text-2xl">
                Build AI-powered software that makes learning and enterprise
                work measurably better, not just more automated.
              </p>
            </AnimatedReveal>
            <AnimatedReveal delay={0.2}>
              <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                Vision
              </p>
              <p className="text-xl font-medium text-black md:text-2xl">
                A world where every institution and enterprise team has
                access to software as capable as the biggest tech companies&apos;.
              </p>
            </AnimatedReveal>
          </div>
        </Container>
      </section>

      <Timeline />
      <ValuesGrid expanded />
      <TeamGrid />
      <CultureGallery />
    </>
  );
}
