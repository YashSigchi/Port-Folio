'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import {
  featuredProjects,
  experimentProjects,
  PROJECT_FILTER_TAGS,
  type ProjectFilterTag,
  type ProjectItem,
} from '@/data/projects';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { Chip } from '@/components/ui/Chip';

export function WorkSection() {
  const prefersReducedMotion = useReducedMotion();
  const [hoveredProject, setHoveredProject] = useState<ProjectItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<ProjectFilterTag>('All');

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 220, damping: 24 });
  const smoothY = useSpring(pointerY, { stiffness: 220, damping: 24 });

  const handleRowPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    pointerX.set(e.clientX + 24);
    pointerY.set(e.clientY - 80);
  };

  const filteredExperiments =
    activeFilter === 'All'
      ? experimentProjects
      : experimentProjects.filter((p) => p.tags.includes(activeFilter));

  return (
    <section
      id="work"
      onPointerMove={handleRowPointerMove}
      className="section-padding bg-deep relative overflow-hidden"
    >
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="04"
          label="Selected work"
          title="Systems engineered end to end."
          highlightWord="end to end."
          subtitle="Six featured builds spanning enterprise manufacturing workflows, agentic RAG systems, and explainable pharmacovigilance ML."
        />

        {/* Numbered 01–06 Featured Work List */}
        <div className="divide-y divide-border-subtle border-y border-border-subtle">
          {featuredProjects.map((project, index) => {
            const numberLabel = `0${index + 1}`;
            return (
              <div
                key={project.slug}
                onMouseEnter={() => setHoveredProject(project)}
                onMouseLeave={() => setHoveredProject(null)}
                className="group relative py-7 sm:py-9 transition-colors hover:bg-white/[0.02] px-2 sm:px-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left: Number + Hover Text-Swap Title + Summary */}
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-3 font-mono text-xs text-indigo">
                      <span>{numberLabel}</span>
                      <span>·</span>
                      <span className="uppercase tracking-wider">{project.category}</span>
                      <span>·</span>
                      <span className="text-muted">{project.year}</span>
                    </div>

                    <Link
                      href={`/projects/${project.slug}`}
                      data-cursor="View"
                      className="group/title block focus-visible:outline-none"
                    >
                      {/* Box sizes to the (possibly wrapped) title; the gradient copy is overlaid
                          on the exact same box and slides in from below on title hover/focus. */}
                      <div className="relative overflow-hidden">
                        <h3 className="pb-1 font-heading text-2xl sm:text-3xl font-bold text-primary leading-tight transition-transform duration-500 ease-cosmic group-hover/title:-translate-y-full group-focus-visible/title:-translate-y-full">
                          {project.title}
                        </h3>
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 pb-1 translate-y-full font-heading text-2xl sm:text-3xl font-bold leading-tight transition-transform duration-500 ease-cosmic group-hover/title:translate-y-0 group-focus-visible/title:translate-y-0"
                        >
                          <span className="text-gradient-cosmic">{project.title}</span>
                        </span>
                      </div>
                    </Link>

                    <p className="text-sm sm:text-base text-secondary leading-relaxed">
                      {project.summary}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.stack.map((tech) => (
                        <Chip key={tech}>{tech}</Chip>
                      ))}
                    </div>
                  </div>

                  {/* Right: Action Links + "View project" */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {project.links.repo && (
                      <a
                        href={project.links.repo}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} GitHub repository`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-pill bg-glass border border-border-subtle hover:border-border-glow text-xs font-mono text-secondary hover:text-primary transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Repo</span>
                      </a>
                    )}
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.title} Live Demo`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-pill bg-glass border border-border-subtle hover:border-border-glow text-xs font-mono text-cyan hover:text-primary transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live</span>
                      </a>
                    )}
                    <Link
                      href={`/projects/${project.slug}`}
                      data-cursor="View"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill bg-surface border border-border-subtle group-hover:border-indigo/60 text-xs font-mono uppercase tracking-wider text-primary transition-all"
                    >
                      <span>View project</span>
                      <ArrowUpRight className="w-4 h-4 text-indigo transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Cursor-Following Preview Card (Desktop Only) */}
        <AnimatePresence>
          {hoveredProject && !prefersReducedMotion && (
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              style={{ x: smoothX, y: smoothY }}
              className="hidden lg:flex pointer-events-none fixed top-0 left-0 z-40 w-72 h-44 rounded-panel p-5 flex-col justify-between border border-white/20 shadow-2xl overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-90"
                style={{ background: hoveredProject.previewGradient }}
              />
              <div className="absolute inset-0 bg-void/35 backdrop-blur-[2px]" />
              <div className="relative z-10 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-pill bg-void/70 text-primary">
                  {hoveredProject.category}
                </span>
                <span className="font-mono text-xs text-primary/90">{hoveredProject.year}</span>
              </div>
              <div className="relative z-10">
                <p className="font-heading font-bold text-lg text-primary leading-snug">
                  {hoveredProject.title}
                </p>
                <p className="font-mono text-[11px] text-primary/80 mt-1 truncate">
                  {hoveredProject.stack.slice(0, 4).join(' · ')}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* More Experiments Filterable Grid */}
        <div className="mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-indigo">
                Archive &amp; Research
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-bold text-primary mt-1">
                More experiments &amp; lab builds
              </h3>
            </div>

            {/* Filter Chips */}
            <div
              role="group"
              aria-label="Filter experiments by category"
              className="flex flex-wrap gap-2"
            >
              {PROJECT_FILTER_TAGS.map((tag) => {
                const active = activeFilter === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setActiveFilter(tag)}
                    aria-pressed={active}
                    className={`px-3.5 py-1.5 rounded-pill font-mono text-xs uppercase tracking-wider border transition-all ${
                      active
                        ? 'bg-indigo text-void border-indigo font-semibold'
                        : 'bg-glass text-secondary border-border-subtle hover:border-border-glow hover:text-primary'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <motion.div
            layout={!prefersReducedMotion}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredExperiments.map((exp) => (
                <motion.div
                  key={exp.slug}
                  layout={!prefersReducedMotion}
                  initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  <GlassCard className="p-6 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="font-mono text-xs text-indigo">{exp.category}</span>
                        <span className="font-mono text-xs text-muted">{exp.year}</span>
                      </div>
                      <Link
                        href={`/projects/${exp.slug}`}
                        className="group/title inline-flex items-center gap-1.5"
                      >
                        <h4 className="font-heading text-lg font-bold text-primary group-hover/title:text-indigo transition-colors">
                          {exp.title}
                        </h4>
                        <ArrowUpRight className="w-4 h-4 text-muted group-hover/title:text-indigo shrink-0" />
                      </Link>
                      <p className="mt-2 text-sm text-secondary leading-relaxed">{exp.summary}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-border-subtle">
                      {exp.stack.map((tech) => (
                        <Chip key={tech}>{tech}</Chip>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
