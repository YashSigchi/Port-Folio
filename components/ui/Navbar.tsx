'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, FileText, Command } from 'lucide-react';
import { profile } from '@/data/profile';
import { Button } from './Button';

const NAV_LINKS = [
  { label: 'About', href: '/#about' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Work', href: '/#work' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Process', href: '/#process' },
  { label: 'Contact', href: '/#contact' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6">
      <nav
        aria-label="Primary Navigation"
        className="mx-auto max-w-container flex items-center justify-between px-4 sm:px-6 py-3 rounded-pill bg-deep/85 border border-border-subtle backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      >
        {/* Left: Brand Logo + Open to Work Pill */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-surface border border-border-subtle hover:border-border-glow transition-colors"
            aria-label="Yash Sigchi Home"
          >
            <span className="font-heading font-bold text-base tracking-tight text-gradient-cosmic">
              YS
            </span>
          </Link>

          <Link
            href="/#contact"
            className="hidden xl:inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-success/10 border border-success/25 text-xs font-mono text-success hover:bg-success/15 transition-colors"
            title={profile.availability}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            <span>Open to work</span>
          </Link>
        </div>

        {/* Center: Desktop Links */}
        <ul className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_LINKS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="px-3 py-1.5 rounded-pill text-sm text-secondary hover:text-primary hover:bg-white/[0.05] transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/playground"
              className="px-3 py-1.5 rounded-pill text-sm text-indigo hover:text-primary hover:bg-indigo/10 transition-colors font-mono text-xs uppercase tracking-wider"
            >
              Playground
            </Link>
          </li>
        </ul>

        {/* Right: Command Palette Trigger + Resume Button + Mobile Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCommandPalette}
            aria-label="Open Command Palette (Ctrl+K or Cmd+K)"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-pill bg-glass border border-border-subtle hover:border-border-glow text-xs font-mono text-secondary hover:text-primary transition-colors"
          >
            <Command className="w-3.5 h-3.5 text-indigo" />
            <span className="hidden sm:inline">⌘K</span>
          </button>

          <div className="hidden sm:block">
            <Button href="/resume" variant="ghost" size="sm">
              <FileText className="w-3.5 h-3.5 text-indigo" />
              <span>Resume</span>
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-full bg-glass border border-border-subtle text-primary hover:border-border-glow"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Full-Screen Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden fixed inset-x-4 top-20 z-50 rounded-panel bg-deep/95 border border-border-subtle backdrop-blur-2xl p-6 shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-6 px-3 py-2 rounded-card bg-success/10 border border-success/25 text-xs font-mono text-success">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse shrink-0" />
              <span>{profile.availability}</span>
            </div>

            <ul className="flex flex-col gap-2 mb-6">
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2.5 rounded-card font-heading text-lg text-primary hover:bg-white/[0.06] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/playground"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 rounded-card font-mono text-sm uppercase tracking-wider text-indigo hover:bg-indigo/10 transition-colors"
                >
                  ✨ 3D Playground
                </Link>
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border-subtle">
              <Button
                href="/resume"
                variant="ghost"
                className="w-full justify-center"
                onClick={() => setMobileOpen(false)}
              >
                <FileText className="w-4 h-4 text-indigo" />
                <span>Recruiter Resume Mode</span>
              </Button>
              <Button
                href={profile.resume}
                external
                variant="primary"
                className="w-full justify-center"
              >
                <span>Download PDF Resume</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
