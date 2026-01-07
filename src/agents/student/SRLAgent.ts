/**
 * SRLAgent - 數學自主學習 Agent
 * 
 * 職責：
 * - 評估自主學習狀態
 * - 促進後設認知
 * - 建議學習策略
 */

import { BaseAgent } from '../BaseAgent';
import type { AgentId, AgentCategory, AgentTool } from '../types';

// ==================== Tool Input Types ====================

interface AssessSRLStateInput {
    studentId: string;
    sessionData?: {
        planningScore?: number;
        monitoringScore?: number;
        evaluatingScore?: number;
        timeManagement?: number;
    };
}

interface PromptMetacognitionInput {
    studentId: string;
    currentActivity: 'reading' | 'problem-solving' | 'reviewing' | 'quiz';
    timeInActivity: number; // 秒
}

interface SuggestLearningStrategyInput {
    studentId: string;
    weakAreas?: string[];
    learningStyle?: 'visual' | 'auditory' | 'kinesthetic' | 'reading-writing';
    availableTime?: number; // 分鐘
}

// ==================== Agent Implementation ====================

export class SRLAgent extends BaseAgent {
    readonly id: AgentId = 'math-srl';
    readonly name = '數學 SRL Agent';
    readonly category: AgentCategory = 'student';

    protected defineTools(): AgentTool[] {
        return [
            this.createMockTool(
                'assess_srl_state',
                '評估學生的自主學習狀態',
                (input: AssessSRLStateInput) => {
                    const sessionData = input.sessionData || {
                        planningScore: 0.6 + Math.random() * 0.3,
                        monitoringScore: 0.5 + Math.random() * 0.4,
                        evaluatingScore: 0.5 + Math.random() * 0.3,
                        timeManagement: 0.6 + Math.random() * 0.3,
                    };

                    const overallScore = (
                        sessionData.planningScore! +
                        sessionData.monitoringScore! +
                        sessionData.evaluatingScore! +
                        sessionData.timeManagement!
                    ) / 4;

                    return {
                        studentId: input.studentId,
                        srlLevel: overallScore >= 0.7 ? 'high' : overallScore >= 0.5 ? 'medium' : 'low',
                        dimensions: {
                            planning: Math.round(sessionData.planningScore! * 100),
                            monitoring: Math.round(sessionData.monitoringScore! * 100),
                            evaluating: Math.round(sessionData.evaluatingScore! * 100),
                            timeManagement: Math.round(sessionData.timeManagement! * 100),
                        },
                        overallScore: Math.round(overallScore * 100),
                        recommendations: this.generateRecommendations(sessionData),
                    };
                }
            ),

            this.createMockTool(
                'prompt_metacognition',
                '促進學生的後設認知思考',
                (input: PromptMetacognitionInput) => {
                    const prompts: Record<string, string[]> = {
                        reading: [
                            '你目前讀到的重點是什麼？',
                            '這個概念和之前學過的有什麼關聯？',
                            '有沒有不理解的地方需要標記？',
                        ],
                        'problem-solving': [
                            '你打算用什麼方法來解這題？',
                            '目前的解題步驟順利嗎？需要調整嗎？',
                            '檢查一下你的計算過程',
                        ],
                        reviewing: [
                            '你覺得哪些概念還需要加強？',
                            '試著用自己的話解釋一次',
                            '準備好接受測驗了嗎？',
                        ],
                        quiz: [
                            '先瀏覽所有題目，規劃時間分配',
                            '遇到不會的先跳過，之後再回來',
                            '完成後記得檢查答案',
                        ],
                    };

                    const activityPrompts = prompts[input.currentActivity] || prompts['problem-solving'];
                    const selectedPrompt = activityPrompts[Math.floor(Math.random() * activityPrompts.length)];

                    return {
                        studentId: input.studentId,
                        activity: input.currentActivity,
                        timeInActivity: input.timeInActivity,
                        metacognitionPrompt: selectedPrompt,
                        promptType: input.timeInActivity > 300 ? 'break_reminder' : 'reflection',
                    };
                }
            ),

            this.createMockTool(
                'suggest_learning_strategy',
                '建議適合的學習策略',
                (input: SuggestLearningStrategyInput) => {
                    const strategies: Record<string, string[]> = {
                        visual: ['使用心智圖整理概念', '觀看教學影片', '畫圖解題'],
                        auditory: ['聽講解或 Podcast', '和同學討論', '自言自語複述'],
                        kinesthetic: ['動手操作教具', '使用 GeoGebra 互動', '邊走邊背公式'],
                        'reading-writing': ['整理筆記', '寫練習題', '製作公式卡片'],
                    };

                    const style = input.learningStyle || 'visual';
                    const styleStrategies = strategies[style];

                    return {
                        studentId: input.studentId,
                        learningStyle: style,
                        weakAreas: input.weakAreas || [],
                        suggestedStrategies: styleStrategies,
                        timeAllocation: input.availableTime
                            ? this.allocateTime(input.availableTime, input.weakAreas?.length || 1)
                            : null,
                    };
                }
            ),
        ];
    }

    private generateRecommendations(sessionData: Record<string, number | undefined>): string[] {
        const recommendations: string[] = [];

        if ((sessionData.planningScore || 0) < 0.6) {
            recommendations.push('嘗試在學習前先設定明確的目標');
        }
        if ((sessionData.monitoringScore || 0) < 0.6) {
            recommendations.push('學習過程中多問自己「我理解了嗎？」');
        }
        if ((sessionData.evaluatingScore || 0) < 0.6) {
            recommendations.push('完成學習後花時間回顧和反思');
        }
        if ((sessionData.timeManagement || 0) < 0.6) {
            recommendations.push('使用番茄鐘等工具管理學習時間');
        }

        return recommendations.length > 0 ? recommendations : ['繼續保持良好的學習習慣！'];
    }

    private allocateTime(totalMinutes: number, topicCount: number): Record<string, number> {
        const perTopic = Math.floor(totalMinutes * 0.7 / Math.max(topicCount, 1));
        const review = Math.floor(totalMinutes * 0.2);
        const breaks = Math.floor(totalMinutes * 0.1);

        return {
            learningPerTopic: perTopic,
            review,
            breaks,
        };
    }
}

export const srlAgent = new SRLAgent();
