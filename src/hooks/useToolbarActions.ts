// hooks/useToolbarActions.ts
// 統一管理工具列的所有 toggle 動作，減少 Props drilling

import { useUI } from '../context/UIContext';
import { useEditor } from '../context/EditorContext';

interface UseToolbarActionsOptions {
  onToggleAITutor?: () => void;
  onToggleWhiteboard?: () => void;
}

export function useToolbarActions(options: UseToolbarActionsOptions = {}) {
  const ui = useUI();
  const { state: editorState, dispatch: editorDispatch } = useEditor();

  return {
    // 工具狀態
    currentTool: editorState.currentTool,
    setCurrentTool: (tool: string) => editorDispatch({ type: 'SET_CURRENT_TOOL', payload: tool }),

    // 畫筆狀態
    penColor: editorState.penColor,
    setPenColor: (color: string) => editorDispatch({ type: 'SET_PEN_COLOR', payload: color }),
    penSize: editorState.penSize,
    setPenSize: (size: number) => editorDispatch({ type: 'SET_PEN_SIZE', payload: size }),

    // UI toggles (從 UIContext)
    onToggleTimer: () => ui.setTimerOpen(true),
    onToggleGrid: () => ui.setShowNavGrid(true),
    onOpenDashboard: () => ui.setDashboardOpen(true),
    onToggleSpotlight: () => ui.setWidgetMode(ui.widgetMode === 'spotlight' ? 'none' : 'spotlight'),
    onToggleLuckyDraw: () => ui.setLuckyDrawOpen(true),

    // 外部傳入的 toggles
    onToggleAITutor: options.onToggleAITutor,
    onToggleWhiteboard: options.onToggleWhiteboard,
  };
}
