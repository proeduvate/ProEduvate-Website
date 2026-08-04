"use client";

import { motion } from "framer-motion";
import { Boxes, Layers, Rocket } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { usePointerTilt } from "@/lib/usePointerTilt";
import { products } from "@/data/products";
import { sectors } from "@/data/sectors";
import { services } from "@/data/services";

/*
 * The founding story as three beats on a receding 3D track, each carrying a
 * real figure from the site's own data rather than sitting as loose prose.
 *
 * Counts are derived, not written down, so the section can't drift out of
 * step with the products, sectors and services lists.
 */

const BEATS = [
  {
    icon: Layers,
    label: "The gap",
    heading: "Institutional software was years behind everything else.",
    body: "The tools institutions relied on to teach, assess and administer felt nothing like the software the same people used every day. That gap was the whole reason to start.",
    figure: `${sectors.length}`,
    figureLabel: "Sectors we now build across",
    z: 60,
  },
  {
    icon: Boxes,
    label: "What we did",
    heading: "We built our own products instead of waiting.",
    body: "Rather than pitch a fix, we shipped one — then found the same gap in enterprise software written without AI-native thinking, and kept going.",
    figure: `${products.length}`,
    figureLabel: "Products built and run in-house",
    z: -20,
  },
  {
    icon: Rocket,
    label: "Where we are",
    heading: "Two halves of one company, one standard.",
    body: "Today we run our own product line and take on client work that needs the same standard applied. Same team, same bar, whichever side it comes from.",
    figure: `${services.length}`,
    figureLabel: "Service lines offered to clients",
    z: -100,
  },
];

const STATEMENTS = [
  {
    label: "Mission",
    body: "Build AI-powered software that makes learning and enterprise work measurably better, not just more automated.",
  },
  {
    label: "Vision",
    body: "A world where every institution and enterprise team has access to software as capable as the biggest tech companies'.",
  },
];

export function FoundingStory() {
  const { ref: tiltRef, style: tiltStyle, shouldReduceMotion } = usePointerTilt({
    max: 6,
    maxX: 4,
  });

  return (
    <section className="relative overflow-hidden bg-surface py-24 md:py-32">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="animate-[--animate-aurora-slow] pointer-events-none absolute -right-20 top-1/4 h-[45vh] w-[45vh] rounded-full opacity-25 blur-[130px]"
        style={{ background: "var(--color-accent)" }}
      />

      <Container className="relative">
        <SectionHeading
          index="01"
          eyebrow="Our Story"
          title="Why we started."
          description="The gap we set out to close, what we built to close it, and where that leaves us now."
        />
      </Container>

      <div ref={tiltRef} className="relative mt-16" style={{ perspective: "1600px" }}>
        <motion.div style={tiltStyle ?? undefined}>
          <Container>
            <ol className="relative" style={{ transformStyle: "preserve-3d" }}>
              {/* Rail threading the three beats together */}
              <span
                aria-hidden="true"
                className="absolute top-0 bottom-0 left-6 w-px bg-gradient-to-b from-accent/60 via-accent/25 to-transparent md:left-8"
              />

              {BEATS.map((beat, i) => {
                const Icon = beat.icon;
                return (
                  <motion.li
                    key={beat.label}
                    initial={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: 34, z: beat.z }
                    }
                    whileInView={
                      shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, z: beat.z }
                    }
                    viewport={{ once: true, margin: "-8%" }}
                    transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="relative grid grid-cols-1 gap-8 border-b border-white/10 py-10 pl-16 md:grid-cols-[1.4fr_0.6fr] md:gap-14 md:py-14 md:pl-24"
                  >
                    {/* Node on the rail */}
                    <span
                      aria-hidden="true"
                      className="absolute left-6 top-12 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-accent/40 bg-surface md:left-8"
                    >
                      <Icon className="h-5 w-5 text-accent" />
                    </span>

                    <div>
                      <p className="label-micro flex items-center gap-3 text-accent">
                        <span className="text-gray-500 tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="h-px w-5 bg-white/20" aria-hidden="true" />
                        {beat.label}
                      </p>
                      <h3 className="display-md mt-5 text-balance text-chalk">{beat.heading}</h3>
                      <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-400">
                        {beat.body}
                      </p>
                    </div>

                    <div className="flex items-start md:justify-end">
                      <div className="border-l-2 border-accent/60 pl-5 md:text-right md:border-l-0 md:border-r-2 md:pl-0 md:pr-5">
                        <p className="font-display text-5xl text-chalk tabular-nums md:text-6xl">
                          {beat.figure}
                        </p>
                        <p className="label-micro mt-3 max-w-[10rem] leading-relaxed text-gray-500">
                          {beat.figureLabel}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ol>

            {/* Mission / Vision, set back behind the beats */}
            <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
              {STATEMENTS.map((statement, i) => (
                <motion.div
                  key={statement.label}
                  initial={
                    shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 26, z: -60 - i * 40 }
                  }
                  whileInView={
                    shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, z: -60 - i * 40 }
                  }
                  viewport={{ once: true, margin: "-8%" }}
                  transition={{ duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="relative border border-white/12 bg-white/[0.03] p-8 md:p-10"
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-0 h-full w-0.5 bg-gradient-to-b from-accent to-transparent"
                  />
                  <p className="label-micro text-accent">{statement.label}</p>
                  {/*
                   * Deliberately NOT on the display scale. These are full
                   * sentences, and display type is cut for short headlines --
                   * tight tracking and sub-1 line-height turn a 20-word
                   * statement into a cramped block. Body face, normal
                   * tracking, generous leading.
                   */}
                  <p className="mt-5 max-w-prose text-lg leading-[1.65] text-gray-200 md:text-xl md:leading-[1.6]">
                    {statement.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </Container>
        </motion.div>
      </div>
    </section>
  );
}
