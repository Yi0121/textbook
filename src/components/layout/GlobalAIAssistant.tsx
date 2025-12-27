/**
 * GlobalAIAssistant - 全局 AI 助教浮動按鈕
 * 
 * 在每個頁面右下角顯示，點擊展開 AI 助教對話面板
 * 支援教師與學生兩種模式
 */

import { useState, useEffect, useRef } from 'react';
import { Bot, X, Sparkles, MessageCircle } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import TeacherAgentPanel from '../features/TeacherAgentPanel';

interface GlobalAIAssistantProps {
    /** 是否預設展開 */
    defaultOpen?: boolean;
}

export default function GlobalAIAssistant({ defaultOpen = false }: GlobalAIAssistantProps) {
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

    // 根據用戶角色決定顯示內容
    const isTeacher = userRole === 'teacher';
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
                            // 學生版 AI 家教（暫時用簡單的提示）
                            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                                    <MessageCircle className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                    AI 學習家教
                                </h4>
                                <p className="text-sm text-gray-500 mb-4">
                                    有任何學習問題都可以問我！<br />
                                    我會根據你的進度提供個人化指導。
                                </p>
                                <div className="text-xs text-gray-400">
                                    （學生版 AI 家教功能開發中...）
                                </div>
                            </div>
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
