"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ParticleField } from "@/components/ui/ParticleField";

/**
 * Chooses which ambient particle layer the hero gets.
 *
 * Preferred is the WebGL point cloud, matching the "One system. Every
 * discipline." section. Where WebGL is unavailable it falls back to the 2D
 * canvas field, which is the same idea drawn on the CPU -- worth keeping
 * rather than dropping to nothing, since the hero is the first thing anyone
 * sees.
 *
 * three.js is heavy and purely decorative here, so it stays out of the
 * initial bundle and off the server.
 */
const HeroSignalField = dynamic(() => import("@/components/ui/HeroSignalField"), {
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

type Mode = "pending" | "webgl" | "canvas" | "none";

export function HeroParticles({ className }: { className?: string }) {
  const [mode, setMode] = useState<Mode>("pending");

  useEffect(() => {
    // Deferred out of the effect body so this doesn't setState synchronously
    // during the effect.
    const t = setTimeout(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setMode("none");
        return;
      }
      setMode(supportsWebGL() ? "webgl" : "canvas");
    }, 0);
    return () => clearTimeout(t);
  }, []);

  if (mode === "webgl") {
    return (
      <div className={className} aria-hidden="true">
        <HeroSignalField />
      </div>
    );
  }
  if (mode === "canvas") return <ParticleField className={className} />;
  return null;
}
