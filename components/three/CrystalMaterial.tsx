"use client";

import { MeshTransmissionMaterial } from "@react-three/drei";
import type { PerfTier } from "@/lib/use-perf-tier";

interface CrystalMaterialProps {
  color: string;
  perfTier: PerfTier;
  /**
   * Lower this for secondary/smaller instances (e.g. the Pillars shards,
   * where two transmissive objects render at once) to offset the cost of
   * more than one MeshTransmissionMaterial render-to-texture pass per frame.
   */
  quality?: "full" | "reduced";
}

export function CrystalMaterial({ color, perfTier, quality = "full" }: CrystalMaterialProps) {
  if (perfTier === "low") {
    // three's built-in transmission is a single lightweight transparent
    // pass — no offscreen render-to-texture like MeshTransmissionMaterial,
    // so this is the right cheap substitute for mobile/low-end GPUs.
    return (
      <meshPhysicalMaterial
        color={color}
        transmission={1}
        thickness={0.4}
        roughness={0.15}
        ior={1.35}
        emissive={color}
        emissiveIntensity={0.12}
        envMapIntensity={1}
      />
    );
  }

  const samples = quality === "full" ? 6 : 3;
  const resolution = quality === "full" ? 1024 : 384;

  return (
    <MeshTransmissionMaterial
      // backside-sampling roughly doubles the raymarch cost — only worth
      // it for the Hero's single "full quality" instance.
      backside={quality === "full"}
      samples={samples}
      resolution={resolution}
      transmission={1}
      roughness={0.05}
      thickness={0.6}
      ior={1.4}
      chromaticAberration={0.04}
      anisotropy={0.1}
      distortion={0.1}
      distortionScale={0.3}
      temporalDistortion={0.1}
      color={color}
    />
  );
}
