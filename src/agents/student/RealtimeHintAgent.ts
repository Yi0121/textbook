/**
 * RealtimeHintAgent - 即時建議 Agent
 * 
 * 職責：
 * - 8a. 解題策略即時建議
 * - 8b. 合作問題解決 (CPS) 即時建議
 */

import { BaseAgent } from '../BaseAgent';
import type { AgentId, AgentCategory, AgentTool } from '../types';

// ==================== Tool Input Types ====================

interface SuggestStrategyInput {
    studentId: string;
    problemId: string;
    problemType: 'algebra' | 'geometry' | 'word-problem' | 'proof';
    currentStep?: number;
    stuckDuration?: number; // 秒
}

interface SuggestCPSActionInput {
    sessionId: string;
    studentId: string;
    cpsPhase: 'explore' | 'understand' | 'represent' | 'plan' | 'execute' | 'monitor';
    teamStatus?: {
        communicationLevel: 'low' | 'medium' | 'high';
        participationBalance: number; // 0-1
        consensusReached: boolean;
    };
}

// ==================== Agent Implementation ====================

export class RealtimeHintAgent extends BaseAgent {
    readonly id: AgentId = 'realtime-hint';
    readonly name = '即時建議 Agent';
    readonly category: AgentCategory = 'student';

    protected defineTools(): AgentTool[] {
        return [
            this.createMockTool(
                'suggest_strategy',
                '提供解題策略即時建議',
                (input: SuggestStrategyInput) => {
                    const strategies: Record<string, string[]> = {
                        algebra: [
                            '試試把方程式移項整理',
                            '可以用因式分解或公式解',
                            '畫數線幫助理解',
                        ],
                        geometry: [
                            '先標記已知條件在圖上',
                            '找出相似或全等的關係',
                            '運用輔助線',
                        ],
                        'word-problem': [
                            '把文字轉換成數學式',
                            '設定未知數並列方程式',
                            '檢查單位是否一致',
                        ],
                        proof: [
                            '寫出已知條件和求證目標',
                            '考慮反證法',
                            '找出關鍵定理',
                        ],
                    };

                    const typeStrategies = strategies[input.problemType] || strategies.algebra;
                    const strategyIndex = Math.min(input.currentStep || 0, typeStrategies.length - 1);

                    return {
                        studentId: input.studentId,
                        problemId: input.problemId,
                        strategy: typeStrategies[strategyIndex],
                        confidence: 0.7 + Math.random() * 0.25,
                        isUrgent: (input.stuckDuration || 0) > 120,
                    };
                }
            ),

            this.createMockTool(
                'suggest_cps_action',
                '提供合作問題解決 (CPS) 即時建議',
                (input: SuggestCPSActionInput) => {
                    const phaseAdvice: Record<string, string> = {
                        explore: '鼓勵團隊成員分享各自對問題的理解',
                        understand: '嘗試用自己的話重述問題',
                        represent: '畫圖或列表來呈現資訊',
                        plan: '討論可能的解題步驟並達成共識',
                        execute: '按照計畫執行，並保持溝通',
                        monitor: '回顧解題過程，檢查是否有遺漏',
                    };

                    let teamAdvice = '';
                    if (input.teamStatus) {
                        if (input.teamStatus.communicationLevel === 'low') {
                            teamAdvice = '建議：增加團隊溝通，確保每個人都能表達想法。';
                        } else if (input.teamStatus.participationBalance < 0.5) {
                            teamAdvice = '建議：鼓勵較少發言的成員參與討論。';
                        }
                    }

                    return {
                        sessionId: input.sessionId,
                        studentId: input.studentId,
                        currentPhase: input.cpsPhase,
                        phaseAdvice: phaseAdvice[input.cpsPhase],
                        teamAdvice: teamAdvice || null,
                        nextPhase: this.getNextPhase(input.cpsPhase),
                    };
                }
            ),
        ];
    }

    private getNextPhase(currentPhase: string): string | null {
        const phases = ['explore', 'understand', 'represent', 'plan', 'execute', 'monitor'];
        const idx = phases.indexOf(currentPhase);
        return idx < phases.length - 1 ? phases[idx + 1] : null;
    }
}

export const realtimeHintAgent = new RealtimeHintAgent();
