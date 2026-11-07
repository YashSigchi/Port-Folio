'use client';

import React from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

export function FloatingAccents() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Keep the cube's travel short so it never drifts up into the fixed navbar
  const yCube = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const rotateCube = useTransform(scrollYProgress, [0, 1], [0, 240]);
  const yRing1 = useTransform(scrollYProgress, [0, 1], [0, -220]);
  const yRing2 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const yOrb = useTransform(scrollYProgress, [0, 1], [0, -180]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden select-none hidden xl:block"
    >
      {/* 1. Wireframe 3D CSS Cube with "YS" mark */}
      <motion.div
        style={{ y: yCube, rotateZ: rotateCube }}
        className="absolute top-[34%] right-8 w-16 h-16 rounded-card border border-indigo/25 bg-indigo/10 flex items-center justify-center shadow-[0_0_24px_rgba(129,140,248,0.18)] will-change-transform"
      >
        <div className="w-10 h-10 rounded border border-cyan/30 flex items-center justify-center rotate-45">
          <span className="font-heading font-bold text-[10px] text-indigo -rotate-45">YS</span>
        </div>
      </motion.div>

      {/* 2. Tilted Glass Ring Left */}
      {/* Tilt lives on the inner ring: Framer's inline `y` transform would override it here */}
      <motion.div style={{ y: yRing1 }} className="absolute top-[55%] left-6 will-change-transform">
        <div className="w-20 h-20 rounded-full border-2 border-magenta/20 bg-magenta/5 [transform:perspective(400px)_rotateX(55deg)_rotateY(20deg)]" />
      </motion.div>

      {/* 3. Cyan Rim Glass Ring Right */}
      <motion.div
        style={{ y: yRing2 }}
        className="absolute top-[78%] right-10 will-change-transform"
      >
        <div className="w-24 h-24 rounded-full border border-cyan/25 bg-cyan/5 [transform:perspective(400px)_rotateX(65deg)_rotateY(-25deg)]" />
      </motion.div>

      {/* 4. Soft Ambient Gradient Orb */}
      <motion.div
        style={{ y: yOrb }}
        className="absolute top-[42%] left-10 w-12 h-12 rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.22),rgba(34,211,238,0.12)_45%,transparent_70%)] will-change-transform"
      />
    </div>
  );
}
