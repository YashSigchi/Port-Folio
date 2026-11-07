'use client';

import React, { useRef } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverLift?: boolean;
  spotlight?: boolean;
  className?: string;
}

export function GlassCard({
  children,
  hoverLift = true,
  spotlight = true,
  className,
  ...props
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!spotlight || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty('--mouse-x', `${x}px`);
    cardRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      className={cn(
        // `isolate` lets the spotlight sit at z-[-1] behind the content without a wrapper div,
        // so layout classes passed in (flex, space-y-*, gap-*) apply directly to the children.
        'group relative isolate overflow-hidden rounded-panel bg-glass border border-border-subtle transition-[transform,border-color] duration-300 ease-cosmic hover:border-border-glow',
        hoverLift && 'hover:-translate-y-1.5',
        className
      )}
      {...props}
    >
      {spotlight && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px z-[-1] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(420px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(129, 140, 248, 0.14), transparent 65%)',
          }}
        />
      )}
      {children}
    </div>
  );
}
