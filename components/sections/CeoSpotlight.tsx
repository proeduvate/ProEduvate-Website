"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { usePointerTilt } from "@/lib/usePointerTilt";
import { ceo } from "@/data/ceo";

/*
 * CEO spotlight.
 *
 * The portrait is a cut-out PNG composited straight onto the section -- no
 * card, no frame, no border. That is the whole reason the section is built
 * this way: a framed photo reads as a corporate directory entry, while a
 * cut-out standing in its own light reads as a person. It sits on a glow and
 * an elliptical ground shadow so it is anchored rather than floating.
 *
 * Order is deliberate: who they are first, then what they say. A pull quote
 * lands differently once you already know whose voice it is.
 */

export function CeoSpotlight() {
  const { ref: tiltRef, style: tiltStyle } = usePointerTilt({ max: 5, maxX: 3 });

  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-[#04060a] py-24 md:py-32">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-20" aria-hidden="true" />

      {/* The light the portrait stands in. */}
      <div
        aria-hidden="true"
        className="animate-[--animate-aurora-slow] pointer-events-none absolute top-0 left-[8%] h-[70vh] w-[70vh] rounded-full opacity-[0.28] blur-[150px]"
        style={{ background: "var(--color-accent)" }}
      />

      <Container className="relative">
        <div className="grid grid-cols-1 items-center gap-y-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-x-20">
          {/* ── Portrait ─────────────────────────────────────────────── */}
          <div ref={tiltRef} className="relative" style={{ perspective: "1200px" }}>
            <motion.div
              style={tiltStyle ?? undefined}
              className="relative mx-auto w-full max-w-[420px]"
            >
              {/* Concentric arcs behind the subject */}
              <span
                aria-hidden="true"
                className="absolute top-[6%] left-1/2 aspect-square w-[92%] -translate-x-1/2 rounded-full border border-accent/25"
              />
              <span
                aria-hidden="true"
                className="absolute top-[14%] left-1/2 aspect-square w-[70%] -translate-x-1/2 rounded-full border border-accent/15"
              />
              <span
                aria-hidden="true"
                className="absolute top-[18%] left-1/2 aspect-square w-[58%] -translate-x-1/2 rounded-full opacity-50 blur-[60px]"
                style={{ background: "var(--color-accent)" }}
              />

              {ceo.photo ? (
                <Image
                  src={ceo.photo}
                  alt={ceo.name ? `${ceo.name}, ${ceo.role}` : ceo.role}
                  width={840}
                  height={1050}
                  priority
                  // No frame, no crop, no rounded box -- the cut-out is the
                  // subject and the section is its background.
                  className="relative h-auto w-full object-contain"
                />
              ) : (
                <PortraitPending />
              )}

              {/* Ground shadow, so the cut-out is planted rather than floating */}
              <span
                aria-hidden="true"
                className="absolute -bottom-2 left-1/2 h-6 w-[62%] -translate-x-1/2 rounded-[50%] bg-black/70 blur-xl"
              />
            </motion.div>
          </div>

          {/* ── About, then the statement ────────────────────────────── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="label-micro flex items-center gap-3 text-accent">
                <span className="h-px w-8 bg-accent/50" aria-hidden="true" />
                Leadership
              </p>

              <h2 className="display-lg mt-6 text-balance text-chalk">About our CEO.</h2>

              <div className="mt-7 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <p className="font-display text-xl text-chalk">{ceo.name ?? "Name pending"}</p>
                <p className="label-micro text-gray-500">{ceo.role}</p>
              </div>

              {/*
               * Body face at a comfortable measure. Biography is prose, and
               * the display cut's tight tracking makes running text read as
               * cramped -- it is reserved for the heading and the pull quote.
               */}
              <div className="mt-7 max-w-xl space-y-5">
                {ceo.about.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="leading-[1.75] text-gray-300">
                    {paragraph}
                  </p>
                ))}
              </div>

              <ul className="mt-9 flex flex-wrap gap-2.5">
                {ceo.focus.map((item) => (
                  <li
                    key={item}
                    className="label-micro border border-white/15 bg-white/[0.03] px-3.5 py-2 text-gray-400"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Statement — visually separate, and second by design. */}
            <motion.figure
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="relative mt-12 border-l-2 border-accent pl-7"
            >
              <p className="label-micro text-accent">In their words</p>

              <blockquote className="mt-4">
                {/* Display face here: it is two sentences, short enough that
                    the tighter cut reads as emphasis rather than cramped. */}
                <p className="font-display text-2xl leading-[1.4] text-balance text-chalk md:text-[28px]">
                  &ldquo;{ceo.quote}&rdquo;
                </p>
              </blockquote>

              <figcaption className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="label-micro text-gray-400">
                  {ceo.name ?? "Name pending"} · {ceo.role}
                </span>
                {!ceo.quoteApproved && (
                  <span className="label-micro border border-white/15 px-2.5 py-1.5 text-gray-600">
                    Draft — pending their own words
                  </span>
                )}
              </figcaption>
            </motion.figure>
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * Stand-in for the cut-out portrait.
 *
 * Deliberately an abstract silhouette rather than stock photography: a
 * stand-in face presented as the CEO is a misrepresentation, and it is the
 * kind of thing that ships quietly and stays.
 */
function PortraitPending() {
  return (
    <div className="relative mx-auto flex aspect-[4/5] w-full flex-col items-center justify-end">
      <svg
        viewBox="0 0 200 250"
        className="h-full w-full"
        aria-hidden="true"
        fill="none"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          <linearGradient id="ceo-silhouette" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.03" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="78" r="40" fill="url(#ceo-silhouette)" />
        <path
          d="M28 250c0-42 32-74 72-74s72 32 72 74z"
          fill="url(#ceo-silhouette)"
        />
      </svg>
      <p className="label-micro absolute bottom-8 text-gray-600">Portrait pending</p>
    </div>
  );
}
