import { useState, useEffect } from 'react';
import {
    ChevronRight,
    Users,
    Sparkles,
    LayoutDashboard
} from 'lucide-react';

// Assignment Sub-components
import { BasicTabContent, AdvancedTabContent } from './assignment';

export default function TeacherAssignmentPage() {
    const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic');

    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
            .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: transparent;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background-color: rgba(156, 163, 175, 0.3);
                border-radius: 20px;
            }
        `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 font-sans">
            {/* Header */}
            <header className="mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <span>課程管理</span>
                    <ChevronRight className="w-4 h-4" />
                    <span>課堂監控</span>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                            <LayoutDashboard className="w-8 h-8 text-indigo-600" />
                            一題多解任務（multiple solution tasks, MSTs）
                        </h1>
                        <p className="text-gray-500 mt-1">單元：整數除法與應用 • 4年級</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2 transition-colors">
                            <Users className="w-4 h-4" />
                            檢視學生名單
                        </button>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-200 flex items-center gap-2 transition-colors">
                            <Sparkles className="w-4 h-4" />
                            AI 課堂助教
                        </button>
                    </div>
                </div>

                {/* Task Tabs */}
                <div className="flex gap-4 mt-6 border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab('basic')}
                        className={`pb-3 px-1 font-bold text-sm transition-all border-b-2 ${activeTab === 'basic'
                            ? 'text-indigo-600 border-indigo-600'
                            : 'text-gray-500 border-transparent hover:text-gray-700'
                            }`}
                    >
                        基礎題：分糖果
                    </button>
                    <button
                        onClick={() => setActiveTab('advanced')}
                        className={`pb-3 px-1 font-bold text-sm transition-all border-b-2 ${activeTab === 'advanced'
                            ? 'text-purple-600 border-purple-600'
                            : 'text-gray-500 border-transparent hover:text-gray-700'
                            }`}
                    >
                        <span className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            進階挑戰：積木分裝 (給資優生)
                        </span>
                    </button>
                </div>

                {/* Question Banner */}
                <div className={`mt-6 px-6 py-4 rounded-xl border flex items-start gap-4 ${activeTab === 'basic'
                    ? 'bg-indigo-50 border-indigo-100 text-indigo-900'
                    : 'bg-purple-50 border-purple-100 text-purple-900'
                    }`}>
                    <span className={`text-white text-xs px-2 py-0.5 rounded font-bold mt-0.5 flex-shrink-0 ${activeTab === 'basic' ? 'bg-indigo-600' : 'bg-purple-600'
                        }`}>
                        {activeTab === 'basic' ? '全班任務' : '核心挑戰題'}
                    </span>
                    {activeTab === 'basic' ? (
                        <p className="font-medium text-lg">
                            商店裡有 <span className="font-bold underline">24</span> 顆糖果，要平均分給 <span className="font-bold underline">4</span> 個小朋友。
                            每個小朋友可以分到幾顆糖果？
                        </p>
                    ) : (
                        <div className="w-full">
                            <p className="font-medium text-lg mb-2">
                                有 <span className="font-bold underline">48</span> 顆積木，要放進 <span className="font-bold underline">3</span> 個盒子。
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-base opacity-90">
                                <li><strong>每個盒子裡的積木數</strong> 不一定要一樣多</li>
                                <li>但三個盒子裡的積木數 <strong>必須是連續的三個整數</strong> (如 5, 6, 7)</li>
                            </ul>
                        </div>
                    )}
                </div>
            </header>

            {/* Content Switcher */}
            {activeTab === 'basic' ? <BasicTabContent /> : <AdvancedTabContent />}
        </div>
    );
}
