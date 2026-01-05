import { BrainCircuit, Lightbulb, CheckCircle2, HelpCircle, Sparkles } from 'lucide-react';
import { StatCard, MethodCard } from './Cards';
import { METHODOLOGIES, STUDENT_STATS } from './types';

export function BasicTabContent() {
    return (
        <div className="grid grid-cols-12 gap-6">
            {/* Left Column: Stats & Monitoring */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                        label="已繳交學生"
                        value={`${STUDENT_STATS.submitted} / ${STUDENT_STATS.total}`}
                        subtext="85% 繳交率"
                        icon={CheckCircle2}
                        color="bg-indigo-100 text-indigo-600"
                    />
                    <StatCard
                        label="使用多元解法"
                        value="8"
                        subtext="29% 學生使用非標準解法"
                        icon={Sparkles}
                        color="bg-amber-100 text-amber-600"
                    />
                    <StatCard
                        label="待協助"
                        value="4"
                        subtext="卡在擬題階段"
                        icon={HelpCircle}
                        color="bg-rose-100 text-rose-600"
                    />
                </div>

                {/* AI Insight Panel */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                            <BrainCircuit className="w-5 h-5 text-indigo-600" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800 dark:text-white">AI 即時學情分析</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Distribution Chart */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">解題策略分佈</h3>
                            <div className="space-y-3">
                                {STUDENT_STATS.methodDistribution.map((stat) => {
                                    const method = METHODOLOGIES.find(m => m.id === stat.id);
                                    return (
                                        <div key={stat.id} className="relative group">
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="font-medium text-gray-700">{method?.title.split('：')[1]}</span>
                                                <span className="text-gray-500">{stat.count} 人 ({stat.percent}%)</span>
                                            </div>
                                            <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-500 ${method?.color.split(' ')[0].replace('bg-', 'bg-')}`}
                                                    style={{ width: `${stat.percent}%`, backgroundColor: 'currentColor' }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        {/* AI Recommendations */}
                        <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100">
                            <h3 className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2">
                                <Lightbulb className="w-4 h-4" />
                                數學變通性教學建議
                            </h3>
                            <ul className="space-y-3">
                                <li className="text-sm text-gray-700 flex gap-2">
                                    <span className="text-indigo-500 font-bold">•</span>
                                    <span>
                                        <strong>小明 (拆解法)</strong> 和 <strong>小華 (重複減法)</strong> 的解法很有代表性，建議邀請他們上台對比分享。
                                    </span>
                                </li>
                                <li className="text-sm text-gray-700 flex gap-2">
                                    <span className="text-indigo-500 font-bold">•</span>
                                    <span>
                                        大部分學生仍習慣使用<strong>標準除法</strong>，可以引導他們思考：「如果不背九九乘法表，還可以怎麼分？」
                                    </span>
                                </li>
                            </ul>
                            <button className="mt-4 w-full py-2 bg-white text-indigo-600 text-sm font-medium rounded-lg border border-indigo-200 hover:bg-white/80 transition-colors shadow-sm">
                                產生引導語句
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Teaching Support */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col">
                    <div className="p-5 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <BrainCircuit className="w-5 h-5 text-indigo-500" />
                            一題多解範例
                        </h2>
                    </div>
                    <div className="p-5 flex-1 overflow-y-auto space-y-4 max-h-[600px] custom-scrollbar">
                        {METHODOLOGIES.map((method) => (
                            <MethodCard key={method.id} method={method} />
                        ))}
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 rounded-b-2xl">
                        <div className="text-xs text-gray-500 mb-2 font-medium">關鍵提問引導：</div>
                        <div className="space-y-2">
                            <div className="bg-white p-3 rounded-lg border border-gray-200 text-sm text-gray-600 shadow-sm">
                                「哪一種算起來最不容易錯？」
                            </div>
                            <div className="bg-white p-3 rounded-lg border border-gray-200 text-sm text-gray-600 shadow-sm">
                                「哪一種你覺得最聰明？」
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
