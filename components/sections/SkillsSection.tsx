'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Sparkles, Layers } from 'lucide-react';
import { skills, SKILL_CATEGORIES, type SkillCategory, type SkillItem } from '@/data/skills';
import { GlassCard } from '@/components/ui/GlassCard';
import { Chip } from '@/components/ui/Chip';

interface SkillsSectionProps {
  constellationSlot?: React.ReactNode;
}

export function SkillsSection({ constellationSlot }: SkillsSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState<'All' | SkillCategory>('All');
  const [activeSkill, setActiveSkill] = useState<SkillItem | null>(skills[0]);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');

  const filteredSkills =
    selectedCategory === 'All'
      ? skills
      : skills.filter((s) => s.category === selectedCategory);

  return (
    <section id="skills" className="section-padding bg-deep relative overflow-hidden">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.12em] text-indigo bg-indigo/10 border border-indigo/25 px-3 py-1 rounded-pill">
              Technical Stack &amp; Tooling
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] text-primary mt-4">
              Every tool mapped to <span className="text-gradient-cosmic">real work.</span>
            </h2>
            <p className="mt-3 text-base text-secondary max-w-2xl">
              Click or focus any skill chip to inspect the exact internships, enterprise systems, or
              research builds where it was used. No arbitrary percentage bars.
            </p>
          </div>

          {/* Desktop 2D / 3D Toggle when constellationSlot is supplied (Stage 5) */}
          {constellationSlot && !prefersReducedMotion && (
            <div className="hidden lg:inline-flex items-center p-1 rounded-pill bg-void/80 border border-border-subtle self-start md:self-end">
              <button
                type="button"
                onClick={() => setViewMode('2d')}
                aria-pressed={viewMode === '2d'}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-pill font-mono text-xs uppercase tracking-wider transition-colors ${
                  viewMode === '2d'
                    ? 'bg-indigo text-void font-semibold'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>2D Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('3d')}
                aria-pressed={viewMode === '3d'}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-pill font-mono text-xs uppercase tracking-wider transition-colors ${
                  viewMode === '3d'
                    ? 'bg-indigo text-void font-semibold'
                    : 'text-secondary hover:text-primary'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Switch to 3D view</span>
              </button>
            </div>
          )}
        </div>

        {/* 3D Constellation View (Only mounts when toggled on desktop in Stage 5) */}
        {viewMode === '3d' && constellationSlot ? (
          <div className="mb-10">{constellationSlot}</div>
        ) : (
          <>
            {/* Category Filter Tabs */}
            <div
              role="group"
              aria-label="Filter skills by category"
              className="flex flex-wrap gap-2 mb-8"
            >
              {(['All', ...SKILL_CATEGORIES] as const).map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    aria-pressed={isActive}
                    className={`px-4 py-2 rounded-pill font-mono text-xs uppercase tracking-wider border transition-all ${
                      isActive
                        ? 'bg-indigo text-void border-indigo font-semibold'
                        : 'bg-glass text-secondary border-border-subtle hover:border-border-glow hover:text-primary'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Main Grid: Left Interactive Tech Chips (8 cols) + Right "Used in" Inspector Popover Card (4 cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8">
                <motion.div
                  layout={!prefersReducedMotion}
                  className="flex flex-wrap gap-2.5"
                >
                  {filteredSkills.map((skill) => {
                    const isSelected = activeSkill?.name === skill.name;
                    return (
                      <button
                        key={skill.name}
                        type="button"
                        onClick={() => setActiveSkill(skill)}
                        onFocus={() => setActiveSkill(skill)}
                        aria-pressed={isSelected}
                        className={`group inline-flex items-center gap-2 px-4 py-2.5 rounded-pill border font-mono text-xs sm:text-sm transition-all ${
                          isSelected
                            ? 'bg-indigo/20 border-indigo text-primary shadow-[0_0_20px_rgba(129,140,248,0.3)]'
                            : 'bg-glass border-border-subtle text-secondary hover:border-border-glow hover:text-primary'
                        }`}
                      >
                        <span
                          className={`text-xs transition-colors ${
                            isSelected ? 'text-cyan' : 'text-indigo/70 group-hover:text-indigo'
                          }`}
                          aria-hidden="true"
                        >
                          ◆
                        </span>
                        <span>{skill.name}</span>
                        <span className="text-[10px] text-muted">({skill.usedIn.length})</span>
                      </button>
                    );
                  })}
                </motion.div>
              </div>

              {/* Right Column: Accessible Popover / Inspector Card */}
              <div className="lg:col-span-4">
                <GlassCard
                  hoverLift={false}
                  className="p-6 border-indigo/30 sticky top-28"
                  aria-live="polite"
                >
                  <AnimatePresence mode="wait">
                    {activeSkill ? (
                      <motion.div
                        key={activeSkill.name}
                        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <Chip variant="indigo">{activeSkill.category}</Chip>
                          <span className="font-mono text-xs text-muted"> Evidence-backed</span>
                        </div>

                        <h3 className="font-heading text-2xl font-bold text-primary mb-4">
                          {activeSkill.name}
                        </h3>

                        <p className="font-mono text-xs uppercase tracking-wider text-muted mb-3">
                          Used in:
                        </p>
                        <ul className="space-y-2">
                          {activeSkill.usedIn.map((projectRef) => (
                            <li
                              key={projectRef}
                              className="flex items-start gap-2.5 text-sm text-secondary"
                            >
                              <span className="text-cyan font-mono text-xs mt-1" aria-hidden="true">
                                ◆
                              </span>
                              <span>{projectRef}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ) : (
                      <p className="text-sm text-secondary">
                        Select or focus a technology chip to see where it was applied.
                      </p>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
