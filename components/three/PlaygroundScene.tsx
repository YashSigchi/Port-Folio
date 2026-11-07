'use client';

import React, { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider, type RapierRigidBody } from '@react-three/rapier';
import { Html, OrbitControls } from '@react-three/drei';
import { skills, type SkillCategory } from '@/data/skills';

const CATEGORY_COLORS: Record<SkillCategory, string> = {
  Languages: '#818CF8',
  Backend: '#22D3EE',
  Frontend: '#D946EF',
  Databases: '#FBBF24',
  'AI/ML': '#22C55E',
  'DevOps & Tools': '#C4B5FD',
  Learning: '#F43F5E',
};

function TechTile({
  name,
  color,
  position,
}: {
  name: string;
  color: string;
  position: [number, number, number];
}) {
  const bodyRef = useRef<RapierRigidBody>(null);

  const flingTile = () => {
    if (!bodyRef.current) return;
    bodyRef.current.applyImpulse(
      {
        x: (Math.random() - 0.5) * 8,
        y: 6 + Math.random() * 5,
        z: (Math.random() - 0.5) * 4,
      },
      true
    );
    bodyRef.current.applyTorqueImpulse(
      {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
        z: (Math.random() - 0.5) * 2,
      },
      true
    );
  };

  return (
    <RigidBody
      ref={bodyRef}
      position={position}
      restitution={0.55}
      friction={0.4}
      colliders="cuboid"
    >
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          flingTile();
        }}
        onPointerEnter={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <boxGeometry args={[1.35, 0.55, 0.45]} />
        <meshStandardMaterial
          color="#11132B"
          emissive={color}
          emissiveIntensity={0.35}
          roughness={0.25}
          metalness={0.3}
        />
        <Html position={[0, 0, 0.24]} transform distanceFactor={6} center>
          <span
            onClick={flingTile}
            className="px-2 py-0.5 rounded font-mono text-[11px] font-semibold text-primary bg-void/90 border border-white/20 select-none cursor-pointer"
          >
            {name}
          </span>
        </Html>
      </mesh>
    </RigidBody>
  );
}

function BoundingArena() {
  return (
    <RigidBody type="fixed" restitution={0.4} friction={0.6}>
      {/* Floor */}
      <CuboidCollider args={[8, 0.4, 5]} position={[0, -3.6, 0]} />
      <mesh position={[0, -3.6, 0]}>
        <boxGeometry args={[16, 0.8, 10]} />
        <meshStandardMaterial color="#0A0B1E" roughness={0.8} />
      </mesh>
      {/* Left Wall */}
      <CuboidCollider args={[0.4, 8, 5]} position={[-6.5, 2, 0]} />
      {/* Right Wall */}
      <CuboidCollider args={[0.4, 8, 5]} position={[6.5, 2, 0]} />
      {/* Back Wall */}
      <CuboidCollider args={[8, 8, 0.4]} position={[0, 2, -2.5]} />
      {/* Front Invisible Wall */}
      <CuboidCollider args={[8, 8, 0.4]} position={[0, 2, 2.5]} />
    </RigidBody>
  );
}

export default function PlaygroundScene({ resetKey }: { resetKey: number }) {
  const [contextLost, setContextLost] = useState(false);

  const tiles = skills.slice(0, 22).map((s, idx) => {
    const col = (idx % 5) - 2;
    const row = Math.floor(idx / 5);
    return {
      name: s.name,
      color: CATEGORY_COLORS[s.category],
      position: [
        col * 1.55 + (Math.random() - 0.5) * 0.25,
        2.5 + row * 1.4,
        (Math.random() - 0.5) * 0.6,
      ] as [number, number, number],
    };
  });

  if (contextLost) {
    return (
      <div className="h-[540px] flex items-center justify-center text-secondary font-mono text-sm">
        WebGL context lost. Click Reset above to reload the physics sandbox.
      </div>
    );
  }

  return (
    <div className="h-[540px] w-full rounded-panel overflow-hidden border border-border-subtle bg-deep relative">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center font-mono text-xs text-muted">
            Initializing Rapier 3D Physics Engine...
          </div>
        }
      >
        <Canvas
          key={resetKey}
          dpr={[1, 1.5]}
          camera={{ position: [0, 0.5, 9.5], fov: 48 }}
          gl={{ antialias: true }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener(
              'webglcontextlost',
              (e) => {
                e.preventDefault();
                setContextLost(true);
              },
              false
            );
          }}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 8, 5]} intensity={1.4} color="#818CF8" />
          <pointLight position={[-5, 3, 4]} intensity={1.2} color="#22D3EE" />

          <Physics gravity={[0, -9.81, 0]}>
            <BoundingArena />
            {tiles.map((t) => (
              <TechTile
                key={`${resetKey}-${t.name}`}
                name={t.name}
                color={t.color}
                position={t.position}
              />
            ))}
          </Physics>

          <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} />
        </Canvas>
      </Suspense>
    </div>
  );
}
