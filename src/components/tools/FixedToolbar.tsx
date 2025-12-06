import React, { useState, useEffect } from 'react';
import { 
  MousePointer2, Hand, ZoomIn, PenTool, Eraser, Zap, 
  Timer, Box, LayoutDashboard, ChevronRight, Minus, Plus, 
  X, Dices, Users, StickyNote, Scan, Highlighter, 
  Type, Grid2X2, GripVertical, ChevronLeft, Settings2
} from 'lucide-react';

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
  onToggleTimer: () => void;
  onToggleGrid: () => void;
  onToggleSpotlight?: () => void; // 新增
  onToggleCurtain?: () => void;   // 新增
  onToggleLuckyDraw?: () => void; // [新增]
}

// --- 1. 元件與設定分離 ---

const COLORS = {
  pen: ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#000000'],
  highlighter: ['#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8'],
  text: ['#000000', '#64748b', '#ef4444', '#3b82f6']
};

// 工具按鈕組件
const ToolButton = ({ icon: Icon, label, isActive, activeColor, onClick, hasSubMenu, subMenuColor }: any) => (
  <button 
    onClick={onClick} 
    className={`
      relative group w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200
      ${isActive 
        ? `${activeColor} scale-110 shadow-sm ring-1 ring-black/5` 
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
      }
    `} 
    title={label}
  >
    <Icon className="w-5 h-5" />
    {/* 子選單指示點 */}
    {hasSubMenu && (
      <div className={`absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full ${isActive ? 'bg-current' : 'bg-gray-300'}`} />
    )}
    {/* 顏色預覽小點 */}
    {subMenuColor && isActive && (
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-white shadow-sm" style={{ backgroundColor: subMenuColor }} />
    )}
  </button>
);

const Separator = () => <div className="w-px h-6 bg-gray-200 mx-1" />;

const FixedToolbar: React.FC<FixedToolbarProps> = ({ 
  currentTool, setCurrentTool, onOpenDashboard,
  zoomLevel, setZoomLevel,
  penColor, setPenColor, penSize, setPenSize,
  onToggleTimer, onToggleGrid, onToggleSpotlight, onToggleCurtain, onToggleLuckyDraw
}) => {
  
  // --- State ---
  const [isExpanded, setIsExpanded] = useState(true);
  const [position, setPosition] = useState<'left' | 'center' | 'right'>('center');
  const [activeSubPanel, setActiveSubPanel] = useState<'pen' | 'highlighter' | 'text' | 'zoom' | 'box' | null>(null);

  useEffect(() => {
    if (['pen', 'highlighter', 'text'].includes(currentTool)) {
       setActiveSubPanel(prev => (prev === 'box' || prev === 'zoom') ? null : (currentTool as any));
    } else {
       setActiveSubPanel(null);
    }
  }, [currentTool]);

  const handleToolClick = (tool: string, hasSettings = false) => {
    if (currentTool === tool && hasSettings) {
      setActiveSubPanel(activeSubPanel === tool ? null : tool as any);
    } else {
      setCurrentTool(tool);
      if (tool === 'pen') { setPenColor('#ef4444'); setPenSize(4); }
      if (tool === 'highlighter') { setPenColor('#fef08a'); setPenSize(20); }
      // [優化] 文字工具如果不重置顏色，可以讓使用者沿用上次選的顏色，這裡我先保留重置為黑色，你可以依需求移除這行
      if (tool === 'text') { setPenColor('#000000'); }
    }
  };

  const cyclePosition = () => {
      if (position === 'center') setPosition('left');
      if (position === 'left') setPosition('right');
      if (position === 'right') setPosition('center');
  };

  // --- Render Sub-Panels ---
  const renderSubPanel = () => {
    if (!activeSubPanel) return null;

    if (['pen', 'highlighter', 'text'].includes(activeSubPanel)) {
        const colors = COLORS[activeSubPanel as keyof typeof COLORS] || [];
        return (
            <div className="flex flex-col gap-3 p-1">
                <div className="flex gap-2 justify-between">
                    {colors.map(c => (
                        <button key={c} onClick={() => setPenColor(c)} 
                            className={`w-8 h-8 rounded-full border-2 transition-transform ${penColor === c ? 'border-indigo-500 scale-110' : 'border-transparent hover:scale-105'}`}
                            style={{ backgroundColor: c }}
                        />
                    ))}
                </div>
                {activeSubPanel !== 'text' && (
                    <div className="flex items-center gap-2 px-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        <input type="range" min="2" max={activeSubPanel === 'highlighter' ? 40 : 20} 
                            value={penSize} onChange={(e) => setPenSize(parseInt(e.target.value))} 
                            className="flex-1 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500" 
                        />
                        <div className="w-4 h-4 rounded-full bg-gray-300" />
                    </div>
                )}
            </div>
        );
    }

    if (activeSubPanel === 'zoom') {
        return (
            <div className="flex items-center gap-2 px-2">
                <button onClick={() => setZoomLevel((p:number) => Math.max(0.5, p-0.1))} className="p-2 hover:bg-gray-100 rounded-lg"><Minus className="w-4 h-4" /></button>
                <span className="font-mono font-bold w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
                <button onClick={() => setZoomLevel((p:number) => Math.min(3, p+0.1))} className="p-2 hover:bg-gray-100 rounded-lg"><Plus className="w-4 h-4" /></button>
            </div>
        );
    }

if (activeSubPanel === 'box') {
        const items = [
            { icon: Dices, 
                label: '抽籤', 
                color: 'text-purple-600 bg-purple-50', 
                onClick: () => { onToggleLuckyDraw?.(); setActiveSubPanel(null); } 
            },
            
            { icon: Users, label: '分組', color: 'text-blue-600 bg-blue-50', onClick: () => console.log('分組') },
            
            // 這裡直接使用 onToggleSpotlight (不需要 props.)
            { 
                icon: MousePointer2, 
                label: '聚光燈', 
                color: 'text-emerald-600 bg-emerald-50', 
                onClick: () => { onToggleSpotlight?.(); setActiveSubPanel(null); } 
            },
            
            // 這裡直接使用 onToggleCurtain (不需要 props.)
            { 
                icon: StickyNote, 
                label: '遮幕', 
                color: 'text-orange-600 bg-orange-50', 
                onClick: () => { onToggleCurtain?.(); setActiveSubPanel(null); } 
            },
        ];
        return (
            <div className="grid grid-cols-4 gap-2">
                {items.map((item, idx) => (
                    <button key={idx} onClick={item.onClick} className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                        <div className={`p-2 rounded-xl ${item.color} group-hover:scale-110 transition-transform`}>
                            <item.icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-500">{item.label}</span>
                    </button>
                ))}
            </div>
        );
    }
  };
  const getPositionClasses = () => {
      const base = "fixed bottom-6 z-[60] transition-all duration-500 ease-spring";
      if (position === 'center') return `${base} left-1/2 -translate-x-1/2 flex flex-col items-center`;
      if (position === 'left') return `${base} left-6 flex flex-col items-start`;
      if (position === 'right') return `${base} right-6 flex flex-col items-end`;
      return base;
  };

  return (
    // [重點修改] 加入 onMouseDown={(e) => e.stopPropagation()} 防止點擊工具列穿透到畫布
    <div className={getPositionClasses()} onMouseDown={(e) => e.stopPropagation()}>
      
      {/* 1. 子面板 */}
      <div className={`
        mb-3 bg-white/90 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl overflow-hidden
        transition-all duration-300 origin-bottom
        ${activeSubPanel ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none h-0'}
      `}>
         <div className="p-3">
            {renderSubPanel()}
         </div>
      </div>

      {/* 2. 主工具列 */}
      <div className={`
         bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/50
         rounded-2xl transition-all duration-500 flex items-center
         ${isExpanded ? 'p-2 gap-1' : 'w-14 h-14 justify-center cursor-pointer hover:scale-110'}
      `}>
          {!isExpanded && (
            <button onClick={() => setIsExpanded(true)} className="w-full h-full flex items-center justify-center text-indigo-600">
                <PenTool className="w-6 h-6" />
            </button>
          )}

          {isExpanded && (
            <>
                {/* 停靠控制手把 */}
                <button onClick={cyclePosition} className="w-6 h-10 flex items-center justify-center text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-grab active:cursor-grabbing mr-1" title="切換位置 (左/中/右)">
                    <GripVertical className="w-4 h-4" />
                </button>

                <ToolButton icon={MousePointer2} label="一般選取" isActive={currentTool === 'cursor'} activeColor="bg-indigo-100 text-indigo-700" onClick={() => setCurrentTool('cursor')} />
                <ToolButton icon={Scan} label="範圍選取" isActive={currentTool === 'select'} activeColor="bg-indigo-100 text-indigo-700" onClick={() => setCurrentTool('select')} />
                <ToolButton icon={Hand} label="平移畫布" isActive={currentTool === 'pan'} activeColor="bg-blue-50 text-blue-600" onClick={() => setCurrentTool('pan')} />
                
                <Separator />

                <ToolButton icon={PenTool} label="畫筆" 
                    isActive={currentTool === 'pen'} activeColor="bg-gray-900 text-white" hasSubMenu 
                    onClick={() => handleToolClick('pen', true)} 
                />
                <ToolButton icon={Highlighter} label="螢光筆" 
                    isActive={currentTool === 'highlighter'} activeColor="bg-yellow-100 text-yellow-700" hasSubMenu subMenuColor={currentTool === 'highlighter' ? penColor : null}
                    onClick={() => handleToolClick('highlighter', true)} 
                />
                <ToolButton icon={Type} label="文字" 
                    isActive={currentTool === 'text'} activeColor="bg-slate-100 text-slate-900" hasSubMenu 
                    onClick={() => handleToolClick('text', true)} 
                />
                <ToolButton icon={Eraser} label="橡皮擦" isActive={currentTool === 'eraser'} activeColor="bg-rose-50 text-rose-600" onClick={() => setCurrentTool('eraser')} />

                <Separator />

                <ToolButton icon={Grid2X2} label="導航" isActive={false} activeColor="" onClick={onToggleGrid} />
                <ToolButton icon={Timer} label="計時器" isActive={false} activeColor="" onClick={onToggleTimer} />
                <ToolButton icon={Box} label="百寶箱" isActive={activeSubPanel === 'box'} activeColor="bg-purple-100 text-purple-700" onClick={() => setActiveSubPanel(activeSubPanel === 'box' ? null : 'box')} />
                
                <Separator />

                <ToolButton icon={ZoomIn} label="縮放" isActive={activeSubPanel === 'zoom'} activeColor="bg-gray-100 text-gray-900" onClick={() => setActiveSubPanel(activeSubPanel === 'zoom' ? null : 'zoom')} />
                <ToolButton icon={LayoutDashboard} label="數據儀表板" isActive={false} activeColor="" onClick={onOpenDashboard} />
                
                <button onClick={() => setIsExpanded(false)} className="ml-1 w-8 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <ChevronLeft className="w-5 h-5" />
                </button>
            </>
          )}
      </div>
    </div>
  );
};

export default FixedToolbar;