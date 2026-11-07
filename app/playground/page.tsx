'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { RotateCcw, ArrowLeft, Sparkles } from 'lucide-react';
import { usePerformanceTier } from '@/lib/usePerformanceTier';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { skills } from '@/data/skills';
import { Chip } from '@/components/ui/Chip';

const PlaygroundScene = dynamic(() => import('@/components/three/PlaygroundScene'), {
  ssr: false,
});

export default function PlaygroundPage() {
  const { enableWebGL } = usePerformanceTier();
  const [resetKey, setResetKey] = useState(0);

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen pt-28 pb-20 bg-void">
        <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-secondary hover:text-primary mb-4"
              >
                <ArrowLeft className="w-4 h-4 text-indigo" />
                <span>Back to portfolio</span>
              </Link>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber" />
                <span className="font-mono text-xs uppercase tracking-[0.12em] text-indigo">
                  Interactive Sandbox
                </span>
              </div>
              <h1 className="font-heading text-3xl sm:text-5xl font-bold text-primary mt-1">
                3D Stack <span className="text-gradient-cosmic">Playground.</span>
              </h1>
              <p className="text-sm sm:text-base text-secondary mt-2 max-w-xl">
                Click any falling technology tile to fling it across the Rapier physics chamber, or
                hit Reset to drop a fresh batch.
              </p>
            </div>

            {enableWebGL && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setResetKey((prev) => prev + 1)}
              >
                <RotateCcw className="w-4 h-4 text-indigo" />
                <span>Reset Gravity</span>
              </Button>
            )}
          </div>

          {enableWebGL ? (
            <PlaygroundScene resetKey={resetKey} />
          ) : (
            <GlassCard hoverLift={false} className="p-8 sm:p-12 text-center space-y-6">
              <p className="font-heading text-xl font-bold text-primary">
                Static Sandbox View (Mobile / Reduced Motion Mode)
              </p>
              <p className="text-sm text-secondary max-w-lg mx-auto">
                To keep battery life and frame rates smooth on mobile or reduced-motion devices, the
                WebGL Rapier physics simulation is paused. Open on a desktop browser to fling the 3D
                stack tiles!
              </p>
              <div className="flex flex-wrap justify-center gap-2 pt-2">
                {skills.map((s) => (
                  <Chip key={s.name} withDiamond>
                    {s.name}
                  </Chip>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
