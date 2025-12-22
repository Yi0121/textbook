/**
 * useTeacherAIChat Hook
 * 
 * 封裝教師與 AI 助教的對話邏輯，包含：
 * 1. 意圖解析 (Intent Parsing)
 * 2. Agent 服務調用 (Agent Invocation)
 * 3. 狀態更新 (LearningPath Context Update)
 */

import { useState } from 'react';
import { useTeacherAgents } from '../context/AgentContext';
import { useLearningPath } from '../context/LearningPathContext';
import { analyzeStudentAndGeneratePath } from '../services/ai/learningPathService';
import type { StudentLearningRecord } from '../types';

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    loading?: boolean;
    action?: {
        type: 'navigate' | 'generate';
        target?: string;
        data?: unknown;
    };
}

// 預設學生即時記錄（模擬）
const DEFAULT_STUDENT_RECORD: StudentLearningRecord = {
    studentId: 'class-default',
    studentName: '全班',
    answers: [],
    totalQuestions: 0,
    correctCount: 0,
    averageScore: 65,
    averageTimeSpent: 0,
    weakKnowledgeNodes: [],
    lastUpdated: Date.now(),
};

export function useTeacherAIChat() {
    const teacher = useTeacherAgents();
    const { state: lpState, dispatch: lpDispatch } = useLearningPath();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // 解析使用者意圖（支援簡單的規則匹配，未來可接 LLM）
    const parseIntent = (prompt: string): { category: string; params: Record<string, unknown> } => {
        const lowerPrompt = prompt.toLowerCase();

        // 數字解析工具
        const parseNumber = (text: string, defaultVal: number) => {
            // 支援中文數字 "五" or 阿拉伯數字 "5"
            const map: Record<string, number> = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10 };
            const cnMatch = text.match(/[一二三四五六七八九十]/);
            if (cnMatch) return map[cnMatch[0]];
            const numMatch = text.match(/(\d+)/);
            return numMatch ? parseInt(numMatch[1]) : defaultVal;
        };

        // 1. 學習路徑/分析
        if (lowerPrompt.includes('路徑') || lowerPrompt.includes('推薦') ||
            lowerPrompt.includes('學習計畫') || lowerPrompt.includes('弱點') || lowerPrompt.includes('分析')) {
            return { category: 'learning-path', params: { studentId: 'class-default' } };
        }

        // 2. 練習題/測驗
        if (lowerPrompt.includes('練習') || lowerPrompt.includes('題目') || lowerPrompt.includes('測驗') || lowerPrompt.includes('考卷')) {
            return {
                category: 'exercise',
                params: {
                    count: parseNumber(prompt, 5),
                    topic: prompt.replace(/生成|幫我|\d+題|練習|測驗/g, '').trim() || '數學',
                }
            };
        }

        // 3. 分組
        if (lowerPrompt.includes('分組') || lowerPrompt.includes('小組') || lowerPrompt.includes('組別')) {
            return {
                category: 'grouping',
                params: {
                    groupCount: parseNumber(prompt, 4),
                }
            };
        }

        // 預設
        return { category: 'chat', params: {} };
    };

    // 發送訊息並處理回應
    const sendMessage = async (input: string) => {
        if (!input.trim() || isProcessing) return;

        // 1. 加入使用者訊息
        const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: input,
            timestamp: Date.now(),
        };
        setMessages(prev => [...prev, userMsg]);
        setIsProcessing(true);

        try {
            const intent = parseIntent(input);

            // 2. 根據意圖執行動作
            switch (intent.category) {
                case 'learning-path': {
                    // 加入思考中訊息
                    const thinkingId = `thinking-${Date.now()}`;
                    setMessages(prev => [...prev, {
                        id: thinkingId,
                        role: 'assistant',
                        content: '🔍 正在分析班級學習狀況並規劃路徑...',
                        timestamp: Date.now(),
                        loading: true
                    }]);

                    // 取得或使用預設記錄
                    const studentId = 'class-default';
                    const record = lpState.learningRecords.get(studentId) || DEFAULT_STUDENT_RECORD;

                    // 呼叫服務
                    const result = await analyzeStudentAndGeneratePath(record);

                    // 更新 Context（先儲存但不跳轉）
                    lpDispatch({
                        type: 'SET_NODES_AND_EDGES',
                        payload: { studentId, nodes: result.nodes, edges: result.edges }
                    });

                    if (result.recommendation) {
                        lpDispatch({
                            type: 'SET_AI_RECOMMENDATION',
                            payload: { studentId, recommendation: result.recommendation }
                        });
                    }

                    // 移除思考中，加入確認訊息（不自動跳轉）
                    setMessages(prev => prev.filter(m => m.id !== thinkingId));
                    addAssistantMessage(
                        `✅ AI 學習路徑分析完成！\n\n📊 **分析結果**：\n${result.recommendation?.summary || '已根據學生弱點生成個性化學習路徑'}\n\n🎯 **重點加強區域**：\n${result.recommendation?.focusAreas?.map(a => `• ${a}`).join('\n') || '• 核心概念複習'}\n\n📐 **預估學習時間**：${result.recommendation?.estimatedDuration || 30} 分鐘\n\n---\n\n👉 **確認後請點擊「查看學習路徑」進入詳細規劃**`,
                        { type: 'navigate', target: 'learning-path', data: result }
                    );
                    break;
                }

                case 'exercise': {
                    const result = await teacher.generateExercise(
                        intent.params.topic as string,
                        { count: intent.params.count as number, difficulty: 'medium', type: 'multiple-choice' }
                    );

                    if (result.success) {
                        addAssistantMessage(
                            `✅ 已生成 ${intent.params.count} 題「${intent.params.topic}」練習題！\n\n題目已準備好，可以加入到學習路徑或直接發布給學生。`,
                            { type: 'generate', data: result.data }
                        );
                    } else {
                        throw new Error(result.error);
                    }
                    break;
                }

                case 'grouping': {
                    const result = await teacher.autoGroupStudents(
                        'class-default',
                        { groupCount: intent.params.groupCount as number, strategy: 'mixed' }
                    );

                    if (result.success) {
                        addAssistantMessage(
                            `✅ 已將全班分成 ${intent.params.groupCount} 組！\n\n採用混合分組策略，確保各組能力均衡。`,
                            { type: 'generate', data: result.data }
                        );
                    } else {
                        throw new Error(result.error);
                    }
                    break;
                }

                default:
                    // 一般閒聊回覆
                    setTimeout(() => {
                        addAssistantMessage(`收到！關於「${input}」，我可以幫您：\n• 推薦學習路徑\n• 生成練習題\n• 協助分組\n\n請告訴我具體的需求！`);
                    }, 500);
            }
        } catch (error) {
            console.error(error);
            addAssistantMessage('❌ 抱歉，處理您的請求時發生錯誤，請稍後再試。');
        } finally {
            setIsProcessing(false);
        }
    };

    const addAssistantMessage = (content: string, action?: ChatMessage['action']) => {
        setMessages(prev => [...prev, {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content,
            timestamp: Date.now(),
            action
        }]);
    };

    return {
        messages,
        setMessages,
        sendMessage,
        isProcessing
    };
}
