"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import type { Mesh } from "three";
import type { MotionValue } from "framer-motion";
import type { RefObject } from "react";
import { createCrystalGeometry } from "@/lib/three/crystal-geometry";
import { CrystalMaterial } from "@/components/three/CrystalMaterial";
import { CrystalEnvironment } from "@/components/three/CrystalEnvironment";
import { usePointerRef, useMotionValueRef } from "@/lib/three/scene-hooks";
import { usePerfTier, type PerfTier } from "@/lib/use-perf-tier";

const ACCENT = "#1471f0";

// Offset to the right of center so the gem sits beside the left-aligned
// headline instead of colliding with it.
const GEM_POSITION: [number, number, number] = [2.1, -0.35, 0];
const GEM_SCALE = 0.85;

function Gem({
  scrollRef,
  pointerRef,
  perfTier,
}: {
  scrollRef: RefObject<number>;
  pointerRef: RefObject<{ x: number; y: number }>;
  perfTier: PerfTier;
}) {
  const meshRef = useRef<Mesh>(null);
  const tilt = useRef({ x: 0, z: 0 });
  const geometry = useMemo(
    () => createCrystalGeometry({ seed: 1337, girdleSegments: 7 }).full,
    []
  );

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const scroll = scrollRef.current;
    mesh.rotation.y += delta * (0.16 + scroll * 0.12);
    mesh.rotation.x =
      Math.sin(state.clock.elapsedTime * 0.35) * 0.05 + tilt.current.x;
    mesh.rotation.z = tilt.current.z;

    const targetTiltX = pointerRef.current.y * 0.18;
    const targetTiltZ = pointerRef.current.x * 0.18;
    tilt.current.x += (targetTiltX - tilt.current.x) * 0.05;
    tilt.current.z += (targetTiltZ - tilt.current.z) * 0.05;

    const targetScale = GEM_SCALE * (1 + scroll * 0.08);
    mesh.scale.setScalar(mesh.scale.x + (targetScale - mesh.scale.x) * 0.08);
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={GEM_POSITION} scale={GEM_SCALE}>
      <CrystalMaterial color={ACCENT} perfTier={perfTier} />
    </mesh>
  );
}

function CameraRig({ scrollRef }: { scrollRef: RefObject<number> }) {
  useFrame((state) => {
    const scroll = scrollRef.current;
    const targetZ = 6.2 - scroll * 1.2;
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.06;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export function HeroScene({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const pointer = usePointerRef();
  const scrollRef = useMotionValueRef(scrollProgress);
  const perfTier = usePerfTier();

  return (
    <Canvas
      dpr={perfTier === "low" ? [1, 1] : [1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6.2], fov: 42 }}
    >
      <ambientLight intensity={0.35} />
      <pointLight
        position={GEM_POSITION}
        intensity={2.2}
        color={ACCENT}
        distance={3.5}
      />
      <pointLight position={[4, 3, 5]} intensity={5} color="#ffffff" />
      <CrystalEnvironment />
      <Gem scrollRef={scrollRef} pointerRef={pointer} perfTier={perfTier} />
      {perfTier === "high" && (
        <Sparkles
          count={80}
          scale={[6, 4, 4]}
          size={1.8}
          speed={0.2}
          color="#6fadff"
          opacity={0.5}
        />
      )}
      <CameraRig scrollRef={scrollRef} />
      {perfTier === "high" && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.55}
            luminanceSmoothing={0.9}
            intensity={0.25}
            mipmapBlur
          />
        </EffectComposer>
      )}
    </Canvas>
  );
}
