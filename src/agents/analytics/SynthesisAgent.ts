/**
 * SynthesisAgent - 綜合分析 Agent
 * 
 * 職責（綜合層）：
 * - 彙整各項分析結果
 * - 生成教學建議
 * - 優先排序介入措施
 */

import { BaseAgent } from '../BaseAgent';
import type { AgentId, AgentCategory, AgentTool } from '../types';

// ==================== Tool Input Types ====================

interface AggregateAnalysesInput {
    studentId: string;
    analyses: {
        sna?: Record<string, unknown>;
        ena?: Record<string, unknown>;
        srl?: Record<string, unknown>;
        process?: Record<string, unknown>;
    };
}

interface GenerateTeachingSuggestionsInput {
    studentId: string;
    weakAreas: string[];
    learningStyle?: string;
    classContext?: Record<string, unknown>;
}

interface PrioritizeInterventionsInput {
    studentId: string;
    issues: Array<{
        type: string;
        severity: 'low' | 'medium' | 'high';
        description: string;
    }>;
}

// ==================== Agent Implementation ====================

export class SynthesisAgent extends BaseAgent {
    readonly id: AgentId = 'synthesis';
    readonly name = '綜合分析 Agent';
    readonly category: AgentCategory = 'analytics';

    protected defineTools(): AgentTool[] {
        return [
            this.createMockTool(
                'aggregate_analyses',
                '彙整多項分析結果成綜合報告',
                (input: AggregateAnalysesInput) => ({
                    studentId: input.studentId,
                    aggregatedReport: {
                        socialEngagement: input.analyses.sna ? 'active' : 'unknown',
                        knowledgeNetwork: input.analyses.ena ? 'developing' : 'unknown',
                        selfRegulation: input.analyses.srl ? 'moderate' : 'unknown',
                        learningProgress: input.analyses.process ? 'on-track' : 'unknown',
                    },
                    overallStatus: 'needs_attention',
                    keyInsights: [
                        '社群互動良好，但知識連結需加強',
                        '自主學習能力中等，建議提供更多策略指導',
                    ],
                    generatedAt: Date.now(),
                })
            ),

            this.createMockTool(
                'generate_teaching_suggestions',
                '根據分析結果生成教學建議',
                (input: GenerateTeachingSuggestionsInput) => ({
                    studentId: input.studentId,
                    suggestions: [
                        {
                            type: 'content',
                            suggestion: `針對 ${input.weakAreas[0] || '概念理解'} 提供額外練習`,
                            priority: 'high',
                        },
                        {
                            type: 'pedagogy',
                            suggestion: '使用視覺化教材輔助解說',
                            priority: 'medium',
                        },
                        {
                            type: 'interaction',
                            suggestion: '增加小組討論機會',
                            priority: 'low',
                        },
                    ],
                    adaptations: input.learningStyle
                        ? [`根據 ${input.learningStyle} 學習風格調整教材`]
                        : [],
                })
            ),

            this.createMockTool(
                'prioritize_interventions',
                '優先排序介入措施',
                (input: PrioritizeInterventionsInput) => {
                    const sortedIssues = [...input.issues].sort((a, b) => {
                        const severity = { high: 3, medium: 2, low: 1 };
                        return severity[b.severity] - severity[a.severity];
                    });

                    return {
                        studentId: input.studentId,
                        prioritizedInterventions: sortedIssues.map((issue, idx) => ({
                            rank: idx + 1,
                            ...issue,
                            recommendedAction: this.getRecommendedAction(issue.type),
                            estimatedImpact: issue.severity === 'high' ? 'significant' : 'moderate',
                        })),
                        immediateAction: sortedIssues[0] || null,
                    };
                }
            ),
        ];
    }

    private getRecommendedAction(issueType: string): string {
        const actions: Record<string, string> = {
            'knowledge-gap': '安排補救教學',
            'low-engagement': '個別輔導談話',
            'struggle': '提供額外練習資源',
            default: '持續觀察並紀錄',
        };
        return actions[issueType] || actions.default;
    }
}

export const synthesisAgent = new SynthesisAgent();
