"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * The hero's ambient particle field, built the same way as the point cloud in
 * the "One system. Every discipline." section so the two read as one idea.
 *
 * Real GL points rather than a 2D canvas: the GPU rasterizes each one at its
 * projected size every frame, so they stay hard-edged at any depth or device
 * pixel ratio. The 2D version had to fake depth by scaling a bitmap sprite,
 * which is what softened them.
 *
 * Two shells at different radii and sizes, both drifting, give parallax
 * without needing per-particle simulation on the CPU.
 */

const ACCENT_LIGHT = new THREE.Color("#7cc2ff");
const ACCENT = new THREE.Color("#0082fb");

/**
 * Fibonacci shell: deterministic, so it is identical on the server and the
 * client and stable across re-renders, and more evenly spaced than random
 * sampling. `spread` jitters the radius so it reads as a volume rather than
 * a hard sphere surface.
 */
function shell(count: number, inner: number, outer: number, seed: number) {
  const arr = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const noise = Math.abs(Math.sin((i + seed) * 127.1) * 43758.5453) % 1;
    const r = inner + noise * (outer - inner);
    arr[i * 3] = Math.cos(theta) * radiusAtY * r;
    arr[i * 3 + 1] = y * r;
    arr[i * 3 + 2] = Math.sin(theta) * radiusAtY * r;
  }
  return arr;
}

function Layer({
  count,
  inner,
  outer,
  seed,
  size,
  opacity,
  colour,
  spin,
  parallax,
}: {
  count: number;
  inner: number;
  outer: number;
  seed: number;
  size: number;
  opacity: number;
  colour: THREE.Color;
  spin: number;
  parallax: number;
}) {
  const points = useRef<THREE.Points>(null);
  const { pointer } = useThree();
  const positions = useMemo(() => shell(count, inner, outer, seed), [count, inner, outer, seed]);

  useFrame((state, delta) => {
    const p = points.current;
    if (!p) return;
    p.rotation.y += delta * spin;
    p.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    // Ease toward the pointer rather than snapping, and by less on the far
    // layer so the two separate in depth as the cursor moves.
    p.position.x += (pointer.x * parallax - p.position.x) * delta * 1.4;
    p.position.y += (pointer.y * parallax * 0.6 - p.position.y) * delta * 1.4;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={colour}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function HeroSignalField() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop="always"
    >
      {/* Far field: dense and small, reads as depth behind the footage. */}
      <Layer
        count={900}
        inner={7}
        outer={16}
        seed={0}
        size={0.03}
        opacity={0.6}
        colour={ACCENT}
        spin={0.012}
        parallax={0.15}
      />
      {/* Near field: fewer and brighter, carries the parallax. */}
      <Layer
        count={420}
        inner={2.6}
        outer={6.4}
        seed={97}
        size={0.05}
        opacity={0.85}
        colour={ACCENT_LIGHT}
        spin={0.038}
        parallax={0.5}
      />
    </Canvas>
  );
}
