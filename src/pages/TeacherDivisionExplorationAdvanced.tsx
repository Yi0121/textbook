

import {
    ArrowLeft,
    Bot,
    Sparkles,
    TrendingUp,
    Brain,
    FileText,
    Target,
    Activity,
    BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TeacherDivisionExplorationAdvanced = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#F5F7FB] p-4 font-sans text-slate-600 overflow-hidden">
            <div className="max-w-[1600px] mx-auto space-y-3">

                {/* 1. New Profile Header Card - Vibrant & Colorful */}
                <div className="bg-white rounded-[2rem] p-5 shadow-sm flex items-center justify-between relative overflow-hidden">
                    {/* Decorative Background Blur */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-violet-100/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                    <div className="flex items-center gap-6 relative z-10">
                        {/* Avatar */}
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200 border-4 border-white">
                            <span className="text-2xl font-bold text-white">王</span>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-black text-slate-800 tracking-tight">王小明</h1>
                                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-bold ring-1 ring-amber-200">
                                    資優生
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
                                <BookOpen className="w-4 h-4 text-violet-400" />
                                <span>單元：除法探究第八題</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 relative z-10">

                        {/* Colorful Stat Pills */}
                        <div className="flex gap-4">
                            <div className="text-center px-4 py-2 bg-pink-50 rounded-2xl ring-1 ring-pink-100 min-w-[100px]">
                                <div className="text-xl font-black text-pink-500 leading-none">PR 92</div>
                                <div className="text-[10px] font-bold text-pink-300 uppercase mt-1">Class Rank</div>
                            </div>
                            <div className="text-center px-4 py-2 bg-orange-50 rounded-2xl ring-1 ring-orange-100 min-w-[100px]">
                                <div className="text-xl font-black text-orange-500 leading-none">A+</div>
                                <div className="text-[10px] font-bold text-orange-300 uppercase mt-1">Score</div>
                            </div>
                        </div>

                        <div className="h-10 w-px bg-slate-100 mx-2"></div>

                        <div className="flex gap-2">
                            <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-50 hover:text-violet-600 transition-colors shadow-sm">
                                <ArrowLeft size={20} />
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors text-sm shadow-sm">
                                <FileText size={16} />
                                匯出
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-violet-200 hover:brightness-110 transition-all text-sm">
                                <Sparkles size={16} />
                                AI 輔導
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. Radar Analysis Section - Fixed Layout (Header Top, Content Split) */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Overall Radar - Purple Theme */}
                    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm flex flex-col h-80">
                        {/* Header Row */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-violet-100 rounded-2xl text-violet-600 shadow-sm">
                                <Activity size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 leading-tight">SRL 互動表現</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">COMPETENCY</p>
                            </div>
                            <div className="ml-auto bg-violet-50 px-3 py-1 rounded-full text-xs font-bold text-violet-600 ring-1 ring-violet-100">PR 92</div>
                        </div>

                        {/* Content Row */}
                        <div className="flex flex-1 gap-4 min-h-0">
                            <div className="relative flex-1 bg-slate-50/50 rounded-3xl overflow-hidden flex items-center justify-center p-2 border border-slate-100">
                                <img
                                    src="/images/教師DB雷達圖整體.png"
                                    alt="整體素養分佈雷達圖"
                                    className="w-full h-full object-contain mix-blend-multiply"
                                />
                            </div>
                            <div className="w-[35%] flex flex-col bg-violet-50/40 rounded-3xl p-4 border border-violet-100/50">
                                <h4 className="flex items-center gap-2 text-xs font-bold text-violet-800 mb-2">
                                    <Bot size={16} className="text-violet-600" />
                                    AI 診斷
                                </h4>
                                <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                                    <p className="text-sm text-violet-700 leading-relaxed font-medium mb-3">
                                        王同學在<span className="bg-white px-1 rounded text-violet-800 font-black shadow-sm mx-1">高層次對話</span>方面表現極為突出。
                                    </p>
                                </div>
                                <div className="mt-auto pt-3 border-t border-violet-200/50">
                                    <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest block mb-1">STRATEGY</span>
                                    <p className="text-xs text-violet-600 leading-relaxed font-semibold">
                                        建議提供高階代數證明題型。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Detailed Radar - Blue Theme */}
                    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm flex flex-col h-80">
                        {/* Header Row */}
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-blue-100 rounded-2xl text-blue-600 shadow-sm">
                                <Target size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 leading-tight">細部能力指標</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">METRICS</p>
                            </div>
                            <div className="ml-auto bg-blue-50 px-3 py-1 rounded-full text-xs font-bold text-blue-600 ring-1 ring-blue-100">精熟級</div>
                        </div>

                        {/* Content Row */}
                        <div className="flex flex-1 gap-4 min-h-0">
                            <div className="relative flex-1 bg-slate-50/50 rounded-3xl overflow-hidden flex items-center justify-center p-2 border border-slate-100">
                                <img
                                    src="/images/教師DB雷達圖詳細.png"
                                    alt="細部能力指標雷達圖"
                                    className="w-full h-full object-contain mix-blend-multiply"
                                />
                            </div>
                            <div className="w-[35%] flex flex-col bg-blue-50/40 rounded-3xl p-4 border border-blue-100/50">
                                <h4 className="flex items-center gap-2 text-xs font-bold text-blue-800 mb-2">
                                    <Bot size={16} className="text-blue-600" />
                                    AI 診斷
                                </h4>
                                <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                                    <p className="text-sm text-blue-700 leading-relaxed font-medium mb-3">
                                        在<span className="bg-white px-1 rounded text-blue-800 font-black shadow-sm mx-1">後設認知能力</span>表現較好，策略靈活。
                                    </p>
                                </div>
                                <div className="mt-auto pt-3 border-t border-blue-200/50">
                                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">NOTICE</span>
                                    <p className="text-xs text-blue-600 leading-relaxed font-semibold">
                                        依層次對話與解題策略分析，多元評估。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Learning Evidence Section - Less Padding for Larger Images */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Evidence 1 - Emerald/Green Theme */}
                    <div className="bg-white rounded-[2.5rem] p-5 shadow-sm group hover:ring-2 hover:ring-emerald-100 transition-all flex gap-5 h-72">
                        <div className="w-[60%] h-full bg-[#f8fafc] rounded-3xl overflow-hidden relative border border-slate-100 flex items-center justify-center p-0">
                            {/* p-0 to maximize image size */}
                            <img
                                src="/images/資優生LPA.png"
                                alt="原始解題紀錄"
                                className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="flex-1 flex flex-col py-2 justify-center">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl shadow-sm shrink-0">
                                    <TrendingUp size={18} />
                                </div>
                                <span className="text-[10px] font-black text-emerald-300 uppercase tracking-widest">Growth</span>
                            </div>
                            <h3 className="text-base font-bold text-slate-800 mb-2 leading-tight">解題歷程分類</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                與 80% 同學相同，會改變策略解題能減少犯錯，提高效率。
                            </p>
                        </div>
                    </div>

                    {/* Evidence 2 - Pink/Rose Theme */}
                    <div className="bg-white rounded-[2.5rem] p-5 shadow-sm group hover:ring-2 hover:ring-pink-100 transition-all flex gap-5 h-72">
                        <div className="w-[60%] h-full bg-[#f8fafc] rounded-3xl overflow-hidden relative border border-slate-100 flex items-center justify-center p-0">
                            {/* p-0 to maximize image size */}
                            <img
                                src="/images/資優生解題序列.jpg"
                                alt="概念運用分析"
                                className="w-full h-full object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <div className="flex-1 flex flex-col py-2 justify-center">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-pink-100 text-pink-600 rounded-xl shadow-sm shrink-0">
                                    <Brain size={18} />
                                </div>
                                <span className="text-[10px] font-black text-pink-300 uppercase tracking-widest">Logic</span>
                            </div>
                            <h3 className="text-base font-bold text-slate-800 mb-2 leading-tight">解題策略分析</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                解題時間短，會利用交換率減少計算的複雜度。
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TeacherDivisionExplorationAdvanced;
