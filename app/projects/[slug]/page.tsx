import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ExternalLink, Github, Smartphone } from 'lucide-react';
import { projects } from '@/data/projects';
import { workflows } from '@/data/workflows';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { GlassCard } from '@/components/ui/GlassCard';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { WorkflowDiagram } from '@/components/sections/WorkflowDiagram';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export function generateMetadata({ params }: ProjectPageProps): Metadata {
  const project = projects.find((p) => p.slug === params.slug);
  if (!project) {
    return { title: 'Project Not Found' };
  }
  return {
    title: `${project.title} — Case Study`,
    description: project.summary,
  };
}

export default function ProjectCaseStudyPage({ params }: ProjectPageProps) {
  const currentIndex = projects.findIndex((p) => p.slug === params.slug);
  if (currentIndex === -1) {
    notFound();
  }

  const project = projects[currentIndex];
  const prevProject =
    currentIndex > 0 ? projects[currentIndex - 1] : projects[projects.length - 1];
  const nextProject =
    currentIndex < projects.length - 1 ? projects[currentIndex + 1] : projects[0];

  const diagramData = workflows[project.slug];

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen pt-28 pb-20 bg-void">
        <article className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <div className="mb-8">
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-secondary hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-indigo" />
              <span>Back to selected work</span>
            </Link>
          </div>

          {/* Case Study Hero */}
          <div className="relative rounded-panel overflow-hidden border border-border-subtle p-8 sm:p-12 mb-12 bg-deep">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{ background: project.previewGradient }}
            />
            <div className="relative z-10 max-w-3xl space-y-5">
              <div className="flex flex-wrap items-center gap-2.5">
                <Chip variant="indigo">{project.category}</Chip>
                <Chip>{project.year}</Chip>
                {project.tags.map((tag) => (
                  <Chip key={tag} withDiamond>
                    {tag}
                  </Chip>
                ))}
              </div>

              <h1 className="font-heading text-3xl sm:text-5xl font-bold text-primary tracking-tight leading-tight">
                {project.title}
              </h1>

              <p className="text-base sm:text-lg text-secondary leading-relaxed">
                {project.summary}
              </p>

              {/* Action Links */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {project.links.live && (
                  <Button href={project.links.live} external variant="primary">
                    <span>Live Deployment</span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
                {project.links.repo && (
                  <Button href={project.links.repo} external variant="ghost">
                    <Github className="w-4 h-4 text-indigo" />
                    <span>Source Code</span>
                  </Button>
                )}
                {project.links.apk && (
                  <Button href="/#contact" variant="ghost">
                    <Smartphone className="w-4 h-4 text-amber" />
                    <span>Request APK Build</span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Architecture Diagram (for tool-room-requisition & ai-customer-support) */}
          {diagramData && (
            <div className="mb-12">
              <WorkflowDiagram diagram={diagramData} />
            </div>
          )}

          {/* Problem & Approach */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <GlassCard hoverLift={false} className="p-6 sm:p-8">
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-indigo">
                01 · The Problem
              </span>
              <h2 className="font-heading text-2xl font-bold text-primary mt-2 mb-4">
                Context &amp; Operational Bottleneck
              </h2>
              <p className="text-secondary leading-relaxed">{project.caseStudy.problem}</p>
            </GlassCard>

            <GlassCard hoverLift={false} className="p-6 sm:p-8">
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-cyan">
                02 · The Approach
              </span>
              <h2 className="font-heading text-2xl font-bold text-primary mt-2 mb-4">
                System Architecture &amp; Execution
              </h2>
              <p className="text-secondary leading-relaxed">{project.caseStudy.approach}</p>
            </GlassCard>
          </div>

          {/* Key Decisions & Challenges/Fixes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <GlassCard hoverLift={false} className="p-6 sm:p-8">
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-amber">
                03 · Key Decisions
              </span>
              <h2 className="font-heading text-2xl font-bold text-primary mt-2 mb-4">
                Engineering Trade-offs
              </h2>
              <ul className="space-y-3 text-secondary">
                {project.caseStudy.keyDecisions.map((decision, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-indigo font-mono text-xs mt-1.5" aria-hidden="true">
                      ◆
                    </span>
                    <span>{decision}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard hoverLift={false} className="p-6 sm:p-8">
              <span className="font-mono text-xs uppercase tracking-[0.12em] text-magenta">
                04 · Challenges &amp; Fixes
              </span>
              <h2 className="font-heading text-2xl font-bold text-primary mt-2 mb-4">
                Hardening for Production
              </h2>
              <ul className="space-y-3 text-secondary">
                {project.caseStudy.challengesAndFixes.map((fix, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-cyan font-mono text-xs mt-1.5" aria-hidden="true">
                      ◆
                    </span>
                    <span>{fix}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>

          {/* Stack & Links */}
          <GlassCard hoverLift={false} className="p-6 sm:p-8 mb-14">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="font-mono text-xs uppercase tracking-[0.12em] text-muted">
                  05 · Technology Stack
                </span>
                <div className="flex flex-wrap gap-2 mt-3">
                  {project.stack.map((tech) => (
                    <Chip key={tech} withDiamond>
                      {tech}
                    </Chip>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                {project.links.repo && (
                  <Button href={project.links.repo} external variant="ghost" size="sm">
                    <Github className="w-4 h-4" />
                    <span>GitHub Repo</span>
                  </Button>
                )}
                {project.links.live && (
                  <Button href={project.links.live} external variant="primary" size="sm">
                    <span>Open Live App</span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Previous / Next Navigation */}
          <nav
            aria-label="Project case study navigation"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-border-subtle"
          >
            <Link
              href={`/projects/${prevProject.slug}`}
              className="group p-6 rounded-panel bg-glass border border-border-subtle hover:border-border-glow transition-all"
            >
              <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted group-hover:text-indigo">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Project</span>
              </span>
              <p className="font-heading text-xl font-bold text-primary mt-2">
                {prevProject.title}
              </p>
            </Link>

            <Link
              href={`/projects/${nextProject.slug}`}
              className="group p-6 rounded-panel bg-glass border border-border-subtle hover:border-border-glow transition-all sm:text-right"
            >
              <span className="inline-flex items-center sm:justify-end gap-1.5 font-mono text-xs uppercase tracking-wider text-muted group-hover:text-indigo">
                <span>Next Project</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <p className="font-heading text-xl font-bold text-primary mt-2">
                {nextProject.title}
              </p>
            </Link>
          </nav>
        </article>
      </main>
      <Footer />
    </>
  );
}
