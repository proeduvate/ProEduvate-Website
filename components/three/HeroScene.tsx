"use client";

import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { CanvasTexture, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial } from "three";
import type { MotionValue } from "framer-motion";
import { smoothstep } from "@/lib/hero-timeline";

const LAPTOP_PATH = "/models/laptop.glb";

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

function forEachMeshMaterial(scene: Group, fn: (material: MeshStandardMaterial) => void) {
  scene.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh) return;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    for (const material of materials) {
      fn(material as MeshStandardMaterial);
    }
  });
}

/**
 * A flat, graphic (not raytraced) radial-gradient texture for the "ground"
 * cue below the laptop. A conventional dark drop-shadow would be invisible
 * here — the hero's backdrop is already near-black — so this is a soft
 * light pool instead (the same read a shadow gives on a light surface:
 * "something is resting here", just inverted for a dark scene), tinted
 * toward the scene's own accent-blue lighting rather than plain white.
 */
function useVectorShadowTexture() {
  return useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
    );
    gradient.addColorStop(0, "rgba(111,173,255,0.5)");
    gradient.addColorStop(0.55, "rgba(111,173,255,0.22)");
    gradient.addColorStop(1, "rgba(111,173,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    return new CanvasTexture(canvas);
  }, []);
}

const LAPTOP_BASE_POS = { x: 2.15, y: -0.55, z: -0.2 };

/**
 * A flat "vector" ground shadow — a soft radial-gradient ellipse rather than
 * a raytraced/contact shadow — so the laptop reads as resting on a surface.
 * Follows the laptop's x/z position as it drifts during the exit and fades
 * out in lockstep with it (shares the same scroll-driven opacity curve as
 * `Laptop`, rather than reading the laptop's material state directly).
 */
function GroundShadow({
  laptopRef,
  scrollProgress,
}: {
  laptopRef: RefObject<Group | null>;
  scrollProgress: RefObject<number>;
}) {
  const shadowRef = useRef<Mesh>(null);
  const texture = useVectorShadowTexture();

  useFrame(() => {
    const shadow = shadowRef.current;
    const laptop = laptopRef.current;
    if (!shadow || !laptop) return;
    shadow.position.set(laptop.position.x, laptop.position.y - 0.12, laptop.position.z + 0.1);
    const material = shadow.material as MeshBasicMaterial;
    const p = scrollProgress.current;
    material.opacity = 1 - smoothstep(0.8, 0.98, p);
  });

  if (!texture) return null;

  return (
    <mesh ref={shadowRef} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-1}>
      <circleGeometry args={[1.5, 48]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}
// Facing toward the lower-left ("left corner") — a 3/4 angle rather than
// square to the camera, like a laptop turned partway toward the viewer on a
// desk. No X or Z rotation is ever applied: it stays flat/level on the
// "ground" the whole time, only ever turning on its vertical axis.
const LAPTOP_INITIAL_ROT_Y = -0.6;
// Total additional turn over the full scroll — enough to swing past
// side-on and reveal the back of the lid, per the brief ("show back side
// of screen while on the table").
const LAPTOP_TURN_TOTAL = 3.5;
const LAPTOP_EXIT_X = 3.2;
const LAPTOP_EXIT_Y = -3.0;
const LAPTOP_SCALE = 5.6;

/**
 * The laptop: the hero's sole 3D object for this pass. Sits on the right
 * (headline stays left), angled toward the lower-left like it's resting on
 * a desk facing the viewer's corner, with a flat vector-style shadow
 * beneath it. On scroll it slowly turns in place — vertical-axis rotation
 * only, no tilt — swinging around to show the back of the lid while
 * staying flat on the "ground", drifting toward the bottom-right and
 * fading out as it goes, while the camera dollies in throughout (see
 * CameraRig).
 */
function Laptop({
  scrollProgress,
  laptopRef,
}: {
  scrollProgress: RefObject<number>;
  laptopRef: RefObject<Group | null>;
}) {
  const { scene: laptopScene } = useGLTF(LAPTOP_PATH);

  useEffect(() => {
    forEachMeshMaterial(laptopScene, (m) => {
      m.transparent = true;
      if (m.emissiveMap) m.emissiveIntensity = 1.6;
    });
  }, [laptopScene]);

  useFrame((state) => {
    const laptop = laptopRef.current;
    if (!laptop) return;
    const p = scrollProgress.current;
    const t = state.clock.elapsedTime;
    const eased = smoothstep(0, 1, p);
    const idleBob = Math.sin(t * 0.5) * 0.02 * (1 - eased);

    laptop.position.set(
      LAPTOP_BASE_POS.x + eased * LAPTOP_EXIT_X,
      LAPTOP_BASE_POS.y + idleBob + eased * LAPTOP_EXIT_Y,
      LAPTOP_BASE_POS.z
    );
    // X and Z rotation are never touched — only the vertical (Y) turn.
    laptop.rotation.set(0, LAPTOP_INITIAL_ROT_Y + eased * LAPTOP_TURN_TOTAL, 0);
    laptop.scale.setScalar(LAPTOP_SCALE);

    const opacity = 1 - smoothstep(0.8, 0.98, p);
    if (opacity < 1) forEachMeshMaterial(laptopScene, (m) => (m.opacity = opacity));
  });

  return <primitive ref={laptopRef} object={laptopScene} />;
}

/**
 * A slow, continuous dolly-in ("camera should be zooming in") toward a
 * fixed point near where the laptop rests, independent of the laptop's own
 * drift — so the push-in reads as the camera closing in on the scene while
 * the laptop separately turns and slides away out of frame.
 */
function CameraRig({
  pointer,
  scrollProgress,
}: {
  pointer: RefObject<{ x: number; y: number }>;
  scrollProgress: RefObject<number>;
}) {
  useFrame((state) => {
    const p = scrollProgress.current;
    const eased = smoothstep(0, 1, p);

    const targetZ = 6.4 - eased * 2.4;
    state.camera.position.z += (targetZ - state.camera.position.z) * 0.05;

    const targetX = 0.2 + pointer.current.x * 0.2;
    const targetY = 0.45 + pointer.current.y * 0.08;
    state.camera.position.x += (targetX - state.camera.position.x) * 0.05;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.05;

    state.camera.lookAt(1.1, -0.45, 0);
  });
  return null;
}

export function HeroScene({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const pointer = usePointerRef();
  const scrollRef = useMotionValueRef(scrollProgress);
  const laptopRef = useRef<Group>(null);

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0.2, 0.45, 6.4], fov: 42 }}
    >
      <fog attach="fog" args={["#030507", 5, 14]} />
      <ambientLight intensity={0.8} />
      <pointLight position={[4, 3, 5]} intensity={20} color="#3d8bff" />
      <pointLight position={[-3, -2, 2]} intensity={7} color="#ffffff" />
      {/*
       * @react-three/fiber's <Canvas> wraps its children in one implicit
       * Suspense boundary — without this boundary here, the always-ready
       * Sparkles/lights below would blank out for the time it takes the
       * GLB to fetch, since React Suspense holds back the *entire* subtree
       * until every suspending child resolves (verified directly on an
       * earlier multi-model build).
       */}
      <Suspense fallback={null}>
        <Laptop scrollProgress={scrollRef} laptopRef={laptopRef} />
        <GroundShadow laptopRef={laptopRef} scrollProgress={scrollRef} />
      </Suspense>
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
      <EffectComposer>
        <Bloom luminanceThreshold={0.35} luminanceSmoothing={0.9} intensity={0.55} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}

useGLTF.preload(LAPTOP_PATH);
