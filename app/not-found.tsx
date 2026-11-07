import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className="min-h-screen flex items-center justify-center bg-nebula px-4 text-center"
      >
        <div className="max-w-lg space-y-6">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-indigo bg-indigo/10 border border-indigo/30 px-4 py-1.5 rounded-pill">
            Error 404
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl font-bold text-primary tracking-tight">
            Lost in <span className="text-gradient-cosmic">space.</span>
          </h1>
          <p className="text-secondary text-base sm:text-lg">
            The coordinate you requested drifted outside this sector.
          </p>
          <div className="pt-2">
            <Button href="/" variant="primary" size="lg">
              Back to Earth →
            </Button>
          </div>
          <div className="pt-4">
            <Link
              href="/resume"
              className="font-mono text-xs text-muted hover:text-primary underline"
            >
              Or view Recruiter Resume Mode
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
