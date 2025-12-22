/**
 * useStudentAIChat Hook
 * 
 * 封裝學生與 AI 學伴的對話邏輯，包含：
 * 1. 意圖解析 (Intent Parsing)
 * 2. Student Agent 服務調用
 * 3. 學習輔助功能 (提示、策略建議、自主學習評估)
 */

import { useState } from 'react';
import { useStudentAgents } from '../context/AgentContext';

// ==================== Types ====================

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    action?: {
        type: 'hint' | 'strategy' | 'srl' | 'feedback';
        data?: unknown;
    };
}

interface ParsedIntent {
    category: 'hint' | 'strategy' | 'srl' | 'progress' | 'chat';
    params: Record<string, unknown>;
}

// ==================== Hook ====================

export function useStudentAIChat() {
    const student = useStudentAgents();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    // 模擬學生 ID (實際應從認證系統取得)
    const currentStudentId = 'student-demo-001';

    // 解析使用者意圖
    const parseIntent = (prompt: string): ParsedIntent => {
        const lowerPrompt = prompt.toLowerCase();

        // 1. 解題提示
        if (
            lowerPrompt.includes('提示') ||
            lowerPrompt.includes('怎麼解') ||
            lowerPrompt.includes('不會') ||
            lowerPrompt.includes('卡住') ||
            lowerPrompt.includes('hint')
        ) {
            // 嘗試識別題目類型
            let problemType = 'algebra'; // 預設
            if (lowerPrompt.includes('幾何') || lowerPrompt.includes('geometry')) {
                problemType = 'geometry';
            } else if (lowerPrompt.includes('統計') || lowerPrompt.includes('機率')) {
                problemType = 'statistics';
            }

            return {
                category: 'hint',
                params: { problemType }
            };
        }

        // 2. 學習策略
        if (
            lowerPrompt.includes('策略') ||
            lowerPrompt.includes('方法') ||
            lowerPrompt.includes('怎麼學') ||
            lowerPrompt.includes('技巧')
        ) {
            return {
                category: 'strategy',
                params: {}
            };
        }

        // 3. 自主學習 / 學習狀態
        if (
            lowerPrompt.includes('進度') ||
            lowerPrompt.includes('表現') ||
            lowerPrompt.includes('學習狀態') ||
            lowerPrompt.includes('我的')
        ) {
            return {
                category: 'progress',
                params: {}
            };
        }

        // 4. 自主學習評估
        if (
            lowerPrompt.includes('建議') ||
            lowerPrompt.includes('應該') ||
            lowerPrompt.includes('接下來')
        ) {
            return {
                category: 'srl',
                params: {}
            };
        }

        // 預設：一般閒聊
        return { category: 'chat', params: {} };
    };

    // 加入助理訊息
    const addAssistantMessage = (
        content: string,
        action?: ChatMessage['action']
    ) => {
        const msg: ChatMessage = {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content,
            timestamp: Date.now(),
            action,
        };
        setMessages(prev => [...prev, msg]);
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
                case 'hint': {
                    // 呼叫 Scaffolding Agent 提供提示
                    const problemType = intent.params.problemType as string;

                    // 先顯示思考中
                    addAssistantMessage('🤔 讓我想想這題該怎麼解...');

                    const result = await student.suggestStrategy(
                        currentStudentId,
                        problemType,
                        1 // 第一步
                    );

                    if (result.success && result.data) {
                        const data = result.data as { strategies?: string[]; confidence?: number };
                        const strategies = data.strategies || ['試試看把問題拆解成小步驟'];

                        // 更新最後一條訊息
                        setMessages(prev => {
                            const updated = [...prev];
                            updated[updated.length - 1] = {
                                ...updated[updated.length - 1],
                                content: `💡 **解題建議**\n\n${strategies.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n需要更多提示嗎？說「更多提示」我可以給你下一步！`,
                                action: { type: 'hint', data: result.data }
                            };
                            return updated;
                        });
                    } else {
                        setMessages(prev => {
                            const updated = [...prev];
                            updated[updated.length - 1] = {
                                ...updated[updated.length - 1],
                                content: '💡 試試看先把已知條件列出來，再想想要求什麼。一步一步來！'
                            };
                            return updated;
                        });
                    }
                    break;
                }

                case 'strategy': {
                    // 呼叫 SRL Agent 建議學習策略
                    const result = await student.suggestLearningStrategy(
                        currentStudentId,
                        'visual', // 預設視覺型
                        ['algebra'], // 預設弱點
                        30 // 30 分鐘
                    );

                    if (result.success && result.data) {
                        const data = result.data as { suggestedStrategies?: string[] };
                        const strategies = data.suggestedStrategies || ['製作心智圖整理概念'];

                        addAssistantMessage(
                            `📚 **學習策略建議**\n\n根據你的學習風格，我建議：\n\n${strategies.map(s => `• ${s}`).join('\n')}\n\n試試看這些方法，有問題隨時問我！`,
                            { type: 'strategy', data: result.data }
                        );
                    } else {
                        addAssistantMessage('📚 建議你先預習課本，再做練習題。遇到不會的就問我！');
                    }
                    break;
                }

                case 'progress':
                case 'srl': {
                    // 呼叫 SRL Agent 評估狀態
                    const result = await student.assessSRLState(currentStudentId);

                    if (result.success && result.data) {
                        const data = result.data as {
                            overallScore?: number;
                            level?: string;
                            strengths?: string[];
                            improvements?: string[];
                        };

                        const score = Math.round((data.overallScore || 0.7) * 100);
                        const level = data.level || '良好';
                        const strengths = data.strengths || ['持續練習'];
                        const improvements = data.improvements || ['多複習錯題'];

                        addAssistantMessage(
                            `📊 **你的學習狀態**\n\n🎯 自主學習指數：**${score}%** (${level})\n\n✅ 做得好：\n${strengths.map(s => `• ${s}`).join('\n')}\n\n💪 可以加強：\n${improvements.map(s => `• ${s}`).join('\n')}\n\n繼續保持！有問題隨時找我 😊`,
                            { type: 'srl', data: result.data }
                        );
                    } else {
                        addAssistantMessage('📊 你最近學習很認真！繼續保持，遇到困難就問我喔！');
                    }
                    break;
                }

                default:
                    // 一般閒聊回覆
                    setTimeout(() => {
                        addAssistantMessage(
                            `收到！關於「${input}」，我可以幫你：\n\n• 🔍 解題提示 (說「這題怎麼解」)\n• 📚 學習策略 (說「怎麼學比較好」)\n• 📊 查看進度 (說「我的學習狀態」)\n\n有什麼需要幫忙的嗎？`
                        );
                    }, 500);
            }
        } catch (error) {
            console.error('[useStudentAIChat] Error:', error);
            addAssistantMessage('❌ 抱歉，處理你的請求時發生錯誤，請稍後再試。');
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        messages,
        setMessages,
        sendMessage,
        isProcessing,
    };
}
