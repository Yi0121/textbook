/**
 * useLessonPrepChat - 備課對話流程 Hook
 * 
 * 管理對話式備課流程的狀態與邏輯
 * 收集：主題 → 章節 → 堂數 → 目標 → 教學法
 */

import { useState, useCallback, useRef } from 'react';
import { searchCurriculumByKeyword, type CurriculumUnit } from '../data/curriculum108Math';
import { PEDAGOGY_METHODS, type PedagogyMethod } from '../data/pedagogyMethods';

// ==================== Types ====================

export type ConversationStep =
    | 'greeting'        // 初始問候
    | 'topic'           // 收集主題
    | 'curriculum'      // 確認課綱章節
    | 'sessions'        // 幾堂課
    | 'objectives'      // 教學目標
    | 'pedagogy'        // 教學法選擇
    | 'confirm'         // 確認所有資訊
    | 'generating'      // 生成中
    | 'complete';       // 完成

export interface ChatMessage {
    id: string;
    role: 'assistant' | 'user';
    content: string;
    timestamp: Date;
    // 特殊訊息類型
    type?: 'text' | 'options' | 'curriculum-matches' | 'pedagogy-select' | 'summary';
    options?: { id: string; label: string; icon?: string }[];
    curriculumMatches?: CurriculumUnit[];
    pedagogyMethods?: PedagogyMethod[];
}

export interface LessonPrepData {
    topic: string;
    curriculumUnit?: CurriculumUnit;
    sessions: number;
    objectives: string[];
    pedagogy?: PedagogyMethod;
}

// ==================== Hook ====================

export function useLessonPrepChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentStep, setCurrentStep] = useState<ConversationStep>('greeting');
    const [prepData, setPrepData] = useState<LessonPrepData>({
        topic: '',
        sessions: 2,
        objectives: [],
    });
    const [isTyping, setIsTyping] = useState(false);
    const initializedRef = useRef(false);

    // 產生唯一 ID
    const genId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // 新增訊息
    const addMessage = useCallback((msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
        setMessages(prev => [...prev, { ...msg, id: genId(), timestamp: new Date() }]);
    }, []);

    // 模擬 AI 思考延遲
    const simulateTyping = useCallback(async (delayMs = 800) => {
        setIsTyping(true);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        setIsTyping(false);
    }, []);

    // ==================== 對話流程 ====================

    // 開始對話
    const startConversation = useCallback(async (forceRestart = false) => {
        // 防止 Strict Mode 重複執行
        if (!forceRestart && initializedRef.current) return;
        initializedRef.current = true;

        setMessages([]);
        setCurrentStep('greeting');

        await simulateTyping(500);

        addMessage({
            role: 'assistant',
            content: '👋 你好！我是備課助手。\n\n請告訴我你想要教什麼主題？\n\n例如：「二元一次方程式」、「分數加減法」、「四則運算」',
            type: 'text',
        });

        setCurrentStep('topic');
    }, [addMessage, simulateTyping]);

    // 處理使用者輸入
    const handleUserInput = useCallback(async (input: string) => {
        // 加入使用者訊息
        addMessage({ role: 'user', content: input, type: 'text' });

        await simulateTyping();

        switch (currentStep) {
            case 'topic':
                handleTopicInput(input);
                break;
            case 'curriculum':
                handleCurriculumConfirm(input);
                break;
            case 'sessions':
                handleSessionsInput(input);
                break;
            case 'objectives':
                handleObjectivesInput(input);
                break;
            case 'pedagogy':
                handlePedagogyConfirm(input);
                break;
            case 'confirm':
                handleFinalConfirm(input);
                break;
            default:
                addMessage({
                    role: 'assistant',
                    content: '抱歉，我不太理解。請告訴我你想要教什麼主題？',
                    type: 'text',
                });
        }
    }, [currentStep, addMessage, simulateTyping]);

    // 處理選項點擊
    const handleOptionSelect = useCallback(async (optionId: string, optionLabel: string) => {
        // 加入使用者選擇訊息
        addMessage({ role: 'user', content: optionLabel, type: 'text' });

        await simulateTyping();

        switch (currentStep) {
            case 'curriculum':
                handleCurriculumSelect(optionId);
                break;
            case 'sessions':
                handleSessionsSelect(optionId);
                break;
            case 'pedagogy':
                handlePedagogySelect(optionId);
                break;
            case 'confirm':
                if (optionId === 'confirm-yes') {
                    handleStartGeneration();
                } else {
                    handleRestartPrep();
                }
                break;
            default:
                break;
        }
    }, [currentStep, addMessage, simulateTyping]);

    // ==================== 步驟處理函數 ====================

    // 1. 處理主題輸入
    const handleTopicInput = (topic: string) => {
        setPrepData(prev => ({ ...prev, topic }));

        // 搜尋課綱匹配
        const matches = searchCurriculumByKeyword(topic);

        if (matches.length > 0) {
            addMessage({
                role: 'assistant',
                content: `很好！「${topic}」在 108 課綱中找到以下相關單元：\n\n請選擇最符合的章節，或輸入「跳過」自訂：`,
                type: 'curriculum-matches',
                curriculumMatches: matches.slice(0, 5), // 最多顯示5個
            });
            setCurrentStep('curriculum');
        } else {
            // 沒有匹配時直接進入 sessions 步驟
            addMessage({
                role: 'assistant',
                content: `「${topic}」在課綱中沒有精確匹配的單元。\n\n沒關係，我會根據這個主題來規劃課程。\n\n請問你預計用幾堂課來教這個主題？`,
                type: 'options',
                options: [
                    { id: '1', label: '1 堂課' },
                    { id: '2', label: '2 堂課' },
                    { id: '3', label: '3 堂課' },
                    { id: '4', label: '4 堂課' },
                    { id: 'custom', label: '自訂堂數' },
                ],
            });
            setCurrentStep('sessions');
        }
    };

    // 2. 處理課綱確認
    const handleCurriculumConfirm = (input: string) => {
        if (input === '跳過' || input === '略過') {
            askForSessions();
        } else {
            // 嘗試找到匹配的課綱
            const matches = searchCurriculumByKeyword(input);
            if (matches.length > 0) {
                setPrepData(prev => ({ ...prev, curriculumUnit: matches[0] }));
            }
            askForSessions();
        }
    };

    const handleCurriculumSelect = (code: string) => {
        const matches = searchCurriculumByKeyword(prepData.topic);
        const selected = matches.find(m => m.code === code);
        if (selected) {
            setPrepData(prev => ({ ...prev, curriculumUnit: selected }));
            addMessage({
                role: 'assistant',
                content: `✅ 已選擇：${selected.code} ${selected.title}\n\n${selected.description || ''}`,
                type: 'text',
            });
        }
        askForSessions();
    };

    // 3. 詢問堂數
    const askForSessions = () => {
        setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '請問你預計用幾堂課來教這個主題？',
                type: 'options',
                options: [
                    { id: '1', label: '1 堂課' },
                    { id: '2', label: '2 堂課' },
                    { id: '3', label: '3 堂課' },
                    { id: '4', label: '4 堂課' },
                    { id: 'custom', label: '自訂堂數' },
                ],
            });
            setCurrentStep('sessions');
        }, 500);
    };

    // 處理堂數輸入
    const handleSessionsInput = (input: string) => {
        const num = parseInt(input, 10);
        if (!isNaN(num) && num > 0 && num <= 10) {
            setPrepData(prev => ({ ...prev, sessions: num }));
            askForObjectives();
        } else {
            addMessage({
                role: 'assistant',
                content: '請輸入 1-10 之間的數字，或選擇下方選項：',
                type: 'options',
                options: [
                    { id: '1', label: '1 堂課' },
                    { id: '2', label: '2 堂課' },
                    { id: '3', label: '3 堂課' },
                ],
            });
        }
    };

    const handleSessionsSelect = (id: string) => {
        if (id === 'custom') {
            addMessage({
                role: 'assistant',
                content: '請輸入堂數（1-10）：',
                type: 'text',
            });
        } else {
            const num = parseInt(id, 10);
            setPrepData(prev => ({ ...prev, sessions: num }));
            addMessage({
                role: 'assistant',
                content: `✅ 已設定 ${num} 堂課`,
                type: 'text',
            });
            askForObjectives();
        }
    };

    // 4. 詢問教學目標
    const askForObjectives = () => {
        setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '請簡述這堂課的教學目標（可輸入多個，用逗號分隔）：\n\n例如：「理解方程式概念、能解一元一次方程式、應用於生活問題」\n\n或輸入「略過」讓 AI 自動生成',
                type: 'text',
            });
            setCurrentStep('objectives');
        }, 500);
    };

    // 處理教學目標輸入
    const handleObjectivesInput = (input: string) => {
        if (input === '略過' || input === '跳過') {
            setPrepData(prev => ({ ...prev, objectives: [] }));
        } else {
            const objectives = input.split(/[,，、]/).map(s => s.trim()).filter(Boolean);
            setPrepData(prev => ({ ...prev, objectives }));
            addMessage({
                role: 'assistant',
                content: `✅ 已記錄 ${objectives.length} 個教學目標`,
                type: 'text',
            });
        }
        askForPedagogy();
    };

    // 5. 詢問教學法
    const askForPedagogy = () => {
        setTimeout(() => {
            addMessage({
                role: 'assistant',
                content: '最後，請選擇你想使用的教學法：',
                type: 'pedagogy-select',
                pedagogyMethods: PEDAGOGY_METHODS,
            });
            setCurrentStep('pedagogy');
        }, 500);
    };

    // 處理教學法選擇
    const handlePedagogyConfirm = (input: string) => {
        const method = PEDAGOGY_METHODS.find(p =>
            p.name.includes(input) || p.id.includes(input.toLowerCase())
        );
        if (method) {
            setPrepData(prev => ({ ...prev, pedagogy: method }));
            showSummaryAndConfirm();
        } else {
            addMessage({
                role: 'assistant',
                content: '請從下方選擇一個教學法：',
                type: 'pedagogy-select',
                pedagogyMethods: PEDAGOGY_METHODS,
            });
        }
    };

    const handlePedagogySelect = (id: string) => {
        const method = PEDAGOGY_METHODS.find(p => p.id === id);
        if (method) {
            setPrepData(prev => ({ ...prev, pedagogy: method }));
            addMessage({
                role: 'assistant',
                content: `✅ 已選擇：${method.icon} ${method.name}\n\n${method.description}`,
                type: 'text',
            });
            showSummaryAndConfirm();
        }
    };

    // 6. 顯示摘要並確認
    const showSummaryAndConfirm = () => {
        setTimeout(() => {
            const data = prepData;
            const summary = [
                `📚 **主題**：${data.topic}`,
                data.curriculumUnit ? `📖 **課綱**：${data.curriculumUnit.code} ${data.curriculumUnit.title}` : '',
                `⏱️ **堂數**：${data.sessions} 堂課`,
                data.objectives.length > 0 ? `🎯 **目標**：${data.objectives.join('、')}` : '🎯 **目標**：AI 自動生成',
                data.pedagogy ? `📐 **教學法**：${data.pedagogy.icon} ${data.pedagogy.name}` : '',
            ].filter(Boolean).join('\n');

            addMessage({
                role: 'assistant',
                content: `太好了！以下是你的備課設定：\n\n${summary}\n\n確認後，我將開始為你規劃課程流程！`,
                type: 'summary',
                options: [
                    { id: 'confirm-yes', label: '✅ 確認，開始生成', icon: '🚀' },
                    { id: 'confirm-no', label: '🔄 重新設定', icon: '↩️' },
                ],
            });
            setCurrentStep('confirm');
        }, 500);
    };

    // 7. 開始生成
    const handleStartGeneration = () => {
        addMessage({
            role: 'assistant',
            content: '🚀 開始生成課程規劃...\n\n正在分析主題、選擇 AI Agents、規劃學習路徑...',
            type: 'text',
        });
        setCurrentStep('generating');
    };

    // 重新開始
    const handleRestartPrep = () => {
        setPrepData({ topic: '', sessions: 2, objectives: [] });
        initializedRef.current = false;
        startConversation(true);
    };

    const handleFinalConfirm = (input: string) => {
        const lower = input.toLowerCase();
        if (lower.includes('確認') || lower.includes('是') || lower.includes('yes') || lower.includes('ok')) {
            handleStartGeneration();
        } else {
            handleRestartPrep();
        }
    };

    // ==================== Return ====================

    return {
        messages,
        currentStep,
        prepData,
        isTyping,
        startConversation,
        handleUserInput,
        handleOptionSelect,
        isComplete: currentStep === 'complete',
        isGenerating: currentStep === 'generating',
    };
}
