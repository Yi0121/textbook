/**
 * TeacherClassSetupPage - 老師上課前的單元選擇頁
 * 
 * 功能：
 * 1. 顯示可用的課程單元/章節
 * 2. 選擇單元後進入教室 (/class)
 * 3. 顯示該單元的預估時間與難度
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, ArrowRight, Play, CheckCircle2 } from 'lucide-react';

// Mock Data: 課程單元
const UNITS = [
    {
        id: 'u1',
        title: '五年級：四則運算基礎',
        description: '理解加減乘除的運算規則與優先順序',
        duration: '45 分鐘',
        status: 'completed', // completed, in-progress, not-started
        topics: ['加減法複習', '乘除法原理', '括號的使用'],
    },
    {
        id: 'u2',
        title: '四年級：面積',
        description: '長方形土地與道路面積計算',
        duration: '60 分鐘',
        status: 'in-progress',
        topics: ['長方形面積', '平行四邊形', '複合圖形'],
    },
    {
        id: 'u3',
        title: '六年級：分數的加減',
        description: '異分母分數的通分與計算',
        duration: '50 分鐘',
        status: 'not-started',
        topics: ['擴分與約分', '通分技巧', '分數加減應用題'],
    },
];

export default function TeacherClassSetupPage() {
    const navigate = useNavigate();
    const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

    const handleStartClass = (unitId: string) => {
        // 實際應用中，這裡會將 selectedUnitId 存入 Context 或通過 State 傳遞
        navigate('/teacher/classroom', { state: { unitId } });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* 頁面標題 */}
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-indigo-600" />
                        選擇上課單元
                    </h1>
                    <p className="text-gray-600">
                        請選擇今天要進行的課程單元，系統將為您載入相應的教材與 AI 助教設定。
                    </p>
                </header>

                {/* 單元列表 */}
                <div className="grid gap-4">
                    {UNITS.map((unit) => (
                        <div
                            key={unit.id}
                            className={`
                                bg-white rounded-2xl p-6 border-2 transition-all cursor-pointer group
                                ${selectedUnitId === unit.id
                                    ? 'border-indigo-600 shadow-md bg-indigo-50/30'
                                    : 'border-transparent shadow-sm hover:border-indigo-200 hover:shadow-md'
                                }
                            `}
                            onClick={() => setSelectedUnitId(unit.id)}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                        {unit.title}
                                        {unit.status === 'completed' && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                                <CheckCircle2 className="w-3 h-3" /> 已授課
                                            </span>
                                        )}
                                        {unit.status === 'in-progress' && (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                                                <Clock className="w-3 h-3" /> 進行中
                                            </span>
                                        )}
                                    </h2>
                                    <p className="text-gray-600 mb-4">{unit.description}</p>

                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            {unit.duration}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-400">|</span>
                                            {unit.topics.map(topic => (
                                                <span key={topic} className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                                    {topic}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleStartClass(unit.id);
                                    }}
                                    className={`
                                        shrink-0 px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all
                                        ${selectedUnitId === unit.id || unit.status === 'in-progress'
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30'
                                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                                        }
                                    `}
                                >
                                    <Play className="w-5 h-5 fill-current" />
                                    開始上課
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 底部提示 */}
                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/teacher/lesson-prep')}
                        className="text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-2 hover:underline"
                    >
                        還沒準備好課程？前往備課工作台 <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
