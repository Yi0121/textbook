/**
 * StudentProgressPage - 學生進度儀表板
 * 
 * 功能：
 * 1. 學習進度 (Learning Progress)：視覺化呈現整體學習狀況
 * 2. 任務進度 (Task Progress)：代辦事項清單與完成狀況
 */

import { useState } from 'react';
import {
    TrendingUp,
    CheckSquare,
    Clock,
    Award,
    Target,
    CheckCircle2,
    ArrowRight
} from 'lucide-react';
import CircularProgress from '../components/ui/CircularProgress';

// Tabs 定義
type TabType = 'learning' | 'tasks';

// Mock Data: 任務列表
const TASKS = [
    { id: 't1', title: '完成單元一：隨堂測驗', type: 'quota', deadline: '今天 16:00', status: 'pending', xp: 50 },
    { id: 't2', title: '觀看教學影片：分數的加法', type: 'video', deadline: '明天', status: 'completed', xp: 30 },
    { id: 't3', title: '提交作業：混合運算練習', type: 'assignment', deadline: '週五', status: 'pending', xp: 100 },
    { id: 't4', title: '參與小組討論：數學在生活中的應用', type: 'discussion', deadline: '下週一', status: 'pending', xp: 40 },
];

// Mock Data: 知識點進度
const KNOWLEDGE_POINTS = [
    { id: 'k1', title: '四則運算規則', progress: 100, status: 'mastered' },
    { id: 'k2', title: '負數的概念', progress: 85, status: 'mastered' },
    { id: 'k3', title: '分數加減', progress: 45, status: 'learning' },
    { id: 'k4', title: '幾何圖形', progress: 0, status: 'locked' },
];

export default function StudentProgressPage() {
    const [activeTab, setActiveTab] = useState<TabType>('learning');

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* 頁面標題 */}
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <TrendingUp className="w-8 h-8 text-purple-600" />
                        我的學習儀表板
                    </h1>
                </header>

                {/* 概況卡片 (Summary Cards) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                            <Target className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">本週目標達成率</div>
                            <div className="text-2xl font-bold text-gray-900">75%</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">學習總時數</div>
                            <div className="text-2xl font-bold text-gray-900">12.5 小時</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm text-gray-500">累積經驗值 (XP)</div>
                            <div className="text-2xl font-bold text-gray-900">1,250</div>
                        </div>
                    </div>
                </div>

                {/* 主要內容區 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px]">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('learning')}
                            className={`flex-1 py-4 text-center font-medium transition-colors flex items-center justify-center gap-2
                                ${activeTab === 'learning'
                                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/30'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <TrendingUp className="w-4 h-4" />
                            學習進度
                        </button>
                        <button
                            onClick={() => setActiveTab('tasks')}
                            className={`flex-1 py-4 text-center font-medium transition-colors flex items-center justify-center gap-2
                                ${activeTab === 'tasks'
                                    ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/30'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <CheckSquare className="w-4 h-4" />
                            任務進度
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6 md:p-8">
                        {activeTab === 'learning' ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {/* 整體課程進度卡片 */}
                                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border border-purple-100">
                                    <div className="flex items-center justify-between gap-6">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 text-lg mb-4">整體課程進度 (數學五年級)</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-white/70 rounded-lg p-3">
                                                    <div className="text-xs text-purple-600 font-medium mb-1">本週學習</div>
                                                    <div className="text-xl font-bold text-purple-900">3.5 小時</div>
                                                </div>
                                                <div className="bg-white/70 rounded-lg p-3">
                                                    <div className="text-xs text-indigo-600 font-medium mb-1">剩餘單元</div>
                                                    <div className="text-xl font-bold text-indigo-900">12 個</div>
                                                </div>
                                            </div>
                                        </div>
                                        <CircularProgress
                                            progress={42}
                                            size="xl"
                                            color="text-purple-600"
                                        />
                                    </div>
                                </div>

                                {/* 知識點卡片 */}
                                <div>
                                    <h3 className="font-bold text-gray-900 mb-4">知識點掌握狀況</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {KNOWLEDGE_POINTS.map((point) => (
                                            <div key={point.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-center gap-4">
                                                    <div className="flex-1">
                                                        <span className="font-medium text-gray-900">{point.title}</span>
                                                        <div className="mt-1">
                                                            {point.status === 'mastered' && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">已精通</span>}
                                                            {point.status === 'learning' && <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">學習中</span>}
                                                            {point.status === 'locked' && <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">未解鎖</span>}
                                                        </div>
                                                    </div>
                                                    <CircularProgress
                                                        progress={point.progress}
                                                        size="md"
                                                        color={
                                                            point.status === 'mastered' ? 'text-green-600' :
                                                                point.status === 'learning' ? 'text-blue-600' : 'text-gray-400'
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 學習路徑捷徑 */}
                                <div className="bg-indigo-50 rounded-xl p-6 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-bold text-indigo-900 mb-1">查看詳細學習路徑圖</h3>
                                        <p className="text-sm text-indigo-700">視覺化檢視你的所有學習節點與分支</p>
                                    </div>
                                    <a href="/student/learning-path" className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow flex items-center gap-2">
                                        前往路徑圖 <ArrowRight className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                {/* 任務列表 */}
                                {TASKS.map((task) => (
                                    <div
                                        key={task.id}
                                        className={`
                                            flex items-center gap-4 p-4 rounded-xl border transition-all
                                            ${task.status === 'completed'
                                                ? 'bg-gray-50 border-gray-200 opacity-75'
                                                : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
                                            }
                                        `}
                                    >
                                        <button className={`
                                            w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                                            ${task.status === 'completed'
                                                ? 'bg-green-500 border-green-500 text-white'
                                                : 'border-gray-300 hover:border-purple-500 text-transparent'
                                            }
                                        `}>
                                            <CheckCircle2 className="w-4 h-4" />
                                        </button>

                                        <div className="flex-1">
                                            <h4 className={`font-medium ${task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                                {task.title}
                                            </h4>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> {task.deadline}
                                                </span>
                                                <span className="bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">
                                                    +{task.xp} XP
                                                </span>
                                            </div>
                                        </div>

                                        {task.status !== 'completed' && (
                                            <button className="px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                                                去完成
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <div className="text-center pt-4">
                                    <button className="text-gray-500 hover:text-gray-700 text-sm font-medium">
                                        顯示已完成任務
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
