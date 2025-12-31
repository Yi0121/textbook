import { useState, useEffect } from 'react';
import {
    BrainCircuit,
    Lightbulb,
    Users,
    ChevronRight,
    CheckCircle2,
    HelpCircle,
    Sparkles,
    LayoutDashboard
} from 'lucide-react';

// ==================== Mock Data ====================

const METHODOLOGIES = [
    {
        id: 'standard',
        title: '解法 1：標準除法 (低創造門檻)',
        description: '24 ÷ 4 = 6',
        features: ['程序正確，但思考單一路徑'],
        suitableFor: 'Action 階段學生',
        color: 'bg-blue-50 border-blue-200 text-blue-700',
        icon: <div className="text-xl font-mono font-bold">÷</div>
    },
    {
        id: 'subtraction',
        title: '解法 2：重複減法',
        description: '24 − 4 − 4... = 0 (減6次)',
        features: ['除法本質是重複減法', '連結概念：乘除互逆', '能「轉換表徵」'],
        suitableFor: '強化觀念',
        color: 'bg-green-50 border-green-200 text-green-700',
        icon: <div className="text-xl font-mono font-bold">−</div>
    },
    {
        id: 'multiplication',
        title: '解法 3：乘法反推',
        description: '4 × 6 = 24',
        features: ['強化乘除關係'],
        suitableFor: 'Process → Object 過渡',
        color: 'bg-purple-50 border-purple-200 text-purple-700',
        icon: <div className="text-xl font-mono font-bold">×</div>
    },
    {
        id: 'decomposition',
        title: '解法 4：先拆再分 (高價值)',
        description: '24 = 20 + 4',
        features: ['策略：數字拆解 + 分別運算', '創造力重要指標'],
        suitableFor: '高階思考',
        color: 'bg-amber-50 border-amber-200 text-amber-700',
        icon: <Sparkles className="w-5 h-5" />
    },
    {
        id: 'grouping',
        title: '解法 5：等量分組 (圖像/心算)',
        description: '先給2顆...再給4顆...',
        features: ['不靠公式，靠策略', '非常適合國小學生'],
        suitableFor: '直觀思考',
        color: 'bg-rose-50 border-rose-200 text-rose-700',
        icon: <Users className="w-5 h-5" />
    }
];

const STUDENT_STATS = {
    total: 28,
    submitted: 24,
    methodDistribution: [
        { id: 'standard', count: 10, percent: 42 },
        { id: 'subtraction', count: 5, percent: 21 },
        { id: 'multiplication', count: 6, percent: 25 },
        { id: 'decomposition', count: 2, percent: 8 },
        { id: 'grouping', count: 1, percent: 4 },
    ]
};

// ==================== Components ====================

interface StatCardProps {
    label: string;
    value: string | number;
    subtext?: string;
    icon: React.ElementType;
    color: string;
}

function StatCard({ label, value, subtext, icon: Icon, color }: StatCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{value}</h3>
                    {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
                </div>
                <div className={`p-2 rounded-lg ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
        </div>
    );
}

function MethodCard({ method }: { method: typeof METHODOLOGIES[0] }) {
    return (
        <div className={`p-4 rounded-xl border ${method.color} transition-all hover:shadow-md cursor-pointer`}>
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                    {method.icon}
                </div>
                <h4 className="font-bold text-sm">{method.title}</h4>
            </div>
            <div className="mb-3 text-lg font-mono bg-white/50 p-2 rounded text-center">
                {method.description}
            </div>
            <ul className="space-y-1">
                {method.features.map((feature, idx) => (
                    <li key={idx} className="text-xs flex items-center gap-1.5 opacity-80">
                        <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                        {feature}
                    </li>
                ))}
            </ul>
        </div>
    );
}

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
            {activeTab === 'basic' ? (
                /* ==================== BASIC TAB CONTENT ==================== */
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
            ) : (
                /* ==================== ADVANCED TAB CONTENT ==================== */
                <div className="grid grid-cols-12 gap-6 animate-fade-in">
                    {/* Left Column: Solution & Math Context */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        {/* Solution Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                                數學本體 (Teacher Only)
                            </h3>
                            <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                                <img
                                    src="/images/handwritten_solution.png"
                                    alt="Handwritten solution"
                                    className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity"
                                />
                            </div>
                        </div>


                    </div>

                    {/* Right Column: APOS x Creativity Matrix */}
                    <div className="col-span-12 lg:col-span-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                                    <BrainCircuit className="w-5 h-5 text-purple-600" />
                                    APOS × 創造力三模式「對應分析表」
                                </h2>
                                <p className="text-xs text-gray-500 mt-1">此表為本題最有研究價值之處，協助教師分辨學生思考層次。</p>
                            </div>

                            <div className="p-6 grid gap-6">
                                {/* Stage 1: Action */}
                                <div className="flex gap-4 p-4 rounded-xl border-l-4 border-blue-500 bg-blue-50/30">
                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shrink-0 font-bold text-blue-600">01</div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                                            Action 行動
                                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">Multiple Solution Tasks 一題多解</span>
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-2">學生行為：嘗試「猜數字」或「不同的加法組合」</p>
                                        <div className="text-xs font-mono text-gray-500 bg-white p-2 rounded border border-blue-100 w-fit">
                                            14,15,16 → 45 ❌ <br />
                                            15,16,17 → 48 ✅
                                        </div>
                                    </div>
                                </div>

                                {/* Stage 2: Process */}
                                <div className="flex gap-4 p-4 rounded-xl border-l-4 border-green-500 bg-green-50/30">
                                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0 font-bold text-green-600">02</div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                                            Process 過程
                                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">Multiple Solution Tasks 策略轉換</span>
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-2">發現規律：三個連續整數和 = 中間數 × 3</p>
                                        <div className="text-xs font-mono text-gray-500 bg-white p-2 rounded border border-green-100 w-fit">
                                            48 ÷ 3 = 16 (中間數) <br />
                                            → 15, 16, 17
                                        </div>
                                    </div>
                                </div>

                                {/* Stage 3: Object */}
                                <div className="flex gap-4 p-4 rounded-xl border-l-4 border-amber-500 bg-amber-50/30">
                                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0 font-bold text-amber-600">03</div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                                            Object 物件
                                            <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">Problem Posing 擬題</span>
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-2">教師提問：「如果總數變了，什麼情況下一定找得到？」</p>
                                        <div className="text-xs font-mono text-gray-500 bg-white p-2 rounded border border-amber-100 w-fit">
                                            只要：總數 ÷ 3 = 整數，就可以反推 <br />
                                            60 顆 → 19, 20, 21
                                        </div>
                                    </div>
                                </div>

                                {/* Stage 4: Schema */}
                                <div className="flex gap-4 p-4 rounded-xl border-l-4 border-purple-500 bg-purple-50/30">
                                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0 font-bold text-purple-600">04</div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                                            Schema 基模
                                            <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">Open-ended Inquiry 開放式探究</span>
                                        </h4>
                                        <p className="text-sm text-gray-600 mb-2">遷移延伸：「如果是 5 個盒子，每個盒子還是連續整數？」</p>
                                        <div className="text-xs font-mono text-gray-500 bg-white p-2 rounded border border-purple-100 w-fit">
                                            設：x, x+1, x+2, x+3, x+4 → 5x + 10 <br />
                                            學生思考：「是否一定跟 5 有關？」
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
