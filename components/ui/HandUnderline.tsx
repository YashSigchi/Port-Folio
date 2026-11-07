'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HandUnderlineProps {
  className?: string;
}

export function HandUnderline({ className }: HandUnderlineProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 220 14"
      preserveAspectRatio="none"
      aria-hidden="true"
      stroke="currentColor"
      fill="none"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('pointer-events-none select-none w-full h-3.5', className)}
    >
      <motion.path
        d="M3 9 C 40 3, 78 12, 118 6 S 190 9, 217 4"
        initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}
