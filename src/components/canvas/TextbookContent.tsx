import React from 'react';
import { BookOpen } from 'lucide-react';

interface TextbookContentProps {
  currentTool: string;
  onTextSelected: (data: { text: string; clientRect: DOMRect }) => void;
  clearSelection: () => void;
}

const TextbookContent: React.FC<TextbookContentProps> = ({ currentTool, onTextSelected, clearSelection }) => {
  const handleMouseUp = () => {
    // 範圍選取模式下，不處理預設的文字選取
    if (currentTool === 'select') return;

    // 一般指標模式下，允許選取文字
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      onTextSelected({
        text: selection.toString(),
        clientRect: rect
      });
    } else {
      clearSelection();
    }
  };

  return (
    <div className="h-full">
      <div 
        className={`max-w-5xl mx-auto py-16 px-12 space-y-10 pb-48 bg-white shadow-xl min-h-[1400px] my-8 rounded-sm
           ${currentTool === 'select' ? 'select-none' : 'select-text'} 
        `}
        onMouseUp={handleMouseUp}
        style={{ cursor: currentTool === 'pan' ? 'grab' : currentTool === 'select' ? 'crosshair' : 'auto' }}
      >
        {/* Header */}
        <div className="flex justify-between items-end border-b-2 border-slate-100 pb-6">
          <div>
             <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Biology / Chapter 2</div>
             <h1 className="text-6xl font-black text-slate-800 tracking-tight leading-tight">
               2-1 <span className="text-indigo-600">細胞的構造</span>
               <br />與能量轉換
             </h1>
          </div>
          <div className="flex flex-col items-end gap-2">
             <div className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100 flex items-center gap-1">
                <BookOpen className="w-3 h-3" /> 數位教材 V.2.4
             </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-8">
             <div className="bg-slate-50 border-l-4 border-indigo-400 p-6 rounded-r-xl">
               <p className="text-xl text-slate-700 leading-relaxed font-serif italic">
                 「細胞就像一個微型的繁忙城市，而<span className="font-bold text-slate-900">胞器</span>就是城市中各司其職的工廠與部門。」
               </p>
             </div>

             <div className="prose prose-xl prose-indigo text-slate-600 leading-loose text-justify font-serif">
               <p>
                 在真核細胞中，<span className="font-bold text-indigo-700 bg-indigo-50 px-1 rounded border-b border-indigo-200 hover:bg-indigo-100 transition-colors">粒線體 (Mitochondria)</span> 扮演著至關重要的角色。它不僅僅是細胞的能量工廠，更是真核生物演化過程中的關鍵證據。
               </p>
               <p className="mt-8">
                 粒線體的主要功能是進行<strong className="text-slate-900">呼吸作用 (Respiration)</strong>。透過氧化分解葡萄糖，將化學能轉換為細胞可以直接利用的能量貨幣——
                 <span className="inline-block bg-yellow-200 text-yellow-900 px-2 py-0.5 mx-1 rounded-md font-bold cursor-pointer hover:scale-110 hover:shadow-md transition-all border border-yellow-300 transform -rotate-1" title="點擊選取以生成考題！">
                   ATP (三磷酸腺苷)
                 </span>。
               </p>
               <p className="mt-8">
                 值得注意的是，粒線體擁有雙層膜結構。外膜平滑，內膜則向內摺疊形成<span className="font-bold text-slate-800 border-b-2 border-dotted border-slate-400">嵴 (Cristae)</span>，這種特殊的構造大幅增加了內膜的表面積，讓更多與呼吸作用相關的酵素附著其上。
               </p>
             </div>
             
             <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 flex gap-4 items-start mt-8">
                <div className="bg-white p-2 rounded-full shadow-sm text-2xl">💡</div>
                <div>
                  <h4 className="font-bold text-emerald-800 mb-1">冷知識：母系遺傳</h4>
                  <p className="text-sm text-emerald-700 leading-relaxed">
                    你身體裡的粒線體 DNA 幾乎完全來自你的母親！這是因為精子的粒線體通常位於尾部，在受精過程中不會進入卵子。
                  </p>
                </div>
             </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6 sticky top-24">
             <div className="relative group cursor-pointer transition-all hover:translate-y-1">
                <div className="aspect-square bg-slate-900 rounded-3xl shadow-2xl overflow-hidden relative border-4 border-slate-100">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-40 h-64 bg-orange-500/20 blur-3xl absolute rounded-full animate-pulse"></div>
                      <div className="relative z-10 w-48 h-48 rounded-full border-2 border-orange-400/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
                          <div className="w-32 h-32 rounded-full border border-orange-300/30 rotate-45 group-hover:rotate-90 transition-transform duration-1000"></div>
                          <span className="absolute text-orange-200 font-bold text-lg tracking-widest drop-shadow-md">3D MODEL</span>
                      </div>
                   </div>
                </div>
                <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                   點擊拆解構造
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextbookContent;