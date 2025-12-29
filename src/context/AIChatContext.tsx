/**
 * AIChatContext - AI 對話狀態共享 Context
 *
 * 讓首頁和浮動面板共用同一個對話狀態，切換頁面時對話不會丟失
 */

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import { useTeacherAgents } from './AgentContext';
import { searchCurriculumByKeyword, type CurriculumUnit } from '../data/curriculum108Math';
import { PEDAGOGY_METHODS, type PedagogyMethod } from '../data/pedagogyMethods';

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
    curriculumMatches?: CurriculumUnit[];
    pedagogyMethods?: PedagogyMethod[];
    type?: string;
}

// 新備課流程步驟：idle → confirming → planning → ready
type LessonPrepStep = 'idle' | 'confirming' | 'planning' | 'ready';

interface LessonPrepData {
    topic: string;               // 主題/單元
    curriculumUnit?: CurriculumUnit;  // 對應課綱
    pedagogy?: PedagogyMethod;   // 教學法
    grade?: string;              // 年級
    sessions?: number;           // 堂數
    objectives?: string[];       // 教學目標
    missingFields: string[];     // 缺少的必要欄位
}

// ==================== Context Type ====================

interface TeacherAIChatContextType {
    messages: ChatMessage[];
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    sendMessage: (text: string) => void;
    isProcessing: boolean;
    lessonPrepStep: LessonPrepStep;
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
    const [lessonPrepStep, setLessonPrepStep] = useState<LessonPrepStep>('idle');
    const lessonPrepDataRef = useRef<LessonPrepData>({
        topic: '',
        missingFields: [],
    });

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

    // 解析備課 prompt，提取單元、教學法等資訊
    const parseLessonPrepPrompt = useCallback((text: string): LessonPrepData => {
        const data: LessonPrepData = { topic: '', missingFields: [] };

        // 提取教學法
        for (const method of PEDAGOGY_METHODS) {
            if (text.includes(method.name) || text.includes(method.id)) {
                data.pedagogy = method;
                break;
            }
        }
        // 常見教學法別名
        if (!data.pedagogy) {
            if (/apos/i.test(text)) data.pedagogy = PEDAGOGY_METHODS.find(m => m.id === 'apos');
            else if (/四學|四學策略/.test(text)) data.pedagogy = PEDAGOGY_METHODS.find(m => m.id === 'four-learning');
            else if (/探究式|探究/.test(text)) data.pedagogy = PEDAGOGY_METHODS.find(m => m.id === 'inquiry');
            else if (/差異化/.test(text)) data.pedagogy = PEDAGOGY_METHODS.find(m => m.id === 'differentiated');
        }

        // 提取年級
        const gradeMatch = text.match(/([一二三四五六七八九]年級|國[一二三]|高[一二三]|[1-9]年級)/);
        if (gradeMatch) {
            data.grade = gradeMatch[1];
        }

        // 提取堂數
        const sessionMatch = text.match(/(\d+)\s*堂|(\d+)\s*節/);
        if (sessionMatch) {
            data.sessions = parseInt(sessionMatch[1] || sessionMatch[2]);
        }

        // 嘗試匹配課綱單元
        const curriculumMatches = searchCurriculumByKeyword(text);
        if (curriculumMatches.length > 0) {
            data.curriculumUnit = curriculumMatches[0];
            data.topic = curriculumMatches[0].title;
        } else {
            // 提取主題（移除已識別的關鍵字後的核心內容）
            let topic = text
                .replace(/幫我|幫忙|請|想要|需要|備課|準備|課程|教案|教學設計/g, '')
                .replace(/用|使用|採用/g, '')
                .replace(data.pedagogy?.name || '', '')
                .replace(data.grade || '', '')
                .replace(/\d+\s*堂|\d+\s*節/g, '')
                .trim();
            // 清理多餘空白
            topic = topic.replace(/\s+/g, ' ').trim();
            if (topic) data.topic = topic;
        }

        // 檢查缺少的必要欄位
        if (!data.topic) data.missingFields.push('topic');
        if (!data.pedagogy) data.missingFields.push('pedagogy');

        return data;
    }, []);

    // 生成確認需求訊息
    const generateConfirmMessage = useCallback((data: LessonPrepData): string => {
        const lines: string[] = ['📋 **收到您的備課需求，讓我確認一下：**\n'];

        if (data.topic) {
            lines.push(`✅ **主題**：${data.topic}`);
            if (data.curriculumUnit) {
                lines.push(`   📖 課綱對應：${data.curriculumUnit.code} ${data.curriculumUnit.title}`);
            }
        }
        if (data.pedagogy) {
            lines.push(`✅ **教學法**：${data.pedagogy.name}`);
        }
        if (data.grade) {
            lines.push(`✅ **年級**：${data.grade}`);
        }
        if (data.sessions) {
            lines.push(`✅ **堂數**：${data.sessions} 堂`);
        }

        // 詢問缺少的資訊
        if (data.missingFields.length > 0) {
            lines.push('\n---\n');
            lines.push('⚠️ **還需要以下資訊：**\n');
            if (data.missingFields.includes('topic')) {
                lines.push('• 請問您想教的**單元/主題**是什麼？');
            }
            if (data.missingFields.includes('pedagogy')) {
                lines.push('• 請問您想使用哪種**教學法**？');
            }
        } else {
            lines.push('\n---\n');
            lines.push('✨ 資訊齊全！確認後我將開始規劃教案。');
        }

        return lines.join('\n');
    }, []);

    // 處理確認階段的輸入（補充缺少的資訊）
    const handleConfirmingInput = useCallback((text: string) => {
        const data = lessonPrepDataRef.current;

        // 嘗試解析新輸入來補充缺少的資訊
        const parsed = parseLessonPrepPrompt(text);

        // 補充缺少的欄位
        if (data.missingFields.includes('topic') && parsed.topic) {
            data.topic = parsed.topic;
            data.curriculumUnit = parsed.curriculumUnit;
            data.missingFields = data.missingFields.filter(f => f !== 'topic');
        }
        if (data.missingFields.includes('pedagogy') && parsed.pedagogy) {
            data.pedagogy = parsed.pedagogy;
            data.missingFields = data.missingFields.filter(f => f !== 'pedagogy');
        }
        if (parsed.grade) data.grade = parsed.grade;
        if (parsed.sessions) data.sessions = parsed.sessions;

        // 檢查是否所有必要資訊都齊全
        if (data.missingFields.length === 0) {
            // 資訊齊全，進入規劃階段
            setLessonPrepStep('planning');
            setTeacherIsProcessing(true);
            addTeacherAssistantMessage('🚀 正在為您規劃教案...\n\n這可能需要幾秒鐘，請稍候。');

            // 模擬規劃過程
            setTimeout(() => {
                setLessonPrepStep('ready');
                setTeacherIsProcessing(false);
                addTeacherAssistantMessage(
                    `🎉 **教案規劃完成！**\n\n` +
                    `📚 主題：${data.topic}\n` +
                    `📐 教學法：${data.pedagogy?.name}\n` +
                    `${data.grade ? `🎓 年級：${data.grade}\n` : ''}` +
                    `${data.sessions ? `⏱️ 堂數：${data.sessions} 堂\n` : ''}` +
                    `\n已根據 ${data.pedagogy?.name} 教學理論為您生成教學活動流程。\n\n` +
                    `點擊下方按鈕進入視覺化編輯器，您可以：\n` +
                    `• 調整教學活動順序\n` +
                    `• 新增或修改活動內容\n` +
                    `• 預覽學生端畫面`,
                    { type: 'navigate', target: 'lesson-preview' }
                );
                // 重置狀態
                setLessonPrepStep('idle');
                lessonPrepDataRef.current = { topic: '', missingFields: [] };
            }, 2000);
        } else {
            // 還有缺少的資訊，繼續詢問
            const confirmMsg = generateConfirmMessage(data);
            addTeacherAssistantMessage(confirmMsg, undefined,
                data.missingFields.includes('pedagogy')
                    ? { pedagogyMethods: PEDAGOGY_METHODS }
                    : undefined
            );
        }
    }, [parseLessonPrepPrompt, generateConfirmMessage, addTeacherAssistantMessage]);

    // 處理選項點擊（教學法選擇等）
    const handleTeacherOptionClick = useCallback((optionId: string, optionLabel: string) => {
        // 加入用戶選擇的訊息
        setTeacherMessages(prev => [...prev, {
            id: genId(),
            role: 'user',
            content: optionLabel,
            timestamp: Date.now(),
        }]);

        // 在確認階段處理選項
        if (lessonPrepStep === 'confirming') {
            const data = lessonPrepDataRef.current;

            // 處理確認/修改按鈕
            if (optionId === 'confirm') {
                // 確認開始規劃
                setLessonPrepStep('planning');
                setTeacherIsProcessing(true);
                addTeacherAssistantMessage('🚀 正在為您規劃教案...\n\n這可能需要幾秒鐘，請稍候。');

                setTimeout(() => {
                    setLessonPrepStep('ready');
                    setTeacherIsProcessing(false);
                    addTeacherAssistantMessage(
                        `🎉 **教案規劃完成！**\n\n` +
                        `📚 主題：${data.topic}\n` +
                        `📐 教學法：${data.pedagogy?.name}\n` +
                        `${data.grade ? `🎓 年級：${data.grade}\n` : ''}` +
                        `${data.sessions ? `⏱️ 堂數：${data.sessions} 堂\n` : ''}` +
                        `\n已根據 ${data.pedagogy?.name} 教學理論為您生成教學活動流程。\n\n` +
                        `點擊下方按鈕進入視覺化編輯器，您可以：\n` +
                        `• 調整教學活動順序\n` +
                        `• 新增或修改活動內容\n` +
                        `• 預覽學生端畫面`,
                        { type: 'navigate', target: 'lesson-preview' }
                    );
                    // 重置狀態
                    setLessonPrepStep('idle');
                    lessonPrepDataRef.current = { topic: '', missingFields: [] };
                }, 2000);
                return;
            }

            if (optionId === 'modify') {
                // 重新開始
                setLessonPrepStep('idle');
                lessonPrepDataRef.current = { topic: '', missingFields: [] };
                addTeacherAssistantMessage(
                    '好的，請重新輸入您的備課需求。\n\n💡 提示：您可以一次說明完整需求，例如：\n「幫我用 APOS 教學法備課一元二次方程式，預計 2 堂課」'
                );
                return;
            }

            // 處理教學法選擇
            const method = PEDAGOGY_METHODS.find(m => m.id === optionId);
            if (method) {
                data.pedagogy = method;
                data.missingFields = data.missingFields.filter(f => f !== 'pedagogy');
            }

            // 處理課綱選擇
            if (data.curriculumUnit === undefined && optionId !== 'skip') {
                const matches = searchCurriculumByKeyword(data.topic);
                const selected = matches.find(m => m.code === optionId);
                if (selected) {
                    data.curriculumUnit = selected;
                    data.topic = selected.title;
                    data.missingFields = data.missingFields.filter(f => f !== 'topic');
                }
            }

            // 繼續確認流程
            setTimeout(() => handleConfirmingInput(''), 300);
        }
    }, [lessonPrepStep, handleConfirmingInput, addTeacherAssistantMessage]);

    // 教師發送訊息
    const sendTeacherMessage = useCallback(async (text: string) => {
        if (teacherIsProcessing || !text.trim()) return;

        setTeacherMessages(prev => [...prev, {
            id: genId(),
            role: 'user',
            content: text,
            timestamp: Date.now(),
        }]);

        // 如果正在確認階段，處理補充資訊
        if (lessonPrepStep === 'confirming') {
            handleConfirmingInput(text);
            return;
        }

        // 如果在規劃或準備階段，忽略輸入
        if (lessonPrepStep === 'planning' || lessonPrepStep === 'ready') {
            return;
        }

        setTeacherIsProcessing(true);

        try {
            const intent = parseIntent(text);

            switch (intent) {
                case 'lesson-prep': {
                    // 新流程：解析 prompt，進入確認階段
                    const parsed = parseLessonPrepPrompt(text);
                    lessonPrepDataRef.current = parsed;
                    setLessonPrepStep('confirming');

                    const confirmMsg = generateConfirmMessage(parsed);
                    addTeacherAssistantMessage(confirmMsg, undefined,
                        parsed.missingFields.includes('pedagogy')
                            ? { pedagogyMethods: PEDAGOGY_METHODS }
                            : parsed.missingFields.length === 0
                                ? {
                                    options: [
                                        { id: 'confirm', label: '✅ 確認，開始規劃' },
                                        { id: 'modify', label: '🔄 我要修改' },
                                    ]
                                }
                                : undefined
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
    }, [teacherIsProcessing, lessonPrepStep, handleConfirmingInput, parseLessonPrepPrompt, generateConfirmMessage, addTeacherAssistantMessage, teacherAgents]);

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
            lessonPrepStep,
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
