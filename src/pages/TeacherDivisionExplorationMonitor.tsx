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
    ArrowRight
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
 * TeacherDivisionExplorationMonitor - Dashboard for monitoring student's division exploration task.
 * Matches the style of TeacherStudentOverviewPage.
 */

const TeacherDivisionExplorationMonitor = () => {
    const navigate = useNavigate();

    // 1. 學生與班級背景數據
    const studentInfo = {
        name: '王小明',
        class: '資優班',
        systemTag: '個人化教育計劃 DB',
        taskName: '除法探究第八題'
    };

    // 2. 解題時間分析數據
    const timeData = [
        { name: '個人平均', duration: 80, label: '1分20秒', color: '#6366f1' },
        { name: '全班平均', duration: 110, label: '1分50秒', color: '#94a3b8' },
    ];

    // 3. 能力指標得分數據
    const abilityData = [
        { subject: '流暢性', individual: 1.1, class: 1.2 },
        { subject: '變通性', individual: 1.53, class: 1.2 },
        { subject: '精密性', individual: 0.83, class: 0.51 },
    ];

    // 4. 測驗解析與 PR 值
    const prStats = [
        { label: '工作記憶廣度 Test', pr: 75, status: 'normal' },
        { label: '變通性前測', pr: 65, status: 'normal' },
        { label: '變通性後測', pr: null, status: 'not-tested' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 font-sans text-slate-900">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* Header Section (Matching Overview Page Style) */}
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                    <button
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-6 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        返回班級總覽
                    </button>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            {/* Avatar with progress ring pattern */}
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
                                    <h3 className="font-bold text-lg text-gray-900">除法探究第八題解題時間分析</h3>
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
                                <h3 className="font-bold text-lg text-gray-900">除法探究第八題 各項數學創造力能力指標得分</h3>
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
                                const diffAbs = Math.abs(diff).toFixed(2); // e.g., 0.10 or 0.33

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

                {/* Footer Insight - Navigation to Advanced Dashboard */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/teacher/division-exploration-advanced')}
                        className="w-full bg-indigo-600 p-8 rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-between group hover:bg-indigo-700 transition-all transform hover:-translate-y-1"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                <Bot size={32} className="text-white" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-bold text-white mb-2">前往更詳細的 AI 分析儀表板</h3>
                                <p className="text-indigo-100 font-medium">
                                    查看完整的學習特徵診斷、差異化教學策略與學生專屬學習路徑建議。
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm group-hover:bg-indigo-50 transition-colors shadow-lg">
                            <span>立即查看</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </button>
                </div>

            </div>
        </div>
    );
};

export default TeacherDivisionExplorationMonitor;
