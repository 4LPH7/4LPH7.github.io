"use client";

import { MeshDistortMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type * as THREE from "three";

/** The blob leans toward the pointer and wobbles harder the closer the pointer is to the centre. */
function Blob({ pointer }: { pointer: React.RefObject<{ x: number; y: number; on: boolean }> }) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<React.ComponentRef<typeof MeshDistortMaterial>>(null);

  useFrame((state, delta) => {
    const m = mesh.current;
    const p = pointer.current;
    if (!m || !p) return;
    const k = Math.min(1, delta * 3);
    const tx = p.on ? p.y * 0.8 : Math.sin(state.clock.elapsedTime * 0.3) * 0.3;
    const ty = p.on ? p.x * 0.9 : state.clock.elapsedTime * 0.25;
    m.rotation.x += (tx - m.rotation.x) * k;
    m.rotation.y += (ty - m.rotation.y) * k;
    m.position.x += ((p.on ? p.x * 0.18 : 0) - m.position.x) * k;
    m.position.y += ((p.on ? p.y * 0.18 : 0) - m.position.y) * k;
    if (mat.current) {
      const near = p.on ? 1 - Math.min(1, Math.hypot(p.x, p.y)) : 0;
      mat.current.distort += (0.38 + near * 0.25 - mat.current.distort) * k;
    }
  });

  return (
    <mesh ref={mesh} scale={0.78}>
      <icosahedronGeometry args={[1, 64]} />
      <MeshDistortMaterial ref={mat} color="#1d4ed8" emissive="#0b1d6e" roughness={0.18} metalness={0.25} distort={0.38} speed={1.6} />
    </mesh>
  );
}

export default function BlobScene({ pointer, active }: { pointer: React.RefObject<{ x: number; y: number; on: boolean }>; active: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 4.2], fov: 40 }} dpr={[1, 1.75]} frameloop={active ? "always" : "never"} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[-2, 3, 4]} intensity={2.4} color="#ffffff" />
      <pointLight position={[2, -2, 2]} intensity={6} color="#60a5fa" />
      <Blob pointer={pointer} />
    </Canvas>
  );
}
