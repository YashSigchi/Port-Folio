export type ProjectFilterTag =
  | 'All'
  | 'Full-Stack'
  | 'AI-ML'
  | 'Computer Vision'
  | 'Security'
  | 'Systems';

export const PROJECT_FILTER_TAGS: ProjectFilterTag[] = [
  'All',
  'Full-Stack',
  'AI-ML',
  'Computer Vision',
  'Security',
  'Systems',
];

export interface ProjectCaseStudy {
  problem: string;
  approach: string;
  keyDecisions: string[];
  challengesAndFixes: string[];
}

export interface ProjectItem {
  slug: string;
  title: string;
  category: string;
  year: string;
  tags: Exclude<ProjectFilterTag, 'All'>[];
  summary: string;
  stack: string[];
  links: {
    repo?: string;
    live?: string;
    apk?: string;
  };
  featured: boolean;
  previewGradient: string;
  caseStudy: ProjectCaseStudy;
}

export const projects: ProjectItem[] = [
  {
    slug: 'tool-room-requisition',
    title: 'Tool Room Requisition System',
    category: 'Enterprise',
    year: '2026',
    tags: ['Full-Stack', 'Systems'],
    summary:
      'Digitizes tool room requisition and approval on the manufacturing floor for 100+ users across 4 roles and an 8-stage approval workflow.',
    stack: ['React', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'JWT', 'Docker', 'Nginx'],
    links: {},
    featured: true,
    previewGradient: 'linear-gradient(135deg, #4F46E5 0%, #8B5CF6 50%, #22D3EE 100%)',
    caseStudy: {
      problem:
        'Manufacturing tool room requisitions at NBC Bearings relied on manual steps that made tracking approval stages, audit accountability, and cross-role handoffs difficult for 100+ floor and administrative users.',
      approach:
        'Built and deployed an end-to-end web platform using React, TypeScript, Spring Boot, and PostgreSQL with 4 distinct roles (Requestor, Approver, Tool Room Operator, Admin) and a structured 8-stage approval workflow.',
      keyDecisions: [
        'Modeled strict state transitions across 8 requisition stages so every submission, approval, rejection, and forwarding event is validated at the API layer.',
        'Implemented role-based access control (RBAC) with JWT authentication and action-level audit logging to maintain full traceability.',
        'Configured automated email notifications triggered on stage transitions so Requestors, Approvers, Tool Room Operators, and Admins stay synchronized without manual follow-ups.',
      ],
      challengesAndFixes: [
        'Resolved ARM64 container compatibility issues during Linux server deployment by standardizing multi-arch base images in Docker Compose.',
        'Hardened JWT token validation and configured Nginx with TLS termination for secure internal production access.',
      ],
    },
  },
  {
    slug: 'societyhub',
    title: 'SocietyHub',
    category: 'Full-Stack',
    year: '2026',
    tags: ['Full-Stack', 'Systems'],
    summary:
      'Residential maintenance and complaint platform with priority-based tracking, Resident/Admin dashboards, audit records, multi-image uploads (Cloudinary), email alerts (Nodemailer) and scheduled SLA-based overdue escalation.',
    stack: [
      'React',
      'TypeScript',
      'Node',
      'Express',
      'PostgreSQL',
      'Prisma',
      'JWT/RBAC',
      'Cloudinary',
      'Nodemailer',
    ],
    links: {
      repo: 'https://github.com/YashSigchi/Society_maintenance',
      live: 'https://society-maintenance-i33v.onrender.com/',
    },
    featured: true,
    previewGradient: 'linear-gradient(135deg, #6366F1 0%, #D946EF 60%, #F43F5E 100%)',
    caseStudy: {
      problem:
        'Residential societies struggle with untracked maintenance requests, missing photo evidence, unclear SLA accountability, and lack of visibility between residents and management.',
      approach:
        'Engineered a full-stack web platform with React, TypeScript, Node/Express, PostgreSQL, and Prisma featuring dedicated Resident and Admin dashboards, multi-image evidence uploads, and automated SLA escalation.',
      keyDecisions: [
        'Used Prisma with PostgreSQL to enforce relational integrity across complaints, comments, status changes, and immutable audit records.',
        'Integrated Cloudinary for multi-image uploads so residents and maintenance staff can attach visual proof at filing and resolution.',
        'Implemented a scheduled background worker that monitors SLA deadlines and automatically escalates overdue tickets with Nodemailer alerts.',
      ],
      challengesAndFixes: [
        'Prevented unauthorized ticket manipulation by enforcing strict JWT/RBAC middleware separating Resident and Admin capabilities.',
        'Handled concurrent status updates cleanly with transactional writes that append an audit record alongside every state change.',
      ],
    },
  },
  {
    slug: 'ai-customer-support',
    title: 'AI-Powered Customer Support Automation',
    category: 'Agentic AI',
    year: '2026',
    tags: ['AI-ML', 'Systems'],
    summary:
      'Stateful LangGraph multi-agent workflow routing across Sales, Technical, Billing and Account agents; RAG with FAISS grounding LLM answers in documentation; SQLite memory for conversation history and cross-session context; human-in-the-loop validation for sensitive actions.',
    stack: ['Python', 'LangGraph', 'FAISS', 'RAG', 'SQLite', 'LLM APIs'],
    links: {
      repo: 'https://github.com/YashSigchi/AI-Powered-Customer-Support',
    },
    featured: true,
    previewGradient: 'linear-gradient(135deg, #8B5CF6 0%, #D946EF 50%, #22D3EE 100%)',
    caseStudy: {
      problem:
        'Single-prompt support bots frequently hallucinate policies, lose multi-turn context across sessions, and lack safety guardrails when executing sensitive account or billing operations.',
      approach:
        'Designed a stateful LangGraph multi-agent architecture that classifies intent via a Router agent and delegates to specialized Sales, Technical, Billing, and Account agents backed by FAISS vector retrieval and SQLite persistence.',
      keyDecisions: [
        'Grounded domain responses in official documentation using FAISS similarity search (RAG) rather than relying on raw model weights.',
        'Persisted conversation state and cross-session history in SQLite checkpoints so returning users resume seamlessly.',
        'Added a dedicated human-in-the-loop approval gate before any sensitive account or billing action can complete.',
      ],
      challengesAndFixes: [
        'Eliminated routing loops between specialist agents by defining explicit state schemas and deterministic handoff edges in LangGraph.',
        'Tuned chunking and retrieval thresholds in FAISS to keep context windows concise and factual.',
      ],
    },
  },
  {
    slug: 'faers-adr-xai',
    title: 'FAERS ADR Multi-label Inference & XAI Dashboard',
    category: 'Machine Learning',
    year: '2026',
    tags: ['AI-ML', 'Full-Stack'],
    summary:
      'End-to-end pipeline on FAERS data predicting 300+ adverse drug reaction labels; PyTorch EmbeddingBag model served through FastAPI; XAI dashboard with LIME, Integrated Gradients and counterfactual analysis.',
    stack: ['Python', 'PyTorch', 'FastAPI', 'LIME', 'Integrated Gradients', 'React'],
    links: {
      repo: 'https://github.com/YashSigchi/FAERS_ADR-XAI_Dashboard',
    },
    featured: true,
    previewGradient: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 50%, #A855F7 100%)',
    caseStudy: {
      problem:
        'Predicting adverse drug reactions (ADRs) across hundreds of sparse outcomes in FDA FAERS reports is difficult, and black-box predictions cannot be trusted in clinical or pharmacovigilance workflows without explanation.',
      approach:
        'Built an end-to-end multi-label classification pipeline predicting 300+ ADR labels using a PyTorch EmbeddingBag architecture served via FastAPI, paired with an interactive Explainable AI (XAI) dashboard.',
      keyDecisions: [
        'Selected PyTorch EmbeddingBag layers to efficiently represent high-cardinality drug and indication combinations with low inference latency.',
        'Combined three complementary explainability methods: LIME for local perturbation explanations, Integrated Gradients for feature attribution, and counterfactual analysis to show what input change flips a prediction.',
        'Exposed model inference and attribution computation through asynchronous FastAPI endpoints consumed by a visual dashboard.',
      ],
      challengesAndFixes: [
        'Addressed severe class imbalance across 300+ ADR targets through tailored loss weighting and threshold calibration.',
        'Optimized Integrated Gradients & LIME sampling steps so on-demand explanations return interactively within the dashboard.',
      ],
    },
  },
  {
    slug: 'bhashabridge',
    title: 'BhashaBridge',
    category: 'Mobile + AI',
    year: '2025',
    tags: ['AI-ML', 'Full-Stack'],
    summary:
      'Flutter/Dart + Firebase + OpenAI multilingual chat app with automatic language detection and instant translation across 40+ language combinations. APK available.',
    stack: ['Flutter', 'Dart', 'Firebase', 'Firestore', 'OpenAI API'],
    links: {
      apk: '#contact',
    },
    featured: true,
    previewGradient: 'linear-gradient(135deg, #F59E0B 0%, #D946EF 50%, #6366F1 100%)',
    caseStudy: {
      problem:
        'Cross-language messaging typically requires copying messages into external translators, breaking real-time conversation flow.',
      approach:
        'Built a cross-platform mobile chat application in Flutter and Dart backed by Firebase/Firestore and OpenAI that automatically detects source languages and delivers instant inline translations across 40+ language pairs.',
      keyDecisions: [
        'Used Firestore real-time streams to sync original messages and translated payloads across conversation participants.',
        'Automated source-language detection so users can switch languages mid-conversation without changing settings manually.',
      ],
      challengesAndFixes: [
        'Cached translated text per message document in Firestore to avoid redundant OpenAI calls when re-opening chat threads.',
        'Kept UI scrolling smooth on mobile devices while streaming real-time translation updates.',
      ],
    },
  },
  {
    slug: 'dilketaar',
    title: 'DilKeTaar',
    category: 'Real-time',
    year: '2025',
    tags: ['Full-Stack', 'Systems'],
    summary:
      'Video and text chat with WebRTC signaling over Socket.io, JWT auth, MongoDB, Docker.',
    stack: ['React', 'Node.js', 'WebRTC', 'Socket.io', 'MongoDB', 'JWT', 'Docker'],
    links: {},
    featured: true,
    previewGradient: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 50%, #3B82F6 100%)',
    caseStudy: {
      problem:
        'Building reliable peer-to-peer video and text communication requires low-latency signaling, authenticated session state, and clean reconnection handling.',
      approach:
        'Engineered a real-time video and text communication app using React, Node.js, WebRTC for peer media streams, Socket.io for signaling, MongoDB for persistence, and Docker for containerized deployment.',
      keyDecisions: [
        'Handled SDP offer/answer exchange and ICE candidate trickle over authenticated Socket.io channels.',
        'Secured user sessions and room join events with JWT authentication and persisted chat history in MongoDB.',
      ],
      challengesAndFixes: [
        'Managed peer disconnect and ICE state recovery gracefully so dropped connections clean up media tracks properly.',
        'Containerized the Node signaling server and React client with Docker for reproducible deployment.',
      ],
    },
  },
  // Experiments (not featured)
  {
    slug: 'marl-resource-allocation',
    title: 'Multi-Agent RL Resource Allocation',
    category: 'Reinforcement Learning',
    year: '2026',
    tags: ['AI-ML', 'Systems'],
    summary:
      'PyTorch, MAPPO, CTDE (Centralized Training with Decentralized Execution), custom Gym environments, benchmarked against heuristic schedulers.',
    stack: ['Python', 'PyTorch', 'MAPPO', 'CTDE', 'OpenAI Gym'],
    links: {},
    featured: false,
    previewGradient: 'linear-gradient(135deg, #6366F1 0%, #22D3EE 100%)',
    caseStudy: {
      problem:
        'Dynamic resource allocation across competing nodes often degrades under static heuristic schedulers when workloads spike unpredictably.',
      approach:
        'Implemented Multi-Agent Proximal Policy Optimization (MAPPO) under a Centralized Training with Decentralized Execution (CTDE) paradigm in custom OpenAI Gym environments using PyTorch.',
      keyDecisions: [
        'Used a centralized value critic during training while allowing decentralized actor policies at execution time.',
        'Benchmarked learned policies directly against standard heuristic schedulers across varied load profiles.',
      ],
      challengesAndFixes: [
        'Stabilized multi-agent reward shaping to prevent greedy resource hoarding by individual agents.',
      ],
    },
  },
  {
    slug: 'aerial-threat-detection-xai',
    title: 'Aerial Threat Detection with Explainable AI',
    category: 'Computer Vision',
    year: '2026',
    tags: ['Computer Vision', 'AI-ML'],
    summary:
      'YOLOv8 object detection pipeline paired with Grad-CAM and saliency maps in OpenCV to explain model visual focus.',
    stack: ['Python', 'YOLOv8', 'Grad-CAM', 'OpenCV'],
    links: {},
    featured: false,
    previewGradient: 'linear-gradient(135deg, #22D3EE 0%, #8B5CF6 100%)',
    caseStudy: {
      problem:
        'Aerial object detectors require visual interpretability so operators can verify whether detections rely on target features or background artifacts.',
      approach:
        'Combined YOLOv8 aerial detection with Grad-CAM and saliency map overlays rendered via OpenCV.',
      keyDecisions: [
        'Extracted intermediate convolutional activations from YOLOv8 to generate spatial heatmaps alongside bounding boxes.',
      ],
      challengesAndFixes: [
        'Aligned multi-scale detection heads with Grad-CAM gradients for crisp localization overlays.',
      ],
    },
  },
  {
    slug: 'football-match-analysis',
    title: 'Football Match Analysis & Tracking',
    category: 'Computer Vision',
    year: '2025',
    tags: ['Computer Vision', 'AI-ML'],
    summary:
      'Multi-object detection and tracking across broadcast video using YOLOv8x, ByteTrack, and OpenCV for players, referees, and the ball.',
    stack: ['Python', 'YOLOv8x', 'ByteTrack', 'OpenCV'],
    links: {},
    featured: false,
    previewGradient: 'linear-gradient(135deg, #22C55E 0%, #0EA5E9 100%)',
    caseStudy: {
      problem:
        'Tracking players, referees, and a fast-moving ball through occlusions in broadcast football footage requires robust detection and temporal association.',
      approach:
        'Built a computer vision pipeline combining YOLOv8x detections with ByteTrack multi-object tracking and OpenCV frame annotation.',
      keyDecisions: [
        'Used ByteTrack to retain low-confidence detection boxes during brief player occlusions, preserving track IDs.',
      ],
      challengesAndFixes: [
        'Handled rapid camera pans and crowded penalty-box scenes without frequent ID switches.',
      ],
    },
  },
  {
    slug: 'aes-pattern-leakage',
    title: 'AES-ECB vs AES-CBC Pattern-Leakage Visualizer',
    category: 'Cryptography',
    year: '2025',
    tags: ['Security'],
    summary:
      'Python cryptographic visualizer demonstrating block-cipher structural leakage in AES-ECB versus AES-CBC with entropy analysis on images.',
    stack: ['Python', 'Cryptography', 'Entropy Analysis'],
    links: {},
    featured: false,
    previewGradient: 'linear-gradient(135deg, #F43F5E 0%, #8B5CF6 100%)',
    caseStudy: {
      problem:
        'Identical plaintext blocks produce identical ciphertext blocks in ECB mode, leaking visual structure in encrypted images.',
      approach:
        'Built a Python analysis tool that encrypts bitmap/image payloads under AES-ECB and AES-CBC and computes Shannon entropy and spatial correlation metrics.',
      keyDecisions: [
        'Preserved image headers while encrypting pixel payloads to allow direct visual comparison alongside numerical entropy metrics.',
      ],
      challengesAndFixes: [
        'Handled PKCS#7 padding and initialization vector (IV) randomization cleanly for CBC mode comparison.',
      ],
    },
  },
  {
    slug: 'public-key-crypto-suite',
    title: 'Public-Key Crypto Suite',
    category: 'Security & Networking',
    year: '2025',
    tags: ['Security', 'Systems'],
    summary:
      'From-scratch implementations of RSA, ElGamal, S-DES, and Miller-Rabin primality testing over a socket client-server architecture.',
    stack: ['Python', 'RSA', 'ElGamal', 'S-DES', 'Sockets'],
    links: {},
    featured: false,
    previewGradient: 'linear-gradient(135deg, #FBBF24 0%, #F43F5E 100%)',
    caseStudy: {
      problem:
        'Understanding asymmetric key exchange and symmetric block encryption requires building the underlying modular arithmetic and protocol framing directly.',
      approach:
        'Implemented RSA, ElGamal, S-DES, and Miller-Rabin probabilistic primality testing from scratch over TCP client-server sockets.',
      keyDecisions: [
        'Used Miller-Rabin primality tests with modular exponentiation for key generation and exchanged session parameters over sockets.',
      ],
      challengesAndFixes: [
        'Prevented message framing truncation across TCP socket reads during encrypted payload exchange.',
      ],
    },
  },
  {
    slug: 'deep-learning-architectures',
    title: 'Deep Learning Architectures Collection',
    category: 'Deep Learning',
    year: '2025',
    tags: ['AI-ML', 'Computer Vision'],
    summary:
      'Research implementations spanning GLCM+LBP+CNN texture classifiers, CycleGAN unpaired translation, crystal graph neural networks, and LSTM/GRU/Transformer sequence models with GloVe.',
    stack: ['Python', 'PyTorch', 'CNN', 'CycleGAN', 'GNN', 'Transformer', 'GloVe'],
    links: {},
    featured: false,
    previewGradient: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
    caseStudy: {
      problem:
        'Different data modalities—textures, unpaired image domains, crystal graphs, and sequential text—require specialized neural inductive biases.',
      approach:
        'Implemented and evaluated hybrid GLCM+LBP+CNN models, CycleGAN, crystal graph neural networks, and recurrent/attention sequence architectures with GloVe embeddings.',
      keyDecisions: [
        'Compared handcrafted texture descriptors fused with CNN features against end-to-end convolutional baselines.',
        'Evaluated LSTM, GRU, and Transformer encoders initialized with pre-trained GloVe word vectors.',
      ],
      challengesAndFixes: [
        'Stabilized CycleGAN cycle-consistency loss weighting to prevent mode collapse during unpaired training.',
      ],
    },
  },
  {
    slug: 'docx-to-pdf',
    title: 'DocxToPdf Utility',
    category: 'Developer Tool',
    year: '2025',
    tags: ['Systems'],
    summary:
      'Lightweight Python and Streamlit document conversion web utility for fast DOCX to PDF processing.',
    stack: ['Python', 'Streamlit'],
    links: {},
    featured: false,
    previewGradient: 'linear-gradient(135deg, #38BDF8 0%, #818CF8 100%)',
    caseStudy: {
      problem:
        'Quickly converting batch DOCX files to PDF without heavy desktop suites requires a minimal browser-accessible tool.',
      approach:
        'Built a clean Python and Streamlit interface that processes uploaded DOCX files and streams back converted PDFs.',
      keyDecisions: [
        'Kept file handling ephemeral in temporary directories so uploaded documents are cleaned up immediately after conversion.',
      ],
      challengesAndFixes: [
        'Handled malformed document filenames and stream buffers gracefully in Streamlit.',
      ],
    },
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
export const experimentProjects = projects.filter((p) => !p.featured);
