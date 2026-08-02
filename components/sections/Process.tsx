"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ParticleDepthField } from "@/components/ui/ParticleDepthField";

const steps = [
  {
    title: "Discover",
    description: "We map the problem, users, and constraints before writing a line of code.",
  },
  {
    title: "Design",
    description: "Wireframes and prototypes validated with real stakeholders and users.",
  },
  {
    title: "Build",
    description: "Iterative development in reviewable increments, with tests as we go.",
  },
  {
    title: "Launch",
    description: "Staged rollout with monitoring, so launch day is uneventful by design.",
  },
  {
    title: "Support",
    description: "Ongoing maintenance, iteration, and scaling support after go-live.",
  },
];

// Links per gap between two steps.
const LINKS_PER_GAP = 7;

/*
 * The process steps, tied together by a chain that threads in from the right
 * end to the left.
 *
 * The chain is a run of interlocking links rather than a plain rule -- each
 * one is an ellipse, alternating its rotation so consecutive links read as
 * passing through each other. They animate in reverse index order, so the
 * chain draws itself from the right-hand end back toward the left.
 */
export function Process() {
  const shouldReduceMotion = useReducedMotion();
  const gaps = steps.length - 1;
  const totalLinks = gaps * LINKS_PER_GAP;

  return (
    <section className="relative overflow-hidden bg-surface-2 py-20 md:py-28">
      {/* Held back to 60% so the chain and step markers stay the focus -- the
          domains section runs the same field at full strength. */}
      <ParticleDepthField className="pointer-events-none absolute inset-0 h-full w-full opacity-60" />
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />

      <Container className="relative">
        <SectionHeading
          index="05"
          eyebrow="How We Work"
          title="A process built for momentum."
          description="Five stages, linked end to end — nothing starts before the one before it has landed."
          align="center"
        />

        <div className="relative mt-20" style={{ perspective: "1200px" }}>
          {/* The chain, threaded behind the step markers */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[42px] hidden h-6 lg:block"
          >
            <div
              className="relative mx-auto flex h-full items-center justify-between"
              style={{ width: `${100 - 100 / steps.length}%` }}
            >
              {Array.from({ length: totalLinks }).map((_, i) => {
                // Reverse the delay so the chain arrives from the right end.
                const fromRight = totalLinks - 1 - i;
                return (
                  <motion.span
                    key={i}
                    initial={
                      shouldReduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, scaleX: 0.2, x: 26 }
                    }
                    whileInView={
                      shouldReduceMotion
                        ? { opacity: 1 }
                        : { opacity: 1, scaleX: 1, x: 0 }
                    }
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{
                      duration: 0.34,
                      delay: fromRight * 0.035,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="block h-4 w-3.5 shrink-0 rounded-[50%] border-2 border-accent/55"
                    style={{
                      // Alternating tilt makes consecutive links read as
                      // interlocking rather than as a row of separate rings.
                      transform: i % 2 === 0 ? "rotate(0deg)" : "rotate(90deg) scale(0.82)",
                    }}
                  />
                );
              })}
            </div>
          </div>

          <ol className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
            {steps.map((step, i) => (
              <motion.li
                key={step.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                // Steps land after the chain has reached them, left to right.
                transition={{ duration: 0.5, delay: 0.28 + i * 0.09 }}
                className="relative flex flex-col items-center text-center"
              >
                <span className="relative z-10 flex h-[52px] w-[52px] items-center justify-center rounded-full border border-accent/50 bg-surface-2">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full opacity-40 blur-lg"
                    style={{ background: "var(--color-accent)" }}
                  />
                  <span className="relative font-display text-base text-accent tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>

                <h3 className="mt-6 font-display text-xl text-chalk">{step.title}</h3>
                <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-gray-400">
                  {step.description}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
