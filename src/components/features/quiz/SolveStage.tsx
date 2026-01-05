import { useState } from 'react';
import { Sparkles, Pencil, ArrowRight } from 'lucide-react';

interface SolveStageProps {
    onComplete: () => void;
    isGifted: boolean;
}

export function SolveStage({ onComplete, isGifted }: SolveStageProps) {
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
