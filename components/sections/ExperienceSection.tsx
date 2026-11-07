'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ChevronDown, ArrowUpRight, Briefcase } from 'lucide-react';
import { experiences } from '@/data/experience';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { Chip } from '@/components/ui/Chip';

export function ExperienceSection() {
  // Expand all by default so content is immediately accessible even without interaction
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'nbc-bearings': true,
    'tachyon-robotics': true,
    '1m1b': true,
  });
  const prefersReducedMotion = useReducedMotion();

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="experience" className="section-padding bg-void relative overflow-hidden">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="03"
          label="Experience"
          title="Where I've shipped production code."
          highlightWord="production code."
          subtitle="From founding-engineer frontend architecture to an 8-stage manufacturing requisition platform serving 100+ users."
        />

        {/* Vertical Glowing Timeline */}
        <div className="relative pl-6 sm:pl-10 before:content-[''] before:absolute before:top-3 before:bottom-3 before:left-[11px] sm:before:left-[19px] before:w-[2px] before:bg-gradient-to-b before:from-indigo before:via-magenta before:to-cyan/30">
          <div className="space-y-8">
            {experiences.map((exp, index) => {
              const isExpanded = !!expandedIds[exp.id];
              return (
                <motion.div
                  key={exp.id}
                  layout={!prefersReducedMotion}
                  className="relative"
                >
                  {/* Timeline Node Dot */}
                  <span
                    aria-hidden="true"
                    className="absolute -left-6 sm:-left-10 top-6 flex h-6 w-6 items-center justify-center rounded-full bg-void border-2 border-indigo shadow-[0_0_16px_rgba(129,140,248,0.7)]"
                  >
                    <span className="h-2 w-2 rounded-full bg-cyan" />
                  </span>

                  <GlassCard className="p-6 sm:p-8" hoverLift={false}>
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5 mb-1">
                          <span className="font-mono text-xs text-indigo">
                            0{index + 1} · {exp.dates}
                          </span>
                        </div>
                        <h3 className="font-heading text-xl sm:text-2xl font-bold text-primary">
                          {exp.role}
                        </h3>
                        <p className="text-base text-secondary font-medium flex items-center gap-2 mt-0.5">
                          <Briefcase className="w-4 h-4 text-indigo shrink-0" />
                          <span>{exp.company}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3 self-start md:self-center">
                        {exp.caseStudyHref && (
                          <Link
                            href={exp.caseStudyHref}
                            data-cursor="View"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-pill bg-indigo/15 border border-indigo/40 text-xs font-mono uppercase tracking-wider text-primary hover:bg-indigo/25 transition-colors"
                          >
                            <span>Read the case study</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-cyan" />
                          </Link>
                        )}

                        <button
                          type="button"
                          onClick={() => toggleExpand(exp.id)}
                          aria-expanded={isExpanded}
                          aria-controls={`exp-bullets-${exp.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-pill bg-glass border border-border-subtle hover:border-border-glow text-xs font-mono text-secondary hover:text-primary transition-colors"
                        >
                          <span>{isExpanded ? 'Hide' : 'Details'}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Stack Chips */}
                    <div className="flex flex-wrap gap-2 mt-5">
                      {exp.stack.map((tech) => (
                        <Chip key={tech} withDiamond>
                          {tech}
                        </Chip>
                      ))}
                    </div>

                    {/* Expandable Bullets */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          id={`exp-bullets-${exp.id}`}
                          initial={
                            prefersReducedMotion ? { opacity: 1 } : { height: 0, opacity: 0 }
                          }
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <ul className="mt-6 pt-5 border-t border-border-subtle space-y-3 text-sm sm:text-base text-secondary">
                            {exp.bullets.map((bullet, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <span
                                  className="text-indigo font-mono text-xs mt-1.5 select-none"
                                  aria-hidden="true"
                                >
                                  ◆
                                </span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
