import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Download, ExternalLink, Github, Linkedin, Mail } from 'lucide-react';
import { profile } from '@/data/profile';
import { experiences } from '@/data/experience';
import { featuredProjects, experimentProjects } from '@/data/projects';
import { skills, SKILL_CATEGORIES } from '@/data/skills';
import { certifications } from '@/data/certifications';
import { problemSolving } from '@/data/problemSolving';

export const metadata: Metadata = {
  title: 'Resume (Recruiter Mode)',
  description:
    'Clean, fast, print-friendly HTML resume of Yash Sigchi — Software Engineer, AI/ML Engineer, Full-Stack Engineer.',
};

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-void text-primary print:bg-white print:text-black">
      {/* Top Action Bar (Hidden in Print) */}
      <header className="print:hidden sticky top-0 z-30 border-b border-border-subtle bg-deep/90 backdrop-blur-md">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-secondary hover:text-primary"
          >
            <ArrowLeft className="w-4 h-4 text-indigo" />
            <span>Back to portfolio</span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline font-mono text-xs text-muted">
              Recruiter Fast-Read View
            </span>
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-btn-gradient text-primary font-heading text-xs font-medium shadow-btn-glow"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download resume</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Print-Friendly Resume Sheet */}
      <main
        id="main-content"
        className="mx-auto max-w-4xl px-4 sm:px-8 py-10 print:py-0 print:px-0 space-y-8"
      >
        {/* Identity Header */}
        <section className="border-b border-border-subtle print:border-gray-300 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-primary print:text-black">
                {profile.name}
              </h1>
              <p className="font-mono text-xs sm:text-sm text-indigo print:text-gray-800 mt-1">
                {profile.targetRoles.join(' · ')} · {profile.location}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-xs font-mono text-secondary print:text-gray-700">
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-1 hover:underline"
              >
                <Mail className="w-3.5 h-3.5 print:hidden" />
                <span>{profile.email}</span>
              </a>
              <span>·</span>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline"
              >
                <Linkedin className="w-3.5 h-3.5 print:hidden" />
                <span>LinkedIn</span>
              </a>
              <span>·</span>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline"
              >
                <Github className="w-3.5 h-3.5 print:hidden" />
                <span>GitHub</span>
              </a>
              <span>·</span>
              <a
                href={profile.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline"
              >
                <span>LeetCode ({problemSolving.totalSolved})</span>
              </a>
            </div>
          </div>

          <p className="mt-4 text-xs sm:text-sm font-mono text-success print:text-black">
            {profile.availability}
          </p>
        </section>

        {/* Education */}
        <section className="space-y-3">
          <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-indigo print:text-black font-bold border-b border-border-subtle print:border-gray-300 pb-1.5">
            Education
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
            <div>
              <h3 className="font-heading font-bold text-base text-primary print:text-black">
                {profile.university}
              </h3>
              <p className="text-sm text-secondary print:text-gray-800">{profile.degree}</p>
            </div>
            <div className="sm:text-right font-mono text-xs text-secondary print:text-gray-800">
              <p>{profile.years}</p>
              <p className="font-semibold text-primary print:text-black">CGPA: {profile.cgpa}</p>
            </div>
          </div>
          <p className="text-xs text-secondary print:text-gray-700">
            <strong>Class XII:</strong> {profile.classXII} · <strong>JEE Main:</strong>{' '}
            {profile.jeeMain}
          </p>
        </section>

        {/* Experience */}
        <section className="space-y-5">
          <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-indigo print:text-black font-bold border-b border-border-subtle print:border-gray-300 pb-1.5">
            Experience
          </h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                <h3 className="font-heading font-bold text-base text-primary print:text-black">
                  {exp.role} — <span className="font-normal">{exp.company}</span>
                </h3>
                <span className="font-mono text-xs text-muted print:text-gray-700">
                  {exp.dates}
                </span>
              </div>
              <p className="font-mono text-xs text-indigo print:text-gray-700">
                Stack: {exp.stack.join(', ')}
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-secondary print:text-gray-800">
                {exp.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Featured Projects */}
        <section className="space-y-5">
          <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-indigo print:text-black font-bold border-b border-border-subtle print:border-gray-300 pb-1.5">
            Selected Projects
          </h2>
          {featuredProjects.map((proj) => (
            <div key={proj.slug} className="space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-heading font-bold text-base text-primary print:text-black">
                    {proj.title}
                  </h3>
                  <span className="font-mono text-xs text-muted print:text-gray-600">
                    ({proj.category} · {proj.year})
                  </span>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs">
                  {proj.links.repo && (
                    <a
                      href={proj.links.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo print:text-black hover:underline inline-flex items-center gap-1"
                    >
                      <span>Repo</span>
                      <ExternalLink className="w-3 h-3 print:hidden" />
                    </a>
                  )}
                  {proj.links.live && (
                    <a
                      href={proj.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan print:text-black hover:underline inline-flex items-center gap-1"
                    >
                      <span>Live</span>
                      <ExternalLink className="w-3 h-3 print:hidden" />
                    </a>
                  )}
                </div>
              </div>
              <p className="font-mono text-xs text-indigo print:text-gray-700">
                Stack: {proj.stack.join(', ')}
              </p>
              <p className="text-sm text-secondary print:text-gray-800">{proj.summary}</p>
            </div>
          ))}

          <div className="pt-2">
            <h3 className="font-heading font-semibold text-sm text-primary print:text-black mb-1">
              Additional Engineering &amp; Research Builds:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-secondary print:text-gray-800">
              {experimentProjects.map((exp) => (
                <li key={exp.slug}>
                  <strong className="text-primary print:text-black">{exp.title}:</strong>{' '}
                  {exp.summary}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Technical Skills */}
        <section className="space-y-2.5">
          <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-indigo print:text-black font-bold border-b border-border-subtle print:border-gray-300 pb-1.5">
            Technical Skills
          </h2>
          <div className="space-y-1.5 text-sm">
            {SKILL_CATEGORIES.map((category) => {
              const items = skills.filter((s) => s.category === category).map((s) => s.name);
              return (
                <p key={category} className="text-secondary print:text-gray-800">
                  <strong className="text-primary print:text-black font-mono text-xs uppercase mr-2">
                    {category}:
                  </strong>
                  {items.join(', ')}
                </p>
              );
            })}
          </div>
        </section>

        {/* Problem Solving & Certifications */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-indigo print:text-black font-bold border-b border-border-subtle print:border-gray-300 pb-1.5 mb-2.5">
              Problem Solving
            </h2>
            <p className="text-sm text-secondary print:text-gray-800">
              <strong className="text-primary print:text-black">LeetCode:</strong>{' '}
              {problemSolving.totalSolved} problems solved ({problemSolving.easy} Easy,{' '}
              {problemSolving.medium} Medium, {problemSolving.hard} Hard) ·{' '}
              <strong>{problemSolving.badges.join(', ')}</strong> badge ·{' '}
              {problemSolving.submissionsPastYear} submissions in the past year.
            </p>
          </div>

          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.14em] text-indigo print:text-black font-bold border-b border-border-subtle print:border-gray-300 pb-1.5 mb-2.5">
              Certifications
            </h2>
            <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-secondary print:text-gray-800">
              {certifications.map((cert) => (
                <li key={cert.title}>
                  {cert.issuer ? `${cert.issuer} — ` : ''}
                  <strong className="text-primary print:text-black">{cert.title}</strong> (
                  {cert.year})
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
