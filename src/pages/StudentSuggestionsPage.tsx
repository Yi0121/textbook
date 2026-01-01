/**
 * LearningSuggestionsPage - 學習建議頁面 (學生)
 * 
 * 提供個人化學習建議
 */

import { useState } from 'react';
import { Lightbulb, Sparkles, BookOpen, Target, TrendingUp, CheckCircle, ChevronRight, RefreshCw } from 'lucide-react';

interface Suggestion {
    id: string;
    category: string;
    title: string;
    description: string;
    type: 'improve' | 'strength' | 'goal';
    icon: React.ElementType;
}

const MOCK_SUGGESTIONS: Suggestion[] = [
    {
        id: '1',
        category: '待加強',
        title: '複習第三章：函數與變數',
        description: '根據你的測驗結果，建議花更多時間理解函數的參數傳遞和變數作用域概念。',
        type: 'improve',
        icon: BookOpen,
    },
    {
        id: '2',
        category: '學習目標',
        title: '完成本週練習題',
        description: '還有 3 道練習題未完成，建議在週末前完成以鞏固所學概念。',
        type: 'goal',
        icon: Target,
    },
    {
        id: '3',
        category: '強項',
        title: '迴圈概念掌握良好',
        description: '你在迴圈相關題目的正確率達到 92%，可以嘗試更進階的巢狀迴圈練習。',
        type: 'strength',
        icon: TrendingUp,
    },
    {
        id: '4',
        category: '學習目標',
        title: '嘗試挑戰進階題目',
        description: '基礎概念已掌握，建議開始嘗試進階難度的程式設計題目。',
        type: 'goal',
        icon: CheckCircle,
    },
];

export default function LearningSuggestionsPage() {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [suggestions] = useState<Suggestion[]>(MOCK_SUGGESTIONS);

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 1500);
    };

    const getTypeColor = (type: Suggestion['type']) => {
        switch (type) {
            case 'improve':
                return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
            case 'strength':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'goal':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
        }
    };

    const getTypeLabel = (type: Suggestion['type']) => {
        switch (type) {
            case 'improve':
                return '待加強';
            case 'strength':
                return '強項';
            case 'goal':
                return '目標';
        }
    };

    return (
        <div className="h-full bg-gray-50 dark:bg-gray-900 p-6 overflow-auto">
            <div className="max-w-4xl mx-auto">
                {/* 頁面標題 */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Lightbulb className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                                💡 學習建議
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                根據你的學習狀況提供個人化建議
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        更新建議
                    </button>
                </div>

                {/* AI 分析摘要 */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 mb-6 text-white">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold mb-2">AI 學習分析</h2>
                            <p className="text-white/90 text-sm leading-relaxed">
                                你的整體學習進度良好！本週完成了 85% 的學習任務。
                                建議多花一些時間在函數概念上，這將有助於後續章節的學習。繼續加油！🎉
                            </p>
                        </div>
                    </div>
                </div>

                {/* 學習統計 */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">85%</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">本週完成率</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">78%</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">平均正確率</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">12</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">連續學習天數</p>
                    </div>
                </div>

                {/* 建議列表 */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        個人化建議 ({suggestions.length})
                    </h3>

                    {suggestions.map((suggestion) => (
                        <div
                            key={suggestion.id}
                            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md transition-shadow cursor-pointer group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-2.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                    <suggestion.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {suggestion.category}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getTypeColor(suggestion.type)}`}>
                                            {getTypeLabel(suggestion.type)}
                                        </span>
                                    </div>
                                    <h4 className="font-semibold text-gray-800 dark:text-white mb-1">
                                        {suggestion.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {suggestion.description}
                                    </p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
