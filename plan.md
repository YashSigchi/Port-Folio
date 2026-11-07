# Yash Sigchi Portfolio — Master Build Plan (`plan.md`)

> **Status Tracker:** Update the checkboxes (`[ ]` → `[x]`) and Stage Status below as each task and stage is completed and verified with `npm run build`. This file serves as the persistent checkpoint to resume from at any time.

---

## Overall Progress

| Stage | Title | Status | Build Verified |
| :--- | :--- | :--- | :--- |
| **Stage 1** | Foundation, Design System & Typed Data | ✅ Completed | `[x]` |
| **Stage 2** | Home Sections Part 1 (Hero Shell, About, Experience, Work) | ✅ Completed | `[x]` |
| **Stage 3** | Home Sections Part 2 (Disciplines, Skills 2D, Process, Achievements, Beyond, FAQ, Contact UI) | ✅ Completed | `[x]` |
| **Stage 4** | Pages & Four Extras (Case Studies, Diagrams, Command Palette, Recruiter Mode, Terminal) | ✅ Completed | `[x]` |
| **Stage 5** | 3D & WebGL Budget (Hero Neural Nebula, Skills Constellation, Floating Accents, Playground) | ✅ Completed | `[x]` |
| **Stage 6** | Backend (`POST /api/contact` Dual Emails & "Ask Yash" Streaming Chatbot) | ✅ Completed | `[x]` |
| **Stage 7** | Final QA, SEO, Performance, Security & Docs | ✅ Completed | `[x]` |

---

## Standing Rules & Resolved Decisions (Enforced in Every Stage)

1. **NO STUBS:** Never write `// TODO`, empty `<div>` placeholders, or "implement later". Fully implement everything in the current stage, and do not start anything outside it.
2. **PINNED VERSIONS (Do NOT upgrade to React 19 or Next 15):**
   - `next@14.2.x`, `react@18.3.1`, `react-dom@18.3.1`, `typescript@5`, `tailwindcss@3.4`
   - `three@0.160.x`, `@react-three/fiber@8.x`, `@react-three/drei@9.x`, `@react-three/postprocessing@2.16.x`, `@react-three/rapier@1.x`
   - `framer-motion@11.x`, `lenis` (`lenis/react` → `<ReactLenis root>`), `react-hook-form`, `zod`, `nodemailer`, `@anthropic-ai/sdk`
   - Use `--legacy-peer-deps` if needed; never bump React.
3. **ANIMATION LANES (No Overlaps):**
   - **Framer Motion** owns ALL JS animation: reveals (`whileInView`), tabs, accordions, modals, hover tilts, layout/filter transitions, `AnimatePresence`, chatbot drawer, AND scroll-linked effects via `useScroll` + `useTransform` (including sticky "How I work" stack).
   - **Lenis** provides smooth scrolling only (`<ReactLenis root>`).
   - **NO GSAP or ScrollTrigger** anywhere. Do not install them.
   - Never put two systems on the same DOM node's transform/opacity. Pure CSS handles simple hover states (color, border, glow) only.
   - Every animated element must have a visible end state if JS fails.
   - Honor `prefers-reduced-motion`: disable parallax, auto-rotation, cursor effects, and Lenis; show static equivalents.
4. **WEBGL RULE:**
   - Maximum **TWO `<Canvas>` instances** on the Home page (1. Hero scene; 2. Lazy-loaded Skills constellation).
   - `/playground` is a separate route with its own single `<Canvas>`.
   - Floating accents and contact-success animation use Framer Motion CSS 3D transforms / SVG, NOT extra Canvases.
   - Every Canvas: dynamic-imported with `ssr: false`, wrapped in `Suspense`, `dpr` capped at `[1, 1.5]`, paused when off-screen (`IntersectionObserver` → `frameloop="never"/"always"`), handles `"webglcontextlost"` (`preventDefault()` + swap to static fallback), and disposes geometries/materials on unmount. Mobile and reduced-motion users get the static fallback.
5. **CONTENT:**
   - Sourced strictly from typed `/data` files. Never invent employers, metrics, dates, or links. No fake skill-percentage bars.
   - **1M1B internship:** Included (Jul–Aug 2025, AI + ClimateTech Intern, Bus Route Optimizer). No invented metrics.
   - **Job-simulation certificate:** Shown as `"Technology Job Simulation"` with empty `issuer: ""` in `data/certifications.ts` (hidden in UI when empty).
   - **Phone number:** NEVER rendered anywhere in the UI or client bundle. Lives ONLY in `data/knowledge.ts` (`+91 88752-50627`) and shared by the chatbot only if explicitly requested.
   - **Availability exact wording:** `"Available for immediate 6-month internships (Jan–Jun 2027) and full-time roles starting June 2027."`
6. **CODE QUALITY:**
   - TypeScript strict, ESLint + Prettier, App Router, `/components/{ui,sections,three,chat}`, `/lib`. Semantic HTML, WCAG AA contrast, visible focus rings, keyboard navigation.
7. **VERIFICATION:**
   - Run `npm run build` at the end of every stage, fix all errors/warnings, update this `plan.md`, and summarize.

---

## Design System Specifications

### Color Tokens (Dark Cosmic)
- `--bg-void`: `#05060F` (Page background)
- `--bg-deep`: `#0A0B1E` (Alternate sections)
- `--bg-surface`: `#11132B` (Cards, panels)
- `--bg-glass`: `rgba(255,255,255,0.04)` (Glass fill)
- `--border-subtle`: `rgba(255,255,255,0.08)` (Hairlines)
- `--border-glow`: `rgba(129,140,248,0.35)` (Hover borders)
- `--text-primary`: `#F4F5FF` (Headings)
- `--text-secondary`: `#A9ADCB` (Body)
- `--text-muted`: `#6B7094` (Captions)
- `--accent-indigo`: `#818CF8` (Links, focus rings, tags)
- `--accent-violet`: `#8B5CF6` (Gradient mid)
- `--accent-magenta`: `#D946EF` (Gradient end)
- `--accent-cyan`: `#22D3EE` (Secondary accent, rim light)
- `--accent-amber`: `#FBBF24` (Handwritten highlights)
- `--accent-lavender`: `#C4B5FD` (Handwritten notes)
- `--success`: `#22C55E` ("Open to work" dot, form success)
- `--danger`: `#F43F5E` (Errors)

### Gradients & Effects
- **Nebula backdrop:** `radial-gradient(60% 50% at 70% 20%, rgba(139,92,246,0.45), transparent 60%), radial-gradient(50% 40% at 20% 80%, rgba(34,211,238,0.25), transparent 60%), radial-gradient(40% 40% at 90% 90%, rgba(217,70,239,0.3), transparent 60%), #05060F`
- **Text gradient:** `linear-gradient(90deg, #818CF8, #D946EF 60%, #22D3EE)`
- **Button gradient:** `linear-gradient(135deg, #6366F1, #8B5CF6 50%, #D946EF)` + glow `0 0 40px rgba(139,92,246,0.45)`
- **Film grain:** 3–4% overlay across the whole page.

### Typography (`next/font`)
- **Headings:** `Space Grotesk` (500–700, tracking `-0.03em`, hero H1 `clamp(2.75rem, 7vw, 6.5rem)`, line-height `1.02`)
- **Body:** `Inter` (`16–18px` / `1.65`)
- **Labels:** `JetBrains Mono` (uppercase `12px`, tracking `0.12em`)
- **Handwritten:** `Caveat` (`22–26px`, rotated `-2°` to `3°`)

### Exact Hand-Drawn SVG Paths
- `<HandArrow />`: `viewBox="0 0 140 90"` with `M8 12 C 38 6, 96 18, 112 62` and `M98 54 L113 66 L120 46`
- `<HandUnderline />`: `viewBox="0 0 220 14"` with `M3 9 C 40 3, 78 12, 118 6 S 190 9, 217 4`

---

## Stage-by-Stage Task Breakdown

### STAGE 1 — Foundation, Design System & Data
- [x] **1.1 Project Scaffolding & Pinned Dependencies:** Scaffold Next.js 14.2 + React 18.3.1 + TypeScript 5 + Tailwind CSS 3.4 + all pinned packages (`framer-motion`, `lenis`, `three`, R3F, Rapier, `react-hook-form`, `zod`, `nodemailer`, `@anthropic-ai/sdk`). Verify no GSAP and React is strictly `18.3.1`.
- [x] **1.2 Tailwind & Global CSS:** Configure all color tokens, gradients, typography variables, 8px spacing, radii, glass utilities, 3–4% film-grain overlay, focus rings, and selection styles in `tailwind.config.ts` and `app/globals.css`.
- [x] **1.3 Layout Shell & Providers:**
  - Load `Space Grotesk`, `Inter`, `JetBrains Mono`, and `Caveat` via `next/font/google`.
  - Set up `<ReactLenis root>` provider (disabled under `prefers-reduced-motion`).
  - Build top scroll-progress bar (`useScroll`).
  - Build custom cursor (dot + trailing ring with dynamic label support like "View", disabled on touch/reduced-motion).
  - Build floating glass Navbar (logo "YS", links: About · Experience · Work · Skills · Process · Contact, pulsing green "Open to work" pill, Resume button, mobile full-screen menu).
  - Build Footer shell and route transition wrapper (Framer fade + slight scale).
- [x] **1.4 UI Primitives (`components/ui/*`):**
  - `Button` (primary gradient / ghost)
  - `Chip` (with `◆` separators)
  - `GlassCard` (backdrop blur, hairline border, hover lift 6px + pointermove spotlight glow via CSS variables)
  - `SectionHeader` (mono bracket label `[01] ...` + heading + optional `HandUnderline`)
  - `SplitText`, `CountUp`, `MagneticButton`
  - `HandArrow` & `HandUnderline` (using exact SVG paths + Framer `pathLength` draw animation)
- [x] **1.5 Typed Data Files (`data/*`):**
  - `data/profile.ts` (Name, Jaipur, VIT Chennai, 8.72 CGPA, 93% Class XII, 94.8%ile JEE, links, exact availability string, stats, learningNow; NO phone number)
  - `data/experience.ts` (NBC Bearings, Tachyon Robotics, 1M1B)
  - `data/projects.ts` (6 featured: `tool-room-requisition`, `societyhub`, `ai-customer-support`, `faers-adr-xai`, `bhashabridge`, `dilketaar` + 7 experiments + filter tags)
  - `data/skills.ts` (Grouped languages, backend, frontend, databases, AI/ML, DevOps/tools, learning + `usedIn: string[]`)
  - `data/certifications.ts` (7 certs including IBM Agentic AI verifyUrl and Technology Job Simulation with empty issuer `""`)
  - `data/problemSolving.ts` (LeetCode 241: 107 Easy, 116 Medium, 18 Hard; Top SQL 50; 445 submissions)
  - `data/workflows.ts` (NBC 8-stage requisition flow + LangGraph 4-agent support routing flow)
  - `data/knowledge.ts` (`KNOWLEDGE_BASE` string including phone number flagged for explicit request only)
- [x] **1.6 Shell Verification:** Render Navbar, empty `<main>`, and Footer in `app/page.tsx`. Run `npm run build` and verify cleanly.

---

### STAGE 2 — Home Sections, Part 1 (Hero Shell, About, Experience, Work)
- [x] **2.1 Hero Section (`[01] SOFTWARE ENGINEER · AI/ML ENGINEER`):**
  - Full viewport with nebula backdrop & `<HeroScene />` static CSS nebula orb fallback slot.
  - H1 with `SplitText` reveal, gradient keywords + `HandUnderline`: *"I build backend systems that ship and AI that explains itself."*
  - Sub-copy, primary CTA ("Start a conversation" → `#contact`), ghost CTA ("Selected work" → `#work`), social icon row (GitHub, LinkedIn, Email, Resume).
  - Green pulsing availability chip (`profile.availability`).
  - Rotating typed tagline (Framer) cycling the 3 taglines.
  - `CountUp` stat row from `profile.stats`.
  - Tilted polaroid portrait (`-3°`, "2026" stamp, `/images/yash.jpg` with gradient-initials fallback, handwritten note *"hi, that's me! ✨"* + `HandArrow`) and scroll cue.
- [x] **2.2 `[02] About` Section:**
  - Heading *"Yash Sigchi."* with chips `◆ Backend ◆ AI/ML ◆ Full-Stack`.
  - Accessible ARIA tabs (**Main bio / Story / Work**) with Framer `layoutId` underline and `AnimatePresence` cross-fade.
  - 4-up stat grid (2027 graduating · 3 internships · 8.72 CGPA · availability line).
  - Four principle cards with slight tilts & handwritten notes in `--accent-lavender` (*"Ship it for real"*, *"Design for the audit"*, *"Explain the model"*, *"Build with the team"* + `HandArrow` on at most two cards).
  - "Currently learning" chips from `profile.learningNow`.
- [x] **2.3 `[03] Experience` Section:**
  - Vertical glowing timeline with expandable `GlassCard` entries (Framer layout animation), stack chips, and *"Read the case study"* link on NBC Bearings (`/projects/tool-room-requisition`).
- [x] **2.4 `[04] Selected work` Section:**
  - Numbered rows `01–06` for featured projects with hover text-swap (Framer vertical slide), "View project", and floating cursor-following preview card (CSS gradient thumbnail per project).
  - "More experiments" grid below with filter chips (`All / Full-Stack / AI-ML / Computer Vision / Security / Systems`) and Framer layout transitions.
- [x] **2.5 Stage 2 Verification:** Check responsive layout at `360px`, `768px`, `1440px`, reduced-motion static state, and run `npm run build`.

---

### STAGE 3 — Home Sections, Part 2 (Disciplines, Skills 2D, Process, Achievements, Beyond, FAQ, Contact UI)
- [x] **3.1 `[05] What I do` (Disciplines):**
  - Four numbered disciplines in `GlassCard`s with 3D hover tilt (max `8°`, Framer `useMotionValue` + `useTransform`): `01 Backend & Systems`, `02 AI / ML Engineering`, `03 Agentic AI & RAG`, `04 Full-Stack & DevOps`.
- [x] **3.2 Skills (2D Accessible Grid):**
  - Category tabs/filter + tech chips from `skills.ts`. Click/focus chip opens popover showing *"Used in: …"*. No percentage bars.
- [x] **3.3 `[06] How I work` (Sticky Scroll Stack):**
  - Sticky scroll-driven 4-step stack (`useScroll` + `useTransform`): `01 Understand`, `02 Design`, `03 Build`, `04 Ship & Harden` with `01 / 04` mono counters and CSS abstract illustrations. Normal vertical list fallback on mobile.
- [x] **3.4 Achievements & Certifications:**
  - Animated stat tiles (CGPA 8.72/10, JEE Main 94.8%ile, Class XII 93%, LeetCode 241 with Easy/Med/Hard split, Top SQL 50 badge).
  - Infinite marquee of glass certification badges from `certifications.ts` (pause on hover, "Verify" link where `verifyUrl` exists, hide empty issuer, static wrapped grid under reduced motion).
- [x] **3.5 Beyond the Code (Crayon Strip):**
  - Four slightly rotated sticker cards with Framer `drag` + spring-back and handwritten notes: *Fast learner*, *Curious*, *Team player*, *When AFK*.
- [x] **3.6 `[07] FAQ` Accordion:**
  - Accessible Framer height-animated accordion with the 6 required items + link *"Read my resume"* → `/resume`.
- [x] **3.7 `[08] Contact` (UI + Client Validation):**
  - Heading *"Let's talk."* + handwritten *"I read every message ✨"*.
  - Left column: click-to-copy email with toast, LinkedIn, GitHub, location, availability pill, 24h reply note (NO phone number).
  - Right column: "Send a short briefing" glass form card using `react-hook-form` + shared `lib/contactSchema.ts` (Zod), live character counter, honeypot field, loading/error/success states, and Framer SVG paper-plane success animation.
- [x] **3.8 Complete Footer:**
  - Name + role, nav links, social icons, "Back to top" button, oversized outlined `"YASH SIGCHI"` wordmark, `© 2026 Yash Sigchi`.
- [x] **3.9 Stage 3 Verification:** Verify full home page scroll, form validation, and run `npm run build`.

---

### STAGE 4 — Pages & The Four Extras
- [x] **4.1 Case-Study Pages (`/projects/[slug]`):**
  - Static generation (`generateStaticParams`) from `projects.ts`.
  - Sections: Hero (title, tags, links), Problem → Approach → Key decisions → Challenges and fixes → Stack → Links, plus Previous/Next project nav.
- [x] **4.2 Architecture Diagrams (`components/sections/WorkflowDiagram.tsx`):**
  - Driven by `data/workflows.ts` and rendered on `tool-room-requisition` and `ai-customer-support` case studies.
  - CSS Grid/Flexbox node cards with connector lines computed dynamically via refs (`getBoundingClientRect`), glowing Framer packet animation on scroll into view, branch nodes in a row, role legend, and `"Simplified view"` badge. Vertical stack on mobile.
- [x] **4.3 Command Palette (`⌘/Ctrl+K` + Nav button):**
  - Searchable modal (`AnimatePresence`, focus trap, arrow-key navigation, Esc to close) to jump to sections, open projects, open `/resume`, or copy email.
- [x] **4.4 Recruiter Mode (`/resume`):**
  - Clean, fast, zero-animation, print-friendly HTML resume from `/data` with `@media print` black-on-white styles, *"Download resume"* button (`profile.resume`), and *"Back to portfolio"* link.
- [x] **4.5 Terminal Easter Egg:**
  - Triggered by pressing `` ` `` (backtick) or typing `terminal` outside inputs.
  - Bottom drawer with commands: `help`, `whoami`, `skills`, `projects`, `experience`, `contact`, `clear`, `sudo hire yash`. All output from `/data`, no phone number.
- [x] **4.6 Custom 404 & Loading States:**
  - `app/not-found.tsx` (*"Lost in space. Back to Earth →"*) and `app/loading.tsx`.
- [x] **4.7 Stage 4 Verification:** Verify static route builds, diagram responsiveness at `360px` & `1440px`, keyboard accessibility, and `npm run build`.

---

### STAGE 5 — 3D (Strict WebGL Budget)
- [x] **5.1 Performance Tier Hook (`lib/usePerformanceTier.ts`):**
  - Inspect `hardwareConcurrency`, `deviceMemory`, pointer type, and `prefers-reduced-motion` to select particle counts or static fallback.
- [x] **5.2 Hero Canvas #1 — "Neural Nebula" (`components/three/HeroScene.tsx`):**
  - Dynamic import (`ssr: false`), `Suspense`, `dpr={[1, 1.5]}`, off-screen pause (`IntersectionObserver` → `frameloop`), `webglcontextlost` handler, geometry/material disposal.
  - Slowly rotating iridescent physical/transmission core + orbiting particle field (~3000 desktop / ~800 mid) + ~12 neural network nodes with connecting lines + starfield + single `<Bloom>` pass + cursor parallax tilt + scroll dolly/scale.
- [x] **5.3 Skills Canvas #2 — "Constellation" (`components/three/SkillsConstellation.tsx`):**
  - Lazy-loaded near viewport; desktop *"Switch to 3D view"* toggle alongside the Stage 3 2D grid (2D remains default on mobile/reduced-motion).
  - Orbiting tech nodes grouped by category color, hover highlight, click to pin *"Used in: …"* card, drag rotation with inertia. Fully unmounts when toggle is off or far off-screen.
- [x] **5.4 Floating Accents (NO Canvas):**
  - 4–5 CSS/Framer 3D shapes (rotating wireframe cube with "YS" mark, gradient orbs, glass rings) using `useTransform` scroll parallax (`pointer-events: none`, `aria-hidden="true"`, hidden under reduced motion).
- [x] **5.5 Playground Route (`/playground`):**
  - Single dedicated `<Canvas>` with `@react-three/rapier` physics: falling tech-stack tiles inside a bounding box, pointer fling interaction, "Reset" button, unmount disposal, static fallback on unsupported devices.
- [x] **5.6 Stage 5 Verification:** Confirm max 2 Canvases on `/`, test full-page scroll without WebGL context loss, and run `npm run build`.

---

### STAGE 6 — Backend: Contact Emails & "Ask Yash" Chatbot
- [x] **6.1 Mailer & `POST /api/contact`:**
  - Shared Zod validation (`lib/contactSchema.ts`), silent honeypot rejection, HTML stripping sanitization.
  - Rate limiter: 3 submissions / IP / 10 mins (in-memory Map with TTL + optional Upstash Redis support).
  - `sendMail()` abstraction supporting `MAIL_PROVIDER=smtp|resend` (Nodemailer Gmail App Password + Resend HTTPS API).
  - Send **both** emails via `Promise.allSettled`:
    1. Owner notification to `OWNER_EMAIL` (`yash.sigchi08@gmail.com`) with `replyTo` inquirer, IST timestamp, branded table-based HTML + plain text.
    2. Auto-reply to inquirer (`Thanks for reaching out, {firstName}!`) quoting message, 24h reply promise, links to GitHub/LinkedIn/resume/projects.
  - Create `.env.example` and `scripts/test-contact.ts` covering validation, honeypot, and rate limiting.
- [x] **6.2 Chatbot API (`POST /api/chat`):**
  - Server-only streaming endpoint (`ReadableStream` / SSE) using `@anthropic-ai/sdk` (`CHAT_MODEL`, `temperature: 0.3`, max input 500 chars, 20 msgs / 10 min / IP rate limit).
  - Exact system prompt + `KNOWLEDGE_BASE` from `data/knowledge.ts`.
- [x] **6.3 Chatbot UI (`components/chat/*`):**
  - Floating bottom-right gradient orb launcher (pulsing, 6s one-time session tooltip *"Ask me anything about Yash 👋"*).
  - Glass chat drawer (`~380×560` desktop, full-screen bottom sheet mobile) with streaming messages, typing indicator, markdown rendering, copy button, `Enter` to send / `Shift+Enter` newline, "Clear chat", 6 initial suggestion chips, and *"Want to talk to the real Yash? → Contact"* nudge after 3+ turns.
  - Persist in `sessionStorage`, focus trap, `Esc` to close, ARIA live region, and wire *"Ask Yash"* into the Command Palette.
- [x] **6.4 Stage 6 Verification:** Run contact tests, verify chatbot streaming & guardrails, and run `npm run build`.

---

### STAGE 7 — Final QA, SEO & Deployment
- [x] **7.1 SEO & Metadata:**
  - Per-page metadata, Open Graph / Twitter cards with static `/og.png`, JSON-LD `Person` schema, `app/sitemap.ts`, `app/robots.ts`, canonical URLs.
- [x] **7.2 Performance & Code-Splitting Audit:**
  - Verify `next/image` usage, confirm Three.js/Canvas chunks are code-split and never loaded on `/resume`.
- [x] **7.3 Accessibility & Reduced-Motion Walkthrough:**
  - Skip-to-content link, AA contrast, focus rings, keyboard walkthrough (nav, tabs, accordion, command palette, terminal, chatbot), `prefers-reduced-motion` pass.
- [x] **7.4 Security Headers & Sweep:**
  - Configure CSP, `X-Frame-Options`, `Referrer-Policy`, and CORS in `next.config.mjs`.
  - Grep codebase & `.next` build output to confirm: zero `GSAP`/`ScrollTrigger`, zero `TODO` or `[CONFIRM]`, zero phone number leaks in client bundles, and at most two Canvases on `/`.
- [x] **7.5 Documentation (`README.md` & `portfolio_phase2_ideas.md`):**
  - Complete `README.md` with local setup, `.env` guide, Gmail App Password instructions, Vercel/Render deployment steps, and required user assets (`/public/images/yash.jpg`, optional screenshots, resume PDF).
  - Create `portfolio_phase2_ideas.md` for post-Stage-7 enhancements.
- [x] **7.6 Final Build Verification:** Run `npm run build` and final check.
