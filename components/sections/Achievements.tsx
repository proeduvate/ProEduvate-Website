"use client";

import { Star, Trophy } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Counter } from "@/components/ui/Counter";
import { usePointerTilt } from "@/lib/usePointerTilt";
import { cn } from "@/lib/utils";
import { achievementHighlights, monthlyStars, recognitions } from "@/data/achievements";

/*
 * Achievements, with Star of the Month as the centrepiece rather than a
 * ledger row.
 *
 * The stars sit on a tilted 3D shelf: the most recent one is pulled forward
 * and lit, the rest recede behind it in order. Depth carries the ranking, so
 * the highlight needs no extra chrome to read as the current one.
 */
export function Achievements() {
  const { ref: tiltRef, style: tiltStyle, shouldReduceMotion } = usePointerTilt({
    max: 7,
    maxX: 4,
  });

  // Data is in calendar order, so the last entry is the current star.
  const featuredIndex = monthlyStars.length - 1;

  return (
    <section className="relative overflow-hidden bg-surface py-24 md:py-32">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />

      <Container className="relative">
        <SectionHeading index="04" eyebrow="Along the Way" title="Achievements we're proud of." />

        {/* Headline numbers */}
        <div className="mt-16 grid grid-cols-1 border-t border-white/10 sm:grid-cols-3">
          {achievementHighlights.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-6%" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="border-b border-white/10 py-10 sm:border-r sm:border-b-0 sm:px-8 sm:first:pl-0 sm:last:border-r-0"
            >
              <div className="display-md font-display text-chalk">
                <Counter value={item.value} suffix={item.suffix} />
              </div>
              <p className="label-micro mt-4 text-gray-500">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </Container>

      {/* Star of the Month shelf */}
      <Container className="relative mt-24">
        <div className="label-micro flex items-center gap-3 text-accent">
          <Star className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Star of the Month</span>
        </div>
      </Container>

      <div ref={tiltRef} className="relative mt-10" style={{ perspective: "1500px" }}>
        <motion.div style={tiltStyle ?? undefined}>
          <Container>
            <ul
              className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              style={{ transformStyle: "preserve-3d" }}
            >
              {monthlyStars.map((star, i) => {
                const featured = i === featuredIndex;
                // The current star comes forward; earlier ones step back in
                // order, so recency reads as depth.
                const z = featured ? 70 : -(featuredIndex - i) * 26;

                return (
                  <motion.li
                    key={star.month}
                    initial={
                      shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 26, z }
                    }
                    whileInView={
                      shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, z }
                    }
                    viewport={{ once: true, margin: "-6%" }}
                    transition={{ duration: 0.55, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    className={cn(
                      "group relative flex flex-col justify-between p-6 transition-colors duration-300",
                      featured
                        ? "border border-accent/70 bg-accent/[0.08] shadow-[0_0_60px_-18px_var(--color-accent)]"
                        : "border border-white/10 bg-white/[0.02] hover:border-accent/40"
                    )}
                  >
                    {featured && (
                      <span
                        aria-hidden="true"
                        className="absolute -inset-4 -z-10 rounded-full opacity-30 blur-3xl"
                        style={{ background: "var(--color-accent)" }}
                      />
                    )}

                    <div className="flex items-start justify-between gap-4">
                      <span
                        className={cn(
                          "label-micro",
                          featured ? "text-accent" : "text-gray-500"
                        )}
                      >
                        {star.month}
                      </span>
                      <Star
                        className={cn(
                          "h-4 w-4 shrink-0 transition-colors duration-300",
                          featured
                            ? "fill-accent text-accent"
                            : "text-gray-700 group-hover:text-accent/60"
                        )}
                        aria-hidden="true"
                      />
                    </div>

                    <p
                      className={cn(
                        "mt-8 font-display leading-tight text-chalk",
                        featured ? "text-3xl" : "text-2xl"
                      )}
                    >
                      {star.name}
                    </p>
                    <p className="label-micro mt-3 text-gray-500">{star.department}</p>

                    {featured && (
                      <p className="label-micro mt-5 w-fit border border-accent/40 px-2.5 py-1.5 text-accent">
                        Current
                      </p>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          </Container>
        </motion.div>
      </div>

      {/* Recognition */}
      <Container className="relative mt-24">
        <div className="label-micro flex items-center gap-3 text-accent">
          <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Recognition</span>
        </div>

        <div className="mt-8 grid grid-cols-1 border-t border-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {recognitions.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-6%" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="h-full border-b border-white/10 py-8 lg:border-r lg:px-6 lg:first:pl-0 lg:last:border-r-0"
            >
              <p className="label-micro text-gray-500">{item.title}</p>
              <p className="mt-3 font-display text-lg font-normal text-chalk">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
