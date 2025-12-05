import React, { useState } from 'react';
import { Sparkles, CheckCircle, BarChart3, RefreshCw, FileText } from 'lucide-react';

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState('overview');
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

  return (
    <div className="h-[600px] flex flex-col">
      {/* 儀表板導航 Tab */}
      <div className="flex border-b border-slate-200 mb-6">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'overview' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          班級學習概況
        </button>
        <button 
          onClick={() => setActiveTab('ai-quiz')}
          className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'ai-quiz' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <Sparkles className="w-4 h-4" /> AI 隨堂測驗生成
        </button>
      </div>

      {/* 內容區域 */}
      <div className="flex-1 overflow-y-auto pr-2">
        
        {/* 1. 概況視圖 (保持簡單數據展示) */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                <div className="text-emerald-800 font-medium mb-2 flex items-center gap-2"><CheckCircle className="w-5 h-5"/> 平均答對率</div>
                <div className="text-4xl font-bold text-emerald-600">87%</div>
                <div className="text-sm text-emerald-600/70 mt-2">↑ 較上週提升 5%</div>
             </div>
             <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <div className="text-blue-800 font-medium mb-2 flex items-center gap-2"><BarChart3 className="w-5 h-5"/> 作業繳交率</div>
                <div className="text-4xl font-bold text-blue-600">28/30</div>
                <div className="text-sm text-blue-600/70 mt-2">2 位學生尚未繳交</div>
             </div>
             {/* 更多數據卡片... */}
          </div>
        )}

        {/* 2. AI 出題視圖 (重點修改) */}
        {activeTab === 'ai-quiz' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             {!quizGenerated ? (
               <div className="text-center py-20">
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
                      <><RefreshCw className="w-5 h-5 animate-spin"/> 正在分析教材與生成題目...</>
                    ) : (
                      <><Sparkles className="w-5 h-5"/> 立即生成測驗</>
                    )}
                  </button>
               </div>
             ) : (
               <div className="space-y-6">
                  <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                     <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded shadow-sm"><CheckCircle className="w-6 h-6 text-green-500" /></div>
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
                  {[1, 2, 3].map(i => (
                    <div key={i} className="border border-slate-200 rounded-lg p-5 hover:border-indigo-300 transition-colors bg-white">
                       <div className="flex gap-4">
                          <span className="font-bold text-slate-400">Q{i}</span>
                          <div className="flex-1">
                             <div className="font-bold text-slate-800 mb-3">
                                {i === 1 ? "粒線體內膜向內摺疊形成的結構稱為什麼？" : 
                                 i === 2 ? "下列何者是粒線體的主要功能？" : "關於粒線體DNA (mtDNA) 的描述，何者正確？"}
                             </div>
                             <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                                <div className={`p-2 rounded ${i===1?'bg-green-100 border border-green-200 text-green-800 font-bold':''}`}>A. 嵴 (Cristae)</div>
                                <div className="p-2 border border-slate-100 rounded">B. 基質 (Matrix)</div>
                                <div className="p-2 border border-slate-100 rounded">C. 類囊體</div>
                                <div className="p-2 border border-slate-100 rounded">D. 內質網</div>
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;