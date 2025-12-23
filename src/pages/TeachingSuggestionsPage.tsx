/**
 * TeachingSuggestionsPage - 教學建議頁面
 * 
 * 提供 AI 生成的教學建議
 */

import { useState } from 'react';
import { Lightbulb, Sparkles, BookOpen, Users, Target, Clock, ChevronRight, RefreshCw } from 'lucide-react';

interface Suggestion {
    id: string;
    category: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    icon: React.ElementType;
}

const MOCK_SUGGESTIONS: Suggestion[] = [
    {
        id: '1',
        category: '教學策略',
        title: '增加互動式問答環節',
        description: '建議在講解完每個概念後，加入 2-3 分鐘的快速問答，可以提高學生的專注度和理解程度。',
        priority: 'high',
        icon: Users,
    },
    {
        id: '2',
        category: '學習進度',
        title: '放慢進度講解第三章',
        description: '根據學習數據分析，約 40% 的學生在第三章概念理解較弱，建議增加實例說明。',
        priority: 'high',
        icon: Target,
    },
    {
        id: '3',
        category: '課程內容',
        title: '補充實務應用案例',
        description: '加入業界實際應用案例，幫助學生理解理論與實務的連結。',
        priority: 'medium',
        icon: BookOpen,
    },
    {
        id: '4',
        category: '時間管理',
        title: '調整作業繳交時間',
        description: '目前作業繳交率為 75%，建議將截止時間調整至週日晚間，可能有助於提高繳交率。',
        priority: 'medium',
        icon: Clock,
    },
];

export default function TeachingSuggestionsPage() {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [suggestions] = useState<Suggestion[]>(MOCK_SUGGESTIONS);

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

                {/* 建議列表 */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        具體建議 ({suggestions.length})
                    </h3>

                    {suggestions.map((suggestion) => (
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
                </div>
            </div>
        </div>
    );
}
