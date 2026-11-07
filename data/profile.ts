export interface StatItem {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
}

export interface ProfileData {
  name: string;
  location: string;
  university: string;
  degree: string;
  years: string;
  cgpa: string;
  classXII: string;
  jeeMain: string;
  email: string;
  linkedin: string;
  github: string;
  resume: string;
  leetcode: string;
  availability: string;
  targetRoles: string[];
  stats: StatItem[];
  learningNow: string[];
}

export const profile: ProfileData = {
  name: 'Yash Sigchi',
  location: 'Jaipur, India',
  university: 'Vellore Institute of Technology (VIT), Chennai',
  degree: 'B.Tech Computer Science & Engineering (AI & ML)',
  years: '2023 – 2027',
  cgpa: '8.72/10',
  classXII: '93% (PCM), Maheshwari Public School, Jaipur',
  jeeMain: '94.8 percentile',
  email: 'yash.sigchi08@gmail.com',
  linkedin: 'https://www.linkedin.com/in/yash-sigchi/',
  github: 'https://github.com/YashSigchi',
  resume: 'https://drive.google.com/file/d/1WBRGBn7Cl6qCLnvZ8OMbBgCU8rtofN_l/view?usp=sharing',
  leetcode: 'https://leetcode.com/u/Jt92Bwt9p3/',
  availability:
    'Available for immediate 6-month internships (Jan–Jun 2027) and full-time roles starting June 2027.',
  targetRoles: ['Software Engineer', 'AI/ML Engineer', 'Full-Stack Engineer'],
  stats: [
    {
      value: 100,
      suffix: '+',
      label: 'users on a production workflow system',
    },
    {
      value: 300,
      suffix: '+',
      label: 'ADR labels predicted',
    },
    {
      value: 241,
      suffix: '',
      label: 'LeetCode problems solved',
    },
    {
      value: 8.72,
      suffix: '',
      decimals: 2,
      label: 'CGPA',
    },
  ],
  learningNow: ['AWS Fundamentals', 'PySpark', 'Databricks', 'Lakehouse Architecture'],
};
