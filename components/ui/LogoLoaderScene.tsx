"use client";

import { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

/**
 * 3D stage for the site preloader: the ProEduvate mark on a plane, tumbling
 * inside two counter-rotating rings. The mark is the existing PNG used as a
 * transparent texture rather than modelled geometry, so this adds no new
 * assets.
 */

const ACCENT = new THREE.Color("#0082fb");

function Mark({ progress }: { progress: number }) {
  const group = useRef<THREE.Group>(null);
  const texture = useLoader(THREE.TextureLoader, "/icon.png");

  useFrame((state, delta) => {
    if (!group.current) return;
    // Spin faster as loading completes, so the motion reads as "spinning up".
    group.current.rotation.y += delta * (0.9 + progress * 2.6);
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.7) * 0.14;
  });

  return (
    <group ref={group}>
      <mesh>
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Rings({ progress }: { progress: number }) {
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const arc = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (outer.current) outer.current.rotation.z -= delta * 0.35;
    if (inner.current) inner.current.rotation.z += delta * 0.55;
    if (arc.current) {
      arc.current.rotation.z -= delta * 1.4;
      const s = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      arc.current.scale.setScalar(s);
    }
  });

  return (
    <group>
      <mesh ref={outer} rotation={[Math.PI / 2.6, 0, 0]}>
        <torusGeometry args={[1.9, 0.006, 8, 96]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.5} />
      </mesh>
      <mesh ref={inner} rotation={[-Math.PI / 3.2, 0.4, 0]}>
        <torusGeometry args={[1.45, 0.005, 8, 96]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.35} />
      </mesh>
      {/* Arc length tracks load progress, so the ring closes as it finishes. */}
      <mesh ref={arc}>
        <torusGeometry args={[2.25, 0.012, 8, 128, Math.max(0.15, progress * Math.PI * 2)]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

export default function LogoLoaderScene({ progress }: { progress: number }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.4], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
    >
      <Mark progress={progress} />
      <Rings progress={progress} />
    </Canvas>
  );
}
