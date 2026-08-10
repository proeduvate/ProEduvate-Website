"use client";

import { useRef } from "react";
import {
  Lightbulb,
  Gem,
  Target,
  ShieldCheck,
  Hammer,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import type { Value } from "@/data/values";

const iconMap: Record<string, LucideIcon> = {
  lightbulb: Lightbulb,
  gem: Gem,
  target: Target,
  "shield-check": ShieldCheck,
  hammer: Hammer,
  zap: Zap,
};

/*
 * "What we optimize for" as an ascending roadmap rather than a list.
 *
 * Each value is a step climbing away from the viewer along a receding
 * track, so the section reads as a trajectory -- growth and increasing
 * craft -- instead of six equal bullet points. A spine line runs through
 * the steps and fills as the section scrolls.
 *
 * CSS 3D again: these are headings and paragraphs that need to stay
 * selectable and in the document outline.
 */
export function GrowthRoadmap({
  values,
  expanded = false,
}: {
  values: Value[];
  expanded?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  // Spine fills through the middle of the section's travel.
  const spineScale = useTransform(scrollYProgress, [0.1, 0.75], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-surface py-24 md:py-32"
    >
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

      <Container className="relative">
        <SectionHeading
          index="05"
          eyebrow="Why ProEduvate"
          title="How we get better."
          description="Not a list of features. This is the trajectory — what compounds as we build, hire, and ship."
          align={expanded ? "left" : "center"}
        />

        <div
          className="relative mt-20 md:mt-28"
          style={shouldReduceMotion ? undefined : { perspective: "2300px" }}
        >
          {/* Spine */}
          <div
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-4 w-px bg-white/10 md:left-1/2"
          >
            <motion.div
              className="h-full w-px origin-top bg-accent"
              style={shouldReduceMotion ? { scaleY: 1 } : { scaleY: spineScale }}
            />
          </div>

          <ol className="relative space-y-10 md:space-y-16" style={{ transformStyle: "preserve-3d" }}>
            {values.map((value, i) => {
              const Icon = iconMap[value.icon];
              const isRight = i % 2 === 1;
              // Each step sits further back and slightly higher than the last.
              const depth = -i * 26;
              const lift = -i * 2;

              return (
                <motion.li
                  key={value.title}
                  // Depth is passed as motion props, not an inline CSS
                  // transform: framer-motion owns the `transform` property
                  // while animating and would otherwise overwrite it,
                  // flattening the whole roadmap.
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : { opacity: 0, y: 40, z: depth, rotateX: lift }
                  }
                  whileInView={
                    shouldReduceMotion
                      ? { opacity: 1 }
                      : { opacity: 1, y: 0, z: depth, rotateX: lift }
                  }
                  viewport={{ once: true, margin: "-12%" }}
                  transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className={cn(
                    "relative pl-12 md:w-1/2 md:pl-0",
                    isRight ? "md:ml-auto md:pl-16" : "md:pr-16 md:text-right"
                  )}
                  style={shouldReduceMotion ? undefined : { transformStyle: "preserve-3d" }}
                >
                  {/* Node on the spine */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-1.5 flex h-8 w-8 items-center justify-center rounded-full border border-accent/50 bg-surface",
                      "left-0 md:left-auto",
                      isRight ? "md:-left-4" : "md:-right-4"
                    )}
                  >
                    <span className="h-2 w-2 rounded-full bg-accent" />
                  </span>

                  <p className="label-micro text-gray-500 tabular-nums">
                    Step {String(i + 1).padStart(2, "0")}
                  </p>

                  <h3
                    className={cn(
                      "mt-4 flex items-center gap-3 font-display text-3xl font-normal tracking-tight text-chalk sm:text-4xl",
                      !isRight && "md:flex-row-reverse"
                    )}
                  >
                    <Icon className="h-6 w-6 shrink-0 text-accent" aria-hidden="true" />
                    {value.title}
                  </h3>

                  <p className="mt-4 text-base leading-relaxed text-gray-400">
                    {expanded ? value.longDescription : value.shortDescription}
                  </p>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
