"use client";

import { motion } from "framer-motion";

/*
 * The company slogan as three extruded words on three depth planes.
 *
 * The 3D is doing two things at once: each word sits further forward on
 * `translateZ` so the line has real depth inside its stage, and each is given
 * a stacked text-shadow that reads as an extruded edge. The shadow stack is
 * what makes the weight survive on a dark background -- a single soft glow
 * just blooms and softens the letterforms.
 *
 * `still` renders it at rest with no entrance, for surfaces that deliberately
 * do not animate. Starting from opacity 0 there would leave the slogan
 * invisible, dependent on an animation that never runs.
 */

const SLOGAN = ["People", "Projects", "Potential"];

/** Stacked offsets read as a solid extruded edge rather than a blur. */
function extrude(depth: number) {
  const steps = [];
  for (let i = 1; i <= depth; i++) {
    steps.push(`${i}px ${i}px 0 color-mix(in srgb, var(--color-accent) ${34 - i * 3}%, transparent)`);
  }
  steps.push(`0 0 34px color-mix(in srgb, var(--color-accent) 45%, transparent)`);
  return steps.join(", ");
}

export function SloganTriad({
  still = false,
  className,
}: {
  still?: boolean;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{ perspective: "1100px", transformStyle: "preserve-3d" }}
    >
      <ul className="flex flex-wrap items-end gap-x-4 gap-y-4 sm:gap-x-7">
        {SLOGAN.map((word, i) => (
          <motion.li
            key={word}
            initial={still ? false : { opacity: 0, y: 16, z: i * 30 }}
            animate={{ opacity: 1, y: 0, z: i * 30 }}
            transition={
              still
                ? { duration: 0 }
                : { duration: 0.6, delay: 0.15 + i * 0.13, ease: [0.22, 1, 0.36, 1] }
            }
            className="flex items-end gap-3"
            style={{ transformStyle: "preserve-3d" }}
          >
            {i > 0 && (
              <span aria-hidden="true" className="mb-3 h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" />
            )}
            <span className="flex flex-col">
              <span className="label-micro mb-2 text-accent tabular-nums">0{i + 1}</span>
              <span
                className="font-display text-3xl leading-none font-bold tracking-tight text-white sm:text-4xl lg:text-[2.75rem]"
                style={{ textShadow: extrude(3 + i) }}
              >
                {word}
              </span>
              <motion.span
                aria-hidden="true"
                className="mt-2.5 h-0.5 origin-left bg-gradient-to-r from-accent to-transparent"
                initial={still ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={
                  still
                    ? { duration: 0 }
                    : { duration: 0.7, delay: 0.35 + i * 0.13, ease: [0.22, 1, 0.36, 1] }
                }
              />
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
