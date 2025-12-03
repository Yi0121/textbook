import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, PenTool, Box, MoreHorizontal, ChevronRight,
  BrainCircuit, Eraser, MousePointer2,
  Timer, Dices, StickyNote, PanelRightClose, 
  PanelRightOpen, X, Users, Share2, FileQuestion, RefreshCw,    
  CheckCircle2, Gamepad2, BookOpen, Library,
  Zap, Send, LayoutDashboard, Plus, Image,        
  Hand, ZoomIn, Minus, Play, Pause, Search, XCircle
} from 'lucide-react';

// --- 1. 頂部導航 (Top Navigation) ---
const TopNavigation = ({ isSidebarOpen, toggleSidebar }: any) => (
  <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-50">
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
      {/* 演示模式標籤 */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse flex items-center gap-2">
         <span className="w-2 h-2 bg-green-400 rounded-full"></span>
         Live Demo Mode
      </div>

      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full border-2 border-white shadow-md cursor-pointer"></div>
      
      <button onClick={toggleSidebar} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200">
         {isSidebarOpen ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
      </button>
    </div>
  </div>
);

// --- 2. 懸浮計時器組件 ---
const FloatingTimer = ({ onClose }: any) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5分鐘
  const [isActive, setIsActive] = useState(false);

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

  return (
    <div className="fixed top-24 right-8 z-[65] bg-white border border-gray-200 rounded-3xl shadow-2xl p-5 flex flex-col items-center gap-4 w-56 animate-in slide-in-from-right-4 duration-300">
      <div className="flex justify-between w-full items-center">
         <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <Timer className="w-3.5 h-3.5" />
            <span>Class Timer</span>
         </div>
         <button onClick={onClose} className="text-gray-300 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
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
  currentTool, 
  setCurrentTool, 
  onOpenDashboard,
  zoomLevel,
  setZoomLevel,
  penColor,
  setPenColor,
  penSize,
  setPenSize
}: any) => {
  const [showBoxMenu, setShowBoxMenu] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showPenSettings, setShowPenSettings] = useState(false);
  const [showZoomControls, setShowZoomControls] = useState(false);

  const handleZoomClick = () => {
    setShowZoomControls(!showZoomControls);
    setShowPenSettings(false);
  };

  const handlePenClick = () => {
    setCurrentTool('pen');
    if (currentTool === 'pen') {
       setShowPenSettings(!showPenSettings);
    } else {
       setShowPenSettings(true);
    }
    setShowZoomControls(false);
  };

  return (
    <>
    {showTimer && <FloatingTimer onClose={() => setShowTimer(false)} />}

    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center transition-all duration-300">
      
      {/* 筆觸設定面板 */}
      {showPenSettings && currentTool === 'pen' && (
        <div className="mb-3 bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl shadow-xl shadow-indigo-500/10 p-3 px-5 flex items-center gap-5 animate-in slide-in-from-bottom-2 zoom-in-95 duration-200" onMouseDown={(e) => e.stopPropagation()}>
           <div className="flex gap-2">
             {['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#000000'].map(color => (
               <button 
                key={color} onClick={() => setPenColor(color)} 
                className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${penColor === color ? 'border-gray-400 scale-110 ring-2 ring-offset-1 ring-gray-200' : 'border-transparent'}`} 
                style={{ backgroundColor: color }} 
               />
             ))}
           </div>
           <div className="w-px h-6 bg-gray-300/50"></div>
           <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
             <input type="range" min="1" max="20" value={penSize} onChange={(e) => setPenSize(parseInt(e.target.value))} className="w-24 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-800" />
             <div className="w-3.5 h-3.5 rounded-full bg-gray-400"></div>
           </div>
        </div>
      )}

      {/* 縮放控制面板 */}
      {showZoomControls && (
         <div className="mb-3 bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl shadow-xl shadow-indigo-500/10 p-2 px-4 flex items-center gap-3 animate-in slide-in-from-bottom-2 zoom-in-95 duration-200" onMouseDown={(e) => e.stopPropagation()}>
            <button onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))} className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"><Minus className="w-5 h-5" /></button>
            <span className="text-sm font-bold text-gray-700 w-12 text-center select-none">{Math.round(zoomLevel * 100)}%</span>
            <button onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))} className="p-1 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"><Plus className="w-5 h-5" /></button>
            <div className="w-px h-5 bg-gray-300 mx-1"></div>
            <button onClick={() => setZoomLevel(1)} className="text-xs text-gray-500 hover:text-indigo-600 font-bold px-2 py-1 hover:bg-indigo-50 rounded-md transition-colors">Reset</button>
         </div>
      )}

      {/* 百寶箱選單 */}
      {showBoxMenu && (
        <div className="mb-3 bg-white/95 backdrop-blur-xl border border-white/60 rounded-3xl shadow-2xl shadow-indigo-500/15 p-4 w-72 animate-in slide-in-from-bottom-4 zoom-in-95 duration-200 origin-bottom">
           <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Classroom Tools</div>
           <div className="grid grid-cols-2 gap-2">
              <GridMenuItem icon={<Dices className="w-6 h-6 text-purple-500" />} label="抽籤挑人" color="bg-purple-50 hover:bg-purple-100" />
              <GridMenuItem icon={<Users className="w-6 h-6 text-blue-500" />} label="隨機分組" color="bg-blue-50 hover:bg-blue-100" />
              <GridMenuItem icon={<MousePointer2 className="w-6 h-6 text-emerald-500" />} label="聚光燈" color="bg-emerald-50 hover:bg-emerald-100" />
              <GridMenuItem icon={<StickyNote className="w-6 h-6 text-yellow-500" />} label="便利貼" color="bg-yellow-50 hover:bg-yellow-100" />
           </div>
           <div className="h-px bg-gray-100 my-3"></div>
           <button className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors text-sm text-gray-600 font-medium group">
              <span className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Library className="w-4 h-4" />
                </div>
                開啟素材庫
              </span>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500" />
           </button>
        </div>
      )}

      {/* 主工具列本體 */}
      <div className="bg-white/80 backdrop-blur-2xl border border-white/50 px-3 py-2 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center gap-2 relative ring-1 ring-black/5 hover:scale-[1.01] transition-transform duration-300">
        
        {/* Navigation Group */}
        <ToolButton icon={<MousePointer2 className="w-5 h-5" />} label="選取物件" active={currentTool === 'select'} activeColor="bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200" onClick={() => {setCurrentTool('select'); setShowPenSettings(false); setShowZoomControls(false)}} />
        <ToolButton icon={<Hand className="w-5 h-5" />} label="平移畫布" active={currentTool === 'pan'} activeColor="bg-blue-50 text-blue-700 ring-1 ring-blue-100" onClick={() => {setCurrentTool('pan'); setShowPenSettings(false); setShowZoomControls(false)}} />
        <ToolButton icon={<ZoomIn className="w-5 h-5" />} label="縮放檢視" active={showZoomControls} activeColor="bg-gray-100 text-gray-900" onClick={handleZoomClick} />
        
        <div className="w-px h-8 bg-gray-300/50 mx-1"></div>

        {/* Creation Group */}
        <div className="relative group">
            <ToolButton icon={<PenTool className="w-5 h-5" />} label="畫筆" active={currentTool === 'pen'} activeColor="bg-gray-800 text-white shadow-lg shadow-gray-400/50" onClick={handlePenClick} />
            {currentTool === 'pen' && <div className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-white shadow-sm" style={{backgroundColor: penColor}}></div>}
        </div>
        <ToolButton icon={<Eraser className="w-5 h-5" />} label="橡皮擦" active={currentTool === 'eraser'} onClick={() => {setCurrentTool('eraser'); setShowPenSettings(false)}} />
        <ToolButton icon={<Zap className="w-5 h-5" />} label="雷射筆" active={currentTool === 'laser'} activeColor="bg-red-50 text-red-600 ring-1 ring-red-100 shadow-[0_0_15px_rgba(239,68,68,0.3)]" onClick={() => {setCurrentTool('laser'); setShowPenSettings(false)}} />
        
        <div className="w-px h-8 bg-gray-300/50 mx-1"></div>
        
        {/* Classroom Group */}
        <ToolButton icon={<Timer className="w-5 h-5" />} label="計時器" active={showTimer} activeColor="bg-orange-100 text-orange-600" onClick={() => setShowTimer(!showTimer)} />
        <ToolButton icon={<Box className="w-5 h-5 text-indigo-500" />} label="百寶箱" customClass={`hover:bg-indigo-50 ${showBoxMenu ? 'bg-indigo-50 text-indigo-700' : ''}`} onClick={() => setShowBoxMenu(!showBoxMenu)} />
        <ToolButton icon={<LayoutDashboard className="w-5 h-5" />} label="儀表板" onClick={onOpenDashboard} />
      </div>

    </div>
    </>
  );
};

// --- 4. 手寫塗鴉層 (Drawing Layer) ---
const DrawingLayer = ({ active, strokes, currentPath, onDrawStart, onDrawMove, onDrawEnd, penColor, penSize }: any) => {
  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20"
      style={{ pointerEvents: active ? 'auto' : 'none' }} 
      onMouseDown={onDrawStart}
      onMouseMove={onDrawMove}
      onMouseUp={onDrawEnd}
      onMouseLeave={onDrawEnd}
    >
      {strokes.map((stroke: any, i: number) => (
        <path
          key={i}
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
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
};

// --- 5. 課本內容 (Textbook) ---
const TextbookContent = ({ currentTool, onTextSelected, clearSelection }: any) => {
  const handleMouseUp = () => {
    if (currentTool !== 'select') return;
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      onTextSelected({
        text: selection.toString(),
        // 注意：這裡的座標是相對於 Viewport 的，需要呼叫者處理
        top: rect.top,
        left: rect.left + rect.width / 2
      });
    } else {
      clearSelection();
    }
  };

  return (
    <div className="h-full">
      <div 
        className="max-w-5xl mx-auto py-16 px-12 space-y-10 pb-48 select-text bg-white shadow-xl min-h-[1400px] my-8 rounded-sm"
        onMouseUp={handleMouseUp}
        style={{ cursor: currentTool === 'pan' ? 'grab' : currentTool === 'select' ? 'text' : 'auto' }}
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
             {/* 3D Model Placeholder */}
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
                   <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end">
                      <div className="flex gap-2">
                         <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur text-white"><Box className="w-4 h-4" /></button>
                         <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur text-white"><Zap className="w-4 h-4" /></button>
                      </div>
                      <span className="text-[10px] text-white/60 font-mono border border-white/20 px-2 py-1 rounded">Interactive View</span>
                   </div>
                </div>
                <div className="absolute -top-3 -right-3 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
                   點擊拆解構造
                </div>
             </div>
             
             {/* Gallery */}
             <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                <h5 className="font-bold text-gray-500 text-xs uppercase mb-3 flex items-center gap-2">
                  <Image className="w-3 h-3" /> 相關圖庫
                </h5>
                <div className="grid grid-cols-2 gap-2">
                   <div className="aspect-video bg-gray-100 rounded-lg bg-[url('https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=300')] bg-cover bg-center hover:opacity-90 cursor-pointer"></div>
                   <div className="aspect-video bg-gray-100 rounded-lg bg-[url('https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=300')] bg-cover bg-center hover:opacity-90 cursor-pointer"></div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 6. AI 魔法選單 (Context Menu) ---
const SelectionFloatingMenu = ({ position, onTrigger, onExplain, onMindMap }: any) => {
  if (!position) return null;

  return (
    <div 
      className="fixed z-[70] flex flex-col gap-2 animate-in zoom-in-95 duration-200 origin-top-left" 
      style={{ top: position.top + 20, left: position.left }}
    >
      <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl shadow-indigo-500/20 p-1.5 flex flex-col gap-1 min-w-[180px]">
        <div className="px-2 py-1.5 text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI Assistant
        </div>
        <MenuButton icon={<FileQuestion className="w-4 h-4 text-purple-500" />} label="生成測驗題" onClick={onTrigger} />
        <MenuButton icon={<BookOpen className="w-4 h-4 text-blue-500" />} label="重點摘要卡" onClick={onExplain} subLabel="Summarize"/>
        <MenuButton icon={<Share2 className="w-4 h-4 text-emerald-500" />} label="生成關聯圖" onClick={onMindMap} subLabel="Mind Map"/>
        <div className="h-px bg-gray-100 my-0.5"></div>
        <MenuButton icon={<Search className="w-4 h-4 text-gray-400" />} label="搜尋相關圖庫" onClick={() => {}} />
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

// --- 7. AI 便利貼 (Sticky Note) ---
const AIMemoCard = ({ data, onDelete }: any) => {
    return (
        <div className="absolute z-10 w-64 bg-yellow-50 rounded-xl shadow-xl border border-yellow-200/60 p-4 animate-in zoom-in duration-300 origin-top-left group cursor-move hover:shadow-2xl hover:scale-105 transition-all" style={{ top: data.y, left: data.x }}>
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-1.5 text-yellow-700 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> AI Summary
                </div>
                <button onClick={onDelete} className="text-yellow-400 hover:text-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity"><XCircle className="w-4 h-4" /></button>
            </div>
            <div className="text-sm font-bold text-gray-800 mb-1">{data.keyword}</div>
            <p className="text-xs text-gray-600 leading-relaxed font-medium">{data.content}</p>
            <div className="mt-3 flex gap-2">
                <span className="px-2 py-1 bg-white/50 rounded-md text-[10px] text-yellow-800 font-bold border border-yellow-100">#重點</span>
                <span className="px-2 py-1 bg-white/50 rounded-md text-[10px] text-yellow-800 font-bold border border-yellow-100">#考題</span>
            </div>
        </div>
    );
};

// --- 8. AI 出題視窗 ---
const QuizPopupContent = ({ selectedText }: { selectedText: string }) => {
  const [step, setStep] = useState(1);
  useEffect(() => { if (step === 1) setTimeout(() => setStep(2), 1800); }, []);

  return (
    <div className="h-full flex flex-col p-2">
       {step === 1 ? (
         <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
            <div className="relative">
               <div className="absolute inset-0 rounded-full bg-indigo-400/20 animate-ping"></div>
               <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-200">
                   <Sparkles className="w-10 h-10 text-white animate-pulse" />
               </div>
            </div>
            <div className="max-w-xs mx-auto">
               <h3 className="text-xl font-bold text-gray-900 mb-2">AI 正在閱讀並出題...</h3>
               <p className="text-sm text-gray-500 leading-relaxed">正在分析「<span className="text-indigo-600 font-medium">{selectedText.substring(0, 8)}...</span>」相關的概念與重點。</p>
            </div>
         </div>
       ) : (
         <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full text-xs font-bold border border-indigo-100">
                    <BrainCircuit className="w-3.5 h-3.5" /> <span>AI 推薦題型</span>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-colors"><RefreshCw className="w-4 h-4" /></button>
                </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex-1 overflow-y-auto custom-scrollbar">
                <h3 className="text-lg font-bold text-gray-900 mb-6 leading-normal">關於<span className="mx-1 border-b-2 border-indigo-200">粒線體</span>的功能，下列敘述何者正確？</h3>
                <div className="space-y-3">
                    {["控制細胞遺傳性狀", "進行呼吸作用產生能量 (ATP)", "儲存水分與廢物 (液泡)", "進行光合作用 (葉綠體)"].map((opt, idx) => (
                        <button key={idx} className={`w-full text-left p-4 rounded-xl font-medium flex items-center gap-4 border transition-all duration-200 group ${idx === 1 ? 'bg-green-50 border-green-500 ring-1 ring-green-500 text-green-800' : 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-600'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${idx === 1 ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-indigo-600'}`}>
                                {String.fromCharCode(65 + idx)}
                            </div>
                            <span className="flex-1">{opt}</span>
                            {idx === 1 && <CheckCircle2 className="w-5 h-5 text-green-600 animate-in zoom-in spin-in-90 duration-300" />}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex gap-4 pt-6 mt-auto">
               <button className="flex-[2] py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all">
                   <Send className="w-5 h-5" /> <span>派送全班測驗</span>
               </button>
               <button className="flex-1 py-3.5 bg-white hover:bg-purple-50 text-purple-700 font-bold rounded-xl border border-purple-200 flex items-center justify-center gap-2 transition-colors">
                   <Gamepad2 className="w-5 h-5" /> <span>Kahoot!</span>
               </button>
            </div>
         </div>
       )}
    </div>
  );
};

// --- 9. 儀表板 ---
const LoiLoDashboardContent = () => {
    const [isGrading, setIsGrading] = useState(true);
    const [graded, setGraded] = useState(false);
    useEffect(() => { setTimeout(() => setGraded(true), 2500); setTimeout(() => setIsGrading(false), 2500); }, []);
    return (
      <div className="h-full flex flex-col bg-slate-50/50">
        <div className="flex items-center justify-between mb-6 px-1">
           <div className="flex gap-4">
              <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 flex flex-col">
                  <span className="text-xs text-gray-400 font-bold uppercase">提交進度</span>
                  <span className="text-xl font-black text-slate-800">24<span className="text-gray-400 text-sm ml-1 font-medium">/ 28</span></span>
              </div>
              <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 flex flex-col">
                  <span className="text-xs text-gray-400 font-bold uppercase">平均分數</span>
                  <span className="text-xl font-black text-green-600">87.5</span>
              </div>
           </div>
           <div className="flex gap-2">
             <button className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-bold text-sm hover:bg-indigo-200 transition-colors">公布解答</button>
             <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors">鎖定畫面</button>
           </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
          <div className="grid grid-cols-4 gap-6 pb-12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden ring-1 ring-gray-100">
                {(graded || (isGrading && i % 2 === 0)) && ( 
                    <div className={`absolute top-3 right-3 z-10 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm backdrop-blur-md animate-in zoom-in duration-300 ${isGrading ? 'bg-indigo-50/90 text-indigo-600 ring-1 ring-indigo-200' : 'bg-green-500 text-white shadow-green-200'}`}>
                        {isGrading ? (<><RefreshCw className="w-3.5 h-3.5 animate-spin" /><span className="text-xs font-bold">分析中...</span></>) : (<><span className="text-xs font-medium opacity-90">Score</span><span className="text-sm font-extrabold">{85 + i}</span></>)}
                    </div>
                )}
                <div className="aspect-[4/3] bg-slate-50 relative border-b border-gray-100 overflow-hidden">
                    <div className="absolute inset-4 bg-white shadow-sm border border-gray-100 rounded-lg flex items-center justify-center opacity-80 group-hover:scale-105 transition-transform duration-500"><span className="text-3xl opacity-20 filter grayscale">✏️</span></div>
                    {isGrading && i % 2 === 0 && (<div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-indigo-500/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>)}
                </div>
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-slate-200 border-2 border-white shadow-sm"></div>
                        <div>
                            <div className="font-bold text-gray-800 text-sm leading-tight">Student {i}</div>
                            <div className="text-[10px] text-gray-400 font-medium">14 號 • 已提交</div>
                        </div>
                    </div>
                    {graded && (<div className="mt-3 p-2.5 bg-green-50/80 border border-green-100 rounded-xl rounded-tl-none text-xs text-green-800 leading-relaxed animate-in fade-in slide-in-from-left-2 shadow-sm"><span className="font-bold mr-1">🤖 AI:</span>觀念正確，但繪圖細節可加強。</div>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
};

// --- 10. AI 思考特效 ---
const AIProcessingOverlay = ({ isProcessing }: { isProcessing: boolean }) => {
  if (!isProcessing) return null;
  return (
    <div className="fixed inset-0 z-[100] bg-white/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center animate-in zoom-in duration-300 border border-indigo-100">
        <div className="relative w-24 h-24 mb-6">
           <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
           <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
           <BrainCircuit className="absolute inset-0 m-auto w-10 h-10 text-indigo-600 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">AI 正在深度閱讀...</h3>
        <div className="text-gray-500 text-sm flex flex-col items-center gap-1 font-medium">
            <span className="animate-pulse delay-75">分析課文語意結構...</span>
            <span className="animate-pulse delay-150">對照課綱學習重點...</span>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---
const ToolButton = ({ icon, label, active, activeColor = "bg-gray-100 text-gray-900", customClass = "", onClick }: any) => (
  <button onClick={onClick} className={`relative w-11 h-11 flex items-center justify-center rounded-full transition-all duration-200 ${active ? activeColor + ' scale-110' : `text-gray-400 hover:bg-gray-100 hover:text-gray-600 hover:scale-105 ${customClass}`}`} title={label}>
    {icon}
  </button>
);
const GridMenuItem = ({ icon, label, color }: any) => (
  <button className={`flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl transition-all ${color}`}><div className="scale-90">{icon}</div><span className="text-xs font-bold text-gray-600">{label}</span></button>
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
  const [currentTool, setCurrentTool] = useState('select');
  // 無限畫布狀態 (取代單純的 zoomLevel)
  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectionMenuPos, setSelectionMenuPos] = useState<any>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);

  // 繪圖與平移狀態
  const [penColor, setPenColor] = useState('#ef4444');
  const [penSize, setPenSize] = useState(3);
  const [strokes, setStrokes] = useState<any[]>([]);
  const [currentPoints, setCurrentPoints] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const [isPanning, setIsPanning] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // AI 便利貼
  const [aiMemos, setAiMemos] = useState<any[]>([]);

  // AI 觸發邏輯
  const handleAITrigger = () => {
    setSelectionMenuPos(null);
    setIsAIProcessing(true);
    setTimeout(() => { setIsAIProcessing(false); setIsQuizOpen(true); }, 1500);
  };

  const handleAIExplain = () => {
    const currentPos = selectionMenuPos || { top: 300, left: 500 };
    setSelectionMenuPos(null);
    setIsAIProcessing(true);
    setTimeout(() => {
        setIsAIProcessing(false);
        const newMemo = {
            id: Date.now(),
            x: currentPos.left + 250,
            y: currentPos.top,
            keyword: selectedText.substring(0, 10) + (selectedText.length > 10 ? '...' : ''),
            content: "這是 AI 根據上下文生成的重點摘要。粒線體透過呼吸作用產生 ATP，就像電池一樣為細胞提供能量。雙層膜結構增加了反應面積。",
        };
        setAiMemos(prev => [...prev, newMemo]);
    }, 1200);
  };

  // --- 畫布事件處理 ---
  
  // 1. 滾輪縮放
  const handleWheel = (e: React.WheelEvent) => {
    if (isQuizOpen || isDashboardOpen) return;
    e.preventDefault();
    const scaleAmount = -e.deltaY * 0.001;
    const newScale = Math.min(Math.max(0.5, viewport.scale + scaleAmount), 3);
    setViewport(prev => ({ ...prev, scale: newScale }));
  };

  // 2. 平移 (Pan) - 作用在容器上
  const handlePanStart = (e: React.MouseEvent) => {
    if (currentTool === 'pan' || e.button === 1) {
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

  // 3. 繪圖 (Draw) - 作用在 SVG 層
  const handleDrawStart = (e: React.MouseEvent) => {
    if (currentTool !== 'pen') return;
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    setCurrentPoints([`M ${offsetX} ${offsetY}`]);
  };
  const handleDrawMove = (e: React.MouseEvent) => {
    if (!isDrawing || currentTool !== 'pen') return;
    const { offsetX, offsetY } = e.nativeEvent;
    setCurrentPoints(prev => [...prev, `L ${offsetX} ${offsetY}`]);
  };
  const handleDrawEnd = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentPoints.length > 0) {
      setStrokes(prev => [...prev, { path: currentPoints.join(' '), color: penColor, size: penSize }]);
      setCurrentPoints([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 overflow-hidden flex flex-col">
      <TopNavigation isSidebarOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <AIProcessingOverlay isProcessing={isAIProcessing} />

      {/* --- 無限畫布容器 --- */}
      <div 
        className="flex-1 relative overflow-hidden bg-slate-100 cursor-auto"
        onMouseDown={handlePanStart}
        onMouseMove={handlePanMove}
        onMouseUp={handlePanEnd}
        onMouseLeave={handlePanEnd}
        onWheel={handleWheel}
        style={{ 
          cursor: currentTool === 'pan' || isPanning ? (isPanning ? 'grabbing' : 'grab') : 'default',
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: `${20 * viewport.scale}px ${20 * viewport.scale}px`
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
        />

        {/* 變形層 (Transform Layer) */}
        <div 
            className="w-full min-h-full flex justify-center py-20 origin-top-left transition-transform duration-75 ease-out will-change-transform"
            style={{ 
              transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
              pointerEvents: isPanning ? 'none' : 'auto' 
            }}
        >
            <div className="relative">
                 {/* 課本層 */}
                 <TextbookContent 
                    currentTool={currentTool}
                    onTextSelected={(data: any) => {
                       if (currentTool === 'pen' || currentTool === 'pan') return;
                       setSelectionMenuPos({ top: data.top, left: data.left });
                       setSelectedText(data.text);
                    }}
                    clearSelection={() => setSelectionMenuPos(null)}
                 />
                 
                 {/* 手寫塗鴉層 (Overlay) */}
                 <DrawingLayer 
                    active={currentTool === 'pen'}
                    strokes={strokes}
                    currentPath={currentPoints.join(' ')}
                    onDrawStart={handleDrawStart}
                    onDrawMove={handleDrawMove}
                    onDrawEnd={handleDrawEnd}
                    penColor={penColor}
                    penSize={penSize}
                 />

                 {/* AI 便利貼層 (Overlay) */}
                 {aiMemos.map(memo => (
                    <AIMemoCard 
                        key={memo.id} 
                        data={memo} 
                        onDelete={() => setAiMemos(prev => prev.filter(m => m.id !== memo.id))} 
                    />
                 ))}
            </div>
        </div>

        {/* Debug / Info */}
        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-mono text-gray-500 shadow-sm border border-gray-200 pointer-events-none select-none">
            {Math.round(viewport.scale * 100)}%
        </div>
      </div>

      {isSidebarOpen && (
         <div className="absolute right-0 top-0 bottom-0 w-80 bg-white border-l border-gray-200 shadow-xl z-40 animate-in slide-in-from-right duration-300 flex flex-col">
            <div className="p-4 border-b border-gray-100 font-bold text-gray-700 flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-indigo-600"/> AI 助教</div>
            <div className="p-4 flex-1 overflow-auto"><div className="bg-indigo-50 p-3 rounded-xl text-sm text-indigo-800 leading-relaxed">👋 老師好，我已經準備好協助您進行關於「細胞構造」的課程了。</div></div>
         </div>
      )}

      <SelectionFloatingMenu 
        position={selectionMenuPos} 
        onTrigger={handleAITrigger}
        onExplain={handleAIExplain}
        onMindMap={() => { alert("Demo: 這裡將生成心智圖節點"); setSelectionMenuPos(null); }}
      />
      <Modal isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} title="AI 智慧出題" icon={<FileQuestion className="w-5 h-5" />}><QuizPopupContent selectedText={selectedText} /></Modal>
      <Modal isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} title="隨堂練習儀表板" icon={<LayoutDashboard className="w-5 h-5" />} fullWidth><LoiLoDashboardContent /></Modal>
    </div>
  );
};

export default App;