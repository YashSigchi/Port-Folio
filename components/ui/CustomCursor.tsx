'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

export function CustomCursor() {
  const prefersReducedMotion = useReducedMotion();
  const [isPointerFine, setIsPointerFine] = useState(false);
  const [label, setLabel] = useState<string>('');
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const ringX = useSpring(mouseX, { stiffness: 250, damping: 24, mass: 0.2 });
  const ringY = useSpring(mouseY, { stiffness: 250, damping: 24, mass: 0.2 });

  useEffect(() => {
    if (prefersReducedMotion) return;

    const mediaQuery = window.matchMedia('(pointer: fine)');
    setIsPointerFine(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsPointerFine(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    // Hover detection only needs to run when the element under the pointer changes,
    // not on every mousemove (which also fired React state updates each frame).
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorEl = target.closest('[data-cursor]') as HTMLElement | null;
      const interactiveEl = target.closest('a, button, [role="button"], input, textarea, select');

      if (cursorEl) {
        setLabel(cursorEl.getAttribute('data-cursor') || '');
        setIsHovered(true);
      } else if (interactiveEl) {
        setLabel('');
        setIsHovered(true);
      } else {
        setLabel('');
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [prefersReducedMotion, mouseX, mouseY]);

  if (prefersReducedMotion || !isPointerFine) {
    return null;
  }

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-indigo"
        style={{ x: mouseX, y: mouseY }}
      />

      {/* Trailing ring */}
      <motion.div
        className="fixed top-0 left-0 flex items-center justify-center rounded-full border border-indigo/50 bg-indigo/10 transition-[width,height,margin] duration-200"
        style={{
          x: ringX,
          y: ringY,
          width: label ? 64 : isHovered ? 44 : 32,
          height: label ? 64 : isHovered ? 44 : 32,
          marginLeft: label ? -32 : isHovered ? -22 : -16,
          marginTop: label ? -32 : isHovered ? -22 : -16,
        }}
      >
        {label && (
          <span className="font-mono text-[10px] uppercase tracking-wider text-primary font-semibold">
            {label}
          </span>
        )}
      </motion.div>
    </div>
  );
}
