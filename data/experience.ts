export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  dates: string;
  stack: string[];
  bullets: string[];
  caseStudyHref?: string;
}

export const experiences: ExperienceItem[] = [
  {
    id: 'nbc-bearings',
    company: 'NBC Bearings (CKA Birla Group)',
    role: 'Software Development Intern',
    dates: 'May 2026 – Jun 2026',
    stack: [
      'React',
      'TypeScript',
      'Spring Boot',
      'PostgreSQL',
      'JWT',
      'REST',
      'Docker',
      'Docker Compose',
      'Nginx',
    ],
    bullets: [
      'Built and deployed a Tool Room Requisition System for 100+ users with 4 roles and an 8-stage approval workflow.',
      'Designed PostgreSQL schemas and REST APIs for data creation, validation, processing and retrieval.',
      'Implemented RBAC, action-level audit logging, multi-stage approval routing and automated email notifications across submission, approval, rejection and forwarding, keeping Requestors, Approvers, Tool Room Operators and Admins in sync.',
      'Deployed on Linux with Docker Compose, Nginx and TLS, resolving ARM64 compatibility and JWT security issues.',
    ],
    caseStudyHref: '/projects/tool-room-requisition',
  },
  {
    id: 'tachyon-robotics',
    company: 'Tachyon Robotics Pvt. Ltd.',
    role: 'Software Development Intern (Founding Engineer)',
    dates: 'Aug 2025 – Dec 2025',
    stack: ['React', 'Tailwind CSS', 'REST APIs', 'Git'],
    bullets: [
      'Joined as a founding engineer at a deep-tech robotics startup, building the flagship web platform from the ground up.',
      'Engineered the official company website with a responsive, scalable frontend and reusable components.',
      'Designed and integrated REST APIs for backend logic, authentication and data security.',
      'Optimized UI performance and state management, reducing re-renders and improving load behavior.',
    ],
  },
  {
    id: '1m1b',
    company: '1M1B',
    role: 'AI + ClimateTech Intern',
    dates: 'Jul 2025 – Aug 2025',
    stack: ['Google Maps API', 'Web App'],
    bullets: [
      'Worked on AI solutions for climate impact analysis.',
      'Co-developed "Bus Route Optimizer", a web app that uses Google Maps API and real-time transit data to suggest eco-efficient routes by time, cost and carbon footprint to reduce student commute emissions.',
    ],
  },
];
