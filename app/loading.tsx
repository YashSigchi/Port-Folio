import React from 'react';

export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading content"
      className="min-h-screen flex flex-col items-center justify-center bg-void gap-4"
    >
      <div className="relative w-14 h-14 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-indigo/25" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo animate-spin" />
        <span className="font-heading font-bold text-sm text-gradient-cosmic">YS</span>
      </div>
      <span className="font-mono text-xs uppercase tracking-widest text-muted">
        Initializing...
      </span>
    </div>
  );
}
