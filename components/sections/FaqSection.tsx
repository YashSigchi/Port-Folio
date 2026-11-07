'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, FileText } from 'lucide-react';
import { profile } from '@/data/profile';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GlassCard } from '@/components/ui/GlassCard';

const FAQ_ITEMS = [
  {
    q: 'Are you currently open to internships or full-time roles?',
    a: profile.availability,
  },
  {
    q: 'What roles are you targeting?',
    a: 'Software Engineer, AI/ML Engineer, and Full-Stack Engineer roles (across India and remote).',
  },
  {
    q: 'What is the most substantial system you have shipped?',
    a: 'During my internship at NBC Bearings (CKA Birla Group), I built and deployed a production Tool Room Requisition System serving 100+ users across 4 roles (Requestor, Approver, Tool Room Operator, Admin) and an 8-stage approval workflow—complete with RBAC, action-level audit logging, automated email notifications, and Linux deployment via Docker Compose, Nginx, and TLS.',
  },
  {
    q: 'What is your strongest technical stack?',
    a: 'Java (Spring Boot), Python (FastAPI, PyTorch, LangGraph, FAISS), and React/TypeScript (Next.js, Node/Express) backed by PostgreSQL, Prisma, and Docker.',
  },
  {
    q: 'When do you graduate?',
    a: 'I graduate in 2027 with a B.Tech in Computer Science & Engineering (AI & ML) from Vellore Institute of Technology (VIT), Chennai (current CGPA: 8.72/10).',
  },
  {
    q: 'How can I reach you, and how fast do you respond?',
    a: `You can send a message directly through the contact form below or email me at ${profile.email}. I read every message and reply within 24 hours.`,
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const prefersReducedMotion = useReducedMotion();

  const toggleItem = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="section-padding bg-deep relative overflow-hidden">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <SectionHeader
            index="07"
            label="FAQ"
            title="Quick answers for recruiters."
            highlightWord="recruiters."
            className="mb-0"
          />

          <Link
            href="/resume"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill bg-glass border border-border-subtle hover:border-border-glow font-mono text-xs uppercase tracking-wider text-primary transition-colors self-start md:self-end"
          >
            <FileText className="w-4 h-4 text-indigo" />
            <span>Read my resume →</span>
          </Link>
        </div>

        <div className="max-w-3xl space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <GlassCard key={item.q} hoverLift={false} className="px-6 py-5">
                <h3>
                  <button
                    type="button"
                    onClick={() => toggleItem(idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${idx}`}
                    id={`faq-trigger-${idx}`}
                    className="w-full flex items-center justify-between gap-4 text-left font-heading text-lg font-semibold text-primary focus-visible:outline-none"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-indigo shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-panel-${idx}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${idx}`}
                      initial={prefersReducedMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pt-4 mt-4 border-t border-border-subtle text-sm sm:text-base text-secondary leading-relaxed">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
