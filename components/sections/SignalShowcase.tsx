"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Container } from "@/components/ui/Container";
import { BracketFrame } from "@/components/ui/BracketFrame";
import { MaskReveal } from "@/components/ui/MaskReveal";
import { AnimatedReveal } from "@/components/ui/AnimatedReveal";

// Three.js is a heavy dependency and pure decoration -- keep it out of the
// initial bundle and off the server.
const SignalMesh = dynamic(() => import("@/components/ui/SignalMesh"), {
  ssr: false,
  loading: () => null,
});

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

const readouts = [
  { label: "Sectors", value: "08" },
  { label: "Domains", value: "10" },
  { label: "Products", value: "17" },
];

export function SignalShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mountScene, setMountScene] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !supportsWebGL()) return;

    // Only pay for the scene once the section is actually approached.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMountScene(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[92vh] items-center overflow-hidden border-y border-white/10 bg-surface py-24"
    >
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

      {/* The scene sits behind the copy and is purely decorative. */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {mountScene && <SignalMesh />}
      </div>

      {/* Fallback glow so the section still reads with WebGL unavailable. */}
      {!mountScene && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 h-[46vh] w-[46vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[110px]"
          style={{ background: "var(--color-accent)" }}
        />
      )}

      <BracketFrame inset="inset-8" />

      <Container className="relative">
        <div className="max-w-3xl">
          <AnimatedReveal y={0}>
            <div className="label-micro mb-8 flex items-center gap-3 text-accent">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <span>Live System</span>
            </div>
          </AnimatedReveal>

          <MaskReveal
            as="h2"
            text={"One system.\nEvery discipline."}
            className="display-lg text-balance text-chalk"
          />

          <AnimatedReveal delay={0.2}>
            <p className="mt-8 max-w-lg text-lg text-gray-400">
              Sectors, domains, and products are not separate practices here. They run
              on the same engineering standard, the same team, and the same intent.
            </p>
          </AnimatedReveal>

          <AnimatedReveal delay={0.3}>
            <dl className="mt-12 flex flex-wrap gap-x-14 gap-y-6 border-t border-white/10 pt-8">
              {readouts.map((item) => (
                <div key={item.label}>
                  <dt className="label-micro text-gray-500">{item.label}</dt>
                  <dd className="mt-2 font-display text-4xl font-normal text-chalk tabular-nums">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </AnimatedReveal>
        </div>
      </Container>
    </section>
  );
}
