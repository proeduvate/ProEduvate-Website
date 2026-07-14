"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { Badge } from "@/components/ui/Badge";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-black pt-40 pb-20 md:pt-48 md:pb-28">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(55% 60% at 20% 10%, color-mix(in srgb, var(--color-primary-2) 55%, transparent), transparent)",
        }}
      />
      <Container className="relative">
        <AnimatedReveal>
          <Badge tone="outline" className="mb-6">
            {eyebrow}
          </Badge>
          <div className="max-w-3xl overflow-hidden">
            <motion.h1
              initial={{ y: shouldReduceMotion ? 0 : "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-balance text-4xl font-medium text-white sm:text-5xl md:text-6xl"
            >
              {title}
            </motion.h1>
          </div>
          {description && (
            <p className="text-balance mt-6 max-w-xl text-lg text-gray-300">{description}</p>
          )}
          {children}
        </AnimatedReveal>
      </Container>
    </section>
  );
}
