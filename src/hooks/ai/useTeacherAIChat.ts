/**
 * useTeacherAIChat Hook
 * 
 * 封裝教師與 AI 助教的對話邏輯，包含：
 * 1. 意圖解析 (Intent Parsing)
 * 2. 備課對話流程 (Lesson Prep Conversation Flow)
 * 3. Agent 服務調用 (Agent Invocation)
 * 4. 狀態更新 (LearningPath Context Update)
 */

import { useState, useCallback } from 'react';
import { useTeacherAgents } from '../context/AgentContext';
import { useLearningPath } from '../context/LearningPathContext';
import { analyzeStudentAndGeneratePath } from '../services/ai/learningPathService';
import type { PedagogyMethod } from '../data/pedagogyMethods';
import type { StudentLearningRecord } from '../types';

// ==================== Types ====================

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    loading?: boolean;
    action?: {
        type: 'navigate' | 'generate' | 'options' | 'curriculum' | 'pedagogy';
        target?: string;
        data?: unknown;
    };
    // 特殊訊息類型
    options?: { id: string; label: string }[];
    pedagogyMethods?: PedagogyMethod[];
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
    weakKnowledgeNodes: [
        { nodeId: 'kn-quadratic-formula', nodeName: '一元二次方程式公式解', errorRate: 0.6, relatedQuestions: ['q-1', 'q-2'] },
        { nodeId: 'kn-discriminant', nodeName: '判別式應用', errorRate: 0.5, relatedQuestions: ['q-3'] },
        { nodeId: 'kn-factoring', nodeName: '因式分解', errorRate: 0.4, relatedQuestions: ['q-4', 'q-5'] },
    ],
    lastUpdated: Date.now(),
};

// ==================== Hook ====================

export function useTeacherAIChat() {
    const teacher = useTeacherAgents();
    const { state: lpState, dispatch: lpDispatch } = useLearningPath();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const genId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // 添加助教訊息
    const addAssistantMessage = useCallback((
        content: string,
        action?: ChatMessage['action'],
        extra?: Partial<ChatMessage>
    ) => {
        setMessages(prev => [...prev, {
            id: genId(),
            role: 'assistant',
            content,
            timestamp: Date.now(),
            action,
            ...extra,
        }]);
    }, []);

    // 解析使用者意圖
    const parseIntent = (prompt: string): { category: string; params: Record<string, unknown> } => {
        const lowerPrompt = prompt.toLowerCase();

        const parseNumber = (text: string, defaultVal: number) => {
            const map: Record<string, number> = { '一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10 };
            const cnMatch = text.match(/[一二三四五六七八九十]/);
            if (cnMatch) return map[cnMatch[0]];
            const numMatch = text.match(/(\d+)/);
            return numMatch ? parseInt(numMatch[1]) : defaultVal;
        };

        // 學習路徑
        if (lowerPrompt.includes('路徑') || lowerPrompt.includes('推薦') ||
            lowerPrompt.includes('學習計畫') || lowerPrompt.includes('弱點') || lowerPrompt.includes('分析')) {
            return { category: 'learning-path', params: { studentId: 'class-default' } };
        }

        // 練習題
        if (lowerPrompt.includes('練習') || lowerPrompt.includes('題目') || lowerPrompt.includes('測驗') || lowerPrompt.includes('考卷')) {
            return {
                category: 'exercise',
                params: {
                    count: parseNumber(prompt, 5),
                    topic: prompt.replace(/生成|幫我|\d+題|練習|測驗/g, '').trim() || '數學',
                }
            };
        }

        // 分組
        if (lowerPrompt.includes('分組') || lowerPrompt.includes('小組') || lowerPrompt.includes('組別')) {
            return {
                category: 'grouping',
                params: { groupCount: parseNumber(prompt, 4) }
            };
        }

        // 備課
        if (lowerPrompt.includes('備課') || lowerPrompt.includes('準備課程') ||
            lowerPrompt.includes('設計課程') || lowerPrompt.includes('規劃教學') || lowerPrompt.includes('產生代數的教材')) {
            return { category: 'lesson-prep', params: {} };
        }

        return { category: 'chat', params: {} };
    };

    // 處理選項點擊
    const handleOptionClick = useCallback((_optionId: string, optionLabel: string) => {
        // 加入用戶選擇的訊息
        setMessages(prev => [...prev, {
            id: genId(),
            role: 'user',
            content: optionLabel,
            timestamp: Date.now(),
        }]);
    }, []);

    // ==================== 發送訊息主函數 ====================

    const sendMessage = useCallback(async (input: string) => {
        if (!input.trim() || isProcessing) return;

        // 加入用戶訊息
        setMessages(prev => [...prev, {
            id: genId(),
            role: 'user',
            content: input,
            timestamp: Date.now(),
        }]);

        setIsProcessing(true);

        try {
            const intent = parseIntent(input);

            switch (intent.category) {
                case 'lesson-prep':
                    setTimeout(() => {
                        addAssistantMessage(
                            '想要準備新課程嗎？\n\n我們已經為您準備了全新的「對話式備課工作台」，支援多欄位快速輸入、書商版本選擇與自動產生教案功能！\n\n請點擊下方按鈕前往體驗。',
                            { type: 'navigate', target: 'lesson-prep-chat' }
                        );
                        setIsProcessing(false);
                    }, 500);
                    break;

                case 'learning-path': {
                    const thinkingId = genId();
                    setMessages(prev => [...prev, {
                        id: thinkingId,
                        role: 'assistant',
                        content: '🔍 正在分析班級學習狀況並規劃路徑...',
                        timestamp: Date.now(),
                        loading: true
                    }]);

                    const studentId = 'class-default';
                    const record = lpState.learningRecords.get(studentId) || DEFAULT_STUDENT_RECORD;
                    const result = await analyzeStudentAndGeneratePath(record);

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

                    setMessages(prev => prev.filter(m => m.id !== thinkingId));
                    addAssistantMessage(
                        `✅ AI 學習路徑分析完成！\n\n📊 **分析結果**：\n${result.recommendation?.summary || '已根據學生弱點生成個性化學習路徑'}\n\n🎯 **重點加強區域**：\n${result.recommendation?.focusAreas?.map(a => `• ${a}`).join('\n') || '• 核心概念複習'}\n\n📐 **預估學習時間**：${result.recommendation?.estimatedDuration || 30} 分鐘\n\n👉 點擊「查看學習路徑」進入詳細規劃`,
                        { type: 'navigate', target: 'learning-path', data: result }
                    );
                    setIsProcessing(false);
                    break;
                }

                case 'exercise': {
                    const result = await teacher.generateExercise(
                        intent.params.topic as string,
                        { count: intent.params.count as number, difficulty: 'medium', type: 'multiple-choice' }
                    );

                    if (result.success) {
                        addAssistantMessage(
                            `✅ 已生成 ${intent.params.count} 題「${intent.params.topic}」練習題！\n\n題目已準備好，可加入學習路徑或發布給學生。`,
                            { type: 'generate', data: result.data }
                        );
                    } else {
                        throw new Error(result.error);
                    }
                    setIsProcessing(false);
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
                    setIsProcessing(false);
                    break;
                }

                default:
                    setTimeout(() => {
                        addAssistantMessage(`收到！關於「${input}」，我可以幫您：\n• 備課規劃 (請使用備課工作台)\n• 推薦學習路徑\n• 生成練習題\n• 協助分組\n\n請告訴我具體的需求！`);
                        setIsProcessing(false);
                    }, 500);
            }
        } catch (error) {
            console.error(error);
            addAssistantMessage('❌ 抱歉，處理您的請求時發生錯誤，請稍後再試。');
            setIsProcessing(false);
        }
    }, [isProcessing, addAssistantMessage, teacher, lpState, lpDispatch]);

    return {
        messages,
        setMessages,
        sendMessage,
        isProcessing,
        handleOptionClick,
    };
}
