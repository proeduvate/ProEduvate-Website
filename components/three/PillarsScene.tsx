"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { BufferGeometry, Mesh, MeshBasicMaterial } from "three";
import type { MotionValue } from "framer-motion";
import type { RefObject } from "react";
import { createCrystalGeometry } from "@/lib/three/crystal-geometry";
import { CrystalMaterial } from "@/components/three/CrystalMaterial";
import { CrystalEnvironment } from "@/components/three/CrystalEnvironment";
import { usePointerRef, useMotionValueRef } from "@/lib/three/scene-hooks";
import { usePerfTier, type PerfTier } from "@/lib/use-perf-tier";

const ACCENT = "#1471f0";
const ACCENT_2 = "#3d8bff";

// Left shard sits under the "EdTech" card, right under "IT & Enterprise / AI"
// — matches the md:grid-cols-2 DOM layout below.
const LEFT_POSITION: [number, number, number] = [-1.9, 0.1, 0];
const RIGHT_POSITION: [number, number, number] = [1.9, -0.15, 0];

function Shard({
  geometry,
  position,
  tilt,
  pointerRef,
  perfTier,
}: {
  geometry: BufferGeometry;
  position: [number, number, number];
  tilt: number;
  pointerRef: RefObject<{ x: number; y: number }>;
  perfTier: PerfTier;
}) {
  const meshRef = useRef<Mesh>(null);
  const wobble = useRef(0);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.rotation.y += delta * 0.12;
    const targetWobble = pointerRef.current.x * 0.1;
    wobble.current += (targetWobble - wobble.current) * 0.04;
    mesh.rotation.z = tilt + wobble.current;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={position}>
      {/* "reduced" quality: two transmissive shards render at once here,
          vs. the Hero's single gem, so each instance uses a cheaper
          samples/resolution config to keep the combined cost comparable. */}
      <CrystalMaterial color={ACCENT} perfTier={perfTier} quality="reduced" />
    </mesh>
  );
}

function LightBridge({ scrollRef }: { scrollRef: RefObject<number> }) {
  const meshRef = useRef<Mesh>(null);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const material = mesh.material as MeshBasicMaterial;
    material.opacity = 0.12 + scrollRef.current * 0.4;
  });

  return (
    <mesh ref={meshRef} position={[0, -0.05, 0]}>
      <boxGeometry args={[3.2, 0.015, 0.015]} />
      <meshBasicMaterial color={ACCENT_2} transparent opacity={0.15} toneMapped={false} />
    </mesh>
  );
}

export function PillarsScene({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const pointer = usePointerRef();
  const scrollRef = useMotionValueRef(scrollProgress);
  const perfTier = usePerfTier();

  const { crown, pavilion } = useMemo(
    () => createCrystalGeometry({ seed: 1337, girdleSegments: 7 }),
    []
  );

  return (
    // No Bloom/EffectComposer here (unlike HeroScene) and a lower dpr cap:
    // this scene runs two MeshTransmissionMaterial instances at once, which
    // is already roughly double HeroScene's single-instance cost, and the
    // two canvases can briefly be mounted together mid-scroll — keeping
    // this one cheap is what keeps that overlap from janking the page.
    <Canvas
      dpr={perfTier === "low" ? [1, 1] : [1, 1.25]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 7], fov: 42 }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={LEFT_POSITION} intensity={1.6} color={ACCENT} distance={3.5} />
      <pointLight position={RIGHT_POSITION} intensity={1.6} color={ACCENT_2} distance={3.5} />
      <CrystalEnvironment />
      <Shard
        geometry={crown}
        position={LEFT_POSITION}
        tilt={0.18}
        pointerRef={pointer}
        perfTier={perfTier}
      />
      <Shard
        geometry={pavilion}
        position={RIGHT_POSITION}
        tilt={-0.18}
        pointerRef={pointer}
        perfTier={perfTier}
      />
      <LightBridge scrollRef={scrollRef} />
    </Canvas>
  );
}
