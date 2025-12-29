/**
 * useLessonPrepChat - 備課對話流程 Hook
 * 
 * 管理對話式備課流程的狀態與邏輯
 * 收集：單元 → 書商/年級 → 堂數 → 目標 → 教學法
 */

import { useState, useCallback, useRef } from 'react';
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
    type?: 'text' | 'options' | 'pedagogy-select' | 'summary';
    options?: { id: string; label: string; icon?: string }[];
    pedagogyMethods?: PedagogyMethod[];
}

// 書商選項
export const PUBLISHERS = [
    { id: 'nanyi', name: '南一' },
    { id: 'hanlin', name: '翰林' },
    { id: 'kangxuan', name: '康軒' },
    { id: 'other', name: '其他' },
] as const;

export type PublisherId = typeof PUBLISHERS[number]['id'];

// 年級選項
export const GRADES = [
    { id: '1', name: '一年級' },
    { id: '2', name: '二年級' },
    { id: '3', name: '三年級' },
    { id: '4', name: '四年級' },
    { id: '5', name: '五年級' },
    { id: '6', name: '六年級' },
    { id: '7', name: '七年級' },
    { id: '8', name: '八年級' },
    { id: '9', name: '九年級' },
] as const;

// 學期選項
export const SEMESTERS = [
    { id: '1', name: '上學期' },
    { id: '2', name: '下學期' },
] as const;

export interface LessonPrepData {
    topic: string;
    publisher?: PublisherId;
    grade?: string;
    semester?: string;
    sessions: number;
    objectives: string[];
    pedagogy?: PedagogyMethod;
}

// ==================== Multi-Field Parser ====================

interface ParsedPrepInput {
    topic?: string;
    publisher?: PublisherId;
    grade?: string;
    semester?: string;
    sessions?: number;
    objectives?: string[];
    pedagogyId?: string;
}

/**
 * 解析用戶輸入，支援標籤式格式
 * 格式：「單元：代數基本運算式」「堂數：3」
 */
function parseMultiFieldInput(input: string, pedagogyMethods: PedagogyMethod[]): ParsedPrepInput {
    const result: ParsedPrepInput = {};

    // 分割輸入（支援換行）
    const lines = input.split(/[\n\r]+/).map(s => s.trim()).filter(Boolean);

    const unmatchedLines: string[] = [];

    lines.forEach(line => {
        // 嘗試匹配標籤格式：「標籤：值」或「標籤:值」
        const labelMatch = line.match(/^(.+?)[：:]\s*(.+)$/);

        if (labelMatch) {
            const [, label, value] = labelMatch;
            const labelLower = label.trim().toLowerCase();
            const valueTrimmed = value.trim();

            // 匹配各種標籤
            if (['單元', '主題', 'topic', 'unit'].includes(labelLower)) {
                result.topic = valueTrimmed;
            } else if (['堂數', '堂', 'sessions'].includes(labelLower)) {
                const num = parseInt(valueTrimmed, 10);
                if (num >= 1 && num <= 10) result.sessions = num;
            } else if (['書商', '版本', 'publisher'].includes(labelLower)) {
                const pub = PUBLISHERS.find(p => valueTrimmed.includes(p.name));
                if (pub) result.publisher = pub.id;
            } else if (['年級', 'grade'].includes(labelLower)) {
                const gradeMatch = valueTrimmed.match(/([一二三四五六七八九]|[1-9])/);
                if (gradeMatch) {
                    const gradeMap: Record<string, string> = {
                        '一': '1', '二': '2', '三': '3', '四': '4', '五': '5',
                        '六': '6', '七': '7', '八': '8', '九': '9'
                    };
                    result.grade = gradeMap[gradeMatch[1]] || gradeMatch[1];
                }
            } else if (['學期', 'semester'].includes(labelLower)) {
                if (valueTrimmed.includes('上')) result.semester = '1';
                else if (valueTrimmed.includes('下')) result.semester = '2';
            } else if (['目標', '教學目標', 'objectives'].includes(labelLower)) {
                const objectives = valueTrimmed.split(/[,，、]/).map(s => s.trim()).filter(Boolean);
                result.objectives = objectives;
            } else if (['教學法', 'pedagogy'].includes(labelLower)) {
                const method = pedagogyMethods.find(p =>
                    valueTrimmed.toLowerCase().includes(p.id) ||
                    valueTrimmed.includes(p.name)
                );
                if (method) result.pedagogyId = method.id;
            } else {
                unmatchedLines.push(line);
            }
        } else {
            unmatchedLines.push(line);
        }
    });

    // 處理未匹配的行（作為單元或目標）
    if (unmatchedLines.length > 0 && !result.topic) {
        result.topic = unmatchedLines[0];
        if (unmatchedLines.length > 1) {
            result.objectives = [...(result.objectives || []), ...unmatchedLines.slice(1)];
        }
    }

    return result;
}

/**
 * 根據已填欄位計算應跳轉的步驟
 */
function computeNextStep(prepData: LessonPrepData): ConversationStep {
    if (!prepData.topic) return 'topic';
    if (prepData.sessions === 0) return 'sessions';
    if (prepData.objectives.length === 0) return 'objectives';
    if (!prepData.pedagogy) return 'pedagogy';
    return 'confirm';
}

// ==================== Hook ====================

export function useLessonPrepChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [currentStep, setCurrentStep] = useState<ConversationStep>('greeting');
    const [prepData, setPrepData] = useState<LessonPrepData>({
        topic: '',
        sessions: 0,
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
            content: `你好！我是備課助手。

請用以下格式填寫（每行一項）：

\`\`\`
單元：[單元名稱]
書商：[版本]
年級：[年級]
學期：[學期]
堂數：[數字]
目標：[教學目標]
教學法：[APOS/四學]
\`\`\`

或者直接輸入單元名稱，我會一步步引導你！`,
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

    // 1. 處理主題輸入（支援多欄位解析）
    const handleTopicInput = (input: string) => {
        // 嘗試解析多欄位輸入
        const parsed = parseMultiFieldInput(input, PEDAGOGY_METHODS);

        // 更新 prepData
        const newPrepData = { ...prepData };
        if (parsed.topic) newPrepData.topic = parsed.topic;
        if (parsed.publisher) newPrepData.publisher = parsed.publisher;
        if (parsed.grade) newPrepData.grade = parsed.grade;
        if (parsed.semester) newPrepData.semester = parsed.semester;
        if (parsed.sessions) newPrepData.sessions = parsed.sessions;
        if (parsed.objectives) newPrepData.objectives = parsed.objectives;
        if (parsed.pedagogyId) {
            newPrepData.pedagogy = PEDAGOGY_METHODS.find(p => p.id === parsed.pedagogyId);
        }
        setPrepData(newPrepData);

        // 計算解析到的欄位數
        const fieldsCount = [
            parsed.topic, parsed.publisher, parsed.grade, parsed.semester,
            parsed.sessions, parsed.objectives, parsed.pedagogyId
        ].filter(Boolean).length;

        // 如果解析到多個欄位，顯示確認訊息並跳轉
        if (fieldsCount > 1) {
            const summary = [];
            if (parsed.topic) summary.push(`📚 單元：${parsed.topic}`);
            if (parsed.publisher) {
                const pub = PUBLISHERS.find(p => p.id === parsed.publisher);
                if (pub) summary.push(`📖 書商：${pub.name}`);
            }
            if (parsed.grade) {
                const gr = GRADES.find(g => g.id === parsed.grade);
                if (gr) summary.push(`🎓 年級：${gr.name}`);
            }
            if (parsed.semester) {
                const sem = SEMESTERS.find(s => s.id === parsed.semester);
                if (sem) summary.push(`📅 學期：${sem.name}`);
            }
            if (parsed.sessions) summary.push(`⏱️ 堂數：${parsed.sessions} 堂課`);
            if (parsed.objectives && parsed.objectives.length > 0) {
                summary.push(`🎯 目標：${parsed.objectives.join('、')}`);
            }
            if (parsed.pedagogyId) {
                const method = PEDAGOGY_METHODS.find(p => p.id === parsed.pedagogyId);
                if (method) summary.push(`📐 教學法：${method.icon} ${method.name}`);
            }

            addMessage({
                role: 'assistant',
                content: `已解析你的輸入：\n\n${summary.join('\n')}\n`,
                type: 'text',
            });

            // 計算下一步
            const nextStep = computeNextStep(newPrepData);

            if (nextStep === 'confirm') {
                showSummaryAndConfirm(newPrepData);
            } else if (nextStep === 'sessions') {
                askForSessions();
            } else if (nextStep === 'objectives') {
                askForObjectives();
            } else if (nextStep === 'pedagogy') {
                askForPedagogy();
            }
            return;
        }

        // 單一輸入：設定單元並詢問堂數
        const topic = parsed.topic || input;
        setPrepData(prev => ({ ...prev, topic }));

        addMessage({
            role: 'assistant',
            content: `已設定單元：「${topic}」\n\n請問你預計用幾堂課來教這個單元？`,
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
    };

    // 2. 詢問堂數
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
    const showSummaryAndConfirm = (latestData?: LessonPrepData) => {
        setTimeout(() => {
            const data = latestData || prepData;
            const publisherName = data.publisher ? PUBLISHERS.find(p => p.id === data.publisher)?.name : '';
            const gradeName = data.grade ? GRADES.find(g => g.id === data.grade)?.name : '';
            const semesterName = data.semester ? SEMESTERS.find(s => s.id === data.semester)?.name : '';

            const summary = [
                `📚 **單元**：${data.topic}`,
                publisherName ? `📖 **版本**：${publisherName}` : '',
                gradeName || semesterName ? `🎓 **年級**：${gradeName || ''} ${semesterName || ''}`.trim() : '',
                data.sessions > 0 ? `⏱️ **堂數**：${data.sessions} 堂課` : '',
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
