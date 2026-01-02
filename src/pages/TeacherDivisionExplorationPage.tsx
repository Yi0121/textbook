import { useState } from 'react';
import {
    Target,
    TrendingUp,
    BrainCircuit,
    ArrowLeft,
    Database,
    AlertCircle,
    Star,
    BookOpen,
    Bot,
    Sparkles,
    Brain,
    FileText,
    Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    Cell
} from 'recharts';

/**
 * TeacherDivisionExplorationPage - 整合版除法探究教師儀表板
 *
 * 結合原本的 Monitor 與 Advanced 頁面，使用 Tab 切換
 */

type ViewTab = 'overview' | 'advanced';

// ==================== Mock Data ====================

const studentInfo = {
    name: '王小明',
    class: '資優班',
    systemTag: '個人化教育計劃 DB',
    taskName: '除法探究第八題'
};

const timeData = [
    { name: '個人平均', duration: 80, label: '1分20秒', color: '#6366f1' },
    { name: '全班平均', duration: 110, label: '1分50秒', color: '#94a3b8' },
];

const abilityData = [
    { subject: '流暢性', individual: 1.1, class: 1.2 },
    { subject: '變通性', individual: 1.53, class: 1.2 },
    { subject: '精密性', individual: 0.83, class: 0.51 },
];

const prStats = [
    { label: '工作記憶廣度 Test', pr: 75, status: 'normal' },
    { label: '變通性前測', pr: 65, status: 'normal' },
    { label: '變通性後測', pr: null, status: 'not-tested' },
];

// ==================== Component ====================

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

// ==================== Overview Tab ====================

function OverviewTab() {
    return (
        <>
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 text-white p-4 rounded-xl shadow-lg flex flex-col items-center">
                    <div className="p-1 bg-white/20 rounded-lg mb-1">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="text-lg font-bold">1m 20s</div>
                    <div className="text-[10px] opacity-90 font-bold">平均時間</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-400 to-emerald-500 text-white p-4 rounded-xl shadow-lg flex flex-col items-center">
                    <TrendingUp className="w-6 h-6 mb-1 opacity-80" />
                    <div className="text-lg font-bold">-30s</div>
                    <div className="text-[10px] opacity-90 font-bold">領先全班</div>
                </div>
                <div className="bg-gradient-to-br from-purple-400 to-pink-500 text-white p-4 rounded-xl shadow-lg flex flex-col items-center">
                    <BrainCircuit className="w-6 h-6 mb-1 opacity-80" />
                    <div className="text-lg font-bold">PR 75</div>
                    <div className="text-[10px] opacity-90 font-bold">工作記憶廣度</div>
                </div>
                <div className="bg-gradient-to-br from-amber-400 to-orange-500 text-white p-4 rounded-xl shadow-lg flex flex-col items-center">
                    <Star className="w-6 h-6 mb-1 opacity-80" />
                    <div className="text-lg font-bold">1.53</div>
                    <div className="text-[10px] opacity-90 font-bold">變通性得分</div>
                </div>
                <div className="bg-gradient-to-br from-cyan-400 to-blue-500 text-white p-4 rounded-xl shadow-lg flex flex-col items-center">
                    <Target className="w-6 h-6 mb-1 opacity-80" />
                    <div className="text-lg font-bold">A+</div>
                    <div className="text-[10px] opacity-90 font-bold">精密性評等</div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Time Analysis Card */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-full -mr-16 -mt-16 z-0"></div>
                    <div className="flex items-center justify-between mb-8 relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 shadow-sm border border-indigo-100">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900">解題時間分析</h3>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Time Comparison</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-64 mt-auto">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={timeData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    width={80}
                                    tick={{ fontSize: 13, fontWeight: 700, fill: '#64748b' }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-xl">
                                                    {payload[0].payload.label}
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="duration" radius={[0, 10, 10, 0]} barSize={40}>
                                    {timeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between mt-6 px-4 py-3 bg-slate-50 rounded-2xl">
                        <div className="text-center flex-1">
                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">個人平均</p>
                            <p className="text-xl font-black text-indigo-600">1m 20s</p>
                        </div>
                        <div className="w-px h-full bg-slate-200"></div>
                        <div className="text-center flex-1">
                            <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">全班平均</p>
                            <p className="text-xl font-black text-slate-500 tracking-tighter">1m 50s</p>
                        </div>
                    </div>
                </div>

                {/* Ability Stats Card */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50/50 rounded-bl-full -mr-16 -mt-16 z-0"></div>
                    <div className="flex items-center gap-3 mb-8 relative z-10">
                        <div className="p-3 rounded-xl bg-purple-50 text-purple-600 shadow-sm border border-purple-100">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">數學創造力能力指標</h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Ability Score Radar</p>
                        </div>
                    </div>

                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={abilityData}>
                                <PolarGrid stroke="#e2e8f0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fontWeight: 700, fill: '#475569' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Radar
                                    name="個人得分"
                                    dataKey="individual"
                                    stroke="#6366f1"
                                    fill="#6366f1"
                                    fillOpacity={0.6}
                                />
                                <Radar
                                    name="全班均值"
                                    dataKey="class"
                                    stroke="#94a3b8"
                                    fill="#94a3b8"
                                    fillOpacity={0.1}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: 600 }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-4">
                        {abilityData.map((item, idx) => {
                            const diff = item.individual - item.class;
                            const isAbove = diff >= 0;
                            const diffAbs = Math.abs(diff).toFixed(2);

                            return (
                                <div key={idx} className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all ${isAbove ? 'bg-emerald-50/30 border-emerald-100' : 'bg-amber-50/30 border-amber-100'}`}>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.subject}</span>

                                    <div className="flex items-baseline gap-1 my-0.5">
                                        <span className={`text-2xl font-black leading-none ${isAbove ? 'text-emerald-600' : 'text-amber-600'}`}>
                                            {item.individual}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400">/ {item.class}</span>
                                    </div>

                                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${isAbove ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {isAbove ? (
                                            <>
                                                <TrendingUp size={10} />
                                                <span>高於平均 {diffAbs}</span>
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle size={10} />
                                                <span>低於平均 {diffAbs}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Section: PR Values & Tests */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {prStats.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center justify-between group hover:border-indigo-200 transition-all hover:-translate-y-1">
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-xl ${item.status === 'not-tested' ? 'bg-red-50 text-red-500 border-2 border-red-100 border-dashed animate-pulse' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shadow-sm'}`}>
                                {item.status === 'not-tested' ? <AlertCircle size={28} /> : <BrainCircuit size={28} />}
                            </div>
                            <div className="max-w-[140px]">
                                <h4 className={`text-sm font-bold leading-tight ${item.status === 'not-tested' ? 'text-red-600' : 'text-slate-700'}`}>
                                    {item.label}
                                </h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Assessment Index</p>
                            </div>
                        </div>

                        <div className="text-right">
                            {item.pr !== null ? (
                                <>
                                    <div className="text-3xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors leading-none mb-1">{item.pr}</div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">PR VALUE</div>
                                </>
                            ) : (
                                <div className="bg-red-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-md shadow-red-100">
                                    未測驗
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

// ==================== Advanced Tab (AI Analysis) ====================

function AdvancedTab() {
    return (
        <>
            {/* Profile Header Card */}
            <div className="bg-white rounded-[2rem] p-5 shadow-sm flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-violet-100/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <div className="flex items-center gap-6 relative z-10">
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

            {/* Radar Analysis Section */}
            <div className="grid grid-cols-2 gap-3">
                {/* Overall Radar */}
                <div className="bg-white rounded-[2.5rem] p-6 shadow-sm flex flex-col h-80">
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

                {/* Detailed Radar */}
                <div className="bg-white rounded-[2.5rem] p-6 shadow-sm flex flex-col h-80">
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

            {/* Learning Evidence Section */}
            <div className="grid grid-cols-2 gap-3">
                {/* Evidence 1 */}
                <div className="bg-white rounded-[2.5rem] p-5 shadow-sm group hover:ring-2 hover:ring-emerald-100 transition-all flex gap-5 h-72">
                    <div className="w-[60%] h-full bg-[#f8fafc] rounded-3xl overflow-hidden relative border border-slate-100 flex items-center justify-center p-0">
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

                {/* Evidence 2 */}
                <div className="bg-white rounded-[2.5rem] p-5 shadow-sm group hover:ring-2 hover:ring-pink-100 transition-all flex gap-5 h-72">
                    <div className="w-[60%] h-full bg-[#f8fafc] rounded-3xl overflow-hidden relative border border-slate-100 flex items-center justify-center p-0">
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
        </>
    );
}
