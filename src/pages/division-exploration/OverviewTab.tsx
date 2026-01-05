import {
    Target,
    TrendingUp,
    BrainCircuit,
    AlertCircle,
    Star,
} from 'lucide-react';
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
import { timeData, abilityData, prStats } from './types';

/**
 * OverviewTab - 學習總覽分頁
 */
export function OverviewTab() {
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
