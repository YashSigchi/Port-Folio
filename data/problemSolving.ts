export interface ProblemSolvingData {
  platform: string;
  profileUrl: string;
  totalSolved: number;
  easy: number;
  medium: number;
  hard: number;
  badges: string[];
  submissionsPastYear: number;
}

export const problemSolving: ProblemSolvingData = {
  platform: 'LeetCode',
  profileUrl: 'https://leetcode.com/u/Jt92Bwt9p3/',
  totalSolved: 241,
  easy: 107,
  medium: 116,
  hard: 18,
  badges: ['Top SQL 50'],
  submissionsPastYear: 445,
};
