'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Terminal as TerminalIcon, X } from 'lucide-react';
import { profile } from '@/data/profile';
import { experiences } from '@/data/experience';
import { featuredProjects } from '@/data/projects';
import { skills, SKILL_CATEGORIES } from '@/data/skills';

interface TerminalLine {
  id: string;
  command?: string;
  output: React.ReactNode;
}

export function TerminalDrawer() {
  const prefersReducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      id: 'welcome',
      output: (
        <div className="space-y-1 text-secondary">
          <p className="text-cyan font-semibold">YashOS v2026.1 — Interactive Portfolio Shell</p>
          <p>
            Type <span className="text-amber">help</span> to view available commands, or{' '}
            <span className="text-amber">sudo hire yash</span> to cut to the chase.
          </p>
        </div>
      ),
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const keyBufferRef = useRef<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);

      if (e.key === 'Escape' && open) {
        setOpen(false);
        return;
      }

      if (isInput) return;

      if (e.key === '`') {
        e.preventDefault();
        setOpen((prev) => !prev);
        return;
      }

      if (e.key.length === 1 && !e.metaKey && !e.ctrlKey && !e.altKey) {
        keyBufferRef.current = (keyBufferRef.current + e.key.toLowerCase()).slice(-8);
        if (keyBufferRef.current.endsWith('terminal')) {
          keyBufferRef.current = '';
          setOpen(true);
        }
      }
    };

    const handleCustomOpen = () => setOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-terminal', handleCustomOpen);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-terminal', handleCustomOpen);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, open]);

  const executeCommand = (raw: string) => {
    const cmd = raw.trim().toLowerCase();

    if (cmd === 'clear') {
      setHistory([]);
      return;
    }

    let output: React.ReactNode;

    switch (cmd) {
      case 'help':
        output = (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-secondary">
            <div>
              <span className="text-amber">whoami</span> — Identity, degree &amp; availability
            </div>
            <div>
              <span className="text-amber">skills</span> — Full technical stack by category
            </div>
            <div>
              <span className="text-amber">projects</span> — Featured engineering systems
            </div>
            <div>
              <span className="text-amber">experience</span> — Internships &amp; work history
            </div>
            <div>
              <span className="text-amber">contact</span> — Email &amp; profiles (no phone)
            </div>
            <div>
              <span className="text-amber">sudo hire yash</span> — Execute hiring protocol
            </div>
            <div>
              <span className="text-amber">clear</span> — Clear terminal buffer
            </div>
          </div>
        );
        break;

      case 'whoami':
        output = (
          <div className="space-y-1 text-secondary">
            <p>
              <strong className="text-primary">{profile.name}</strong> —{' '}
              {profile.targetRoles.join(' · ')}
            </p>
            <p>
              {profile.degree} @ {profile.university} ({profile.years}, CGPA {profile.cgpa})
            </p>
            <p className="text-success">{profile.availability}</p>
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="space-y-1 text-secondary">
            {SKILL_CATEGORIES.map((cat) => (
              <p key={cat}>
                <span className="text-indigo">{cat}:</span>{' '}
                {skills
                  .filter((s) => s.category === cat)
                  .map((s) => s.name)
                  .join(', ')}
              </p>
            ))}
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="space-y-1.5 text-secondary">
            {featuredProjects.map((p, idx) => (
              <p key={p.slug}>
                <span className="text-cyan">
                  0{idx + 1}. {p.title}
                </span>{' '}
                ({p.category}, {p.year}) — {p.summary}
              </p>
            ))}
          </div>
        );
        break;

      case 'experience':
        output = (
          <div className="space-y-1.5 text-secondary">
            {experiences.map((exp) => (
              <p key={exp.id}>
                <span className="text-amber">{exp.role}</span> @{' '}
                <strong className="text-primary">{exp.company}</strong> ({exp.dates})
              </p>
            ))}
          </div>
        );
        break;

      case 'contact':
        output = (
          <div className="space-y-1 text-secondary">
            <p>
              Email:{' '}
              <a href={`mailto:${profile.email}`} className="text-cyan underline">
                {profile.email}
              </a>
            </p>
            <p>
              LinkedIn:{' '}
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo underline"
              >
                {profile.linkedin}
              </a>
            </p>
            <p>
              GitHub:{' '}
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo underline"
              >
                {profile.github}
              </a>
            </p>
          </div>
        );
        break;

      case 'sudo hire yash':
        output = (
          <div className="space-y-1 text-success">
            <p>✓ [sudo] password for recruiter: ******** — Access granted!</p>
            <p>
              Yash is {profile.availability.toLowerCase()} Head down to the{' '}
              <a
                href="/#contact"
                onClick={() => setOpen(false)}
                className="underline text-amber font-semibold"
              >
                #contact briefing form
              </a>{' '}
              or email <span className="text-primary">{profile.email}</span> — he replies within 24
              hours! ✨
            </p>
          </div>
        );
        break;

      default:
        output = (
          <p className="text-danger">
            Command not found: &quot;{raw}&quot;. Type <span className="text-amber">help</span> for
            a list of valid commands.
          </p>
        );
    }

    setHistory((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        command: raw,
        output,
      },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    executeCommand(input);
    setInput('');
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="false"
          aria-label="Interactive Developer Terminal"
          initial={prefersReducedMotion ? { opacity: 1 } : { y: '100%' }}
          animate={{ y: 0, opacity: 1 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { y: '100%' }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[180] mx-auto max-w-4xl rounded-t-panel bg-void/95 border-t border-x border-border-glow backdrop-blur-2xl shadow-[0_-20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Terminal Top Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-surface border-b border-border-subtle">
            <div className="flex items-center gap-2 font-mono text-xs text-primary">
              <TerminalIcon className="w-4 h-4 text-success" />
              <span>yash@portfolio:~ (press ` or Esc to close)</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close terminal"
              className="p-1 rounded hover:bg-white/10 text-secondary hover:text-primary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Output History */}
          <div
            data-lenis-prevent
            className="h-72 overflow-y-auto p-4 font-mono text-xs sm:text-sm space-y-3"
          >
            {history.map((item) => (
              <div key={item.id} className="space-y-1">
                {item.command !== undefined && (
                  <div className="flex items-center gap-2 text-primary">
                    <span className="text-success">yash@portfolio:~$</span>
                    <span>{item.command}</span>
                  </div>
                )}
                <div className="pl-3 border-l border-border-subtle">{item.output}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Command Input Line */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 px-4 py-3 bg-deep border-t border-border-subtle font-mono text-xs sm:text-sm"
          >
            <label htmlFor="terminal-input" className="text-success shrink-0">
              yash@portfolio:~$
            </label>
            <input
              ref={inputRef}
              id="terminal-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="help | whoami | skills | projects | experience | contact | sudo hire yash"
              autoComplete="off"
              className="w-full bg-transparent text-primary placeholder:text-muted focus:outline-none"
            />
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
