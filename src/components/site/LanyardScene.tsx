"use client";

import { BallCollider, CuboidCollider, Physics, type RapierRigidBody, RigidBody, useRopeJoint, useSphericalJoint } from "@react-three/rapier";
import { Canvas, extend, type ThreeElement, useFrame, useThree } from "@react-three/fiber";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { site } from "@/data/site";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: ThreeElement<typeof MeshLineMaterial>;
  }
}

const SEGMENT = { type: "dynamic" as const, canSleep: true, colliders: false as const, angularDamping: 2, linearDamping: 2 };
const CARD = { w: 1.6, h: 2.25 };

/** Draws the card face (name, handle, role) so no photo or model file is needed. */
function cardTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 720;
  const g = c.getContext("2d");
  if (!g) return new THREE.Texture();
  g.fillStyle = "#08090c";
  g.fillRect(0, 0, 512, 720);
  g.fillStyle = "#3b82f6";
  g.fillRect(0, 0, 512, 14);
  g.fillStyle = "#ffffff";
  g.font = "400 96px 'Instrument Serif', Georgia, serif";
  g.fillText(site.name.toUpperCase(), 40, 330);
  g.fillStyle = "#3b82f6";
  g.font = "500 36px ui-monospace, monospace";
  g.fillText(`@${site.handle}`, 44, 392);
  g.fillStyle = "#a1a1aa";
  g.font = "400 30px system-ui, sans-serif";
  g.fillText("Full-stack developer", 44, 450);
  g.fillText(site.location, 44, 492);
  g.fillStyle = "#ffffff22";
  for (let x = 44; x < 470; x += 9) g.fillRect(x, 620, x % 27 === 8 ? 5 : 3, 56);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function Band() {
  const band = useRef<THREE.Mesh<MeshLineGeometry>>(null);
  const fixed = useRef<RapierRigidBody>(null);
  const j1 = useRef<RapierRigidBody>(null);
  const j2 = useRef<RapierRigidBody>(null);
  const j3 = useRef<RapierRigidBody>(null);
  const card = useRef<RapierRigidBody>(null);
  const { width, height } = useThree((s) => s.size);
  const tmp = useMemo(() => ({ vec: new THREE.Vector3(), dir: new THREE.Vector3(), ang: new THREE.Vector3(), rot: new THREE.Vector3(), l1: new THREE.Vector3(), l2: new THREE.Vector3() }), []);
  const curve = useMemo(() => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()]), []);
  const texture = useMemo(cardTexture, []);
  const [dragged, setDragged] = useState<THREE.Vector3 | false>(false);
  const [hovered, setHovered] = useState(false);

  useRopeJoint(fixed as React.RefObject<RapierRigidBody>, j1 as React.RefObject<RapierRigidBody>, [[0, 0, 0], [0, 0, 0], 0.8]);
  useRopeJoint(j1 as React.RefObject<RapierRigidBody>, j2 as React.RefObject<RapierRigidBody>, [[0, 0, 0], [0, 0, 0], 0.8]);
  useRopeJoint(j2 as React.RefObject<RapierRigidBody>, j3 as React.RefObject<RapierRigidBody>, [[0, 0, 0], [0, 0, 0], 0.8]);
  useSphericalJoint(j3 as React.RefObject<RapierRigidBody>, card as React.RefObject<RapierRigidBody>, [[0, 0, 0], [0, 1.45, 0]]);

  useEffect(() => {
    document.body.style.cursor = dragged ? "grabbing" : hovered ? "grab" : "auto";
    return () => { document.body.style.cursor = "auto"; };
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    const { vec, dir, ang, rot, l1, l2 } = tmp;
    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      for (const r of [card, j1, j2, j3, fixed]) r.current?.wakeUp();
      card.current.setNextKinematicTranslation({ x: vec.x - dragged.x, y: vec.y - dragged.y, z: vec.z - dragged.z });
    }
    if (fixed.current && j1.current && j2.current && j3.current && card.current && band.current) {
      // Smooth the middle joints so the band doesn't kink.
      l1.lerp(j1.current.translation() as unknown as THREE.Vector3, Math.min(1, delta * 20));
      l2.lerp(j2.current.translation() as unknown as THREE.Vector3, Math.min(1, delta * 20));
      curve.points[0].copy(j3.current.translation() as unknown as THREE.Vector3);
      curve.points[1].copy(l2);
      curve.points[2].copy(l1);
      curve.points[3].copy(fixed.current.translation() as unknown as THREE.Vector3);
      band.current.geometry.setPoints(curve.getPoints(32));
      ang.copy(card.current.angvel() as unknown as THREE.Vector3);
      rot.copy(card.current.rotation() as unknown as THREE.Vector3);
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);
    }
  });

  return (
    <>
      <group position={[0, 2.5, 0]}>
        <RigidBody ref={fixed} type="fixed" />
        <RigidBody position={[0.4, 0, 0]} ref={j1} {...SEGMENT}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[0.8, 0, 0]} ref={j2} {...SEGMENT}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1.2, 0, 0]} ref={j3} {...SEGMENT}><BallCollider args={[0.1]} /></RigidBody>
        <RigidBody position={[1.6, 0, 0]} ref={card} {...SEGMENT} type={dragged ? "kinematicPosition" : "dynamic"}>
          <CuboidCollider args={[CARD.w / 2, CARD.h / 2, 0.02]} />
          <group
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerUp={(e) => { (e.target as Element).releasePointerCapture(e.pointerId); setDragged(false); }}
            onPointerDown={(e) => {
              (e.target as Element).setPointerCapture(e.pointerId);
              if (card.current) setDragged(new THREE.Vector3().copy(e.point).sub(tmp.vec.copy(card.current.translation() as unknown as THREE.Vector3)));
            }}
          >
            <mesh>
              <boxGeometry args={[CARD.w, CARD.h, 0.03]} />
              <meshStandardMaterial map={texture} roughness={0.5} metalness={0.2} />
            </mesh>
            <mesh position={[0, CARD.h / 2 + 0.12, 0]}>
              <boxGeometry args={[0.36, 0.22, 0.05]} />
              <meshStandardMaterial color="#9ca3af" roughness={0.3} metalness={0.9} />
            </mesh>
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial args={[{ resolution: new THREE.Vector2(width, height) }]} color="#3b82f6" depthTest={false} resolution={[width, height]} lineWidth={Math.max(6, width / 120)} />
      </mesh>
    </>
  );
}

export default function LanyardScene({ active }: { active: boolean }) {
  return (
    <Canvas camera={{ position: [0, 0, 13], fov: 25 }} dpr={[1, 1.75]} frameloop={active ? "always" : "demand"} gl={{ alpha: true }} onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}>
      <ambientLight intensity={Math.PI} />
      <directionalLight position={[3, 4, 5]} intensity={2} />
      <Physics gravity={[0, -40, 0]} timeStep={1 / 60} paused={!active}>
        <Band />
      </Physics>
    </Canvas>
  );
}
