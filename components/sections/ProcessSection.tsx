'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { DiamondChipList } from '@/components/ui/Chip';

interface ProcessStep {
  counter: string;
  title: string;
  copy: string;
  chips: string[];
  accentColor: string;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    counter: '01 / 04',
    title: 'Understand',
    copy: 'Map the real problem before writing code—clarifying operational bottlenecks, role boundaries, edge cases, and the underlying domain data model.',
    chips: ['Briefing', 'Edge cases', 'Data model'],
    accentColor: 'from-indigo/30 via-violet/20 to-transparent',
  },
  {
    counter: '02 / 04',
    title: 'Design',
    copy: 'Lock in relational ERDs, explicit REST API contracts, RBAC matrices, and multi-agent or ML state transitions so frontend and backend move in lockstep.',
    chips: ['ERD', 'REST contracts', 'Roles & permissions'],
    accentColor: 'from-violet/30 via-magenta/20 to-transparent',
  },
  {
    counter: '03 / 04',
    title: 'Build',
    copy: 'Ship clean, modular TypeScript, Java/Spring Boot, or Python/PyTorch modules with disciplined Git history, code reviews, and validation tests.',
    chips: ['Git', 'Code review', 'Testing'],
    accentColor: 'from-magenta/30 via-cyan/20 to-transparent',
  },
  {
    counter: '04 / 04',
    title: 'Ship & Harden',
    copy: 'Containerize with Docker Compose, configure Nginx and TLS, verify action-level audit logs, and validate model explanations under real load.',
    chips: ['Docker Compose', 'Nginx + TLS', 'Audit logs'],
    accentColor: 'from-cyan/30 via-indigo/20 to-transparent',
  },
];

function StickyStepCard({
  step,
  index,
  total,
}: {
  step: ProcessStep;
  index: number;
  total: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 0.94]);

  return (
    <motion.div
      ref={cardRef}
      style={
        prefersReducedMotion
          ? undefined
          : {
              scale,
              top: `${96 + index * 24}px`,
            }
      }
      className="md:sticky mb-8 last:mb-0 will-change-transform"
    >
      <GlassCard
        hoverLift={false}
        className="p-6 sm:p-10 bg-surface border border-border-subtle shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Copy (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-indigo bg-indigo/10 border border-indigo/30 px-3 py-1 rounded-pill">
                {step.counter}
              </span>
              <span className="font-mono text-xs text-muted">
                Step 0{index + 1} of 0{total}
              </span>
            </div>

            <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
              0{index + 1} {step.title}
            </h3>

            <p className="text-base sm:text-lg text-secondary leading-relaxed max-w-2xl">
              {step.copy}
            </p>

            <div className="pt-3">
              <DiamondChipList items={step.chips} />
            </div>
          </div>

          {/* Right CSS Abstract Illustration (4 cols) */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <div
              aria-hidden="true"
              className={`relative w-full h-44 rounded-panel bg-gradient-to-br ${step.accentColor} border border-border-subtle flex items-center justify-center overflow-hidden`}
            >
              {/* Geometric CSS shapes per step */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-indigo/40 animate-pulse" />
                <div
                  className="w-20 h-20 rounded-card border border-cyan/40 bg-void/80 flex items-center justify-center"
                  style={{ transform: `rotate(${index * 22.5}deg)` }}
                >
                  <span className="font-mono text-lg font-bold text-gradient-cosmic">
                    0{index + 1}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function ProcessSection() {
  return (
    <section id="process" className="section-padding bg-void relative">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="06"
          label="How I work"
          title="From schema to production."
          highlightWord="production."
          subtitle="A repeatable four-stage engineering rhythm designed for reliability, auditability, and clean handoffs."
        />

        <div className="relative">
          {PROCESS_STEPS.map((step, index) => (
            <StickyStepCard
              key={step.counter}
              step={step}
              index={index}
              total={PROCESS_STEPS.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
