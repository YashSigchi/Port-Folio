'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HandArrowProps {
  className?: string;
}

export function HandArrow({ className }: HandArrowProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 140 90"
      width="140"
      height="90"
      aria-hidden="true"
      stroke="currentColor"
      fill="none"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('pointer-events-none select-none', className)}
    >
      <motion.path
        d="M8 12 C 38 6, 96 18, 112 62"
        initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.path
        d="M98 54 L113 66 L120 46"
        initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}
