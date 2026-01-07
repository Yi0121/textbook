/**
 * PeerFacilitatorAgent - AI 陪伴/引導 Agent
 * 
 * 職責：
 * - 加入共享白板
 * - 發送聊天訊息
 * - AI 引導討論
 * - 建議協作方式
 */

import { BaseAgent } from '../BaseAgent';
import type { AgentId, AgentCategory, AgentTool } from '../types';

// ==================== Tool Input Types ====================

interface JoinWhiteboardInput {
    sessionId: string;
    studentId: string;
    role?: 'participant' | 'observer';
}

interface SendChatMessageInput {
    sessionId: string;
    senderId: string;
    message: string;
    messageType?: 'text' | 'hint' | 'question' | 'encouragement';
}

interface AIFacilitateInput {
    sessionId: string;
    context: {
        topic?: string;
        currentPhase?: string;
        participantCount?: number;
        lastMessages?: string[];
    };
}

interface SuggestCollaborationInput {
    sessionId: string;
    groupSize: number;
    taskType?: 'problem-solving' | 'discussion' | 'project';
}

// ==================== Agent Implementation ====================

export class PeerFacilitatorAgent extends BaseAgent {
    readonly id: AgentId = 'virtual-collaborative-facilitator';
    readonly name = '虛擬協作引導 Agent';
    readonly category: AgentCategory = 'student';

    protected defineTools(): AgentTool[] {
        return [
            this.createMockTool(
                'join_whiteboard',
                '加入共享白板',
                (input: JoinWhiteboardInput) => ({
                    joined: true,
                    sessionId: input.sessionId,
                    studentId: input.studentId,
                    role: input.role || 'participant',
                    whiteboardUrl: `whiteboard://${input.sessionId}`,
                    connectedAt: Date.now(),
                })
            ),

            this.createMockTool(
                'send_chat_message',
                '發送 AI 輔助訊息',
                (input: SendChatMessageInput) => ({
                    sent: true,
                    messageId: `msg-${Date.now()}`,
                    sessionId: input.sessionId,
                    messageType: input.messageType || 'text',
                    timestamp: Date.now(),
                })
            ),

            this.createMockTool(
                'ai_facilitate',
                'AI 引導討論',
                (input: AIFacilitateInput) => {
                    const facilitations = [
                        '大家有沒有想過從另一個角度來看這個問題？',
                        '目前的討論很好！讓我們把重點整理一下。',
                        '有同學想要分享自己的解題思路嗎？',
                        '我注意到有些同學還沒發言，歡迎加入討論！',
                    ];

                    return {
                        sessionId: input.sessionId,
                        facilitation: facilitations[Math.floor(Math.random() * facilitations.length)],
                        suggestedAction: 'continue_discussion',
                        context: input.context,
                    };
                }
            ),

            this.createMockTool(
                'suggest_collaboration',
                '建議協作方式',
                (input: SuggestCollaborationInput) => {
                    const strategies = {
                        'problem-solving': [
                            '建議使用「分工解題」：每人負責一個步驟',
                            '可以嘗試「輪流主持」：每人輪流說明自己的想法',
                        ],
                        discussion: [
                            '建議使用「魚缸式討論」：部分同學討論，其他人觀察',
                            '可以嘗試「角色扮演」：從不同角度思考問題',
                        ],
                        project: [
                            '建議分配明確角色：報告者、記錄者、時間管理者',
                            '可以使用「站立會議」：快速同步進度',
                        ],
                    };

                    const taskStrategies = strategies[input.taskType || 'discussion'];

                    return {
                        sessionId: input.sessionId,
                        groupSize: input.groupSize,
                        taskType: input.taskType || 'discussion',
                        suggestions: taskStrategies,
                        optimalGroupSize: input.groupSize <= 2 ? 2 : input.groupSize <= 4 ? 4 : 5,
                    };
                }
            ),
        ];
    }
}

export const peerFacilitatorAgent = new PeerFacilitatorAgent();
