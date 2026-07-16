"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import { HeroScene } from "@/components/three/HeroScene";

// A bare capture rig for scripts/capture-hero-frames.py: the same sticky,
// scroll-driven HeroScene as the real Hero section, with none of the site
// chrome or DOM text overlays around it, so a screenshot of the viewport is
// exactly the backdrop + 3D frame the frame-sequence player should show.
// Not linked from anywhere in the site — visit directly to regenerate the
// baked sequence in public/hero-frames/ after changing the 3D choreography.
const backdropStyle = {
  background:
    "radial-gradient(60% 50% at 50% 20%, color-mix(in srgb, var(--color-primary-2) 55%, transparent), transparent), radial-gradient(45% 40% at 85% 75%, color-mix(in srgb, var(--color-accent) 30%, transparent), transparent)",
};

export default function HeroCapturePage() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={sectionRef} className="relative h-[300vh] bg-black md:h-[340vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="bg-grid absolute inset-0" aria-hidden="true" />
        <div className="absolute inset-0" aria-hidden="true" style={backdropStyle} />
        <div className="absolute inset-0" aria-hidden="true">
          <HeroScene scrollProgress={scrollYProgress} />
        </div>
      </div>
    </section>
  );
}
