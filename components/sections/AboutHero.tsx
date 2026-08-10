"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { BracketFrame } from "@/components/ui/BracketFrame";
import { usePointerTilt } from "@/lib/usePointerTilt";
import type { Stat } from "@/data/stats";

/*
 * About hero as a 3D stage rather than a flat banner, matching the treatment
 * on the home page: the mark sits furthest forward inside a ring of
 * receding plates, and the whole assembly tilts with the pointer.
 *
 * CSS 3D for the same reason as every other scene on the site -- the heading
 * and the figures are real text that has to stay selectable and in the
 * document outline.
 */

const PLATES = [
  { z: -90, inset: "inset-[8%]", opacity: 0.06 },
  { z: -180, inset: "inset-[2%]", opacity: 0.05 },
  { z: -280, inset: "-inset-[6%]", opacity: 0.04 },
];

export function AboutHero({ stats }: { stats: Stat[] }) {
  const { ref: tiltRef, style: tiltStyle } = usePointerTilt({ max: 9, maxX: 6 });
  const headline = stats.slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-surface pt-40 pb-24 md:pt-48 md:pb-32">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="animate-[--animate-aurora] pointer-events-none absolute -top-1/3 left-[10%] h-[60vh] w-[60vh] rounded-full blur-[140px]"
        style={{ background: "color-mix(in srgb, var(--color-accent) 34%, transparent)" }}
      />
      <BracketFrame inset="inset-8" />

      <div ref={tiltRef} className="relative" style={{ perspective: "2100px" }}>
        <motion.div style={tiltStyle ?? undefined}>
          <Container className="relative">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.15fr_0.85fr]">
              <div style={{ transform: "translateZ(40px)" }}>
                <p className="label-micro mb-6 flex items-center gap-3 text-accent">
                  <span className="text-gray-500 tabular-nums">00</span>
                  <span className="h-px w-6 bg-white/20" aria-hidden="true" />
                  <span>About Us · Est. Aug 2025</span>
                </p>

                <h1 className="display-xl text-balance text-chalk">
                  Software built by people who care what it&apos;s for.
                </h1>

                <p className="text-balance mt-8 max-w-xl text-lg leading-relaxed text-gray-400">
                  ProEduvate started as a small team frustrated with clunky institutional
                  software — and grew into a product company building across eight sectors.
                </p>

                <dl className="mt-12 flex flex-wrap gap-x-12 gap-y-6">
                  {headline.map((stat, i) => (
                    <div key={stat.label} style={{ transform: `translateZ(${28 - i * 8}px)` }}>
                      <dt className="label-micro text-gray-500">{stat.label}</dt>
                      <dd className="mt-2 font-display text-3xl text-chalk tabular-nums sm:text-4xl">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Mark, suspended in front of receding plates. */}
              <div
                className="relative mx-auto hidden aspect-square w-full max-w-[380px] lg:block"
                style={{ transformStyle: "preserve-3d" }}
                aria-hidden="true"
              >
                {PLATES.map((plate) => (
                  <span
                    key={plate.z}
                    className={`absolute ${plate.inset} rounded-full border border-white/10`}
                    style={{
                      transform: `translateZ(${plate.z}px)`,
                      background: `color-mix(in srgb, var(--color-accent) ${plate.opacity * 100}%, transparent)`,
                    }}
                  />
                ))}
                <span
                  className="absolute inset-[18%] rounded-full opacity-40 blur-[70px]"
                  style={{
                    background: "var(--color-accent)",
                    transform: "translateZ(-40px)",
                  }}
                />
                <span
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ transform: "translateZ(90px)" }}
                >
                  <Image
                    src="/brand/logo-mark.png"
                    alt=""
                    width={420}
                    height={117}
                    priority
                    className="h-auto w-[62%] object-contain"
                  />
                </span>
              </div>
            </div>
          </Container>
        </motion.div>
      </div>
    </section>
  );
}
