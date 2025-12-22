/**
 * 分析 Agents - 第二層專項分析
 * 
 * 包含：
 * - SNAAnalystAgent (社群網絡分析)
 * - ENAAnalystAgent (認知網絡分析)
 * - SRLAnalystAgent (自主學習分析)
 * - ProcessAnalystAgent (歷程分析)
 * - MathProblemAnalystAgent (數學解題歷程分析)
 */

import { BaseAgent } from '../BaseAgent';
import type { AgentId, AgentCategory, AgentTool } from '../types';

// ==================== SNA Analyst Agent ====================

export class SNAAnalystAgent extends BaseAgent {
    readonly id: AgentId = 'sna-analyst';
    readonly name = '社群網絡分析 Agent';
    readonly category: AgentCategory = 'analytics';

    protected defineTools(): AgentTool[] {
        return [
            this.createMockTool(
                'analyze_social_network',
                '分析學生間的社群網絡結構',
                (input: { classId: string; timeRange?: { start: number; end: number } }) => ({
                    classId: input.classId,
                    networkMetrics: {
                        density: 0.3 + Math.random() * 0.4,
                        clustering: 0.4 + Math.random() * 0.3,
                        avgPathLength: 2 + Math.random() * 2,
                    },
                    nodeCount: 25 + Math.floor(Math.random() * 10),
                    edgeCount: 80 + Math.floor(Math.random() * 40),
                })
            ),

            this.createMockTool(
                'identify_clusters',
                '識別社群群組',
                (input: { classId: string }) => ({
                    classId: input.classId,
                    clusterCount: 3 + Math.floor(Math.random() * 3),
                    clusters: [
                        { id: 'cluster-1', size: 8, label: '高互動群' },
                        { id: 'cluster-2', size: 10, label: '中互動群' },
                        { id: 'cluster-3', size: 7, label: '低互動群' },
                    ],
                })
            ),

            this.createMockTool(
                'measure_centrality',
                '計算中心性指標',
                (input: { classId: string; studentId?: string }) => ({
                    classId: input.classId,
                    centralityMeasures: {
                        degree: { top: ['student-1', 'student-5'], avg: 4.2 },
                        betweenness: { top: ['student-3', 'student-7'], avg: 0.15 },
                        closeness: { top: ['student-1', 'student-3'], avg: 0.45 },
                    },
                })
            ),
        ];
    }
}

// ==================== ENA Analyst Agent ====================

export class ENAAnalystAgent extends BaseAgent {
    readonly id: AgentId = 'ena-analyst';
    readonly name = '認知網絡分析 Agent';
    readonly category: AgentCategory = 'analytics';

    protected defineTools(): AgentTool[] {
        return [
            this.createMockTool(
                'analyze_epistemic_network',
                '分析認知網絡結構',
                (input: { studentId: string; topic?: string }) => ({
                    studentId: input.studentId,
                    topic: input.topic || 'general',
                    networkComplexity: 0.5 + Math.random() * 0.4,
                    conceptConnections: 12 + Math.floor(Math.random() * 8),
                    strongestLinks: [
                        { from: '方程式', to: '解法', weight: 0.8 },
                        { from: '圖形', to: '座標', weight: 0.7 },
                    ],
                })
            ),

            this.createMockTool(
                'identify_knowledge_connections',
                '識別知識連結',
                (input: { studentId: string }) => ({
                    studentId: input.studentId,
                    connections: [
                        { concept1: '二次方程式', concept2: '判別式', strength: 'strong' },
                        { concept1: '圖形', concept2: '頂點', strength: 'medium' },
                        { concept1: '因式分解', concept2: '公式解', strength: 'weak' },
                    ],
                    missingConnections: ['配方法與頂點式'],
                })
            ),

            this.createMockTool(
                'compare_learning_patterns',
                '比較學習模式',
                (input: { studentIds: string[] }) => ({
                    comparedStudents: input.studentIds,
                    patterns: input.studentIds.map(id => ({
                        studentId: id,
                        patternType: ['visual', 'procedural', 'conceptual'][Math.floor(Math.random() * 3)],
                        similarity: 0.3 + Math.random() * 0.6,
                    })),
                })
            ),
        ];
    }
}

// ==================== SRL Analyst Agent ====================

export class SRLAnalystAgent extends BaseAgent {
    readonly id: AgentId = 'srl-analyst';
    readonly name = '自主學習分析 Agent';
    readonly category: AgentCategory = 'analytics';

    protected defineTools(): AgentTool[] {
        return [
            this.createMockTool(
                'analyze_srl_patterns',
                '分析自主學習模式',
                (input: { studentId: string; timeRange?: { start: number; end: number } }) => ({
                    studentId: input.studentId,
                    srlProfile: {
                        planning: 0.5 + Math.random() * 0.4,
                        monitoring: 0.4 + Math.random() * 0.5,
                        evaluating: 0.5 + Math.random() * 0.4,
                    },
                    trend: ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)],
                })
            ),

            this.createMockTool(
                'measure_self_regulation',
                '測量自主調節程度',
                (input: { studentId: string }) => ({
                    studentId: input.studentId,
                    regulationScore: Math.round((0.5 + Math.random() * 0.4) * 100),
                    dimensions: {
                        goalSetting: Math.round(Math.random() * 100),
                        timeManagement: Math.round(Math.random() * 100),
                        strategyUse: Math.round(Math.random() * 100),
                        selfEvaluation: Math.round(Math.random() * 100),
                    },
                })
            ),

            this.createMockTool(
                'identify_srl_weakness',
                '識別 SRL 弱點',
                (input: { studentId: string }) => ({
                    studentId: input.studentId,
                    weaknesses: ['時間管理', '自我監控'].slice(0, 1 + Math.floor(Math.random() * 2)),
                    recommendations: ['使用番茄鐘', '設定學習目標', '定期反思'],
                })
            ),
        ];
    }
}

// ==================== Process Analyst Agent ====================

export class ProcessAnalystAgent extends BaseAgent {
    readonly id: AgentId = 'process-analyst';
    readonly name = '歷程分析 Agent';
    readonly category: AgentCategory = 'analytics';

    protected defineTools(): AgentTool[] {
        return [
            this.createMockTool(
                'analyze_learning_trajectory',
                '分析學習軌跡',
                (input: { studentId: string; courseId?: string }) => ({
                    studentId: input.studentId,
                    trajectoryType: ['linear', 'exploratory', 'struggling'][Math.floor(Math.random() * 3)],
                    completionRate: 0.4 + Math.random() * 0.5,
                    avgTimePerModule: 15 + Math.floor(Math.random() * 20),
                    milestones: ['chapter-1', 'quiz-1', 'chapter-2'],
                })
            ),

            this.createMockTool(
                'identify_bottlenecks',
                '識別學習瓶頸',
                (input: { studentId: string }) => ({
                    studentId: input.studentId,
                    bottlenecks: [
                        { topic: '判別式', dropoffRate: 0.3, avgAttempts: 4.2 },
                        { topic: '圖形頂點', dropoffRate: 0.2, avgAttempts: 3.5 },
                    ],
                    severity: 'medium',
                })
            ),

            this.createMockTool(
                'measure_progress',
                '測量學習進度',
                (input: { studentId: string; targetGoals?: string[] }) => ({
                    studentId: input.studentId,
                    overallProgress: Math.round((0.3 + Math.random() * 0.6) * 100),
                    goalsProgress: (input.targetGoals || ['goal-1']).map(g => ({
                        goalId: g,
                        progress: Math.round(Math.random() * 100),
                    })),
                    estimatedCompletion: Date.now() + Math.floor(Math.random() * 7) * 86400000,
                })
            ),
        ];
    }
}

// ==================== Math Problem Analyst Agent ====================

export class MathProblemAnalystAgent extends BaseAgent {
    readonly id: AgentId = 'math-problem-analyst';
    readonly name = '數學解題歷程分析 Agent';
    readonly category: AgentCategory = 'analytics';

    protected defineTools(): AgentTool[] {
        return [
            this.createMockTool(
                'analyze_problem_solving',
                '分析解題歷程',
                (input: { studentId: string; problemId: string }) => ({
                    studentId: input.studentId,
                    problemId: input.problemId,
                    solvingPhases: [
                        { phase: 'understanding', time: 45, success: true },
                        { phase: 'planning', time: 30, success: true },
                        { phase: 'executing', time: 120, success: false },
                        { phase: 'reviewing', time: 20, success: true },
                    ],
                    strategyUsed: '代入法',
                    errorTypes: ['計算錯誤'],
                })
            ),

            this.createMockTool(
                'identify_misconceptions',
                '識別迷思概念',
                (input: { studentId: string; topic?: string }) => ({
                    studentId: input.studentId,
                    topic: input.topic || '二次方程式',
                    misconceptions: [
                        { concept: '開口方向', description: '誤以為 a>0 開口向下', severity: 'high' },
                        { concept: '對稱軸', description: '公式記憶錯誤', severity: 'medium' },
                    ],
                    suggestedInterventions: ['視覺化圖形變化', '公式推導練習'],
                })
            ),

            this.createMockTool(
                'trace_solution_path',
                '追蹤解題路徑',
                (input: { studentId: string; problemId: string }) => ({
                    studentId: input.studentId,
                    problemId: input.problemId,
                    steps: [
                        { step: 1, action: '讀題', correct: true },
                        { step: 2, action: '設未知數', correct: true },
                        { step: 3, action: '列方程式', correct: false, error: '式子不完整' },
                        { step: 4, action: '修正後解題', correct: true },
                    ],
                    efficiency: 0.7,
                    optimalSteps: 4,
                    actualSteps: 5,
                })
            ),
        ];
    }
}

// Export singleton instances
export const snaAnalystAgent = new SNAAnalystAgent();
export const enaAnalystAgent = new ENAAnalystAgent();
export const srlAnalystAgent = new SRLAnalystAgent();
export const processAnalystAgent = new ProcessAnalystAgent();
export const mathProblemAnalystAgent = new MathProblemAnalystAgent();
