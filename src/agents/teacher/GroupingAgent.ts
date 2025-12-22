/**
 * GroupingAgent - 分組管理 Agent
 * 
 * 職責：
 * - 自動分組學生
 * - 手動調整分組
 * - 取得分組分析
 */

import { BaseAgent } from '../BaseAgent';
import type { AgentId, AgentCategory, AgentTool, ToolInput } from '../types';

// ==================== Tool Input Types ====================

interface AutoGroupInput extends ToolInput {
    classId: string;
    groupCount?: number;
    strategy?: 'ability' | 'random' | 'mixed';
    maxGroupSize?: number;
}

interface ManualGroupInput extends ToolInput {
    classId: string;
    groups: Array<{
        name: string;
        studentIds: string[];
    }>;
}

interface GetGroupAnalyticsInput extends ToolInput {
    classId: string;
    groupId?: string;
}

// ==================== Tool Output Types ====================

interface StudentGroup {
    id: string;
    name: string;
    studentIds: string[];
    averageScore?: number;
}

interface GroupAnalytics {
    groupId: string;
    groupName: string;
    memberCount: number;
    averageScore: number;
    participationRate: number;
    topPerformers: string[];
    needsHelp: string[];
}

// ==================== Agent Implementation ====================

export class GroupingAgent extends BaseAgent {
    readonly id: AgentId = 'grouping';
    readonly name = '分組管理 Agent';
    readonly category: AgentCategory = 'teacher';

    protected defineTools(): AgentTool[] {
        return [
            this.createMockTool<AutoGroupInput, { groups: StudentGroup[]; strategy: string }>(
                'auto_group_students',
                '自動分組學生（依能力/隨機/混合）',
                (input) => {
                    const groupCount = input.groupCount || 4;
                    const strategy = input.strategy || 'mixed';

                    // Mock 分組結果
                    const groups: StudentGroup[] = Array.from({ length: groupCount }, (_, i) => ({
                        id: `group-${Date.now()}-${i}`,
                        name: `第 ${i + 1} 組`,
                        studentIds: [`student-${i * 3}`, `student-${i * 3 + 1}`, `student-${i * 3 + 2}`],
                        averageScore: 60 + Math.random() * 30,
                    }));

                    return {
                        groups,
                        strategy,
                    };
                }
            ),

            this.createMockTool<ManualGroupInput, { updated: boolean; groupCount: number }>(
                'manual_group',
                '手動調整分組',
                (input) => ({
                    updated: true,
                    groupCount: input.groups.length,
                })
            ),

            this.createMockTool<GetGroupAnalyticsInput, GroupAnalytics[]>(
                'get_group_analytics',
                '取得分組分析報告',
                (input) => {
                    // Mock 分析結果
                    if (input.groupId) {
                        return [{
                            groupId: input.groupId,
                            groupName: '指定組別',
                            memberCount: 4,
                            averageScore: 75,
                            participationRate: 0.85,
                            topPerformers: ['student-1', 'student-2'],
                            needsHelp: ['student-3'],
                        }];
                    }

                    // 返回所有組別分析
                    return Array.from({ length: 4 }, (_, i) => ({
                        groupId: `group-${i}`,
                        groupName: `第 ${i + 1} 組`,
                        memberCount: 3 + Math.floor(Math.random() * 2),
                        averageScore: 60 + Math.random() * 30,
                        participationRate: 0.7 + Math.random() * 0.25,
                        topPerformers: [`student-${i * 3}`],
                        needsHelp: Math.random() > 0.5 ? [`student-${i * 3 + 2}`] : [],
                    }));
                }
            ),
        ];
    }
}

/**
 * GroupingAgent 單例
 */
export const groupingAgent = new GroupingAgent();
