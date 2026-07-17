"use client";

import { Environment, Lightformer } from "@react-three/drei";

const ACCENT = "#1471f0";
const ACCENT_2 = "#3d8bff";

/**
 * Fully synthetic reflection rig — no HDRI download. A handful of colored
 * light panels baked once (frames=1) into a small cubemap, so the crystal's
 * refraction highlights read as brand blue instead of a generic photo studio.
 */
export function CrystalEnvironment() {
  return (
    <Environment resolution={256} frames={1}>
      <Lightformer
        form="rect"
        intensity={0.9}
        color="#e8f0ff"
        position={[0, 4, 2]}
        scale={[6, 3, 1]}
      />
      <Lightformer
        form="rect"
        intensity={3.2}
        color={ACCENT}
        position={[-3, 0, 2]}
        rotation={[0, Math.PI / 3, 0]}
        scale={[3, 4, 1]}
      />
      <Lightformer
        form="rect"
        intensity={2.2}
        color={ACCENT_2}
        position={[3, -1, -2]}
        rotation={[0, -Math.PI / 4, 0]}
        scale={[3, 3, 1]}
      />
      <Lightformer form="ring" intensity={0.5} color="#bcd6ff" position={[0, 0, -4]} scale={4} />
    </Environment>
  );
}
