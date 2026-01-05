import { useState } from 'react';
import {
    Target,
    ArrowLeft,
    Database,
    BookOpen,
    Bot,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { ViewTab } from './division-exploration';
import { studentInfo } from './division-exploration';
import { OverviewTab } from './division-exploration/OverviewTab';
import { AdvancedTab } from './division-exploration/AdvancedTab';

/**
 * TeacherDivisionExplorationPage - 整合版除法探究教師儀表板
 *
 * 結合原本的 Monitor 與 Advanced 頁面，使用 Tab 切換
 */
export default function TeacherDivisionExplorationPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<ViewTab>('overview');

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 font-sans text-slate-900">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header Section */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        返回班級總覽
                    </button>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            {/* Avatar with progress ring */}
                            <div className="relative">
                                <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                                    <circle r="16" cx="18" cy="18" fill="transparent" stroke="#e5e7eb" strokeWidth="3" />
                                    <circle
                                        r="16"
                                        cx="18"
                                        cy="18"
                                        fill="transparent"
                                        stroke="#6366f1"
                                        strokeWidth="3"
                                        strokeDasharray="92 8"
                                        className="transition-all duration-700"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <span className="text-xl font-bold text-white">{studentInfo.name.charAt(0)}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h1 className="text-2xl font-bold text-gray-900">{studentInfo.name}</h1>
                                    <span className="px-3 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200">
                                        {studentInfo.class}
                                    </span>
                                    <span className="px-3 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold border border-indigo-200 flex items-center gap-1">
                                        <Database size={12} />
                                        {studentInfo.systemTag}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 font-medium">
                                    <BookOpen className="w-4 h-4" />
                                    <span>{studentInfo.taskName}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                92%
                            </div>
                            <div className="text-sm text-gray-500 font-bold">規則掌握度</div>
                        </div>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-sm transition-all ${activeTab === 'overview'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Target className="w-4 h-4" />
                        學習總覽
                    </button>
                    <button
                        onClick={() => setActiveTab('advanced')}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-sm transition-all ${activeTab === 'advanced'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <Bot className="w-4 h-4" />
                        AI 深度分析
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' ? (
                    <OverviewTab />
                ) : (
                    <AdvancedTab />
                )}
            </div>
        </div>
    );
}
