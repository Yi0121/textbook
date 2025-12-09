import React, { useState, useEffect } from 'react';
import { 
  Box, ChevronRight, Minus, Plus, ChevronLeft, GripVertical 
} from 'lucide-react';

// 引入設定檔
import { 
  ALL_TOOLS, 
  getDefaultToolbarState, 
  type ToolConfig, 
  type UserRole 
} from '../../config/toolConfig';

interface FixedToolbarProps {
  userRole: UserRole;
  currentTool: string;
  setCurrentTool: (tool: string) => void;
  
  // 狀態
  zoomLevel: number;
  setZoomLevel: (level: any) => void;
  penColor: string;
  setPenColor: (color: string) => void;
  penSize: number;
  setPenSize: (size: number) => void;

  // Toggle 回呼函數
  onToggleTimer: () => void;
  onToggleGrid: () => void;
  onOpenDashboard: () => void;
  onToggleSpotlight?: () => void;
  onToggleLuckyDraw?: () => void;
  onToggleAITutor?: () => void; // 這一個函數會負責打開側邊欄
}

const COLORS = {
  pen: ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#000000'],
  highlighter: ['#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8'],
  text: ['#000000', '#64748b', '#ef4444', '#3b82f6']
};

const FixedToolbar: React.FC<FixedToolbarProps> = ({
  userRole,
  currentTool, setCurrentTool,
  zoomLevel, setZoomLevel,
  penColor, setPenColor, penSize, setPenSize,
  ...actions // 其餘的 toggle functions
}) => {

  const [visibleToolIds, setVisibleToolIds] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const [position, setPosition] = useState<'left' | 'center' | 'right'>('center');
  const [activeSubPanel, setActiveSubPanel] = useState<string | null>(null);

  // 初始化：根據角色載入工具
  useEffect(() => {
    setVisibleToolIds(getDefaultToolbarState(userRole));
  }, [userRole]);

  // --- 核心修改：點擊處理 ---
  const handleToolClick = (tool: ToolConfig) => {
    // 1. 切換模式類工具
    if (tool.actionType === 'set-tool' && tool.targetStateValue) {
      setCurrentTool(tool.targetStateValue);
      
      if (currentTool === tool.targetStateValue && tool.hasSubMenu) {
        setActiveSubPanel(prev => prev === tool.id ? null : tool.id);
      } else if (tool.hasSubMenu) {
        setActiveSubPanel(null); 
        if (tool.id === 'pen') { setPenColor('#ef4444'); setPenSize(4); }
        if (tool.id === 'highlighter') { setPenColor('#fef08a'); setPenSize(20); }
      } else {
        setActiveSubPanel(null);
      }
    }
    
    // 2. 開關類工具 (Toggle / Modal)
    else {
      switch (tool.id) {
        case 'timer': actions.onToggleTimer(); break;
        case 'nav_grid': actions.onToggleGrid(); break;
        case 'dashboard': actions.onOpenDashboard(); break;
        case 'spotlight': actions.onToggleSpotlight?.(); break;
        case 'lucky_draw': actions.onToggleLuckyDraw?.(); break;
        
        // 👇 [修復點] 把這兩個 ID 都連動到 onToggleAITutor
        case 'ai_tutor':    // 學生端按鈕 ID
        case 'ai_console':  // 老師端按鈕 ID
             actions.onToggleAITutor?.(); 
             break;
      }
      
      if (activeSubPanel === 'box') {
        setActiveSubPanel(null);
      }
    }
  };

  // --- 渲染子面板 ---
  const renderSubPanel = () => {
    if (!activeSubPanel) return null;

    if (['pen', 'highlighter', 'text'].includes(activeSubPanel)) {
       const colors = COLORS[activeSubPanel as keyof typeof COLORS] || [];
       return (
          <div className="flex flex-col gap-3 p-1 animate-in slide-in-from-bottom-2 duration-200">
             <div className="flex gap-2 justify-between">
                {colors.map(c => (
                   <button key={c} onClick={() => setPenColor(c)} 
                      className={`w-8 h-8 rounded-full border-2 transition-transform shadow-sm ${penColor === c ? 'border-indigo-500 scale-110 ring-2 ring-indigo-200' : 'border-white hover:scale-105'}`}
                      style={{ backgroundColor: c }}
                   />
                ))}
             </div>
             {activeSubPanel !== 'text' && (
                <div className="flex items-center gap-3 px-1 pt-1">
                   <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                   <input type="range" min="2" max={activeSubPanel === 'highlighter' ? 40 : 20} 
                      value={penSize} onChange={(e) => setPenSize(parseInt(e.target.value))} 
                      className="flex-1 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500" 
                   />
                   <div className="w-4 h-4 rounded-full bg-gray-300 transition-all" style={{ transform: `scale(${penSize/10 + 0.5})` }} />
                </div>
             )}
          </div>
       );
    }

    if (activeSubPanel === 'box') {
        const boxTools = ALL_TOOLS.filter(t => 
           (t.role === 'all' || t.role === userRole) && 
           !visibleToolIds.includes(t.id) && 
           ['widget', 'system', 'ai'].includes(t.category) // 包含 ai 類別以免遺漏
        );

        return (
            <div className="grid grid-cols-4 gap-2 min-w-[240px]">
                {boxTools.length === 0 && <div className="col-span-4 text-center text-xs text-gray-400 py-2">沒有更多工具了</div>}
                
                {boxTools.map((tool) => (
                    <button key={tool.id} onClick={() => handleToolClick(tool)} 
                        className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                        <div className={`p-2.5 rounded-xl ${tool.activeColorClass || 'bg-gray-100 text-gray-600'} group-hover:scale-110 transition-transform shadow-sm`}>
                            <tool.icon className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-bold text-gray-500">{tool.label}</span>
                    </button>
                ))}
            </div>
        );
    }
    return null;
  };

  const getPositionClasses = () => {
      const base = "fixed bottom-6 z-[60] transition-all duration-500 ease-spring";
      if (position === 'center') return `${base} left-1/2 -translate-x-1/2 flex flex-col items-center`;
      if (position === 'left') return `${base} left-6 flex flex-col items-start`;
      if (position === 'right') return `${base} right-6 flex flex-col items-end`;
      return base;
  };

  return (
    <div className={getPositionClasses()} onMouseDown={(e) => e.stopPropagation()}>
      
      {/* 子面板 */}
      <div className={`
        mb-3 bg-white/95 backdrop-blur-xl border border-white/60 shadow-xl rounded-2xl overflow-hidden
        transition-all duration-300 origin-bottom
        ${activeSubPanel ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-2 pointer-events-none h-0'}
      `}>
         <div className="p-3 min-w-[200px]">
            {renderSubPanel()}
         </div>
      </div>

      {/* 主工具列 */}
      <div className={`
         bg-white/90 backdrop-blur-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white/50
         rounded-2xl transition-all duration-500 flex items-center
         ${isExpanded ? 'p-1.5 gap-1' : 'w-14 h-14 justify-center cursor-pointer hover:scale-110 hover:shadow-2xl'}
      `}>
          {!isExpanded && (
            <button onClick={() => setIsExpanded(true)} className="w-full h-full flex items-center justify-center text-indigo-600">
                <Box className="w-6 h-6" />
            </button>
          )}

          {isExpanded && (
            <>
                <button onClick={() => setPosition(p => p === 'center' ? 'left' : p === 'left' ? 'right' : 'center')} 
                    className="w-6 h-10 flex items-center justify-center text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded-lg cursor-grab active:cursor-grabbing mr-1"
                >
                    <GripVertical className="w-4 h-4" />
                </button>

                {visibleToolIds.map((toolId) => {
                   const tool = ALL_TOOLS.find(t => t.id === toolId);
                   if(!tool) return null;

                   const isActive = (tool.actionType === 'set-tool' && currentTool === tool.targetStateValue) || 
                                    (activeSubPanel === tool.id);

                   return (
                      <button 
                        key={tool.id}
                        onClick={() => handleToolClick(tool)}
                        className={`
                           relative group w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200
                           ${isActive 
                              ? (tool.activeColorClass || 'bg-indigo-50 text-indigo-600 shadow-inner') 
                              : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 hover:-translate-y-0.5'}
                        `}
                        title={tool.label}
                      >
                         <tool.icon 
                            className="w-5 h-5 transition-colors" 
                            style={{ 
                               color: (isActive && ['pen', 'highlighter', 'text'].includes(tool.id)) ? penColor : 'currentColor' 
                            }} 
                         />
                         {tool.hasSubMenu && (
                            <div className={`absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full ${isActive ? 'bg-current opacity-50' : 'bg-gray-300'}`} />
                         )}
                      </button>
                   );
                })}

                <div className="w-px h-6 bg-gray-200 mx-1" />

                <div className="flex flex-col items-center gap-0.5 mx-1">
                   <button onClick={() => setZoomLevel((p:number) => Math.min(3, p+0.1))} className="p-0.5 text-gray-400 hover:text-indigo-600"><Plus className="w-3 h-3" /></button>
                   <span className="text-[9px] font-bold text-gray-400 font-mono">{Math.round(zoomLevel * 100)}%</span>
                   <button onClick={() => setZoomLevel((p:number) => Math.max(0.5, p-0.1))} className="p-0.5 text-gray-400 hover:text-indigo-600"><Minus className="w-3 h-3" /></button>
                </div>

                <div className="w-px h-6 bg-gray-200 mx-1" />

                <button onClick={() => setActiveSubPanel(p => p === 'box' ? null : 'box')}
                    className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all ${activeSubPanel === 'box' ? 'bg-purple-50 text-purple-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    title="百寶箱"
                >
                    <Box className="w-5 h-5" />
                </button>

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