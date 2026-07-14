"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { jobs } from "@/data/jobs";
import { internships } from "@/data/internships";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const openRoles = jobs.length + internships.length;

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-black">
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 20%, color-mix(in srgb, var(--color-primary-2) 55%, transparent), transparent), radial-gradient(45% 40% at 85% 75%, color-mix(in srgb, var(--color-accent) 30%, transparent), transparent)",
        }}
      />
      {!shouldReduceMotion && (
        <motion.div
          aria-hidden="true"
          className="absolute top-1/4 right-[8%] h-72 w-72 rounded-full bg-accent/25 blur-[100px]"
          animate={{ y: [0, 30, 0], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <Container className="relative z-10 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Badge tone="outline" className="mb-6">
            AI-Powered Product Company
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-balance max-w-4xl text-4xl font-medium text-white sm:text-6xl md:text-7xl"
        >
          Building the future of learning and enterprise technology.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="text-balance mt-6 max-w-xl text-lg text-gray-200 sm:text-xl"
        >
          ProEduvate designs and ships AI-native products for EdTech and
          enterprise, and partners with institutions and companies who need
          the same craft applied to their own software.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Button href="/products" size="lg">
            Explore Our Products
          </Button>
          <Button href="/careers" variant="outline-light" size="lg">
            We&apos;re Hiring
            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-white">
              {openRoles}
            </span>
          </Button>
        </motion.div>
      </Container>

      {!shouldReduceMotion && (
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      )}
    </section>
  );
}
