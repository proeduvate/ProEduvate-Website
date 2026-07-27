"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * The site's one true-3D moment. A wireframe icosahedron inside a drifting
 * point cloud, easing toward the pointer -- the "one system of intelligence"
 * idea from the hero, rendered rather than filmed.
 *
 * Kept deliberately cheap: low subdivision, no post-processing, no loaded
 * assets. The whole scene is a few hundred vertices.
 */

const ACCENT = new THREE.Color("#0082fb");
const ACCENT_LIGHT = new THREE.Color("#7cc2ff");

function Core() {
  const wire = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (wire.current) {
      wire.current.rotation.y += delta * 0.18;
      wire.current.rotation.x = Math.sin(t * 0.25) * 0.18;
      // Ease toward the pointer rather than snapping to it.
      wire.current.rotation.y += (pointer.x * 0.4 - wire.current.rotation.y * 0.002) * delta;
      wire.current.rotation.x += (-pointer.y * 0.25 - wire.current.rotation.x) * delta * 0.6;
      const breathe = 1 + Math.sin(t * 0.8) * 0.04;
      wire.current.scale.setScalar(breathe);
    }
    if (inner.current) {
      inner.current.rotation.y -= delta * 0.3;
      inner.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={wire}>
        <icosahedronGeometry args={[1.6, 3]} />
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.32} />
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshBasicMaterial color={ACCENT_LIGHT} wireframe transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function Dust({ count = 420 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    // Fibonacci sphere: deterministic (so it's stable across renders and
    // matches on server and client) and more evenly spaced than random.
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      // Deterministic jitter keeps it a shell rather than a hard sphere.
      const noise = Math.abs(Math.sin(i * 127.1) * 43758.5453) % 1;
      const r = 2.4 + noise * 2.6;
      arr[i * 3] = Math.cos(theta) * radiusAtY * r;
      arr[i * 3 + 1] = y * r;
      arr[i * 3 + 2] = Math.sin(theta) * radiusAtY * r;
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!points.current) return;
    points.current.rotation.y += delta * 0.045;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.12;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color={ACCENT_LIGHT}
        transparent
        opacity={0.75}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function SignalMesh() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      // Only redraw while visible; paired with the section's IntersectionObserver.
      frameloop="always"
    >
      <Core />
      <Dust />
    </Canvas>
  );
}
