'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { HandUnderline } from './HandUnderline';

interface SectionHeaderProps {
  index: string;
  label: string;
  title: string;
  highlightWord?: string;
  subtitle?: string;
  handNote?: string;
  className?: string;
}

export function SectionHeader({
  index,
  label,
  title,
  highlightWord,
  subtitle,
  handNote,
  className,
}: SectionHeaderProps) {
  const renderTitle = () => {
    if (!highlightWord || !title.includes(highlightWord)) {
      return title;
    }

    const parts = title.split(highlightWord);
    return (
      <>
        {parts[0]}
        <span className="relative inline-block">
          <span className="text-gradient-cosmic">{highlightWord}</span>
          <HandUnderline className="absolute -bottom-2 left-0 text-indigo" />
        </span>
        {parts.slice(1).join(highlightWord)}
      </>
    );
  };

  return (
    <div className={cn('mb-12 md:mb-16 max-w-3xl', className)}>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-indigo bg-indigo/10 border border-indigo/25 px-3 py-1 rounded-pill">
          [{index}] {label}
        </span>
        {handNote && (
          <span className="font-hand text-xl md:text-2xl text-lavender -rotate-2 select-none">
            {handNote}
          </span>
        )}
      </div>

      <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] text-primary leading-[1.08]">
        {renderTitle()}
      </h2>

      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-secondary leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}
