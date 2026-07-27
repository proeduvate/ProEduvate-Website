"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

// A floating 3D glass emblem used as filler art in the product story panels.
// The image is a stand-in sample (free-license stock 3D render) for a real
// product mark/screenshot -- swap `imageSrc` per product once real art
// exists. Orbiting rings echo the hero's logo-formation moment for a
// consistent visual language across the site.
export function ProductGlyph({
  imageSrc,
  alt,
  accent,
}: {
  imageSrc: string;
  alt: string;
  accent: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex h-[22rem] w-[22rem] items-center justify-center"
      style={{ perspective: 1200 }}
    >
      {/* Orbit rings, counter-rotating */}
      <motion.span
        aria-hidden="true"
        className="absolute rounded-full border"
        style={{
          width: 260,
          height: 260,
          borderColor: `color-mix(in srgb, ${accent} 35%, transparent)`,
        }}
        animate={shouldReduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      />
      <motion.span
        aria-hidden="true"
        className="absolute rounded-full border border-dashed"
        style={{
          width: 340,
          height: 340,
          borderColor: `color-mix(in srgb, ${accent} 20%, transparent)`,
        }}
        animate={shouldReduceMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
      />
      {/* Orbiting particle */}
      <motion.span
        aria-hidden="true"
        className="absolute h-full w-full"
        animate={shouldReduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      >
        <span
          className="absolute top-0 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full"
          style={{ background: accent, boxShadow: `0 0 12px 2px ${accent}` }}
        />
      </motion.span>

      {/* Floating glass emblem */}
      <motion.div
        className="relative h-48 w-48 overflow-hidden rounded-[2rem] border border-white/10 backdrop-blur-xl"
        style={{
          boxShadow: `0 40px 90px -30px color-mix(in srgb, ${accent} 60%, transparent)`,
          transformStyle: "preserve-3d",
        }}
        animate={
          shouldReduceMotion
            ? undefined
            : { y: [0, -14, 0], rotateY: [0, 14, 0, -14, 0], rotateX: [0, -5, 0, 5, 0] }
        }
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src={imageSrc} alt={alt} fill sizes="192px" className="object-cover" />
        <span
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: `linear-gradient(160deg, color-mix(in srgb, ${accent} 22%, transparent), transparent 65%)` }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-[2rem]"
          style={{
            boxShadow: `inset 0 1px 1px rgba(255,255,255,0.35), inset 0 -24px 40px -24px color-mix(in srgb, ${accent} 65%, transparent)`,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
