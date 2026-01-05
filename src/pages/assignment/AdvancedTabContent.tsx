import { CheckCircle2, BrainCircuit } from 'lucide-react';

export function AdvancedTabContent() {
    return (
        <div className="grid grid-cols-12 gap-6 animate-fade-in">
            {/* Left Column: Solution & Math Context */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
                {/* Solution Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        數學本體 (Teacher Only)
                    </h3>
                    <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 space-y-4">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">設三個連續整數為：</p>
                            <p className="font-mono text-lg font-bold text-gray-800 tracking-wider">x, x+1, x+2</p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 text-sm">總和：</span>
                                <span className="font-mono text-indigo-600 font-bold">x + (x+1) + (x+2) = 48</span>
                            </div>
                            <div className="pl-12 font-mono text-gray-600">3x + 3 = 48</div>
                            <div className="pl-12 font-mono text-gray-600">3x = 45</div>
                            <div className="pl-12 font-mono text-gray-800 font-bold">x = 15</div>
                        </div>

                        <div className="pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500 mb-2">故盒子內有：</p>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg font-bold font-mono">15</span>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg font-bold font-mono">16</span>
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg font-bold font-mono">17</span>
                            </div>
                        </div>
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
    );
}
