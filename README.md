# Yash Sigchi — Portfolio (2026)

> *"I build backend systems that ship and AI that explains itself."*

Production portfolio website for **Yash Sigchi** (Final-year B.Tech Computer Science & Engineering — AI & ML at VIT Chennai). Engineered with a strict dark-cosmic aesthetic blending Interstella's agency-grade structure with Crayon's warm dark-theme notes, interactive 3D WebGL scenes, architecture diagrams, an interactive developer terminal, recruiter fast-read resume mode, dual-email contact pipeline, and the streaming **"Ask Yash"** AI assistant.

---

## Tech Stack & Pinned Versions

- **Framework:** Next.js `14.2.15` (App Router), React `18.3.1`, TypeScript `5.x`
- **Styling:** Tailwind CSS `3.4.x` + custom CSS variables (`--bg-void`, `--bg-deep`, `--bg-surface`, etc.) + 3.5% film-grain overlay
- **Animation Lanes:**
  - **Framer Motion `11.x`:** Owns all JS animations (`whileInView`, ARIA tabs, FAQ accordion, hover tilts, layout/filter transitions, sticky scroll-driven `"How I work"` stack, SVG paper-plane success state, Command Palette, Terminal drawer, and Chatbot drawer).
  - **Lenis (`lenis/react`):** Smooth scrolling (`<ReactLenis root>`), automatically disabled under `prefers-reduced-motion`.
  - **Zero GSAP / ScrollTrigger.**
- **3D & Physics (Strict WebGL Budget):**
  - `three@0.160.x`, `@react-three/fiber@8.x`, `@react-three/drei@9.x`, `@react-three/postprocessing@2.16.x`, `@react-three/rapier@1.x`
  - Maximum **two `<Canvas>` instances** on `/`:
    1. **Hero "Neural Nebula"** (`components/three/HeroScene.tsx`)
    2. **Skills "Constellation"** (`components/three/SkillsConstellation.tsx`, lazy-loaded on desktop toggle)
  - Dedicated Rapier physics sandbox at `/playground` (`components/three/PlaygroundScene.tsx`)
- **Backend & AI (100% Free & Render Free-Tier Compatible):**
  - `POST /api/contact`: Zod validation (`lib/contactSchema.ts`), honeypot protection, HTML sanitization, IP rate limiting (3 req / 10 min), and dual email delivery (`Promise.allSettled`) sending both the owner notification and inquirer auto-reply via **Brevo HTTPS API** (recommended for Render free tier), **EmailJS HTTPS API**, **Resend HTTPS API**, or **Nodemailer SMTP**.
  - `POST /api/chat`: Streaming SSE endpoint supporting **free** LLM API keys out of the box (**Groq** `llama-3.3-70b-versatile`, **Google Gemini** `gemini-2.0-flash`, or **OpenRouter** free models, plus optional Anthropic fallback), grounded strictly in `data/knowledge.ts`.

---

## Assets Yash Must Supply

1. **Portrait Photo:** Place your portrait at `/public/images/yash.jpg` (aspect ratio ~`4:5` recommended). Until provided, the tilted polaroid card automatically renders a styled `"YS"` monogram fallback.
2. **Optional Project Screenshots:** If you wish to display custom screenshots inside case-study pages, place them under `/public/images/projects/`.
3. **Optional Local Resume PDF:** The portfolio links to your Google Drive resume URL (`data/profile.ts`) and provides an instant Recruiter HTML/Print view at `/resume`. If you also want a local PDF copy, place it at `/public/resume.pdf`.
4. **Custom Open Graph Banner (Optional):** A cosmic gradient `/public/og.png` (`1200×630`) is included out of the box and can be replaced anytime.

---

## Free API Keys Setup (Takes 2 Minutes)

### 1. Free Chatbot API Key ("Ask Yash")
The `/api/chat` route auto-detects whichever free key you configure:
- **Option A — Groq (Recommended, 100% Free, Ultra-Fast, No Credit Card):**
  1. Sign in at [https://console.groq.com/keys](https://console.groq.com/keys).
  2. Click **Create API Key** and copy the key (`gsk_...`).
  3. Set in `.env.local` (or Render Environment):
     ```env
     CHAT_PROVIDER=groq
     GROQ_API_KEY=gsk_your_key_here
     ```
  *(Uses `llama-3.3-70b-versatile` by default).*
- **Option B — Google Gemini (100% Free via Google AI Studio):**
  1. Get a free key at [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
  2. Set `CHAT_PROVIDER=gemini` and `GEMINI_API_KEY=your_key_here` *(uses `gemini-2.0-flash` by default)*.
- **Option C — OpenRouter Free Models:**
  1. Get a key at [https://openrouter.ai/keys](https://openrouter.ai/keys).
  2. Set `CHAT_PROVIDER=openrouter` and `OPENROUTER_API_KEY=your_key_here` *(uses `meta-llama/llama-3.3-70b-instruct:free`)*.

---

### 2. Render Free-Tier Compatible Email Provider (`/api/contact`)
Render's free web services **block outbound SMTP ports (`25`, `465`, `587`)**, and Resend's free tier refuses to deliver visitor auto-replies unless you own a custom domain.

To send **both** the owner notification (`yash.sigchi08@gmail.com`) and the visitor auto-reply over standard **HTTPS (`port 443`)** on Render's free tier without buying a domain, use **Brevo**:

#### Recommended: Brevo Free HTTPS API (300 emails/day free, no custom domain needed)
1. Create a free account at [https://app.brevo.com](https://app.brevo.com).
2. Go to **Senders, Domains & Dedicated IPs → Senders → Add a Sender** and verify `yash.sigchi08@gmail.com` via the confirmation link sent to your Gmail.
3. Click your profile menu (top right) → **SMTP & API → API Keys → Generate a new API key** (starts with `xkeysib-...`).
4. Set these variables in `.env.local` or Render:
   ```env
   MAIL_PROVIDER=brevo
   BREVO_API_KEY=xkeysib-your-brevo-api-key
   BREVO_SENDER_EMAIL=yash.sigchi08@gmail.com
   OWNER_EMAIL=yash.sigchi08@gmail.com
   FROM_NAME="Yash Sigchi"
   ```

*(Alternatively, `MAIL_PROVIDER=emailjs`, `MAIL_PROVIDER=resend`, and `MAIL_PROVIDER=smtp` remain supported in `lib/mailer.ts` — see `.env.example` for their variables).*

---

## Local Setup

1. **Install dependencies** (use `--legacy-peer-deps` to preserve pinned React 18.3.1):
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000`.

4. **Run the contact validation & rate-limit test suite:**
   ```bash
   npx tsx scripts/test-contact.ts
   ```

5. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

---

## Deployment on Render (Free Tier)

1. Create a new **Web Service** in Render connected to your GitHub repository.
2. Set **Build Command**:
   ```bash
   npm install --legacy-peer-deps && npm run build
   ```
3. Set **Start Command**:
   ```bash
   npm start
   ```
4. Under **Environment Variables**, add:
   - `MAIL_PROVIDER` = `brevo`
   - `BREVO_API_KEY` = `xkeysib-...`
   - `BREVO_SENDER_EMAIL` = `yash.sigchi08@gmail.com`
   - `OWNER_EMAIL` = `yash.sigchi08@gmail.com`
   - `FROM_NAME` = `Yash Sigchi`
   - `CHAT_PROVIDER` = `groq`
   - `GROQ_API_KEY` = `gsk_...`

---

## Keyboard Shortcuts & Easter Eggs

- **`⌘K` / `Ctrl+K`**: Open the searchable Command Palette (jump to sections, open case studies, copy email, open Recruiter Resume Mode, or launch Ask Yash).
- **`` ` `` (Backtick) or type `terminal` anywhere**: Slide up the interactive developer terminal (`help`, `whoami`, `skills`, `projects`, `experience`, `contact`, `clear`, `sudo hire yash`).
- **`/resume`**: Zero-animation, print-friendly Recruiter Mode with `@media print` styling.
- **`/playground`**: Interactive 3D Rapier physics sandbox.
