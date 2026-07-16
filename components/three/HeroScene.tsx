"use client";

import { Suspense, useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Euler,
  Group,
  Line as ThreeLine,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Quaternion,
  RepeatWrapping,
  Vector3,
} from "three";
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
 * Some of the sourced device models carry a `KHR_materials_transmission`
 * extension on body/back-panel materials (real "glass" rendering), which
 * three.js honors by sampling whatever is behind the object. Against this
 * scene's near-black background that reads as "nearly invisible" rather
 * than "glass" — confirmed directly by inspecting the raw glTF material
 * list, where ordinary opaque body panels (not just camera lenses) carry
 * transmissionFactor: 1. Flattening it back to a normal opaque PBR
 * response is what makes the devices read as solid product renders like
 * the reference images, instead of partially see-through.
 */
function killTransmission(material: MeshStandardMaterial) {
  const physical = material as MeshStandardMaterial & { transmission?: number };
  if (physical.transmission) physical.transmission = 0;
}

/** A small seeded PRNG so per-instance "random" layout (streaks, rings) is stable across renders. */
function makeRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

/**
 * A perspective floor grid extending into the fog — the reference scene's
 * "standing on an infinite glowing grid" look, which the flat 2D CSS grid
 * behind the canvas can't provide on its own since it never recedes in
 * depth. A single large plane with a tiled, canvas-generated grid-line
 * texture; fog (already in the scene) handles the fade to black at the
 * horizon the same way it does for every other object here.
 */
function GroundGrid() {
  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.strokeStyle = "rgba(111,173,255,0.35)";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, size, size);
    const tex = new CanvasTexture(canvas);
    tex.wrapS = RepeatWrapping;
    tex.wrapT = RepeatWrapping;
    tex.repeat.set(24, 24);
    return tex;
  }, []);

  if (!texture) return null;

  return (
    <mesh position={[0, -1.3, -6]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[80, 80]} />
      <meshBasicMaterial map={texture} transparent opacity={0.5} depthWrite={false} />
    </mesh>
  );
}

/**
 * A flat, graphic (not raytraced) radial-gradient texture used for both the
 * ground "shadow" pool beneath resting objects and the ripple rings — a
 * conventional dark drop-shadow would be invisible against this hero's
 * near-black backdrop, so everything reads as a soft light pool instead,
 * tinted toward the scene's own accent-blue lighting.
 */
function useGlowTexture() {
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

/** A flat vector-style ground glow that follows a target group and fades with a given opacity ref. */
function GroundGlow({
  targetRef,
  yOffset,
  getOpacity,
}: {
  targetRef: RefObject<Group | null>;
  yOffset: number;
  getOpacity: () => number;
}) {
  const glowRef = useRef<Mesh>(null);
  const texture = useGlowTexture();

  useFrame(() => {
    const glow = glowRef.current;
    const target = targetRef.current;
    if (!glow || !target) return;
    glow.position.set(target.position.x, target.position.y + yOffset, target.position.z + 0.1);
    const material = glow.material as MeshBasicMaterial;
    material.opacity = getOpacity();
  });

  if (!texture) return null;

  return (
    <mesh ref={glowRef} rotation={[-Math.PI / 2, 0, 0]} renderOrder={-1}>
      <circleGeometry args={[1.1, 48]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

const LAPTOP_BASE_POS = { x: -2.75, y: -0.55, z: -0.3 };
const LAPTOP_ROT_Y = 0.55;
const PHONE_BASE_POS = { x: -1.3, y: -0.3, z: 0.85 };
const PHONE_ROT = { x: -0.08, y: 0.4, z: -0.14 };
const DEVICE_SCALE = 5.4;
const PHONE_SCALE = 7.6;
const DEVICE_ASCEND_Y = 3.4;
const DEVICE_ASCEND_Z = -2.5;

/**
 * The laptop + phone: sit together on the left (headline moves to the
 * right to match — see Hero.tsx) through `holdEnd`, then float upward and
 * back, fading out by `ascendEnd` as a field of light streams downward
 * beneath them (`RisingStreaks`) — the "they go up" beat.
 */
function Devices({
  scrollProgress,
  laptopRef,
  phoneRef,
}: {
  scrollProgress: RefObject<number>;
  laptopRef: RefObject<Group | null>;
  phoneRef: RefObject<Group | null>;
}) {
  const { scene: laptopScene } = useGLTF(LAPTOP_PATH);
  const { scene: phoneScene } = useGLTF(PHONE_PATH);

  useEffect(() => {
    forEachMeshMaterial(laptopScene, (m) => {
      m.transparent = true;
      killTransmission(m);
      if (m.emissiveMap) m.emissiveIntensity = 1.6;
    });
  }, [laptopScene]);

  useEffect(() => {
    forEachMeshMaterial(phoneScene, (m) => {
      m.transparent = true;
      killTransmission(m);
      if (m.emissiveMap) m.emissiveIntensity = 1.6;
    });
  }, [phoneScene]);

  useFrame((state) => {
    const p = scrollProgress.current;
    const t = state.clock.elapsedTime;
    const ascendT = smoothstep(T.holdEnd, T.ascendEnd, p);
    const opacity = 1 - smoothstep(0.6, 1, ascendT);

    const laptop = laptopRef.current;
    if (laptop) {
      const idleBob = Math.sin(t * 0.5) * 0.02 * (1 - ascendT);
      laptop.position.set(
        LAPTOP_BASE_POS.x,
        LAPTOP_BASE_POS.y + idleBob + ascendT * DEVICE_ASCEND_Y,
        LAPTOP_BASE_POS.z + ascendT * DEVICE_ASCEND_Z
      );
      laptop.rotation.set(0, LAPTOP_ROT_Y, 0);
      laptop.scale.setScalar(DEVICE_SCALE);
      forEachMeshMaterial(laptopScene, (m) => (m.opacity = opacity));
    }

    const phone = phoneRef.current;
    if (phone) {
      const idleBob = Math.sin(t * 0.6 + 1) * 0.02 * (1 - ascendT);
      phone.position.set(
        PHONE_BASE_POS.x,
        PHONE_BASE_POS.y + idleBob + ascendT * DEVICE_ASCEND_Y,
        PHONE_BASE_POS.z + ascendT * DEVICE_ASCEND_Z
      );
      phone.rotation.set(PHONE_ROT.x, PHONE_ROT.y, PHONE_ROT.z);
      phone.scale.setScalar(PHONE_SCALE);
      forEachMeshMaterial(phoneScene, (m) => (m.opacity = opacity));
    }
  });

  return (
    <>
      <primitive ref={laptopRef} object={laptopScene} />
      <primitive ref={phoneRef} object={phoneScene} />
    </>
  );
}

const STREAK_COUNT = 16;

/**
 * Vertical light streams falling beneath the ascending devices — the
 * columns of light in the reference's second beat. Deterministic per
 * scroll progress (not an accumulating simulation) so it captures
 * correctly frame-by-frame regardless of scroll speed: each streak's
 * height/opacity is a pure function of `ascendT`.
 */
function RisingStreaks({
  laptopRef,
  phoneRef,
  scrollProgress,
}: {
  laptopRef: RefObject<Group | null>;
  phoneRef: RefObject<Group | null>;
  scrollProgress: RefObject<number>;
}) {
  const groupRef = useRef<Group>(null);
  const seeds = useMemo(() => {
    const rng = makeRng(7);
    return Array.from({ length: STREAK_COUNT }, (_, i) => ({
      anchor: i < STREAK_COUNT / 2 ? "laptop" : "phone",
      dx: (rng() - 0.5) * 1.1,
      dz: (rng() - 0.5) * 0.6,
      phase: rng() * Math.PI * 2,
      speed: 0.6 + rng() * 0.8,
    }));
  }, []);

  useFrame((state) => {
    const group = groupRef.current;
    const laptop = laptopRef.current;
    const phone = phoneRef.current;
    if (!group || !laptop || !phone) return;
    const p = scrollProgress.current;
    const t = state.clock.elapsedTime;
    const ascendT = smoothstep(T.holdEnd, T.ascendEnd, p);
    const fadeIn = smoothstep(0, 0.25, ascendT);
    const fadeOut = 1 - smoothstep(0.75, 1, ascendT);
    const visible = ascendT > 0 && ascendT < 1;
    group.visible = visible;
    if (!visible) return;

    group.children.forEach((child, i) => {
      const mesh = child as Mesh;
      const seed = seeds[i];
      const anchor = seed.anchor === "laptop" ? laptop : phone;
      const flicker = 0.75 + 0.25 * Math.sin(t * seed.speed + seed.phase);
      mesh.position.set(anchor.position.x + seed.dx, anchor.position.y - 1.2, anchor.position.z + seed.dz);
      mesh.scale.set(1, 1.6 + ascendT * 2.2, 1);
      const material = mesh.material as MeshBasicMaterial;
      material.opacity = fadeIn * fadeOut * flicker * 0.5;
    });
  });

  return (
    <group ref={groupRef}>
      {seeds.map((_, i) => (
        <mesh key={i}>
          <planeGeometry args={[0.03, 1]} />
          <meshBasicMaterial color="#6fadff" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

const WARP_STREAK_COUNT = 48;

/**
 * The "flying through a field of converging light" transition between the
 * devices ascending and the logo arriving — radiating line streaks that
 * grow from the vanishing point as `warpT` advances, matching the tunnel
 * shot in the reference's third beat. Built from plain `THREE.Line`
 * objects (not drei's `<Line>`, which renders "fat" lines via a geometry
 * whose points can't be mutated in place the same way) so each streak's
 * endpoints can be written directly into its position buffer every frame.
 * A pure function of scroll progress — not an accumulating simulation —
 * for the same scrubbing-determinism reason as `RisingStreaks`.
 */
function WarpStreaks({ scrollProgress }: { scrollProgress: RefObject<number> }) {
  const groupRef = useRef<Group>(null);
  const seeds = useMemo(() => {
    const rng = makeRng(41);
    return Array.from({ length: WARP_STREAK_COUNT }, () => ({
      angle: rng() * Math.PI * 2,
      radius: 0.3 + rng() * 2.2,
      depth: -2 - rng() * 6,
    }));
  }, []);

  const lines = useMemo(
    () =>
      seeds.map(() => {
        const geometry = new BufferGeometry();
        geometry.setAttribute("position", new BufferAttribute(new Float32Array(6), 3));
        const material = new LineBasicMaterial({
          color: "#a8caff",
          transparent: true,
          opacity: 0,
        });
        return new ThreeLine(geometry, material);
      }),
    [seeds]
  );

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    const p = scrollProgress.current;
    const warpT = smoothstep(T.ascendEnd, T.warpEnd, p);
    const visible = warpT > 0 && warpT < 1;
    group.visible = visible;
    if (!visible) return;

    const opacity = smoothstep(0, 0.5, warpT) * (1 - smoothstep(0.7, 1, warpT));
    lines.forEach((line, i) => {
      const seed = seeds[i];
      const stretch = warpT * warpT;
      const nearZ = -0.5 + stretch * 7;
      const farZ = seed.depth + stretch * 5;
      const radiusNear = seed.radius * (1 + stretch * 2.5);
      const radiusFar = seed.radius * (1 + stretch * 1.2);
      const position = line.geometry.getAttribute("position") as BufferAttribute;
      position.setXYZ(0, Math.cos(seed.angle) * radiusNear, Math.sin(seed.angle) * radiusNear * 0.6, nearZ);
      position.setXYZ(1, Math.cos(seed.angle) * radiusFar, Math.sin(seed.angle) * radiusFar * 0.6, farZ);
      position.needsUpdate = true;
      (line.material as LineBasicMaterial).opacity = opacity;
    });
  });

  return (
    <group ref={groupRef}>
      {lines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </group>
  );
}

// The logo model is authored lying flat (face-normal pointing up +Y, like a
// plaque resting on a table — verified visually on an earlier build), which
// is convenient: its natural, un-rotated orientation already reads as a
// top-down view. So the "banked flight" pose is a tip on X, and settling to
// the top-down view is just easing that tip back off.
const LOGO_ARRIVE_QUAT = new Quaternion().setFromEuler(new Euler(-1.0, -0.5, 0.35));
const LOGO_SETTLE_QUAT = new Quaternion().setFromEuler(new Euler(-0.35, 0, 0));
const LOGO_ARRIVE_POS = new Vector3(-0.6, 0.3, 1.6);
const LOGO_SETTLE_POS = new Vector3(0.4, -0.1, 1.9);
const LOGO_EXIT_POS = new Vector3(4.5, 4.2, -2.5);

/**
 * The logo: hidden through the devices' hold/ascend beats, then emerges
 * far away at the vanishing point of `WarpStreaks` and grows as it flies
 * toward the viewer, banking into an "arrive" pose, easing to a top-down
 * "settle" pose with rings rippling out beneath it, then flying off to
 * exit the top-right corner.
 */
function LogoPlane({
  scrollProgress,
  logoRef,
}: {
  scrollProgress: RefObject<number>;
  logoRef: RefObject<Group | null>;
}) {
  const { scene } = useGLTF(LOGO_PATH);
  const scratch = useMemo(
    () => ({ pos: new Vector3(), quat: new Quaternion() }),
    []
  );

  useEffect(() => {
    forEachMeshMaterial(scene, (m) => {
      m.transparent = true;
      m.emissive?.set("#1471f0");
      m.emissiveIntensity = 0.3;
    });
  }, [scene]);

  useFrame((state) => {
    const group = logoRef.current;
    if (!group) return;
    const p = scrollProgress.current;
    const t = state.clock.elapsedTime;
    const { pos, quat } = scratch;

    const warpT = smoothstep(T.ascendEnd, T.warpEnd, p);
    const arriveT = smoothstep(T.warpEnd, T.arriveEnd, p);
    const settleT = smoothstep(T.arriveEnd, T.settleEnd, p);
    const exitT = smoothstep(T.settleEnd, T.exitEnd, p);

    if (exitT > 0) {
      pos.lerpVectors(LOGO_SETTLE_POS, LOGO_EXIT_POS, exitT);
    } else if (arriveT > 0 || settleT > 0) {
      pos.lerpVectors(LOGO_ARRIVE_POS, LOGO_SETTLE_POS, settleT);
    } else {
      const warpEased = 1 - Math.pow(1 - warpT, 3);
      pos.set(
        LOGO_ARRIVE_POS.x * warpEased,
        LOGO_ARRIVE_POS.y * warpEased,
        -8 + warpEased * (8 + LOGO_ARRIVE_POS.z)
      );
    }
    const idle = Math.sin(t * 0.8) * 0.04 * (1 - exitT);
    group.position.set(pos.x, pos.y + idle, pos.z);

    if (exitT > 0) {
      quat.copy(LOGO_SETTLE_QUAT);
    } else if (settleT > 0) {
      quat.slerpQuaternions(LOGO_ARRIVE_QUAT, LOGO_SETTLE_QUAT, settleT);
    } else {
      quat.copy(LOGO_ARRIVE_QUAT);
    }
    group.quaternion.copy(quat);

    const warpScale = 0.2 + (1 - Math.pow(1 - warpT, 3)) * 2.2;
    const exitScale = 1 - exitT * 0.3;
    group.scale.setScalar(warpScale * exitScale);

    const opacity = warpT < 1 ? warpT : exitT > 0 ? 1 - exitT : 1;
    forEachMeshMaterial(scene, (m) => (m.opacity = opacity));
  });

  return <primitive ref={logoRef} object={scene} />;
}

const RING_COUNT = 3;

/** Concentric rings rippling outward beneath the settled logo (reference's fifth beat). */
function RippleRings({
  logoRef,
  scrollProgress,
}: {
  logoRef: RefObject<Group | null>;
  scrollProgress: RefObject<number>;
}) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    const group = groupRef.current;
    const logo = logoRef.current;
    if (!group || !logo) return;
    const p = scrollProgress.current;
    const settleT = smoothstep(T.arriveEnd, T.settleEnd, p);
    const exitT = smoothstep(T.settleEnd, T.exitEnd, p);
    const visible = settleT > 0.15 && exitT < 1;
    group.visible = visible;
    if (!visible) return;

    group.position.set(logo.position.x, logo.position.y - 0.35, logo.position.z);
    const t = state.clock.elapsedTime;
    group.children.forEach((child, i) => {
      const mesh = child as Mesh;
      const cycle = ((t * 0.35 + i / RING_COUNT) % 1) * (0.4 + settleT * 1.6);
      mesh.scale.setScalar(0.4 + cycle * 2.2);
      const material = mesh.material as MeshBasicMaterial;
      material.opacity = (1 - cycle / 2.2) * 0.35 * settleT * (1 - exitT);
    });
  });

  return (
    <group ref={groupRef} rotation={[-Math.PI / 2, 0, 0]}>
      {Array.from({ length: RING_COUNT }).map((_, i) => (
        <mesh key={i}>
          <ringGeometry args={[0.9, 1, 64]} />
          <meshBasicMaterial color="#6fadff" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Camera choreography across the full sequence: level and steady through
 * the devices' hold/ascend, a forward rush (dolly + narrowing FOV) through
 * the warp beat to sell "flying through," settling as the logo arrives,
 * tilting down toward a top-down framing for the ripple/settle beat, then
 * holding as the logo exits — the object leaving frame does the work, not
 * a chasing camera.
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
    const warpT = smoothstep(T.ascendEnd, T.warpEnd, p);
    const settleT = smoothstep(T.arriveEnd, T.settleEnd, p);
    const heldSettle = p >= T.settleEnd ? 1 : settleT;

    const targetZ = 6.4 - warpT * 1.6;
    const targetY = 0.45 + heldSettle * 0.9 + pointer.current.y * 0.08;
    const targetX = -0.6 + pointer.current.x * 0.2;

    state.camera.position.z += (targetZ - state.camera.position.z) * 0.06;
    state.camera.position.y += (targetY - state.camera.position.y) * 0.05;
    state.camera.position.x += (targetX - state.camera.position.x) * 0.05;

    const cam = state.camera as unknown as { fov: number; updateProjectionMatrix: () => void };
    const targetFov = 42 - warpT * 8;
    if (Math.abs(cam.fov - targetFov) > 0.01) {
      cam.fov += (targetFov - cam.fov) * 0.08;
      cam.updateProjectionMatrix();
    }

    const lookX = -0.6 + heldSettle * 1.0;
    const lookY = -0.2 - heldSettle * 0.6;
    state.camera.lookAt(lookX, lookY, 0);
  });
  return null;
}

export function HeroScene({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const pointer = usePointerRef();
  const scrollRef = useMotionValueRef(scrollProgress);
  const laptopRef = useRef<Group>(null);
  const phoneRef = useRef<Group>(null);
  const logoRef = useRef<Group>(null);

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [-0.6, 0.45, 6.4], fov: 42 }}
    >
      <fog attach="fog" args={["#030507", 5, 14]} />
      <ambientLight intensity={0.8} />
      <pointLight position={[4, 3, 5]} intensity={20} color="#3d8bff" />
      <pointLight position={[-3, -2, 2]} intensity={7} color="#ffffff" />
      <GroundGrid />
      {/*
       * @react-three/fiber's <Canvas> wraps its children in one implicit
       * Suspense boundary — without per-model boundaries here, the always-
       * ready Sparkles/lights below blank out for the time it takes all
       * GLBs to fetch, since React Suspense holds back the *entire*
       * subtree until every suspending child resolves (verified directly
       * on an earlier multi-model build).
       */}
      <Suspense fallback={null}>
        <Devices scrollProgress={scrollRef} laptopRef={laptopRef} phoneRef={phoneRef} />
        <GroundGlow
          targetRef={laptopRef}
          yOffset={-0.12}
          getOpacity={() => {
            const ascendT = smoothstep(T.holdEnd, T.ascendEnd, scrollRef.current);
            return 1 - smoothstep(0.6, 1, ascendT);
          }}
        />
        <RisingStreaks laptopRef={laptopRef} phoneRef={phoneRef} scrollProgress={scrollRef} />
      </Suspense>
      <WarpStreaks scrollProgress={scrollRef} />
      <Suspense fallback={null}>
        <LogoPlane scrollProgress={scrollRef} logoRef={logoRef} />
        <RippleRings logoRef={logoRef} scrollProgress={scrollRef} />
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
        <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} intensity={0.65} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}

useGLTF.preload(LOGO_PATH);
useGLTF.preload(PHONE_PATH);
useGLTF.preload(LAPTOP_PATH);
