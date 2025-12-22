/**
 * GraderAgent - 評分 Agent
 * 
 * 職責：
 * - 自動評分
 * - 檢查答案正確性
 * - 提供回饋
 * - 計算成績
 */

import { BaseAgent } from '../BaseAgent';
import type { AgentId, AgentCategory, AgentTool } from '../types';
import { decideNextPathBasedOnScore } from '../../services/ai/learningPathService';

// ==================== Tool Input Types ====================

interface AutoGradeInput {
    submissionId: string;
    questionType: 'multiple-choice' | 'fill-blank' | 'short-answer' | 'essay';
    studentAnswer: string | string[];
    correctAnswer?: string | string[];
}

interface CheckAnswerInput {
    questionId: string;
    studentAnswer: string;
    correctAnswer: string;
    tolerance?: number; // 數值答案的容許誤差
}

interface ProvideFeedbackInput {
    questionId: string;
    isCorrect: boolean;
    studentAnswer: string;
    correctAnswer: string;
    conceptId?: string;
}

interface CalculateScoreInput {
    studentId: string;
    quizId: string;
    answers: Array<{
        questionId: string;
        isCorrect: boolean;
        points: number;
    }>;
}

interface DecideNextPathInput {
    score: number;
    nodeId: string;
}

// ==================== Agent Implementation ====================

export class GraderAgent extends BaseAgent {
    readonly id: AgentId = 'grader';
    readonly name = '評分 Agent';
    readonly category: AgentCategory = 'student';

    protected defineTools(): AgentTool[] {
        return [
            this.createMockTool(
                'auto_grade',
                '自動評分學生作答',
                (input: AutoGradeInput) => {
                    // Mock 評分邏輯
                    const isCorrect = Math.random() > 0.3; // 70% 機率正確 (模擬)
                    return {
                        submissionId: input.submissionId,
                        questionType: input.questionType,
                        isCorrect,
                        score: isCorrect ? 100 : Math.floor(Math.random() * 50),
                        gradedAt: Date.now(),
                    };
                }
            ),

            this.createMockTool(
                'check_answer',
                '檢查答案正確性',
                (input: CheckAnswerInput) => {
                    const studentAns = input.studentAnswer.trim().toLowerCase();
                    const correctAns = input.correctAnswer.trim().toLowerCase();

                    // 簡單字串比對 (實際可擴充數值比對、模糊比對等)
                    const isCorrect = studentAns === correctAns;

                    return {
                        questionId: input.questionId,
                        isCorrect,
                        similarity: isCorrect ? 1 : 0.3 + Math.random() * 0.4,
                    };
                }
            ),

            this.createMockTool(
                'provide_feedback',
                '根據作答結果提供回饋',
                (input: ProvideFeedbackInput) => ({
                    questionId: input.questionId,
                    feedbackType: input.isCorrect ? 'positive' : 'corrective',
                    message: input.isCorrect
                        ? '正確！做得好！'
                        : `正確答案是：${input.correctAnswer}。請複習相關概念。`,
                    suggestedResources: input.isCorrect ? [] : [`review-${input.conceptId || 'general'}`],
                })
            ),

            this.createMockTool(
                'calculate_score',
                '計算測驗總分',
                (input: CalculateScoreInput) => {
                    const totalPoints = input.answers.reduce((sum, a) => sum + a.points, 0);
                    const earnedPoints = input.answers
                        .filter(a => a.isCorrect)
                        .reduce((sum, a) => sum + a.points, 0);

                    return {
                        studentId: input.studentId,
                        quizId: input.quizId,
                        totalQuestions: input.answers.length,
                        correctCount: input.answers.filter(a => a.isCorrect).length,
                        totalPoints,
                        earnedPoints,
                        percentage: Math.round((earnedPoints / totalPoints) * 100),
                        grade: this.calculateGrade((earnedPoints / totalPoints) * 100),
                    };
                }
            ),

            // 整合現有服務
            {
                name: 'decide_next_path',
                description: '根據測驗分數決定下一步學習路徑',
                execute: async (input: DecideNextPathInput) => {
                    const nextNodeId = decideNextPathBasedOnScore(input.score, input.nodeId);
                    return {
                        score: input.score,
                        currentNodeId: input.nodeId,
                        nextNodeId,
                        recommendation: input.score >= 80 ? 'advance' : input.score >= 60 ? 'review' : 'retry',
                    };
                },
            },
        ];
    }

    private calculateGrade(percentage: number): string {
        if (percentage >= 90) return 'A';
        if (percentage >= 80) return 'B';
        if (percentage >= 70) return 'C';
        if (percentage >= 60) return 'D';
        return 'F';
    }
}

export const graderAgent = new GraderAgent();
