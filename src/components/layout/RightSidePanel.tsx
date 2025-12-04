import React, { useState, useEffect } from 'react';
import { X, BrainCircuit, Sparkles, Lightbulb, CheckCircle2, Plus } from 'lucide-react';

interface RightSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
}

const RightSidePanel: React.FC<RightSidePanelProps> = ({ isOpen, onClose, selectedText }) => {
  const [step, setStep] = useState(1);
  
  useEffect(() => { 
      if (isOpen) {
          setStep(1);
          const timer = setTimeout(() => setStep(2), 1800); 
          return () => clearTimeout(timer);
      }
  }, [isOpen]);

  return (
    <div 
        className={`fixed top-0 right-0 bottom-0 w-96 bg-white/90 backdrop-blur-xl border-l border-gray-200 shadow-2xl z-[55] transition-transform duration-300 ease-in-out flex flex-col pointer-events-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
       <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
           <div className="flex items-center gap-2 font-bold text-gray-700">
               <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><BrainCircuit size={18} /></div>
               AI 智慧出題
           </div>
           <button onClick={onClose} className="p-1.5 hover:bg-gray-100 text-gray-400 rounded-lg transition-colors"><X size={18}/></button>
       </div>

       <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
           {step === 1 ? (
             <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="relative">
                   <div className="absolute inset-0 rounded-full bg-indigo-400/20 animate-ping"></div>
                   <div className="relative w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                       <Sparkles className="w-8 h-8 text-white animate-pulse" />
                   </div>
                </div>
                <div>
                   <h3 className="font-bold text-gray-900 mb-1">AI 分析中...</h3>
                   <p className="text-xs text-gray-500 max-w-[200px] mx-auto">正在分析「<span className="text-indigo-600">{selectedText.substring(0, 6)}...</span>」相關概念。</p>
                </div>
             </div>
           ) : (
             <div className="space-y-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4 ring-1 ring-black/5">
                    <div className="flex items-start justify-between">
                        <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">Question 1</span>
                        <div className="flex gap-1">
                            <button className="text-gray-300 hover:text-indigo-500"><Lightbulb className="w-4 h-4" /></button>
                        </div>
                    </div>
                    <h3 className="font-bold text-gray-800 leading-relaxed text-sm">關於<span className="mx-1 border-b-2 border-indigo-200">粒線體</span>的功能，下列敘述何者正確？</h3>
                    <div className="space-y-2">
                        {["控制細胞遺傳性狀", "進行呼吸作用產生 ATP", "儲存水分與廢物", "進行光合作用"].map((opt, idx) => (
                            <button key={idx} className={`w-full text-left p-3 rounded-xl text-xs font-medium flex items-center gap-3 border transition-all duration-200 group ${idx === 1 ? 'bg-green-50 border-green-200 text-green-800' : 'bg-gray-50 border-transparent hover:bg-white hover:border-gray-200 text-slate-600'}`}>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${idx === 1 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500 group-hover:bg-white group-hover:text-indigo-600'}`}>
                                    {String.fromCharCode(65 + idx)}
                                </div>
                                <span className="flex-1">{opt}</span>
                                {idx === 1 && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                            </button>
                        ))}
                    </div>
                </div>
             </div>
           )}
       </div>

       <div className="p-4 border-t border-gray-100 bg-gray-50/50">
           <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2">
               <Plus className="w-4 h-4" /> 生成更多題目
           </button>
       </div>
    </div>
  );
};

export default RightSidePanel;