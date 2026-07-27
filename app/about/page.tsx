import type { Metadata } from "next";
import { Quote } from "lucide-react";
import { AboutHero } from "@/components/sections/AboutHero";
import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { ValuesGrid } from "@/components/sections/ValuesGrid";
import { Timeline } from "@/components/sections/Timeline";
import { Achievements } from "@/components/sections/Achievements";
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
      <AboutHero />

      <section className="bg-surface py-24 md:py-32">
        <Container className="grid grid-cols-1 gap-16 lg:grid-cols-[1.2fr_1fr]">
          <AnimatedReveal>
            <Quote className="h-10 w-10 text-accent/30" aria-hidden="true" />
            <p className="mt-4 text-xs font-semibold tracking-[0.2em] text-accent uppercase">
              Our Story
            </p>
            <h2 className="mt-2 text-4xl font-medium text-chalk md:text-5xl">
              Why we started.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-400">
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

          <div className="grid grid-cols-1 gap-10">
            <AnimatedReveal delay={0.1}>
              <div className="border-l-2 border-accent pl-6">
                <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                  Mission
                </p>
                <p className="text-2xl font-medium text-chalk md:text-3xl">
                  Build AI-powered software that makes learning and enterprise
                  work measurably better, not just more automated.
                </p>
              </div>
            </AnimatedReveal>
            <AnimatedReveal delay={0.2}>
              <div className="border-l-2 border-white/10 pl-6">
                <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-accent uppercase">
                  Vision
                </p>
                <p className="text-2xl font-medium text-chalk md:text-3xl">
                  A world where every institution and enterprise team has
                  access to software as capable as the biggest tech companies&apos;.
                </p>
              </div>
            </AnimatedReveal>
          </div>
        </Container>
      </section>

      <Timeline />
      <Achievements />
      <ValuesGrid expanded />
      <TeamGrid />
      <CultureGallery />
    </>
  );
}
