"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Magnetic } from "@/components/ui/Magnetic";
import { ScrollFrameSequence } from "@/components/sections/ScrollFrameSequence";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { TEXT_BEATS } from "@/lib/hero-timeline";
import { jobs } from "@/data/jobs";
import { internships } from "@/data/internships";

// A pre-rendered frame sequence baked from the live HeroScene.tsx 3D build
// (rendered at app/dev/hero-capture, a bare capture rig — scroll it through
// and screenshot the viewport at each step to regenerate the sequence
// below). See ScrollFrameSequence's header comment for why this project
// uses a scrubbed image sequence instead of a live WebGL canvas or a
// scrubbed <video>.
const HERO_FRAME_COUNT = 96;
const HERO_FRAME_BASE_PATH = "/hero-frames";

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

  // Three scroll-choreographed text beats, timed against the 3D sequence
  // in HeroScene.tsx: the headline (now right-aligned, since the laptop +
  // phone sit on the left — see HeroScene.tsx) fades as they float up:
  // a mid statement fades in on the left as the logo arrives and settles,
  // then the closing CTA takes over as it flies off. Headline is fully
  // visible at rest (progress 0) so it never depends on the user scrolling
  // first.
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
  const headlineOpacity = useTransform(
    scrollYProgress,
    [0, TEXT_BEATS.headlineFadeStart, TEXT_BEATS.headlineFadeEnd],
    [1, 1, 0],
    noAccelerate
  );
  const headlineY = useTransform(
    scrollYProgress,
    [0, TEXT_BEATS.headlineFadeStart, TEXT_BEATS.headlineFadeEnd],
    [0, 0, -50],
    noAccelerate
  );
  const statementOpacity = useTransform(
    scrollYProgress,
    [
      TEXT_BEATS.statementFadeInStart,
      TEXT_BEATS.statementFadeInEnd,
      TEXT_BEATS.statementFadeOutStart,
      TEXT_BEATS.statementFadeOutEnd,
    ],
    [0, 1, 1, 0],
    noAccelerate
  );
  const statementY = useTransform(
    scrollYProgress,
    [
      TEXT_BEATS.statementFadeInStart,
      TEXT_BEATS.statementFadeInEnd,
      TEXT_BEATS.statementFadeOutStart,
      TEXT_BEATS.statementFadeOutEnd,
    ],
    [30, 0, 0, -50],
    noAccelerate
  );
  const ctaOpacity = useTransform(
    scrollYProgress,
    [TEXT_BEATS.ctaFadeStart, TEXT_BEATS.ctaFadeEnd],
    [0, 1],
    noAccelerate
  );
  const ctaY = useTransform(
    scrollYProgress,
    [TEXT_BEATS.ctaFadeStart, TEXT_BEATS.ctaFadeEnd],
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

  // Under prefers-reduced-motion, skip the scroll-pinned story entirely —
  // a single static viewport with the same core content and no forced
  // extra scrolling, no WebGL.
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
    <section ref={sectionRef} className="relative h-[300vh] bg-black md:h-[340vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="bg-grid absolute inset-0" aria-hidden="true" />
        <div className="absolute inset-0" aria-hidden="true" style={backdropStyle} />

        {heroInView && (
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <ScrollFrameSequence
              scrollProgress={scrollYProgress}
              frameCount={HERO_FRAME_COUNT}
              basePath={HERO_FRAME_BASE_PATH}
            />
          </div>
        )}

        {/* Headline — badge + primary headline, right-aligned, while the
            laptop + phone sit on the left (see HeroScene.tsx). The
            emphasized phrase is plain gradient-clipped text, no blend-mode
            glow behind it. */}
        <motion.div
          data-hero-overlay
          style={{ opacity: headlineOpacity, y: headlineY }}
          className="pointer-events-none absolute inset-0 flex items-center justify-end"
        >
          <Container className="relative text-right">
            <Badge tone="outline" className="mb-6">
              AI-Powered Product Company
            </Badge>
            <h1 className="text-balance ml-auto max-w-4xl text-4xl font-medium text-white sm:text-6xl md:text-7xl">
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
            <p className="text-balance ml-auto mt-6 max-w-xl text-lg text-gray-200 sm:text-xl">
              ProEduvate designs and ships AI-native products for EdTech and
              enterprise, and partners with institutions and companies who
              need the same craft applied to their own software.
            </p>
          </Container>
        </motion.div>

        {/* Statement — a short mid beat, left-aligned, timed to the logo's
            arrival and settle. */}
        <motion.div
          data-hero-overlay
          style={{ opacity: statementOpacity, y: statementY }}
          className="pointer-events-none absolute inset-0 flex items-center justify-start"
        >
          <Container className="relative">
            <p className="text-balance max-w-lg text-3xl font-medium text-white sm:text-4xl md:text-5xl">
              AI-native.{" "}
              <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
                Enterprise-grade.
              </span>{" "}
              Built to ship.
            </p>
          </Container>
        </motion.div>

        {/* Close — final line + the real CTAs, centered, fading in as the
            logo flies off and handing off to the next section as the pin
            releases. */}
        <motion.div
          data-hero-overlay
          style={{ opacity: ctaOpacity, y: ctaY }}
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
          data-hero-overlay
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
