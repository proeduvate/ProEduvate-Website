"use client";

import { useState } from "react";
import { BrainCircuit, Users, Gem, Sparkles, LayoutGrid, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { usePointerTilt } from "@/lib/usePointerTilt";
import { cn } from "@/lib/utils";
import { reasons } from "@/data/why-choose-us";

const iconMap: Record<string, LucideIcon> = {
  "brain-circuit": BrainCircuit,
  users: Users,
  gem: Gem,
  sparkles: Sparkles,
  "layout-grid": LayoutGrid,
};

/*
 * The five reasons plotted as a radar chart.
 *
 * DELIBERATELY UNWEIGHTED: every axis reaches the same radius, so the plot is
 * a regular pentagon. There is no measured data behind these reasons, and
 * giving them different scores would render invented numbers in a form that
 * reads as evidence. The chart is used here as a structure -- five equally
 * weighted commitments -- and as the navigation into each one.
 *
 * SVG for the grid and plot so it stays crisp at any size; the axis labels
 * are real HTML buttons layered over it rather than <text>, so they use the
 * site's type scale, wrap properly and are focusable.
 */

const SIZE = 300;
const CENTRE = SIZE / 2;
const PLOT_R = 96;
const LABEL_R = 132;
const RINGS = [0.25, 0.5, 0.75, 1];

/** Vertex i, at `radius` from the centre, first point straight up. */
function vertex(i: number, radius: number) {
  const angle = (-90 + i * (360 / reasons.length)) * (Math.PI / 180);
  return {
    x: CENTRE + Math.cos(angle) * radius,
    y: CENTRE + Math.sin(angle) * radius,
  };
}

const plotPoints = reasons.map((_, i) => vertex(i, PLOT_R));
const plotPath = plotPoints.map((p) => `${p.x},${p.y}`).join(" ");

function ringPath(scale: number) {
  return reasons
    .map((_, i) => {
      const p = vertex(i, PLOT_R * scale);
      return `${p.x},${p.y}`;
    })
    .join(" ");
}

export function WhyChooseUs() {
  const [selected, setSelected] = useState(0);
  const { ref: tiltRef, style: tiltStyle } = usePointerTilt({ max: 8, maxX: 5 });
  const active = reasons[selected];
  const ActiveIcon = iconMap[active.icon];

  return (
    <section className="relative overflow-hidden bg-surface-2 py-24 md:py-32">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

      <Container className="relative">
        <SectionHeading
          index="03"
          eyebrow="Why ProEduvate"
          title="Why choose us."
          description="Five commitments we hold equally. Pick one to see what it means in practice."
        />
      </Container>

      <div ref={tiltRef} className="relative mt-16" style={{ perspective: "2100px" }}>
        <motion.div style={tiltStyle ?? undefined}>
          <Container>
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-16">
              {/* Chart */}
              {/* Narrower than the column on small screens: the axis labels
                  sit outside the plot radius, so the chart has to leave room
                  for them or the leftmost and rightmost ones clip. */}
              <div
                className="relative mx-auto aspect-square w-[calc(100%-3.5rem)] max-w-[440px] sm:w-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                <svg
                  viewBox={`0 0 ${SIZE} ${SIZE}`}
                  className="absolute inset-0 h-full w-full overflow-visible"
                  aria-hidden="true"
                >
                  {/* Grid rings */}
                  {RINGS.map((scale) => (
                    <polygon
                      key={scale}
                      points={ringPath(scale)}
                      fill="none"
                      stroke="rgba(255,255,255,0.10)"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Axes */}
                  {reasons.map((reason, i) => {
                    const p = vertex(i, PLOT_R);
                    return (
                      <line
                        key={reason.title}
                        x1={CENTRE}
                        y1={CENTRE}
                        x2={p.x}
                        y2={p.y}
                        stroke={
                          i === selected ? "var(--color-accent)" : "rgba(255,255,255,0.14)"
                        }
                        strokeWidth={i === selected ? 1.6 : 1}
                      />
                    );
                  })}

                  {/* The plot itself */}
                  <motion.polygon
                    points={plotPath}
                    fill="color-mix(in srgb, var(--color-accent) 16%, transparent)"
                    stroke="var(--color-accent)"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    style={{ transformOrigin: "center" }}
                  />

                  {/* Vertex dots */}
                  {plotPoints.map((p, i) => (
                    <circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r={i === selected ? 6 : 3.5}
                      fill={i === selected ? "var(--color-accent)" : "var(--color-surface-2)"}
                      stroke="var(--color-accent)"
                      strokeWidth="1.6"
                      className="transition-all duration-300"
                    />
                  ))}
                </svg>

                {/* Axis labels, as real buttons over the plot */}
                {reasons.map((reason, i) => {
                  const p = vertex(i, LABEL_R);
                  const isActive = i === selected;
                  return (
                    <button
                      key={reason.title}
                      type="button"
                      onClick={() => setSelected(i)}
                      onFocus={() => setSelected(i)}
                      onPointerEnter={(e) => {
                        if (e.pointerType !== "touch") setSelected(i);
                      }}
                      aria-current={isActive}
                      className={cn(
                        "absolute w-[92px] -translate-x-1/2 -translate-y-1/2 px-1 text-center text-[10px] leading-tight font-medium transition-colors duration-300 sm:w-[128px] sm:text-xs",
                        isActive ? "text-accent" : "text-gray-500 hover:text-chalk"
                      )}
                      style={{
                        left: `${(p.x / SIZE) * 100}%`,
                        top: `${(p.y / SIZE) * 100}%`,
                      }}
                    >
                      {reason.title}
                    </button>
                  );
                })}
              </div>

              {/* Detail for the selected axis */}
              <motion.article
                // Re-keyed so it replays its enter animation on selection
                // without waiting on an exit.
                key={active.title}
                initial={{ opacity: 0, y: 18, z: -40 }}
                animate={{ opacity: 1, y: 0, z: 40 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative border border-white/12 bg-white/[0.03] p-8 md:p-10"
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
                    {String(reasons.length).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="display-md mt-6 text-balance text-chalk">{active.title}</h3>
                <p className="mt-5 text-base leading-relaxed text-gray-400">
                  {active.description}
                </p>
              </motion.article>
            </div>
          </Container>
        </motion.div>
      </div>
    </section>
  );
}
