/**
 * useTeacherAIChat Hook
 * 
 * 封裝教師與 AI 助教的對話邏輯，包含：
 * 1. 意圖解析 (Intent Parsing)
 * 2. 備課對話流程 (Lesson Prep Conversation Flow)
 * 3. Agent 服務調用 (Agent Invocation)
 * 4. 狀態更新 (LearningPath Context Update)
 */

import { useState, useCallback, useRef } from 'react';
import { useTeacherAgents } from '../context/AgentContext';
import { useLearningPath } from '../context/LearningPathContext';
import { analyzeStudentAndGeneratePath } from '../services/ai/learningPathService';
import { searchCurriculumByKeyword, type CurriculumUnit } from '../data/curriculum108Math';
import { PEDAGOGY_METHODS, type PedagogyMethod } from '../data/pedagogyMethods';
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
    curriculumMatches?: CurriculumUnit[];
    pedagogyMethods?: PedagogyMethod[];
}

// 備課對話狀態
type LessonPrepStep = 'idle' | 'topic' | 'curriculum' | 'sessions' | 'objectives' | 'pedagogy' | 'confirm';

interface LessonPrepData {
    topic: string;
    curriculumUnit?: CurriculumUnit;
    sessions: number;
    objectives: string[];
    pedagogy?: PedagogyMethod;
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

    // 備課對話狀態
    const [lessonPrepStep, setLessonPrepStep] = useState<LessonPrepStep>('idle');
    const lessonPrepDataRef = useRef<LessonPrepData>({
        topic: '',
        sessions: 2,
        objectives: [],
    });

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
            lowerPrompt.includes('設計課程') || lowerPrompt.includes('規劃教學')) {
            return { category: 'lesson-prep', params: {} };
        }

        return { category: 'chat', params: {} };
    };

    // ==================== 備課對話流程 ====================

    // 開始備課對話
    const startLessonPrepFlow = useCallback(() => {
        lessonPrepDataRef.current = { topic: '', sessions: 2, objectives: [] };
        setLessonPrepStep('topic');
        addAssistantMessage(
            '📚 好的，我來幫你備課！\n\n請告訴我你想要教什麼主題？\n\n例如：「二元一次方程式」、「分數加減法」、「四則運算」'
        );
    }, [addAssistantMessage]);

    // 處理備課對話中的用戶輸入
    const handleLessonPrepInput = useCallback((input: string) => {
        const data = lessonPrepDataRef.current;

        switch (lessonPrepStep) {
            case 'topic': {
                data.topic = input;
                const matches = searchCurriculumByKeyword(input);

                if (matches.length > 0) {
                    setLessonPrepStep('curriculum');
                    addAssistantMessage(
                        `很好！「${input}」在 108 課綱中找到以下相關單元：`,
                        { type: 'curriculum', data: matches.slice(0, 5) },
                        { curriculumMatches: matches.slice(0, 5) }
                    );
                } else {
                    setLessonPrepStep('sessions');
                    addAssistantMessage(
                        `好的，主題設定為「${input}」。\n\n請問你預計用幾堂課來教這個主題？`,
                        { type: 'options' },
                        {
                            options: [
                                { id: '1', label: '1 堂課' },
                                { id: '2', label: '2 堂課' },
                                { id: '3', label: '3 堂課' },
                                { id: '4', label: '4 堂課' },
                            ]
                        }
                    );
                }
                break;
            }

            case 'curriculum': {
                // 用戶選擇了課綱或跳過
                if (input === '跳過' || input === '略過') {
                    // 跳過
                } else {
                    const matches = searchCurriculumByKeyword(data.topic);
                    const selected = matches.find(m =>
                        input.includes(m.code) || input.includes(m.title)
                    );
                    if (selected) {
                        data.curriculumUnit = selected;
                    }
                }

                setLessonPrepStep('sessions');
                addAssistantMessage(
                    '請問你預計用幾堂課來教這個主題？',
                    { type: 'options' },
                    {
                        options: [
                            { id: '1', label: '1 堂課' },
                            { id: '2', label: '2 堂課' },
                            { id: '3', label: '3 堂課' },
                            { id: '4', label: '4 堂課' },
                        ]
                    }
                );
                break;
            }

            case 'sessions': {
                const num = parseInt(input.replace(/[堂課 ]/g, ''), 10);
                data.sessions = isNaN(num) ? 2 : num;

                setLessonPrepStep('objectives');
                addAssistantMessage(
                    `✅ 已設定 ${data.sessions} 堂課\n\n請簡述教學目標（用逗號分隔多個目標），或輸入「略過」讓 AI 自動生成：`
                );
                break;
            }

            case 'objectives': {
                if (input !== '略過' && input !== '跳過') {
                    data.objectives = input.split(/[,，、]/).map(s => s.trim()).filter(Boolean);
                }

                setLessonPrepStep('pedagogy');
                addAssistantMessage(
                    '最後，請選擇你想使用的教學法：',
                    { type: 'pedagogy' },
                    { pedagogyMethods: PEDAGOGY_METHODS }
                );
                break;
            }

            case 'pedagogy': {
                const method = PEDAGOGY_METHODS.find(p =>
                    input.includes(p.name) || input.includes(p.id)
                );
                if (method) {
                    data.pedagogy = method;
                } else {
                    data.pedagogy = PEDAGOGY_METHODS[0]; // 預設四學
                }

                setLessonPrepStep('confirm');
                showLessonPrepSummary();
                break;
            }

            case 'confirm': {
                if (input.includes('確認') || input.includes('是') || input.includes('開始')) {
                    generateLessonPlan();
                } else {
                    // 重新開始
                    startLessonPrepFlow();
                }
                break;
            }
        }
    }, [lessonPrepStep, addAssistantMessage, startLessonPrepFlow]);

    // 處理選項點擊
    const handleOptionClick = useCallback((optionId: string, optionLabel: string) => {
        // 加入用戶選擇的訊息
        setMessages(prev => [...prev, {
            id: genId(),
            role: 'user',
            content: optionLabel,
            timestamp: Date.now(),
        }]);

        // 根據當前步驟處理
        if (lessonPrepStep === 'curriculum') {
            handleCurriculumSelect(optionId);
        } else if (lessonPrepStep === 'sessions') {
            handleLessonPrepInput(optionId);
        } else if (lessonPrepStep === 'pedagogy') {
            handlePedagogySelect(optionId);
        } else if (lessonPrepStep === 'confirm') {
            if (optionId === 'confirm-yes') {
                generateLessonPlan();
            } else {
                startLessonPrepFlow();
            }
        }
    }, [lessonPrepStep, handleLessonPrepInput, startLessonPrepFlow]);

    // 處理課綱選擇
    const handleCurriculumSelect = useCallback((code: string) => {
        const data = lessonPrepDataRef.current;
        if (code === 'skip') {
            // 跳過
        } else {
            const matches = searchCurriculumByKeyword(data.topic);
            const selected = matches.find(m => m.code === code);
            if (selected) {
                data.curriculumUnit = selected;
                addAssistantMessage(`✅ 已選擇：${selected.code} ${selected.title}`);
            }
        }

        setLessonPrepStep('sessions');
        setTimeout(() => {
            addAssistantMessage(
                '請問你預計用幾堂課來教這個主題？',
                { type: 'options' },
                {
                    options: [
                        { id: '1', label: '1 堂課' },
                        { id: '2', label: '2 堂課' },
                        { id: '3', label: '3 堂課' },
                        { id: '4', label: '4 堂課' },
                    ]
                }
            );
        }, 300);
    }, [addAssistantMessage]);

    // 處理教學法選擇
    const handlePedagogySelect = useCallback((id: string) => {
        const data = lessonPrepDataRef.current;
        const method = PEDAGOGY_METHODS.find(p => p.id === id);
        if (method) {
            data.pedagogy = method;
            addAssistantMessage(`✅ 已選擇：${method.icon} ${method.name}`);
        }

        setLessonPrepStep('confirm');
        setTimeout(() => showLessonPrepSummary(), 300);
    }, [addAssistantMessage]);

    // 顯示備課摘要
    const showLessonPrepSummary = useCallback(() => {
        const data = lessonPrepDataRef.current;
        const summary = [
            `📚 **主題**：${data.topic}`,
            data.curriculumUnit ? `📖 **課綱**：${data.curriculumUnit.code} ${data.curriculumUnit.title}` : '',
            `⏱️ **堂數**：${data.sessions} 堂課`,
            data.objectives.length > 0 ? `🎯 **目標**：${data.objectives.join('、')}` : '🎯 **目標**：AI 自動生成',
            data.pedagogy ? `📐 **教學法**：${data.pedagogy.icon} ${data.pedagogy.name}` : '',
        ].filter(Boolean).join('\n');

        addAssistantMessage(
            `太好了！以下是你的備課設定：\n\n${summary}\n\n確認後，將開始生成課程！`,
            { type: 'options' },
            {
                options: [
                    { id: 'confirm-yes', label: '✅ 確認，開始生成' },
                    { id: 'confirm-no', label: '🔄 重新設定' },
                ]
            }
        );
    }, [addAssistantMessage]);

    // 生成課程規劃
    const generateLessonPlan = useCallback(() => {
        const data = lessonPrepDataRef.current;
        setLessonPrepStep('idle');

        addAssistantMessage(
            '🚀 開始生成課程規劃...\n\n✓ 分析主題與課綱\n✓ 選擇 AI Agents\n⏳ 規劃學習路徑...'
        );

        // 模擬生成後導航
        setTimeout(() => {
            addAssistantMessage(
                `✅ **課程規劃完成！**\n\n已根據「${data.topic}」主題與「${data.pedagogy?.name || '四學'}」教學法生成課程流程。\n\n👉 點擊下方按鈕進入視覺化編輯器`,
                { type: 'navigate', target: 'lesson-preview', data }
            );
        }, 2000);
    }, [addAssistantMessage]);

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

        // 如果正在備課對話中，使用備課流程處理
        if (lessonPrepStep !== 'idle') {
            handleLessonPrepInput(input);
            return;
        }

        setIsProcessing(true);

        try {
            const intent = parseIntent(input);

            switch (intent.category) {
                case 'lesson-prep':
                    startLessonPrepFlow();
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
                    setTimeout(() => {
                        addAssistantMessage(`收到！關於「${input}」，我可以幫您：\n• 備課規劃\n• 推薦學習路徑\n• 生成練習題\n• 協助分組\n\n請告訴我具體的需求！`);
                    }, 500);
            }
        } catch (error) {
            console.error(error);
            addAssistantMessage('❌ 抱歉，處理您的請求時發生錯誤，請稍後再試。');
        } finally {
            setIsProcessing(false);
        }
    }, [isProcessing, lessonPrepStep, handleLessonPrepInput, startLessonPrepFlow, addAssistantMessage, teacher, lpState, lpDispatch]);

    return {
        messages,
        setMessages,
        sendMessage,
        isProcessing,
        // 備課對話相關
        lessonPrepStep,
        handleOptionClick,
    };
}
