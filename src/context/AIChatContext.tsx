/**
 * AIChatContext - AI 對話狀態共享 Context
 *
 * 讓首頁和浮動面板共用同一個對話狀態，切換頁面時對話不會丟失
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useTeacherAgents } from './AgentContext';
import { type PedagogyMethod } from '../data/pedagogyMethods';

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
    options?: { id: string; label: string }[];
    pedagogyMethods?: PedagogyMethod[];
    type?: string;
}

// ==================== Context Type ====================

interface TeacherAIChatContextType {
    messages: ChatMessage[];
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    sendMessage: (text: string) => void;
    isProcessing: boolean;
    handleOptionClick: (optionId: string, optionLabel: string) => void;
}

interface StudentAIChatContextType {
    messages: ChatMessage[];
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    sendMessage: (text: string) => void;
    isProcessing: boolean;
}

interface AIChatContextType {
    teacher: TeacherAIChatContextType;
    student: StudentAIChatContextType;
}

const AIChatContext = createContext<AIChatContextType | null>(null);

// ==================== Provider ====================

export function AIChatProvider({ children }: { children: ReactNode }) {
    const teacherAgents = useTeacherAgents();

    // ========== 教師對話狀態 ==========
    const [teacherMessages, setTeacherMessages] = useState<ChatMessage[]>([]);
    const [teacherIsProcessing, setTeacherIsProcessing] = useState(false);

    // ========== 學生對話狀態 ==========
    const [studentMessages, setStudentMessages] = useState<ChatMessage[]>([]);
    const [studentIsProcessing, setStudentIsProcessing] = useState(false);

    const genId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // ==================== 教師對話邏輯 ====================

    const addTeacherAssistantMessage = useCallback((
        content: string,
        action?: ChatMessage['action'],
        extra?: Partial<ChatMessage>
    ) => {
        setTeacherMessages(prev => [...prev, {
            id: genId(),
            role: 'assistant',
            content,
            timestamp: Date.now(),
            action,
            ...extra,
        }]);
    }, []);

    // 解析使用者意圖
    const parseIntent = (text: string): 'lesson-prep' | 'learning-path' | 'exercise' | 'grouping' | 'chat' => {
        const lower = text.toLowerCase();
        if (/備課|課程|教案|教學設計|準備.*課|教.*單元/.test(lower)) return 'lesson-prep';
        if (/學習路徑|路徑|推薦.*路徑|適性/.test(lower)) return 'learning-path';
        if (/練習|測驗|題目|出題|考試/.test(lower)) return 'exercise';
        if (/分組|小組|合作學習|協作/.test(lower)) return 'grouping';
        return 'chat';
    };

    // 處理選項點擊
    const handleTeacherOptionClick = useCallback((_optionId: string, optionLabel: string) => {
        // 加入用戶選擇的訊息
        setTeacherMessages(prev => [...prev, {
            id: genId(),
            role: 'user',
            content: optionLabel,
            timestamp: Date.now(),
        }]);
    }, []);

    // 教師發送訊息
    const sendTeacherMessage = useCallback(async (text: string) => {
        if (teacherIsProcessing || !text.trim()) return;

        setTeacherMessages(prev => [...prev, {
            id: genId(),
            role: 'user',
            content: text,
            timestamp: Date.now(),
            action: undefined,
        }]);

        setTeacherIsProcessing(true);

        try {
            const intent = parseIntent(text);

            switch (intent) {
                case 'lesson-prep': {
                    addTeacherAssistantMessage(
                        '好的，讓我們開始備課。請點擊下方按鈕前往專屬的備課工作台，那裡有更完整的備課工具。',
                        { type: 'navigate', target: 'lesson-prep-chat' }
                    );
                    setTeacherIsProcessing(false);
                    break;
                }

                case 'learning-path':
                    addTeacherAssistantMessage('🔍 正在分析班級學習狀況...');
                    setTimeout(() => {
                        addTeacherAssistantMessage(
                            '✅ 學習路徑分析完成！\n\n根據班級整體表現，建議加強以下知識點：\n• 一元二次方程式公式解\n• 判別式應用\n• 因式分解\n\n點擊下方按鈕查看視覺化學習路徑。',
                            { type: 'navigate', target: 'learning-path' }
                        );
                        setTeacherIsProcessing(false);
                    }, 1500);
                    break;

                case 'exercise':
                    addTeacherAssistantMessage('📝 正在生成練習題...');
                    try {
                        await teacherAgents.generateExercise('一元二次方程式');
                        addTeacherAssistantMessage(
                            '✅ 已生成 10 道練習題！\n\n題目類型包含：選擇題、填空題、計算題。\n\n您可以在作業管理中查看和編輯這些題目。'
                        );
                    } catch {
                        addTeacherAssistantMessage('❌ 生成練習題時發生錯誤，請稍後再試。');
                    }
                    setTeacherIsProcessing(false);
                    break;

                case 'grouping':
                    addTeacherAssistantMessage('👥 正在進行智能分組...');
                    try {
                        await teacherAgents.autoGroupStudents('class-default');
                        addTeacherAssistantMessage(
                            '✅ 分組完成！\n\n已將班級分成 5 組，採用異質分組策略，確保每組都有不同程度的學生。\n\n您可以在分組協作頁面查看詳細分組結果。'
                        );
                    } catch {
                        addTeacherAssistantMessage('❌ 分組時發生錯誤，請稍後再試。');
                    }
                    setTeacherIsProcessing(false);
                    break;

                default:
                    setTimeout(() => {
                        addTeacherAssistantMessage(
                            '我可以幫您：\n• 備課（例如：「幫我用 APOS 備課一元二次方程式」）\n• 生成學習路徑（輸入「推薦學習路徑」）\n• 出練習題（輸入「生成練習題」）\n• 分組（輸入「幫我分組」）\n\n請問您需要哪項服務？'
                        );
                        setTeacherIsProcessing(false);
                    }, 500);
            }
        } catch (error) {
            console.error(error);
            addTeacherAssistantMessage('❌ 抱歉，處理您的請求時發生錯誤，請稍後再試。');
            setTeacherIsProcessing(false);
        }
    }, [teacherIsProcessing, addTeacherAssistantMessage, teacherAgents]);

    // ==================== 學生對話邏輯 ====================

    const addStudentAssistantMessage = useCallback((content: string) => {
        setStudentMessages(prev => [...prev, {
            id: genId(),
            role: 'assistant',
            content,
            timestamp: Date.now(),
        }]);
    }, []);

    const sendStudentMessage = useCallback(async (text: string) => {
        if (studentIsProcessing || !text.trim()) return;

        setStudentMessages(prev => [...prev, {
            id: genId(),
            role: 'user',
            content: text,
            timestamp: Date.now(),
        }]);

        setStudentIsProcessing(true);

        // 簡單的學生對話回應（可以之後擴展）
        setTimeout(() => {
            const responses = [
                '讓我幫你分析這個問題...\n\n這個概念的關鍵是理解變數之間的關係。試著先找出已知條件，再思考如何運用公式。',
                '好問題！\n\n根據你目前的學習進度，我建議你先複習基礎概念，再嘗試進階題目。',
                '我注意到你在這個部分花了比較多時間。\n\n讓我給你一個提示：試著把問題拆解成更小的步驟。',
            ];
            addStudentAssistantMessage(responses[Math.floor(Math.random() * responses.length)]);
            setStudentIsProcessing(false);
        }, 1000);
    }, [studentIsProcessing, addStudentAssistantMessage]);

    // ==================== Context Value ====================

    const value: AIChatContextType = {
        teacher: {
            messages: teacherMessages,
            setMessages: setTeacherMessages,
            sendMessage: sendTeacherMessage,
            isProcessing: teacherIsProcessing,
            handleOptionClick: handleTeacherOptionClick,
        },
        student: {
            messages: studentMessages,
            setMessages: setStudentMessages,
            sendMessage: sendStudentMessage,
            isProcessing: studentIsProcessing,
        },
    };

    return (
        <AIChatContext.Provider value={value}>
            {children}
        </AIChatContext.Provider>
    );
}

// ==================== Hooks ====================

export function useAIChat() {
    const context = useContext(AIChatContext);
    if (!context) {
        throw new Error('useAIChat must be used within AIChatProvider');
    }
    return context;
}

export function useTeacherAIChatContext() {
    const { teacher } = useAIChat();
    return teacher;
}

export function useStudentAIChatContext() {
    const { student } = useAIChat();
    return student;
}
