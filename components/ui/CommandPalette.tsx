'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Search,
  CornerDownLeft,
  FileText,
  Copy,
  Check,
  FolderGit2,
  Compass,
  MessageSquare,
  Terminal,
  Sparkles,
} from 'lucide-react';
import { profile } from '@/data/profile';
import { projects } from '@/data/projects';

interface PaletteAction {
  id: string;
  label: string;
  category: 'Navigation' | 'Projects' | 'Quick Actions';
  icon: React.ReactNode;
  onSelect: () => void;
}

export function CommandPalette() {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const actions: PaletteAction[] = useMemo(() => {
    const closeAndNavigate = (href: string) => {
      setOpen(false);
      router.push(href);
    };

    const baseActions: PaletteAction[] = [
      {
        id: 'ask-yash-chat',
        label: 'Ask Yash (Open AI Assistant)',
        category: 'Quick Actions',
        icon: <MessageSquare className="w-4 h-4 text-magenta" />,
        onSelect: () => {
          setOpen(false);
          window.dispatchEvent(new CustomEvent('open-chatbot'));
        },
      },
      {
        id: 'copy-email',
        label: copied ? 'Copied yash.sigchi08@gmail.com!' : `Copy Email (${profile.email})`,
        category: 'Quick Actions',
        icon: copied ? (
          <Check className="w-4 h-4 text-success" />
        ) : (
          <Copy className="w-4 h-4 text-indigo" />
        ),
        onSelect: async () => {
          await navigator.clipboard.writeText(profile.email).catch(() => {});
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
            setOpen(false);
          }, 800);
        },
      },
      {
        id: 'open-resume-mode',
        label: 'Open Recruiter Resume Mode (/resume)',
        category: 'Quick Actions',
        icon: <FileText className="w-4 h-4 text-cyan" />,
        onSelect: () => closeAndNavigate('/resume'),
      },
      {
        id: 'download-resume-pdf',
        label: 'Download Resume PDF (Google Drive)',
        category: 'Quick Actions',
        icon: <FileText className="w-4 h-4 text-amber" />,
        onSelect: () => {
          setOpen(false);
          window.open(profile.resume, '_blank', 'noopener,noreferrer');
        },
      },
      {
        id: 'open-terminal',
        label: 'Launch Interactive Terminal (`)',
        category: 'Quick Actions',
        icon: <Terminal className="w-4 h-4 text-success" />,
        onSelect: () => {
          setOpen(false);
          window.dispatchEvent(new CustomEvent('open-terminal'));
        },
      },
      {
        id: 'open-playground',
        label: 'Open 3D Physics Playground (/playground)',
        category: 'Quick Actions',
        icon: <Sparkles className="w-4 h-4 text-amber" />,
        onSelect: () => closeAndNavigate('/playground'),
      },
      // Sections
      {
        id: 'nav-about',
        label: 'Jump to [02] Profile & About',
        category: 'Navigation',
        icon: <Compass className="w-4 h-4 text-indigo" />,
        onSelect: () => closeAndNavigate('/#about'),
      },
      {
        id: 'nav-experience',
        label: 'Jump to [03] Experience',
        category: 'Navigation',
        icon: <Compass className="w-4 h-4 text-indigo" />,
        onSelect: () => closeAndNavigate('/#experience'),
      },
      {
        id: 'nav-work',
        label: 'Jump to [04] Selected Work',
        category: 'Navigation',
        icon: <Compass className="w-4 h-4 text-indigo" />,
        onSelect: () => closeAndNavigate('/#work'),
      },
      {
        id: 'nav-skills',
        label: 'Jump to Technical Skills',
        category: 'Navigation',
        icon: <Compass className="w-4 h-4 text-indigo" />,
        onSelect: () => closeAndNavigate('/#skills'),
      },
      {
        id: 'nav-process',
        label: 'Jump to [06] How I Work',
        category: 'Navigation',
        icon: <Compass className="w-4 h-4 text-indigo" />,
        onSelect: () => closeAndNavigate('/#process'),
      },
      {
        id: 'nav-contact',
        label: 'Jump to [08] Contact',
        category: 'Navigation',
        icon: <Compass className="w-4 h-4 text-indigo" />,
        onSelect: () => closeAndNavigate('/#contact'),
      },
      // Projects
      ...projects.map((p) => ({
        id: `proj-${p.slug}`,
        label: `${p.title} (${p.category})`,
        category: 'Projects' as const,
        icon: <FolderGit2 className="w-4 h-4 text-cyan" />,
        onSelect: () => closeAndNavigate(`/projects/${p.slug}`),
      })),
    ];

    return baseActions;
  }, [copied, router]);

  const filteredActions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter(
      (a) => a.label.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
    );
  }, [actions, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (e.key === 'Escape' && open) {
        e.preventDefault();
        setOpen(false);
      }
    };

    const handleCustomOpen = () => setOpen(true);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-palette', handleCustomOpen);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-palette', handleCustomOpen);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 20);
    } else {
      setQuery('');
    }
  }, [open]);

  const handleModalKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredActions.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % filteredActions.length);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredActions.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % filteredActions.length);
      }
    } else if (e.key === 'Enter' && filteredActions[selectedIndex]) {
      e.preventDefault();
      filteredActions[selectedIndex].onSelect();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command Palette"
          onKeyDown={handleModalKeyDown}
          className="fixed inset-0 z-[200] flex items-start justify-center pt-20 sm:pt-28 px-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-void/75 backdrop-blur-md"
          />

          {/* Modal Box */}
          <motion.div
            data-lenis-prevent="true"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-xl rounded-panel bg-surface border border-border-glow shadow-2xl overflow-hidden"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border-subtle">
              <Search className="w-4 h-4 text-indigo shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command, section, or project name..."
                aria-label="Search commands"
                className="w-full bg-transparent text-sm text-primary placeholder:text-muted focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-2 py-0.5 rounded bg-void/80 border border-border-subtle font-mono text-[10px] text-muted hover:text-primary"
              >
                ESC
              </button>
            </div>

            {/* Results List */}
            <div data-lenis-prevent className="max-h-80 overflow-y-auto p-2 space-y-1">
              {filteredActions.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted font-mono">
                  No matching commands or projects found.
                </p>
              ) : (
                filteredActions.map((item, idx) => {
                  const active = idx === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onMouseEnter={() => setSelectedIndex(idx)}
                      onClick={item.onSelect}
                      className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-card text-left text-sm transition-colors ${
                        active
                          ? 'bg-indigo/20 text-primary border border-indigo/40'
                          : 'text-secondary hover:bg-white/[0.04] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {item.icon}
                        <span className="truncate">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                          {item.category}
                        </span>
                        {active && <CornerDownLeft className="w-3.5 h-3.5 text-indigo" />}
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Hints */}
            <div className="px-4 py-2.5 bg-void/70 border-t border-border-subtle flex items-center justify-between text-[11px] font-mono text-muted">
              <span>↑↓ to navigate · Enter to select</span>
              <span>⌘K / Ctrl+K</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
