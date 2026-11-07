'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { profile } from '@/data/profile';
import { experiences } from '@/data/experience';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { DiamondChipList, Chip } from '@/components/ui/Chip';
import { GlassCard } from '@/components/ui/GlassCard';
import { HandArrow } from '@/components/ui/HandArrow';

type AboutTabId = 'bio' | 'story' | 'work';

const TABS: { id: AboutTabId; label: string }[] = [
  { id: 'bio', label: 'Main bio' },
  { id: 'story', label: 'Story' },
  { id: 'work', label: 'Work' },
];

const PRINCIPLES = [
  {
    number: '01',
    title: 'Ship it for real',
    description:
      'Code in a repo is a draft. Deploying with Docker, Nginx, TLS, and real users on the floor is where engineering begins.',
    note: 'prod is the real test!',
    tilt: '-rotate-1',
    showArrow: true,
  },
  {
    number: '02',
    title: 'Design for the audit',
    description:
      'Access control, RBAC, and action-level audit trails are first-class citizens—not afterthoughts bolted on before launch.',
    note: 'future-me says thanks',
    tilt: 'rotate-1',
    showArrow: false,
  },
  {
    number: '03',
    title: 'Explain the model',
    description:
      'Predictions on healthcare or operational data need LIME, Integrated Gradients, or grounded RAG citations so humans can trust them.',
    note: 'no black boxes.',
    tilt: '-rotate-1',
    showArrow: true,
  },
  {
    number: '04',
    title: 'Build with the team',
    description:
      'Whether as a founding engineer or enterprise intern, clear REST contracts and reliable handoffs make everyone faster.',
    note: 'us, not me.',
    tilt: 'rotate-1',
    showArrow: false,
  },
];

export function AboutSection() {
  const [activeTab, setActiveTab] = useState<AboutTabId>('bio');
  const prefersReducedMotion = useReducedMotion();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = TABS.findIndex((t) => t.id === activeTab);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = TABS[(currentIndex + 1) % TABS.length];
      setActiveTab(next.id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = TABS[(currentIndex - 1 + TABS.length) % TABS.length];
      setActiveTab(prev.id);
    }
  };

  return (
    <section id="about" className="section-padding bg-deep relative overflow-hidden">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeader
            index="02"
            label="Profile"
            title="Yash Sigchi."
            highlightWord="Yash Sigchi."
            className="mb-0"
          />
          <DiamondChipList items={['Backend', 'AI/ML', 'Full-Stack']} />
        </div>

        {/* Main Profile Grid: Left Tabbed Card (7 cols) + Right 4-Up Stat Grid (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Tabbed Bio / Story / Work Card */}
          <GlassCard className="lg:col-span-7 p-6 sm:p-8" hoverLift={false}>
            {/* Accessible ARIA Tablist */}
            <div
              role="tablist"
              aria-label="About Yash Sigchi tabs"
              onKeyDown={handleKeyDown}
              className="inline-flex items-center gap-1 p-1 rounded-pill bg-void/70 border border-border-subtle mb-6"
            >
              {TABS.map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`tab-${tab.id}`}
                    role="tab"
                    type="button"
                    aria-selected={isSelected}
                    aria-controls={`panel-${tab.id}`}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-4 py-1.5 rounded-pill font-mono text-xs uppercase tracking-wider transition-colors ${
                      isSelected ? 'text-primary' : 'text-secondary hover:text-primary'
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="about-tab-pill"
                        className="absolute inset-0 rounded-pill bg-indigo/20 border border-indigo/40"
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Panels */}
            <div className="min-h-[220px]">
              <AnimatePresence mode="wait">
                {activeTab === 'bio' && (
                  <motion.div
                    key="bio"
                    id="panel-bio"
                    role="tabpanel"
                    aria-labelledby="tab-bio"
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4 text-secondary text-base sm:text-lg leading-relaxed"
                  >
                    <p>
                      I&apos;m a final-year Computer Science &amp; Engineering (AI &amp; ML)
                      undergraduate at <strong className="text-primary">{profile.university}</strong>{' '}
                      ({profile.years}, CGPA {profile.cgpa}), originally from{' '}
                      <strong className="text-primary">{profile.location}</strong>.
                    </p>
                    <p>
                      I care deeply about{' '}
                      <span className="text-primary font-medium">
                        the unglamorous parts that make software real: access control, audit trails,
                        deployment and explainability
                      </span>
                      . I like owning work end to end—from designing relational schemas and REST
                      contracts to shipping containerized builds and explaining model predictions.
                    </p>
                  </motion.div>
                )}

                {activeTab === 'story' && (
                  <motion.div
                    key="story"
                    id="panel-story"
                    role="tabpanel"
                    aria-labelledby="tab-story"
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4 text-secondary text-base sm:text-lg leading-relaxed"
                  >
                    <p>
                      I started with hands-on hobby builds—real-time WebRTC video/text chat apps (
                      <strong className="text-primary">DilKeTaar</strong>) and a multilingual
                      AI-powered chat app (<strong className="text-primary">BhashaBridge</strong>)—to
                      understand how packets, sockets, and APIs behave under the hood.
                    </p>
                    <p>
                      That foundation led to co-developing a climate transit optimizer at{' '}
                      <strong className="text-primary">1M1B</strong>, building the flagship platform
                      as a founding engineer intern at{' '}
                      <strong className="text-primary">Tachyon Robotics</strong>, and shipping a
                      production Tool Room Requisition System for{' '}
                      <strong className="text-primary">100+ users at NBC Bearings</strong>. Now,
                      I&apos;m combining production backend engineering with stateful LangGraph
                      agents, FAISS RAG, explainable healthcare ML, and cloud data engineering.
                    </p>
                  </motion.div>
                )}

                {activeTab === 'work' && (
                  <motion.div
                    key="work"
                    id="panel-work"
                    role="tabpanel"
                    aria-labelledby="tab-work"
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="divide-y divide-border-subtle"
                  >
                    {experiences.map((exp) => (
                      <div
                        key={exp.id}
                        className="py-3.5 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                      >
                        <div>
                          <p className="font-heading font-semibold text-primary text-base">
                            {exp.role}
                          </p>
                          <p className="text-sm text-secondary">{exp.company}</p>
                        </div>
                        <span className="font-mono text-xs text-indigo shrink-0">{exp.dates}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Currently Learning Strip */}
            <div className="mt-8 pt-6 border-t border-border-subtle flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-muted mr-2">
                Currently learning:
              </span>
              {profile.learningNow.map((item) => (
                <Chip key={item} variant="indigo">
                  {item}
                </Chip>
              ))}
            </div>
          </GlassCard>

          {/* 4-Up Stat Grid */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <GlassCard className="p-6">
              <span className="font-mono text-xs uppercase tracking-wider text-muted">
                Graduating
              </span>
              <p className="font-heading text-3xl font-bold text-primary mt-2">2027</p>
              <p className="text-xs text-secondary mt-1">B.Tech CSE (AI &amp; ML), VIT Chennai</p>
            </GlassCard>

            <GlassCard className="p-6">
              <span className="font-mono text-xs uppercase tracking-wider text-muted">
                Experience
              </span>
              <p className="font-heading text-3xl font-bold text-primary mt-2">3 Internships</p>
              <p className="text-xs text-secondary mt-1">NBC Bearings · Tachyon · 1M1B</p>
            </GlassCard>

            <GlassCard className="p-6">
              <span className="font-mono text-xs uppercase tracking-wider text-muted">
                Academic Standing
              </span>
              <p className="font-heading text-3xl font-bold text-primary mt-2">8.72 CGPA</p>
              <p className="text-xs text-secondary mt-1">
                93% Class XII · 94.8%ile JEE Main
              </p>
            </GlassCard>

            <GlassCard className="p-6 border-success/30">
              <span className="font-mono text-xs uppercase tracking-wider text-success">
                Availability
              </span>
              <p className="font-heading text-sm font-semibold text-primary mt-2 leading-snug">
                {profile.availability}
              </p>
            </GlassCard>
          </div>
        </div>

        {/* Four Principle Cards with Handwritten Notes */}
        <div className="mt-14">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted mb-6">
            Engineering Principles
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRINCIPLES.map((p) => (
              <GlassCard
                key={p.number}
                className={`p-6 flex flex-col justify-between transition-transform duration-300 ${p.tilt} hover:rotate-0`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-indigo">[{p.number}]</span>
                    {p.showArrow && (
                      <HandArrow className="w-12 h-8 text-lavender/70 -mr-2 -mt-2" />
                    )}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-primary mb-2">{p.title}</h3>
                  <p className="text-sm text-secondary leading-relaxed">{p.description}</p>
                </div>

                <div className="mt-6 pt-3 border-t border-border-subtle flex items-center justify-end">
                  <span className="font-hand text-2xl text-lavender -rotate-2">{p.note}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
