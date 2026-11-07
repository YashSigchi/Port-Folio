'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  external?: boolean;
  cursorLabel?: string;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  external,
  cursorLabel,
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-heading font-medium rounded-pill transition-[transform,filter,background-color,border-color] duration-300 ease-cosmic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo focus-visible:ring-offset-2 focus-visible:ring-offset-void disabled:opacity-50 disabled:pointer-events-none';

  const variantStyles = {
    primary:
      'bg-btn-gradient text-primary shadow-btn-glow hover:brightness-110 hover:scale-[1.02] active:scale-[0.99]',
    ghost:
      'bg-glass text-primary border border-border-subtle hover:border-border-glow hover:bg-white/[0.08]',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs tracking-wide',
    md: 'px-6 py-3 text-sm tracking-wide',
    lg: 'px-8 py-4 text-base tracking-wide',
  };

  const combinedClassName = cn(baseStyles, variantStyles[variant], sizeStyles[size], className);

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor={cursorLabel}
          className={combinedClassName}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} data-cursor={cursorLabel} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button data-cursor={cursorLabel} className={combinedClassName} {...props}>
      {children}
    </button>
  );
}
