"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { usePointerTilt } from "@/lib/usePointerTilt";

/*
 * Founding story, mission and vision as three panels at different depths
 * rather than a two-column text block.
 *
 * The story sits closest to the viewer and the two statements recede behind
 * it, so the section has the same layered feel as the rest of the site
 * without turning prose into decoration.
 */

const STATEMENTS = [
  {
    label: "Mission",
    body: "Build AI-powered software that makes learning and enterprise work measurably better, not just more automated.",
    z: -60,
  },
  {
    label: "Vision",
    body: "A world where every institution and enterprise team has access to software as capable as the biggest tech companies'.",
    z: -130,
  },
];

export function FoundingStory() {
  const { ref: tiltRef, style: tiltStyle, shouldReduceMotion } = usePointerTilt({ max: 6, maxX: 4 });

  return (
    <section className="relative overflow-hidden bg-surface py-24 md:py-32">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

      <Container className="relative">
        <SectionHeading
          index="01"
          eyebrow="Our Story"
          title="Why we started."
          description="The gap we set out to close, and the standard we hold ourselves to while closing it."
        />
      </Container>

      <div ref={tiltRef} className="relative mt-16" style={{ perspective: "1500px" }}>
        <motion.div style={tiltStyle ?? undefined}>
          <Container>
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
              <motion.div
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="border border-white/10 bg-white/[0.03] p-8 md:p-10"
                style={shouldReduceMotion ? undefined : { transform: "translateZ(50px)" }}
              >
                <p className="label-micro text-accent">The gap</p>
                {/* STUB: replace with the real founding story before launch. */}
                <p className="mt-6 text-lg leading-relaxed text-gray-300 md:text-xl">
                  ProEduvate began with a simple frustration: the software institutions
                  relied on to teach, assess, and administer was years behind the software
                  everyone used everywhere else. We set out to close that gap with our
                  first product, and quickly found the same gap in enterprise software
                  built without AI-native thinking.
                </p>
                <p className="mt-5 text-base leading-relaxed text-gray-400">
                  Today we build both — our own products, and custom work for clients who
                  need the same standard applied to their software.
                </p>
              </motion.div>

              <div className="flex flex-col gap-8" style={{ transformStyle: "preserve-3d" }}>
                {STATEMENTS.map((statement, i) => (
                  <motion.div
                    key={statement.label}
                    // Depth goes through motion props, not an inline
                    // transform: motion owns `transform` while animating and
                    // would overwrite it.
                    initial={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: 28, z: statement.z }
                    }
                    whileInView={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 1, y: 0, z: statement.z }
                    }
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{
                      duration: 0.6,
                      delay: 0.1 + i * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="border-l-2 border-accent/70 pl-6"
                  >
                    <p className="label-micro text-accent">{statement.label}</p>
                    <p className="display-md mt-4 text-chalk">{statement.body}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </Container>
        </motion.div>
      </div>
    </section>
  );
}
