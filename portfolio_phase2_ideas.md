# Portfolio Phase 2 Ideas (Post-Stage-7 Backlog)

These enhancements were intentionally kept out of the core 7-stage build to keep performance, WebGL context budgets, and scope tight. Explore these only after the primary deployment is live:

1. **Live Interactive XAI Demo Widget (`/projects/faers-adr-xai`):**
   - Embed a pre-computed JSON sample of 10 anonymized FAERS drug reports so visitors can toggle LIME vs. Integrated Gradients vs. Counterfactual attributions directly in the browser without spinning up a live PyTorch GPU container.
2. **Interactive LangGraph State Replay (`/projects/ai-customer-support`):**
   - Step-by-step timeline player on the case study page that replays a real multi-turn conversation moving from the Router agent → Billing agent → FAISS RAG retrieval → Human-in-the-loop approval gate.
3. **GitHub & LeetCode Live Stats Cron Cache:**
   - Optional ISR background revalidation route (`revalidate = 86400`) that fetches live contribution streaks while keeping `data/problemSolving.ts` as the zero-latency fallback.
4. **Technical Blog / Engineering Notes (`/notes`):**
   - MDX-backed engineering write-ups covering ARM64 Docker multi-arch debugging, Spring Boot action-level audit logging patterns, and FAISS chunking strategies.
5. **Voice Input for "Ask Yash":**
   - Web Speech API microphone button inside the chatbot input bar for hands-free recruiter Q&A.
