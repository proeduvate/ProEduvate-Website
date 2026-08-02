"use client";

import { BrainCircuit, Users, Gem, Sparkles, LayoutGrid, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { usePointerTilt } from "@/lib/usePointerTilt";
import { reasons } from "@/data/why-choose-us";

const iconMap: Record<string, LucideIcon> = {
  "brain-circuit": BrainCircuit,
  users: Users,
  gem: Gem,
  sparkles: Sparkles,
  "layout-grid": LayoutGrid,
};

/*
 * Reasons as a staggered 3D stack: the first is the lead card and the rest
 * fan out beside it, each one set further back.
 *
 * Reads as a hierarchy rather than five equal rows -- the previous layout
 * gave the strongest reason exactly as much weight as the weakest.
 */
export function WhyChooseUs() {
  const { ref: tiltRef, style: tiltStyle, shouldReduceMotion } = usePointerTilt({
    max: 7,
    maxX: 4,
  });

  const [lead, ...rest] = reasons;
  const LeadIcon = iconMap[lead.icon];

  return (
    <section className="relative overflow-hidden bg-surface-2 py-24 md:py-32">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

      <Container className="relative">
        <SectionHeading
          index="03"
          eyebrow="Why ProEduvate"
          title="Why choose us."
          description="A few reasons clients keep coming back to build with us."
        />
      </Container>

      <div ref={tiltRef} className="relative mt-16" style={{ perspective: "1500px" }}>
        <motion.div style={tiltStyle ?? undefined}>
          <Container>
            <div
              className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_1fr]"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Lead reason, forward and lit */}
              <motion.article
                initial={
                  shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30, z: 30 }
                }
                whileInView={
                  shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, z: 90 }
                }
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex flex-col justify-between border border-accent/50 bg-accent/[0.07] p-8 md:p-10"
              >
                <span
                  aria-hidden="true"
                  className="absolute -inset-8 -z-10 rounded-full opacity-30 blur-3xl"
                  style={{ background: "var(--color-accent)" }}
                />
                <div className="flex items-start justify-between gap-6">
                  <LeadIcon className="h-10 w-10 shrink-0 text-accent" aria-hidden="true" />
                  <span className="label-micro text-accent tabular-nums">01</span>
                </div>
                <div className="mt-16">
                  <h3 className="display-md text-balance text-chalk">{lead.title}</h3>
                  <p className="mt-5 text-base leading-relaxed text-gray-300">
                    {lead.description}
                  </p>
                </div>
              </motion.article>

              {/* The rest, receding */}
              <div className="flex flex-col gap-4" style={{ transformStyle: "preserve-3d" }}>
                {rest.map((reason, i) => {
                  const Icon = iconMap[reason.icon];
                  const z = -20 - i * 40;
                  return (
                    <motion.article
                      key={reason.title}
                      initial={
                        shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, z: z - 40 }
                      }
                      whileInView={
                        shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, z }
                      }
                      viewport={{ once: true, margin: "-8%" }}
                      transition={{
                        duration: 0.55,
                        delay: 0.1 + i * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="group flex flex-1 gap-5 border border-white/12 bg-white/[0.03] p-6 transition-colors duration-300 hover:border-accent/50 hover:bg-accent/[0.04]"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <span className="label-micro text-gray-600 tabular-nums">
                          {String(i + 2).padStart(2, "0")}
                        </span>
                        <span
                          aria-hidden="true"
                          className="w-px flex-1 bg-gradient-to-b from-accent/40 to-transparent"
                        />
                      </div>
                      <div>
                        <h3 className="flex items-center gap-3 font-display text-xl text-chalk">
                          <Icon
                            className="h-5 w-5 shrink-0 text-accent transition-transform duration-300 group-hover:scale-110"
                            aria-hidden="true"
                          />
                          {reason.title}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-gray-400">
                          {reason.description}
                        </p>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </Container>
        </motion.div>
      </div>
    </section>
  );
}
