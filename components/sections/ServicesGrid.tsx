"use client";

import { useState } from "react";
import {
  GraduationCap,
  BrainCircuit,
  Building2,
  Palette,
  Cloud,
  Database,
  Compass,
  Check,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { usePointerTilt } from "@/lib/usePointerTilt";
import { cn } from "@/lib/utils";
import { services } from "@/data/services";

const iconMap: Record<string, LucideIcon> = {
  "graduation-cap": GraduationCap,
  "brain-circuit": BrainCircuit,
  "building-2": Building2,
  palette: Palette,
  cloud: Cloud,
  database: Database,
  compass: Compass,
};

/*
 * Services as a selectable 3D deck rather than a flat run of rows.
 *
 * The column on the left is the index; the panel on the right is the detail.
 * Splitting them keeps all seven services scannable at once -- the previous
 * layout made you scroll past every "what's included" list to reach the next
 * service name, which is what made them hard to compare.
 *
 * Selection is click/focus driven rather than hover: the detail panel is
 * substantial enough that having it change under an accidental mouse sweep
 * would be disorienting.
 */
export function ServicesGrid() {
  const [selected, setSelected] = useState(0);
  const { ref: tiltRef, style: tiltStyle } = usePointerTilt({ max: 5, maxX: 3 });
  const active = services[selected];
  const ActiveIcon = iconMap[active.icon];

  return (
    <section className="relative overflow-hidden bg-surface py-20 md:py-28">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="animate-[--animate-aurora-slow] pointer-events-none absolute top-1/4 -left-32 h-[50vh] w-[50vh] rounded-full opacity-20 blur-[140px]"
        style={{ background: "var(--color-accent)" }}
      />

      <Container className="relative">
        <SectionHeading
          index="01"
          eyebrow="What We Offer"
          title="Seven ways we build with you."
          description="Pick a service to see exactly what it covers."
        />
      </Container>

      <div ref={tiltRef} className="relative mt-14" style={{ perspective: "1600px" }}>
        <motion.div style={tiltStyle ?? undefined}>
          <Container>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
              {/* Index */}
              <ul style={{ transformStyle: "preserve-3d" }}>
                {services.map((service, i) => {
                  const Icon = iconMap[service.icon];
                  const isActive = i === selected;
                  return (
                    <li key={service.slug}>
                      <button
                        type="button"
                        onClick={() => setSelected(i)}
                        onFocus={() => setSelected(i)}
                        aria-current={isActive}
                        className={cn(
                          "group flex w-full items-center gap-4 border-b border-white/10 py-4 text-left transition-all duration-300",
                          isActive ? "border-accent/50" : "hover:border-white/25"
                        )}
                        style={{
                          // Selected row steps toward the viewer; the rest sit back.
                          transform: `translateZ(${isActive ? 55 : 0}px)`,
                        }}
                      >
                        <span
                          className={cn(
                            "label-micro tabular-nums transition-colors duration-300",
                            isActive ? "text-accent" : "text-gray-600"
                          )}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <Icon
                          className={cn(
                            "h-5 w-5 shrink-0 transition-colors duration-300",
                            isActive ? "text-accent" : "text-gray-600 group-hover:text-accent/70"
                          )}
                          aria-hidden="true"
                        />
                        <span
                          className={cn(
                            "font-display text-lg leading-tight transition-colors duration-300 sm:text-xl",
                            isActive ? "text-chalk" : "text-gray-400 group-hover:text-chalk"
                          )}
                        >
                          {service.name}
                        </span>
                        <span
                          aria-hidden="true"
                          className={cn(
                            "ml-auto h-px shrink-0 transition-all duration-300",
                            isActive ? "w-10 bg-accent" : "w-6 bg-white/20"
                          )}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Detail panel */}
              <div style={{ transformStyle: "preserve-3d" }}>
                {/* Re-keyed rather than wrapped in AnimatePresence: `mode="wait"`
                    holds the incoming panel until the outgoing one has finished
                    animating out, which makes clicking down the list feel
                    sluggish and leaves the panel stranded if the exit animation
                    is ever interrupted. Changing the key remounts the article so
                    it plays its enter animation with nothing to wait on. */}
                <motion.article
                  key={active.slug}
                  initial={{ opacity: 0, y: 20, z: -50 }}
                  animate={{ opacity: 1, y: 0, z: 40 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="relative border border-white/12 bg-surface-2/80 p-8 backdrop-blur-sm md:p-10"
                >
                    <span
                      aria-hidden="true"
                      className="absolute -inset-6 -z-10 rounded-full opacity-25 blur-3xl"
                      style={{ background: "var(--color-accent)" }}
                    />

                    <div className="flex items-start justify-between gap-6">
                      <ActiveIcon className="h-9 w-9 shrink-0 text-accent" aria-hidden="true" />
                      <span className="label-micro text-gray-600 tabular-nums">
                        {String(selected + 1).padStart(2, "0")} /{" "}
                        {String(services.length).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="display-md mt-6 text-balance text-chalk">{active.name}</h3>
                    <p className="mt-5 text-base leading-relaxed text-gray-400">
                      {active.description}
                    </p>

                    <p className="label-micro mt-9 text-accent">What&apos;s included</p>
                    <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                      {active.included.map((item, i) => (
                        <motion.li
                          key={item}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.08 + i * 0.05 }}
                          className="flex items-start gap-3 text-sm text-gray-400"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                          {item}
                        </motion.li>
                      ))}
                    </ul>
                </motion.article>
              </div>
            </div>
          </Container>
        </motion.div>
      </div>
    </section>
  );
}
