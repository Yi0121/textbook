/**
 * SmartSidebar - AI Assistant sidebar for CPS learning flow
 */

import { Brain, Lightbulb, Mic, Send } from 'lucide-react';
import type { Stage } from './TopBar';

interface SmartSidebarProps {
    stage: Stage;
}

export const SmartSidebar = ({ stage }: SmartSidebarProps) => {
    return (
        <div className="w-80 bg-white border-l border-slate-200 flex flex-col h-full shadow-xl z-10">
            {/* AI Assistant Header */}
            <div className="p-4 border-b border-slate-100 flex items-center bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center mr-3">
                        <Brain size={20} className="text-indigo-600" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-800">TeamTutor AI</h3>
                    <p className="text-xs text-slate-500">
                        {stage === 'S2' ? '觀念釐清' :
                            stage === 'S3' ? '蘇格拉底引導' :
                                stage === 'S4' ? '協作引導 & 監測' :
                                    '評分與回饋分析'}
                    </p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                {/* Mock AI Message */}
                <div className="flex gap-3">
                    <div className="min-w-[32px] w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mt-1">
                        <Brain size={16} className="text-indigo-600" />
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm text-sm text-slate-700">
                        {stage === 'S3' ? (
                            <div>
                                <p>請用你自己的話描述這個問題，並說出你認為相關的數學概念是什麼？</p>
                                <button className="mt-2 flex items-center gap-1 text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition-colors">
                                    <Lightbulb size={12} />
                                    給我提示
                                </button>
                            </div>
                        ) : stage === 'S4' ? (
                            <p>@B同學 提出的「分割越多越接近圓」這個想法很關鍵，大家可以計算一下不同分割數算出來的圓周率是多少。</p>
                        ) : stage === 'S2' ? (
                            <p>如果不用繩子，我們怎麼知道圓的一圈有多長？影片裡用了什麼方法呢？</p>
                        ) : (
                            <p>嗨！我是你的學習助手。關於這個階段有任何問題隨時問我。</p>
                        )}
                    </div>
                </div>

                {/* Mock Student Message */}
                {stage === 'S4' && (
                    <div className="flex gap-3 flex-row-reverse">
                        <div className="min-w-[32px] w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mt-1 text-xs font-bold text-slate-600">
                            Me
                        </div>
                        <div className="bg-indigo-600 p-3 rounded-2xl rounded-tr-none shadow-sm text-sm text-white">
                            我們這組算出來 16 分割的比值大約是 3.13，好像很接近 3.14 了！
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-slate-200 bg-white">
                <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-xl border border-transparent focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                        <Mic size={16} />
                    </button>
                    <input
                        type="text"
                        placeholder="輸入訊息或是 @呼叫老師..."
                        className="flex-1 bg-transparent text-sm outline-none text-slate-700 placeholder:text-slate-400"
                    />
                    <button className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-colors">
                        <Send size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};
