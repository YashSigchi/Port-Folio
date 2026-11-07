'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { skills, type SkillCategory, type SkillItem } from '@/data/skills';
import { GlassCard } from '@/components/ui/GlassCard';
import { Chip } from '@/components/ui/Chip';

const CATEGORY_COLORS: Record<SkillCategory, string> = {
  Languages: '#818CF8',
  Backend: '#22D3EE',
  Frontend: '#D946EF',
  Databases: '#FBBF24',
  'AI/ML': '#22C55E',
  'DevOps & Tools': '#C4B5FD',
  Learning: '#F43F5E',
};

interface GalaxySceneProps {
  hoveredSkill: SkillItem | null;
  setHoveredSkill: (s: SkillItem | null) => void;
  pinnedSkill: SkillItem | null;
  setPinnedSkill: (s: SkillItem | null) => void;
}

function GalaxyNodes({
  hoveredSkill,
  setHoveredSkill,
  pinnedSkill,
  setPinnedSkill,
}: GalaxySceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  const nodeData = useMemo(() => {
    return skills.map((skill, idx) => {
      const total = skills.length;
      const goldenRatio = (1 + Math.sqrt(5)) / 2;
      const i = idx + 0.5;
      const phi = Math.acos(1 - (2 * i) / total);
      const theta = (2 * Math.PI * i) / goldenRatio;
      const radius = 2.6 + (idx % 4) * 0.45;

      const position = new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );

      return {
        skill,
        position,
        color: CATEGORY_COLORS[skill.category],
      };
    });
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current && !hoveredSkill) {
      groupRef.current.rotation.y += delta * 0.08;
    }
  });

  const activeCategory = hoveredSkill?.category || pinnedSkill?.category;

  return (
    <group ref={groupRef}>
      {nodeData.map(({ skill, position, color }) => {
        const isHighlighted =
          hoveredSkill?.name === skill.name ||
          pinnedSkill?.name === skill.name ||
          (activeCategory && skill.category === activeCategory);

        return (
          <group key={skill.name} position={position}>
            <mesh
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredSkill(skill);
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                setHoveredSkill(null);
              }}
              onClick={(e) => {
                e.stopPropagation();
                setPinnedSkill(skill);
              }}
              scale={isHighlighted ? 1.45 : 1}
            >
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={isHighlighted ? 0.9 : 0.35}
              />
            </mesh>

            <Html distanceFactor={10} position={[0, 0.22, 0]} center>
              <button
                type="button"
                onClick={() => setPinnedSkill(skill)}
                onMouseEnter={() => setHoveredSkill(skill)}
                onMouseLeave={() => setHoveredSkill(null)}
                className={`px-2 py-0.5 rounded-pill font-mono text-[10px] whitespace-nowrap border transition-all ${
                  pinnedSkill?.name === skill.name
                    ? 'bg-indigo text-void border-indigo font-bold scale-110'
                    : isHighlighted
                    ? 'bg-surface/95 text-primary border-indigo/50'
                    : 'bg-void/75 text-secondary border-white/10 opacity-80'
                }`}
              >
                {skill.name}
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

export default function SkillsConstellation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [contextLost, setContextLost] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState<SkillItem | null>(null);
  const [pinnedSkill, setPinnedSkill] = useState<SkillItem | null>(skills[0]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (contextLost) {
    return (
      <GlassCard className="p-8 text-center text-secondary">
        WebGL context paused. Switch back to the 2D Grid above to inspect all skills.
      </GlassCard>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
      {/* 3D Galaxy Canvas (8 cols) */}
      <div
        ref={containerRef}
        className="lg:col-span-8 h-[480px] rounded-panel bg-void/80 border border-border-subtle relative overflow-hidden"
      >
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center font-mono text-xs text-muted">
              Loading 3D Skill Constellation...
            </div>
          }
        >
          <Canvas
            dpr={[1, 1.5]}
            frameloop={isVisible ? 'always' : 'never'}
            camera={{ position: [0, 0, 6.8], fov: 50 }}
            gl={{ antialias: true, alpha: true }}
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
            <ambientLight intensity={0.7} />
            <pointLight position={[5, 5, 5]} intensity={1.2} color="#818CF8" />
            <pointLight position={[-5, -5, -3]} intensity={1.0} color="#22D3EE" />
            <GalaxyNodes
              hoveredSkill={hoveredSkill}
              setHoveredSkill={setHoveredSkill}
              pinnedSkill={pinnedSkill}
              setPinnedSkill={setPinnedSkill}
            />
            <OrbitControls enableZoom={false} enablePan={false} dampingFactor={0.06} />
          </Canvas>
        </Suspense>

        <div className="pointer-events-none absolute bottom-3 left-4 font-mono text-[11px] text-muted">
          Drag to rotate constellation · Click any node to pin details
        </div>
      </div>

      {/* Pinned Info Card (4 cols) */}
      <div className="lg:col-span-4">
        <GlassCard hoverLift={false} className="p-6 border-indigo/40">
          {pinnedSkill && (
            <>
              <div className="flex items-center justify-between gap-2 mb-3">
                <Chip variant="indigo">{pinnedSkill.category}</Chip>
                <span className="font-mono text-xs text-muted">Pinned Node</span>
              </div>
              <h3 className="font-heading text-2xl font-bold text-primary mb-4">
                {pinnedSkill.name}
              </h3>
              <p className="font-mono text-xs uppercase tracking-wider text-muted mb-2.5">
                Used in:
              </p>
              <ul className="space-y-2">
                {pinnedSkill.usedIn.map((refItem) => (
                  <li key={refItem} className="flex items-start gap-2 text-sm text-secondary">
                    <span className="text-cyan font-mono text-xs mt-1" aria-hidden="true">
                      ◆
                    </span>
                    <span>{refItem}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
