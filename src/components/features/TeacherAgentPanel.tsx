/**
 * TeacherAgentPanel - 教師 AI 助手面板
 * 
 * Prompt 驅動模式：
 * 1. 使用者輸入自然語言指令
 * 2. Agent 解析意圖並執行
 * 3. 跳轉到對應工作台（如 AI 學習路徑）
 */

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
import { useLearningPath } from '../../context/LearningPathContext';
import { useUI } from '../../context/UIContext';
import { analyzeStudentAndGeneratePath } from '../../services/ai/learningPathService';
import type { StudentLearningRecord } from '../../types';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    action?: {
        type: 'navigate' | 'generate';
        target?: string;
        data?: unknown;
    };
}

interface TeacherAgentPanelProps {
    className?: string;
    onClose?: () => void;
}

// 預設學生弱點資料（模擬）
const DEFAULT_STUDENT_RECORD: StudentLearningRecord = {
    studentId: 'class-default',
    studentName: '全班',
    answers: [],
    totalQuestions: 0,
    correctCount: 0,
    averageScore: 65,
    averageTimeSpent: 0,
    weakKnowledgeNodes: [
        { nodeId: 'kn-quadratic-formula', nodeName: '一元二次方程式公式解', errorRate: 0.6, relatedQuestions: [] },
        { nodeId: 'kn-discriminant', nodeName: '判別式應用', errorRate: 0.5, relatedQuestions: [] },
        { nodeId: 'kn-factoring', nodeName: '因式分解', errorRate: 0.4, relatedQuestions: [] },
    ],
    lastUpdated: Date.now(),
};

// 預設提示範例
const PROMPT_EXAMPLES = [
    { icon: GitBranch, text: '幫這個班級推薦學習路徑', category: 'learning-path' },
    { icon: FileText, text: '生成 10 題二次方程式練習', category: 'exercise' },
    { icon: Users, text: '把全班分成 5 組進行合作學習', category: 'grouping' },
];

export default function TeacherAgentPanel({ className = '', onClose }: TeacherAgentPanelProps) {
    const teacher = useTeacherAgents();
    const { state: lpState, dispatch: lpDispatch } = useLearningPath();
    const ui = useUI();

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: '你好！我是教學 AI 助手 🎓\n\n你可以告訴我你想做什麼，例如：\n• 幫這個班級推薦學習路徑\n• 生成練習題\n• 進行分組\n\n我會幫你完成並帶你到對應的工作台！',
            timestamp: Date.now(),
        }
    ]);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // 自動滾動到底部
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 解析使用者意圖
    const parseIntent = (prompt: string): { category: string; params: Record<string, unknown> } => {
        const lowerPrompt = prompt.toLowerCase();

        // 學習路徑相關
        if (lowerPrompt.includes('路徑') || lowerPrompt.includes('推薦') ||
            lowerPrompt.includes('學習計畫') || lowerPrompt.includes('弱點')) {
            return {
                category: 'learning-path',
                params: {
                    studentId: 'class-default',
                }
            };
        }

        // 練習題相關
        if (lowerPrompt.includes('練習') || lowerPrompt.includes('題目') || lowerPrompt.includes('測驗')) {
            const countMatch = prompt.match(/(\d+)/);
            return {
                category: 'exercise',
                params: {
                    count: countMatch ? parseInt(countMatch[1]) : 5,
                    topic: prompt.replace(/生成|幫我|\d+題|練習|測驗/g, '').trim() || '數學',
                }
            };
        }

        // 分組相關
        if (lowerPrompt.includes('分組') || lowerPrompt.includes('小組') || lowerPrompt.includes('組別')) {
            const countMatch = prompt.match(/(\d+)/);
            return {
                category: 'grouping',
                params: {
                    groupCount: countMatch ? parseInt(countMatch[1]) : 4,
                }
            };
        }

        // 預設：學習路徑
        return { category: 'learning-path', params: {} };
    };

    // 處理使用者輸入
    const handleSubmit = async () => {
        if (!input.trim() || isProcessing) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: input,
            timestamp: Date.now(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsProcessing(true);

        try {
            const intent = parseIntent(input);
            let response: Message;

            switch (intent.category) {
                case 'learning-path': {
                    // 調用真正的 AI 學習路徑服務
                    setMessages(prev => [...prev, {
                        id: `thinking-${Date.now()}`,
                        role: 'assistant',
                        content: '🔍 分析學生學習記錄...\n正在識別弱點並生成個性化學習路徑...',
                        timestamp: Date.now(),
                    }]);

                    // 取得學習記錄（若無則使用預設）
                    const studentId = 'class-default';
                    let record = lpState.learningRecords.get(studentId);
                    if (!record) {
                        record = DEFAULT_STUDENT_RECORD;
                    }

                    // 調用 AI 服務生成學習路徑
                    const result = await analyzeStudentAndGeneratePath(record);

                    // 更新 LearningPath Context
                    lpDispatch({
                        type: 'SET_NODES_AND_EDGES',
                        payload: {
                            studentId,
                            nodes: result.nodes,
                            edges: result.edges,
                        }
                    });

                    // 設定 AI 推薦摘要
                    if (result.recommendation) {
                        lpDispatch({
                            type: 'SET_AI_RECOMMENDATION',
                            payload: {
                                studentId,
                                recommendation: result.recommendation,
                            }
                        });
                    }

                    // 移除 "思考中" 訊息，添加成功訊息
                    setMessages(prev => prev.filter(m => !m.id.startsWith('thinking-')));

                    response = {
                        id: `assistant-${Date.now()}`,
                        role: 'assistant',
                        content: `✅ AI 學習路徑已生成！\n\n📊 分析結果：\n${result.recommendation?.summary || '已根據學生弱點生成個性化學習路徑'}\n\n🎯 重點加強：\n${result.recommendation?.focusAreas?.map(a => `• ${a}`).join('\n') || '• 核心概念複習'}\n\n⏱ 預估時間：約 ${result.recommendation?.estimatedDuration || 45} 分鐘\n\n已生成 ${result.nodes.length} 個學習節點，點擊下方按鈕前往編輯。`,
                        timestamp: Date.now(),
                        action: {
                            type: 'navigate',
                            target: 'learning-path',
                            data: result,
                        }
                    };
                    break;
                }

                case 'exercise': {
                    const result = await teacher.generateExercise(
                        intent.params.topic as string,
                        { count: intent.params.count as number, difficulty: 'medium', type: 'multiple-choice' }
                    );

                    if (result.success) {
                        response = {
                            id: `assistant-${Date.now()}`,
                            role: 'assistant',
                            content: `✅ 已生成 ${intent.params.count || 5} 題「${intent.params.topic}」練習題！\n\n題目已準備好，可以加入到學習路徑或直接發布給學生。`,
                            timestamp: Date.now(),
                            action: {
                                type: 'generate',
                                data: result.data,
                            }
                        };
                    } else {
                        throw new Error(result.error);
                    }
                    break;
                }

                case 'grouping': {
                    const result = await teacher.autoGroupStudents(
                        'class-default',
                        { groupCount: intent.params.groupCount as number, strategy: 'mixed' }
                    );

                    if (result.success) {
                        response = {
                            id: `assistant-${Date.now()}`,
                            role: 'assistant',
                            content: `✅ 已將全班分成 ${intent.params.groupCount || 4} 組！\n\n採用混合分組策略，確保各組能力均衡。你可以在分組管理中調整。`,
                            timestamp: Date.now(),
                            action: {
                                type: 'generate',
                                data: result.data,
                            }
                        };
                    } else {
                        throw new Error(result.error);
                    }
                    break;
                }

                default:
                    response = {
                        id: `assistant-${Date.now()}`,
                        role: 'assistant',
                        content: '抱歉，我不太理解你的需求。你可以試試：\n• 幫這個班級推薦學習路徑\n• 生成練習題\n• 進行分組',
                        timestamp: Date.now(),
                    };
            }

            setMessages(prev => [...prev, response]);
        } catch (error) {
            // 移除 "思考中" 訊息
            setMessages(prev => prev.filter(m => !m.id.startsWith('thinking-')));

            setMessages(prev => [...prev, {
                id: `error-${Date.now()}`,
                role: 'assistant',
                content: `❌ 處理時發生錯誤：${error instanceof Error ? error.message : '未知錯誤'}`,
                timestamp: Date.now(),
            }]);
        } finally {
            setIsProcessing(false);
        }
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
                {messages.map(msg => (
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
