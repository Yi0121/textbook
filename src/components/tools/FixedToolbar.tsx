import React, { useState, useEffect } from 'react';
import { 
  MousePointer2, Hand, ZoomIn, PenTool, Eraser, Zap, 
  Timer, Box, LayoutDashboard, ChevronRight, Minus, Plus, 
  X, Dices, Users, StickyNote, Scan, Highlighter, Loader2,
  Type, Square, Circle, Triangle
} from 'lucide-react';

import FloatingTimer from './FloatingTimer'; 

// ... ToolButton & GridMenuItem 保持不變 ...
const ToolButton = ({ icon, label, active, activeColor = "bg-gray-100 text-gray-900", customClass = "", onClick }: any) => (
  <button onClick={onClick} className={`relative w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-200 ${active ? activeColor + ' scale-110 shadow-sm' : `text-gray-400 hover:bg-gray-100 hover:text-gray-600 hover:scale-105 ${customClass}`}`} title={label}>
    {icon}
  </button>
);

const GridMenuItem = ({ icon, label, color }: any) => (
  <button className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl hover:bg-gray-50 transition-all`}><div className="scale-90">{icon}</div><span className="text-xs font-bold text-gray-600">{label}</span></button>
);

interface FixedToolbarProps {
  currentTool: string;
  setCurrentTool: (tool: string) => void;
  onOpenDashboard: () => void;
  zoomLevel: number;
  setZoomLevel: (level: any) => void;
  penColor: string;
  setPenColor: (color: string) => void;
  penSize: number;
  setPenSize: (size: number) => void;
  isAIProcessing: boolean;
  onAddShape: (type: 'rect' | 'circle' | 'triangle') => void;
}

const FixedToolbar: React.FC<FixedToolbarProps> = ({ 
  currentTool, setCurrentTool, onOpenDashboard,
  zoomLevel, setZoomLevel,
  penColor, setPenColor, penSize, setPenSize,
  isAIProcessing, onAddShape
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showBoxMenu, setShowBoxMenu] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  // ✅ 新增 'text' 到子面板判斷
  const [subPanel, setSubPanel] = useState<'pen' | 'highlighter' | 'text' | 'zoom' | 'shape' | null>(null);


  useEffect(() => {
    // 當選這三個工具時自動展開
    if (['pen', 'highlighter', 'text'].includes(currentTool)) {
        if (!isExpanded) setIsExpanded(true);
    }
  }, [currentTool]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (isExpanded) {
        setSubPanel(null); 
        setShowBoxMenu(false);
    }
  };

  return (
    <>
    {showTimer && <FloatingTimer onClose={() => setShowTimer(false)} />}

    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
      
      {isAIProcessing && (
        <div className="h-12 w-80 mb-3 bg-white/95 backdrop-blur-2xl border border-indigo-100 shadow-xl rounded-2xl flex items-center justify-center gap-3 animate-in slide-in-from-bottom-2">
             <div className="relative"><div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 animate-pulse"></div><Loader2 className="w-4 h-4 text-indigo-600 animate-spin relative z-10" /></div>
             <span className="text-sm font-bold text-slate-700">AI 正在生成內容...</span>
        </div>
      )}

      {/* 整合式子面板 */}
      <div className={`
        w-[94%] bg-white/80 backdrop-blur-xl border border-white/60 shadow-lg rounded-2xl mb-2
        transition-all duration-300 ease-out origin-bottom
        ${(subPanel || showBoxMenu) && isExpanded ? 'opacity-100 translate-y-0 py-2 px-3 scale-100' : 'h-0 overflow-hidden opacity-0 translate-y-4 scale-95'}
      `}>
          {/* 畫筆 / 螢光筆 / 文字 的顏色設定共用這個面板 */}
          {(subPanel === 'pen' || subPanel === 'highlighter' || subPanel === 'text') && (
              <div className="flex items-center justify-between gap-3" onMouseDown={e => e.stopPropagation()}>
                  <div className="flex gap-1.5">
                    {(subPanel === 'highlighter' ? 
                       ['#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8'] : 
                       ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#000000']
                    ).map(color => (
                          <button key={color} onClick={() => setPenColor(color)} 
                              className={`w-6 h-6 rounded-full border border-black/5 transition-transform hover:scale-110 flex items-center justify-center ${penColor === color ? 'scale-125 ring-2 ring-offset-1 ring-indigo-50' : ''}`}
                          >
                              <div className={`w-full h-full rounded-full ${subPanel==='highlighter'?'opacity-80':''}`} style={{ backgroundColor: color }}></div>
                          </button>
                       ))
                    }
                  </div>
                  
                  {/* 文字工具不需要粗細條，只需要顏色 (或者未來加字號控制) */}
                  {subPanel !== 'text' && (
                    <>
                        <div className="w-px h-4 bg-gray-300"></div>
                        <div className="flex items-center gap-2 flex-1">
                            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                            <input type="range" min="2" max={subPanel==='highlighter' ? 40 : 20} value={penSize} onChange={(e) => setPenSize(parseInt(e.target.value))} className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                        </div>
                    </>
                  )}
                  <button onClick={() => setSubPanel(null)} className="p-1 hover:bg-gray-200 rounded-full text-gray-500"><X className="w-3 h-3" /></button>
              </div>
          )}

          {/* ✅ 形狀選單 */}
          {subPanel === 'shape' && (
             <div className="flex items-center justify-center gap-6 py-1">
                  <button onClick={() => onAddShape('rect')} className="p-2 hover:bg-indigo-50 rounded-xl text-indigo-600 flex flex-col items-center gap-1 group">
                      <Square className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold">方形</span>
                  </button>
                  <button onClick={() => onAddShape('circle')} className="p-2 hover:bg-indigo-50 rounded-xl text-indigo-600 flex flex-col items-center gap-1 group">
                      <Circle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold">圓形</span>
                  </button>
                  <button onClick={() => onAddShape('triangle')} className="p-2 hover:bg-indigo-50 rounded-xl text-indigo-600 flex flex-col items-center gap-1 group">
                      <Triangle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold">三角形</span>
                  </button>
              </div>
          )}


          {subPanel === 'zoom' && (
             <div className="flex items-center justify-center gap-4">
                <button onClick={() => setZoomLevel((prev:number) => Math.max(0.5, prev - 0.1))} className="p-1.5 hover:bg-gray-200 rounded-md text-gray-600 active:scale-95"><Minus className="w-4 h-4" /></button>
                <span className="text-sm font-bold text-gray-700 w-12 text-center tabular-nums">{Math.round(zoomLevel * 100)}%</span>
                <button onClick={() => setZoomLevel((prev:number) => Math.min(3, prev + 0.1))} className="p-1.5 hover:bg-gray-200 rounded-md text-gray-600 active:scale-95"><Plus className="w-4 h-4" /></button>
             </div>
          )}
          {showBoxMenu && (
             <div className="grid grid-cols-4 gap-1">
                <GridMenuItem icon={<Dices className="text-purple-500 w-5 h-5" />} label="抽籤" />
                <GridMenuItem icon={<Users className="text-blue-500 w-5 h-5" />} label="分組" />
                <GridMenuItem icon={<MousePointer2 className="text-emerald-500 w-5 h-5" />} label="聚光燈" />
                <GridMenuItem icon={<StickyNote className="text-yellow-500 w-5 h-5" />} label="便利貼" />
             </div>
          )}
      </div>

      {/* 主工具列 */}
      <div className={`
        relative bg-white/90 backdrop-blur-2xl border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.12)] 
        transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-full ring-1 ring-black/5 flex items-center justify-center
        ${isExpanded ? 'px-2 py-2 min-w-[620px]' : 'w-14 h-14 cursor-pointer hover:scale-110 active:scale-95'}
      `}
        onClick={() => !isExpanded && toggleExpand()}
      >
         {!isExpanded && (<div className="animate-in zoom-in duration-300 text-indigo-600"><PenTool className="w-6 h-6" /></div>)}

         <div className={`flex items-center gap-1.5 overflow-hidden whitespace-nowrap ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 pointer-events-none'}`}>
            
            <ToolButton icon={<MousePointer2 className="w-5 h-5" />} label="一般選取" active={currentTool === 'cursor'} activeColor="bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200" onClick={() => {setCurrentTool('cursor'); setSubPanel(null); setShowBoxMenu(false)}} />
            <ToolButton icon={<Scan className="w-5 h-5" />} label="範圍框選" active={currentTool === 'select'} activeColor="bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200" onClick={() => {setCurrentTool('select'); setSubPanel(null); setShowBoxMenu(false)}} />
            <ToolButton icon={<Hand className="w-5 h-5" />} label="平移" active={currentTool === 'pan'} activeColor="bg-blue-50 text-blue-700" onClick={() => {setCurrentTool('pan'); setSubPanel(null); setShowBoxMenu(false)}} />
            <ToolButton icon={<ZoomIn className="w-5 h-5" />} label="縮放" active={subPanel === 'zoom'} activeColor="bg-gray-100 text-gray-900" onClick={() => {setSubPanel(subPanel === 'zoom' ? null : 'zoom'); setShowBoxMenu(false)}} />
            
            <div className="w-px h-6 bg-gray-200 mx-1"></div>

            <div className="relative group">
                <ToolButton icon={<PenTool className="w-5 h-5" />} label="畫筆" active={currentTool === 'pen'} activeColor="bg-gray-800 text-white shadow-lg shadow-gray-400/50" 
                  onClick={() => {setCurrentTool('pen'); setPenColor('#ef4444'); setPenSize(4); setSubPanel(subPanel === 'pen' ? null : 'pen'); setShowBoxMenu(false);}} 
                />
            </div>
            
            <div className="relative group">
                <ToolButton icon={<Highlighter className="w-5 h-5" />} label="螢光筆" active={currentTool === 'highlighter'} activeColor="bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200" 
                  onClick={() => {setCurrentTool('highlighter'); setPenColor('#fef08a'); setPenSize(20); setSubPanel(subPanel === 'highlighter' ? null : 'highlighter'); setShowBoxMenu(false);}} 
                />
                 {currentTool === 'highlighter' && <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-black/10" style={{backgroundColor: penColor}}></div>}
            </div>

            {/* ✅ 新增：插入文字工具 */}
            <div className="relative group">
                <ToolButton icon={<Type className="w-5 h-5" />} label="插入文字" active={currentTool === 'text'} activeColor="bg-slate-800 text-white shadow-lg" 
                  onClick={() => {setCurrentTool('text'); setPenColor('#000000'); setSubPanel(subPanel === 'text' ? null : 'text'); setShowBoxMenu(false);}} 
                />
            </div>

            <ToolButton icon={<Square className="w-5 h-5" />} label="插入形狀" active={subPanel === 'shape'} activeColor="bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200" onClick={() => {setSubPanel(subPanel === 'shape' ? null : 'shape'); setShowBoxMenu(false);}} />

            <ToolButton icon={<Eraser className="w-5 h-5" />} label="橡皮擦" active={currentTool === 'eraser'} activeColor="bg-rose-50 text-rose-600" onClick={() => {setCurrentTool('eraser'); setSubPanel(null)}} />
            
            <ToolButton icon={<Zap className="w-5 h-5" />} label="雷射筆" active={currentTool === 'laser'} activeColor="bg-red-50 text-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)]" onClick={() => {setCurrentTool('laser'); setSubPanel(null)}} />
            
            <div className="w-px h-6 bg-gray-200 mx-1"></div>
            
            <ToolButton icon={<Timer className="w-5 h-5" />} label="計時" active={showTimer} activeColor="bg-orange-100 text-orange-600" onClick={() => setShowTimer(!showTimer)} />
            <ToolButton icon={<Box className="w-5 h-5" />} label="百寶箱" active={showBoxMenu} activeColor="bg-indigo-50 text-indigo-700" onClick={() => {setShowBoxMenu(!showBoxMenu); setSubPanel(null)}} />
            <ToolButton icon={<LayoutDashboard className="w-5 h-5" />} label="儀表板" onClick={onOpenDashboard} />

            <div className="w-px h-6 bg-gray-200 mx-1"></div>

            <button onClick={(e) => { e.stopPropagation(); toggleExpand(); }} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="收起工具列"><ChevronRight className="w-5 h-5" /></button>
         </div>
      </div>
    </div>
    </>
  );
};

export default FixedToolbar;