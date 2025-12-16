import { useState, useEffect } from 'react';
import {
  Box, ChevronRight, Minus, Plus, GripVertical,
  X, MoveLeft, MoveRight
} from 'lucide-react';

// 引入 Context 和 Hook
import { useUI } from '../../context/UIContext';
import { useEditor } from '../../context/EditorContext';

// 引入設定檔
import {
  ALL_TOOLS,
  type ToolConfig,
  type UserRole
} from '../../config/toolConfig';

// 🔥 簡化後的 Props - 從 16 個減少到 4 個
interface FixedToolbarProps {
  userRole: UserRole;
  zoomLevel: number;
  setZoomLevel: (level: number | ((prev: number) => number)) => void;
  onToggleAITutor?: () => void;
  onToggleWhiteboard?: () => void;
}

// 定義顏色盤
const COLORS = {
  pen: ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#000000'],
  highlighter: ['#fef08a', '#bbf7d0', '#bfdbfe', '#ddd6fe', '#fbcfe8']
};

const FixedToolbar = ({
  userRole,
  zoomLevel,
  setZoomLevel,
  onToggleAITutor,
  onToggleWhiteboard
}: FixedToolbarProps) => {

  // 🔥 直接從 Context 取得狀態，不再透過 Props
  const ui = useUI();
  const { state: editorState, dispatch: editorDispatch } = useEditor();

  // 從 Context 取得工具和畫筆狀態
  const currentTool = editorState.currentTool;
  const setCurrentTool = (tool: string) => editorDispatch({ type: 'SET_CURRENT_TOOL', payload: tool });
  const penColor = editorState.penColor;
  const setPenColor = (color: string) => editorDispatch({ type: 'SET_PEN_COLOR', payload: color });
  const penSize = editorState.penSize;
  const setPenSize = (size: number) => editorDispatch({ type: 'SET_PEN_SIZE', payload: size });

  // 本地 UI 狀態
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

      // 切換工具時，自動切換回該工具的預設顏色
      if (tool.targetStateValue === 'pen') {
          if (COLORS.highlighter.includes(penColor)) {
              setPenColor(COLORS.pen[0]);
          }
      }
      else if (tool.targetStateValue === 'highlighter') {
          if (COLORS.pen.includes(penColor)) {
              setPenColor(COLORS.highlighter[0]);
          }
      }
    }
    else if (tool.actionType === 'toggle') {
       // 🔥 直接使用 UIContext，不再透過 Props
       switch(tool.id) {
           case 'dashboard': ui.setDashboardOpen(true); break;
           case 'ai_console': onToggleAITutor?.(); break;
           case 'nav_grid': ui.setShowNavGrid(true); break;
           case 'timer': ui.setTimerOpen(true); break;
           case 'spotlight': ui.setWidgetMode(ui.widgetMode === 'spotlight' ? 'none' : 'spotlight'); break;
           case 'lucky_draw': ui.setLuckyDrawOpen(true); break;
           case 'ai_tutor': onToggleAITutor?.(); break;
           case 'whiteboard': onToggleWhiteboard?.(); break;
       }
    }
  };

  // 過濾要顯示在主工具列的工具 (核心工具 + 符合權限)
  const mainTools = ALL_TOOLS.filter(t => t.isCore && (t.role === 'all' || t.role === userRole));

  // 過濾要在百寶箱顯示的工具 (非核心 + 符合權限 + 非 AI 類)
  const widgetTools = ALL_TOOLS.filter(t => !t.isCore && t.role === userRole && t.category !== 'ai');

  // 計算工具列位置
  const getPositionClass = () => {
    if (ui.toolbarPosition === 'left') return 'left-4 md:left-6';
    if (ui.toolbarPosition === 'right') return 'right-4 md:right-6';
    return 'left-1/2 -translate-x-1/2';
  };

  return (
    <div
        className={`fixed bottom-4 md:bottom-6 ${getPositionClass()} transition-all duration-300 z-[100] ${isExpanded ? 'w-auto' : 'w-auto'} max-w-[95vw]`}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
    >

       {/* === 主工具列 === */}
       <div className="bg-white/95 backdrop-blur-xl shadow-2xl border border-white/20 p-1.5 md:p-2 rounded-2xl flex items-center gap-1 md:gap-2 ring-1 ring-black/5 overflow-x-auto scrollbar-hide">

          {/* 收合與位置控制 */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              title={isExpanded ? '收合工具列' : '展開工具列'}
            >
              {isExpanded ? <GripVertical className="w-4 h-4" /> : <ChevronRight className="w-4 h-4"/>}
            </button>

            {/* 位置切換按鈕 */}
            {isExpanded && (
              <div className="flex items-center gap-0.5 border-l border-gray-200 pl-1 ml-1">
                <button
                  onClick={() => ui.setToolbarPosition('left')}
                  className={`p-1 rounded transition-colors ${
                    ui.toolbarPosition === 'left'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                  title="移到左側"
                >
                  <MoveLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => ui.setToolbarPosition('center')}
                  className={`p-1 rounded transition-colors ${
                    ui.toolbarPosition === 'center'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                  title="置中"
                >
                  <GripVertical className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => ui.setToolbarPosition('right')}
                  className={`p-1 rounded transition-colors ${
                    ui.toolbarPosition === 'right'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  }`}
                  title="移到右側"
                >
                  <MoveRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {isExpanded && (
            <>
              {/* 核心工具按鈕 */}
              {mainTools.map(tool => (
                 <button
                    key={tool.id}
                    onClick={() => handleToolClick(tool)}
                    className={`p-2 md:p-3 rounded-lg md:rounded-xl transition-all relative group shrink-0
                        ${tool.targetStateValue === currentTool
                            ? (tool.activeColorClass || 'bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-100')
                            : 'text-gray-500 hover:bg-gray-100'
                        }
                    `}
                    title={tool.label}
                 >
                    <tool.icon className="w-4 h-4 md:w-5 md:h-5" />
                 </button>
              ))}

              <div className="w-px h-8 bg-gray-200 mx-1" />

              {/* 縮放控制 */}
               <div className="hidden sm:flex flex-col items-center gap-0.5 mx-1 shrink-0">
                   <button onClick={() => setZoomLevel(p => Math.min(3, p + 0.1))} className="p-0.5 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 rounded"><Plus className="w-3 h-3" /></button>
                   <span className="text-[9px] font-bold text-gray-400 font-mono select-none">{Math.round(zoomLevel * 100)}%</span>
                   <button onClick={() => setZoomLevel(p => Math.max(0.5, p - 0.1))} className="p-0.5 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 rounded"><Minus className="w-3 h-3" /></button>
                </div>

              <div className="w-px h-8 bg-gray-200 mx-1" />

              {/* 百寶箱按鈕 */}
              <button onClick={() => setActiveSubPanel(p => p === 'box' ? null : 'box')}
                    className={`w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-lg md:rounded-xl transition-all shrink-0 ${activeSubPanel === 'box' ? 'bg-purple-50 text-purple-600 shadow-sm ring-1 ring-purple-100' : 'text-gray-500 hover:bg-gray-100'}`}
                    title="百寶箱"
              >
                    <Box className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </>
          )}
       </div>

       {/* === 彈出面板：調色盤 === */}
       {isExpanded && showColorPicker && ['pen', 'highlighter'].includes(currentTool) && (
          <div
             className="absolute bottom-20 left-12 bg-white p-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-in slide-in-from-bottom-2 z-10"
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
