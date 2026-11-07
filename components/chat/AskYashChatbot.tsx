'use client';

import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  MessageSquare,
  X,
  Minimize2,
  Send,
  Trash2,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTION_CHIPS = [
  'What has Yash built?',
  "What's his strongest tech stack?",
  'Tell me about the NBC Bearings internship',
  'Is he open to relocating?',
  'How can I contact him?',
  'Is he a fit for an AI/ML role?',
];

const SESSION_STORAGE_KEY = 'ask_yash_chat_history_v1';
const TOOLTIP_SHOWN_KEY = 'ask_yash_tooltip_shown_v1';

/**
 * Cleanly formats raw URLs into compact readable labels so long GitHub/Render URLs never overflow the chat bubble
 */
function formatUrlDisplay(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    const path = parsed.pathname.replace(/\/$/, '');
    if (host === 'github.com' && path) {
      return `github.com${path}`;
    }
    return `${host}${path}`;
  } catch {
    return url;
  }
}

/**
 * Rich, safe Markdown renderer for assistant replies:
 * - Headings (#, ##, ###)
 * - Bullet lists (-, *, •) & numbered lists
 * - Markdown links [label](url) AND bare URLs (https://...)
 * - Bold (**text**), Italic (*text*), and Inline Code (`code`)
 */
function RenderMarkdown({ text }: { text: string }) {
  const lines = text.split('\n');

  const formatInline = (line: string): React.ReactNode[] => {
    // Match:
    // 1. Markdown link: [label](https://...)
    // 2. Bare URL: https://... (excluding trailing punctuation)
    // 3. Inline code: `code`
    // 4. Bold: **text**
    // 5. Italic: *text*
    const tokenRegex =
      /(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s)<]+)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*\n]+)\*)/g;

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index));
      }

      if (match[2] && match[3]) {
        // [label](url)
        parts.push(
          <a
            key={match.index}
            href={match[3]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-indigo underline underline-offset-2 hover:text-cyan font-medium break-all"
          >
            <span>{match[2]}</span>
            <ExternalLink className="w-3 h-3 shrink-0 inline" />
          </a>
        );
      } else if (match[4]) {
        // Bare URL — strip trailing punctuation like .,;:)
        let rawUrl = match[4];
        let trailing = '';
        while (/[.,;:!?]$/.test(rawUrl)) {
          trailing = rawUrl.slice(-1) + trailing;
          rawUrl = rawUrl.slice(0, -1);
        }
        parts.push(
          <React.Fragment key={match.index}>
            <a
              href={rawUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo/15 border border-indigo/30 text-indigo hover:text-cyan hover:border-cyan/40 font-mono text-[11px] break-all transition-colors"
            >
              <span>{formatUrlDisplay(rawUrl)}</span>
              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
            </a>
            {trailing}
          </React.Fragment>
        );
      } else if (match[5]) {
        // `code`
        parts.push(
          <code
            key={match.index}
            className="px-1.5 py-0.5 rounded bg-void/90 border border-border-subtle font-mono text-xs text-cyan break-words"
          >
            {match[5]}
          </code>
        );
      } else if (match[6]) {
        // **bold**
        parts.push(
          <strong key={match.index} className="text-primary font-semibold">
            {match[6]}
          </strong>
        );
      } else if (match[7]) {
        // *italic*
        parts.push(
          <em key={match.index} className="text-primary/90 italic font-medium">
            {match[7]}
          </em>
        );
      }

      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex));
    }

    return parts;
  };

  return (
    <div className="space-y-2 text-[13.5px] leading-relaxed break-words overflow-hidden">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={i} className="h-1" />;
        }

        // Markdown Headings (#, ##, ###)
        const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
        if (headingMatch) {
          return (
            <h4
              key={i}
              className="font-heading font-bold text-primary text-sm pt-1 first:pt-0"
            >
              {formatInline(headingMatch[2])}
            </h4>
          );
        }

        // Bullet list items (-, *, •)
        if (/^([-*•])\s+/.test(trimmed)) {
          const content = trimmed.replace(/^([-*•])\s+/, '');
          return (
            <div key={i} className="flex items-start gap-2 pl-0.5">
              <span
                className="text-indigo font-mono text-[10px] mt-1.5 shrink-0 select-none"
                aria-hidden="true"
              >
                ◆
              </span>
              <div className="min-w-0 flex-1 break-words">{formatInline(content)}</div>
            </div>
          );
        }

        // Numbered list items (1. , 2. )
        const numMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
        if (numMatch) {
          return (
            <div key={i} className="flex items-start gap-2 pl-0.5">
              <span className="text-indigo font-mono text-xs font-semibold mt-0.5 shrink-0 select-none">
                {numMatch[1]}.
              </span>
              <div className="min-w-0 flex-1 break-words">{formatInline(numMatch[2])}</div>
            </div>
          );
        }

        return (
          <p key={i} className="break-words">
            {formatInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

export function AskYashChatbot() {
  const prefersReducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load persisted messages from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as ChatMessage[];
        if (Array.isArray(parsed)) {
          setMessages(parsed);
        }
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Save messages to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Ignore
    }
  }, [messages]);

  // Show tooltip once per session after 6s
  useEffect(() => {
    try {
      if (sessionStorage.getItem(TOOLTIP_SHOWN_KEY)) return;
      const timer = setTimeout(() => {
        if (!isOpen) {
          setShowTooltip(true);
          sessionStorage.setItem(TOOLTIP_SHOWN_KEY, '1');
        }
      }, 6000);
      return () => clearTimeout(timer);
    } catch {
      return;
    }
  }, [isOpen]);

  // Listen for Command Palette open event + Esc key
  useEffect(() => {
    const handleOpenChatbot = () => {
      setIsOpen(true);
      setShowTooltip(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('open-chatbot', handleOpenChatbot);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('open-chatbot', handleOpenChatbot);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Scroll the internal chat container smoothly without hijacking page scroll
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: isStreaming ? 'auto' : 'smooth',
    });
  }, [messages, isStreaming, isOpen]);

  const sendMessage = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isStreaming) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    const assistantMsgId = `assistant-${Date.now()}`;
    const updatedMessages = [...messages, userMsg];

    setMessages([
      ...updatedMessages,
      { id: assistantMsgId, role: 'assistant', content: '' },
    ]);
    setInput('');
    setIsStreaming(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok || !response.body) {
        const errJson = await response.json().catch(() => ({}));
        const fallbackMsg =
          errJson.error ||
          'I could not connect right now. Please email yash.sigchi08@gmail.com or use the contact form!';
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantMsgId ? { ...m, content: fallbackMsg } : m))
        );
        setIsStreaming(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value, { stream: true });
        const lines = chunkText.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const payload = line.slice(6).trim();
          if (payload === '[DONE]') break;

          try {
            const parsed = JSON.parse(payload) as { text?: string; error?: string };
            if (parsed.error) {
              accumulated += parsed.error;
            } else if (parsed.text) {
              accumulated += parsed.text;
            }
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId ? { ...m, content: accumulated } : m
              )
            );
          } catch {
            // Ignore partial chunk JSON parse error
          }
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId
            ? {
                ...m,
                content:
                  'Network error while streaming response. You can reach Yash directly at yash.sigchi08@gmail.com!',
              }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const copyMessage = async (msg: ChatMessage) => {
    try {
      await navigator.clipboard.writeText(msg.content);
      setCopiedId(msg.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Ignore
    }
  };

  const clearChat = () => {
    setMessages([]);
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const userTurnCount = messages.filter((m) => m.role === 'user').length;

  return (
    <>
      {/* Floating Bottom-Right Orb Launcher */}
      <div className="fixed bottom-5 right-5 z-[160] flex flex-col items-end gap-2">
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-pill bg-surface border border-border-glow shadow-xl text-xs font-mono text-primary"
            >
              <span>Ask me anything about Yash 👋</span>
              <button
                type="button"
                onClick={() => setShowTooltip(false)}
                aria-label="Dismiss tooltip"
                className="text-muted hover:text-primary"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close Ask Yash AI assistant' : 'Open Ask Yash AI assistant'}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-btn-gradient text-primary shadow-btn-glow hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-indigo/40 animate-ping opacity-30"
          />
          {isOpen ? (
            <X className="w-6 h-6 relative z-10" />
          ) : (
            <MessageSquare className="w-6 h-6 relative z-10" />
          )}
        </button>
      </div>

      {/* Chat Glass Drawer (410x580 desktop, full-screen bottom sheet on mobile) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            data-lenis-prevent="true"
            role="dialog"
            aria-modal="false"
            aria-label="Ask Yash AI Assistant"
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 sm:inset-auto sm:bottom-24 sm:right-5 z-[170] w-full sm:w-[410px] h-[85vh] sm:h-[580px] max-h-[calc(100vh-7rem)] rounded-t-panel sm:rounded-panel bg-deep/95 border border-border-glow backdrop-blur-2xl shadow-[0_24px_70px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3.5 bg-surface/95 border-b border-border-subtle flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-9 h-9 rounded-full bg-btn-gradient flex items-center justify-center font-heading font-bold text-xs text-primary shrink-0">
                  YS
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-surface"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-heading font-bold text-sm text-primary truncate">
                      Ask Yash
                    </h3>
                    <Sparkles className="w-3.5 h-3.5 text-amber shrink-0" />
                  </div>
                  <p className="font-mono text-[11px] text-secondary truncate">
                    AI Portfolio Assistant · Grounded
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={clearChat}
                    title="Clear chat"
                    aria-label="Clear chat history"
                    className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-white/5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Minimize"
                  aria-label="Minimize chat"
                  className="p-1.5 rounded-lg text-muted hover:text-primary hover:bg-white/5 transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ARIA Live Message List (data-lenis-prevent stops page scroll hijacking) */}
            <div
              ref={scrollContainerRef}
              data-lenis-prevent="true"
              aria-live="polite"
              className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 space-y-4 overscroll-contain"
            >
              {messages.length === 0 ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-card bg-surface/90 border border-border-subtle text-sm text-secondary leading-relaxed">
                    Hi! I&apos;m <strong className="text-primary">Ask Yash</strong>. Ask me about
                    Yash&apos;s internships, projects, tech stack, availability, or role fit—or pick
                    a question below:
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {SUGGESTION_CHIPS.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => sendMessage(suggestion)}
                        className="text-left px-3 py-1.5 rounded-pill bg-glass border border-border-subtle hover:border-indigo/50 text-xs font-mono text-secondary hover:text-primary transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col w-full ${
                      msg.role === 'user' ? 'items-end' : 'items-stretch'
                    }`}
                  >
                    <div
                      className={`rounded-card px-4 py-3 overflow-hidden ${
                        msg.role === 'user'
                          ? 'max-w-[85%] bg-indigo/25 border border-indigo/40 text-primary text-sm break-words'
                          : 'w-full bg-surface/95 border border-border-subtle text-secondary'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        msg.content ? (
                          <RenderMarkdown text={msg.content} />
                        ) : (
                          /* Typing Indicator */
                          <div className="flex items-center gap-1.5 py-1.5 px-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo animate-bounce" />
                            <span className="w-1.5 h-1.5 rounded-full bg-magenta animate-bounce [animation-delay:150ms]" />
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-bounce [animation-delay:300ms]" />
                          </div>
                        )
                      ) : (
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                      )}
                    </div>

                    {msg.role === 'assistant' && msg.content && (
                      <div className="mt-1.5 flex items-center justify-end px-1">
                        <button
                          type="button"
                          onClick={() => copyMessage(msg)}
                          aria-label="Copy response"
                          className="inline-flex items-center gap-1 font-mono text-[10px] text-muted hover:text-primary transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-success" />
                              <span className="text-success">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy answer</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}

              {/* Nudge Chip after 3+ turns */}
              {userTurnCount >= 3 && (
                <div className="pt-2 flex justify-center">
                  <a
                    href="/#contact"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-pill bg-indigo/15 border border-indigo/40 font-mono text-xs text-primary hover:bg-indigo/25 transition-colors"
                  >
                    <span>Want to talk to the real Yash? → Contact</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan" />
                  </a>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-surface/95 border-t border-border-subtle shrink-0">
              <div className="flex items-end gap-2">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  maxLength={500}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Yash (Enter to send)..."
                  aria-label="Message Ask Yash"
                  className="flex-1 max-h-24 px-3.5 py-2.5 rounded-card bg-void/90 border border-border-subtle text-xs sm:text-sm text-primary placeholder:text-muted focus:border-indigo focus:outline-none resize-none"
                />
                <button
                  type="button"
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isStreaming}
                  aria-label="Send message"
                  className="p-2.5 rounded-card bg-btn-gradient text-primary disabled:opacity-40 transition-opacity shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-muted px-1">
                <span>Enter sends · Shift+Enter newline</span>
                <span>{input.length}/500</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
