"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Reveals text by wiping it up from behind a clipping edge, rather than
 * fading it in. Splits on newlines so each line gets its own overflow
 * container and staggered offset -- the effect only reads correctly when
 * lines are masked independently.
 *
 * Falls back to a plain fade when reduced motion is requested.
 */
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
  const lines = text.split("\n");

  if (shouldReduceMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={`${line}-${i}`} className={cn("block overflow-hidden", lineClassName)}>
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-15%" }}
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
