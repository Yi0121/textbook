
import React, { useState } from 'react';
import {
    Brain,
    Users,
    Pencil,
    BarChart3,
    CheckCircle2,
    ChevronRight,
    HelpCircle,
    Send,
    Mic,
    ThumbsUp,
    Play,
    Lightbulb,
    Layout
} from 'lucide-react';

// ----------------------------------------------------------------------
// Types & Constants
// ----------------------------------------------------------------------

type Stage = 'S2' | 'S3' | 'S4' | 'S5' | 'S6';

interface StageConfig {
    id: Stage;
    label: string;
    description: string;
    role?: string;
    color: string;
}

const STAGES: StageConfig[] = [
    { id: 'S2', label: '課前自學', description: '影片與前測', color: 'bg-blue-500' },
    { id: 'S3', label: '個人解題', description: '圓周實測', color: 'bg-blue-600' },
    { id: 'S4', label: '組內共學', description: '協作與共識', role: 'A1 提案者', color: 'bg-orange-500' },
    { id: 'S5', label: '組間互學', description: '發表與互評', role: 'D2 評分員', color: 'bg-green-500' },
    { id: 'S6', label: '總結課後', description: '反思與報告', color: 'bg-purple-500' },
];

// ----------------------------------------------------------------------
// Sub-components
// ----------------------------------------------------------------------

// 1. Top Navigation Bar
const TopBar = ({ currentStage, setStage }: { currentStage: Stage, setStage: (s: Stage) => void }) => {
    const activeStageInfo = STAGES.find(s => s.id === currentStage);

    return (
        <div className="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between shadow-sm z-20">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                        CPS
                    </div>
                    <span className="font-bold text-slate-700 text-lg">圓周長</span>
                </div>

                {/* Progress Stepper */}
                <div className="flex items-center bg-slate-50 rounded-full px-2 py-1 border border-slate-100">
                    {STAGES.map((stage, idx) => {
                        const isActive = stage.id === currentStage;
                        const isPast = STAGES.findIndex(s => s.id === currentStage) > idx;

                        return (
                            <React.Fragment key={stage.id}>
                                <button
                                    onClick={() => setStage(stage.id)}
                                    className={`
                                        flex items - center gap - 2 px - 4 py - 1.5 rounded - full text - sm font - bold transition - all
                                        ${isActive ? `${stage.color} text-white shadow-md` : isPast ? 'text-slate-600 hover:bg-slate-200' : 'text-slate-300'}
`}
                                >
                                    <span>{stage.label}</span>
                                </button>
                                {idx < STAGES.length - 1 && (
                                    <ChevronRight size={14} className="text-slate-300 mx-1" />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* User State / Role */}
            <div className="flex items-center gap-4">
                {activeStageInfo?.role && (
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${activeStageInfo.color} bg-opacity-10 text-${activeStageInfo.color.split('-')[1]}-700 border border-${activeStageInfo.color.split('-')[1]}-200`}>
                        Role: {activeStageInfo.role}
                    </div>
                )}
                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm flex items-center justify-center text-slate-500 font-bold text-xs ring-2 ring-indigo-50">
                    ST
                </div>
            </div>
        </div>
    );
};

// 2. Smart Sidebar
const SmartSidebar = ({ stage }: { stage: Stage }) => {
    return (
        <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shadow-xl z-10">
            {/* AI Assistant Header */}
            <div className="p-4 border-b border-slate-100 flex items-center bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center mr-3">
                        <Brain size={20} className="text-indigo-600" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-800">TeamTutor AI</h3>
                    <p className="text-xs text-slate-500">
                        {stage === 'S2' ? '觀念釐清' :
                            stage === 'S3' ? '蘇格拉底引導' :
                                stage === 'S4' ? '協作引導 & 監測' :
                                    '評分與回饋分析'}
                    </p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {/* Mock AI Message */}
                <div className="flex gap-3">
                    <div className="min-w-[32px] w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mt-1">
                        <Brain size={16} className="text-indigo-600" />
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm text-sm text-slate-700">
                        {stage === 'S3' ? (
                            <div>
                                <p>你在測量圖卡圓周長時，如果分割得越細，量出來的總長度會有什麼變化？</p>
                                <button className="mt-2 flex items-center gap-1 text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition-colors">
                                    <Lightbulb size={12} />
                                    給我提示
                                </button>
                            </div>
                        ) : stage === 'S4' ? (
                            <p>@B同學 提出的「分割越多越接近圓」這個想法很關鍵，大家可以計算一下不同分割數算出來的圓周率是多少。</p>
                        ) : stage === 'S2' ? (
                            <p>如果不用繩子，我們怎麼知道圓的一圈有多長？影片裡用了什麼方法呢？</p>
                        ) : (
                            <p>嗨！我是你的學習助手。關於這個階段有任何問題隨時問我。</p>
                        )}
                    </div>
                </div>

                {/* Mock Student Message */}
                {stage === 'S4' && (
                    <div className="flex gap-3 flex-row-reverse">
                        <div className="min-w-[32px] w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mt-1 text-xs font-bold text-slate-600">
                            Me
                        </div>
                        <div className="bg-indigo-600 p-3 rounded-2xl rounded-tr-none shadow-sm text-sm text-white">
                            我們這組算出來 16 分割的比值大約是 3.13，好像很接近 3.14 了！
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-slate-200 bg-white">
                <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl border border-transparent focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                        <Mic size={16} />
                    </button>
                    <input
                        type="text"
                        placeholder="輸入訊息或是 @呼叫老師..."
                        className="flex-1 bg-transparent text-sm outline-none text-slate-700 placeholder:text-slate-400"
                    />
                    <button className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-colors">
                        <Send size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// Stage Components (Main Stage)
// ----------------------------------------------------------------------

// S2: Pre-class
const StageS2 = () => (
    <div className="w-full h-full bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-[90%] aspect-video bg-black rounded-2xl shadow-2xl flex items-center justify-center relative overflow-hidden group">
            <img
                src="/images/cps-video-example.png"
                alt="Video Thumbnail"
                className="absolute inset-0 w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                <div className="flex items-center justify-between text-white">
                </div>
            </div>
            <Play size={80} className="text-white opacity-90 group-hover:scale-110 transition-transform duration-300 relative z-10 drop-shadow-lg" fill="currentColor" />
        </div>
    </div>
);

// S3: Individual
const StageS3 = () => (
    <div className="flex h-full gap-6 p-6">
        <div className="w-80 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
                <h3 className="font-bold text-slate-800">測量任務</h3>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded mb-2 inline-block">任務說明</span>
                    <p className="text-sm font-bold text-slate-800">
                        1. 測量圖卡直徑 (D)。<br />
                        2. 思考如何利用直線分割方法估算圓周長 (C)。<br />
                        3. 畫出你的分割構想。
                    </p>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <p className="text-sm font-bold text-slate-700 mb-1">直徑測量結果</p>
                    <div className="flex items-center gap-2">
                        <input type="text" className="w-20 border border-slate-300 rounded px-2 py-1 text-sm" placeholder="cm" />
                    </div>
                </div>
            </div>
        </div>
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden flex flex-col">
            {/* Mock Toolbar */}
            <div className="h-12 border-b border-slate-200 flex items-center px-4 gap-2 bg-slate-50">
                <button className="p-2 hover:bg-slate-200 rounded" title="畫筆"><Pencil size={16} className="text-slate-600" /></button>
                <button className="p-2 hover:bg-slate-200 rounded" title="直線工具"><Layout size={16} className="text-slate-600" /></button>
                <div className="w-px h-6 bg-slate-300 mx-2"></div>
                <span className="text-xs text-slate-500 font-bold">個人畫布</span>
            </div>
            {/* Canvas */}
            <div className="flex-1 bg-slate-50 relative flex items-center justify-center overflow-hidden">
                <img
                    src="/images/cps-ggb-rolling.png"
                    alt="GGB Preview"
                    className="w-full h-full object-contain"
                />
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg border border-slate-200 shadow-sm text-xs font-bold text-slate-500">
                    GGB Interactive Area
                </div>
            </div>
        </div>
    </div>
);

// S4: Group Learning
const StageS4 = () => (
    <div className="flex h-full gap-4 p-4 bg-orange-50/30">
        {/* Public Canvas */}
        <div className="flex-[3] bg-white rounded-2xl shadow-lg border border-orange-100 flex flex-col overflow-hidden relative">
            <div className="absolute top-4 left-4 bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-xs font-bold shadow-sm z-10 flex items-center gap-2">
                <Users size={14} />
                小組數據彙整 (Shared)
            </div>
            <div className="flex-1 bg-slate-50 p-8 pt-16 overflow-y-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-100">
                        <tr>
                            <th className="px-4 py-3 rounded-tl-lg">分割數</th>
                            <th className="px-4 py-3">測量總長 (圓周)</th>
                            <th className="px-4 py-3">直徑</th>
                            <th className="px-4 py-3 rounded-tr-lg">圓周 ÷ 直徑 (比值)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        <tr className="border-b border-slate-100">
                            <td className="px-4 py-3 font-bold">8 分割</td>
                            <td className="px-4 py-3">24.5 cm</td>
                            <td className="px-4 py-3">8.0 cm</td>
                            <td className="px-4 py-3 text-red-500 font-bold">3.06</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                            <td className="px-4 py-3 font-bold">16 分割</td>
                            <td className="px-4 py-3">25.0 cm</td>
                            <td className="px-4 py-3">8.0 cm</td>
                            <td className="px-4 py-3 text-orange-500 font-bold">3.125</td>
                        </tr>
                        <tr className="bg-indigo-50/50">
                            <td className="px-4 py-3 font-bold text-indigo-700">32 分割 (預測)</td>
                            <td className="px-4 py-3 font-mono">...</td>
                            <td className="px-4 py-3">8.0 cm</td>
                            <td className="px-4 py-3 font-bold text-green-600">?</td>
                        </tr>
                    </tbody>
                </table>

                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <h4 className="font-bold text-yellow-800 mb-2 text-sm">小組發現</h4>
                    <p className="text-sm text-yellow-700">
                        當分割數越多，我們算出來的比值好像越來越接近一個固定的數字（大約 3.1 左右）。
                    </p>
                </div>
            </div>

            {/* Consensus Button */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-bold shadow-xl shadow-orange-200 hover:scale-105 transition-transform">
                    <ThumbsUp size={18} />
                    確認比值結論 (3/4)
                </button>
            </div>
        </div>

        {/* Personal Draft Area */}
        <div className="flex-[2] flex flex-col gap-4">
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-slate-700 text-sm">我的計算與想法</h4>
                    <button className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2 py-1 rounded transition-colors">發布數據</button>
                </div>
                <textarea className="flex-1 w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-100" placeholder="你算出來的比值是多少？這代表了什麼意義？"></textarea>
            </div>

            {/* Teammates Status */}
            <div className="h-32 bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                <h4 className="font-bold text-slate-700 text-sm mb-3">組員狀態</h4>
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className={`flex-1 rounded-xl flex flex-col items-center justify-center p-2 border ${i === 1 ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100'}`}>
                            <div className={`w-8 h-8 rounded-full mb-1 flex items-center justify-center text-xs font-bold text-white ${['bg-indigo-500', 'bg-pink-500', 'bg-emerald-500', 'bg-amber-500'][i - 1]}`}>
                                {String.fromCharCode(64 + i)}
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold">{i === 1 ? 'You' : (i === 2 ? 'Measuring' : 'Calculat...')}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// S5: Gallery
const StageS5 = () => (
    <div className="flex h-full gap-6 p-6">
        <div className="flex-[3] bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center relative">
            <div className="absolute top-4 right-4 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
            </div>
            <div className="w-full">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-slate-800">第 3 組的發現</h2>
                </div>

                {/* Data Table */}
                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                    <div className="grid grid-cols-4 gap-4 text-sm mb-2 font-bold text-slate-500 border-b border-slate-200 pb-2">
                        <div>分割數</div>
                        <div>測量總長 (圓周)</div>
                        <div>直徑</div>
                        <div className="text-indigo-600">圓周 : 直徑 (比值)</div>
                    </div>
                    <div className="space-y-2">
                        <div className="grid grid-cols-4 gap-4 text-sm items-center bg-white p-3 rounded-lg border border-slate-100">
                            <div className="font-bold text-slate-700">8 分割</div>
                            <div>24.5 cm</div>
                            <div>8.0 cm</div>
                            <div className="text-indigo-600 font-bold">3.06</div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm items-center bg-white p-3 rounded-lg border border-slate-100">
                            <div className="font-bold text-slate-700">16 分割</div>
                            <div>25.0 cm</div>
                            <div>8.0 cm</div>
                            <div className="text-orange-500 font-bold">3.125</div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm items-center bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                            <div className="font-bold text-indigo-700">32 分割 (預測)</div>
                            <div className="text-slate-400">...</div>
                            <div>8.0 cm</div>
                            <div className="text-emerald-500 font-bold">?</div>
                        </div>
                    </div>
                </div>

                {/* Discovery Box */}
                <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
                    <h4 className="font-bold text-amber-800 mb-2 text-sm flex items-center gap-2">
                        <Lightbulb size={16} />
                        小組發現
                    </h4>
                    <p className="text-amber-900 font-medium">
                        當分割數越多，我們算出來的比值好像越來越接近<span className="bg-white px-2 py-0.5 rounded mx-1 text-amber-700 shadow-sm">一個固定的數字 (大約 3.1 左右)</span>。
                    </p>
                </div>
            </div>
        </div>
        <div className="flex-[1.5] bg-white rounded-2xl shadow-lg border border-indigo-100 flex flex-col overflow-hidden">
            <div className="p-4 bg-indigo-600 text-white">
                <h3 className="font-bold flex items-center gap-2"><CheckCircle2 size={18} /> 互評回饋 (Rubric)</h3>
                <p className="text-xs text-indigo-200 mt-1">你的身分: D2 評分員</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">數據精確度 (30%)</label>
                    <input type="range" className="w-full accent-indigo-600" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">推論邏輯 (40%)</label>
                    <input type="range" className="w-full accent-indigo-600" />
                    <p className="text-xs text-slate-500 mt-1">是否有清楚解釋分割數與精確度的關係？</p>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">發表表達 (30%)</label>
                    <input type="range" className="w-full accent-indigo-600" />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">給予回饋</label>
                    <textarea className="w-full h-24 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm" placeholder="我覺得你們的圖表很清楚，但是..."></textarea>
                </div>
            </div>
            <div className="p-4 border-t border-slate-100">
                <button className="w-full py-2.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors">送出評分</button>
            </div>
        </div>
    </div>
);

// S6: Dashboard
const StageS6 = () => (
    <div className="flex h-full p-8 gap-8 items-start justify-center bg-slate-50">
        <div className="w-full max-w-5xl grid grid-cols-3 gap-6">
            {/* Stats Card */}
            <div className="col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <BarChart3 className="text-indigo-600" /> 核心概念掌握
                </h3>
                <div className="aspect-square bg-slate-50 rounded-full border border-slate-100 relative flex items-center justify-center flex-col gap-2">
                    <span className="text-4xl font-bold text-indigo-600">π</span>
                    <span className="text-sm font-bold text-slate-500">圓周率 3.14159...</span>
                </div>
            </div>

            {/* AI Summary */}
            <div className="col-span-2 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl shadow-xl text-white p-8 relative overflow-hidden">
                <Brain size={120} className="absolute -bottom-4 -right-4 text-white opacity-10" />
                <h3 className="text-2xl font-bold mb-4">AI 學習總結</h3>
                <p className="text-indigo-100 leading-relaxed text-lg mb-6">
                    「這一堂課你表現很棒！從一開始的分割構想，到小組合作計算出 3.125 的比值，
                    你已經成功發現了『圓周長與直徑』的固定關係。這個固定的倍數就是我們常說的 3.14 (圓周率)！」
                </p>
                <div className="flex gap-4">
                    <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
                        <span className="block text-xs text-indigo-200 uppercase tracking-wider">實測準確度</span>
                        <span className="block text-2xl font-bold">92%</span>
                    </div>
                    <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg">
                        <span className="block text-xs text-indigo-200 uppercase tracking-wider">小組貢獻</span>
                        <span className="block text-2xl font-bold">Active</span>
                    </div>
                </div>
            </div>

            {/* Final Quiz */}
            <div className="col-span-3 mt-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">概念延伸挑戰</h3>
                    <p className="text-slate-500">如果圓變大兩倍，圓周率會變大嗎？</p>
                </div>
                <button className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-colors flex items-center gap-2">
                    開始挑戰 <ChevronRight size={18} />
                </button>
            </div>
        </div>
    </div>
);

// ----------------------------------------------------------------------
// Main Application
// ----------------------------------------------------------------------

const CPSStudentView = () => {
    const [currentStage, setCurrentStage] = useState<Stage>('S2');

    return (
        <div className="w-full h-screen bg-slate-50 flex flex-col font-sans overflow-hidden">
            {/* 1. Global Top Navigation */}
            <TopBar currentStage={currentStage} setStage={setCurrentStage} />

            {/* 2. Main Workspace Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Main Content Area */}
                <div className="flex-1 relative z-0 transition-all duration-300">
                    {currentStage === 'S2' && <StageS2 />}
                    {currentStage === 'S3' && <StageS3 />}
                    {currentStage === 'S4' && <StageS4 />}
                    {currentStage === 'S5' && <StageS5 />}
                    {currentStage === 'S6' && <StageS6 />}

                    {/* Help Button (Floating) */}
                    {currentStage !== 'S2' && (
                        <button className="absolute bottom-6 left-6 p-3 bg-white border border-red-100 text-red-500 rounded-full shadow-lg hover:bg-red-50 transition-all flex items-center gap-2 group z-50">
                            <HelpCircle size={24} />
                            <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-bold">呼叫老師</span>
                        </button>
                    )}
                </div>

                {/* 3. Global Sidebar */}
                {currentStage !== 'S2' && <SmartSidebar stage={currentStage} />}
            </div>
        </div>
    );
};

export default CPSStudentView;
