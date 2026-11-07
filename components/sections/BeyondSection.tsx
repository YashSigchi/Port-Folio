'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Zap, Compass, Users, Gamepad2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

const STICKERS = [
  {
    title: 'Fast learner',
    description:
      'Picked up Spring Boot, ARM64 Docker deployments, and LangGraph state machines on the fly to ship real deliverables.',
    note: 'docs + prototypes → ship!',
    rotation: '-rotate-2',
    icon: Zap,
    accent: 'text-amber',
  },
  {
    title: 'Curious',
    description:
      'Always asking how and why under the hood—whether inspecting AES block entropy or Integrated Gradients attributions.',
    note: 'how does it work inside?',
    rotation: 'rotate-1',
    icon: Compass,
    accent: 'text-cyan',
  },
  {
    title: 'Team player',
    description:
      'Thrives in fast-moving founding teams and structured enterprise squads alike. Clear communication and zero ego.',
    note: 'collaborate & elevate ✨',
    rotation: '-rotate-1',
    icon: Users,
    accent: 'text-indigo',
  },
  {
    title: 'When AFK',
    description:
      'Console games, playing sports, travelling to new cities, and exploring new cuisines with friends.',
    note: 'controller in hand 🎮',
    rotation: 'rotate-2',
    icon: Gamepad2,
    accent: 'text-magenta',
  },
];

export function BeyondSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="py-20 bg-void relative overflow-hidden border-y border-border-subtle">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-indigo">
              Beyond the code
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary mt-1">
              Human behind the terminal.
            </h2>
          </div>
          <p className="font-hand text-2xl text-lavender">
            psst... drag the sticker cards around! ✨
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STICKERS.map((sticker) => {
            const Icon = sticker.icon;
            return (
              <motion.div
                key={sticker.title}
                drag={!prefersReducedMotion}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.45}
                whileTap={prefersReducedMotion ? undefined : { scale: 1.03, cursor: 'grabbing' }}
                className={prefersReducedMotion ? '' : 'cursor-grab'}
              >
                {/* Tilt lives on an inner wrapper so its CSS transition doesn't fight drag transforms */}
                <div
                  className={`${sticker.rotation} hover:rotate-0 transition-transform duration-300 h-full`}
                >
                  <GlassCard
                    hoverLift={false}
                    className="p-6 h-full flex flex-col justify-between border-dashed border-white/15 bg-surface/75 select-none"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-full bg-void/80 border border-border-subtle flex items-center justify-center mb-4">
                        <Icon className={`w-5 h-5 ${sticker.accent}`} />
                      </div>
                      <h3 className="font-heading text-xl font-bold text-primary mb-2">
                        {sticker.title}
                      </h3>
                      <p className="text-sm text-secondary leading-relaxed">
                        {sticker.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-border-subtle flex justify-end">
                      <span className="font-hand text-xl text-amber">{sticker.note}</span>
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
