'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface RouteTransitionProps {
  children: React.ReactNode;
}

export function RouteTransition({ children }: RouteTransitionProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    // Opacity only: a transform on this page-wide wrapper would re-rasterize the whole page
    // and break `position: fixed` descendants (Navbar) while it animates.
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
