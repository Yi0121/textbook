import { useState, useEffect } from 'react';
import { Box } from 'lucide-react';

// 引入 Context 和 Hook
import { useUI } from '../../context/UIContext';
import { useEditor } from '../../context/EditorContext';

// 引入設定檔
import {
  ALL_TOOLS,
  type ToolConfig,
  type UserRole
} from '../../config/toolConfig';

// 引入子組件
import {
  ToolbarPositionControls,
  ZoomControls,
  ColorPicker,
  WidgetBox,
  COLORS
} from './toolbar/index';

// 🔥 簡化後的 Props - 從 16 個減少到 4 個
interface FixedToolbarProps {
  userRole: UserRole;
  zoomLevel: number;
  setZoomLevel: (level: number | ((prev: number) => number)) => void;
  onToggleAITutor?: () => void;
  onToggleWhiteboard?: () => void;
}

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
      } else if (tool.targetStateValue === 'highlighter') {
        if (COLORS.pen.includes(penColor)) {
          setPenColor(COLORS.highlighter[0]);
        }
      }
    } else if (tool.actionType === 'toggle') {
      // 🔥 直接使用 UIContext，不再透過 Props
      switch (tool.id) {
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
      className={`fixed bottom-4 md:bottom-6 ${getPositionClass()} transition-all duration-300 z-[100] w-auto max-w-[95vw]`}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      {/* === 主工具列 === */}
      <div className="bg-white/95 backdrop-blur-xl shadow-2xl border border-white/20 p-1.5 md:p-2 rounded-2xl flex items-center gap-1 md:gap-2 ring-1 ring-black/5 overflow-x-auto scrollbar-hide">
        {/* 收合與位置控制 */}
        <ToolbarPositionControls
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          toolbarPosition={ui.toolbarPosition}
          setToolbarPosition={ui.setToolbarPosition}
        />

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
            <ZoomControls zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />

            <div className="w-px h-8 bg-gray-200 mx-1" />

            {/* 百寶箱按鈕 */}
            <button
              onClick={() => setActiveSubPanel(p => p === 'box' ? null : 'box')}
              className={`w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-lg md:rounded-xl transition-all shrink-0 ${
                activeSubPanel === 'box'
                  ? 'bg-purple-50 text-purple-600 shadow-sm ring-1 ring-purple-100'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
              title="百寶箱"
            >
              <Box className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </>
        )}
      </div>

      {/* === 彈出面板：調色盤 === */}
      {isExpanded && showColorPicker && ['pen', 'highlighter'].includes(currentTool) && (
        <ColorPicker
          currentTool={currentTool}
          penColor={penColor}
          setPenColor={setPenColor}
          penSize={penSize}
          setPenSize={setPenSize}
        />
      )}

      {/* === 彈出面板：百寶箱 === */}
      {isExpanded && activeSubPanel === 'box' && (
        <WidgetBox
          widgetTools={widgetTools}
          onToolClick={(tool) => {
            handleToolClick(tool);
            setActiveSubPanel(null);
          }}
          onClose={() => setActiveSubPanel(null)}
        />
      )}
    </div>
  );
};

export default FixedToolbar;
