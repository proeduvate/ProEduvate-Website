"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/*
 * A product's real UI, angled in 3D so it faces the copy beside it.
 *
 * The rotation is signed off the panel's alignment: the edge nearest the
 * title is the one brought forward, so the screen reads as turned toward the
 * text rather than away from it. A flat screenshot next to a heading looks
 * pasted on; angled, it reads as a device sitting on the page.
 *
 * `rotateY` is what does the work -- the rotation people mean by "tilted on
 * the Z axis" is a turn *around* the vertical axis, through depth.
 */

const TILT_DEG = 30;

export function ProductScreenshot({
  src,
  alt,
  accent,
  /** Which side the copy is on; the image turns to face it. */
  facing,
}: {
  src: string;
  alt: string;
  accent: string;
  facing: "left" | "right";
}) {
  const shouldReduceMotion = useReducedMotion();
  // Bring the edge closest to the title toward the viewer.
  //
  // The sign is the opposite of what it reads as: a positive `rotateY` swings
  // the element's *right* edge away from the camera, so facing the copy on
  // the left needs a negative angle, not a positive one. The first version
  // had this backwards and every screen leaned away from its own text.
  const tilt = facing === "left" ? -TILT_DEG : TILT_DEG;

  return (
    <div
      className="relative flex w-full max-w-[34rem] items-center justify-center"
      style={{ perspective: "1600px" }}
    >
      {/* Glow pooled under the panel, so it sits in light rather than on nothing. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-6 top-1/2 h-2/3 -translate-y-1/2 rounded-[50%] opacity-40 blur-[70px]"
        style={{ background: accent }}
      />

      <motion.div
        initial={
          shouldReduceMotion
            ? { opacity: 0 }
            : { opacity: 0, rotateY: tilt * 1.5, rotateX: 10, y: 30 }
        }
        whileInView={
          shouldReduceMotion
            ? { opacity: 1 }
            : { opacity: 1, rotateY: tilt, rotateX: 6, y: 0 }
        }
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="relative overflow-hidden rounded-xl border border-white/15 bg-surface-2"
          style={{
            boxShadow: `0 50px 110px -40px color-mix(in srgb, ${accent} 75%, transparent), 0 0 0 1px rgba(255,255,255,0.04)`,
          }}
        >
          <Image
            src={src}
            alt={alt}
            width={1600}
            height={900}
            sizes="(max-width: 1024px) 90vw, 34rem"
            className="h-auto w-full object-cover"
          />

          {/* Screen sheen. Flipped alongside the tilt above -- the highlight
              belongs on the edge swinging toward the camera, so it has to
              follow the rotation rather than stay on a fixed side. */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                facing === "left"
                  ? "linear-gradient(255deg, rgba(255,255,255,0.14) 0%, transparent 38%)"
                  : "linear-gradient(105deg, rgba(255,255,255,0.14) 0%, transparent 38%)",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
