'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Github, Linkedin, Mail, FileText, ArrowDown, Sparkles } from 'lucide-react';
import { profile } from '@/data/profile';
import { Button } from '@/components/ui/Button';
import { SplitText } from '@/components/ui/SplitText';
import { CountUp } from '@/components/ui/CountUp';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { HandUnderline } from '@/components/ui/HandUnderline';
import { HandArrow } from '@/components/ui/HandArrow';
import { GlassCard } from '@/components/ui/GlassCard';

const ROTATING_TAGLINES = [
  'Backend systems that ship to production',
  'RAG & multi-agent AI workflows',
  'Explainable ML for healthcare data',
];

interface HeroSectionProps {
  sceneSlot?: React.ReactNode;
}

export function HeroSection({ sceneSlot }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % ROTATING_TAGLINES.length);
    }, 3400);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-between pt-28 pb-14 md:pt-36 md:pb-20 overflow-hidden bg-nebula"
    >
      {/* Background HeroScene Slot (Static CSS Nebula Orb fallback until Stage 5 replaces with WebGL) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center overflow-hidden"
      >
        {sceneSlot ? (
          sceneSlot
        ) : (
          <div className="relative w-[420px] h-[420px] md:w-[620px] md:h-[620px] opacity-60">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo/30 via-magenta/25 to-cyan/25 blur-3xl animate-pulse" />
            <div className="absolute inset-16 rounded-full border border-indigo/20" />
            <div className="absolute inset-32 rounded-full border border-cyan/20" />
          </div>
        )}
      </div>

      <div className="relative z-10 mx-auto max-w-container w-full px-4 sm:px-6 lg:px-8">
        {/* Top Row: Eyebrow + Availability Chip */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <span className="font-mono text-xs uppercase tracking-[0.12em] text-indigo bg-indigo/10 border border-indigo/25 px-3.5 py-1.5 rounded-pill">
            [01] SOFTWARE ENGINEER · AI/ML ENGINEER
          </span>

          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-pill bg-success/10 border border-success/30 text-xs font-mono text-success">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span>{profile.availability}</span>
          </div>
        </div>

        {/* Main Grid: Left Hero Copy & CTA / Right Polaroid & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <h1 className="hero-h1 text-primary">
              <SplitText text="I build" />{' '}
              <span className="relative inline-block">
                <span className="text-gradient-cosmic">backend systems</span>
                <HandUnderline className="absolute -bottom-2 left-0 text-indigo" />
              </span>{' '}
              <SplitText text="that ship and" delay={0.15} />{' '}
              <span className="text-gradient-cosmic">AI that explains itself.</span>
            </h1>

            {/* Rotating Tagline */}
            <div className="h-8 flex items-center gap-2 font-mono text-xs sm:text-sm text-cyan">
              <Sparkles className="w-4 h-4 shrink-0 text-amber" aria-hidden="true" />
              <div className="relative overflow-hidden h-6 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={taglineIndex}
                    initial={prefersReducedMotion ? { opacity: 1 } : { y: 18, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { y: -18, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block"
                  >
                    {ROTATING_TAGLINES[taglineIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            <p className="text-base sm:text-lg md:text-xl text-secondary max-w-2xl leading-relaxed">
              Final-year B.Tech CSE (AI &amp; ML) at VIT. I&apos;ve shipped an enterprise
              requisition system for 100+ users, built RAG and multi-agent workflows, and trained
              explainable ML models on real healthcare data.
            </p>

            {/* Primary & Ghost CTAs + Social Icon Row */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <MagneticButton>
                <Button href="#contact" variant="primary" size="lg">
                  Start a conversation
                </Button>
              </MagneticButton>

              <MagneticButton>
                <Button href="#work" variant="ghost" size="lg">
                  Selected work
                </Button>
              </MagneticButton>

              <div className="flex items-center gap-2.5 sm:ml-2">
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  className="p-3 rounded-full bg-glass border border-border-subtle hover:border-border-glow text-secondary hover:text-primary transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  className="p-3 rounded-full bg-glass border border-border-subtle hover:border-border-glow text-secondary hover:text-primary transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  aria-label="Send email"
                  className="p-3 rounded-full bg-glass border border-border-subtle hover:border-border-glow text-secondary hover:text-primary transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a
                  href={profile.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open Resume PDF"
                  className="p-3 rounded-full bg-glass border border-border-subtle hover:border-border-glow text-secondary hover:text-primary transition-colors"
                >
                  <FileText className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Tilted Polaroid Portrait with Handwritten Note */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-end relative">
            <div className="relative group">
              {/* Handwritten margin note + HandArrow */}
              <div className="hidden sm:flex flex-col items-start absolute -left-36 -top-8 z-20 pointer-events-none select-none">
                <span className="font-hand text-2xl text-amber -rotate-3">
                  hi, that&apos;s me! ✨
                </span>
                <HandArrow className="w-24 h-16 text-lavender -mt-1 ml-4" />
              </div>

              {/* Tilted Polaroid Card (-3 deg) */}
              <div className="w-64 sm:w-72 rounded-panel bg-surface/90 border border-border-subtle p-3.5 pb-5 shadow-[0_24px_60px_rgba(0,0,0,0.65)] -rotate-3 hover:rotate-0 transition-transform duration-500 ease-cosmic">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-gradient-to-br from-indigo/30 via-violet/25 to-magenta/30 border border-border-subtle flex items-center justify-center">
                  {!imgError ? (
                    <Image
                      src="/images/yashhh.jpg"
                      alt="Portrait of Yash Sigchi"
                      fill
                      sizes="(max-width: 768px) 256px, 288px"
                      className="object-cover"
                      onError={() => setImgError(true)}
                      priority
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-6 select-none">
                      <div className="w-20 h-20 rounded-full bg-void/60 border border-border-glow flex items-center justify-center mb-3 shadow-btn-glow">
                        <span className="font-heading font-bold text-3xl text-gradient-cosmic">
                          YS
                        </span>
                      </div>
                      <span className="font-heading text-sm font-semibold text-primary">
                        {profile.name}
                      </span>
                      <span className="font-mono text-[11px] text-secondary mt-0.5">
                        {profile.location}
                      </span>
                    </div>
                  )}

                  {/* 2026 Stamp */}
                  <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-pill bg-void/80 border border-amber/40 font-mono text-[11px] font-semibold text-amber">
                    2026
                  </span>
                </div>

                <div className="mt-3.5 flex items-center justify-between px-1">
                  <div>
                    <p className="font-heading font-semibold text-sm text-primary">
                      {profile.name}
                    </p>
                    <p className="font-mono text-[11px] text-muted">VIT Chennai · CSE (AI &amp; ML)</p>
                  </div>
                  <span className="font-hand text-xl text-lavender rotate-2">ship it ✨</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CountUp Stats Row */}
        <div className="mt-14 md:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {profile.stats.map((stat) => (
            <GlassCard key={stat.label} className="p-5 sm:p-6">
              <p className="font-heading text-3xl sm:text-4xl font-bold text-primary tracking-tight">
                <CountUp
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals ?? 0}
                />
              </p>
              <p className="mt-1.5 text-xs sm:text-sm text-secondary font-sans">{stat.label}</p>
            </GlassCard>
          ))}
        </div>

        {/* Scroll Cue */}
        <div className="mt-10 flex justify-center">
          <a
            href="#about"
            aria-label="Scroll to About section"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted hover:text-primary transition-colors"
          >
            <span>Scroll to explore</span>
            <ArrowDown className="w-3.5 h-3.5 text-indigo animate-bounce" />
          </a>
        </div>
      </div>
    </section>
  );
}
