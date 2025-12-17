// components/features/dashboard/AIQuizTab.tsx
import { useState } from 'react';
import { Sparkles, CheckCircle, RefreshCw } from 'lucide-react';

const QUIZ_QUESTIONS = [
    {
        question: '粒線體內膜向內摺疊形成的結構稱為什麼？',
        options: ['A. 嵴 (Cristae)', 'B. 基質 (Matrix)', 'C. 類囊體', 'D. 內質網'],
        correctIndex: 0,
    },
    {
        question: '下列何者是粒線體的主要功能？',
        options: ['A. 光合作用', 'B. ATP 生成', 'C. 蛋白質合成', 'D. 脂質儲存'],
        correctIndex: 1,
    },
    {
        question: '關於粒線體DNA (mtDNA) 的描述，何者正確？',
        options: ['A. 位於細胞核', 'B. 為線性結構', 'C. 可自我複製', 'D. 與父系遺傳相關'],
        correctIndex: 2,
    },
];

export function AIQuizTab() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [quizGenerated, setQuizGenerated] = useState(false);

    const handleGenerateQuiz = () => {
        setIsGenerating(true);
        // 模擬 AI 生成過程
        setTimeout(() => {
            setIsGenerating(false);
            setQuizGenerated(true);
        }, 2000);
    };

    if (!quizGenerated) {
        return (
            <div className="text-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">AI 智能出題助手</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-8">
                    系統將根據目前的教科書內容（粒線體結構）與筆記，自動生成適合全班程度的 5 題測驗，並自動批改。
                </p>

                <button
                    onClick={handleGenerateQuiz}
                    disabled={isGenerating}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 mx-auto disabled:opacity-70"
                >
                    {isGenerating ? (
                        <><RefreshCw className="w-5 h-5 animate-spin" /> 正在分析教材與生成題目...</>
                    ) : (
                        <><Sparkles className="w-5 h-5" /> 立即生成測驗</>
                    )}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded shadow-sm">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                        <div className="font-bold text-indigo-900">測驗已生成並發送</div>
                        <div className="text-xs text-indigo-600">基於內容：粒線體與 ATP (P.42)</div>
                    </div>
                </div>
                <button className="text-sm font-bold text-indigo-600 bg-white px-4 py-2 rounded border border-indigo-200 shadow-sm">
                    查看即時答題狀況
                </button>
            </div>

            {/* 題目預覽列表 */}
            {QUIZ_QUESTIONS.map((quiz, i) => (
                <div key={i} className="border border-slate-200 rounded-lg p-5 hover:border-indigo-300 transition-colors bg-white">
                    <div className="flex gap-4">
                        <span className="font-bold text-slate-400">Q{i + 1}</span>
                        <div className="flex-1">
                            <div className="font-bold text-slate-800 mb-3">{quiz.question}</div>
                            <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                                {quiz.options.map((option, optIdx) => (
                                    <div
                                        key={optIdx}
                                        className={`p-2 rounded ${optIdx === quiz.correctIndex
                                                ? 'bg-green-100 border border-green-200 text-green-800 font-bold'
                                                : 'border border-slate-100'
                                            }`}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
