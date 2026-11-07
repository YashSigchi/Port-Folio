export interface CertificationItem {
  title: string;
  issuer: string;
  year: string;
  verifyUrl?: string;
}

export const certifications: CertificationItem[] = [
  {
    title: 'Getting Started with AI',
    issuer: 'IBM',
    year: '2025',
  },
  {
    title: 'Building Agents with Agentic AI',
    issuer: 'IBM',
    year: 'Jul 15, 2026',
    verifyUrl:
      'https://courses.ibmcep.cognitiveclass.ai/certificates/32d5763a26d040058125f69dbe942911',
  },
  {
    title: 'Journey to Cloud',
    issuer: 'IBM',
    year: '2025',
  },
  {
    title: 'AI for Beginners',
    issuer: 'HP LIFE',
    year: '2025',
  },
  {
    title: 'Azure Cloud Solutions',
    issuer: 'EY × Microsoft',
    year: '2025',
  },
  {
    title: 'Technology Job Simulation',
    issuer: '', // Provider intentionally left empty per resolved decisions; hidden in UI when empty
    year: '2025',
  },
  {
    title: 'Data Science',
    issuer: 'CodeWithHarry',
    year: '2026',
  },
];
