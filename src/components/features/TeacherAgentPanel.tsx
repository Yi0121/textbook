import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Send,
    Sparkles,
    Loader2,
    GitBranch,
    FileText,
    Users,
    ArrowRight,
    CheckCircle,
    Bot,
    User,
} from 'lucide-react';
import { useTeacherAgents } from '../../context/AgentContext';
import { useUI } from '../../context/UIContext';
import { useTeacherAIChatContext, type ChatMessage } from '../../context/AIChatContext';

interface TeacherAgentPanelProps {
    className?: string;
    onClose?: () => void;
}

// 預設提示範例
const PROMPT_EXAMPLES = [
    { icon: Sparkles, text: '幫我備課', category: 'lesson-prep' },
    { icon: GitBranch, text: '幫這個班級推薦學習路徑', category: 'learning-path' },
    { icon: FileText, text: '生成 10 題二次方程式練習', category: 'exercise' },
    { icon: Users, text: '把全班分成 5 組進行合作學習', category: 'grouping' },
];

export default function TeacherAgentPanel({ className = '', onClose }: TeacherAgentPanelProps) {
    const navigate = useNavigate();
    const teacher = useTeacherAgents();
    const ui = useUI();
    const {
        messages,
        sendMessage,
        isProcessing,
        handleOptionClick,
    } = useTeacherAIChatContext();

    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // 自動滾動到底部
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 使用 useState 初始化器儲存歡迎訊息的時間戳（只在首次渲染時計算）
    const [welcomeTimestamp] = useState(() => Date.now());

    // 合併歡迎訊息與聊天訊息
    const displayMessages: ChatMessage[] = messages.length > 0 ? messages : [{
        id: 'welcome',
        role: 'assistant' as const,
        content: '你好！我是教學 AI 助手 🎓\n\n你可以告訴我你想做什麼，例如：\n• 幫我備課\n• 推薦學習路徑\n• 生成練習題\n\n我會幫你完成！',
        timestamp: welcomeTimestamp,
    }];

    // 處理使用者輸入
    const handleSubmit = () => {
        if (!input.trim() || isProcessing) return;
        sendMessage(input);
        setInput('');
    };

    // 跳轉到備課編輯器
    const navigateToLessonPreview = () => {
        if (onClose) onClose();
        navigate('/lesson-prep/preview/lesson-apos-001');
    };

    // 跳轉到學習路徑
    const navigateToLearningPath = () => {
        if (onClose) onClose();
        ui.setQuizPanelOpen(false);
        ui.setSidebarOpen(false);
        ui.setDashboardOpen(true);
    };

    // 使用快捷提示
    const handleQuickPrompt = (text: string) => {
        sendMessage(text);
    };

    // 渲染選項按鈕
    const renderOptions = (msg: ChatMessage) => {
        if (!msg.options || msg.options.length === 0) return null;

        return (
            <div className="mt-2 flex flex-wrap gap-2">
                {msg.options.map((opt) => (
                    <button
                        key={opt.id}
                        onClick={() => handleOptionClick(opt.id, opt.label)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 
                                   text-xs rounded-full transition-colors border border-indigo-200"
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        );
    };

    // Orphaned code block removed


    // 渲染教學法選擇
    const renderPedagogyMethods = (msg: ChatMessage) => {
        if (!msg.pedagogyMethods || msg.pedagogyMethods.length === 0) return null;

        return (
            <div className="mt-2 grid grid-cols-1 gap-2">
                {msg.pedagogyMethods.map((method) => (
                    <button
                        key={method.id}
                        onClick={() => handleOptionClick(method.id, method.name)}
                        className="text-left px-3 py-2 bg-white hover:bg-gray-50 
                                   rounded-lg border border-gray-200 transition-all hover:shadow-sm"
                        style={{ borderLeftColor: method.color, borderLeftWidth: '3px' }}
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-lg">{method.icon}</span>
                            <div>
                                <div className="font-medium text-sm text-gray-900">{method.name}</div>
                                <div className="text-xs text-gray-500">{method.description}</div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        );
    };

    // 渲染導航按鈕
    const renderNavigateButton = (msg: ChatMessage) => {
        if (msg.action?.type !== 'navigate') return null;

        const target = msg.action.target;

        if (target === 'lesson-preview') {
            return (
                <button
                    onClick={navigateToLessonPreview}
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 
                               bg-gradient-to-r from-indigo-600 to-purple-600 
                               hover:from-indigo-700 hover:to-purple-700
                               text-white text-sm font-medium rounded-lg transition-all shadow-sm"
                >
                    <Sparkles className="w-4 h-4" />
                    進入視覺化編輯器
                    <ArrowRight className="w-4 h-4" />
                </button>
            );
        }

        if (target === 'learning-path') {
            return (
                <button
                    onClick={navigateToLearningPath}
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 
                               bg-indigo-600 hover:bg-indigo-700
                               text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                >
                    <GitBranch className="w-4 h-4" />
                    查看學習路徑
                    <ArrowRight className="w-4 h-4" />
                </button>
            );
        }

        return null;
    };

    if (!teacher.isReady) {
        return (
            <div className={`flex flex-col items-center justify-center h-64 ${className}`}>
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-3" />
                <span className="text-sm text-slate-500">AI 助手載入中...</span>
            </div>
        );
    }

    return (
        <div className={`flex flex-col h-full ${className}`}>
            {/* 訊息列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {displayMessages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        {/* 頭像 */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user'
                            ? 'bg-indigo-100 text-indigo-600'
                            : 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white'
                            }`}>
                            {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>

                        {/* 訊息內容 */}
                        <div className={`flex-1 max-w-[85%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                            <div className={`inline-block px-4 py-3 rounded-2xl ${msg.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-tr-sm'
                                : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                                }`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            </div>

                            {/* 選項按鈕 */}
                            {msg.role === 'assistant' && renderOptions(msg)}

                            {/* 課綱選擇 */}
                            {/* Curriculum Matches Removed */}


                            {/* 教學法選擇 */}
                            {msg.role === 'assistant' && renderPedagogyMethods(msg)}

                            {/* 導航按鈕 */}
                            {msg.role === 'assistant' && renderNavigateButton(msg)}

                            {/* 生成完成標記 */}
                            {msg.action?.type === 'generate' && (
                                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 text-xs rounded-full">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    內容已生成
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* 處理中動畫 */}
                {isProcessing && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white animate-pulse" />
                        </div>
                        <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3">
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                                <span className="text-sm text-slate-600">AI 正在處理...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* 快捷提示 */}
            {messages.length <= 1 && (
                <div className="px-4 pb-3">
                    <p className="text-xs text-slate-500 mb-2">快速開始</p>
                    <div className="flex flex-wrap gap-2">
                        {PROMPT_EXAMPLES.map((example, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleQuickPrompt(example.text)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 
                         text-slate-700 text-xs rounded-full transition-colors"
                            >
                                <example.icon className="w-3.5 h-3.5" />
                                {example.text}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* 輸入區 */}
            <div className="p-4 border-t border-slate-200 bg-white">
                <div className="flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
                        placeholder="輸入你想做的事情..."
                        disabled={isProcessing}
                        className="flex-1 px-4 py-2.5 bg-slate-100 border-0 rounded-full text-sm 
                     placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500
                     disabled:opacity-50"
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={!input.trim() || isProcessing}
                        className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 
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
