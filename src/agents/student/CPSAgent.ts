/**
 * CPSAgent - 合作問題解決 Agent
 *
 * 職責：
 * - 引導建立共同理解
 * - 協調小組合作流程
 * - 評估 CPS 能力
 */

import { BaseAgent } from '../BaseAgent';
import type { AgentId, AgentCategory, AgentTool } from '../types';

// ==================== Tool Input Types ====================

interface GuideSharedUnderstandingInput {
    groupId: string;
    problemId: string;
    currentPhase?: 'exploring' | 'representing' | 'planning' | 'executing' | 'reflecting';
    memberContributions?: Record<string, string>;
}

interface CoordinateCollaborationInput {
    groupId: string;
    taskId: string;
    coordinationType: 'turn-taking' | 'role-assignment' | 'consensus-building' | 'conflict-resolution';
    members: string[];
}

interface AssessCPSSkillInput {
    studentId: string;
    groupId: string;
    observedBehaviors: string[];
    duration?: number; // 分鐘
}

// ==================== Agent Implementation ====================

export class CPSAgent extends BaseAgent {
    readonly id: AgentId = 'cps-agent';
    readonly name = '合作問題解決 Agent';
    readonly category: AgentCategory = 'student';

    protected defineTools(): AgentTool[] {
        return [
            this.createMockTool(
                'guide_shared_understanding',
                '引導小組成員建立對問題的共同理解',
                (input: GuideSharedUnderstandingInput) => ({
                    groupId: input.groupId,
                    problemId: input.problemId,
                    currentPhase: input.currentPhase || 'exploring',
                    guidancePrompts: this.getPhasePrompts(input.currentPhase || 'exploring'),
                    checklistItems: this.getPhaseChecklist(input.currentPhase || 'exploring'),
                    suggestedActivities: this.getSuggestedActivities(input.currentPhase || 'exploring'),
                    nextPhase: this.getNextPhase(input.currentPhase || 'exploring'),
                    sharedArtifacts: ['問題定義文件', '概念圖', '解題策略清單'],
                })
            ),

            this.createMockTool(
                'coordinate_collaboration',
                '協調小組成員的合作流程與互動',
                (input: CoordinateCollaborationInput) => ({
                    groupId: input.groupId,
                    taskId: input.taskId,
                    coordinationType: input.coordinationType,
                    memberRoles: this.assignRoles(input.members, input.coordinationType),
                    guidelines: this.getCoordinationGuidelines(input.coordinationType),
                    turnOrder: input.coordinationType === 'turn-taking' ? this.shuffleArray([...input.members]) : undefined,
                    consensusStatus: input.coordinationType === 'consensus-building' ? 'in-progress' : undefined,
                    interventionSuggestions: this.getInterventionSuggestions(input.coordinationType),
                })
            ),

            this.createMockTool(
                'assess_cps_skill',
                '評估學生的合作問題解決能力',
                (input: AssessCPSSkillInput) => ({
                    studentId: input.studentId,
                    groupId: input.groupId,
                    assessment: {
                        overallScore: this.calculateOverallScore(input.observedBehaviors),
                        dimensions: this.assessDimensions(input.observedBehaviors),
                        strengths: this.identifyStrengths(input.observedBehaviors),
                        areasForImprovement: this.identifyAreasForImprovement(input.observedBehaviors),
                    },
                    behaviorLog: input.observedBehaviors,
                    duration: input.duration || 30,
                    recommendations: this.getSkillRecommendations(input.observedBehaviors),
                })
            ),
        ];
    }

    private getPhasePrompts(phase: string): string[] {
        const prompts: Record<string, string[]> = {
            exploring: [
                '這個問題要我們解決什麼？',
                '你們每個人是怎麼理解這個問題的？',
                '有哪些資訊是我們已經知道的？',
            ],
            representing: [
                '我們可以用什麼方式呈現這個問題？',
                '畫個圖會不會更清楚？',
                '有沒有類似的問題可以參考？',
            ],
            planning: [
                '我們應該先做什麼？',
                '每個人可以負責哪個部分？',
                '我們的計畫合理嗎？',
            ],
            executing: [
                '目前的進度如何？',
                '有沒有遇到困難？',
                '需要調整計畫嗎？',
            ],
            reflecting: [
                '我們的解法正確嗎？',
                '有沒有其他可能的解法？',
                '這次合作學到了什麼？',
            ],
        };
        return prompts[phase] || prompts.exploring;
    }

    private getPhaseChecklist(phase: string): string[] {
        const checklists: Record<string, string[]> = {
            exploring: ['□ 確認所有人都理解問題', '□ 列出已知條件', '□ 確認目標'],
            representing: ['□ 選擇合適的表徵方式', '□ 確認表徵正確', '□ 所有人都能理解'],
            planning: ['□ 分工明確', '□ 時間分配合理', '□ 有備案計畫'],
            executing: ['□ 按計畫執行', '□ 保持溝通', '□ 記錄進度'],
            reflecting: ['□ 檢驗答案', '□ 反思過程', '□ 總結學習'],
        };
        return checklists[phase] || [];
    }

    private getSuggestedActivities(phase: string): string[] {
        const activities: Record<string, string[]> = {
            exploring: ['共同閱讀題目', '輪流說明理解', '提出疑問'],
            representing: ['畫圖示', '列表格', '建立模型'],
            planning: ['腦力激盪', '分配角色', '設定時程'],
            executing: ['分頭進行', '定期同步', '互相支援'],
            reflecting: ['對照答案', '討論過程', '寫學習心得'],
        };
        return activities[phase] || [];
    }

    private getNextPhase(current: string): string {
        const sequence = ['exploring', 'representing', 'planning', 'executing', 'reflecting'];
        const idx = sequence.indexOf(current);
        return idx < sequence.length - 1 ? sequence[idx + 1] : 'exploring';
    }

    private assignRoles(members: string[], _type: string): Record<string, string> {
        const roles = ['協調者', '記錄者', '檢查者', '報告者'];
        const result: Record<string, string> = {};
        members.forEach((member, idx) => {
            result[member] = roles[idx % roles.length];
        });
        return result;
    }

    private getCoordinationGuidelines(type: string): string[] {
        const guidelines: Record<string, string[]> = {
            'turn-taking': ['每人有 2 分鐘發言時間', '發言時其他人專心聆聽', '可以做筆記但不打斷'],
            'role-assignment': ['根據優勢分配角色', '角色可以輪換', '每個角色都很重要'],
            'consensus-building': ['先收集所有意見', '找出共同點', '投票決定分歧'],
            'conflict-resolution': ['保持尊重', '聚焦問題不針對人', '尋求雙贏方案'],
        };
        return guidelines[type] || [];
    }

    private getInterventionSuggestions(type: string): string[] {
        const suggestions: Record<string, string[]> = {
            'turn-taking': ['提醒沉默的成員發言', '控制發言時間'],
            'role-assignment': ['確認角色理解', '支援有困難的角色'],
            'consensus-building': ['釐清分歧點', '提供中立觀點'],
            'conflict-resolution': ['緩和氣氛', '重新聚焦目標'],
        };
        return suggestions[type] || [];
    }

    private shuffleArray<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    private calculateOverallScore(behaviors: string[]): number {
        // 簡化計分：每個正向行為 10 分，最高 100
        return Math.min(behaviors.length * 10, 100);
    }

    private assessDimensions(_behaviors: string[]): Record<string, number> {
        return {
            '建立共識': Math.floor(Math.random() * 20) + 60,
            '溝通協調': Math.floor(Math.random() * 20) + 65,
            '任務執行': Math.floor(Math.random() * 20) + 70,
            '衝突處理': Math.floor(Math.random() * 20) + 55,
            '反思改進': Math.floor(Math.random() * 20) + 60,
        };
    }

    private identifyStrengths(_behaviors: string[]): string[] {
        return ['積極參與討論', '願意傾聽他人意見', '能適時提供協助'];
    }

    private identifyAreasForImprovement(_behaviors: string[]): string[] {
        return ['可以更主動分享想法', '注意時間管理', '嘗試擔任不同角色'];
    }

    private getSkillRecommendations(_behaviors: string[]): string[] {
        return [
            '多練習輪流發言',
            '嘗試使用「我覺得...因為...」的句型',
            '在意見不同時先確認理解對方的想法',
        ];
    }
}

export const cpsAgent = new CPSAgent();
