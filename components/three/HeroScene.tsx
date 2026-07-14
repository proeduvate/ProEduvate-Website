"use client";

import { useEffect, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import type { Mesh, MeshStandardMaterial } from "three";
import type { MotionValue } from "framer-motion";

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

/** Mirrors a Framer Motion value into a ref so useFrame can read it every tick without re-rendering. */
function useMotionValueRef(value: MotionValue<number>) {
  const ref = useRef(value.get());
  useEffect(() => {
    ref.current = value.get();
    return value.on("change", (v) => {
      ref.current = v;
    });
  }, [value]);
  return ref;
}

type Shape = "torus" | "octahedron" | "box" | "capsule" | "cone";

interface ServiceObjectConfig {
  shape: Shape;
  position: [number, number, number];
  color: string;
  rotationSpeed: [number, number, number];
  scrollDrift: [number, number, number];
  scale: number;
  wireframe?: boolean;
}

// Loosely tied to the company's pillars (EdTech, AI, Enterprise, Products) —
// abstract geometric stand-ins rather than literal icons, so they read as
// premium/tech rather than clip-art. Colors, depth (z), and scale vary so
// the cluster has real parallax when the camera or scroll moves.
const OBJECTS: ServiceObjectConfig[] = [
  {
    shape: "torus",
    position: [2.7, 0.9, -2.2],
    color: "#1471f0",
    rotationSpeed: [0.25, 0.35, 0],
    scrollDrift: [0.7, 1.6, -0.4],
    scale: 0.9,
  },
  {
    shape: "octahedron",
    position: [0.5, -0.7, -3.4],
    color: "#3d8bff",
    rotationSpeed: [0.3, 0.2, 0.15],
    scrollDrift: [-0.9, 1.9, 0.6],
    scale: 0.75,
  },
  {
    shape: "box",
    position: [3.6, -1.0, -1.4],
    color: "#6fadff",
    rotationSpeed: [0.2, 0.25, 0.3],
    scrollDrift: [1.2, 1.2, -0.3],
    scale: 0.55,
    wireframe: true,
  },
  {
    shape: "capsule",
    position: [1.5, 1.5, -2.8],
    color: "#1471f0",
    rotationSpeed: [0.15, 0.1, 0.3],
    scrollDrift: [-0.5, 2.1, 0.5],
    scale: 0.5,
  },
  {
    shape: "cone",
    position: [-0.6, 1.1, -3.6],
    color: "#5b9cff",
    rotationSpeed: [0.1, 0.3, 0.1],
    scrollDrift: [-0.3, 1.7, -0.6],
    scale: 0.5,
    wireframe: true,
  },
];

function ObjectGeometry({ shape }: { shape: Shape }) {
  switch (shape) {
    case "torus":
      return <torusGeometry args={[1, 0.34, 16, 100]} />;
    case "octahedron":
      return <octahedronGeometry args={[1, 0]} />;
    case "box":
      return <boxGeometry args={[1.3, 1.3, 1.3]} />;
    case "capsule":
      return <capsuleGeometry args={[0.55, 1.1, 4, 16]} />;
    case "cone":
      return <coneGeometry args={[0.9, 1.6, 24]} />;
  }
}

/**
 * One floating geometric object: continuous independent rotation, plus a
 * scroll-linked drift/fade so it visually moves apart from and past the
 * headline text as the user scrolls through the hero.
 */
function FloatingObject({
  config,
  scrollProgress,
}: {
  config: ServiceObjectConfig;
  scrollProgress: RefObject<number>;
}) {
  const meshRef = useRef<Mesh>(null);
  const [baseX, baseY, baseZ] = config.position;
  const [driftX, driftY, driftZ] = config.scrollDrift;

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    mesh.rotation.x = t * config.rotationSpeed[0];
    mesh.rotation.y = t * config.rotationSpeed[1];
    mesh.rotation.z = t * config.rotationSpeed[2];

    const p = scrollProgress.current;
    mesh.position.set(baseX + driftX * p, baseY + driftY * p, baseZ + driftZ * p);
    const scale = config.scale * (1 - p * 0.3);
    mesh.scale.setScalar(scale);

    const material = mesh.material as MeshStandardMaterial;
    material.opacity = (config.wireframe ? 0.7 : 0.55) * (1 - p * 0.9);
  });

  return (
    <mesh ref={meshRef} position={config.position}>
      <ObjectGeometry shape={config.shape} />
      <meshStandardMaterial
        color={config.color}
        emissive={config.color}
        emissiveIntensity={config.wireframe ? 0.2 : 0.35}
        roughness={0.4}
        metalness={0.25}
        wireframe={config.wireframe}
        transparent
        opacity={config.wireframe ? 0.7 : 0.55}
      />
    </mesh>
  );
}

/**
 * Camera choreography: an eased dolly-in on load (pulled back and off-angle
 * at t=0, settling into the resting frame over ~2.5s), a slow continuous
 * autonomous drift layered underneath so the shot never goes fully static,
 * a subtle pull toward the cursor on top of both, and a pull-back as the
 * user scrolls so the whole cluster recedes rather than just cutting off.
 */
function CameraRig({
  pointer,
  scrollProgress,
}: {
  pointer: RefObject<{ x: number; y: number }>;
  scrollProgress: RefObject<number>;
}) {
  const introDuration = 2.5;

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const introT = Math.min(t / introDuration, 1);
    const eased = 1 - Math.pow(1 - introT, 3);

    const autoX = Math.sin(t * 0.15) * 0.3;
    const autoY = Math.cos(t * 0.1) * 0.15;
    const introOffsetX = (1 - eased) * 2.2;
    const p = scrollProgress.current;
    const introZ = 9 - eased * 3 + p * 2.5;

    const targetX = pointer.current.x * 0.4 + autoX + introOffsetX;
    const targetY = pointer.current.y * 0.2 + autoY;

    state.camera.position.x += (targetX - state.camera.position.x) * 0.04;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.04;
    state.camera.position.z += (introZ - state.camera.position.z) * 0.05;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export function HeroScene({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const pointer = usePointerRef();
  const scrollRef = useMotionValueRef(scrollProgress);

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [2.2, 0, 9], fov: 45 }}
    >
      <fog attach="fog" args={["#030507", 5, 13]} />
      <ambientLight intensity={0.9} />
      <pointLight position={[4, 3, 5]} intensity={16} color="#3d8bff" />
      <pointLight position={[-3, -2, 2]} intensity={8} color="#ffffff" />
      {OBJECTS.map((config, i) => (
        <FloatingObject key={i} config={config} scrollProgress={scrollRef} />
      ))}
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
      <CameraRig pointer={pointer} scrollProgress={scrollRef} />
    </Canvas>
  );
}
