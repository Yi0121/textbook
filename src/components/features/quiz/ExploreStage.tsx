import { useState } from 'react';
import { Sparkles, ArrowRight, HelpCircle, CheckCircle2, RefreshCcw } from 'lucide-react';

interface ExploreStageProps {
    onComplete: () => void;
    isGifted: boolean;
}

export function ExploreStage({ onComplete, isGifted }: ExploreStageProps) {
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
