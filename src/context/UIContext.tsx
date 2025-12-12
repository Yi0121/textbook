// ========================================
// 📁 src/context/UIContext.tsx
// 功能：管理 UI 狀態（開關、彈窗）
// ========================================
import { createContext, useContext, useState, type ReactNode } from 'react';

interface UIState {
  isSidebarOpen: boolean;
  isQuizPanelOpen: boolean;
  sidebarInitialTab: 'context' | 'chat';
  isDashboardOpen: boolean;
  isTimerOpen: boolean;
  showNavGrid: boolean;
  isLuckyDrawOpen: boolean;
  widgetMode: 'none' | 'spotlight' | 'curtain';
}

interface UIActions {
  setSidebarOpen: (v: boolean) => void;
  setQuizPanelOpen: (v: boolean) => void;
  setSidebarInitialTab: (v: 'context' | 'chat') => void;
  setDashboardOpen: (v: boolean) => void;
  setTimerOpen: (v: boolean) => void;
  setShowNavGrid: (v: boolean) => void;
  setLuckyDrawOpen: (v: boolean) => void;
  setWidgetMode: (v: 'none' | 'spotlight' | 'curtain') => void;
}

const UIContext = createContext<(UIState & UIActions) | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isQuizPanelOpen, setQuizPanelOpen] = useState(false);
  const [sidebarInitialTab, setSidebarInitialTab] = useState<'context' | 'chat'>('context');
  const [isDashboardOpen, setDashboardOpen] = useState(false);
  const [isTimerOpen, setTimerOpen] = useState(false);
  const [showNavGrid, setShowNavGrid] = useState(false);
  const [isLuckyDrawOpen, setLuckyDrawOpen] = useState(false);
  const [widgetMode, setWidgetMode] = useState<'none' | 'spotlight' | 'curtain'>('none');

  return (
    <UIContext.Provider
      value={{
        isSidebarOpen,
        isQuizPanelOpen,
        sidebarInitialTab,
        isDashboardOpen,
        isTimerOpen,
        showNavGrid,
        isLuckyDrawOpen,
        widgetMode,
        setSidebarOpen,
        setQuizPanelOpen,
        setSidebarInitialTab,
        setDashboardOpen,
        setTimerOpen,
        setShowNavGrid,
        setLuckyDrawOpen,
        setWidgetMode,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within UIProvider');
  return context;
}