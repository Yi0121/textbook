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
    Edit3,
    Clock,
    FileEdit,
    MessageCircle,
    TrendingUp,
} from 'lucide-react';
import { type UserRole } from '../config/toolConfig';
import {
    TextMessage,
    OptionsMessage,
    PedagogySelectMessage,
    SummaryMessage,
} from '../components/common/chat/ChatMessages';
import { useTeacherAIChatContext, useStudentAIChatContext, type ChatMessage } from '../context/AIChatContext';
import type { PedagogyMethod } from '../data/pedagogyMethods';

// 定義一個包含所有可能欄位的擴展訊息類型
type ExtendedChatMessage = ChatMessage & {
    options?: { id: string; label: string; icon?: string }[];
    pedagogyMethods?: PedagogyMethod[];
    type?: string;
};

interface OutletContextType {
    userRole: UserRole;
}

// 教師快速入口
const TEACHER_QUICK_ACTIONS = [
    { icon: Edit3, label: '備課', description: '備課工作台', path: '/teacher/lesson-prep' },
    { icon: BarChart3, label: '學習分析', description: '班級學習分析', path: '/teacher/class-analytics' },
    { icon: Lightbulb, label: '教學建議', description: 'AI 教學建議', path: '/teacher/suggestions' },
    { icon: Users, label: '分組協作', description: '管理小組活動', path: '/groups' },
    { icon: ClipboardList, label: '作業管理', description: '發布與批改', path: '/assignments' },
];

// 學生快速入口
const STUDENT_QUICK_ACTIONS = [
    { icon: BookOpen, label: '開始上課', description: '閱讀教材', path: '/teacher/classroom' },
    { icon: BarChart3, label: '學習進度', description: '查看我的進度', path: '/student/dashboard' },
    { icon: ClipboardList, label: '我的作業', description: '查看與提交', path: '/assignments' },
    { icon: Lightbulb, label: '學習建議', description: '個人化學習建議', path: '/student/suggestions' },
];

// Mock 最近活動資料
const TEACHER_RECENT_ACTIVITIES = [
    { id: 1, type: 'lesson', title: '四則運算課程', desc: '已發布給 5年甲班', time: '10 分鐘前', icon: FileEdit },
    { id: 2, type: 'chat', title: 'AI 生成隨堂測驗', desc: '共 15 題選擇題', time: '1 小時前', icon: MessageCircle },
    { id: 3, type: 'analytics', title: '查看班級學習分析', desc: '平均進度 72%', time: '昨天', icon: BarChart3 },
];

const STUDENT_RECENT_ACTIVITIES = [
    { id: 1, type: 'lesson', title: '繼續上次課程', desc: 'Ch3. 一元二次方程式', time: '上次 15 分鐘前', icon: BookOpen },
    { id: 2, type: 'progress', title: '學習進度更新', desc: '達成 3 個學習目標', time: '今天', icon: TrendingUp },
    { id: 3, type: 'assignment', title: '作業即將到期', desc: '四則運算練習', time: '明天截止', icon: ClipboardList },
];

export default function HomePage() {
    const { userRole } = useOutletContext<OutletContextType>();
    const isTeacher = userRole === 'teacher';
    const navigate = useNavigate();

    // 根據角色使用共享的 Context Chat
    const teacherChat = useTeacherAIChatContext();
    const studentChat = useStudentAIChatContext();

    // 根據角色使用對應的 Chat
    const activeChat = isTeacher ? teacherChat : studentChat;
    const {
        messages,
        setMessages,
        sendMessage,
        isProcessing
    } = activeChat;

    // 只有老師模式有選項點擊功能，學生模式給一個空函數避免錯誤
    const handleOptionClick = isTeacher
        ? teacherChat.handleOptionClick
        : () => { /* no-op for student mode */ };

    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const quickActions = isTeacher ? TEACHER_QUICK_ACTIONS : STUDENT_QUICK_ACTIONS;
    const recentActivities = isTeacher ? TEACHER_RECENT_ACTIVITIES : STUDENT_RECENT_ACTIVITIES;

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
                            <div className={`max-w-[85%] ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
                                {(() => {
                                    // 強制轉型以處理聯合類型問題
                                    const extendedMsg = msg as ExtendedChatMessage;

                                    if (msg.role === 'user') {
                                        return <TextMessage content={msg.content} isUser={true} />;
                                    }

                                    return (
                                        <>
                                            {/* 根據訊息類型渲染不同組件 */}
                                            {extendedMsg.options ? (
                                                extendedMsg.type === 'summary' ? (
                                                    <SummaryMessage
                                                        content={msg.content}
                                                        options={extendedMsg.options}
                                                        onSelect={handleOptionClick}
                                                    />
                                                ) : (
                                                    <OptionsMessage
                                                        content={msg.content}
                                                        options={extendedMsg.options}
                                                        onSelect={handleOptionClick}
                                                    />
                                                )
                                            ) : extendedMsg.pedagogyMethods ? (
                                                <PedagogySelectMessage
                                                    content={msg.content}
                                                    methods={extendedMsg.pedagogyMethods}
                                                    onSelect={handleOptionClick}
                                                />
                                            ) : (
                                                <TextMessage content={msg.content} isUser={false} />
                                            )}
                                        </>
                                    );
                                })()}

                                {/* 確認按鈕：學習路徑導航 */}
                                {msg.action?.type === 'navigate' && msg.action.target === 'learning-path' && (
                                    <button
                                        onClick={() => navigate('/student/dashboard?tab=learning-path')}
                                        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-all shadow-md hover:shadow-lg"
                                    >
                                        <BarChart3 className="w-4 h-4" />
                                        查看學習路徑
                                    </button>
                                )}

                                {/* 確認按鈕：課程預覽導航（視覺化編輯） */}
                                {msg.action?.type === 'navigate' && msg.action.target === 'lesson-preview' && (
                                    <button
                                        onClick={() => navigate('/teacher/lesson-prep/preview/lesson-apos-001')}
                                        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl font-medium text-sm transition-all shadow-md hover:shadow-lg"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        視覺化編輯課程
                                    </button>
                                )}

                                {/* 確認按鈕：前往備課工作台 */}
                                {msg.action?.type === 'navigate' && msg.action.target === 'lesson-prep-chat' && (
                                    <button
                                        onClick={() => navigate('/teacher/lesson-prep')}
                                        className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white rounded-xl font-medium text-sm transition-all shadow-md hover:shadow-lg"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                        前往備課工作台
                                    </button>
                                )}
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
                                    <div
                                        key={action.path}
                                        onClick={() => navigate(action.path)}
                                        className={`
                      p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
                      hover:shadow-md ${isTeacher ? 'hover:border-indigo-300' : 'hover:border-purple-300'}
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
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 最近活動區塊 */}
                    {messages.length <= 1 && (
                        <div className="mt-8">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                最近活動
                            </h3>
                            <div className="space-y-2">
                                {recentActivities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-sm transition-all cursor-pointer group"
                                    >
                                        <div className={`
                                            p-2 rounded-lg
                                            ${isTeacher
                                                ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500'
                                                : 'bg-purple-50 dark:bg-purple-900/20 text-purple-500'
                                            }
                                        `}>
                                            <activity.icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                                                {activity.title}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {activity.desc}
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                                            {activity.time}
                                        </div>
                                    </div>
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
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                        AI 助手可能產生錯誤，請驗證重要資訊
                    </p>
                </div>
            </div>
        </div>
    );
}
