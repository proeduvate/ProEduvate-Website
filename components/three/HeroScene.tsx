"use client";

import { useEffect, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import type { Group, Mesh, MeshStandardMaterial } from "three";
import type { MotionValue } from "framer-motion";

const MODEL_PATH = "/models/logo.glb";

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

/**
 * The company logo, sculpted into a real 3D object (AI-generated 3D pass
 * over the flat mark, then decimated + compressed with gltf-transform — the
 * source scan was ~770k verts / 7MB, this build is ~167k verts / 1.1MB).
 * It's the sole hero object: no abstract geometric stand-ins.
 *
 * Scroll drives it through three beats that line up with the headline copy
 * in Hero.tsx:
 *  - 0.00–0.32 arrival  — spins into frame from the back-right, behind the
 *                         left-aligned headline.
 *  - 0.32–0.68 crossing — drifts left across the frame as the headline
 *                         swaps to the right-aligned statement, so the
 *                         object visibly passes behind/through the text
 *                         rather than just cutting away.
 *  - 0.68–1.00 recede   — pulls back, shrinks and dims as the closing CTA
 *                         beat takes over, handing off to the next section.
 */
function Logo({ scrollProgress }: { scrollProgress: RefObject<number> }) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(MODEL_PATH);

  useEffect(() => {
    scene.traverse((child) => {
      const mesh = child as Mesh;
      if (!mesh.isMesh) return;
      const material = mesh.material as MeshStandardMaterial;
      material.transparent = true;
      material.emissive?.set("#1471f0");
      material.emissiveIntensity = 0.2;
    });
  }, [scene]);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    const t = state.clock.elapsedTime;
    const p = scrollProgress.current;

    const arrival = Math.min(p / 0.32, 1);
    const arrivalEased = 1 - Math.pow(1 - arrival, 3);
    const crossing = Math.min(Math.max((p - 0.32) / 0.36, 0), 1);
    const crossingEased = crossing * crossing * (3 - 2 * crossing);
    const recede = Math.min(Math.max((p - 0.68) / 0.32, 0), 1);

    // The source model is authored lying flat (its face-normal points up
    // the Y axis, like a plaque resting on a table) rather than standing
    // upright facing the camera — verified visually, the un-corrected
    // model reads as a near-invisible sliver from this scene's camera
    // angle. Tipping it -90° on X stands it upright so the dynamic spin
    // below reads as a turntable facing the viewer, not an edge-on wobble.
    group.rotation.x =
      -Math.PI / 2 - 0.15 + Math.sin(t * 0.3) * 0.05 + crossingEased * 0.2;
    group.rotation.y = t * 0.2 + arrivalEased * Math.PI * 0.6 + crossingEased * Math.PI * 0.9;
    group.rotation.z = crossingEased * -0.1;

    const introX = 1.7 - arrivalEased * 0.5;
    const crossingX = -crossingEased * 3.2;
    group.position.x = introX + crossingX;
    group.position.y = -0.2 + Math.sin(t * 0.25) * 0.08 - recede * 0.4;
    group.position.z = -1 - (1 - arrivalEased) * 2.5 - recede * 2.5;

    const introScale = 0.4 + arrivalEased * 2.4;
    const scale = introScale * (1 - recede * 0.55);
    group.scale.setScalar(scale);

    const fadeOpacity = 1 - recede * 0.85;
    scene.traverse((child) => {
      const mesh = child as Mesh;
      if (!mesh.isMesh) return;
      (mesh.material as MeshStandardMaterial).opacity = fadeOpacity;
    });
  });

  return <primitive ref={groupRef} object={scene} />;
}

/**
 * Camera stays mostly still — a taller pinned scroll section already has
 * plenty of motion from the logo itself — with only a light cursor-pull for
 * depth.
 */
function CameraRig({ pointer }: { pointer: RefObject<{ x: number; y: number }> }) {
  useFrame((state) => {
    const targetX = pointer.current.x * 0.3;
    const targetY = pointer.current.y * 0.15;
    state.camera.position.x += (targetX - state.camera.position.x) * 0.04;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.04;
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
      camera={{ position: [0, 0, 6], fov: 42 }}
    >
      <fog attach="fog" args={["#030507", 5, 13]} />
      <ambientLight intensity={0.7} />
      <pointLight position={[4, 3, 5]} intensity={20} color="#3d8bff" />
      <pointLight position={[-3, -2, 2]} intensity={7} color="#ffffff" />
      <Logo scrollProgress={scrollRef} />
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
      <EffectComposer>
        <Bloom luminanceThreshold={0.35} luminanceSmoothing={0.9} intensity={0.55} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}

useGLTF.preload(MODEL_PATH);
