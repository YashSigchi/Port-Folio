import React from 'react';
import { cn } from '@/lib/utils';

interface ChipProps {
  children: React.ReactNode;
  withDiamond?: boolean;
  variant?: 'default' | 'indigo' | 'amber' | 'success';
  className?: string;
}

export function Chip({
  children,
  withDiamond = false,
  variant = 'default',
  className,
}: ChipProps) {
  const variantStyles = {
    default: 'bg-glass border-border-subtle text-secondary hover:border-border-glow hover:text-primary',
    indigo: 'bg-indigo/10 border-indigo/30 text-indigo',
    amber: 'bg-amber/10 border-amber/30 text-amber',
    success: 'bg-success/10 border-success/30 text-success',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-pill border text-xs font-mono tracking-wider transition-colors duration-200',
        variantStyles[variant],
        className
      )}
    >
      {withDiamond && (
        <span className="text-indigo select-none" aria-hidden="true">
          ◆
        </span>
      )}
      {children}
    </span>
  );
}

interface DiamondChipListProps {
  items: string[];
  className?: string;
}

export function DiamondChipList({ items, className }: DiamondChipListProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {items.map((item) => (
        <Chip key={item} withDiamond>
          {item}
        </Chip>
      ))}
    </div>
  );
}
