/**
 * HomePage - AI 助教/家教首頁
 * 
 * 類似 ChatGPT 風格的 AI 對話介面
 * - 歡迎訊息
 * - 快速入口按鈕
 * - 對話區域
 */

import { useState, useRef, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import {
    Send,
    Sparkles,
    Loader2,
    Bot,
    User,
    BookOpen,
    BarChart3,
    Users,
    ClipboardList,
    Lightbulb,
} from 'lucide-react';
import { type UserRole } from '../config/toolConfig';
import MarkdownMessage from '../components/ui/MarkdownMessage';
import { useTeacherAIChat } from '../hooks/useTeacherAIChat';
import { useStudentAIChat } from '../hooks/useStudentAIChat';

interface OutletContextType {
    userRole: UserRole;
}

// 教師快速入口
const TEACHER_QUICK_ACTIONS = [
    { icon: BookOpen, label: '開始上課', description: '進入教材編輯器', path: '/class' },
    { icon: BarChart3, label: '查看學習數據', description: '班級學習分析', path: '/dashboard' },
    { icon: Users, label: '分組協作', description: '管理小組活動', path: '/groups' },
    { icon: ClipboardList, label: '作業管理', description: '發布與批改', path: '/assignments' },
];

// 學生快速入口
const STUDENT_QUICK_ACTIONS = [
    { icon: BookOpen, label: '開始上課', description: '閱讀教材', path: '/class' },
    { icon: BarChart3, label: '學習進度', description: '查看我的進度', path: '/progress' },
    { icon: ClipboardList, label: '我的作業', description: '查看與提交', path: '/assignments' },
    { icon: Lightbulb, label: '錯題本', description: '複習錯誤題目', path: '/mistakes' },
];

export default function HomePage() {
    const { userRole } = useOutletContext<OutletContextType>();
    const isTeacher = userRole === 'teacher';
    const navigate = useNavigate();

    // 根據角色動態選擇 Chat Hook
    const teacherChat = useTeacherAIChat();
    const studentChat = useStudentAIChat();

    // 根據角色使用對應的 Chat
    const {
        messages,
        setMessages,
        sendMessage,
        isProcessing
    } = isTeacher ? teacherChat : studentChat;

    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const quickActions = isTeacher ? TEACHER_QUICK_ACTIONS : STUDENT_QUICK_ACTIONS;

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
                content: isTeacher
                    ? '老師您好！我是您的 AI 助教 🎓\n\n有什麼我可以幫您的嗎？例如：\n- 幫我準備今天的課程\n- 分析班級學習狀況\n- 生成隨堂測驗'
                    : '嗨！我是你的 AI 學習夥伴 ✨\n\n有什麼問題嗎？我可以幫你：\n- 解答課本上的問題\n- 複習重點概念\n- 練習題目',
                timestamp: Date.now(),
            }]);
        }
    }, [isTeacher, messages.length, setMessages]);

    // 處理跳轉動作
    useEffect(() => {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg?.action?.type === 'navigate' && lastMsg.action.target) {
            // 如果是 learning-path，跳轉並帶參數
            if (lastMsg.action.target === 'learning-path') {
                navigate('/dashboard?tab=learning-path');
            }
        }
    }, [messages, navigate]);

    const handleSend = () => {
        if (!input.trim() || isProcessing) return;
        sendMessage(input);
        setInput('');
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
            {/* 對話區域 */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-4 py-8">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-4 mb-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            {/* 頭像 */}
                            <div className={`
                w-10 h-10 rounded-full flex items-center justify-center shrink-0
                ${msg.role === 'user'
                                    ? 'bg-gray-200 dark:bg-gray-700'
                                    : isTeacher
                                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                                        : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                                }
              `}>
                                {msg.role === 'user'
                                    ? <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    : <Bot className="w-5 h-5" />
                                }
                            </div>

                            {/* 訊息內容 */}
                            <div className={`flex-1 max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                                <MarkdownMessage
                                    content={msg.content}
                                    role={msg.role === 'user' ? 'user' : 'ai'}
                                    userRole={userRole === 'all' ? 'student' : userRole}
                                />
                            </div>
                        </div>
                    ))}

                    {/* 處理中動畫 */}
                    {isProcessing && (
                        <div className="flex gap-4 mb-6">
                            <div className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${isTeacher
                                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                                    : 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                                }
              `}>
                                <Sparkles className="w-5 h-5 animate-pulse" />
                            </div>
                            <div className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">思考中...</span>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />

                    {/* 快速入口（只在第一次顯示） */}
                    {messages.length <= 1 && (
                        <div className="mt-8">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">快速開始</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {quickActions.map((action) => (
                                    <a
                                        key={action.path}
                                        href={action.path}
                                        className={`
                      p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
                      hover:shadow-md hover:border-${isTeacher ? 'indigo' : 'purple'}-300 
                      transition-all group cursor-pointer
                    `}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`
                        p-2 rounded-lg 
                        ${isTeacher
                                                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                                                    : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                                }
                      `}>
                                                <action.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                                                    {action.label}
                                                </h4>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                    {action.description}
                                                </p>
                                            </div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 輸入區域 */}
            <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                            placeholder={isTeacher ? '問問 AI 助教...' : '問問 AI 家教...'}
                            disabled={isProcessing}
                            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-400"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isProcessing}
                            className={`
                p-2 rounded-xl transition-all
                ${input.trim() && !isProcessing
                                    ? isTeacher
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        : 'bg-purple-600 text-white hover:bg-purple-700'
                                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                                }
              `}
                        >
                            {isProcessing ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-2">
                        AI 助手可能產生錯誤，請驗證重要資訊
                    </p>
                </div>
            </div>
        </div>
    );
}
