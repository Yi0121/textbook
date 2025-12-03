import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { 
  Sparkles, PenTool, Box, ChevronRight,
  BrainCircuit, Eraser, MousePointer2,
  Timer, Dices, StickyNote, PanelRightClose, 
  PanelRightOpen, X, Users, Share2, FileQuestion, RefreshCw,    
  CheckCircle2, BookOpen,
  Zap, LayoutDashboard, Plus, Image,        
  Hand, ZoomIn, Minus, Play, Pause, Search, XCircle,
  Loader2, Highlighter, Scan, Trash2, Move, ChevronLeft, Lightbulb
} from 'lucide-react';

// --- Helper: 幾何計算 ---
const distanceBetween = (p1: {x: number, y: number}, p2: {x: number, y: number}) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

// --- 1. 頂部導航 ---
const TopNavigation = ({ isSidebarOpen, toggleSidebar }: any) => (
  <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-50 transition-all duration-300">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mr-4">
        <span className="p-1.5 bg-indigo-600 text-white rounded-lg"><BrainCircuit size={18} /></span>
        <span className="font-bold text-gray-800 text-lg tracking-tight">AI EduBoard</span>
      </div>
      <div className="h-6 w-px bg-gray-300"></div>
      <div className="flex items-center gap-2 text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors">
        <BookOpen className="w-4 h-4" />
        <span className="font-medium">康軒生物 2-1：細胞的能量</span>
        <ChevronRight className="w-3 h-3 text-gray-400" />
      </div>
    </div>

    <div className="flex items-center gap-4">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse flex items-center gap-2">
         <span className="w-2 h-2 bg-green-400 rounded-full"></span>
         Live Demo Mode
      </div>
      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full border-2 border-white shadow-md cursor-pointer"></div>
      <button 
        onClick={toggleSidebar} 
        className={`p-2 rounded-lg transition-colors border border-gray-200 ${isSidebarOpen ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'text-gray-500 hover:bg-gray-100'}`}
        title="AI 側邊欄"
      >
         {isSidebarOpen ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
      </button>
    </div>
  </div>
);

// --- 2. 懸浮計時器 ---
const FloatingTimer = ({ onClose }: any) => {
  const [timeLeft, setTimeLeft] = useState(300);
  const [isActive, setIsActive] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isMinimized) {
      return (
          <div className="fixed top-24 right-24 z-[55] bg-white border border-gray-200 rounded-full shadow-xl p-2 px-4 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform" onClick={() => setIsMinimized(false)}>
              <Timer className="w-4 h-4 text-indigo-600" />
              <span className="font-mono font-bold text-slate-800">{formatTime(timeLeft)}</span>
          </div>
      )
  }

  return (
    <div className="fixed top-24 right-24 z-[55] bg-white border border-gray-200 rounded-3xl shadow-2xl p-5 flex flex-col items-center gap-4 w-56 animate-in slide-in-from-right-4 duration-300">
      <div className="flex justify-between w-full items-center">
         <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <Timer className="w-3.5 h-3.5" />
            <span>Class Timer</span>
         </div>
         <div className="flex gap-1">
            <button onClick={() => setIsMinimized(true)} className="text-gray-300 hover:text-indigo-500 transition-colors"><Minus className="w-4 h-4" /></button>
            <button onClick={onClose} className="text-gray-300 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
         </div>
      </div>
      <div className="text-5xl font-mono font-black text-slate-800 tracking-tighter">
        {formatTime(timeLeft)}
      </div>
      <div className="flex gap-2 w-full">
         <button 
           className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isActive ? 'bg-orange-50 text-orange-600 ring-1 ring-orange-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'}`}
           onClick={() => setIsActive(!isActive)}
         >
           {isActive ? <Pause className="w-4 h-4 fill-current"/> : <Play className="w-4 h-4 fill-current"/>}
           {isActive ? '暫停' : '開始'}
         </button>
         <button 
           className="p-2.5 bg-gray-50 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 border border-gray-200"
           onClick={() => {setIsActive(false); setTimeLeft(300);}}
         >
           <RefreshCw className="w-4 h-4" />
         </button>
      </div>
    </div>
  );
};

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
                          <button key={color} onClick={() => setPenColor(color)} 
                              className={`w-6 h-6 rounded-full border border-black/5 transition-transform hover:scale-110 flex items-center justify-center ${penColor === color ? 'scale-125 ring-2 ring-offset-1 ring-indigo-50' : ''}`}
                          >
                              <div className="w-full h-full rounded-full" style={{ backgroundColor: color }}></div>
                          </button>
                       ))
                    ) : (
                       ['#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8'].map(color => (
                          <button key={color} onClick={() => setPenColor(color)} 
                              className={`w-6 h-6 rounded-full border border-black/5 transition-transform hover:scale-110 flex items-center justify-center ${penColor === color ? 'scale-125 ring-2 ring-offset-1 ring-gray-200' : ''}`}
                          >
                              <div className="w-full h-full rounded-full opacity-80" style={{ backgroundColor: color }}></div>
                          </button>
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
      <div className={`
        relative bg-white/90 backdrop-blur-2xl border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.12)] 
        transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] rounded-full ring-1 ring-black/5 flex items-center justify-center
        ${isExpanded ? 'px-2 py-2 min-w-[580px]' : 'w-14 h-14 cursor-pointer hover:scale-110 active:scale-95'}
      `}
        onClick={() => !isExpanded && toggleExpand()}
      >
         {!isExpanded && (
            <div className="animate-in zoom-in duration-300 text-indigo-600">
                <PenTool className="w-6 h-6" />
            </div>
         )}

         <div className={`flex items-center gap-1.5 overflow-hidden whitespace-nowrap ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0 pointer-events-none'}`}>
            
            {/* Group 1: Navigation & Selection */}
            {/* ✅ 改動：區分「一般指標」與「範圍選取」 */}
            <ToolButton icon={<MousePointer2 className="w-5 h-5" />} label="一般選取" active={currentTool === 'cursor'} activeColor="bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200" onClick={() => {setCurrentTool('cursor'); setSubPanel(null); setShowBoxMenu(false)}} />
            <ToolButton icon={<Scan className="w-5 h-5" />} label="範圍框選" active={currentTool === 'select'} activeColor="bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200" onClick={() => {setCurrentTool('select'); setSubPanel(null); setShowBoxMenu(false)}} />
            <ToolButton icon={<Hand className="w-5 h-5" />} label="平移" active={currentTool === 'pan'} activeColor="bg-blue-50 text-blue-700" onClick={() => {setCurrentTool('pan'); setSubPanel(null); setShowBoxMenu(false)}} />
            <ToolButton icon={<ZoomIn className="w-5 h-5" />} label="縮放" active={subPanel === 'zoom'} activeColor="bg-gray-100 text-gray-900" onClick={() => {setSubPanel(subPanel === 'zoom' ? null : 'zoom'); setShowBoxMenu(false)}} />
            
            <div className="w-px h-6 bg-gray-200 mx-1"></div>

            {/* Group 2: Creation */}
            <div className="relative group">
                <ToolButton icon={<PenTool className="w-5 h-5" />} label="畫筆" active={currentTool === 'pen'} activeColor="bg-gray-800 text-white shadow-lg shadow-gray-400/50" 
                  onClick={() => {
                      setCurrentTool('pen');
                      setPenColor('#ef4444');
                      setPenSize(4);
                      setSubPanel(subPanel === 'pen' ? null : 'pen');
                      setShowBoxMenu(false);
                  }} 
                />
            </div>
            
            <div className="relative group">
                <ToolButton icon={<Highlighter className="w-5 h-5" />} label="螢光筆" active={currentTool === 'highlighter'} activeColor="bg-yellow-100 text-yellow-700 ring-1 ring-yellow-200" 
                  onClick={() => {
                      setCurrentTool('highlighter');
                      setPenColor('#fef08a');
                      setPenSize(20);
                      setSubPanel(subPanel === 'highlighter' ? null : 'highlighter');
                      setShowBoxMenu(false);
                  }} 
                />
                 {currentTool === 'highlighter' && <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-black/10" style={{backgroundColor: penColor}}></div>}
            </div>

            <ToolButton icon={<Eraser className="w-5 h-5" />} label="橡皮擦" active={currentTool === 'eraser'} activeColor="bg-rose-50 text-rose-600" onClick={() => {setCurrentTool('eraser'); setSubPanel(null)}} />
            
            <ToolButton icon={<Zap className="w-5 h-5" />} label="雷射筆" active={currentTool === 'laser'} activeColor="bg-red-50 text-red-600 shadow-[0_0_15px_rgba(239,68,68,0.3)]" onClick={() => {setCurrentTool('laser'); setSubPanel(null)}} />
            
            <div className="w-px h-6 bg-gray-200 mx-1"></div>
            
            <ToolButton icon={<Timer className="w-5 h-5" />} label="計時" active={showTimer} activeColor="bg-orange-100 text-orange-600" onClick={() => setShowTimer(!showTimer)} />
            <ToolButton icon={<Box className="w-5 h-5" />} label="百寶箱" active={showBoxMenu} activeColor="bg-indigo-50 text-indigo-700" onClick={() => {setShowBoxMenu(!showBoxMenu); setSubPanel(null)}} />
            <ToolButton icon={<LayoutDashboard className="w-5 h-5" />} label="儀表板" onClick={onOpenDashboard} />

            <div className="w-px h-6 bg-gray-200 mx-1"></div>

            <button 
              onClick={(e) => { e.stopPropagation(); toggleExpand(); }}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              title="收起工具列"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
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

// --- 5. 可拖曳心智圖元件 ---
const DraggableMindMap = ({ data, onDelete, onUpdate, scale }: any) => {
    const isDragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        isDragging.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;
            e.preventDefault();
            const dx = (e.clientX - lastPos.current.x) / scale;
            const dy = (e.clientY - lastPos.current.y) / scale;
            
            onUpdate(data.id, dx, dy);
            lastPos.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseUp = () => { isDragging.current = false; };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [data.id, onUpdate, scale]);

    return (
        <div 
            className="absolute z-10 pointer-events-auto group animate-in zoom-in duration-300"
            style={{ left: data.x, top: data.y }}
        >
            <svg className="absolute overflow-visible pointer-events-none" style={{ left: 0, top: 0 }}>
                {data.edges.map((edge: any, i: number) => {
                    const start = data.nodes.find((n:any) => n.id === edge.source);
                    const end = data.nodes.find((n:any) => n.id === edge.target);
                    if(!start || !end) return null;
                    const startX = start.offsetX;
                    const startY = start.offsetY;
                    const endX = end.offsetX;
                    const endY = end.offsetY;
                    const dx = endX - startX;
                    const c1x = startX + dx * 0.5;
                    const c2x = endX - dx * 0.5;
                    return (
                        <path 
                            key={i}
                            d={`M ${startX} ${startY} C ${c1x} ${startY}, ${c2x} ${endY}, ${endX} ${endY}`}
                            stroke="#cbd5e1" strokeWidth="2" fill="none"
                        />
                    );
                })}
            </svg>

            {data.nodes.map((node: any) => (
                <div 
                    key={node.id}
                    className={`
                        absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center 
                        rounded-2xl shadow-lg border-2 transition-all duration-200
                        ${node.type === 'root' 
                            ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 border-indigo-400 text-white w-32 h-20 z-20 cursor-move shadow-indigo-200'
                            : 'bg-white/90 backdrop-blur border-indigo-100 text-gray-700 w-24 h-14 z-10'
                        }
                    `}
                    style={{ left: node.offsetX, top: node.offsetY }}
                    onMouseDown={node.type === 'root' ? handleMouseDown : undefined}
                >
                    {node.type === 'root' && <BrainCircuit className="w-5 h-5 mb-1 opacity-80" />}
                    <span className={`${node.type === 'root' ? 'text-sm' : 'text-xs'} font-bold text-center leading-tight px-1 select-none`}>
                        {node.label}
                    </span>
                    
                    {node.type === 'root' && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(data.id); }}
                            className="absolute -top-3 -right-3 p-1.5 bg-white border border-gray-200 rounded-full shadow-sm text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            ))}
        </div>
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

// --- 7. ✅ 修正：具備邊緣偵測的 AI 魔法選單 ---
const SelectionFloatingMenu = ({ position, onTrigger, onExplain, onMindMap }: any) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPos, setAdjustedPos] = useState(position);

  // 當 position 改變時，重新計算位置，防止選單超出螢幕
  useLayoutEffect(() => {
      if (position && menuRef.current) {
          const rect = menuRef.current.getBoundingClientRect();
          let newTop = position.top + 10;
          let newLeft = position.left;

          // 1. 右側邊界檢查：如果選單超出右邊，就靠左顯示
          if (newLeft + rect.width > window.innerWidth) {
              newLeft = window.innerWidth - rect.width - 20; 
          }

          // 2. 底部邊界檢查：如果選單超出下面，就改顯示在上方
          if (newTop + rect.height > window.innerHeight) {
              newTop = position.top - rect.height - 20;
          }

          setAdjustedPos({ top: newTop, left: newLeft });
      }
  }, [position]);

  if (!position) return null;

  return (
    <div 
      ref={menuRef}
      className="fixed z-[70] flex flex-col gap-2 animate-in zoom-in-95 duration-200" 
      style={{ top: adjustedPos?.top, left: adjustedPos?.left }}
    >
      <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl shadow-indigo-500/20 p-1.5 flex flex-col gap-1 min-w-[180px]">
        <div className="px-2 py-1.5 text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI Assistant
        </div>
        <MenuButton icon={<FileQuestion className="w-4 h-4 text-purple-500" />} label="生成測驗題" onClick={onTrigger} />
        <MenuButton icon={<BookOpen className="w-4 h-4 text-blue-500" />} label="重點摘要卡" onClick={onExplain} subLabel="Summarize"/>
        <MenuButton icon={<Share2 className="w-4 h-4 text-emerald-500" />} label="生成關聯圖" onClick={onMindMap} subLabel="Mind Map"/>
      </div>
    </div>
  );
};

const MenuButton = ({ icon, label, onClick, subLabel }: any) => (
    <button onClick={onClick} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-indigo-50 hover:text-indigo-900 text-gray-700 transition-all text-left group w-full">
        <div className="bg-white p-1.5 rounded-lg shadow-sm group-hover:scale-110 transition-transform">{icon}</div>
        <div className="flex-1">
            <div className="text-sm font-bold">{label}</div>
            {subLabel && <div className="text-[10px] text-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity -mt-0.5">{subLabel}</div>}
        </div>
        <ChevronRight className="w-3 h-3 text-gray-300 group-hover:translate-x-1 transition-transform" />
    </button>
);

// --- 8. AI 便利貼 ---
const AIMemoCard = ({ data, onDelete, onUpdate, scale }: any) => {
    const isDragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        isDragging.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging.current) return;
            e.preventDefault();
            const dx = (e.clientX - lastPos.current.x) / scale;
            const dy = (e.clientY - lastPos.current.y) / scale;
            onUpdate(data.id, dx, dy);
            lastPos.current = { x: e.clientX, y: e.clientY };
        };
        const handleMouseUp = () => { isDragging.current = false; };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [data.id, onUpdate, scale]);

    return (
        <div 
            className="absolute z-10 w-64 bg-yellow-50 rounded-xl shadow-xl border border-yellow-200/60 p-4 origin-top-left group cursor-move hover:shadow-2xl hover:scale-105 transition-all animate-in zoom-in duration-300" 
            style={{ top: data.y, left: data.x }}
            onMouseDown={handleMouseDown}
        >
            <div className="flex justify-between items-start mb-2 pointer-events-none">
                <div className="flex items-center gap-1.5 text-yellow-700 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> AI Summary
                </div>
                <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="pointer-events-auto text-yellow-400 hover:text-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity"><XCircle className="w-4 h-4" /></button>
            </div>
            <div className="text-sm font-bold text-gray-800 mb-1 pointer-events-none select-none">{data.keyword}</div>
            <p className="text-xs text-gray-600 leading-relaxed font-medium pointer-events-none select-none">{data.content}</p>
        </div>
    );
};

// --- 9. AI 出題側邊欄 (Right Side Panel) ---
const RightSidePanel = ({ isOpen, onClose, selectedText }: any) => {
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
       {/* Panel Header */}
       <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
           <div className="flex items-center gap-2 font-bold text-gray-700">
               <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><BrainCircuit size={18} /></div>
               AI 智慧出題
           </div>
           <button onClick={onClose} className="p-1.5 hover:bg-gray-100 text-gray-400 rounded-lg transition-colors"><X size={18}/></button>
       </div>

       {/* Panel Content */}
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
                
                {/* 題目卡片 */}
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

                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4 ring-1 ring-black/5 opacity-60 hover:opacity-100 transition-opacity">
                    <div className="flex items-start justify-between">
                        <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide">Question 2</span>
                    </div>
                    <h3 className="font-bold text-gray-800 leading-relaxed text-sm">真核細胞中，哪一個構造擁有雙層膜？</h3>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-200 w-1/3"></div>
                    </div>
                </div>

             </div>
           )}
       </div>

       {/* Panel Footer */}
       <div className="p-4 border-t border-gray-100 bg-gray-50/50">
           <button className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2">
               <Plus className="w-4 h-4" /> 生成更多題目
           </button>
       </div>
    </div>
  );
};

// --- 10. 儀表板 ---
const LoiLoDashboardContent = () => {
    return (
      <div className="h-full flex flex-col bg-slate-50/50">
        <div className="grid grid-cols-4 gap-6 p-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden ring-1 ring-gray-100">
                <div className="aspect-[4/3] bg-slate-50 relative border-b border-gray-100 overflow-hidden">
                    <div className="absolute inset-4 bg-white shadow-sm border border-gray-100 rounded-lg flex items-center justify-center opacity-80"><span className="text-3xl opacity-20 filter grayscale">✏️</span></div>
                </div>
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-slate-200 border-2 border-white shadow-sm"></div>
                        <div>
                            <div className="font-bold text-gray-800 text-sm leading-tight">Student {i}</div>
                            <div className="text-[10px] text-gray-400 font-medium">已提交</div>
                        </div>
                    </div>
                </div>
              </div>
            ))}
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
const Modal = ({ isOpen, onClose, title, icon, children, fullWidth }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`${fullWidth ? 'w-full h-[90vh] max-w-6xl' : 'w-[500px] h-[600px]'} bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 ring-1 ring-black/5`}>
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="flex items-center gap-2 text-gray-800 font-bold text-lg"><div className="p-1.5 bg-white rounded-lg shadow-sm text-indigo-600">{icon}</div>{title}</div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full text-gray-400 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-hidden p-6 relative bg-white">{children}</div>
      </div>
    </div>
  );
};

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
      
      <Modal isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} title="隨堂練習儀表板" icon={<LayoutDashboard className="w-5 h-5" />} fullWidth><LoiLoDashboardContent /></Modal>
    </div>
  );
};

export default App;