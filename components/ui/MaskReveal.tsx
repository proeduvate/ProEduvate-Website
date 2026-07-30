"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Reveals text by wiping it up from behind a clipping edge. Splits on
 * newlines so each line is masked independently -- the effect only reads
 * correctly that way.
 *
 * The lines start translated out of an `overflow-hidden` box, which means a
 * missed reveal leaves the heading permanently invisible. To make that
 * unreachable, the reveal fires on whichever comes first: the element
 * entering the viewport, or a short mount timeout. Content visibility never
 * depends on the observer alone.
 */
const FAILSAFE_MS = 900;

export function MaskReveal({
  text,
  className,
  lineClassName,
  delay = 0,
  as: Tag = "span",
}: {
  /** Use \n to force line breaks; each line is masked separately. */
  text: string;
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: "span" | "div" | "h1" | "h2" | "h3";
}) {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const [failsafe, setFailsafe] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFailsafe(true), FAILSAFE_MS);
    return () => clearTimeout(t);
  }, []);

  const revealed = inView || failsafe;
  const lines = text.split("\n");

  if (shouldReduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className}>
      {/* Ref lives on a zero-height probe so it measures the heading box. */}
      <span ref={ref} className="sr-only" aria-hidden="true" />
      {lines.map((line, i) => (
        <span
          key={`${line}-${i}`}
          // Extra bottom padding (cancelled by the negative margin) gives
          // descenders room inside the clip box at line-height ~1.
          className={cn("block overflow-hidden pb-[0.14em] -mb-[0.14em]", lineClassName)}
        >
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            animate={revealed ? { y: "0%" } : { y: "110%" }}
            transition={{
              duration: 0.85,
              delay: delay + i * 0.09,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
