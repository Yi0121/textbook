// mocks/dashboardMocks.ts
import { CheckCircle, ClipboardCheck, Users, BookOpen } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// Types
export interface StatItem {
  label: string;
  value: string;
  trend: string;
  bgClass: string;
  borderClass: string;
  textClass: string;
  labelClass: string;
  icon: LucideIcon;
}

export interface StudentItem {
  name: string;
  homework: string;
  score: number;
  status: 'good' | 'warning' | 'need-help';
}

export interface HomeworkItem {
  hw: string;
  submitted: number;
  total: number;
  deadline: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

// Dashboard Overview Tab
export const STATS_DATA: StatItem[] = [
  {
    label: '平均答對率',
    value: '87%',
    trend: '較上週 +5%',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-100',
    textClass: 'text-emerald-600',
    labelClass: 'text-emerald-800',
    icon: CheckCircle,
  },
  {
    label: '作業繳交率',
    value: '93%',
    trend: '28/30 已繳交',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-100',
    textClass: 'text-blue-600',
    labelClass: 'text-blue-800',
    icon: ClipboardCheck,
  },
  {
    label: '活躍學生',
    value: '26',
    trend: '本週上線人數',
    bgClass: 'bg-purple-50',
    borderClass: 'border-purple-100',
    textClass: 'text-purple-600',
    labelClass: 'text-purple-800',
    icon: Users,
  },
  {
    label: '平均學習時長',
    value: '42m',
    trend: '每日平均',
    bgClass: 'bg-orange-50',
    borderClass: 'border-orange-100',
    textClass: 'text-orange-600',
    labelClass: 'text-orange-800',
    icon: BookOpen,
  },
];

export const STUDENTS_DATA: StudentItem[] = [
  { name: '王小明', homework: '5/5', score: 92, status: 'good' },
  { name: '陳小美', homework: '5/5', score: 88, status: 'good' },
  { name: '林大華', homework: '4/5', score: 76, status: 'warning' },
  { name: '張小芳', homework: '3/5', score: 65, status: 'need-help' },
  { name: '李志明', homework: '5/5', score: 95, status: 'good' },
];

// Dashboard Homework Tab
export const HOMEWORK_DATA: HomeworkItem[] = [
  { hw: '作業 1: 粒線體結構圖', submitted: 30, total: 30, deadline: '已截止' },
  { hw: '作業 2: ATP 生成機制', submitted: 28, total: 30, deadline: '2天後' },
  { hw: '作業 3: 細胞呼吸實驗報告', submitted: 25, total: 30, deadline: '5天後' },
];

// Dashboard AI Quiz Tab
export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: '粒線體內膜向內摺疊形成的結構稱為什麼？',
    options: ['A. 嵴 (Cristae)', 'B. 基質 (Matrix)', 'C. 類囊體', 'D. 內質網'],
    correctIndex: 0,
  },
  {
    question: '下列何者是粒線體的主要功能？',
    options: ['A. 光合作用', 'B. ATP 生成', 'C. 蛋白質合成', 'D. 脂質儲存'],
    correctIndex: 1,
  },
  {
    question: '關於粒線體DNA (mtDNA) 的描述，何者正確？',
    options: ['A. 位於細胞核', 'B. 為線性結構', 'C. 可自我複製', 'D. 與父系遺傳相關'],
    correctIndex: 2,
  },
];

// Helper functions for status styling
export const getStatusStyle = (status: string): string => {
  switch (status) {
    case 'good':
      return 'bg-green-100 text-green-700';
    case 'warning':
      return 'bg-orange-100 text-orange-700';
    default:
      return 'bg-red-100 text-red-700';
  }
};

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'good':
      return '良好';
    case 'warning':
      return '注意';
    default:
      return '需協助';
  }
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-orange-600';
  return 'text-red-600';
};
