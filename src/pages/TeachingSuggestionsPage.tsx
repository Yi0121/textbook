/**
 * TeachingSuggestionsPage - 教學建議頁面
 * 
 * 提供 AI 生成的教學建議
 */

import { useState } from 'react';
import { Lightbulb, Sparkles, BookOpen, Users, Target, Clock, ChevronRight, RefreshCw } from 'lucide-react';

interface Suggestion {
    id: string;
    timeScope: 'unit' | 'next-lesson' | 'today' | 'week';
    category: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    icon: React.ElementType;
    relatedUnit?: string;
    targetDate?: string;
}

const MOCK_SUGGESTIONS: Suggestion[] = [
    // 今天的建議
    {
        id: 'today-1',
        timeScope: 'today',
        category: '教學策略',
        title: '增加互動式問答環節',
        description: '建議在講解完每個概念後，加入 2-3 分鐘的快速問答，可以提高學生的專注度和理解程度。',
        priority: 'high',
        icon: Users,
        targetDate: '2025-12-25',
    },
    {
        id: 'today-2',
        timeScope: 'today',
        category: '時間管理',
        title: '預留 10 分鐘複習時間',
        description: '今天課程內容較多，建議在課堂最後預留 10 分鐘快速複習重點，加深學生印象。',
        priority: 'medium',
        icon: Clock,
        targetDate: '2025-12-25',
    },
    {
        id: 'today-3',
        timeScope: 'today',
        category: '課程內容',
        title: '準備實作範例',
        description: '今天的單元較抽象，建議準備 1-2 個生活化的實作範例協助學生理解。',
        priority: 'medium',
        icon: BookOpen,
        targetDate: '2025-12-25',
    },

    // 下一節課的建議
    {
        id: 'next-1',
        timeScope: 'next-lesson',
        category: '課程內容',
        title: '複習分數加減法',
        description: '下節課將進入分數乘除法，建議先用 5 分鐘快速複習分數加減法，確保學生基礎穩固。',
        priority: 'high',
        icon: BookOpen,
        targetDate: '2025-12-26',
    },
    {
        id: 'next-2',
        timeScope: 'next-lesson',
        category: '教學策略',
        title: '準備視覺化教材',
        description: '分數乘除法概念對學生較困難，建議準備圖形化教材（如圓餅圖、長條圖）幫助理解。',
        priority: 'high',
        icon: Target,
        targetDate: '2025-12-26',
    },
    {
        id: 'next-3',
        timeScope: 'next-lesson',
        category: '學習進度',
        title: '關注後段學生',
        description: '前次測驗顯示 5 位學生在分數運算上較弱，建議課後多給予個別指導。',
        priority: 'medium',
        icon: Users,
        targetDate: '2025-12-26',
    },

    // 單元視角的建議（四則運算）
    {
        id: 'unit-1',
        timeScope: 'unit',
        category: '教學策略',
        title: '四則運算：從具體到抽象',
        description: '建議採用漸進式教學法，先用實物（如積木、錢幣）建立具體概念，再過渡到符號運算。',
        priority: 'high',
        icon: Target,
        relatedUnit: '四則運算',
    },
    {
        id: 'unit-2',
        timeScope: 'unit',
        category: '學習進度',
        title: '加強乘除混合運算',
        description: '數據顯示 40% 學生在乘除混合運算的運算順序容易出錯，建議增加括號運算的練習。',
        priority: 'high',
        icon: Users,
        relatedUnit: '四則運算',
    },
    {
        id: 'unit-3',
        timeScope: 'unit',
        category: '課程內容',
        title: '設計超市購物情境',
        description: '在「四則運算」單元中加入超市購物預算計算的情境題，提高學生對數字的敏感度。',
        priority: 'medium',
        icon: BookOpen,
        relatedUnit: '四則運算',
    },
    {
        id: 'unit-4',
        timeScope: 'unit',
        category: '時間管理',
        title: '單元時間分配建議',
        description: '建議將「四則運算」單元拆分為 8 節課，重點放在混合運算的應用。',
        priority: 'low',
        icon: Clock,
        relatedUnit: '四則運算',
    },

    // 單元視角的建議（幾何圖形）
    {
        id: 'unit-geo-1',
        timeScope: 'unit',
        category: '教學策略',
        title: '幾何圖形：實作拼貼',
        description: '利用七巧板或圖形紙片進行拼貼活動，幫助學生認識平面圖形的特性。',
        priority: 'high',
        icon: Target,
        relatedUnit: '幾何圖形',
    },
    {
        id: 'unit-geo-2',
        timeScope: 'unit',
        category: '學習進度',
        title: '加強圖形面積計算',
        description: '學生在複合圖形面積計算上表現較弱，建議分步驟拆解圖形講解。',
        priority: 'medium',
        icon: Users,
        relatedUnit: '幾何圖形',
    },

    // 本週的建議
    {
        id: 'week-1',
        timeScope: 'week',
        category: '學習進度',
        title: '本週重點：完成分數運算單元',
        description: '本週目標是完成「分數運算」單元的所有內容，並進行隨堂測驗評估學習成效。',
        priority: 'high',
        icon: Target,
    },
    {
        id: 'week-2',
        timeScope: 'week',
        category: '教學策略',
        title: '週三安排小組討論',
        description: '建議在週三安排 20 分鐘的小組討論時間，讓學生互相教學、解答疑問。',
        priority: 'high',
        icon: Users,
    },
    {
        id: 'week-3',
        timeScope: 'week',
        category: '時間管理',
        title: '週五進行單元測驗',
        description: '建議在週五進行「分數運算」單元測驗，留出週末時間讓學生複習弱點。',
        priority: 'medium',
        icon: Clock,
    },
    {
        id: 'week-4',
        timeScope: 'week',
        category: '課程內容',
        title: '準備下週新單元',
        description: '下週將進入「比例與比值」單元，建議本週末備妥相關教材和實例。',
        priority: 'low',
        icon: BookOpen,
    },
];

export default function TeachingSuggestionsPage() {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [suggestions] = useState<Suggestion[]>(MOCK_SUGGESTIONS);
    const [selectedTimeScope, setSelectedTimeScope] = useState<Suggestion['timeScope']>('today');
    const [selectedUnit, setSelectedUnit] = useState('四則運算');

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1500);
    };

    const getPriorityColor = (priority: Suggestion['priority']) => {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'medium':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'low':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
        }
    };

    const getPriorityLabel = (priority: Suggestion['priority']) => {
        switch (priority) {
            case 'high':
                return '高優先';
            case 'medium':
                return '中優先';
            case 'low':
                return '低優先';
        }
    };

    return (
        <div className="h-full bg-gray-50 dark:bg-gray-900 p-6 overflow-auto">
            <div className="max-w-4xl mx-auto">
                {/* 頁面標題 */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                            <Lightbulb className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                                💡 教學建議
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                基於學習數據的 AI 教學優化建議
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        重新分析
                    </button>
                </div>

                {/* AI 分析摘要 */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 mb-6 text-white">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold mb-2">AI 教學分析摘要</h2>
                            <p className="text-white/90 text-sm leading-relaxed">
                                根據近兩週的學習數據分析，班級整體學習進度良好。建議重點關注第三章的概念強化，
                                並考慮增加更多互動式教學環節以提高學生參與度。
                            </p>
                        </div>
                    </div>
                </div>

                {/* 時間視角切換器 */}
                <div className="mb-6">
                    <div className="flex gap-2 bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setSelectedTimeScope('today')}
                            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${selectedTimeScope === 'today'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            📅 今天
                        </button>
                        <button
                            onClick={() => setSelectedTimeScope('next-lesson')}
                            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${selectedTimeScope === 'next-lesson'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            ⏭️ 下一節課
                        </button>
                        <button
                            onClick={() => setSelectedTimeScope('unit')}
                            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${selectedTimeScope === 'unit'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            📚 單元視角
                        </button>
                        <button
                            onClick={() => setSelectedTimeScope('week')}
                            className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${selectedTimeScope === 'week'
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            📊 本週
                        </button>
                    </div>
                </div>

                {/* 建議列表 */}
                <div className="space-y-4">
                    {(() => {
                        let filteredSuggestions = suggestions.filter(s => s.timeScope === selectedTimeScope);

                        // 若是單元視角，則進一步過濾單元
                        if (selectedTimeScope === 'unit') {
                            filteredSuggestions = filteredSuggestions.filter(s => s.relatedUnit === selectedUnit);
                        }

                        const timeScopeLabel = {
                            'today': '今天',
                            'next-lesson': '下一節課',
                            'unit': '單元視角',
                            'week': '本週'
                        }[selectedTimeScope];

                        return (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {timeScopeLabel}的建議 ({filteredSuggestions.length})
                                    </h3>

                                    {/* 單元選擇器 (僅在單元視角顯示) */}
                                    {selectedTimeScope === 'unit' && (
                                        <div className="flex gap-2">
                                            {['四則運算', '幾何圖形'].map(unit => (
                                                <button
                                                    key={unit}
                                                    onClick={() => setSelectedUnit(unit)}
                                                    className={`px-3 py-1 text-xs rounded-full border transition-colors ${selectedUnit === unit
                                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                                            : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                                                        }`}
                                                >
                                                    {unit}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {filteredSuggestions.map((suggestion) => (
                                    <div
                                        key={suggestion.id}
                                        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow cursor-pointer group"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                                <suggestion.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {suggestion.category}
                                                    </span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityColor(suggestion.priority)}`}>
                                                        {getPriorityLabel(suggestion.priority)}
                                                    </span>
                                                </div>
                                                <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                                                    {suggestion.title}
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {suggestion.description}
                                                </p>
                                            </div>
                                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                                        </div>
                                    </div>
                                ))}
                            </>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
}
