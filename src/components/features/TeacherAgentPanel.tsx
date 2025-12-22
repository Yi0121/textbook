import { useState, useRef, useEffect } from 'react';
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
import { useTeacherAIChat, type ChatMessage } from '../../hooks/useTeacherAIChat';

interface TeacherAgentPanelProps {
    className?: string;
    onClose?: () => void;
}

// 預設提示範例
const PROMPT_EXAMPLES = [
    { icon: GitBranch, text: '幫這個班級推薦學習路徑', category: 'learning-path' },
    { icon: FileText, text: '生成 10 題二次方程式練習', category: 'exercise' },
    { icon: Users, text: '把全班分成 5 組進行合作學習', category: 'grouping' },
];

export default function TeacherAgentPanel({ className = '', onClose }: TeacherAgentPanelProps) {
    const teacher = useTeacherAgents();
    const ui = useUI();
    const {
        messages,
        sendMessage,
        isProcessing
    } = useTeacherAIChat();

    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // 自動滾動到底部
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 初始化歡迎訊息 (如果 Hook 沒有提供歷史紀錄)
    useEffect(() => {
        if (messages.length === 0) {
            // 注意：這裡我們不直接 setMessages (因為它來自 Hook)，而是依賴 UI 渲染層加上歡迎訊息，
            // 或者我們可以發送一個不經過 LLM 的本地歡迎訊息。
            // 為了簡化，我們可以在這裡是直接調用 Hook 的 setMessages，但通常更好的做法是 UI 渲染時處理空的狀態，
            // 不過為了與舊版行為一致，我們這裡手動插入一則歡迎訊息到本地狀態（如果我們要完全控制）。
            // 
            // 修正策略：useTeacherAIChat 暴露 setMessages，我們可以在這裡用。
            // 但如果我們切換頁面回來，messages 還在嗎？目前 Hook 是 local state，每次 mount 都是新的。
            // 所以每次打開面板都會看到歡迎訊息是合理的。
        }
    }, [messages.length]);

    // 合併歡迎訊息與聊天訊息
    const displayMessages = messages.length > 0 ? messages : [{
        id: 'welcome',
        role: 'assistant',
        content: '你好！我是教學 AI 助手 🎓\n\n你可以告訴我你想做什麼，例如：\n• 幫這個班級推薦學習路徑\n• 生成練習題\n• 進行分組\n\n我會幫你完成並帶你到對應的工作台！',
        timestamp: Date.now(),
    }];

    // 處理使用者輸入
    const handleSubmit = () => {
        if (!input.trim() || isProcessing) return;
        sendMessage(input);
        setInput('');
    };

    // 跳轉到備課工作台
    const navigateToWorkspace = () => {
        // 關閉側邊欄
        if (onClose) onClose();
        ui.setQuizPanelOpen(false);
        ui.setSidebarOpen(false);

        // 開啟 Dashboard（會自動顯示 AI 學習路徑 Tab）
        ui.setDashboardOpen(true);
    };

    // 使用快捷提示
    const handleQuickPrompt = (text: string) => {
        setInput(text);
        inputRef.current?.focus();
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
                {displayMessages.map((msg: any) => (
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

                            {/* 行動按鈕 */}
                            {msg.action?.type === 'navigate' && (
                                <button
                                    onClick={navigateToWorkspace}
                                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 
                           text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                                >
                                    <GitBranch className="w-4 h-4" />
                                    前往 AI 學習路徑
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            )}

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
