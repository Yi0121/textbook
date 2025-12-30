/**
 * Mock 學生作答資料與學習記錄
 * 用於 AI 分析學習弱點與推薦學習路徑
 * 
 * 主題：代數式基本運算 (Algebraic Operations)
 */

import type { StudentLearningRecord, StudentAnswer } from '../types';

// ==================== Mock 學生作答記錄 ====================

/**
 * 王小明的作答記錄
 * 特徵：整體不錯，但在乘法公式的變形應用（因式分解逆運算）上有點卡住
 */
const wangXiaoMingAnswers: StudentAnswer[] = [
  {
    id: 'ans-wx-1',
    studentId: 'student-wang',
    questionId: 'q-combine-1',
    answer: 'B',
    isCorrect: true,
    score: 100,
    timeSpent: 25,
    knowledgeNodeIds: ['kn-combine-terms'],
    difficulty: 'easy',
    answeredAt: Date.now() - 86400000,
    attemptCount: 1,
  },
  {
    id: 'ans-wx-2',
    studentId: 'student-wang',
    questionId: 'q-distributive-1',
    answer: 'C',
    isCorrect: true,
    score: 100,
    timeSpent: 40,
    knowledgeNodeIds: ['kn-distributive-law'],
    difficulty: 'medium',
    answeredAt: Date.now() - 86300000,
    attemptCount: 1,
  },
  {
    id: 'ans-wx-3',
    studentId: 'student-wang',
    questionId: 'q-formula-sq-diff-1', // 平方差
    answer: 'A',
    isCorrect: true,
    score: 100,
    timeSpent: 30,
    knowledgeNodeIds: ['kn-multiplication-formula'],
    difficulty: 'medium',
    answeredAt: Date.now() - 86200000,
    attemptCount: 1,
  },
  {
    id: 'ans-wx-4',
    studentId: 'student-wang',
    questionId: 'q-formula-sum-sq-1', // 和的平方
    answer: 'D',
    isCorrect: false,
    score: 0,
    timeSpent: 60,
    knowledgeNodeIds: ['kn-multiplication-formula'],
    difficulty: 'hard',
    answeredAt: Date.now() - 86100000,
    attemptCount: 1,
  },
  {
    id: 'ans-wx-5',
    studentId: 'student-wang',
    questionId: 'q-poly-add-1',
    answer: 'B',
    isCorrect: true,
    score: 100,
    timeSpent: 45,
    knowledgeNodeIds: ['kn-polynomial-addition'],
    difficulty: 'medium',
    answeredAt: Date.now() - 86000000,
    attemptCount: 1,
  },
];

/**
 * 陳小美的作答記錄
 * 特徵：正負號運算常錯，分配律展開有困難
 */
const chenXiaoMeiAnswers: StudentAnswer[] = [
  {
    id: 'ans-cm-1',
    studentId: 'student-chen',
    questionId: 'q-combine-1',
    answer: 'C', // Wrong
    isCorrect: false,
    score: 0,
    timeSpent: 50,
    knowledgeNodeIds: ['kn-combine-terms'],
    difficulty: 'easy',
    answeredAt: Date.now() - 86400000,
    attemptCount: 1,
  },
  {
    id: 'ans-cm-2',
    studentId: 'student-chen',
    questionId: 'q-combine-2',
    answer: 'B',
    isCorrect: true,
    score: 100,
    timeSpent: 65,
    knowledgeNodeIds: ['kn-combine-terms'],
    difficulty: 'easy',
    answeredAt: Date.now() - 86300000,
    attemptCount: 2,
  },
  {
    id: 'ans-cm-3',
    studentId: 'student-chen',
    questionId: 'q-distributive-1',
    answer: 'A', // Wrong sign
    isCorrect: false,
    score: 0,
    timeSpent: 72,
    knowledgeNodeIds: ['kn-distributive-law'],
    difficulty: 'medium',
    answeredAt: Date.now() - 86200000,
    attemptCount: 1,
  },
  {
    id: 'ans-cm-4',
    studentId: 'student-chen',
    questionId: 'q-formula-sq-diff-1',
    answer: 'A',
    isCorrect: true,
    score: 100,
    timeSpent: 55,
    knowledgeNodeIds: ['kn-multiplication-formula'],
    difficulty: 'medium',
    answeredAt: Date.now() - 86100000,
    attemptCount: 1,
  },
];

/**
 * 林大華的作答記錄
 * 特徵：代數結構強，但計算粗心
 */
const linDaHuaAnswers: StudentAnswer[] = [
  {
    id: 'ans-ldh-1',
    studentId: 'student-lin',
    questionId: 'q-poly-add-1',
    answer: 'B',
    isCorrect: true,
    score: 100,
    timeSpent: 30,
    knowledgeNodeIds: ['kn-polynomial-addition'],
    difficulty: 'medium',
    answeredAt: Date.now() - 86400000,
    attemptCount: 1,
  },
  {
    id: 'ans-ldh-2',
    studentId: 'student-lin',
    questionId: 'q-formula-diff-sq-1', // 差的平方
    answer: 'C', // Wrong calculation
    isCorrect: false,
    score: 0,
    timeSpent: 40,
    knowledgeNodeIds: ['kn-multiplication-formula'],
    difficulty: 'hard',
    answeredAt: Date.now() - 86300000,
    attemptCount: 1,
  },
  {
    id: 'ans-ldh-3',
    studentId: 'student-lin',
    questionId: 'q-combine-3',
    answer: 'D',
    isCorrect: true,
    score: 100,
    timeSpent: 25,
    knowledgeNodeIds: ['kn-combine-terms'],
    difficulty: 'hard',
    answeredAt: Date.now() - 86200000,
    attemptCount: 1,
  },
];

// ==================== Mock 學生學習記錄 ====================

export const MOCK_STUDENT_RECORDS: Record<string, StudentLearningRecord> = {
  '王小明': {
    studentId: 'student-wang',
    studentName: '王小明',
    answers: wangXiaoMingAnswers,
    totalQuestions: 5,
    correctCount: 4,
    averageScore: 80,
    averageTimeSpent: 40,
    weakKnowledgeNodes: [
      {
        nodeId: 'kn-multiplication-formula',
        nodeName: '乘法公式 (進階)',
        errorRate: 0.5,
        relatedQuestions: ['q-formula-sum-sq-1', 'q-formula-cube-1'],
      },
    ],
    lastUpdated: Date.now(),
  },

  '陳小美': {
    studentId: 'student-chen',
    studentName: '陳小美',
    answers: chenXiaoMeiAnswers,
    totalQuestions: 4,
    correctCount: 2,
    averageScore: 50,
    averageTimeSpent: 60.5,
    weakKnowledgeNodes: [
      {
        nodeId: 'kn-distributive-law',
        nodeName: '分配律與去括號',
        errorRate: 1.0,
        relatedQuestions: ['q-distributive-1', 'q-distributive-2'],
      },
      {
        nodeId: 'kn-combine-terms',
        nodeName: '合併同類項',
        errorRate: 0.5,
        relatedQuestions: ['q-combine-1'],
      },
    ],
    lastUpdated: Date.now(),
  },

  '林大華': {
    studentId: 'student-lin',
    studentName: '林大華',
    answers: linDaHuaAnswers,
    totalQuestions: 3,
    correctCount: 2,
    averageScore: 66,
    averageTimeSpent: 31.6,
    weakKnowledgeNodes: [
      {
        nodeId: 'kn-multiplication-formula',
        nodeName: '乘法公式 (差的平方)',
        errorRate: 0.5,
        relatedQuestions: ['q-formula-diff-sq-1'],
      },
    ],
    lastUpdated: Date.now(),
  },
};
