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
    <mesh ref={meshRef} position={[-0.4, -0.5, -1.8]}>
      <icosahedronGeometry args={[1.7, 4]} />
      <MeshDistortMaterial
        color="#1471f0"
        emissive="#1471f0"
        emissiveIntensity={1.1}
        roughness={0.4}
        metalness={0.1}
        distort={0.4}
        speed={1.1}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

/**
 * Camera choreography: an eased dolly-in on load (pulled back and off-angle
 * at t=0, settling into the resting frame over ~2.5s), a slow continuous
 * autonomous drift layered underneath so the shot never goes fully static,
 * and a subtle pull toward the cursor on top of both.
 */
function CameraRig({ pointer }: { pointer: RefObject<{ x: number; y: number }> }) {
  const introDuration = 2.5;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const introT = Math.min(t / introDuration, 1);
    const eased = 1 - Math.pow(1 - introT, 3);

    const autoX = Math.sin(t * 0.15) * 0.3;
    const autoY = Math.cos(t * 0.1) * 0.15;
    const introOffsetX = (1 - eased) * 2.2;
    const introZ = 9 - eased * 3;

    const targetX = pointer.current.x * 0.4 + autoX + introOffsetX;
    const targetY = pointer.current.y * 0.2 + autoY;

    state.camera.position.x += (targetX - state.camera.position.x) * 0.04;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.04;
    state.camera.position.z += (introZ - state.camera.position.z) * 0.05;
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
      camera={{ position: [2.2, 0, 9], fov: 45 }}
    >
      <fog attach="fog" args={["#030507", 5, 13]} />
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
      <Sparkles
        count={40}
        scale={[5, 3, 3]}
        position={[0, 0, 2]}
        size={3.5}
        speed={0.15}
        color="#ffffff"
        opacity={0.35}
      />
      <CameraRig pointer={pointer} />
    </Canvas>
  );
}
