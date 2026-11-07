export type SkillCategory =
  | 'Languages'
  | 'Backend'
  | 'Frontend'
  | 'Databases'
  | 'AI/ML'
  | 'DevOps & Tools'
  | 'Learning';

export const SKILL_CATEGORIES: SkillCategory[] = [
  'Languages',
  'Backend',
  'Frontend',
  'Databases',
  'AI/ML',
  'DevOps & Tools',
  'Learning',
];

export interface SkillItem {
  name: string;
  category: SkillCategory;
  usedIn: string[];
}

export const skills: SkillItem[] = [
  // Languages
  {
    name: 'Python',
    category: 'Languages',
    usedIn: [
      'AI-Powered Customer Support Automation',
      'FAERS ADR Multi-label Inference & XAI Dashboard',
      'Multi-Agent RL Resource Allocation',
      'Aerial Threat Detection with Explainable AI',
      'Football Match Analysis & Tracking',
      'AES-ECB vs AES-CBC Visualizer',
    ],
  },
  {
    name: 'Java',
    category: 'Languages',
    usedIn: ['NBC Bearings (Tool Room Requisition System)', 'LeetCode Problem Solving'],
  },
  {
    name: 'JavaScript',
    category: 'Languages',
    usedIn: ['Tachyon Robotics Pvt. Ltd.', 'DilKeTaar', '1M1B (Bus Route Optimizer)'],
  },
  {
    name: 'TypeScript',
    category: 'Languages',
    usedIn: ['NBC Bearings (Tool Room Requisition System)', 'SocietyHub'],
  },
  {
    name: 'SQL',
    category: 'Languages',
    usedIn: [
      'NBC Bearings (Tool Room Requisition System)',
      'SocietyHub',
      'LeetCode Top SQL 50 Badge',
    ],
  },
  {
    name: 'C',
    category: 'Languages',
    usedIn: ['Systems & Core CS Foundations (VIT)'],
  },
  {
    name: 'C++',
    category: 'Languages',
    usedIn: ['Data Structures & Algorithms (241 LeetCode Solved)'],
  },
  {
    name: 'Dart',
    category: 'Languages',
    usedIn: ['BhashaBridge'],
  },

  // Backend
  {
    name: 'Spring Boot',
    category: 'Backend',
    usedIn: ['NBC Bearings (Tool Room Requisition System)'],
  },
  {
    name: 'Node.js',
    category: 'Backend',
    usedIn: ['SocietyHub', 'DilKeTaar'],
  },
  {
    name: 'Express',
    category: 'Backend',
    usedIn: ['SocietyHub', 'DilKeTaar'],
  },
  {
    name: 'FastAPI',
    category: 'Backend',
    usedIn: ['FAERS ADR Multi-label Inference & XAI Dashboard'],
  },

  // Frontend
  {
    name: 'React',
    category: 'Frontend',
    usedIn: [
      'NBC Bearings (Tool Room Requisition System)',
      'Tachyon Robotics Pvt. Ltd.',
      'SocietyHub',
      'DilKeTaar',
    ],
  },
  {
    name: 'Next.js',
    category: 'Frontend',
    usedIn: ['Yash Sigchi Portfolio'],
  },
  {
    name: 'Tailwind CSS',
    category: 'Frontend',
    usedIn: ['Tachyon Robotics Pvt. Ltd.', 'SocietyHub', 'Yash Sigchi Portfolio'],
  },
  {
    name: 'Flutter',
    category: 'Frontend',
    usedIn: ['BhashaBridge'],
  },

  // Databases
  {
    name: 'PostgreSQL',
    category: 'Databases',
    usedIn: ['NBC Bearings (Tool Room Requisition System)', 'SocietyHub'],
  },
  {
    name: 'MongoDB',
    category: 'Databases',
    usedIn: ['DilKeTaar'],
  },
  {
    name: 'Firebase/Firestore',
    category: 'Databases',
    usedIn: ['BhashaBridge'],
  },
  {
    name: 'SQLite',
    category: 'Databases',
    usedIn: ['AI-Powered Customer Support Automation'],
  },
  {
    name: 'Prisma',
    category: 'Databases',
    usedIn: ['SocietyHub'],
  },

  // AI/ML
  {
    name: 'PyTorch',
    category: 'AI/ML',
    usedIn: [
      'FAERS ADR Multi-label Inference & XAI Dashboard',
      'Multi-Agent RL Resource Allocation',
      'Deep Learning Architectures Collection',
    ],
  },
  {
    name: 'FAISS',
    category: 'AI/ML',
    usedIn: ['AI-Powered Customer Support Automation'],
  },
  {
    name: 'LIME',
    category: 'AI/ML',
    usedIn: ['FAERS ADR Multi-label Inference & XAI Dashboard'],
  },
  {
    name: 'RAG',
    category: 'AI/ML',
    usedIn: ['AI-Powered Customer Support Automation'],
  },
  {
    name: 'LangGraph',
    category: 'AI/ML',
    usedIn: ['AI-Powered Customer Support Automation'],
  },
  {
    name: 'YOLOv8',
    category: 'AI/ML',
    usedIn: [
      'Aerial Threat Detection with Explainable AI',
      'Football Match Analysis & Tracking',
    ],
  },
  {
    name: 'OpenCV',
    category: 'AI/ML',
    usedIn: [
      'Aerial Threat Detection with Explainable AI',
      'Football Match Analysis & Tracking',
    ],
  },

  // DevOps & Tools
  {
    name: 'Docker',
    category: 'DevOps & Tools',
    usedIn: ['NBC Bearings (Tool Room Requisition System)', 'DilKeTaar'],
  },
  {
    name: 'Docker Compose',
    category: 'DevOps & Tools',
    usedIn: ['NBC Bearings (Tool Room Requisition System)'],
  },
  {
    name: 'Nginx',
    category: 'DevOps & Tools',
    usedIn: ['NBC Bearings (Tool Room Requisition System)'],
  },
  {
    name: 'Linux',
    category: 'DevOps & Tools',
    usedIn: ['NBC Bearings (Tool Room Requisition System)'],
  },
  {
    name: 'Git/GitHub',
    category: 'DevOps & Tools',
    usedIn: [
      'NBC Bearings',
      'Tachyon Robotics Pvt. Ltd.',
      'SocietyHub',
      'AI-Powered Customer Support Automation',
      'FAERS ADR XAI Dashboard',
    ],
  },
  {
    name: 'REST APIs',
    category: 'DevOps & Tools',
    usedIn: ['NBC Bearings', 'Tachyon Robotics Pvt. Ltd.', 'SocietyHub'],
  },
  {
    name: 'Postman',
    category: 'DevOps & Tools',
    usedIn: ['NBC Bearings', 'SocietyHub', 'Tachyon Robotics Pvt. Ltd.'],
  },
  {
    name: 'Figma',
    category: 'DevOps & Tools',
    usedIn: ['Tachyon Robotics Pvt. Ltd.', 'SocietyHub'],
  },
  {
    name: 'Tableau',
    category: 'DevOps & Tools',
    usedIn: ['Data Analytics & Visualization'],
  },

  // Learning
  {
    name: 'AWS',
    category: 'Learning',
    usedIn: ['Currently learning (Cloud & Data Engineering track)'],
  },
  {
    name: 'PySpark',
    category: 'Learning',
    usedIn: ['Currently learning (Distributed Data Processing)'],
  },
  {
    name: 'Databricks',
    category: 'Learning',
    usedIn: ['Currently learning (Data Intelligence Platform)'],
  },
  {
    name: 'Lakehouse Architecture',
    category: 'Learning',
    usedIn: ['Currently learning (Modern Data Engineering)'],
  },
];
