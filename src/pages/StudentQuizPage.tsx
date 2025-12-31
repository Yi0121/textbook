import { useState } from 'react';
import {
    // ChevronRight, // Removed unused
    Sparkles,
    Pencil,
    CheckCircle2,
    ArrowRight,
    Lightbulb,
    HelpCircle,
    RefreshCcw,
    Calculator,
    MessageSquare
} from 'lucide-react';

// ==================== Types & Mock Data ====================

type Stage = 'solve' | 'pose' | 'explore';

const STAGES = [
    { id: 'solve', title: '挑戰 1：解題', subtitle: '算出正確答案' },
    { id: 'pose', title: '挑戰 2：我是出題者', subtitle: '設計你的題目' },
    { id: 'explore', title: '挑戰 3：開放探索', subtitle: '發現數字的秘密' },
];

// ==================== Components ====================

function StageProgress({ currentStage }: { currentStage: Stage }) {
    const currentIdx = STAGES.findIndex(s => s.id === currentStage);

    return (
        <div className="flex items-center justify-between max-w-2xl mx-auto mb-10 px-4">
            {STAGES.map((stage, idx) => {
                const isActive = idx === currentIdx;
                const isCompleted = idx < currentIdx;

                return (
                    <div key={stage.id} className="flex items-center relative flex-1 last:flex-none">
                        <div className={`
                            relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 
                            transition-all duration-300
                            ${isActive
                                ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-200 scale-110'
                                : isCompleted
                                    ? 'bg-green-100 border-green-500 text-green-600'
                                    : 'bg-white border-gray-200 text-gray-300'
                            }
                        `}>
                            {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-bold">{idx + 1}</span>}
                        </div>

                        <div className={`ml-3 ${isActive ? 'block' : 'hidden lg:block'}`}>
                            <p className={`text-sm font-bold ${isActive ? 'text-purple-700' : 'text-gray-500'}`}>{stage.title}</p>
                            <p className="text-xs text-gray-400">{stage.subtitle}</p>
                        </div>

                        {idx < STAGES.length - 1 && (
                            <div className="absolute top-5 left-10 w-full h-0.5 bg-gray-200 -z-0">
                                <div
                                    className="h-full bg-green-500 transition-all duration-500"
                                    style={{ width: isCompleted ? '100%' : '0%' }}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// -------------------- Stage 1: Solve --------------------
function SolveStage({ onComplete, isGifted }: { onComplete: () => void, isGifted: boolean }) {

    const [answer, setAnswer] = useState('');
    const [canvasMode, setCanvasMode] = useState(false);

    return (
        <div className="max-w-3xl mx-auto animate-fade-in-up">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Question Header */}
                <div className={`p-8 text-white relative overflow-hidden ${isGifted ? 'bg-purple-700' : 'bg-indigo-600'}`}>
                    <div className="relative z-10">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${isGifted ? 'bg-purple-500' : 'bg-indigo-500'}`}>
                            {isGifted ? '核心挑戰題 (進階)' : '今日任務'}
                        </span>
                        {isGifted ? (
                            <>
                                <h2 className="text-3xl font-bold mb-4 leading-tight">
                                    有 <span className="text-yellow-300">48</span> 顆積木，<br />
                                    要放進 <span className="text-yellow-300">3</span> 個盒子。
                                </h2>
                                <div className="text-indigo-100 text-lg space-y-2">
                                    <p>🔹 每個盒子裡的積木數 <strong>不一定要一樣多</strong></p>
                                    <p>🔹 但三個盒子裡的積木數 <strong>必須是連續的三個整數</strong></p>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="text-3xl font-bold mb-4 leading-tight">
                                    商店裡有 <span className="text-yellow-300">24</span> 顆糖果，<br />
                                    要平均分給 <span className="text-yellow-300">4</span> 個小朋友。
                                </h2>
                                <p className="text-indigo-100 text-lg">每個小朋友可以分到幾顆糖果？</p>
                            </>
                        )}
                    </div>
                    <Sparkles className="absolute top-4 right-4 text-white w-24 h-24 opacity-10" />
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white rounded-full opacity-10 blur-3xl" />
                </div>

                {/* Workspace */}
                <div className="p-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-700 flex items-center gap-2">
                            <Pencil className="w-5 h-5 text-indigo-500" />
                            你的計算區
                        </h3>
                        {isGifted && (
                            <div className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full font-bold">
                                ⚠️ 挑戰：試著找出所有可能的分法
                            </div>
                        )}
                        <button
                            onClick={() => setCanvasMode(!canvasMode)}
                            className="text-sm text-gray-500 hover:text-indigo-600 underline"
                        >
                            {canvasMode ? '切換回文字模式' : '切換到畫布模式'}
                        </button>
                    </div>

                    <div className="border-2 border-dashed border-gray-200 rounded-2xl min-h-[300px] p-4 bg-gray-50 relative">
                        {canvasMode ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                                <Pencil className="w-10 h-10 opacity-50" />
                                <p>畫布功能開發中...</p>
                            </div>
                        ) : (
                            <div className="relative w-full h-full min-h-[280px]">
                                {isGifted ? (
                                    <div className="w-full h-full bg-white rounded-xl overflow-hidden shadow-inner">
                                        <img
                                            src="/images/student_handwriting.jpg"
                                            alt="Student Calculation"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                ) : (
                                    <textarea
                                        className="w-full h-full bg-transparent resize-none focus:outline-none text-lg text-gray-700 p-2"
                                        placeholder="在這裡寫下你的算式或想法..."
                                        value={answer}
                                        onChange={(e) => setAnswer(e.target.value)}
                                    />
                                )}
                            </div>
                        )}

                        {/* Final Answer Input - Only for Basic Mode */}
                        {!isGifted && (
                            <div className="absolute bottom-4 right-4 bg-white p-3 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3">
                                <span className="font-bold text-gray-600">答：</span>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        className="w-16 h-10 border-b-2 border-indigo-200 focus:border-indigo-600 text-center font-bold text-xl outline-none transition-colors"
                                        placeholder="?"
                                    />
                                    <span className="text-gray-500">顆</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Bar */}
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={onComplete}
                            className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 active:scale-95 ${isGifted ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}
                        >
                            <span>提交答案</span>
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// -------------------- Stage 2: Problem Posing --------------------
function PoseStage({ onComplete, isGifted }: { onComplete: () => void, isGifted: boolean }) {
    const [problem, setProblem] = useState('');

    return (
        <div className="max-w-3xl mx-auto animate-fade-in-up">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <div className="mb-8 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${isGifted ? 'bg-amber-100 text-amber-600' : 'bg-purple-100 text-purple-600'}`}>
                        <Lightbulb className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">現在換你當老師！</h2>
                    <p className="text-gray-500">
                        {isGifted ? "如果我們把積木總數換掉..." : "請設計一題「答案是 6」的題目考考同學。"}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Constraints Card */}
                    <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
                        <h3 className="font-bold text-amber-800 mb-4 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" />
                            {isGifted ? "思考引導" : "出題條件"}
                        </h3>
                        <ul className="space-y-3 text-amber-900">
                            {isGifted ? (
                                <>
                                    <li className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-white border-2 border-amber-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                                        <span>如果把 48 改成 60，還找得到連續三個整數嗎？</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-white border-2 border-amber-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                                        <span>什麼樣的數字，一定「找得到」答案？</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-white border-2 border-amber-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                                        <span>試著出一題「你可以秒解，但別人要想很久」的題目。</span>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-white border-2 border-amber-300 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                                        <span>一定要用到「除法」</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-white border-2 border-amber-300 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                                        <span>數字不可以和老師的一樣 (24, 4)</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-full bg-white border-2 border-amber-300 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                                        <span>題目要能讓別人用「至少兩種方法」來算</span>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Example Card */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                        <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                            <HelpCircle className="w-5 h-5" />
                            {isGifted ? "範例思路" : "舉例來說..."}
                        </h3>
                        <div className="space-y-3">
                            {isGifted ? (
                                <>
                                    <div className="p-3 bg-white rounded-lg text-sm text-gray-600 border border-gray-200">
                                        「因為 48 ÷ 3 = 16，所以中間是 16...」
                                    </div>
                                    <div className="p-3 bg-white rounded-lg text-sm text-gray-600 border border-gray-200">
                                        「那如果是 75 顆呢？ 75 ÷ 3 = 25...」
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="p-3 bg-white rounded-lg text-sm text-gray-600 border border-gray-200">
                                        18 顆餅乾分給 3 人...
                                    </div>
                                    <div className="p-3 bg-white rounded-lg text-sm text-gray-600 border border-gray-200">
                                        30 本書放進 5 個箱子...
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            {isGifted ? "你的發現 / 題目" : "你的題目"}
                        </label>
                        <textarea
                            value={problem}
                            onChange={(e) => setProblem(e.target.value)}
                            className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-50 transition-all text-lg resize-none"
                            placeholder={isGifted ? "例如：我發現只要數字是 3 的倍數..." : "請輸入你的題目..."}
                        />
                    </div>

                    <button
                        onClick={onComplete}
                        className={`w-full text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.99] ${isGifted ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-200'}`}
                    >
                        發布題目
                    </button>
                </div>
            </div>
        </div>
    );
}

// -------------------- Stage 3: Open Explore --------------------
function ExploreStage({ onComplete, isGifted }: { onComplete: () => void, isGifted: boolean }) {
    const [magicNumber, setMagicNumber] = useState<number | ''>('');

    return (
        <div className="max-w-3xl mx-auto animate-fade-in-up">
            <div className={`rounded-3xl shadow-xl overflow-hidden text-white relative ${isGifted ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-indigo-900 to-purple-900'}`}>
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10">
                    <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-4 border-white/30" />
                    <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-white blur-[100px]" />
                </div>

                <div className="relative z-10 p-10 text-center">
                    <h2 className="text-3xl font-bold mb-6 flex items-center justify-center gap-3">
                        <Sparkles className="w-8 h-8 text-yellow-300" />
                        {isGifted ? "終極挑戰：五個盒子" : "開放式探究：魔術數字"}
                    </h2>

                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20 text-left">
                        {isGifted ? (
                            <p className="text-lg leading-relaxed mb-6">
                                如果不是 3 個盒子，而是 <span className="font-bold text-yellow-300 text-2xl">5</span> 個盒子呢？
                                <br /><br />
                                🔹 每個盒子裡還是「連續整數」
                                <br />
                                🔹 請找出一個可以剛好放完的總數
                            </p>
                        ) : (
                            <p className="text-lg leading-relaxed mb-6">
                                有一些糖果，要平均分給 <span className="font-bold text-yellow-300">4</span> 個小朋友。
                                <br /><br />
                                🔹 每個小朋友分到的糖果數要是「整數」
                                <br />
                                🔹 你可以自己決定一共有幾顆糖果
                            </p>
                        )}
                        <hr className="border-white/20 mb-6" />
                        <p className="text-sm opacity-80 mb-2">
                            {isGifted ? "你的測試與發現：" : "請寫出你的糖果總數："}
                        </p>

                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                value={magicNumber}
                                onChange={(e) => setMagicNumber(Number(e.target.value))}
                                className="w-32 h-16 bg-white/20 border-2 border-white/30 rounded-xl text-center text-3xl font-bold text-white placeholder-white/30 focus:border-yellow-300 outline-none transition-all"
                                placeholder="?"
                            />
                            <ArrowRight className="w-6 h-6 opacity-50" />
                            <div className="h-16 flex items-center px-6 bg-white/10 rounded-xl border border-white/10 text-xl font-mono">
                                {isGifted ? (
                                    magicNumber ? (
                                        (Number(magicNumber) / 5) % 1 === 0 ? `${Number(magicNumber) / 5 - 2},...` : '不能整除'
                                    ) : '...'
                                ) : (
                                    magicNumber ? `${magicNumber} ÷ 4 = ${Number(magicNumber) / 4}` : '...'
                                )}
                            </div>
                        </div>

                        {magicNumber && (Number(magicNumber) % (isGifted ? 5 : 4)) !== 0 && (
                            <div className="mt-4 text-red-300 bg-red-900/30 p-3 rounded-lg text-sm flex items-center gap-2">
                                <HelpCircle className="w-4 h-4" />
                                {isGifted ? "這個數字好像不能放進 5 個連續整數盒子裡喔！（提示：找找看為什麼？）" : "哎呀，好像不能整除！每個小朋友會拿到碎掉的糖果喔！"}
                            </div>
                        )}

                        {magicNumber && (Number(magicNumber) % (isGifted ? 5 : 4)) === 0 && (
                            <div className="mt-4 text-green-300 bg-green-900/30 p-3 rounded-lg text-sm flex items-center gap-2 animate-pulse">
                                <CheckCircle2 className="w-4 h-4" />
                                {isGifted ? `太棒了！中間數是 ${Number(magicNumber) / 5}！` : "太棒了！這個數字可以平分！"}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button
                            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl border border-white/30 transition-all flex items-center gap-2"
                            onClick={() => setMagicNumber('')}
                        >
                            <RefreshCcw className="w-4 h-4" />
                            重來一次
                        </button>
                        <button
                            onClick={onComplete}
                            className="bg-yellow-400 hover:bg-yellow-300 text-indigo-900 px-8 py-3 rounded-xl font-bold shadow-lg shadow-yellow-900/20 transition-all transform active:scale-95"
                        >
                            發現秘密了！
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-gray-500 text-sm">
                    {isGifted ? "想一想：是不是一定跟 5 有關？如果是 7 個盒子呢？" : "還有其他可能的數字嗎？ 8, 12, 16, 20... 它們有什麼共同點？"}
                </p>
            </div>
        </div>
    );
}

// -------------------- Main Page --------------------
export default function StudentQuizPage() {
    const [currentStage, setCurrentStage] = useState<Stage>('solve');
    const [isGifted, setIsGifted] = useState(false);

    const handleNextStage = () => {
        if (currentStage === 'solve') setCurrentStage('pose');
        else if (currentStage === 'pose') setCurrentStage('explore');
    };

    return (
        <div className="min-h-screen bg-indigo-50/30 dark:bg-gray-900 p-4 md:p-8 font-sans">
            {/* Top Bar */}
            <header className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 text-white rounded-lg">
                        <Calculator className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white">數學冒險任務</h1>
                        <p className="text-xs text-gray-500">Unit: Division & Creativity</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Gifted Toggle */}
                    <button
                        onClick={() => setIsGifted(!isGifted)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${isGifted
                            ? 'bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200'
                            : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                            }`}
                    >
                        <Sparkles className={`w-3 h-3 ${isGifted ? 'fill-purple-700' : ''}`} />
                        {isGifted ? '資優挑戰模式 ON' : '切換挑戰模式'}
                    </button>

                    <div className="flex gap-2">
                        <button className="p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-indigo-600">
                            <MessageSquare className="w-5 h-5" />
                        </button>
                        <button className="p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-indigo-600">
                            <HelpCircle className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Progress Visualization */}
            <StageProgress currentStage={currentStage} />

            {/* Active Stage Content */}
            <div className="pb-20">
                {currentStage === 'solve' && <SolveStage onComplete={handleNextStage} isGifted={isGifted} />}
                {currentStage === 'pose' && <PoseStage onComplete={handleNextStage} isGifted={isGifted} />}
                {currentStage === 'explore' && <ExploreStage onComplete={() => alert('恭喜完成所有挑戰！')} isGifted={isGifted} />}
            </div>
        </div>
    );
}
