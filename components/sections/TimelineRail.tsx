"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { timeline } from "@/data/timeline";

/*
 * Milestones as a horizontal 3D rail rather than a stacked list.
 *
 * Cards alternate above and below a central axis and sit at alternating Z
 * depths, so the run of milestones reads as a track receding from the viewer.
 * A density strip underneath doubles as the chart: one bar per month, height
 * set by how many milestones landed in it.
 *
 * Native horizontal scrolling with snap points rather than a transform
 * carousel -- trackpad, touch and keyboard all work without reimplementing
 * them, and every card stays in the accessibility tree.
 */

// One bar per month, tallest month normalised to full height.
function monthDensity() {
  const counts = new Map<string, number>();
  for (const m of timeline) counts.set(m.year, (counts.get(m.year) ?? 0) + 1);
  const peak = Math.max(...counts.values());
  return [...counts.entries()].map(([month, count]) => ({
    month,
    count,
    ratio: count / peak,
  }));
}

export function TimelineRail() {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [activeMonth, setActiveMonth] = useState<string | null>(null);
  const density = monthDensity();

  /**
   * Scrolls the rail to the first milestone of a month and lights it up.
   *
   * The rail is the scroll container, so this offsets within it rather than
   * calling scrollIntoView -- that would scroll the whole page to bring the
   * section into view as a side effect.
   */
  function selectMonth(month: string) {
    setActiveMonth(month);
    const index = timeline.findIndex((m) => m.year === month);
    const card = cardRefs.current[index];
    const track = trackRef.current;
    if (index < 0 || !card || !track) return;
    track.scrollTo({
      left: card.offsetLeft - track.clientWidth / 2 + card.clientWidth / 2,
      behavior: "smooth",
    });
  }

  const syncEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    syncEdges();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", syncEdges, { passive: true });
    window.addEventListener("resize", syncEdges);
    return () => {
      el.removeEventListener("scroll", syncEdges);
      window.removeEventListener("resize", syncEdges);
    };
  }, [syncEdges]);

  function page(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth / 3;
    el.scrollBy({ left: step * 2 * direction, behavior: "smooth" });
  }

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-surface-2 py-24 md:py-32">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden="true" />

      <Container className="relative">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            index="03"
            eyebrow="Our Story"
            title="Milestones along the way."
            description={`${timeline.length} milestones since ProEduvate was registered in August 2025.`}
            className="max-w-2xl"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => page(-1)}
              disabled={atStart}
              aria-label="Earlier milestones"
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-chalk transition-all duration-200",
                atStart ? "opacity-30" : "hover:border-accent hover:text-accent"
              )}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => page(1)}
              disabled={atEnd}
              aria-label="Later milestones"
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-chalk transition-all duration-200",
                atEnd ? "opacity-30" : "hover:border-accent hover:text-accent"
              )}
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Container>

      {/* The rail */}
      <div className="relative mt-16" style={{ perspective: "1200px" }}>
        <div
          ref={trackRef}
          className="overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <ul
            className="flex w-max items-center gap-6 px-6 md:px-10"
            style={{ transformStyle: "preserve-3d" }}
          >
            {timeline.map((milestone, i) => {
              const above = i % 2 === 0;
              // Alternate depth so consecutive cards don't sit on one plane.
              const z = above ? -40 : -110;
              // Only the FIRST milestone of the selected month is highlighted,
              // not every card sharing that month.
              const isLead =
                activeMonth === milestone.year &&
                timeline.findIndex((m) => m.year === activeMonth) === i;
              return (
                <motion.li
                  key={`${milestone.year}-${milestone.title}`}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  initial={{ opacity: 0, y: above ? -24 : 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-4%" }}
                  transition={{ duration: 0.5, delay: (i % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex w-[248px] shrink-0 snap-start flex-col"
                  style={{ transform: `translateZ(${z}px)` }}
                >
                  {/* Card sits above or below the axis */}
                  <div className={cn("flex h-[280px] flex-col", above ? "justify-start" : "justify-end")}>
                    <div
                      data-lead={isLead || undefined}
                      className={cn(
                        "group border p-5 backdrop-blur-sm transition-colors duration-300",
                        isLead
                          ? "border-accent bg-accent/[0.08] shadow-[0_0_46px_-14px_var(--color-accent)]"
                          : "border-white/12 bg-surface/80 hover:border-accent/60"
                      )}
                    >
                      <span className="label-micro text-accent">{milestone.year}</span>
                      <h3 className="mt-3 font-display text-base leading-snug text-chalk">
                        {milestone.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-gray-500">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  {/* Stem down/up to the axis, plus the node on it */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute left-6 w-px bg-gradient-to-b from-accent/60 to-accent/10",
                      above ? "top-[calc(100%-140px)] h-[140px]" : "top-0 h-[140px]"
                    )}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute left-6 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-accent bg-surface"
                  />
                </motion.li>
              );
            })}
          </ul>
        </div>

        {/* Central axis, drawn behind the cards */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-0 left-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
        />
      </div>

      {/* Density strip: milestones per month, and the chart's controls */}
      <Container className="relative mt-12">
        <p className="label-micro mb-4 text-gray-500">
          Milestones per month · select a bar to jump to it
        </p>
        <ul className="flex items-end gap-2">
          {density.map((bar) => {
            const isActive = bar.month === activeMonth;
            return (
              <li key={bar.month} className="flex flex-1 flex-col items-center">
                <button
                  type="button"
                  onClick={() => selectMonth(bar.month)}
                  aria-pressed={isActive}
                  aria-label={`${bar.month}: ${bar.count} milestone${bar.count === 1 ? "" : "s"}`}
                  className="group flex w-full flex-col items-center gap-2"
                >
                  <motion.span
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "w-full origin-bottom transition-colors duration-300",
                      isActive ? "bg-accent" : "bg-accent/30 group-hover:bg-accent/70"
                    )}
                    style={{ height: `${12 + bar.ratio * 56}px` }}
                  />
                  <span
                    className={cn(
                      "label-micro text-[9px] transition-colors duration-300",
                      isActive ? "text-accent" : "text-gray-600 group-hover:text-gray-400"
                    )}
                  >
                    {bar.month}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
