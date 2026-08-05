"use client";

import Image from "next/image";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { usePointerTilt } from "@/lib/usePointerTilt";
import { ceo } from "@/data/ceo";

/*
 * CEO spotlight: portrait on one side, statement on the other, both on the
 * same tilting 3D stage as the rest of the About page.
 *
 * The portrait sits furthest forward inside receding plates, mirroring the
 * treatment the mark gets in the About hero so the two read as one system.
 *
 * Until a real portrait is supplied the frame renders a labelled placeholder
 * rather than a stock photograph -- a stand-in face presented as the CEO
 * would be a straightforward misrepresentation, and it is the kind of thing
 * that quietly ships and stays.
 */

const PLATES = [
  { z: -70, inset: "-inset-3" },
  { z: -150, inset: "-inset-8" },
];

export function CeoSpotlight() {
  const { ref: tiltRef, style: tiltStyle } = usePointerTilt({ max: 7, maxX: 4 });

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-surface-2 py-24 md:py-32">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-25" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="animate-[--animate-aurora-slow] pointer-events-none absolute top-1/4 -right-24 h-[45vh] w-[45vh] rounded-full opacity-25 blur-[130px]"
        style={{ background: "var(--color-accent)" }}
      />

      <Container className="relative">
        <SectionHeading
          index="02"
          eyebrow="Leadership"
          title="From our CEO."
          description="The person setting the direction, and what they hold the company to."
        />
      </Container>

      <div ref={tiltRef} className="relative mt-16" style={{ perspective: "1500px" }}>
        <motion.div style={tiltStyle ?? undefined}>
          <Container>
            <div
              className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Portrait */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative mx-auto w-full max-w-[340px]"
                style={{ transformStyle: "preserve-3d" }}
              >
                {PLATES.map((plate) => (
                  <span
                    key={plate.z}
                    aria-hidden="true"
                    className={`absolute ${plate.inset} border border-accent/20 bg-accent/[0.04]`}
                    style={{ transform: `translateZ(${plate.z}px)` }}
                  />
                ))}

                <div
                  className="relative aspect-[4/5] overflow-hidden border border-accent/40 bg-surface"
                  style={{ transform: "translateZ(60px)" }}
                >
                  {ceo.photo ? (
                    <Image
                      src={ceo.photo}
                      alt={ceo.name ? `${ceo.name}, ${ceo.role}` : ceo.role}
                      fill
                      sizes="(max-width: 1024px) 340px, 340px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                      <Image
                        src="/icon.png"
                        alt=""
                        width={96}
                        height={96}
                        className="h-14 w-14 object-contain opacity-40"
                      />
                      <p className="label-micro text-gray-600">Portrait pending</p>
                    </div>
                  )}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent"
                  />
                </div>

                {/* Name plate, pushed furthest forward */}
                <div
                  className="relative -mt-8 ml-6 w-[calc(100%-1.5rem)] border border-white/12 bg-surface-2 px-5 py-4"
                  style={{ transform: "translateZ(110px)" }}
                >
                  <p className="font-display text-lg text-chalk">{ceo.name ?? "Name pending"}</p>
                  <p className="label-micro mt-1.5 text-accent">{ceo.role}</p>
                </div>
              </motion.div>

              {/* Statement */}
              <motion.div
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8%" }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{ transform: "translateZ(20px)" }}
              >
                <Quote className="h-9 w-9 text-accent/40" aria-hidden="true" />

                <blockquote className="mt-6">
                  {/*
                   * Body face, not display type: this is several sentences,
                   * and the display cut's tight tracking makes long passages
                   * read as cramped.
                   */}
                  <p className="text-xl leading-[1.6] text-chalk md:text-2xl md:leading-[1.55]">
                    {ceo.quote}
                  </p>
                </blockquote>

                {!ceo.quoteApproved && (
                  <p className="label-micro mt-6 inline-flex border border-white/15 px-3 py-2 text-gray-500">
                    Draft statement — pending the CEO&apos;s own words
                  </p>
                )}

                <p className="mt-8 max-w-xl leading-relaxed text-gray-400">{ceo.bio}</p>

                <ul className="mt-10 grid grid-cols-1 gap-px border-t border-white/10 sm:grid-cols-3">
                  {ceo.focus.map((item, i) => (
                    <li key={item} className="border-b border-white/10 py-5 sm:pr-6">
                      <span className="label-micro text-gray-600 tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="mt-2.5 font-display text-base text-chalk">{item}</p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </Container>
        </motion.div>
      </div>
    </section>
  );
}
