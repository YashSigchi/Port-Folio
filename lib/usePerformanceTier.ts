'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export type PerformanceTier = 'static' | 'mid' | 'high';

export interface PerformanceConfig {
  tier: PerformanceTier;
  particleCount: number;
  enableWebGL: boolean;
}

export function usePerformanceTier(): PerformanceConfig {
  const prefersReducedMotion = useReducedMotion();
  const [config, setConfig] = useState<PerformanceConfig>({
    tier: 'static',
    particleCount: 0,
    enableWebGL: false,
  });

  useEffect(() => {
    if (prefersReducedMotion) {
      setConfig({ tier: 'static', particleCount: 0, enableWebGL: false });
      return;
    }

    const isMobileViewport = window.innerWidth < 768;
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

    if (isMobileViewport || isCoarsePointer) {
      setConfig({ tier: 'static', particleCount: 0, enableWebGL: false });
      return;
    }

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      if (!gl) {
        setConfig({ tier: 'static', particleCount: 0, enableWebGL: false });
        return;
      }
    } catch {
      setConfig({ tier: 'static', particleCount: 0, enableWebGL: false });
      return;
    }

    const cores = navigator.hardwareConcurrency || 4;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 4;

    if (cores >= 8 && memory >= 8) {
      setConfig({ tier: 'high', particleCount: 3000, enableWebGL: true });
    } else {
      setConfig({ tier: 'mid', particleCount: 800, enableWebGL: true });
    }
  }, [prefersReducedMotion]);

  return config;
}
