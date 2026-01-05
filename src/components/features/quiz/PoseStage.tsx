import { useState } from 'react';
import { Lightbulb, CheckCircle2, HelpCircle } from 'lucide-react';

interface PoseStageProps {
    onComplete: () => void;
    isGifted: boolean;
}

export function PoseStage({ onComplete, isGifted }: PoseStageProps) {
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
