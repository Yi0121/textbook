import React from 'react';

interface TextbookContentProps {
  currentTool: string;
  onTextSelected: (data: { text: string; clientRect: DOMRect }) => void;
  clearSelection: () => void;
}

const TextbookContent: React.FC<TextbookContentProps> = ({ currentTool, onTextSelected, clearSelection }) => {
  
  // 定義哪些工具屬於「繪圖類」，這些工具使用時不應觸發文字選取
  const isDrawingTool = ['pen', 'highlighter', 'eraser', 'laser'].includes(currentTool);

  const handleMouseUp = () => {
    // 如果是繪圖工具，直接忽略，避免干擾繪圖結束的判定
    if (isDrawingTool) return;

    // 範圍選取模式下，不處理預設的文字選取 (由 App.tsx 的 SelectionBox 處理)
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
        className={`
           max-w-5xl mx-auto py-16 px-12 space-y-10 pb-48 bg-white shadow-xl min-h-[1400px] my-8 rounded-sm transition-colors duration-300
           ${/* 關鍵修改：如果是繪圖工具，關閉指針事件 (pointer-events-none)，讓滑鼠事件穿透 */ ''}
           ${isDrawingTool ? 'pointer-events-none select-none' : ''}
           ${currentTool === 'select' ? 'cursor-crosshair select-none' : ''}
           ${currentTool === 'cursor' ? 'cursor-text select-text' : ''}
        `}
        onMouseUp={handleMouseUp}
      >
        {/* 這裡是大標題與裝飾，保持不變 */}
        <div className="border-b-4 border-slate-800 pb-6 mb-8 flex items-end justify-between">
            <div>
               <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-2">細胞生物學概論</h1>
               <p className="text-xl text-slate-500 font-medium">Chapter 3: The Mitochondria</p>
            </div>
            <div className="text-slate-400 font-mono text-sm">P. 42</div>
        </div>

        {/* 模擬課文內容 */}
        <div className="grid grid-cols-12 gap-8 text-lg leading-relaxed text-slate-700">
             <div className="col-span-7 space-y-6">
                <p>
                  <span className="font-bold text-slate-900">粒線體 (Mitochondria)</span> 是真核細胞中最重要的胞器之一，
                  常被稱為細胞的「發電廠」。其主要功能是透過有氧呼吸產生 <span className="bg-yellow-100 px-1 border-b-2 border-yellow-300">三磷酸腺苷 (ATP)</span>，
                  作為細胞活動的能量來源。
                </p>
                <p>
                  粒線體擁有獨特的<span className="text-indigo-600 font-bold">雙層膜結構</span>。外膜平滑，內膜則向內摺疊形成
                  <span className="italic font-serif text-slate-900"> 嵴 (Cristae)</span>，這種結構大幅增加了內膜的表面積，
                  從而提高了電子傳遞鏈的效率。
                </p>
             </div>
             
             {/* 右側 3D 模型示意圖區域 */}
             <div className="col-span-5 relative">
                <div className="relative group transition-all hover:translate-y-1">
                {/* 注意：這邊移除了 cursor-pointer，並加上 pointer-events-auto 
                    這是為了讓即使在繪圖模式下(父層 pointer-events-none)，
                    如果未來真的有按鈕需要點，可以透過 pointer-events-auto 強制開啟交互。
                    但在這個 Demo 中，我們希望繪圖時完全忽略圖片，所以保持父層的繼承即可。
                */}
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
                </div>
                <div className="mt-4 text-sm text-slate-500 text-center italic">
                    圖 3-1: 粒線體結構立體示意圖
                </div>
             </div>

             <div className="col-span-12 mt-6 p-6 bg-indigo-50 rounded-xl border border-indigo-100">
                 <h3 className="text-indigo-900 font-bold text-lg mb-2">重點摘要</h3>
                 <ul className="list-disc list-inside space-y-1 text-indigo-800">
                     <li>粒線體是細胞能量工廠，產生 ATP。</li>
                     <li>具有雙層膜結構，內膜摺疊形成嵴。</li>
                     <li>擁有自己的 DNA (mtDNA) 和核糖體。</li>
                 </ul>
             </div>
        </div>
      </div>
    </div>
  );
};

export default TextbookContent;