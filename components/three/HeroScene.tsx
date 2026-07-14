"use client";

import { useEffect, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sparkles } from "@react-three/drei";
import type { Mesh } from "three";

/**
 * The canvas is rendered `pointer-events-none` (see Hero.tsx) so clicks pass
 * through to the buttons/links underneath — which also means the canvas
 * never receives pointer events itself, so React Three Fiber's built-in
 * `state.pointer` never updates. Track the cursor on `window` instead and
 * feed it in via a ref that CameraRig reads every frame.
 */
function usePointerRef() {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);
  return pointer;
}

/**
 * Slowly rotating, organically distorting icosahedron — an abstract stand-in
 * for "structure taking shape," rendered in the brand blue. Distortion and
 * rotation both run off the shared clock so they stay in sync regardless of
 * frame rate.
 */
function DistortBlob() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.06;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.09;
  });

  return (
    <mesh ref={meshRef} position={[3.4, 0.6, -3.5]}>
      <icosahedronGeometry args={[1.3, 4]} />
      <MeshDistortMaterial
        color="#1471f0"
        emissive="#0a2540"
        emissiveIntensity={0.3}
        roughness={0.55}
        metalness={0.2}
        distort={0.4}
        speed={1.1}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}

/** Subtle camera drift toward the cursor — a hint of depth, not a ride. */
function CameraRig({ pointer }: { pointer: RefObject<{ x: number; y: number }> }) {
  useFrame((state) => {
    const targetX = pointer.current.x * 0.4;
    const targetY = pointer.current.y * 0.2;
    state.camera.position.x += (targetX - state.camera.position.x) * 0.03;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.03;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export function HeroScene() {
  const pointer = usePointerRef();

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6], fov: 45 }}
    >
      <ambientLight intensity={0.9} />
      <pointLight position={[4, 3, 5]} intensity={18} color="#3d8bff" />
      <DistortBlob />
      <Sparkles
        count={160}
        scale={[9, 5, 4]}
        size={2.2}
        speed={0.25}
        color="#6fadff"
        opacity={0.6}
      />
      <CameraRig pointer={pointer} />
    </Canvas>
  );
}
