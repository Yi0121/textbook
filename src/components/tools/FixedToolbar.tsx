import React, { useState, useEffect } from 'react';
import { 
  Box, ChevronRight, Minus, Plus, GripVertical,
  Users, // 學生上台圖示
  X
} from 'lucide-react';

// 引入 Context
import { useAppContext } from '../../context/AppContext';

// 引入設定檔
import { 
  ALL_TOOLS, 
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
  onToggleAITutor?: () => void;
}

// 定義顏色盤
const COLORS = {
  pen: ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#000000'],
  highlighter: ['#fef08a', '#bbf7d0', '#bfdbfe', '#ddd6fe', '#fbcfe8']
};

const FixedToolbar = ({ 
  userRole,
  currentTool,
  setCurrentTool,
  zoomLevel,
  setZoomLevel,
  penColor,
  setPenColor,
  penSize,
  setPenSize,
  onToggleTimer,
  onToggleGrid,
  onOpenDashboard,
  onToggleSpotlight,
  onToggleLuckyDraw,
  onToggleAITutor 
}: FixedToolbarProps) => {
    
  // 取得全域狀態與 Dispatch
  const { state, dispatch } = useAppContext(); 

  const [activeSubPanel, setActiveSubPanel] = useState<string | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // 監聽工具改變，如果選到畫筆就自動顯示調色盤
  useEffect(() => {
    if (['pen', 'highlighter'].includes(currentTool)) {
        setShowColorPicker(true);
    } else {
        setShowColorPicker(false);
    }
  }, [currentTool]);

  // 處理工具點擊
  const handleToolClick = (tool: ToolConfig) => {
  // 1. 設定工具模式
    if (tool.actionType === 'set-tool' && tool.targetStateValue) {
      setCurrentTool(tool.targetStateValue);

      // 🔥🔥🔥 新增這段邏輯：切換工具時，自動切換回該工具的預設顏色 🔥🔥🔥
      if (tool.targetStateValue === 'pen') {
          // 如果切回畫筆，且目前的顏色是螢光筆的顏色，就強制設回紅色(或畫筆的第一個顏色)
          if (COLORS.highlighter.includes(penColor)) {
              setPenColor(COLORS.pen[0]); 
          }
      } 
      else if (tool.targetStateValue === 'highlighter') {
          // 如果切回螢光筆，且目前的顏色是畫筆的顏色，就強制設回黃色
          if (COLORS.pen.includes(penColor)) {
              setPenColor(COLORS.highlighter[0]);
          }
      }
    }
    else if (tool.actionType === 'toggle') {
       switch(tool.id) {
           case 'console': onOpenDashboard(); break;
           case 'nav_grid': onToggleGrid(); break;
           case 'timer': onToggleTimer(); break;
           case 'spotlight': onToggleSpotlight && onToggleSpotlight(); break;
           case 'lucky_draw': onToggleLuckyDraw && onToggleLuckyDraw(); break;
           case 'ai_tutor': onToggleAITutor && onToggleAITutor(); break;
       }
    }
  };

  // 過濾要顯示在主工具列的工具 (核心工具 + 符合權限)
  const mainTools = ALL_TOOLS.filter(t => t.isCore && (t.role === 'all' || t.role === userRole));
  
  // 過濾要在百寶箱顯示的工具 (非核心 + 符合權限 + 非 AI 類)
  const widgetTools = ALL_TOOLS.filter(t => !t.isCore && t.role === userRole && t.category !== 'ai');

  return (
    // 🔥 關鍵修正：最外層加入 stopPropagation，防止點擊工具列時畫布也跟著畫畫
    <div 
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 transition-all duration-300 z-[100] ${isExpanded ? 'w-auto' : 'w-auto'}`}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
    >
       
       {/* === 主工具列 === */}
       <div className="bg-white/95 backdrop-blur-xl shadow-2xl border border-white/20 p-2 rounded-2xl flex items-center gap-2 ring-1 ring-black/5">

          {/* 收合按鈕 */}
          <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
             {isExpanded ? <GripVertical className="w-4 h-4" /> : <ChevronRight className="w-4 h-4"/>}
          </button>

          {isExpanded && (
            <>
              {/* 核心工具按鈕 */}
              {mainTools.map(tool => (
                 <button
                    key={tool.id}
                    onClick={() => handleToolClick(tool)}
                    className={`p-3 rounded-xl transition-all relative group
                        ${tool.targetStateValue === currentTool
                            ? (tool.activeColorClass || 'bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-100')
                            : 'text-gray-500 hover:bg-gray-100'
                        }
                    `}
                    title={tool.label}
                 >
                    <tool.icon className="w-5 h-5" />
                 </button>
              ))}

              <div className="w-px h-8 bg-gray-200 mx-1" />

              {/* 縮放控制 */}
               <div className="flex flex-col items-center gap-0.5 mx-1">
                   <button onClick={() => setZoomLevel((p:any) => Math.min(3, p+0.1))} className="p-0.5 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 rounded"><Plus className="w-3 h-3" /></button>
                   <span className="text-[9px] font-bold text-gray-400 font-mono select-none">{Math.round(zoomLevel * 100)}%</span>
                   <button onClick={() => setZoomLevel((p:any) => Math.max(0.5, p-0.1))} className="p-0.5 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 rounded"><Minus className="w-3 h-3" /></button>
                </div>

              <div className="w-px h-8 bg-gray-200 mx-1" />

              {/* 🔥 學生上台模式按鈕 (只有老師看得到) */}
              {userRole === 'teacher' && (
                  <button
                    onClick={() => dispatch({ type: 'TOGGLE_STUDENT_STAGE' })}
                    className={`
                        w-11 h-11 flex items-center justify-center rounded-xl transition-all relative group
                        ${state.isStudentStage 
                            ? 'bg-amber-100 text-amber-600 shadow-inner ring-1 ring-amber-200' 
                            : 'text-gray-500 hover:bg-gray-100'
                        }
                    `}
                    title="切換學生上台模式"
                  >
                    <Users className="w-5 h-5" />
                    
                    {/* 狀態燈：開啟時閃爍 */}
                    {state.isStudentStage && (
                        <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                        </span>
                    )}
                    
                    {/* Hover 提示 */}
                    <span className="absolute -top-10 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        {state.isStudentStage ? '學生作答中' : '學生上台'}
                    </span>
                  </button>
              )}

              {/* 分隔線 (只有老師需要，因為學生沒有上台按鈕) */}
              {userRole === 'teacher' && <div className="w-px h-8 bg-gray-200 mx-1" />}

              {/* 百寶箱按鈕 */}
              <button onClick={() => setActiveSubPanel(p => p === 'box' ? null : 'box')}
                    className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all ${activeSubPanel === 'box' ? 'bg-purple-50 text-purple-600 shadow-sm ring-1 ring-purple-100' : 'text-gray-500 hover:bg-gray-100'}`}
                    title="百寶箱"
              >
                    <Box className="w-5 h-5" />
              </button>
            </>
          )}
       </div>

       {/* === 彈出面板：調色盤 === */}
       {isExpanded && showColorPicker && ['pen', 'highlighter'].includes(currentTool) && (
          <div 
             className="absolute bottom-20 left-12 bg-white p-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-in slide-in-from-bottom-2 z-10"
             // 🔥 這裡也要加，以防萬一
             onMouseDown={(e) => e.stopPropagation()}
          >
             
             {/* 顏色選擇 */}
             <div className="flex gap-2">
                {(currentTool === 'pen' ? COLORS.pen : COLORS.highlighter).map(c => (
                    <button
                        key={c}
                        onClick={() => setPenColor(c)}
                        className={`w-6 h-6 rounded-full border border-gray-200 transition-transform ${penColor === c ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'hover:scale-110'}`}
                        style={{ backgroundColor: c }}
                    />
                ))}
             </div>
             
             <div className="w-px h-6 bg-gray-200" />
             
             {/* 筆刷大小 */}
             <div className="flex items-center gap-1">
                 <button onClick={() => setPenSize(Math.max(2, penSize - 2))} className="p-1 hover:bg-gray-100 rounded"><div className="w-1 h-1 bg-gray-800 rounded-full" /></button>
                 <button onClick={() => setPenSize(Math.min(20, penSize + 2))} className="p-1 hover:bg-gray-100 rounded"><div className="w-2.5 h-2.5 bg-gray-800 rounded-full" /></button>
             </div>
          </div>
       )}

       {/* === 彈出面板：百寶箱 === */}
       {isExpanded && activeSubPanel === 'box' && (
           <div 
               className="absolute bottom-20 right-0 bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/20 w-64 animate-in slide-in-from-bottom-2 ring-1 ring-black/5 z-10"
               // 🔥 這裡也要加
               onMouseDown={(e) => e.stopPropagation()}
           >
               <div className="flex justify-between items-center mb-3">
                   <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">課堂工具</h4>
                   <button onClick={() => setActiveSubPanel(null)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
               </div>
               
               <div className="grid grid-cols-3 gap-2">
                  {widgetTools.map(tool => (
                      <button
                        key={tool.id}
                        onClick={() => { handleToolClick(tool); setActiveSubPanel(null); }}
                        className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 text-gray-600 gap-2 transition-colors border border-transparent hover:border-indigo-100"
                      >
                         <tool.icon className="w-6 h-6" />
                         <span className="text-[10px] font-medium">{tool.label}</span>
                      </button>
                  ))}
               </div>
           </div>
       )}
    </div>
  );
};

export default FixedToolbar;