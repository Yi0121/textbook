import React, { useState, useEffect, useRef } from 'react';
import { 
  PenTool, Box, ChevronRight,
  Eraser, MousePointer2, Timer,
  Dices, StickyNote, X , Users, BookOpen,
  Zap, LayoutDashboard, Plus,       
  Hand, ZoomIn, Minus,
  Loader2, Highlighter, Scan
} from 'lucide-react';
import {distanceBetween} from './utils/geometry';
import TopNavigation from './components/layout/TopNavigation';
import FloatingTimer from './components/tools/FloatingTimer';
import SelectionFloatingMenu from './components/ui/SelectionFloatingMenu';
import Modal from './components/ui/Modal';
import RightSidePanel from './components/layout/RightSidePanel';
import AIMemoCard from './components/canvas/AIMemoCard';
import DashboardContent from './components/features/Dashboard';
import DraggableMindMap from './components/canvas/DraggableMindMap';



// --- 3. 固定式靈動島工具列 (Fixed Toolbar) ---
const FixedToolbar = ({ 
  currentTool, setCurrentTool, onOpenDashboard,
  zoomLevel, setZoomLevel,
  penColor, setPenColor, penSize, setPenSize,
  isAIProcessing 
}: any) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showBoxMenu, setShowBoxMenu] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [subPanel, setSubPanel] = useState<'pen' | 'highlighter' | 'zoom' | null>(null);

  useEffect(() => {
    if (currentTool === 'pen' || currentTool === 'highlighter') {
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
    {/* ✅ 修正重點：這裡使用條件渲染，所以 Timer 預設是隱藏的 */}
    {showTimer && <FloatingTimer onClose={() => setShowTimer(false)} />}

    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]">
      
      {/* AI 靈動島狀態 */}
      <div className={`
        overflow-hidden transition-all duration-500 ease-out bg-white/95 backdrop-blur-2xl border border-indigo-100 shadow-xl shadow-indigo-500/10
        ${isAIProcessing ? 'h-12 w-80 opacity-100 mb-3 rounded-2xl scale-100 translate-y-0' : 'h-0 w-10 opacity-0 mb-0 scale-90 translate-y-4'}
      `}>
         <div className="h-full w-full flex items-center justify-center gap-3 px-4">
             <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 animate-pulse"></div>
                <Loader2 className="w-4 h-4 text-indigo-600 animate-spin relative z-10" />
             </div>
             <span className="text-sm font-bold text-slate-700 typing-effect">AI 正在生成內容...</span>
         </div>
      </div>

      {/* 整合式子面板 */}
      <div className={`
        w-[94%] bg-white/80 backdrop-blur-xl border border-white/60 shadow-lg rounded-2xl mb-2
        transition-all duration-300 ease-out origin-bottom
        ${(subPanel || showBoxMenu) && isExpanded ? 'opacity-100 translate-y-0 py-2 px-3 scale-100' : 'h-0 overflow-hidden opacity-0 translate-y-4 scale-95'}
      `}>
          {(subPanel === 'pen' || subPanel === 'highlighter') && (
              <div className="flex items-center justify-between gap-3" onMouseDown={e => e.stopPropagation()}>
                  <div className="flex gap-1.5">
                    {subPanel === 'pen' ? (
                       ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#000000'].map(color => (
                          <button key={color} onClick={() => setPenColor(color)} className={`w-6 h-6 rounded-full border border-black/5 transition-transform hover:scale-110 flex items-center justify-center ${penColor === color ? 'scale-125 ring-2 ring-offset-1 ring-indigo-50' : ''}`}><div className="w-full h-full rounded-full" style={{ backgroundColor: color }}></div></button>
                       ))
                    ) : (
                       ['#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8'].map(color => (
                          <button key={color} onClick={() => setPenColor(color)} className={`w-6 h-6 rounded-full border border-black/5 transition-transform hover:scale-110 flex items-center justify-center ${penColor === color ? 'scale-125 ring-2 ring-offset-1 ring-gray-200' : ''}`}><div className="w-full h-full rounded-full opacity-80" style={{ backgroundColor: color }}></div></button>
                       ))
                    )}
                  </div>
                  <div className="w-px h-4 bg-gray-300"></div>
                  <div className="flex items-center gap-2 flex-1">
                      <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                      <input type="range" min="2" max={subPanel==='highlighter' ? 40 : 20} value={penSize} onChange={(e) => setPenSize(parseInt(e.target.value))} className="flex-1 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                      <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  </div>
                  <button onClick={() => setSubPanel(null)} className="p-1 hover:bg-gray-200 rounded-full text-gray-500"><X className="w-3 h-3" /></button>
              </div>
          )}
          {subPanel === 'zoom' && (
             <div className="flex items-center justify-center gap-4">
                <button onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))} className="p-1.5 hover:bg-gray-200 rounded-md text-gray-600 active:scale-95"><Minus className="w-4 h-4" /></button>
                <span className="text-sm font-bold text-gray-700 w-12 text-center tabular-nums">{Math.round(zoomLevel * 100)}%</span>
                <button onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.1))} className="p-1.5 hover:bg-gray-200 rounded-md text-gray-600 active:scale-95"><Plus className="w-4 h-4" /></button>
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
      <div className={`relative bg-white/90 backdrop-blur-2xl border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-full ring-1 ring-black/5 flex items-center justify-center ${isExpanded ? 'px-2 py-2 min-w-[580px]' : 'w-14 h-14 cursor-pointer hover:scale-110 active:scale-95'}`} onClick={() => !isExpanded && toggleExpand()}>
         {!isExpanded && (<div className="animate-in zoom-in duration-300 text-indigo-600"><PenTool className="w-6 h-6" /></div>)}
         <div className={`flex items-center gap-1.5 overflow-hidden whitespace-nowrap ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 pointer-events-none'}`}>
            <ToolButton icon={<MousePointer2 className="w-5 h-5" />} label="一般選取" active={currentTool === 'cursor'} activeColor="bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200" onClick={() => {setCurrentTool('cursor'); setSubPanel(null); setShowBoxMenu(false)}} />
            <ToolButton icon={<Scan className="w-5 h-5" />} label="範圍框選" active={currentTool === 'select'} activeColor="bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200" onClick={() => {setCurrentTool('select'); setSubPanel(null); setShowBoxMenu(false)}} />
            <ToolButton icon={<Hand className="w-5 h-5" />} label="平移" active={currentTool === 'pan'} activeColor="bg-blue-50 text-blue-700" onClick={() => {setCurrentTool('pan'); setSubPanel(null); setShowBoxMenu(false)}} />
            <ToolButton icon={<ZoomIn className="w-5 h-5" />} label="縮放" active={subPanel === 'zoom'} activeColor="bg-gray-100 text-gray-900" onClick={() => {setSubPanel(subPanel === 'zoom' ? null : 'zoom'); setShowBoxMenu(false)}} />
            <div className="w-px h-6 bg-gray-200 mx-1"></div>
            <div className="relative group">
                <ToolButton icon={<PenTool className="w-5 h-5" />} label="畫筆" active={currentTool === 'pen'} activeColor="bg-gray-800 text-white shadow-lg shadow-gray-400/50" onClick={() => {setCurrentTool('pen'); setPenColor('#ef4444'); setPenSize(4); setSubPanel(subPanel === 'pen' ? null : 'pen'); setShowBoxMenu(false);}} />
            </div>
            <div className="relative group">
                <ToolButton icon={<Highlighter className="w-5 h-5" />} label="螢光筆" active={currentTool === 'highlighter'} activeColor="bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200" onClick={() => {setCurrentTool('highlighter'); setPenColor('#fef08a'); setPenSize(20); setSubPanel(subPanel === 'highlighter' ? null : 'highlighter'); setShowBoxMenu(false);}} />
                 {currentTool === 'highlighter' && <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-black/10" style={{backgroundColor: penColor}}></div>}
            </div>
            <ToolButton icon={<Eraser className="w-5 h-5" />} label="橡皮擦" active={currentTool === 'eraser'} activeColor="bg-rose-50 text-rose-600" onClick={() => {setCurrentTool('eraser'); setSubPanel(null)}} />
            <ToolButton icon={<Zap className="w-5 h-5" />} label="雷射筆" active={currentTool === 'laser'} activeColor="bg-red-50 text-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)]" onClick={() => {setCurrentTool('laser'); setSubPanel(null)}} />
            <div className="w-px h-6 bg-gray-200 mx-1"></div>
            {/* ✅ Timer 按鈕控制 showTimer 狀態 */}
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

// --- 4. 繪圖層 (Drawing Layer) ---
const DrawingLayer = ({ active, strokes, currentPath, onDrawStart, onDrawMove, onDrawEnd, penColor, penSize, currentTool, selectionBox, laserPath }: any) => {
  
  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20"
      style={{ pointerEvents: active ? 'auto' : 'none' }} 
      onMouseDown={onDrawStart}
      onMouseMove={onDrawMove}
      onMouseUp={onDrawEnd}
      onMouseLeave={onDrawEnd}
    >
      <defs>
        <filter id="laser-bloom" height="300%" width="300%" x="-100%" y="-100%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
          <feColorMatrix in="blur1" type="matrix" values="0 0 0 0 1  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0" result="redGlow" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur2" />
          <feMerge>
            <feMergeNode in="redGlow" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {strokes.filter((s:any) => s.tool === 'highlighter').map((stroke: any, i: number) => (
        <path
          key={`hl-${i}`}
          d={stroke.path}
          stroke={stroke.color}
          strokeWidth={stroke.size}
          fill="none"
          strokeLinecap="butt"
          strokeLinejoin="round"
          style={{ mixBlendMode: 'multiply', opacity: 0.6 }}
        />
      ))}

      {strokes.filter((s:any) => s.tool !== 'highlighter').map((stroke: any, i: number) => (
        <path
          key={`pen-${i}`}
          d={stroke.path}
          stroke={stroke.color}
          strokeWidth={stroke.size}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      
      {currentPath && (
        <path
          d={currentPath}
          stroke={penColor}
          strokeWidth={penSize}
          fill="none"
          strokeLinecap={currentTool === 'highlighter' ? "butt" : "round"}
          strokeLinejoin="round"
          style={currentTool === 'highlighter' ? { mixBlendMode: 'multiply', opacity: 0.6 } : {}}
        />
      )}

      {/* 範圍選取框 */}
      {selectionBox && (
         <rect 
            x={selectionBox.x}
            y={selectionBox.y}
            width={selectionBox.width}
            height={selectionBox.height}
            fill="rgba(59, 130, 246, 0.1)" 
            stroke="#3b82f6"              
            strokeWidth={1.5}
            strokeDasharray="4 2"
            rx={4}
         />
      )}

      {/* 雷射筆特效 */}
      {laserPath.length > 0 && (
          <g filter="url(#laser-bloom)">
            {laserPath.map((point: any, i: number) => {
                if (i === laserPath.length - 1) return null;
                const nextPoint = laserPath[i + 1];
                const progress = i / (laserPath.length - 1);
                const size = 1 + (8 * Math.pow(progress, 3)); 

                return (
                    <line
                        key={`glow-${point.timestamp}`}
                        x1={point.x} y1={point.y}
                        x2={nextPoint.x} y2={nextPoint.y}
                        stroke="#ef4444" 
                        strokeWidth={size}
                        strokeOpacity={0.8}
                        strokeLinecap="round"
                    />
                );
            })}
            {laserPath.map((point: any, i: number) => {
                if (i === laserPath.length - 1) return null;
                const nextPoint = laserPath[i + 1];
                const progress = i / (laserPath.length - 1);
                if (progress < 0.3) return null;
                const size = 1 + (4 * Math.pow(progress, 4)); 

                return (
                    <line
                        key={`core-${point.timestamp}`}
                        x1={point.x} y1={point.y}
                        x2={nextPoint.x} y2={nextPoint.y}
                        stroke="#ffffff"
                        strokeWidth={size}
                        strokeOpacity={0.9}
                        strokeLinecap="round"
                    />
                );
            })}
            {laserPath.length > 0 && (
                <circle 
                    cx={laserPath[laserPath.length - 1].x} 
                    cy={laserPath[laserPath.length - 1].y} 
                    r={5} 
                    fill="#ffffff" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                />
            )}
          </g>
      )}
    </svg>
  );
};


// --- 6. 課本內容 (Textbook) ---
const TextbookContent = ({ currentTool, onTextSelected, clearSelection }: any) => {
  const handleMouseUp = () => {
    // 如果是「範圍框選 (Scan)」，則不觸發文字選取
    if (currentTool === 'select') return;

    // 如果是「一般指標 (Cursor)」或其他工具，允許選取文字
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



// --- Helper Components ---
const ToolButton = ({ icon, label, active, activeColor = "bg-gray-100 text-gray-900", customClass = "", onClick }: any) => (
  <button onClick={onClick} className={`relative w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-200 ${active ? activeColor + ' scale-110 shadow-sm' : `text-gray-400 hover:bg-gray-100 hover:text-gray-600 hover:scale-105 ${customClass}`}`} title={label}>
    {icon}
  </button>
);
const GridMenuItem = ({ icon, label, color }: any) => (
  <button className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl hover:bg-gray-50 transition-all`}><div className="scale-90">{icon}</div><span className="text-xs font-bold text-gray-600">{label}</span></button>
);


// --- Main App Component ---
const App = () => {
  const [currentTool, setCurrentTool] = useState('cursor'); // 預設改為一般指標
  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('選取範圍內容');
  const [selectionMenuPos, setSelectionMenuPos] = useState<any>(null);
  
  const [isQuizPanelOpen, setIsQuizPanelOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);

  // 繪圖狀態
  const [penColor, setPenColor] = useState('#ef4444');
  const [penSize, setPenSize] = useState(4);
  const [strokes, setStrokes] = useState<any[]>([]);
  const [currentPoints, setCurrentPoints] = useState<string[]>([]);
  const [currentPointsRaw, setCurrentPointsRaw] = useState<{x:number, y:number}[]>([]); 
  const [isDrawing, setIsDrawing] = useState(false);
  
  // 雷射筆狀態
  const [laserPath, setLaserPath] = useState<{x: number, y: number, timestamp: number}[]>([]);

  const [selectionBox, setSelectionBox] = useState<any>(null); 
  const selectionStart = useRef<{x: number, y: number} | null>(null);

  // AI 內容狀態
  const [aiMemos, setAiMemos] = useState<any[]>([]);
  const [mindMaps, setMindMaps] = useState<any[]>([]);

  const [isPanning, setIsPanning] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // 雷射筆消失邏輯
  useEffect(() => {
    let animationFrameId: number;
    const decayLaser = () => {
        const now = Date.now();
        setLaserPath(prev => {
            const newPath = prev.filter(p => now - p.timestamp < 500); 
            return newPath.length !== prev.length ? newPath : prev;
        });
        animationFrameId = requestAnimationFrame(decayLaser);
    };
    if (laserPath.length > 0) {
        animationFrameId = requestAnimationFrame(decayLaser);
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [laserPath.length]);

  

  // AI 觸發邏輯
  const handleAITrigger = () => {
    setSelectionMenuPos(null);
    setSelectionBox(null); 
    setIsAIProcessing(true);
    
    setTimeout(() => { 
        setIsAIProcessing(false); 
        setIsQuizPanelOpen(true); 
        setIsSidebarOpen(true); 
    }, 2500);
  };

  const getSpawnPosition = () => {
      let spawnX = 400;
      let spawnY = 300;

      if (selectionMenuPos && canvasRef.current) {
          const rect = canvasRef.current.getBoundingClientRect();
          spawnX = (selectionMenuPos.left - rect.left) / viewport.scale;
          spawnY = (selectionMenuPos.top - rect.top) / viewport.scale;
          spawnX += 20; 
          spawnY += 20;
      }
      
      return { x: spawnX, y: spawnY };
  };

  const handleAIExplain = () => {
    const pos = getSpawnPosition();
    setSelectionMenuPos(null);
    setSelectionBox(null);
    setIsAIProcessing(true);
    setTimeout(() => {
        setIsAIProcessing(false);
        const newMemo = {
            id: Date.now(),
            x: pos.x,
            y: pos.y,
            keyword: "重點分析",
            content: "AI 已分析您選取的區域：包含粒線體結構圖與相關文字。粒線體是細胞產生能量(ATP)的場所。",
        };
        setAiMemos(prev => [...prev, newMemo]);
    }, 2000);
  };

  const handleAIMindMap = () => {
      const pos = getSpawnPosition();
      setSelectionMenuPos(null);
      setSelectionBox(null);
      setIsAIProcessing(true);

      setTimeout(() => {
          setIsAIProcessing(false);

          const newMindMap = {
              id: Date.now(),
              x: pos.x,
              y: pos.y,
              nodes: [
                  { id: 'root', offsetX: 0, offsetY: 0, label: '核心概念', type: 'root' },
                  { id: '1', offsetX: 180, offsetY: -60, label: '特徵分析', type: 'child' },
                  { id: '2', offsetX: 180, offsetY: 60, label: '功能運作', type: 'child' },
                  { id: '3', offsetX: 340, offsetY: -60, label: '結構組成', type: 'child' },
                  { id: '4', offsetX: 340, offsetY: 60, label: '能量轉換', type: 'child' },
              ],
              edges: [
                  { source: 'root', target: '1' },
                  { source: 'root', target: '2' },
                  { source: '1', target: '3' },
                  { source: '2', target: '4' },
              ]
          };

          setMindMaps(prev => [...prev, newMindMap]);

      }, 1500);
  };

  const getCanvasCoordinates = (e: React.MouseEvent) => {
     if (!canvasRef.current) return { x: 0, y: 0 };
     const rect = canvasRef.current.getBoundingClientRect();
     return {
         x: (e.clientX - rect.left) / viewport.scale,
         y: (e.clientY - rect.top) / viewport.scale
     };
  };

  // --- 畫布事件處理 ---
  
  const handleWheel = (e: React.WheelEvent) => {
    if (isDashboardOpen) return;
    if (e.ctrlKey || e.metaKey) { 
        e.preventDefault();
        const scaleAmount = -e.deltaY * 0.01;
        const newScale = Math.min(Math.max(0.5, viewport.scale + scaleAmount), 3);
        setViewport(prev => ({ ...prev, scale: newScale }));
    }
  };

  const handlePanStart = (e: React.MouseEvent) => {
    if (currentTool === 'pan' || (e.button === 1) || (e.buttons === 4)) {
      setIsPanning(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    }
  };
  const handlePanMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    setViewport(prev => ({ ...prev, x: prev.x + deltaX, y: prev.y + deltaY }));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };
  const handlePanEnd = () => setIsPanning(false);

  const handleDrawStart = (e: React.MouseEvent) => {
    const { x, y } = getCanvasCoordinates(e);
    
    // 繪圖工具
    if (currentTool === 'pen' || currentTool === 'highlighter') {
        setIsDrawing(true);
        setCurrentPoints([`M ${x} ${y}`]);
        setCurrentPointsRaw([{x, y}]);
    }
    
    // ✅ 範圍框選邏輯 (Scan)
    if (currentTool === 'select') {
        setIsDrawing(true); 
        selectionStart.current = { x, y };
        setSelectionBox({ x, y, width: 0, height: 0 }); 
        setSelectionMenuPos(null); 
    }
  };

  const handleDrawMove = (e: React.MouseEvent) => {
    const { x, y } = getCanvasCoordinates(e);

    // 雷射筆邏輯
    if (currentTool === 'laser') {
        if (e.buttons === 1) { 
            setLaserPath(prev => [...prev, { x, y, timestamp: Date.now() }]);
        }
        return;
    }

    if (currentTool === 'eraser' && e.buttons === 1) {
        const eraseRadius = 20 / viewport.scale;
        setStrokes(prevStrokes => prevStrokes.filter(stroke => {
            if (!stroke.rawPoints) return true;
            const isHit = stroke.rawPoints.some((p: any) => distanceBetween(p, {x, y}) < eraseRadius);
            return !isHit;
        }));
        return;
    }

    if (!isDrawing) return;

    // ✅ 更新選取框
    if (currentTool === 'select' && selectionStart.current) {
        const start = selectionStart.current;
        const width = x - start.x;
        const height = y - start.y;
        
        setSelectionBox({
            x: width > 0 ? start.x : x,
            y: height > 0 ? start.y : y,
            width: Math.abs(width),
            height: Math.abs(height)
        });
        return;
    }

    // 繪圖
    if (currentTool !== 'pen' && currentTool !== 'highlighter') return;
    setCurrentPoints(prev => [...prev, `L ${x} ${y}`]);
    setCurrentPointsRaw(prev => [...prev, {x, y}]);
  };

  const handleDrawEnd = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    setIsDrawing(false);

    // 完成選取
    if (currentTool === 'select' && selectionBox) {
        if (selectionBox.width < 5 || selectionBox.height < 5) {
            setSelectionBox(null);
            setSelectionMenuPos(null);
        } else {
            if (canvasRef.current) {
                const rect = canvasRef.current.getBoundingClientRect();
                const menuX = (selectionBox.x + selectionBox.width) * viewport.scale + rect.left;
                const menuY = (selectionBox.y + selectionBox.height) * viewport.scale + rect.top;
                
                setSelectionMenuPos({ 
                    top: menuY, 
                    left: menuX 
                });
                setSelectedText("已選取區域內容");
            }
        }
        selectionStart.current = null;
        return;
    }

    // 完成繪圖
    if ((currentTool === 'pen' || currentTool === 'highlighter')) {
      if (currentPoints.length > 0) {
        let finalPath = currentPoints.join(' ');
        let rawPoints = currentPointsRaw;

        if (currentTool === 'highlighter' && currentPointsRaw.length > 5) {
            const ys = currentPointsRaw.map(p => p.y);
            const xs = currentPointsRaw.map(p => p.x);
            const maxDiffY = Math.max(...ys) - Math.min(...ys);
            const width = Math.max(...xs) - Math.min(...xs);

            if (width > 20 && maxDiffY < 15) {
                const avgY = ys.reduce((a, b) => a + b, 0) / ys.length;
                const minX = Math.min(...xs);
                const maxX = Math.max(...xs);
                finalPath = `M ${minX} ${avgY} L ${maxX} ${avgY}`;
                rawPoints = [{x: minX, y: avgY}, {x: maxX, y: avgY}];
            }
        }

        setStrokes(prev => [...prev, { 
            path: finalPath, 
            color: penColor, 
            size: penSize,
            tool: currentTool, 
            rawPoints: rawPoints 
        }]);
        setCurrentPoints([]);
        setCurrentPointsRaw([]);
      }
    }
  };

  const handleObjUpdate = (id: number, dx: number, dy: number, type: 'memo' | 'mindmap') => {
      if (type === 'memo') {
          setAiMemos(prev => prev.map(m => m.id === id ? { ...m, x: m.x + dx, y: m.y + dy } : m));
      } else {
          setMindMaps(prev => prev.map(m => m.id === id ? { ...m, x: m.x + dx, y: m.y + dy } : m));
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 overflow-hidden flex flex-col select-none">
      <TopNavigation isSidebarOpen={isSidebarOpen || isQuizPanelOpen} toggleSidebar={() => {setIsSidebarOpen(!isSidebarOpen); setIsQuizPanelOpen(!isQuizPanelOpen)}} />      
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden bg-slate-100 touch-none"
        onMouseDown={(e) => { handlePanStart(e); handleDrawStart(e); }}
        onMouseMove={(e) => { handlePanMove(e); handleDrawMove(e); }}
        onMouseUp={(e) => { handlePanEnd(e); handleDrawEnd(e); }} 
        onMouseLeave={(e) => { handlePanEnd(); handleDrawEnd(e); }}
        onWheel={handleWheel}
        style={{ 
          cursor: (() => {
              if (currentTool === 'pan' || isPanning) return isPanning ? 'grabbing' : 'grab';
              if (currentTool === 'cursor') return 'default'; // 一般選取
              if (currentTool === 'select') return 'crosshair'; // 範圍框選
              if (currentTool === 'laser') return 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewport=\'0 0 24 24\' style=\'fill:none;stroke:white;stroke-width:2px;\'><circle cx=\'12\' cy=\'12\' r=\'6\' fill=\'%23ef4444\'/></svg>") 12 12, auto';
              return 'crosshair';
          })(),
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: `${20 * viewport.scale}px ${20 * viewport.scale}px`,
          backgroundPosition: `${viewport.x}px ${viewport.y}px`
        }}
      >
        
        <FixedToolbar 
            currentTool={currentTool} 
            setCurrentTool={setCurrentTool}
            onOpenDashboard={() => setIsDashboardOpen(true)}
            zoomLevel={viewport.scale}
            setZoomLevel={(newScale: number) => setViewport(prev => ({...prev, scale: newScale}))}
            penColor={penColor}
            setPenColor={setPenColor}
            penSize={penSize}
            setPenSize={setPenSize}
            isAIProcessing={isAIProcessing}
        />

        {/* 變形層 (Transform Layer) */}
        <div 
            className="w-full min-h-full flex justify-center py-20 origin-top-left will-change-transform"
            style={{ 
              transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
              pointerEvents: isPanning ? 'none' : 'auto' 
            }}
        >
            <div className="relative" ref={canvasRef}>
                 {/* 課本層 */}
                 <TextbookContent 
                    currentTool={currentTool}
                    onTextSelected={(data: any) => {
                       // 只有在 Cursor (一般選取) 模式下才允許文字選取
                       if (currentTool !== 'cursor' || !canvasRef.current) return;
                       
                       const rect = canvasRef.current.getBoundingClientRect();
                       const textRect = data.clientRect;
                       const canvasX = (textRect.left - rect.left) / viewport.scale;
                       const canvasY = (textRect.top - rect.top) / viewport.scale;
                       const canvasW = textRect.width / viewport.scale;
                       const canvasH = textRect.height / viewport.scale;

                       setSelectionBox({
                           x: canvasX,
                           y: canvasY,
                           width: canvasW,
                           height: canvasH
                       });

                       setSelectionMenuPos({ 
                           top: textRect.top + textRect.height, 
                           left: textRect.left + textRect.width/2 
                       });
                       setSelectedText(data.text);
                    }}
                    clearSelection={() => {}}
                 />
                 
                 {/* 繪圖與互動層 (Overlay) */}
                 <DrawingLayer 
                    active={currentTool === 'pen' || currentTool === 'highlighter' || currentTool === 'eraser' || currentTool === 'laser' || currentTool === 'select'}
                    strokes={strokes}
                    currentPath={currentPoints.join(' ')}
                    onDrawStart={()=>{}} 
                    onDrawMove={()=>{}}
                    onDrawEnd={()=>{}}
                    penColor={penColor}
                    penSize={penSize}
                    currentTool={currentTool}
                    selectionBox={selectionBox} 
                    laserPath={laserPath}
                 />

                 {/* 可拖曳心智圖層 */}
                 {mindMaps.map(map => (
                     <DraggableMindMap 
                        key={map.id} 
                        data={map} 
                        scale={viewport.scale}
                        onUpdate={(id: number, dx: number, dy: number) => handleObjUpdate(id, dx, dy, 'mindmap')}
                        onDelete={(id: number) => setMindMaps(prev => prev.filter(m => m.id !== id))}
                     />
                 ))}

                 {/* 支援拖曳的 AI 便利貼層 */}
                 {aiMemos.map(memo => (
                    <AIMemoCard 
                        key={memo.id} 
                        data={memo} 
                        scale={viewport.scale}
                        onUpdate={(id: number, dx: number, dy: number) => handleObjUpdate(id, dx, dy, 'memo')}
                        onDelete={() => setAiMemos(prev => prev.filter(m => m.id !== memo.id))} 
                    />
                 ))}
            </div>
        </div>

        {/* Debug Info */}
        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-mono text-gray-500 shadow-sm border border-gray-200 pointer-events-none select-none">
            {Math.round(viewport.scale * 100)}% | {currentTool}
        </div>
      </div>

      <SelectionFloatingMenu 
        position={selectionMenuPos} 
        onTrigger={handleAITrigger}
        onExplain={handleAIExplain}
        onMindMap={handleAIMindMap} 
      />
      
      {/* 側邊欄 (AI 面板) */}
      <RightSidePanel 
        isOpen={isQuizPanelOpen} 
        onClose={() => {setIsQuizPanelOpen(false); setIsSidebarOpen(false)}} 
        selectedText={selectedText}
      />
      
      <Modal isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} title="隨堂練習儀表板" icon={<LayoutDashboard className="w-5 h-5" />} fullWidth><DashboardContent/></Modal>
    </div>
  );
};

export default App;