'use client';

import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useScroll } from 'framer-motion';
import { usePerformanceTier } from '@/lib/usePerformanceTier';

interface NeuralNebulaCoreProps {
  particleCount: number;
  scrollProgressRef: React.MutableRefObject<number>;
}

function NeuralNebulaCore({ particleCount, scrollProgressRef }: NeuralNebulaCoreProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const pointsRef = useRef<THREE.Points>(null);

  // Create ~12 low-poly neural network nodes and connecting edges
  const { nodePositions, lineGeometry } = useMemo(() => {
    const nodes: THREE.Vector3[] = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const radius = 2.25 + (i % 3) * 0.35;
      nodes.push(
        new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        )
      );
    }

    const linePositions: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 2.6) {
          linePositions.push(
            nodes[i].x,
            nodes[i].y,
            nodes[i].z,
            nodes[j].x,
            nodes[j].y,
            nodes[j].z
          );
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    return { nodePositions: nodes, lineGeometry: geo };
  }, []);

  // Orbiting particle field
  const particleGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color('#818CF8'),
      new THREE.Color('#D946EF'),
      new THREE.Color('#22D3EE'),
    ];

    for (let i = 0; i < particleCount; i++) {
      const r = 1.8 + Math.random() * 4.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);

      const c = palette[i % palette.length];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [particleCount]);

  useEffect(() => {
    return () => {
      lineGeometry.dispose();
      particleGeometry.dispose();
    };
  }, [lineGeometry, particleGeometry]);

  useFrame((state, delta) => {
    const scrollVal = scrollProgressRef.current;

    if (coreMeshRef.current) {
      coreMeshRef.current.rotation.x += delta * 0.22;
      coreMeshRef.current.rotation.y += delta * 0.32 + scrollVal * 0.02;
      const scale = Math.max(0.65, 1 - scrollVal * 0.35);
      coreMeshRef.current.scale.setScalar(scale);
    }

    if (pointsRef.current) {
      pointsRef.current.rotation.y -= delta * 0.06;
    }

    if (groupRef.current) {
      // Cursor parallax tilt
      const targetX = state.pointer.y * 0.25;
      const targetY = state.pointer.x * 0.35;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetX,
        0.06
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetY,
        0.06
      );
    }

    // Camera dolly back while scrolling
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      5.5 + scrollVal * 2.2,
      0.08
    );
  });

  return (
    <group ref={groupRef}>
      {/* Iridescent crystalline icosahedron core */}
      <mesh ref={coreMeshRef}>
        <icosahedronGeometry args={[1.25, 1]} />
        {/* No `transmission`: it forces an extra full-scene render pass every frame */}
        <meshPhysicalMaterial
          color="#818CF8"
          emissive="#4F46E5"
          emissiveIntensity={0.35}
          roughness={0.15}
          metalness={0.2}
          transparent
          opacity={0.85}
          iridescence={1}
          iridescenceIOR={1.4}
          wireframe={false}
        />
      </mesh>

      {/* Subtle wireframe shell around core */}
      <mesh scale={1.42}>
        <icosahedronGeometry args={[1.25, 1]} />
        <meshBasicMaterial color="#22D3EE" wireframe transparent opacity={0.18} />
      </mesh>

      {/* ~12 Neural Network Node Spheres */}
      {nodePositions.map((pos, idx) => (
        <mesh key={idx} position={pos}>
          <icosahedronGeometry args={[0.075, 0]} />
          <meshBasicMaterial color={idx % 2 === 0 ? '#22D3EE' : '#D946EF'} />
        </mesh>
      ))}

      {/* Connecting Neural Lines */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#818CF8" transparent opacity={0.25} />
      </lineSegments>

      {/* Orbiting Particle Field + Starfield */}
      <points ref={pointsRef} geometry={particleGeometry}>
        <pointsMaterial size={0.028} vertexColors transparent opacity={0.75} sizeAttenuation />
      </points>
    </group>
  );
}

function StaticHeroFallback() {
  return (
    <div className="relative w-[380px] h-[380px] md:w-[580px] md:h-[580px] opacity-65">
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo/30 via-magenta/25 to-cyan/25 blur-3xl" />
      <div className="absolute inset-12 rounded-full border border-indigo/20" />
      <div className="absolute inset-28 rounded-full border border-cyan/20" />
    </div>
  );
}

export default function HeroScene() {
  const { enableWebGL, particleCount, tier } = usePerformanceTier();
  const isHighTier = tier === 'high';
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [contextLost, setContextLost] = useState(false);

  const { scrollYProgress } = useScroll();
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      scrollProgressRef.current = v;
    });
  }, [scrollYProgress]);

  // The container only mounts once WebGL is enabled (the tier starts as 'static'),
  // so re-run when it appears — otherwise the canvas never pauses off-screen.
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
  }, [enableWebGL, contextLost]);

  if (!enableWebGL || contextLost) {
    return <StaticHeroFallback />;
  }

  return (
    <div ref={containerRef} className="w-full h-full">
      <Suspense fallback={<StaticHeroFallback />}>
        <Canvas
          dpr={isHighTier ? [1, 1.5] : 1}
          frameloop={isVisible ? 'always' : 'never'}
          camera={{ position: [0, 0, 5.5], fov: 50 }}
          // With the composer on, it does its own MSAA — native antialias would be wasted work
          gl={{ antialias: !isHighTier, alpha: true, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            const canvas = gl.domElement;
            const handleContextLost = (e: Event) => {
              e.preventDefault();
              setContextLost(true);
            };
            canvas.addEventListener('webglcontextlost', handleContextLost, false);
          }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[4, 4, 3]} intensity={1.4} color="#818CF8" />
          <pointLight position={[-4, -2, 3]} intensity={1.8} color="#22D3EE" />
          <pointLight position={[2, -3, -2]} intensity={1.2} color="#D946EF" />

          <NeuralNebulaCore particleCount={particleCount} scrollProgressRef={scrollProgressRef} />

          {/* Bloom is several full-screen passes; keep it to high-tier devices with lighter MSAA */}
          {isHighTier && (
            <EffectComposer multisampling={4}>
              <Bloom luminanceThreshold={0.45} luminanceSmoothing={0.85} intensity={0.55} />
            </EffectComposer>
          )}
        </Canvas>
      </Suspense>
    </div>
  );
}
