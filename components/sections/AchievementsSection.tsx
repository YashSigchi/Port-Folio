'use client';

import React from 'react';
import { useReducedMotion } from 'framer-motion';
import { Award, Code2, ExternalLink, GraduationCap, Trophy } from 'lucide-react';
import { profile } from '@/data/profile';
import { certifications } from '@/data/certifications';
import { problemSolving } from '@/data/problemSolving';
import { GlassCard } from '@/components/ui/GlassCard';
import { CountUp } from '@/components/ui/CountUp';
import { Chip } from '@/components/ui/Chip';

export function AchievementsSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section id="achievements" className="section-padding bg-deep relative overflow-hidden">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-indigo bg-indigo/10 border border-indigo/25 px-3 py-1 rounded-pill">
            Academic &amp; Problem Solving
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] text-primary mt-4">
            Credentials &amp; <span className="text-gradient-cosmic">benchmarks.</span>
          </h2>
        </div>

        {/* Animated Stat Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {/* CGPA */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-muted">
                VIT Chennai CGPA
              </span>
              <GraduationCap className="w-5 h-5 text-indigo" />
            </div>
            <p className="font-heading text-3xl sm:text-4xl font-bold text-primary">
              <CountUp value={8.72} decimals={2} suffix="/10" />
            </p>
            <p className="text-xs text-secondary mt-2">{profile.degree}</p>
          </GlassCard>

          {/* JEE Main */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-muted">
                JEE Main
              </span>
              <Trophy className="w-5 h-5 text-amber" />
            </div>
            <p className="font-heading text-3xl sm:text-4xl font-bold text-primary">
              <CountUp value={94.8} decimals={1} suffix="%ile" />
            </p>
            <p className="text-xs text-secondary mt-2">National Engineering Entrance</p>
          </GlassCard>

          {/* Class XII */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-muted">
                Class XII (PCM)
              </span>
              <Award className="w-5 h-5 text-cyan" />
            </div>
            <p className="font-heading text-3xl sm:text-4xl font-bold text-primary">
              <CountUp value={93} suffix="%" />
            </p>
            <p className="text-xs text-secondary mt-2">Maheshwari Public School, Jaipur</p>
          </GlassCard>

          {/* LeetCode */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-3">
              <a
                href={problemSolving.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs uppercase tracking-wider text-indigo hover:underline inline-flex items-center gap-1"
              >
                <span>LeetCode Solved</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <Code2 className="w-5 h-5 text-success" />
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-heading text-3xl sm:text-4xl font-bold text-primary">
                <CountUp value={problemSolving.totalSolved} />
              </p>
              <Chip variant="amber">Top SQL 50</Chip>
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs font-mono">
              <span className="text-success">{problemSolving.easy} Easy</span>
              <span className="text-amber">{problemSolving.medium} Med</span>
              <span className="text-danger">{problemSolving.hard} Hard</span>
            </div>
            <p className="text-[11px] text-muted mt-1">
              {problemSolving.submissionsPastYear} submissions in the past year
            </p>
          </GlassCard>
        </div>

        {/* Certifications Marquee / Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">
              Certifications &amp; Simulations
            </p>
          </div>

          {prefersReducedMotion ? (
            /* Static wrapped grid under reduced motion */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.map((cert) => (
                <GlassCard key={cert.title} className="p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      {cert.issuer ? (
                        <span className="font-mono text-xs text-indigo">{cert.issuer}</span>
                      ) : (
                        <span className="font-mono text-xs text-muted">Certificate</span>
                      )}
                      <span className="font-mono text-xs text-muted">{cert.year}</span>
                    </div>
                    <h3 className="font-heading font-semibold text-base text-primary">
                      {cert.title}
                    </h3>
                  </div>
                  {cert.verifyUrl && (
                    <a
                      href={cert.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-cyan hover:underline"
                    >
                      <span>Verify credential</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </GlassCard>
              ))}
            </div>
          ) : (
            /* Infinite Marquee that pauses on hover */
            <div className="group relative overflow-hidden py-2">
              <div className="flex w-max gap-5 will-change-transform animate-[marquee_34s_linear_infinite] group-hover:[animation-play-state:paused]">
                {[...certifications, ...certifications].map((cert, idx) => (
                  <GlassCard
                    key={`${cert.title}-${idx}`}
                    hoverLift={false}
                    className="w-80 shrink-0 p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        {cert.issuer ? (
                          <span className="font-mono text-xs text-indigo">{cert.issuer}</span>
                        ) : (
                          <span className="font-mono text-xs text-muted">Simulation</span>
                        )}
                        <span className="font-mono text-xs text-muted">{cert.year}</span>
                      </div>
                      <h3 className="font-heading font-semibold text-base text-primary">
                        {cert.title}
                      </h3>
                    </div>

                    {cert.verifyUrl && (
                      <a
                        href={cert.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-cyan hover:underline"
                      >
                        <span>Verify</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </GlassCard>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
