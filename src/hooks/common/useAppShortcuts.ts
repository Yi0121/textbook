// hooks/useAppShortcuts.ts
// 集中管理 App 層級的鍵盤快捷鍵定義

import { useMemo } from 'react';
import type { UserRole } from '../config/toolConfig';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  description: string;
  action: () => void;
  role?: 'teacher' | 'student';
}

interface UseAppShortcutsOptions {
  userRole: UserRole;
  isEditMode: boolean;
  showShortcutsHelp: boolean;
  setIsEditMode: (v: boolean) => void;
  setCurrentTool: (tool: string) => void;
  setViewport: React.Dispatch<React.SetStateAction<{ x: number; y: number; scale: number }>>;
  setShowShortcutsHelp: (v: boolean) => void;
  ui: {
    isDashboardOpen: boolean;
    isTimerOpen: boolean;
    showNavGrid: boolean;
    isLuckyDrawOpen: boolean;
    isSidebarOpen: boolean;
    isQuizPanelOpen: boolean;
    setShowNavGrid: (v: boolean) => void;
    setDashboardOpen: (v: boolean) => void;
    setTimerOpen: (v: boolean) => void;
    setLuckyDrawOpen: (v: boolean) => void;
    setSidebarOpen: (v: boolean) => void;
    setQuizPanelOpen: (v: boolean) => void;
  };
  aiActions: {
    handleToggleAITutor: () => void;
  };
}

export function useAppShortcuts(options: UseAppShortcutsOptions): ShortcutConfig[] {
  const {
    userRole,
    isEditMode,
    showShortcutsHelp,
    setIsEditMode,
    setCurrentTool,
    setViewport,
    setShowShortcutsHelp,
    ui,
    aiActions,
  } = options;

  return useMemo(() => [
    // 編輯模式
    {
      key: 'e',
      ctrl: true,
      description: '切換編輯模式',
      action: () => {
        if (userRole === 'teacher') {
          const next = !isEditMode;
          setIsEditMode(next);
          if (next) setCurrentTool('cursor');
        }
      },
      role: 'teacher' as const
    },
    // 工具切換
    {
      key: 'v',
      description: '選取工具',
      action: () => setCurrentTool('cursor')
    },
    {
      key: 'p',
      description: '畫筆工具',
      action: () => setCurrentTool('pen')
    },
    {
      key: 'h',
      description: '螢光筆工具',
      action: () => setCurrentTool('highlighter')
    },
    {
      key: 'e',
      description: '橡皮擦工具',
      action: () => setCurrentTool('eraser')
    },
    {
      key: 't',
      description: '文字工具',
      action: () => setCurrentTool('text')
    },
    // 導航
    {
      key: 'g',
      description: '開啟章節導航',
      action: () => ui.setShowNavGrid(true),
      role: 'teacher' as const
    },
    {
      key: '0',
      ctrl: true,
      description: '重置縮放',
      action: () => setViewport(prev => ({ ...prev, scale: 1 }))
    },
    {
      key: '=',
      ctrl: true,
      description: '放大',
      action: () => setViewport(prev => ({ ...prev, scale: Math.min(3, prev.scale + 0.1) }))
    },
    {
      key: '-',
      ctrl: true,
      description: '縮小',
      action: () => setViewport(prev => ({ ...prev, scale: Math.max(0.5, prev.scale - 0.1) }))
    },
    // AI 功能
    {
      key: 'k',
      ctrl: true,
      description: '開啟 AI 對話',
      action: () => aiActions.handleToggleAITutor()
    },
    // 幫助
    {
      key: '?',
      description: '顯示快捷鍵說明',
      action: () => setShowShortcutsHelp(true)
    },
    {
      key: 'Escape',
      description: '關閉彈窗',
      action: () => {
        if (showShortcutsHelp) setShowShortcutsHelp(false);
        else if (ui.isDashboardOpen) ui.setDashboardOpen(false);
        else if (ui.isTimerOpen) ui.setTimerOpen(false);
        else if (ui.showNavGrid) ui.setShowNavGrid(false);
        else if (ui.isLuckyDrawOpen) ui.setLuckyDrawOpen(false);
        else if (ui.isSidebarOpen || ui.isQuizPanelOpen) {
          ui.setSidebarOpen(false);
          ui.setQuizPanelOpen(false);
        }
      }
    }
  ], [userRole, isEditMode, setIsEditMode, setCurrentTool, setViewport, ui, showShortcutsHelp, setShowShortcutsHelp, aiActions]);
}
