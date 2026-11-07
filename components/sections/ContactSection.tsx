'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  Copy,
  Check,
  Github,
  Linkedin,
  MapPin,
  Clock,
  Send,
  AlertCircle,
} from 'lucide-react';
import { profile } from '@/data/profile';
import { contactSchema, INQUIRY_TYPES, type ContactFormValues } from '@/lib/contactSchema';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';

export function ContactSection() {
  const prefersReducedMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );
  const [serverError, setServerError] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      company: '',
      website: '',
      inquiryType: 'Internship',
      message: '',
      honeypot: '',
    },
  });

  const messageValue = watch('message') || '';

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitStatus('loading');
    setServerError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setSubmitStatus('error');
        setServerError(
          data.error || 'Could not send message right now. Please email yash.sigchi08@gmail.com directly.'
        );
        return;
      }

      setSubmitStatus('success');
      reset();
    } catch {
      setSubmitStatus('error');
      setServerError(
        'Network error while sending message. Please email yash.sigchi08@gmail.com directly.'
      );
    }
  };

  return (
    <section id="contact" className="section-padding bg-void relative overflow-hidden">
      <div className="mx-auto max-w-container px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="08"
          label="Contact"
          title="Let's talk."
          highlightWord="talk."
          handNote="I read every message ✨"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Info Column (5 cols) — NEVER shows phone number */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard hoverLift={false} className="p-6 sm:p-8 space-y-6">
              {/* Availability Pill */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-pill bg-success/10 border border-success/30 text-xs font-mono text-success">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse shrink-0" />
                <span>{profile.availability}</span>
              </div>

              {/* Click-to-copy Email */}
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-muted mb-2">
                  Direct Email
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={`mailto:${profile.email}`}
                    className="font-heading text-lg sm:text-xl font-bold text-primary hover:text-indigo transition-colors break-all"
                  >
                    {profile.email}
                  </a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    aria-label="Copy email address"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-glass border border-border-subtle hover:border-border-glow font-mono text-xs text-secondary hover:text-primary transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-success" />
                        <span className="text-success">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-indigo" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Social Profiles */}
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-muted mb-3">
                  Profiles
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-glass border border-border-subtle hover:border-border-glow text-sm text-secondary hover:text-primary transition-colors"
                  >
                    <Linkedin className="w-4 h-4 text-indigo" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-pill bg-glass border border-border-subtle hover:border-border-glow text-sm text-secondary hover:text-primary transition-colors"
                  >
                    <Github className="w-4 h-4 text-indigo" />
                    <span>GitHub</span>
                  </a>
                </div>
              </div>

              {/* Location & Response Time */}
              <div className="pt-4 border-t border-border-subtle space-y-3 text-sm text-secondary">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-cyan shrink-0" />
                  <span>Jaipur, India · open to relocate and remote</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber shrink-0" />
                  <span>I&apos;ll reply within 24 hours.</span>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Right Form Card (7 cols) */}
          <div className="lg:col-span-7">
            <GlassCard hoverLift={false} className="p-6 sm:p-8 md:p-10">
              <h3 className="font-heading text-2xl font-bold text-primary mb-2">
                Send a short briefing
              </h3>
              <p className="text-sm text-secondary mb-6">
                Fill in a few details below and both you and I will receive an instant email
                confirmation.
              </p>

              <AnimatePresence mode="wait">
                {submitStatus === 'success' ? (
                  <motion.div
                    key="success-card"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 px-6 text-center space-y-5"
                  >
                    {/* Framer SVG Paper Plane Flying Animation (No WebGL) */}
                    <div className="relative mx-auto w-20 h-20 rounded-full bg-success/15 border border-success/40 flex items-center justify-center overflow-hidden">
                      <motion.svg
                        viewBox="0 0 24 24"
                        width="36"
                        height="36"
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-success"
                        initial={
                          prefersReducedMotion
                            ? { x: 0, y: 0, opacity: 1 }
                            : { x: -24, y: 24, opacity: 0 }
                        }
                        animate={
                          prefersReducedMotion
                            ? { x: 0, y: 0, opacity: 1 }
                            : {
                                x: [-24, 0, 0, 34],
                                y: [24, 0, 0, -34],
                                opacity: [0, 1, 1, 0],
                              }
                        }
                        transition={{
                          duration: 2.2,
                          times: [0, 0.35, 0.75, 1],
                          repeat: Infinity,
                          repeatDelay: 0.6,
                        }}
                      >
                        <path d="M22 2L11 13" />
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                      </motion.svg>
                    </div>

                    <h4 className="font-heading text-2xl font-bold text-primary">
                      Message sent! ✨
                    </h4>
                    <p className="text-secondary max-w-md mx-auto text-sm sm:text-base">
                      Thanks for reaching out. I&apos;ve sent a confirmation copy to your inbox and
                      will reply within 24 hours.
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setSubmitStatus('idle')}
                    >
                      Send another message
                    </Button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="contact-form"
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="space-y-5"
                  >
                    {/* Hidden Honeypot Field */}
                    <div className="sr-only" aria-hidden="true">
                      <label htmlFor="honeypot">Do not fill this field</label>
                      <input
                        id="honeypot"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        {...register('honeypot')}
                      />
                    </div>

                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block font-mono text-xs uppercase tracking-wider text-secondary mb-1.5"
                        >
                          First name <span className="text-danger">*</span>
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          placeholder="Ada"
                          {...register('firstName')}
                          aria-invalid={!!errors.firstName}
                          className="w-full px-4 py-3 rounded-card bg-void/70 border border-border-subtle text-primary placeholder:text-muted text-sm focus:border-indigo focus:outline-none transition-colors"
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-xs text-danger">{errors.firstName.message}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="lastName"
                          className="block font-mono text-xs uppercase tracking-wider text-secondary mb-1.5"
                        >
                          Last name
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          placeholder="Lovelace"
                          {...register('lastName')}
                          className="w-full px-4 py-3 rounded-card bg-void/70 border border-border-subtle text-primary placeholder:text-muted text-sm focus:border-indigo focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Email & Inquiry Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="email"
                          className="block font-mono text-xs uppercase tracking-wider text-secondary mb-1.5"
                        >
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          placeholder="ada@company.com"
                          {...register('email')}
                          aria-invalid={!!errors.email}
                          className="w-full px-4 py-3 rounded-card bg-void/70 border border-border-subtle text-primary placeholder:text-muted text-sm focus:border-indigo focus:outline-none transition-colors"
                        />
                        {errors.email && (
                          <p className="mt-1 text-xs text-danger">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="inquiryType"
                          className="block font-mono text-xs uppercase tracking-wider text-secondary mb-1.5"
                        >
                          Inquiry type
                        </label>
                        <select
                          id="inquiryType"
                          {...register('inquiryType')}
                          className="w-full px-4 py-3 rounded-card bg-void/70 border border-border-subtle text-primary text-sm focus:border-indigo focus:outline-none transition-colors"
                        >
                          {INQUIRY_TYPES.map((type) => (
                            <option key={type} value={type} className="bg-surface text-primary">
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Company & Website/LinkedIn */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="company"
                          className="block font-mono text-xs uppercase tracking-wider text-secondary mb-1.5"
                        >
                          Company (optional)
                        </label>
                        <input
                          id="company"
                          type="text"
                          placeholder="Acme Corp"
                          {...register('company')}
                          className="w-full px-4 py-3 rounded-card bg-void/70 border border-border-subtle text-primary placeholder:text-muted text-sm focus:border-indigo focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="website"
                          className="block font-mono text-xs uppercase tracking-wider text-secondary mb-1.5"
                        >
                          Website / LinkedIn (optional)
                        </label>
                        <input
                          id="website"
                          type="text"
                          placeholder="https://linkedin.com/in/..."
                          {...register('website')}
                          className="w-full px-4 py-3 rounded-card bg-void/70 border border-border-subtle text-primary placeholder:text-muted text-sm focus:border-indigo focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Message with live counter */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label
                          htmlFor="message"
                          className="block font-mono text-xs uppercase tracking-wider text-secondary"
                        >
                          Message <span className="text-danger">*</span>
                        </label>
                        <span
                          className={`font-mono text-[11px] ${
                            messageValue.trim().length < 10 ? 'text-muted' : 'text-success'
                          }`}
                        >
                          {messageValue.length} / 2000 chars (min 10)
                        </span>
                      </div>
                      <textarea
                        id="message"
                        rows={4}
                        placeholder="Tell me about the role, team, or project..."
                        {...register('message')}
                        aria-invalid={!!errors.message}
                        className="w-full px-4 py-3 rounded-card bg-void/70 border border-border-subtle text-primary placeholder:text-muted text-sm focus:border-indigo focus:outline-none transition-colors resize-y"
                      />
                      {errors.message && (
                        <p className="mt-1 text-xs text-danger">{errors.message.message}</p>
                      )}
                    </div>

                    {/* Error Banner */}
                    {submitStatus === 'error' && serverError && (
                      <div
                        role="alert"
                        className="flex items-start gap-2.5 p-3.5 rounded-card bg-danger/10 border border-danger/30 text-xs sm:text-sm text-danger"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{serverError}</span>
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between gap-4">
                      <p className="text-xs text-muted font-mono">
                        Protected against spam · Direct to inbox
                      </p>
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={submitStatus === 'loading'}
                      >
                        <span>
                          {submitStatus === 'loading' ? 'Sending briefing...' : 'Send message'}
                        </span>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
