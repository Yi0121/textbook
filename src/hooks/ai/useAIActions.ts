// hooks/useAIActions.ts
// 提取 AI 相關業務邏輯，減輕 App.tsx 的職責

import { useEditor } from '../../context/EditorContext';
import { useContent } from '../../context/ContentContext';
import { useUI } from '../../context/UIContext';

interface UseAIActionsOptions {
  viewport: { x: number; y: number; scale: number };
}

export function useAIActions({ viewport }: UseAIActionsOptions) {
  const { dispatch: editorDispatch } = useEditor();
  const { dispatch: contentDispatch } = useContent();
  const ui = useUI();

  // 計算物件生成位置（畫面中央）
  const getSpawnPosition = () => ({
    x: (-viewport.x + window.innerWidth / 2) / viewport.scale,
    y: (-viewport.y + window.innerHeight / 2) / viewport.scale,
  });

  // 清除選取狀態
  const clearSelection = () => {
    editorDispatch({ type: 'SET_SELECTION_BOX', payload: null });
    editorDispatch({ type: 'SET_SELECTION_MENU_POS', payload: null });
  };

  // 模擬 AI 處理過程
  const simulateAIProcess = (callback: () => void, duration = 1500) => {
    clearSelection();
    contentDispatch({ type: 'SET_AI_STATE', payload: 'thinking' });
    setTimeout(() => {
      contentDispatch({ type: 'SET_AI_STATE', payload: 'idle' });
      callback();
    }, duration);
  };

  // 開啟 AI 中控台面板（教師模式會預設 AI 助教 Tab）
  const handleToggleAITutor = () => {
    // 不設定 initialTab，讓 RightSidePanel 根據 userRole 決定預設 Tab
    if (ui.isQuizPanelOpen) {
      ui.setQuizPanelOpen(!ui.isQuizPanelOpen);
      ui.setSidebarOpen(!ui.isSidebarOpen);
    } else {
      ui.setQuizPanelOpen(true);
      ui.setSidebarOpen(true);
    }
  };

  // AI 解釋功能
  const handleAIExplain = () => {
    const pos = getSpawnPosition();
    simulateAIProcess(() =>
      editorDispatch({
        type: 'ADD_AI_MEMO',
        payload: {
          id: Date.now(),
          x: pos.x,
          y: pos.y,
          keyword: '重點摘要',
          content: 'AI 分析：這段文字描述了粒線體(Mitochondria)作為細胞能量工廠的角色。',
        },
      })
    );
  };

  // AI 心智圖功能
  const handleAIMindMap = () => {
    const pos = getSpawnPosition();
    simulateAIProcess(() =>
      editorDispatch({
        type: 'ADD_MIND_MAP',
        payload: {
          id: Date.now(),
          x: pos.x,
          y: pos.y,
          nodes: [
            { id: 'root', offsetX: 0, offsetY: 0, label: '粒線體', type: 'root' },
            { id: '1', offsetX: 150, offsetY: -50, label: '結構', type: 'child' },
            { id: '2', offsetX: 150, offsetY: 50, label: '功能', type: 'child' },
          ],
          edges: [
            { source: 'root', target: '1' },
            { source: 'root', target: '2' },
          ],
        },
      })
    );
  };

  // AI 生成測驗功能
  const handleGenerateQuiz = () => {
    clearSelection();
    contentDispatch({ type: 'SET_AI_STATE', payload: 'thinking' });
    setTimeout(() => {
      contentDispatch({ type: 'SET_AI_STATE', payload: 'idle' });
      ui.setSidebarInitialTab('context');
      ui.setQuizPanelOpen(true);
      ui.setSidebarOpen(true);
    }, 1000);
  };

  // AI 教學建議功能
  const handleLessonPlan = () => {
    const pos = getSpawnPosition();
    clearSelection();
    contentDispatch({ type: 'SET_AI_STATE', payload: 'thinking' });
    setTimeout(() => {
      contentDispatch({ type: 'SET_AI_STATE', payload: 'idle' });
      editorDispatch({
        type: 'ADD_AI_MEMO',
        payload: {
          id: Date.now(),
          x: pos.x,
          y: pos.y,
          keyword: '教學建議',
          content: '💡 教學引導：建議此處搭配 3D 模型展示 ATP 合成酶的旋轉機制。',
        },
      });
    }, 1000);
  };

  return {
    handleToggleAITutor,
    handleAIExplain,
    handleAIMindMap,
    handleGenerateQuiz,
    handleLessonPlan,
    clearSelection,
  };
}
