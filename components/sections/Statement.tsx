"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Container } from "@/components/ui/Container";

/**
 * Big, full-width scroll-triggered statement moment. Splits `text` into
 * words and blur-reveals them in sequence — a cinematic beat rather than a
 * single fade-up block. Falls back to a plain fade under reduced motion.
 */
export function Statement({ text }: { text: string }) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(" ");

  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.045 },
    },
  };

  const word: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 16,
      filter: shouldReduceMotion ? "none" : "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="bg-black py-28 md:py-40">
      <Container>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={container}
          className="text-balance mx-auto max-w-4xl text-center text-3xl font-medium text-white sm:text-4xl md:text-6xl"
        >
          {words.map((w, i) => (
            <motion.span key={i} variants={word} className="inline-block will-change-[filter]">
              {w}
              {i < words.length - 1 ? " " : ""}
            </motion.span>
          ))}
        </motion.p>
      </Container>
    </section>
  );
}
