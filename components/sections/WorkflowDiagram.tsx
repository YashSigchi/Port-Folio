'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { type WorkflowDiagramData, type WorkflowNode } from '@/data/workflows';
import { GlassCard } from '@/components/ui/GlassCard';

interface ComputedLine {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function WorkflowDiagram({ diagram }: { diagram: WorkflowDiagramData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [lines, setLines] = useState<ComputedLine[]>([]);
  const [svgSize, setSvgSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const isInView = useInView(containerRef, { once: false, margin: '-80px' });
  const prefersReducedMotion = useReducedMotion();

  const roleColorMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    diagram.roles.forEach((r) => {
      map[r.role] = r.color;
    });
    return map;
  }, [diagram.roles]);

  // Group nodes by row index
  const rows = React.useMemo(() => {
    const grouped: Record<number, WorkflowNode[]> = {};
    diagram.nodes.forEach((node) => {
      if (!grouped[node.row]) grouped[node.row] = [];
      grouped[node.row].push(node);
    });
    return Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b)
      .map((rowIndex) =>
        grouped[rowIndex].sort((a, b) => (a.col ?? 0) - (b.col ?? 0))
      );
  }, [diagram.nodes]);

  const computeConnectorCoordinates = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    setSvgSize({ width: containerRect.width, height: containerRect.height });

    const computed: ComputedLine[] = [];

    diagram.edges.forEach((edge) => {
      const fromEl = nodeRefs.current[edge.from];
      const toEl = nodeRefs.current[edge.to];
      if (!fromEl || !toEl) return;

      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();

      const x1 = fromRect.left - containerRect.left + fromRect.width / 2;
      const y1 = fromRect.bottom - containerRect.top;
      const x2 = toRect.left - containerRect.left + toRect.width / 2;
      const y2 = toRect.top - containerRect.top;

      computed.push({
        id: `${edge.from}->${edge.to}`,
        x1,
        y1,
        x2,
        y2,
      });
    });

    setLines(computed);
  }, [diagram.edges]);

  useEffect(() => {
    computeConnectorCoordinates();

    const handleResize = () => {
      computeConnectorCoordinates();
    };

    window.addEventListener('resize', handleResize);
    const timer = setTimeout(computeConnectorCoordinates, 250);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [computeConnectorCoordinates]);

  return (
    <GlassCard hoverLift={false} className="p-6 sm:p-8 md:p-10 bg-deep/90">
      {/* Header + Simplified View Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="font-mono text-[11px] uppercase tracking-wider px-3 py-0.5 rounded-pill bg-indigo/15 border border-indigo/40 text-indigo">
              {diagram.badge}
            </span>
            <span className="font-mono text-xs text-muted">System Architecture</span>
          </div>
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-primary">
            {diagram.title}
          </h3>
          <p className="text-sm text-secondary mt-1 max-w-2xl">{diagram.subtitle}</p>
        </div>

        {/* Role Legend */}
        <div className="flex flex-wrap gap-3 self-start sm:self-center bg-void/70 p-3 rounded-card border border-border-subtle">
          {diagram.roles.map((r) => (
            <div key={r.role} className="flex items-center gap-2 text-xs font-mono text-secondary">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: r.color }}
              />
              <span>{r.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Diagram Canvas Container */}
      <div ref={containerRef} className="relative mt-10">
        {/* Dynamically Computed SVG Connector Lines + Travelling Glowing Packets */}
        {svgSize.width > 0 && (
          <svg
            width={svgSize.width}
            height={svgSize.height}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 overflow-visible"
          >
            {lines.map((line, idx) => (
              <g key={line.id}>
                {/* Base Connector Line */}
                <line
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="rgba(129, 140, 248, 0.28)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Travelling Glowing Packet when Diagram is in View */}
                {isInView && !prefersReducedMotion && (
                  <motion.circle
                    r="4"
                    fill="#22D3EE"
                    initial={{ cx: line.x1, cy: line.y1, opacity: 0 }}
                    animate={{
                      cx: [line.x1, line.x2],
                      cy: [line.y1, line.y2],
                      opacity: [0, 1, 1, 0],
                    }}
                    transition={{
                      duration: 1.8,
                      delay: (idx % 5) * 0.35,
                      repeat: Infinity,
                      repeatDelay: 0.8,
                      ease: 'easeInOut',
                    }}
                  />
                )}
              </g>
            ))}
          </svg>
        )}

        {/* Node Rows */}
        <div className="relative z-10 space-y-10">
          {rows.map((rowNodes, rowIdx) => {
            const isBranchRow = rowNodes.length > 1;
            return (
              <div
                key={rowIdx}
                className={
                  isBranchRow
                    ? `grid grid-cols-1 ${
                        rowNodes.length === 3
                          ? 'md:grid-cols-3'
                          : 'sm:grid-cols-2 lg:grid-cols-4'
                      } gap-5`
                    : 'max-w-lg mx-auto'
                }
              >
                {rowNodes.map((node) => {
                  const roleColor = roleColorMap[node.ownerRole] || '#818CF8';
                  return (
                    <div
                      key={node.id}
                      ref={(el) => {
                        nodeRefs.current[node.id] = el;
                      }}
                      className="rounded-card bg-surface/95 border border-border-subtle p-4 shadow-lg transition-colors hover:border-border-glow"
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: roleColor }}
                          />
                          {node.stepNumber && (
                            <span className="font-mono text-xs text-indigo font-semibold">
                              [{node.stepNumber}]
                            </span>
                          )}
                          <span className="font-mono text-[11px] text-muted truncate">
                            {node.ownerRole}
                          </span>
                        </div>

                        {node.notify && (
                          <span
                            title="Automated Email Notification Triggered"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-pill bg-cyan/10 border border-cyan/30 font-mono text-[10px] text-cyan"
                          >
                            <Mail className="w-3 h-3" />
                            <span>Notify</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-heading font-bold text-base text-primary">
                        {node.label}
                      </h4>
                      <p className="text-xs text-secondary mt-1 leading-relaxed">
                        {node.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}
