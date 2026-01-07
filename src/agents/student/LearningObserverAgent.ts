/**
 * LearningObserverAgent - 學習觀察 Agent
 * 
 * 職責：
 * - 追蹤學習行為
 * - 記錄互動事件
 * - 偵測學習困難
 * - 監測專注度
 */

import { BaseAgent } from '../BaseAgent';
import type { AgentId, AgentCategory, AgentTool } from '../types';

// ==================== Tool Input Types ====================

interface TrackBehaviorInput {
    studentId: string;
    behaviorType: 'click' | 'scroll' | 'input' | 'idle' | 'focus' | 'blur';
    targetElement?: string;
    timestamp?: number;
}

interface LogInteractionInput {
    studentId: string;
    eventType: string;
    eventData: Record<string, unknown>;
    sessionId?: string;
}

interface DetectStruggleInput {
    studentId: string;
    questionId: string;
    timeSpent: number; // 秒
    attemptCount: number;
    hintUsed: boolean;
}

interface MonitorEngagementInput {
    studentId: string;
    sessionId: string;
    metrics?: {
        activeTime: number;
        idleTime: number;
        interactionCount: number;
    };
}

// ==================== Agent Implementation ====================

export class LearningObserverAgent extends BaseAgent {
    readonly id: AgentId = 'learning-behavior-observer';
    readonly name = '學習行為觀測 Agent';
    readonly category: AgentCategory = 'student';

    protected defineTools(): AgentTool[] {
        return [
            this.createMockTool(
                'track_behavior',
                '追蹤學生學習行為',
                (input: TrackBehaviorInput) => ({
                    tracked: true,
                    studentId: input.studentId,
                    behaviorType: input.behaviorType,
                    timestamp: input.timestamp || Date.now(),
                    sessionId: `session-${Date.now()}`,
                })
            ),

            this.createMockTool(
                'log_interaction',
                '記錄互動事件',
                (input: LogInteractionInput) => ({
                    logged: true,
                    eventId: `event-${Date.now()}`,
                    studentId: input.studentId,
                    eventType: input.eventType,
                    timestamp: Date.now(),
                })
            ),

            this.createMockTool(
                'detect_struggle',
                '偵測學生是否遇到學習困難',
                (input: DetectStruggleInput) => {
                    // 根據指標判斷是否遇到困難
                    const isStruggling =
                        input.timeSpent > 180 || // 超過 3 分鐘
                        input.attemptCount >= 3 || // 嘗試 3 次以上
                        input.hintUsed;

                    const struggleLevel = isStruggling
                        ? (input.attemptCount >= 5 ? 'high' : 'medium')
                        : 'low';

                    return {
                        studentId: input.studentId,
                        questionId: input.questionId,
                        isStruggling,
                        struggleLevel,
                        indicators: {
                            timeSpent: input.timeSpent,
                            attemptCount: input.attemptCount,
                            hintUsed: input.hintUsed,
                        },
                        recommendation: isStruggling
                            ? 'provide_additional_support'
                            : 'continue_monitoring',
                    };
                }
            ),

            this.createMockTool(
                'monitor_engagement',
                '監測學生專注度',
                (input: MonitorEngagementInput) => {
                    const metrics = input.metrics || {
                        activeTime: 300,
                        idleTime: 60,
                        interactionCount: 45,
                    };

                    const totalTime = metrics.activeTime + metrics.idleTime;
                    const engagementRate = metrics.activeTime / totalTime;
                    const interactionRate = metrics.interactionCount / (totalTime / 60);

                    return {
                        studentId: input.studentId,
                        sessionId: input.sessionId,
                        engagementRate: Math.round(engagementRate * 100),
                        interactionRate: Math.round(interactionRate * 10) / 10,
                        status: engagementRate >= 0.7 ? 'engaged' : engagementRate >= 0.4 ? 'partially_engaged' : 'disengaged',
                        metrics,
                    };
                }
            ),
        ];
    }
}

export const learningObserverAgent = new LearningObserverAgent();
