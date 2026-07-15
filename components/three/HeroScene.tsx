"use client";

import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { Euler, Group, Mesh, MeshStandardMaterial, Quaternion, Vector3 } from "three";
import type { MotionValue } from "framer-motion";
import { HERO_TIMELINE as T, smoothstep } from "@/lib/hero-timeline";

const LOGO_PATH = "/models/logo.glb";
const PHONE_PATH = "/models/phone.glb";
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
 * The laptop + phone product shot. Both already come textured with real
 * screen content baked into their materials by the source models, so the
 * only setup needed is enabling opacity fades and giving their screens a
 * bit more emissive punch so bloom catches them like lit displays.
 *
 * They idle in place through `devicesHoldEnd`, then slide/recede apart and
 * fade out through `devicesExitEnd` as the logo begins its entrance.
 */
function Devices({ scrollProgress }: { scrollProgress: RefObject<number> }) {
  const laptopRef = useRef<Group>(null);
  const phoneRef = useRef<Group>(null);
  const { scene: laptopScene } = useGLTF(LAPTOP_PATH);
  const { scene: phoneScene } = useGLTF(PHONE_PATH);

  useEffect(() => {
    forEachMeshMaterial(laptopScene, (m) => {
      m.transparent = true;
      if (m.emissiveMap) m.emissiveIntensity = 1.6;
    });
  }, [laptopScene]);

  useEffect(() => {
    forEachMeshMaterial(phoneScene, (m) => {
      m.transparent = true;
      if (m.emissiveMap) m.emissiveIntensity = 1.6;
    });
  }, [phoneScene]);

  const DEVICE_SCALE = 6.2;

  useFrame((state) => {
    const p = scrollProgress.current;
    const t = state.clock.elapsedTime;
    const exitT = smoothstep(T.devicesHoldEnd, T.devicesExitEnd, p);
    const opacity = 1 - exitT;

    const laptop = laptopRef.current;
    if (laptop) {
      const idleBob = Math.sin(t * 0.6) * 0.03;
      laptop.position.set(1.0 - exitT * 2.6, -0.5 + idleBob - exitT * 2.2, 0.1 - exitT * 3.5);
      // A backward tilt (like a laptop angled toward you on a desk) so the
      // keyboard deck is actually visible from a roughly level camera —
      // dead-on, this just reads as a flat floating screen.
      laptop.rotation.set(-0.42, 0.3 - exitT * 0.6, -0.02 - exitT * 0.4);
      laptop.scale.setScalar(DEVICE_SCALE * (1 - exitT * 0.3));
      if (opacity < 1) forEachMeshMaterial(laptopScene, (m) => (m.opacity = opacity));
    }

    const phone = phoneRef.current;
    if (phone) {
      const idleBob = Math.sin(t * 0.7 + 1) * 0.02;
      phone.position.set(2.5 + exitT * 3.0, -0.8 + idleBob - exitT * 2.6, 0.75 - exitT * 3.0);
      phone.rotation.set(-0.1, -0.5 + exitT * 0.7, 0.12 + exitT * 0.5);
      phone.scale.setScalar(DEVICE_SCALE * (1 - exitT * 0.3));
      if (opacity < 1) forEachMeshMaterial(phoneScene, (m) => (m.opacity = opacity));
    }
  });

  return (
    <>
      <primitive ref={laptopRef} object={laptopScene} />
      <primitive ref={phoneRef} object={phoneScene} />
    </>
  );
}

// Flight choreography waypoints. The source model is authored lying flat
// (face-normal pointing up +Y, like a plaque resting on a table — verified
// visually on the previous build), which is convenient here: its natural,
// un-rotated orientation already reads as a "top-down" view. So "landed,
// front-facing" is a +90°-ish tip on X (facing the camera), and the
// front-to-top transition is just easing that tip back off.
const FLIGHT_START = new Vector3(-4.2, 3.2, -6.5);
const LAND_POS = new Vector3(0, 0.15, 1.6);
const EXIT_POS = new Vector3(3.4, -2.8, -3.5);

const FLY_QUAT = new Quaternion().setFromEuler(new Euler(0.55, -0.6, 0.35));
const LAND_QUAT = new Quaternion().setFromEuler(new Euler(-Math.PI / 2 - 0.12, 0, 0));
const TOP_QUAT = new Quaternion().setFromEuler(new Euler(-0.25, 0, 0));

/**
 * The logo, choreographed through five beats keyed to HERO_TIMELINE:
 *  - flight        — swoops in from off-screen like a thrown paper plane,
 *                    decelerating into `LAND_POS`.
 *  - land hold     — sits facing the camera (front view).
 *  - front-to-top  — tips from front-facing to its natural flat
 *                    orientation, read as "now viewed from above" together
 *                    with CameraRig's matching rise.
 *  - roll          — spins continuously while held at the top view.
 *  - exit          — drifts off-frame, fading out, handing off to the
 *                    next section.
 */
function LogoPlane({ scrollProgress }: { scrollProgress: RefObject<number> }) {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(LOGO_PATH);

  const scratch = useMemo(
    () => ({
      pos: new Vector3(),
      quat: new Quaternion(),
      rollEuler: new Euler(),
      rollQuat: new Quaternion(),
    }),
    []
  );

  useEffect(() => {
    forEachMeshMaterial(scene, (m) => {
      m.transparent = true;
      m.emissive?.set("#1471f0");
      m.emissiveIntensity = 0.25;
    });
  }, [scene]);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;
    const p = scrollProgress.current;
    const t = state.clock.elapsedTime;
    const { pos, quat, rollEuler, rollQuat } = scratch;

    const flightT = smoothstep(T.flightStart, T.flightEnd, p);
    const topT = smoothstep(T.landHoldEnd, T.topTransitionEnd, p);
    const rollT = smoothstep(T.topTransitionEnd, T.rollEnd, p);
    const exitT = smoothstep(T.rollEnd, T.exitEnd, p);

    if (exitT > 0) {
      pos.lerpVectors(LAND_POS, EXIT_POS, exitT);
    } else {
      const eased = 1 - Math.pow(1 - flightT, 3);
      pos.lerpVectors(FLIGHT_START, LAND_POS, eased);
    }
    const idle = Math.sin(t * 0.8) * 0.05 * (1 - exitT);
    group.position.set(pos.x, pos.y + idle, pos.z);

    if (rollT > 0 || exitT > 0) {
      quat.copy(TOP_QUAT);
      const rollAmount = (rollT + exitT) * Math.PI * 2.2;
      rollEuler.set(0, 0, rollAmount);
      rollQuat.setFromEuler(rollEuler);
      quat.multiply(rollQuat);
      group.quaternion.copy(quat);
    } else if (topT > 0) {
      quat.slerpQuaternions(LAND_QUAT, TOP_QUAT, topT);
      group.quaternion.copy(quat);
    } else {
      quat.slerpQuaternions(FLY_QUAT, LAND_QUAT, flightT);
      group.quaternion.copy(quat);
    }

    group.scale.setScalar(2.6 * (1 - exitT * 0.4));

    const opacity = flightT < 1 ? flightT : exitT > 0 ? 1 - exitT : 1;
    forEachMeshMaterial(scene, (m) => (m.opacity = opacity));
  });

  return <primitive ref={groupRef} object={scene} />;
}

/**
 * The camera stays mostly level through the devices + flight + land
 * beats, then rises and tilts down through the front-to-top transition —
 * matching the logo's own reorientation so the pair reads as "we're now
 * looking down at it from above," and holds that elevated view through
 * the roll and exit.
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
    const topT = smoothstep(T.landHoldEnd, T.topTransitionEnd, p);
    const risen = p >= T.topTransitionEnd ? 1 : topT;

    // A slight downward angle from the start — needed to actually see the
    // laptop's tilted-back keyboard deck and the phone's screen rather than
    // viewing both dead-on — deepens further through the front-to-top beat.
    const baseY = 0.75 + risen * 1.4;
    const targetX = pointer.current.x * 0.25;
    const targetY = baseY + pointer.current.y * 0.1;

    state.camera.position.x += (targetX - state.camera.position.x) * 0.04;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.04;
    state.camera.position.z += (6.4 - state.camera.position.z) * 0.03;

    const lookTargetY = -0.25 - risen * 1.1;
    state.camera.lookAt(0, lookTargetY, 0);
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
      camera={{ position: [0, 0.75, 6.4], fov: 42 }}
    >
      <fog attach="fog" args={["#030507", 5, 14]} />
      <ambientLight intensity={0.8} />
      <pointLight position={[4, 3, 5]} intensity={20} color="#3d8bff" />
      <pointLight position={[-3, -2, 2]} intensity={7} color="#ffffff" />
      {/*
       * @react-three/fiber's <Canvas> wraps its children in one implicit
       * Suspense boundary — without per-model boundaries here, the always-
       * ready Sparkles/lights below blank out for the ~1-2s it takes all
       * three GLBs to fetch, since React Suspense holds back the *entire*
       * subtree until every suspending child resolves (verified directly:
       * screenshots taken every 500ms after load showed a fully blank
       * canvas, not just missing devices, until every model was ready).
       */}
      <Suspense fallback={null}>
        <Devices scrollProgress={scrollRef} />
      </Suspense>
      <Suspense fallback={null}>
        <LogoPlane scrollProgress={scrollRef} />
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

useGLTF.preload(LOGO_PATH);
useGLTF.preload(PHONE_PATH);
useGLTF.preload(LAPTOP_PATH);
