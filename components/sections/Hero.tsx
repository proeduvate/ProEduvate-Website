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
import { TEXT_BEATS } from "@/lib/hero-timeline";
import { jobs } from "@/data/jobs";
import { internships } from "@/data/internships";

// Three.js/WebGL only exists in the browser — load it client-only and skip
// it entirely during SSR so the initial HTML never depends on a GPU.
const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((mod) => mod.HeroScene),
  { ssr: false }
);

const backdropStyle = {
  background:
    "radial-gradient(60% 50% at 50% 20%, color-mix(in srgb, var(--color-primary-2) 55%, transparent), transparent), radial-gradient(45% 40% at 85% 75%, color-mix(in srgb, var(--color-accent) 30%, transparent), transparent)",
};

export function Hero() {
  const shouldReduceMotion = useReducedMotionSafe();
  const openRoles = jobs.length + internships.length;

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Three scroll-choreographed text beats, timed against the same
  // HERO_TIMELINE phases driving the 3D scene (see HeroScene.tsx): beat 1
  // rides alongside the laptop/phone product shot, beat 2 covers the logo's
  // flight/landing/roll, beat 3 is the closing CTA as it exits. Beat 1 is
  // fully visible at rest (progress 0) so the headline never depends on the
  // user scrolling first.
  //
  // `clamp: false` looks backwards here (our arrays never extrapolate,
  // real scrollYProgress never leaves [0,1]) but it's actually what keeps
  // these correct: Framer Motion opts array-output useTransform calls into
  // a native CSS ViewTimeline "acceleration" path whenever the browser
  // supports it, and that native timeline computes progress against the
  // *whole* (huge) section rather than our sticky-pin range — verified
  // directly by comparing a debug useTransform(scrollYProgress, v => ...)
  // (a function transformer, never eligible for acceleration) to these: at
  // real progress 0.9 the accelerated versions were still rendering as if
  // progress were ~0.25. `clamp: false` is the documented escape hatch that
  // disables that opt-in, forcing the plain JS-computed value that matches
  // the debug readout.
  const noAccelerate = { clamp: false };
  const beat1Opacity = useTransform(
    scrollYProgress,
    [0, TEXT_BEATS.beat1FadeStart, TEXT_BEATS.beat1FadeEnd],
    [1, 1, 0],
    noAccelerate
  );
  const beat1Y = useTransform(
    scrollYProgress,
    [0, TEXT_BEATS.beat1FadeStart, TEXT_BEATS.beat1FadeEnd],
    [0, 0, -50],
    noAccelerate
  );
  const beat2Opacity = useTransform(
    scrollYProgress,
    [
      TEXT_BEATS.beat2FadeInStart,
      TEXT_BEATS.beat2FadeInEnd,
      TEXT_BEATS.beat2FadeOutStart,
      TEXT_BEATS.beat2FadeOutEnd,
    ],
    [0, 1, 1, 0],
    noAccelerate
  );
  const beat2Y = useTransform(
    scrollYProgress,
    [
      TEXT_BEATS.beat2FadeInStart,
      TEXT_BEATS.beat2FadeInEnd,
      TEXT_BEATS.beat2FadeOutStart,
      TEXT_BEATS.beat2FadeOutEnd,
    ],
    [30, 0, 0, -50],
    noAccelerate
  );
  const beat3Opacity = useTransform(
    scrollYProgress,
    [TEXT_BEATS.beat3FadeInStart, TEXT_BEATS.beat3FadeInEnd],
    [0, 1],
    noAccelerate
  );
  const beat3Y = useTransform(
    scrollYProgress,
    [TEXT_BEATS.beat3FadeInStart, TEXT_BEATS.beat3FadeInEnd],
    [30, 0],
    noAccelerate
  );
  const cueOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0], noAccelerate);

  // Only mount the WebGL canvas while the hero is actually on (or near)
  // screen, so scrolling several pages down doesn't leave a GPU-rendering
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

  // Under prefers-reduced-motion, skip the multi-viewport scroll-pinned
  // story entirely — a single static viewport with the same core content
  // and no forced extra scrolling, no WebGL.
  if (shouldReduceMotion) {
    return (
      <section className="relative flex min-h-screen items-center overflow-hidden bg-black">
        <div className="bg-grid absolute inset-0" aria-hidden="true" />
        <div className="absolute inset-0" aria-hidden="true" style={backdropStyle} />
        <Container className="relative pt-24">
          <Badge tone="outline" className="mb-6">
            AI-Powered Product Company
          </Badge>
          <h1 className="text-balance max-w-4xl text-4xl font-medium text-white sm:text-6xl md:text-7xl">
            Building the future of learning and enterprise technology.
          </h1>
          <p className="text-balance mt-6 max-w-xl text-lg text-gray-200 sm:text-xl">
            ProEduvate designs and ships AI-native products for EdTech and
            enterprise, and partners with institutions and companies who need
            the same craft applied to their own software.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="/products" size="lg">
              Explore Our Products
            </Button>
            <Button href="/careers" variant="outline-light" size="lg">
              We&apos;re Hiring
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-semibold text-white">
                {openRoles}
              </span>
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative h-[420vh] bg-black md:h-[480vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="bg-grid absolute inset-0" aria-hidden="true" />
        <div className="absolute inset-0" aria-hidden="true" style={backdropStyle} />

        {heroInView && (
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <WebGLBoundary>
              <HeroScene scrollProgress={scrollYProgress} />
            </WebGLBoundary>
          </div>
        )}

        {/* Beat 1 — arrival: badge + primary headline, left-aligned, while
            the laptop/phone product shot sits on the right (see
            HeroScene.tsx). The emphasized phrase is plain gradient-clipped
            text rather than a blend-mode glow — no soft "blob" behind it,
            just a colored keyword like the reference layout. */}
        <motion.div
          style={{ opacity: beat1Opacity, y: beat1Y }}
          className="pointer-events-none absolute inset-0 flex items-center"
        >
          <Container className="relative">
            <Badge tone="outline" className="mb-6">
              AI-Powered Product Company
            </Badge>
            <h1 className="text-balance max-w-4xl text-4xl font-medium text-white sm:text-6xl md:text-7xl">
              Building the{" "}
              <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
                future
              </span>{" "}
              of learning and{" "}
              <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
                enterprise technology
              </span>
              .
            </h1>
            <p className="text-balance mt-6 max-w-xl text-lg text-gray-200 sm:text-xl">
              ProEduvate designs and ships AI-native products for EdTech and
              enterprise, and partners with institutions and companies who
              need the same craft applied to their own software.
            </p>
          </Container>
        </motion.div>

        {/* Beat 2 — crossing: secondary statement, right-aligned, timed to
            the logo's landing on the left of the frame. */}
        <motion.div
          style={{ opacity: beat2Opacity, y: beat2Y }}
          className="pointer-events-none absolute inset-0 flex items-center justify-end"
        >
          <Container className="relative">
            <p className="text-balance ml-auto max-w-lg text-right text-3xl font-medium text-white sm:text-4xl md:text-5xl">
              AI-native.{" "}
              <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
                Enterprise-grade.
              </span>{" "}
              Built to ship.
            </p>
          </Container>
        </motion.div>

        {/* Beat 3 — close: final line + the real CTAs, centered, handing
            off to the next section as the pin releases. */}
        <motion.div
          style={{ opacity: beat3Opacity, y: beat3Y }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <Container className="relative text-center">
            <p className="text-balance mx-auto max-w-2xl text-2xl font-medium text-white sm:text-3xl">
              Let&apos;s build what&apos;s next.
            </p>
            <div className="pointer-events-auto mt-8 flex flex-wrap items-center justify-center gap-4">
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
            </div>
          </Container>
        </motion.div>

        <motion.div
          style={{ opacity: cueOpacity }}
          className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60"
          aria-hidden="true"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-6 w-6" />
          </motion.div>
        </motion.div>
      </div>

      {/*
        A designed seam instead of a flat color cut into the next section:
        a bold diagonal wedge with an accent-lit edge, so the boundary reads
        as an intentional beat right as the pinned scroll releases.
      */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 md:h-36"
        aria-hidden="true"
        style={{
          clipPath: "polygon(0 100%, 100% 45%, 100% 100%)",
          background:
            "linear-gradient(200deg, color-mix(in srgb, var(--color-accent-glow) 55%, transparent) 0%, transparent 35%)",
        }}
      />
    </section>
  );
}
