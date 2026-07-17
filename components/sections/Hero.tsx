"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { WebGLBoundary } from "@/components/three/WebGLBoundary";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { useContextLossFallback } from "@/lib/three/use-context-loss-fallback";
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

  // Only mount the WebGL canvas while the hero is actually on (or near)
  // screen, so scrolling several pages down doesn't leave it rendering in
  // the background for the rest of the session.
  const [heroInView, setHeroInView] = useState(true);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    // A tight margin (rather than the usual "keep mounted nearby" pattern)
    // is deliberate: this canvas and the Pillars section's canvas are each
    // full WebGL contexts with their own transmission-material and Bloom
    // passes, and having both mounted at once during a fast scroll caused
    // real jank/hangs in testing. Keeping the overlap window small enough
    // that only one is ever active matters more here than avoiding a
    // mount/unmount right at the section boundary.
    const observer = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { rootMargin: "0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const contextLost = useContextLossFallback(canvasWrapperRef);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-black"
    >
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 20%, color-mix(in srgb, var(--color-primary-2) 55%, transparent), transparent), radial-gradient(45% 40% at 85% 75%, color-mix(in srgb, var(--color-accent) 30%, transparent), transparent)",
        }}
      />
      {/* Real-time 3D crystal backdrop — the gradient/grid layers above
          remain rendered underneath regardless, so a reduced-motion
          preference or a WebGL failure (caught by WebGLBoundary) both
          degrade gracefully to the same static gradient hero. */}
      {!shouldReduceMotion && heroInView && !contextLost && (
        <div
          ref={canvasWrapperRef}
          className="pointer-events-none absolute inset-0 z-[1]"
          aria-hidden="true"
        >
          <WebGLBoundary>
            <HeroScene scrollProgress={scrollYProgress} />
          </WebGLBoundary>
        </div>
      )}
      {!shouldReduceMotion && (
        <motion.div
          aria-hidden="true"
          className="absolute top-1/4 right-[8%] z-[2] h-72 w-72 rounded-full bg-accent/25 blur-[100px]"
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
