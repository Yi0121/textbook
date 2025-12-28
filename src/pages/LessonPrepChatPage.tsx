/**
 * LessonPrepChatPage - 對話式備課頁面
 * 
 * 透過 AI 對話收集備課資訊：
 * 主題 → 章節 → 堂數 → 目標 → 教學法 → 生成課程
 */

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Send,
    Loader2,
    ArrowLeft,
    Sparkles,
    BookOpen,
    CheckCircle,
    Clock,
    Target,
    GraduationCap,
} from 'lucide-react';
import { useLessonPrepChat, type ChatMessage } from '../hooks/useLessonPrepChat';
import type { CurriculumUnit } from '../data/curriculum108Math';
import type { PedagogyMethod } from '../data/pedagogyMethods';

// ==================== Message Components ====================

import {
    TextMessage,
    OptionsMessage,
    CurriculumMatchesMessage,
    PedagogySelectMessage,
    SummaryMessage,
} from '../components/features/chat/ChatMessages';

/** 渲染單條訊息 */
function MessageBubble({
    message,
    onOptionSelect,
}: {
    message: ChatMessage;
    onOptionSelect: (id: string, label: string) => void;
}) {
    const isUser = message.role === 'user';

    switch (message.type) {
        case 'options':
            return (
                <OptionsMessage
                    content={message.content}
                    options={message.options || []}
                    onSelect={onOptionSelect}
                />
            );
        case 'curriculum-matches':
            return (
                <CurriculumMatchesMessage
                    content={message.content}
                    matches={message.curriculumMatches || []}
                    onSelect={onOptionSelect}
                />
            );
        case 'pedagogy-select':
            return (
                <PedagogySelectMessage
                    content={message.content}
                    methods={message.pedagogyMethods || []}
                    onSelect={onOptionSelect}
                />
            );
        case 'summary':
            return (
                <SummaryMessage
                    content={message.content}
                    options={message.options || []}
                    onSelect={onOptionSelect}
                />
            );
        default:
            return <TextMessage content={message.content} isUser={isUser} />;
    }
}

// ==================== Sidebar Component ====================

function PrepDataSidebar({
    prepData,
    currentStep,
}: {
    prepData: {
        topic: string;
        curriculumUnit?: CurriculumUnit;
        sessions: number;
        objectives: string[];
        pedagogy?: PedagogyMethod;
    };
    currentStep: string;
}) {
    const steps = [
        { key: 'topic', label: '主題', icon: BookOpen, value: prepData.topic, done: !!prepData.topic },
        { key: 'curriculum', label: '課綱', icon: GraduationCap, value: prepData.curriculumUnit?.code, done: !!prepData.curriculumUnit },
        { key: 'sessions', label: '堂數', icon: Clock, value: prepData.sessions ? `${prepData.sessions} 堂` : '', done: currentStep !== 'topic' && currentStep !== 'curriculum' },
        { key: 'objectives', label: '目標', icon: Target, value: prepData.objectives.length > 0 ? `${prepData.objectives.length} 個` : '', done: prepData.objectives.length > 0 || (currentStep !== 'topic' && currentStep !== 'curriculum' && currentStep !== 'sessions' && currentStep !== 'objectives') },
        { key: 'pedagogy', label: '教學法', icon: Sparkles, value: prepData.pedagogy?.name, done: !!prepData.pedagogy },
    ];

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-4 space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                備課資訊
            </h3>
            <div className="space-y-2">
                {steps.map((step) => (
                    <div
                        key={step.key}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${step.done ? 'bg-green-50' : 'bg-gray-50'
                            }`}
                    >
                        <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${step.done ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'
                                }`}
                        >
                            {step.done ? <CheckCircle className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs text-gray-500">{step.label}</div>
                            <div className="text-sm font-medium text-gray-900 truncate">
                                {step.value || '—'}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ==================== Main Page ====================

export default function LessonPrepChatPage() {
    const navigate = useNavigate();
    const {
        messages,
        currentStep,
        prepData,
        isTyping,
        startConversation,
        handleUserInput,
        handleOptionSelect,
        isGenerating,
    } = useLessonPrepChat();

    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // 開始對話
    useEffect(() => {
        startConversation();
    }, []);

    // 自動滾動到底部
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    // 生成完成後跳轉
    useEffect(() => {
        if (isGenerating) {
            const timer = setTimeout(() => {
                navigate('/lesson-prep/preview/lesson-apos-001');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isGenerating, navigate]);

    // 送出訊息
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isTyping) return;
        handleUserInput(inputValue.trim());
        setInputValue('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/lesson-prep')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Sparkles className="w-5 h-5 text-indigo-600" />
                                AI 備課助手
                            </h1>
                            <p className="text-sm text-gray-500">透過對話快速規劃課程</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Chat Area */}
                    <div className="lg:col-span-3">
                        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 180px)' }}>
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <MessageBubble message={msg} onOptionSelect={handleOptionSelect} />
                                    </div>
                                ))}

                                {/* Typing indicator */}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-white border border-gray-200 shadow-sm px-4 py-3 rounded-2xl">
                                            <div className="flex items-center gap-2">
                                                <div className="flex gap-1">
                                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                </div>
                                                <span className="text-sm text-gray-500">思考中...</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="border-t border-gray-200 p-4 bg-white/80">
                                <form onSubmit={handleSubmit} className="flex gap-3">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="輸入訊息..."
                                        disabled={isTyping || isGenerating}
                                        className="flex-1 px-4 py-3 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-50"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!inputValue.trim() || isTyping || isGenerating}
                                        className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isTyping ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Send className="w-5 h-5" />
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="hidden lg:block">
                        <div className="sticky top-24">
                            <PrepDataSidebar prepData={prepData} currentStep={currentStep} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
