/**
 * GlobalAIAssistant - 全局 AI 助教浮動按鈕
 * 
 * 在每個頁面右下角顯示，點擊展開 AI 助教對話面板
 * 支援教師與學生兩種模式
 */

import { useState, useEffect, useRef } from 'react';
import { Bot, X, Sparkles, Send, Loader2, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useEditor } from '../../context/EditorContext';
import { useStudentAIChatContext, type ChatMessage } from '../../context/AIChatContext';
import TeacherAgentPanel from '../features/TeacherAgentPanel';

interface GlobalAIAssistantProps {
    /** 是否預設展開 */
    defaultOpen?: boolean;
}

// 學生版 AI 家教面板
function StudentChatPanel({ onClose: _onClose }: { onClose: () => void }) {
    const {
        messages,
        setMessages,
        sendMessage,
        isProcessing,
    } = useStudentAIChatContext();

    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [welcomeTimestamp] = useState(() => Date.now());

    // 自動滾動到底部
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 初始化歡迎訊息
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{
                id: 'welcome',
                role: 'assistant',
                content: '嗨！我是你的 AI 學習家教 ✨\n\n有什麼問題嗎？我可以幫你：\n• 解答課本上的問題\n• 複習重點概念\n• 練習題目',
                timestamp: welcomeTimestamp,
            }]);
        }
    }, [messages.length, setMessages, welcomeTimestamp]);

    const handleSubmit = () => {
        if (!input.trim() || isProcessing) return;
        sendMessage(input);
        setInput('');
    };

    const displayMessages: ChatMessage[] = messages.length > 0 ? messages : [{
        id: 'welcome',
        role: 'assistant' as const,
        content: '嗨！我是你的 AI 學習家教 ✨\n\n有什麼問題嗎？我可以幫你：\n• 解答課本上的問題\n• 複習重點概念\n• 練習題目',
        timestamp: welcomeTimestamp,
    }];

    return (
        <div className="flex flex-col h-full">
            {/* 訊息列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {displayMessages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        {/* 頭像 */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user'
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                            }`}>
                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>

                        {/* 訊息內容 */}
                        <div className={`flex-1 max-w-[85%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                            <div className={`inline-block px-4 py-3 rounded-2xl ${msg.role === 'user'
                                    ? 'bg-emerald-600 text-white rounded-tr-sm'
                                    : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                                }`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {/* 處理中動畫 */}
                {isProcessing && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white animate-pulse" />
                        </div>
                        <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                                <span className="text-sm text-slate-600">思考中...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* 輸入區 */}
            <div className="p-4 border-t border-slate-200 bg-white">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
                        placeholder="輸入你的問題..."
                        disabled={isProcessing}
                        className="flex-1 px-4 py-2.5 bg-slate-100 border-0 rounded-full text-sm
                                   placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500
                                   disabled:opacity-50"
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={!input.trim() || isProcessing}
                        className="p-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300
                                   text-white rounded-full transition-colors"
                    >
                        {isProcessing ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function GlobalAIAssistant({ defaultOpen = false }: GlobalAIAssistantProps) {
    const location = useLocation();
    const { state } = useEditor();
    const userRole = state.userRole;
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [isAnimating, setIsAnimating] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    // 點擊外部關閉面板
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                // 檢查是否點擊了按鈕本身
                const fab = document.getElementById('global-ai-fab');
                if (fab && fab.contains(event.target as Node)) return;
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // 處理開關動畫
    const handleToggle = () => {
        if (!isOpen) {
            setIsOpen(true);
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 300);
        } else {
            setIsAnimating(true);
            setTimeout(() => {
                setIsOpen(false);
                setIsAnimating(false);
            }, 200);
        }
    };

    // 根據用戶角色或當前路徑決定顯示內容
    // 如果在學生詳細頁面 (student-detail) 或學生端 (student/)，強制顯示學生版
    const isStudentContext = location.pathname.includes('/student-detail') || location.pathname.includes('/student/');
    const isTeacher = userRole === 'teacher' && !isStudentContext;
    const assistantTitle = isTeacher ? 'AI 教學助手' : 'AI 學習家教';
    const fabColor = isTeacher
        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
        : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700';

    return (
        <>
            {/* 浮動按鈕 (FAB) */}
            <button
                id="global-ai-fab"
                onClick={handleToggle}
                className={`
                    fixed bottom-6 right-6 z-50
                    w-14 h-14 rounded-full shadow-lg
                    ${fabColor}
                    text-white
                    flex items-center justify-center
                    transition-all duration-300 ease-out
                    hover:scale-110 hover:shadow-xl
                    ${isOpen ? 'rotate-180' : ''}
                `}
                aria-label={isOpen ? '關閉 AI 助手' : '開啟 AI 助手'}
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <div className="relative">
                        <Bot className="w-6 h-6" />
                        <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300" />
                    </div>
                )}
            </button>

            {/* 對話面板 */}
            {isOpen && (
                <div
                    ref={panelRef}
                    className={`
                        fixed bottom-24 right-6 z-50
                        w-[400px] max-w-[calc(100vw-48px)]
                        h-[600px] max-h-[calc(100vh-160px)]
                        bg-white rounded-2xl shadow-2xl
                        border border-gray-200
                        flex flex-col overflow-hidden
                        transition-all duration-300 ease-out
                        ${isAnimating ? 'animate-slideUp' : ''}
                    `}
                    style={{
                        animation: isAnimating && !isOpen ? 'slideDown 0.2s ease-out' : undefined,
                    }}
                >
                    {/* 標題欄 */}
                    <div className={`
                        flex items-center justify-between
                        px-4 py-3 border-b border-gray-100
                        ${isTeacher
                            ? 'bg-gradient-to-r from-indigo-50 to-purple-50'
                            : 'bg-gradient-to-r from-emerald-50 to-teal-50'
                        }
                    `}>
                        <div className="flex items-center gap-2">
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center
                                ${isTeacher
                                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                                    : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                                }
                            `}>
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-sm">{assistantTitle}</h3>
                                <p className="text-xs text-gray-500">
                                    {isTeacher ? '備課、分組、學習路徑' : '問問題、複習、練習'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 hover:bg-white/50 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4 text-gray-500" />
                        </button>
                    </div>

                    {/* 內容區域 */}
                    <div className="flex-1 overflow-hidden">
                        {isTeacher ? (
                            <TeacherAgentPanel
                                className="h-full"
                                onClose={() => setIsOpen(false)}
                            />
                        ) : (
                            <StudentChatPanel onClose={() => setIsOpen(false)} />
                        )}
                    </div>
                </div>
            )}

            {/* 動畫樣式 */}
            <style>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                @keyframes slideDown {
                    from {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                    to {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out forwards;
                }
            `}</style>
        </>
    );
}
