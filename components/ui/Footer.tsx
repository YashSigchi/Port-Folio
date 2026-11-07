'use client';

import React from 'react';
import Link from 'next/link';
import { useLenis } from 'lenis/react';
import { ArrowUp, Github, Linkedin, Mail, FileText, Terminal } from 'lucide-react';
import { profile } from '@/data/profile';

const FOOTER_LINKS = [
  { label: 'About', href: '/#about' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Work', href: '/#work' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Process', href: '/#process' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Contact', href: '/#contact' },
  { label: 'Resume Mode', href: '/resume' },
  { label: 'Playground', href: '/playground' },
];

export function Footer() {
  const lenis = useLenis();

  // Route through Lenis when it's active; a native smooth scrollTo fights its animation loop.
  const scrollToTop = () => {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWordmarkPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--glow-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--glow-y', `${e.clientY - rect.top}px`);
  };

  const openTerminal = () => {
    window.dispatchEvent(new CustomEvent('open-terminal'));
  };

  return (
    <footer className="relative border-t border-border-subtle bg-void pt-16 pb-10 overflow-hidden">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-border-subtle">
          {/* Brand + Role */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-surface border border-border-subtle font-heading font-bold text-sm text-gradient-cosmic">
                YS
              </span>
              <div>
                <p className="font-heading font-bold text-lg text-primary">{profile.name}</p>
                <p className="font-mono text-xs uppercase tracking-wider text-secondary">
                  {profile.targetRoles.join(' · ')}
                </p>
              </div>
            </div>
            <p className="text-sm text-secondary max-w-md leading-relaxed">
              {profile.availability}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-2.5 rounded-full bg-glass border border-border-subtle hover:border-border-glow text-secondary hover:text-primary transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2.5 rounded-full bg-glass border border-border-subtle hover:border-border-glow text-secondary hover:text-primary transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email Yash Sigchi"
                className="p-2.5 rounded-full bg-glass border border-border-subtle hover:border-border-glow text-secondary hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Resume PDF"
                className="p-2.5 rounded-full bg-glass border border-border-subtle hover:border-border-glow text-secondary hover:text-primary transition-colors"
              >
                <FileText className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={openTerminal}
                aria-label="Open interactive terminal"
                title="Press ` or click to open terminal"
                className="p-2.5 rounded-full bg-glass border border-border-subtle hover:border-border-glow text-secondary hover:text-indigo transition-colors"
              >
                <Terminal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-5">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted mb-4">
              Navigation
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-y-2.5 gap-x-4">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-secondary hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Back to Top */}
          <div className="md:col-span-2 flex md:justify-end items-start">
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-pill bg-glass border border-border-subtle hover:border-border-glow text-xs font-mono uppercase tracking-wider text-secondary hover:text-primary transition-all"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5 text-indigo" />
            </button>
          </div>
        </div>

        {/* Big Outlined Wordmark */}
        <div className="py-8 select-none overflow-hidden">
          {/* Glow copy is masked to a circle around the pointer, so only the hovered part lights up */}
          <div
            aria-hidden="true"
            onPointerMove={handleWordmarkPointerMove}
            className="wordmark-wrap relative font-heading font-bold text-center tracking-[-0.04em] leading-none text-[clamp(3.2rem,13vw,11rem)] whitespace-nowrap"
          >
            <p className="wordmark-outline">YASH SIGCHI</p>
            <p className="wordmark-glow absolute inset-0">YASH SIGCHI</p>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs text-muted font-mono">
          <p>© 2026 Yash Sigchi. Built with Next.js, Three.js & Framer Motion.</p>
          <p>Jaipur, India · Press ` for terminal · ⌘K for command palette</p>
        </div>
      </div>
    </footer>
  );
}
