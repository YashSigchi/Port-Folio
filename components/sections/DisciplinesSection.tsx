'use client';

import React, { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { DiamondChipList } from '@/components/ui/Chip';

interface DisciplineItem {
  number: string;
  title: string;
  description: string;
  chips: string[];
}

const DISCIPLINES: DisciplineItem[] = [
  {
    number: '01',
    title: 'Backend & Systems',
    description:
      'Relational schema design, RBAC, action-level audit logging, and multi-stage approval workflows engineered for 100+ users.',
    chips: ['Spring Boot', 'Node/Express', 'PostgreSQL', 'Prisma'],
  },
  {
    number: '02',
    title: 'AI / ML Engineering',
    description:
      'Multi-label neural inference on real healthcare data paired with local perturbation, attribution, and counterfactual explainability.',
    chips: ['PyTorch', 'LIME', 'Integrated Gradients', 'FastAPI'],
  },
  {
    number: '03',
    title: 'Agentic AI & RAG',
    description:
      'Stateful multi-agent orchestration grounded in vector documentation search, persistent session memory, and human-in-the-loop safety gates.',
    chips: ['LangGraph', 'FAISS', 'RAG', 'LLM APIs'],
  },
  {
    number: '04',
    title: 'Full-Stack & DevOps',
    description:
      'Responsive TypeScript interfaces shipped to Linux servers with multi-container Docker Compose, Nginx reverse proxies, and TLS.',
    chips: ['React', 'TypeScript', 'Docker', 'Nginx'],
  },
];

function TiltDisciplineCard({ item }: { item: DisciplineItem }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const smoothX = useSpring(x, { stiffness: 180, damping: 18 });
  const smoothY = useSpring(y, { stiffness: 180, damping: 18 });

  // Max 8 deg tilt
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(normX);
    y.set(normY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        prefersReducedMotion
          ? undefined
          : {
              rotateX,
              rotateY,
              transformPerspective: 900,
            }
      }
      className="h-full"
    >
      <GlassCard hoverLift={false} className="p-6 sm:p-8 h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-5">
            <span className="font-mono text-xs uppercase tracking-widest text-indigo bg-indigo/10 border border-indigo/25 px-3 py-1 rounded-pill">
              {item.number}
            </span>
          </div>

          <h3 className="font-heading text-2xl font-bold text-primary mb-3">{item.title}</h3>
          <p className="text-sm sm:text-base text-secondary leading-relaxed mb-6">
            {item.description}
          </p>
        </div>

        <div className="pt-4 border-t border-border-subtle">
          <DiamondChipList items={item.chips} />
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function DisciplinesSection() {
  return (
    <section id="disciplines" className="section-padding bg-void relative overflow-hidden">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="05"
          label="What I do"
          title="Four core disciplines."
          highlightWord="disciplines."
          subtitle="Bridging production backend architecture with explainable machine learning and stateful agent workflows."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {DISCIPLINES.map((item) => (
            <TiltDisciplineCard key={item.number} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
