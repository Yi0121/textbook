import React, { useState } from 'react';
import { Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';

const DashboardContent = () => {
    const [isGrading, setIsGrading] = useState(false);
    const [graded, setGraded] = useState(false);

    const handleAIGrade = () => {
        setIsGrading(true);
        setTimeout(() => {
            setIsGrading(false);
            setGraded(true);
        }, 2000);
    };

    return (
      <div className="h-full flex flex-col bg-slate-50/50">
        {/* Header Toolbar */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-700">學生答題狀況概覽</h2>
            <div className="flex gap-3">
                <button 
                    onClick={() => setGraded(false)}
                    className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" /> 重置
                </button>
                <button 
                    onClick={handleAIGrade}
                    disabled={isGrading || graded}
                    className={`
                        px-5 py-2 rounded-xl text-sm font-bold text-white shadow-lg flex items-center gap-2 transition-all
                        ${graded ? 'bg-green-500 hover:bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'}
                        ${isGrading ? 'opacity-80 cursor-wait' : ''}
                    `}
                >
                    {isGrading ? <RefreshCw className="w-4 h-4 animate-spin" /> : (graded ? <CheckCircle2 className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />)}
                    {isGrading ? 'AI 正在批改...' : (graded ? '批改完成' : 'AI 智慧批改')}
                </button>
            </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 gap-6 p-6 overflow-y-auto custom-scrollbar">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden ring-1 ring-gray-100">
                <div className="aspect-[4/3] bg-slate-50 relative border-b border-gray-100 overflow-hidden group-hover:bg-slate-100 transition-colors">
                    <div className="absolute inset-0 flex items-center justify-center">
                        {/* 模擬學生手寫字 */}
                        <span className="text-3xl text-gray-300 font-serif transform -rotate-6">Answer...</span>
                    </div>
                    
                    {/* 批改結果覆蓋層 */}
                    {graded && (
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center animate-in zoom-in duration-300">
                            <div className="bg-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg transform rotate-12 border-4 border-white">
                                {['A+', 'A', 'B+'][i % 3]}
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-xs font-bold text-indigo-400">S{i}</div>
                        <div>
                            <div className="font-bold text-gray-800 text-sm leading-tight">Student {i}</div>
                            <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                {graded ? <span className="text-green-600">已批改</span> : '已提交'}
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
};

export default DashboardContent;