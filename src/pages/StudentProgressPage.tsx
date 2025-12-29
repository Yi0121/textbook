/**
 * StudentProgressPage - 學生進度儀表板 (Designer Version)
 */

import { useState } from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from 'recharts';
import {
    BookOpen,
    Target,
    User,
    Search
} from 'lucide-react';

// ==================== Mock Data ====================

// 1. Task Completion (Donut)
const TASK_DATA = [
    { name: 'Completed', value: 2, color: '#86efac' }, // green-300
    { name: 'Remaining', value: 3, color: '#f3f4f6' }, // gray-100
];

// 2. Concept Mastery (Radar)
const CONCEPT_DATA = [
    { subject: 'R-5-2-501', A: 80, fullMark: 100 },
    { subject: 'R-5-2-502', A: 90, fullMark: 100 },
    { subject: 'R-5-2-803', A: 60, fullMark: 100 },
    { subject: 'R-5-2-504', A: 70, fullMark: 100 },
    { subject: 'R-5-2-505', A: 85, fullMark: 100 },
    { subject: 'R-5-2-806', A: 65, fullMark: 100 },
    { subject: 'R-5-2-507', A: 75, fullMark: 100 },
];

export default function StudentProgressPage() {
    const [inputMessage, setInputMessage] = useState('');

    return (
        <div className="min-h-screen bg-gray-100 p-6 font-sans">
            <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-6 h-[calc(100vh-3rem)]">

                {/* Left Column: Data Visaulization (9 cols) */}
                <div className="col-span-12 lg:col-span-9 flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">

                    {/* Row 1: Tasks & Radar */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[22rem]">
                        {/* Task Completion */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">任務完成度</h3>
                            <div className="flex-1 relative flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={TASK_DATA}
                                            innerRadius={80}
                                            outerRadius={100}
                                            startAngle={90}
                                            endAngle={-270}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {TASK_DATA.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-5xl font-bold text-gray-800">2/5</span>
                                </div>
                            </div>
                            <div className="text-center text-gray-500 font-medium">
                                已完成 2 項任務 (40%)
                            </div>
                        </div>

                        {/* Concept Mastery Radar */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">概念精熟度</h3>
                            <div className="flex-1">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={CONCEPT_DATA}>
                                        <PolarGrid stroke="#e5e7eb" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                        <Radar
                                            name="Mike"
                                            dataKey="A"
                                            stroke="#818cf8"
                                            strokeWidth={2}
                                            fill="#818cf8"
                                            fillOpacity={0.4}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Row 2: Efficiency & Network */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[20rem]">
                        {/* Efficiency Bar Chart */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">解題效率分析</h3>
                            <div className="flex items-center gap-4 mb-2 text-sm">
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-teal-400 rounded-sm"></div>
                                    <span className="text-gray-600">速度</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 bg-pink-400 rounded-sm"></div>
                                    <span className="text-gray-600">準確率</span>
                                </div>
                            </div>
                            <div className="flex-1 w-full">
                                {/* Customized Bar Chart Mock using div for precise visual match or Recharts */}
                                <div className="flex h-full items-end justify-around pb-4 px-8 relative">
                                    {/* Grid Lines Mock */}
                                    <div className="absolute inset-x-8 inset-y-4 flex flex-col justify-between pointer-events-none opacity-20 z-0">
                                        <div className="h-px bg-gray-400"></div>
                                        <div className="h-px bg-gray-400"></div>
                                        <div className="h-px bg-gray-400"></div>
                                        <div className="h-px bg-gray-400"></div>
                                        <div className="h-px bg-gray-400"></div>
                                    </div>

                                    {/* Bar Group 1 */}
                                    <div className="flex gap-2 z-10 items-end h-[85%]">
                                        <div className="w-12 bg-teal-400 rounded-t-lg relative group h-full transition-all hover:opacity-90">
                                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-bold text-gray-600">85%</span>
                                        </div>
                                        <div className="w-12 bg-pink-400 rounded-t-lg relative group h-[92%] transition-all hover:opacity-90">
                                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-bold text-gray-600">92%</span>
                                        </div>
                                    </div>

                                    {/* Bar Group 2 */}
                                    <div className="flex gap-2 z-10 items-end h-[92%]">
                                        <div className="w-12 bg-teal-400 rounded-t-lg relative group h-[75%] transition-all hover:opacity-90">
                                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-bold text-gray-600">75%</span>
                                        </div>
                                        <div className="w-12 bg-pink-400 rounded-t-lg relative group h-full transition-all hover:opacity-90">
                                            <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-bold text-gray-600">92%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-around text-sm font-bold text-gray-700 mt-2">
                                    <span>速度</span>
                                    <span>準確率</span>
                                </div>
                            </div>
                        </div>

                        {/* Network Graph Mock */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">小組互動網絡</h3>
                            {/* CSS-based Network Graph Mock */}
                            <div className="flex-1 relative">
                                {/* Center User */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-100 rounded-full border-4 border-white shadow-lg flex items-center justify-center z-20">
                                    <User className="w-8 h-8 text-blue-600" />
                                </div>

                                {/* Orbit Users */}
                                <div className="absolute top-[20%] left-[20%] w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center animate-pulse">
                                    <User className="w-6 h-6 text-pink-500" />
                                </div>
                                <div className="absolute top-[20%] right-[30%] w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-green-500" />
                                </div>
                                <div className="absolute bottom-[30%] right-[20%] w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-orange-500" />
                                </div>
                                <div className="absolute bottom-[20%] left-[30%] w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <User className="w-6 h-6 text-indigo-500" />
                                </div>

                                {/* Connecting Lines (SVG) */}
                                <svg className="absolute inset-0 pointer-events-none z-0 overflow-visible">
                                    <defs>
                                        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                                            <polygon points="0 0, 10 3.5, 0 7" fill="#cbd5e1" />
                                        </marker>
                                        <marker id="arrowhead-active" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                                            <polygon points="0 0, 10 3.5, 0 7" fill="#0ea5e9" />
                                        </marker>
                                    </defs>
                                    <line x1="20%" y1="20%" x2="50%" y2="50%" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrowhead)" />
                                    <line x1="70%" y1="20%" x2="50%" y2="50%" stroke="#0ea5e9" strokeWidth="3" markerEnd="url(#arrowhead-active)" strokeDasharray="5 5" className="animate-pulse" />
                                    <line x1="80%" y1="70%" x2="50%" y2="50%" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrowhead)" />
                                    <line x1="30%" y1="80%" x2="50%" y2="50%" stroke="#0ea5e9" strokeWidth="3" markerEnd="url(#arrowhead-active)" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Row 3: Heatmap */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-[12rem] flex flex-col">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">學習投入歷程</h3>
                        <div className="flex-1 flex flex-col">
                            {/* Time Labels */}
                            <div className="flex text-xs text-gray-400 mb-2 pl-24">
                                <span className="flex-1">5/01</span>
                                <span className="flex-1">5/08</span>
                                <span className="flex-1">5/15</span>
                                <span className="flex-1">5/22</span>
                                <span className="flex-1">5/29</span>
                                <span className="flex-1">10/06</span>
                                <span className="flex-1">10/13</span>
                            </div>

                            {/* Grid */}
                            <div className="flex-1 flex gap-2">
                                <div className="flex flex-col justify-between text-xs text-gray-400 pr-4 font-mono w-20 text-right">
                                    <span>08:00-10:00</span>
                                    <span>10:00-12:00</span>
                                    <span>13:00-15:00</span>
                                    <span>15:00-17:00</span>
                                </div>
                                <div className="flex-1 grid grid-cols-[repeat(50,minmax(0,1fr))] grid-rows-4 gap-1">
                                    {Array.from({ length: 200 }).map((_, i) => {
                                        const intensity = Math.random();
                                        let bgClass = 'bg-gray-100';
                                        if (intensity > 0.85) bgClass = 'bg-teal-700';
                                        else if (intensity > 0.6) bgClass = 'bg-teal-500';
                                        else if (intensity > 0.3) bgClass = 'bg-teal-300';
                                        else if (intensity > 0.1) bgClass = 'bg-teal-100';

                                        return (
                                            <div key={i} className={`rounded-sm ${bgClass} transition-colors hover:ring-2 ring-offset-1 ring-gray-300`} title={`Activity: ${Math.floor(intensity * 100)}%`}></div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: AI Assistant (3 cols) */}
                <div className="col-span-12 lg:col-span-3 h-full">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col overflow-hidden">

                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 pb-4">
                            <h2 className="text-2xl font-bold text-gray-800">學習狀況與建議</h2>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* AI Message */}
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                    <div className="w-full h-full rounded-full overflow-hidden">
                                        {/* Avatar Placeholder */}
                                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="AI" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="text-sm font-bold text-gray-700">親愛的同學</div>
                                    <div className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
                                        親愛的同學，你的運算基礎 (S01, S02) 及運算律應用 (S05, S06) 表現非常優異！
                                        <br /><br />
                                        然而，數據顯示在抽象概念，特別是關於除法性質的理解 (S03, S04, S07) 上稍顯薄弱。
                                        <br /><br />
                                        建議：請回顧除法性質的先備知識單元，並進行針對性的補救練習。我們為你準備了以下個性化學習路徑。
                                    </div>

                                    {/* Action Buttons */}
                                    <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-green-50 rounded-xl border border-gray-200 hover:border-green-200 transition-all text-left group">
                                        <BookOpen className="w-5 h-5 text-green-600 group-hover:scale-110 transition-transform" />
                                        <div className="flex-1">
                                            <div className="font-bold text-gray-800 text-sm">複習：除法性質先備知識</div>
                                        </div>
                                    </button>

                                    <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-red-50 rounded-xl border border-gray-200 hover:border-red-200 transition-all text-left group">
                                        <Target className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                                        <div className="flex-1">
                                            <div className="font-bold text-gray-800 text-sm">練習：抽象概念挑戰題</div>
                                        </div>
                                    </button>

                                    <button className="w-full flex items-center gap-3 p-3 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 transition-all text-left justify-center text-gray-600 font-medium text-sm">
                                        <Search className="w-4 h-4" />
                                        查看詳細診斷報告
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-gray-50 border-t border-gray-100">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    placeholder="對儀表板有疑問？在此輸入問題..."
                                    className="w-full bg-white border border-gray-300 text-gray-700 text-sm rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-shadow"
                                />
                            </div>
                            <button className="w-full mt-3 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2">
                                發送問題
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

