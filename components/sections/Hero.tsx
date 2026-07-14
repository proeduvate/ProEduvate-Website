"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Magnetic } from "@/components/ui/Magnetic";
import { WebGLBoundary } from "@/components/three/WebGLBoundary";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { jobs } from "@/data/jobs";
import { internships } from "@/data/internships";

// Three.js/WebGL only exists in the browser — load it client-only and skip
// it entirely during SSR so the initial HTML never depends on a GPU.
const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((mod) => mod.HeroScene),
  { ssr: false }
);

export function Hero() {
  const shouldReduceMotion = useReducedMotionSafe();
  const openRoles = jobs.length + internships.length;

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Background layers drift at a different rate than the foreground text as
  // the hero scrolls out of view — parallax stays on the backdrop only, per
  // the brief ("not on text — text must stay crisp/readable").
  const bgY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : 160]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, shouldReduceMotion ? 1 : 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, shouldReduceMotion ? 0 : -40]);

  // Only mount the WebGL canvas while the hero is actually on (or near)
  // screen, so scrolling three pages down doesn't leave a GPU-rendering
  // canvas running in the background for the rest of the session.
  const [heroInView, setHeroInView] = useState(true);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-black"
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <div className="bg-grid absolute inset-0" aria-hidden="true" />
        <div
          className="absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 20%, color-mix(in srgb, var(--color-primary-2) 55%, transparent), transparent), radial-gradient(45% 40% at 85% 75%, color-mix(in srgb, var(--color-accent) 30%, transparent), transparent)",
          }}
        />
        {!shouldReduceMotion && heroInView && (
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <WebGLBoundary>
              <HeroScene />
            </WebGLBoundary>
          </div>
        )}
      </motion.div>

      <motion.div style={{ opacity: contentOpacity, y: contentY }}>
        {!shouldReduceMotion && (
          /*
           * `mix-blend-mode` on the headline below needs a real backdrop
           * to react against. It doesn't blend against the WebGL canvas
           * at all in Chromium — verified directly, a plain CSS layer
           * blends correctly, canvas output doesn't. It also can't blend
           * against this file's *other* motion.div above (the one with
           * `style={{ y: bgY }}`): that wrapper is bound to a
           * continuously-live `useTransform(scrollYProgress, ...)` value,
           * which keeps it permanently on its own GPU-composited layer
           * (unlike a one-time settling animation), and Chromium can't
           * composite mix-blend-mode across that layer boundary —
           * verified directly by bisection (elements inserted together
           * into the *same* wrapper always blended; the same elements
           * split across the two sibling motion.divs never did,
           * regardless of which element was animated). So this gradient
           * lives in the *same* motion.div as the headline instead.
           */
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                "radial-gradient(30% 38% at 47% 52%, var(--color-accent), transparent 70%)",
            }}
          />
        )}
        <Container className="relative pt-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Badge tone="outline" className="mb-6">
              AI-Powered Product Company
            </Badge>
          </motion.div>

          <div className="max-w-4xl overflow-hidden">
            <motion.h1
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-balance mix-blend-difference text-4xl font-medium text-white sm:text-6xl md:text-7xl"
            >
              Building the future of learning and enterprise technology.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-balance mt-6 max-w-xl text-lg text-gray-200 sm:text-xl"
          >
            ProEduvate designs and ships AI-native products for EdTech and
            enterprise, and partners with institutions and companies who need
            the same craft applied to their own software.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <Button href="/products" size="lg">
                Explore Our Products
              </Button>
            </Magnetic>
            <Magnetic>
              <Button href="/careers" variant="outline-light" size="lg">
                We&apos;re Hiring
                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-white">
                  {openRoles}
                </span>
              </Button>
            </Magnetic>
          </motion.div>
        </Container>
      </motion.div>

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
