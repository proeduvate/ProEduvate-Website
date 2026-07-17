"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useScroll } from "framer-motion";
import { GraduationCap, Cpu, ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, AnimatedReveal } from "@/components/ui/AnimatedReveal";
import { WebGLBoundary } from "@/components/three/WebGLBoundary";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { useContextLossFallback } from "@/lib/three/use-context-loss-fallback";

// Three.js/WebGL only exists in the browser — load it client-only and skip
// it entirely during SSR so the initial HTML never depends on a GPU.
const PillarsScene = dynamic(
  () => import("@/components/three/PillarsScene").then((mod) => mod.PillarsScene),
  { ssr: false }
);

const pillars = [
  {
    icon: GraduationCap,
    title: "EdTech",
    description:
      "Learning platforms, adaptive tutoring, and campus systems built for institutions that need software as rigorous as their curriculum.",
    href: "/products",
    linkLabel: "See our EdTech products",
  },
  {
    icon: Cpu,
    title: "IT & Enterprise / AI",
    description:
      "AI automation, analytics, and enterprise platforms engineered for teams that need reliable software, not another proof of concept.",
    href: "/services",
    linkLabel: "See our services",
  },
];

export function Pillars() {
  const shouldReduceMotion = useReducedMotionSafe();

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.85", "start 0.35"],
  });

  // Only mount the WebGL canvas while the section is actually on (or near)
  // screen.
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    // Tight margin, not the usual "keep mounted nearby" pattern — this
    // canvas and the Hero's are each a full WebGL context with their own
    // transmission-material/Bloom cost, and both mounted at once during a
    // fast scroll caused real jank/hangs in testing.
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
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
      className="relative overflow-hidden bg-black py-24 md:py-32"
    >
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(to bottom, #030507 0%, color-mix(in srgb, var(--color-primary) 45%, #030507) 50%, #030507 100%)",
        }}
      />

      {/* Real-time twin-shard crystal backdrop — same fallback contract as
          the Hero: reduced motion or a WebGL failure (WebGLBoundary) both
          leave the gradient background and DOM cards fully intact. */}
      {!shouldReduceMotion && inView && !contextLost && (
        <div
          ref={canvasWrapperRef}
          className="pointer-events-none absolute inset-0 z-0"
          aria-hidden="true"
        >
          <WebGLBoundary>
            <PillarsScene scrollProgress={scrollYProgress} />
          </WebGLBoundary>
        </div>
      )}

      <Container className="relative z-10">
        <SectionHeading
          dark
          eyebrow="What We Do"
          title="Two disciplines. One standard of craft."
          description="ProEduvate operates across EdTech and IT/enterprise software, building our own products and shipping custom work for clients in both."
        />

        <Stagger className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {pillars.map((pillar) => (
            <AnimatedReveal key={pillar.title}>
              <Link
                href={pillar.href}
                className="group block h-full rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm transition-all duration-300 hover:border-accent/40 hover:bg-white/[0.07] hover:shadow-[0_30px_80px_-30px_rgba(20,113,240,0.45)] md:p-10"
              >
                <pillar.icon className="h-9 w-9 text-accent-glow" aria-hidden="true" />
                <h3 className="mt-6 text-2xl font-medium text-white md:text-3xl">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-gray-300">
                  {pillar.description}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-glow">
                  {pillar.linkLabel}
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </AnimatedReveal>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}
