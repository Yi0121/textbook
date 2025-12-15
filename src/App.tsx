import React, { useEffect, useRef } from 'react';
import { LayoutDashboard, Sparkles } from 'lucide-react';

// --- Components Imports (元件引入保持不變) ---
import TopNavigation from './components/layout/TopNavigation';
import FixedToolbar from './components/tools/FixedToolbar';
import RightSidePanel from './components/layout/RightSidePanel';
import Modal from './components/ui/Modal';
import SelectionFloatingMenu from './components/ui/SelectionFloatingMenu';

// Canvas Components
import TextbookEditor from './components/canvas/TextbookEditor';
import DrawingLayer from './components/canvas/DrawingLayer';
import DraggableMindMap from './components/canvas/DraggableMindMap';
import AIMemoCard from './components/canvas/AIMemoCard';
import DraggableText from './components/canvas/DraggableText';
import DashboardContent from './components/features/Dashboard';
import ClassroomWidgets from './components/features/ClassroomWidgets';
import LuckyDraw from './components/features/LuckyDraw';
import FullScreenTimer from './components/ui/FullScreenTimer';
import NavigationOverlay from './components/ui/NavigationOverlay';
import KeyboardShortcutsHelp from './components/ui/KeyboardShortcutsHelp';
import WelcomeTour from './components/ui/WelcomeTour';
import SkeletonCanvas from './components/ui/SkeletonCanvas';
import Whiteboard from './components/collaboration/Whiteboard';

// Utils
import { fetchAIImportedContent } from './utils/mockLLMService';

// 🔥 1. 引入重構後的 Context Hooks
import { useEditor } from './context/EditorContext';
import { useContent } from './context/ContentContext';
import { useUI } from './context/UIContext';
import { useCollaboration, useWhiteboardActions } from './context/CollaborationContext';

// 這是上一大步建立的「互動邏輯」檔案
import { useCanvasInteraction } from './hooks/useCanvasInteraction';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

import './index.css'

// (NAV_ZONES 和 memo 保持不變)
const NAV_ZONES = [
    { id: 1, label: '課程大綱', description: '本章節學習重點與目標', x: 0, y: 0, color: 'bg-blue-500' },
    { id: 2, label: '核心觀念', description: '粒線體與細胞呼吸作用', x: 1200, y: 0, color: 'bg-green-500' },
    { id: 3, label: '實驗數據', description: 'ATP 生成效率分析圖表', x: 0, y: 800, color: 'bg-orange-500' },
    { id: 4, label: '課後練習', description: '隨堂測驗與重點複習', x: 1200, y: 800, color: 'bg-purple-500' },
];

const MemoizedTextbook = React.memo(TextbookEditor);

const App = () => {
  // ==================== 1. 資料與狀態層 (Data & State) ====================
  // 🔥 使用重構後的 Context
  const { state: editorState, dispatch: editorDispatch } = useEditor();
  const { state: contentState, dispatch: contentDispatch } = useContent();
  const ui = useUI();
  const { state: collabState } = useCollaboration();
  const whiteboardActions = useWhiteboardActions();


  const prevStrokeCountRef = useRef(0);
  // 🔥 2. 修改原本的 useEffect
  useEffect(() => {
      // 只有當「現在的筆跡數量」 > 「原本的數量」時，代表是新增，才印 Log
      if (editorState.strokes.length > prevStrokeCountRef.current) {
          const lastStroke = editorState.strokes[editorState.strokes.length - 1];

          console.log('%c 🎨 新增筆跡 (New Stroke)', 'background: #22c55e; color: #fff; padding: 2px 4px; border-radius: 4px;');
          console.log('作者 (Author):', lastStroke.author);
          console.log('工具 (Tool):', lastStroke.tool);
          console.log('詳細資料:', lastStroke);
          console.log('--------------------------------');
      }
      // 如果數量變少 (例如橡皮擦)，我們就不印 Log，但還是要更新計數器
      else if (editorState.strokes.length < prevStrokeCountRef.current) {
          console.log('%c 🧹 橡皮擦已刪除筆跡', 'background: #cbd5e1; color: #334155; padding: 2px 4px; border-radius: 4px;');
      }

      // 更新計數器，供下次比對
      prevStrokeCountRef.current = editorState.strokes.length;

  }, [editorState.strokes]);

  // Helper 函式
  const userRole = editorState.userRole;
  const setUserRole = (role: 'teacher' | 'student') => editorDispatch({ type: 'SET_USER_ROLE', payload: role });
  const isEditMode = editorState.isEditMode;
  const setIsEditMode = (value: boolean) => editorDispatch({ type: 'SET_EDIT_MODE', payload: value });
  const currentTool = editorState.currentTool;
  const setCurrentTool = (tool: string) => editorDispatch({ type: 'SET_CURRENT_TOOL', payload: tool });

  // ⚠️ 為什麼這些還留在這裡？
  // Viewport (視角) 和 SelectionBox (選取框) 屬於「高頻率變動」且「只跟目前畫面有關」的狀態。
  // 雖然可以放 Context，但為了效能和簡單化，暫時保留在 App 層級也是常見做法。
  const [viewport, setViewport] = React.useState({ x: 0, y: 0, scale: 1 });
  const [selectionBox, setSelectionBox] = React.useState<any>(null);
  const [selectionMenuPos, setSelectionMenuPos] = React.useState<any>(null);

  // 這個只是範例文字，可以暫時保留
  const [selectedText, setSelectedText] = React.useState('粒線體結構與功能');

  // 🔥 鍵盤快捷鍵幫助面板狀態
  const [showShortcutsHelp, setShowShortcutsHelp] = React.useState(false);

  // 🔥 Onboarding 引導狀態 - 使用 localStorage 記住是否已完成
  const [showWelcomeTour, setShowWelcomeTour] = React.useState(() => {
    const hasCompletedTour = localStorage.getItem('hasCompletedTour');
    return hasCompletedTour !== 'true';
  });

  const handleCompleteTour = () => {
    localStorage.setItem('hasCompletedTour', 'true');
    setShowWelcomeTour(false);
  };

  const handleSkipTour = () => {
    localStorage.setItem('hasCompletedTour', 'true');
    setShowWelcomeTour(false);
  };

  // ==================== 2. DOM 參照 (Refs) ====================
  // 我們需要這些 Ref 來抓取 HTML 元素的位置，或者直接操作 DOM (如 SVG 路徑)
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const previewPathRef = useRef<SVGPathElement>(null); // 用來預覽正在畫的線

  // ==================== 3. 核心互動邏輯 (The Logic Hook) ====================
  // 🔥 這就是最關鍵的一步！
  // 我們把上面那些 Ref 和 State 設定函式，打包傳給 `useCanvasInteraction`。
  // 它會回傳我們需要的事件處理器 (handleMouseDown 等等)。
  // 這樣 App.tsx 就不用管「座標怎麼算」、「滑鼠左鍵還是右鍵」這些細節了。
  
  const interaction = useCanvasInteraction({
      viewport,
      setViewport,
      canvasRef,
      previewPathRef,
      setSelectionBox,
      setSelectionMenuPos
  });

  // ==================== 4. 副作用與其他邏輯 (Effects) ====================

  // 模擬初始載入
  useEffect(() => {
    // 模擬載入教材的過程（例如從 API 獲取資料）
    const timer = setTimeout(() => {
      contentDispatch({ type: 'SET_LOADING', payload: { isLoading: false } });
    }, 1500); // 1.5 秒後完成載入

    return () => clearTimeout(timer);
  }, [contentDispatch]);

  // 處理滾輪縮放 (這部分邏輯比較單純，保留在此即可)
  useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      const onWheel = (e: WheelEvent) => {
          if (e.ctrlKey || e.metaKey) {
              e.preventDefault();
              setViewport(prev => {
                  const zoomSensitivity = 0.002;
                  const delta = -e.deltaY * zoomSensitivity;
                  const newScale = Math.min(Math.max(0.5, prev.scale + delta), 3);
                  return { ...prev, scale: newScale };
              });
          }
      };
      container.addEventListener('wheel', onWheel, { passive: false });
      return () => container.removeEventListener('wheel', onWheel);
  }, []);


  // --- AI 功能函式 ---
  const handleImportContent = async () => {
    contentDispatch({ type: 'SET_AI_STATE', payload: 'thinking' });
    const newContent = await fetchAIImportedContent();
    contentDispatch({ type: 'SET_TEXTBOOK_CONTENT', payload: newContent });
    contentDispatch({ type: 'SET_AI_STATE', payload: 'idle' });
    setIsEditMode(true);
    setCurrentTool('cursor');
  };

  const simulateAIProcess = (callback: () => void) => {
      setSelectionMenuPos(null);
      setSelectionBox(null);
      contentDispatch({ type: 'SET_AI_STATE', payload: 'thinking' });
      setTimeout(() => {
          contentDispatch({ type: 'SET_AI_STATE', payload: 'idle' });
          callback();
      }, 1500);
  };

  const getSpawnPosition = () => {
      // 簡單的計算生成位置，避免重疊
      return { 
          x: (-viewport.x + window.innerWidth/2) / viewport.scale, 
          y: (-viewport.y + window.innerHeight/2) / viewport.scale 
      };
  };

  const handleToggleAITutor = () => {
      ui.setSidebarInitialTab('chat');
      if (ui.isQuizPanelOpen) {
          ui.setQuizPanelOpen(!ui.isQuizPanelOpen);
          ui.setSidebarOpen(!ui.isSidebarOpen);
      } else {
          ui.setQuizPanelOpen(true);
          ui.setSidebarOpen(true);
      }
  };

  const handleAIExplain = () => {
    const pos = getSpawnPosition();
    simulateAIProcess(() => editorDispatch({
      type: 'ADD_AI_MEMO',
      payload: {
        id: Date.now(), x: pos.x, y: pos.y, keyword: "重點摘要",
        content: "AI 分析：這段文字描述了粒線體(Mitochondria)作為細胞能量工廠的角色。"
      }
    }));
  };

  const handleAIMindMap = () => {
      const pos = getSpawnPosition();
      simulateAIProcess(() => editorDispatch({
        type: 'ADD_MIND_MAP',
        payload: {
          id: Date.now(), x: pos.x, y: pos.y,
          nodes: [
              { id: 'root', offsetX: 0, offsetY: 0, label: '粒線體', type: 'root' },
              { id: '1', offsetX: 150, offsetY: -50, label: '結構', type: 'child' },
              { id: '2', offsetX: 150, offsetY: 50, label: '功能', type: 'child' }
          ],
          edges: [ { source: 'root', target: '1' }, { source: 'root', target: '2' } ]
        }
      }));
  };

  const handleGenerateQuiz = () => {
    setSelectionBox(null);
    setSelectionMenuPos(null);
    contentDispatch({ type: 'SET_AI_STATE', payload: 'thinking' });
    setTimeout(() => {
        contentDispatch({ type: 'SET_AI_STATE', payload: 'idle' });
        ui.setSidebarInitialTab('context');
        ui.setQuizPanelOpen(true);
        ui.setSidebarOpen(true);
    }, 1000);
  };

  const handleLessonPlan = () => {
    const pos = getSpawnPosition();
    setSelectionBox(null);
    setSelectionMenuPos(null);
    contentDispatch({ type: 'SET_AI_STATE', payload: 'thinking' });
    setTimeout(() => {
        contentDispatch({ type: 'SET_AI_STATE', payload: 'idle' });
        editorDispatch({
          type: 'ADD_AI_MEMO',
          payload: {
            id: Date.now(), x: pos.x, y: pos.y, keyword: "教學建議",
            content: "💡 教學引導：建議此處搭配 3D 模型展示 ATP 合成酶的旋轉機制。"
          }
        });
    }, 1000);
  };

  const handleQuickNav = (targetX: number, targetY: number) => {
      setViewport({ x: -targetX, y: -targetY, scale: 1.0 });
      ui.setShowNavGrid(false);
  };

  const handleOpenWhiteboard = () => {
    // 如果沒有白板，創建一個新的
    if (collabState.whiteboards.length === 0) {
      whiteboardActions.createWhiteboard('協作白板', collabState.currentUserId);
    } else if (collabState.currentWhiteboardId === null) {
      // 如果有白板但沒打開，打開第一個
      whiteboardActions.openWhiteboard(collabState.whiteboards[0].id);
    } else {
      // 如果已經有打開的白板，重新打開
      whiteboardActions.openWhiteboard(collabState.currentWhiteboardId);
    }
  };

  const handleCloseWhiteboard = () => {
    whiteboardActions.closeWhiteboard();
  };

  // ==================== 6. 鍵盤快捷鍵設定 ====================
  const shortcuts = React.useMemo(() => [
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
      action: () => handleToggleAITutor()
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
  ], [userRole, isEditMode, setIsEditMode, setCurrentTool, ui, showShortcutsHelp, handleToggleAITutor]);

  // 啟用快捷鍵
  useKeyboardShortcuts({
    shortcuts,
    enabled: true,
    userRole
  });

  // ==================== 5. 畫面渲染 (Render) ====================
  return (
    <div className="h-screen w-screen bg-slate-50 dark:bg-gray-900 overflow-hidden flex flex-col select-none overscroll-none transition-colors">
      
      {/* 導覽列：透過 UI Hook 控制開關 + 開發者切換 */}
      <TopNavigation
        isSidebarOpen={ui.isSidebarOpen || ui.isQuizPanelOpen}
        toggleSidebar={() => {ui.setSidebarOpen(!ui.isSidebarOpen); ui.setQuizPanelOpen(!ui.isQuizPanelOpen)}}
        onShowShortcuts={() => setShowShortcutsHelp(true)}
        userRole={userRole}
        setUserRole={setUserRole}
        isEditMode={isEditMode}
        setIsEditMode={setIsEditMode}
        onImportContent={handleImportContent}
      />
      
      {/* AI 思考中動畫 */}
      {contentState.aiState === 'thinking' && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in slide-in-from-top-2 fade-in duration-300">
              <div className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-indigo-200 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-600 animate-spin" style={{ animationDuration: '3s' }} />
                  <span className="text-indigo-700 font-medium text-sm">AI 正在分析教材與筆跡...</span>
              </div>
          </div>
      )}

      {/* 🔥 主要畫布容器 
         注意這裡的事件綁定！我們直接使用 interaction.xxx 
         這樣 App.tsx 就不用知道滑鼠按下後發生了什麼事
      */}
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden bg-slate-100 dark:bg-gray-800 touch-none transition-colors"
        onMouseDown={interaction.handleMouseDown}
        onMouseMove={interaction.handleMouseMove}
        onMouseUp={interaction.handleMouseUp} 
        onMouseLeave={interaction.handleMouseUp}
        style={{ 
            // 游標樣式判斷：直接讀取 interaction 的狀態
            cursor: interaction.isPanning.current || interaction.isSpacePressed.current 
              ? 'grabbing' 
              : currentTool === 'cursor' ? 'default' : 'crosshair' 
        }}
      >
        {/* 背景網格 */}
        <div
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{
                backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                backgroundSize: `${20 * viewport.scale}px ${20 * viewport.scale}px`,
                backgroundPosition: `${viewport.x}px ${viewport.y}px`
            }}
        />

        {/* 可縮放區域 */}
        {contentState.isLoading ? (
          /* 載入中顯示骨架屏 */
          <SkeletonCanvas />
        ) : (
          <div
            className="w-full h-full flex justify-center py-20 origin-top-left will-change-transform"
            style={{ transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})` }}
          >
            <div className="relative bg-white dark:bg-gray-900 shadow-2xl ring-1 ring-black/5 rounded-2xl select-text" ref={canvasRef} style={{ width: 1000, minHeight: 1400 }}>

                  {/* 教科書內容 */}
                  <MemoizedTextbook
                    initialContent={contentState.textbookContent}
                    isEditable={isEditMode && userRole === 'teacher'}
                    currentTool={currentTool}
                    onTextSelected={(data: any) => setSelectedText(data.text)}
                    fileMeta={{
                        title: "Unit 3: Cellular Respiration",
                        version: isEditMode ? "v2.5 (Draft)" : "v2.4 (Published)",
                        lastModified: new Date().toLocaleDateString(),
                        tags: userRole === 'teacher' ? ["Teacher Edition", "Private"] : ["Student Edition"]
                    }}
                    clearSelection={() => {}}
                  />

                  {/* 繪圖層 */}
                  <DrawingLayer
                    ref={previewPathRef}
                    active={true}
                    strokes={editorState.strokes}
                    penColor={editorState.penColor}
                    penSize={editorState.penSize}
                    currentTool={currentTool}
                    selectionBox={selectionBox}
                    laserPath={editorState.laserPath}
                  />

                  {/* 物件層 (心智圖、便利貼、文字) */}
                  <div className={`absolute inset-0 z-10 ${
                      (['pen', 'highlighter', 'eraser', 'laser'].includes(currentTool) || isEditMode)
                        ? 'pointer-events-none'
                        : ''
                  }`}>
                      {editorState.mindMaps.map(map => (
                          <DraggableMindMap key={map.id} data={map} scale={viewport.scale}
                             onUpdate={(id, dx, dy) => editorDispatch({ type: 'UPDATE_MIND_MAP', payload: { id, dx, dy } })}
                             onDelete={(id) => editorDispatch({ type: 'DELETE_MIND_MAP', payload: id })}
                          />
                      ))}
                      {editorState.aiMemos.map(memo => (
                          <AIMemoCard key={memo.id} data={memo} scale={viewport.scale}
                             onUpdate={(id, dx, dy) => editorDispatch({ type: 'UPDATE_AI_MEMO', payload: { id, dx, dy } })}
                             onDelete={() => editorDispatch({ type: 'DELETE_AI_MEMO', payload: memo.id })}
                          />
                      ))}
                      {editorState.textObjects.map(text => (
                          <DraggableText key={text.id} data={text} scale={viewport.scale}
                             onUpdate={(id, d) => editorDispatch({ type: 'UPDATE_TEXT_OBJECT', payload: { id, data: d } })}
                             onDelete={(id) => editorDispatch({ type: 'DELETE_TEXT_OBJECT', payload: id })}
                          />
                      ))}
                  </div>
            </div>
          </div>
        )}

        {/* 底部工具列 */}
        <FixedToolbar
            userRole={userRole}
            currentTool={currentTool} setCurrentTool={setCurrentTool}
            zoomLevel={viewport.scale} setZoomLevel={(s: any) => setViewport(prev => ({...prev, scale: typeof s === 'function' ? s(prev.scale) : s}))}
            penColor={editorState.penColor} setPenColor={(c) => editorDispatch({type: 'SET_PEN_COLOR', payload: c})}
            penSize={editorState.penSize} setPenSize={(s) => editorDispatch({type: 'SET_PEN_SIZE', payload: s})}
            onToggleTimer={() => ui.setTimerOpen(true)}
            onToggleGrid={() => ui.setShowNavGrid(true)}
            onOpenDashboard={() => ui.setDashboardOpen(true)}
            onToggleSpotlight={() => ui.setWidgetMode(ui.widgetMode === 'spotlight' ? 'none' : 'spotlight')}
            onToggleLuckyDraw={() => ui.setLuckyDrawOpen(true)}
            onToggleAITutor={handleToggleAITutor}
            onToggleWhiteboard={handleOpenWhiteboard}
        />
      </div>


      {/* 各種彈窗與 Widgets：全部改用 ui.xxx 來控制 */}
      <LuckyDraw isOpen={ui.isLuckyDrawOpen} onClose={() => ui.setLuckyDrawOpen(false)} />
      <ClassroomWidgets mode={ui.widgetMode} onClose={() => ui.setWidgetMode('none')} />
      <NavigationOverlay 
        isOpen={ui.showNavGrid} onClose={() => ui.setShowNavGrid(false)}
        zones={NAV_ZONES} onNavigate={handleQuickNav}
      />
      <FullScreenTimer isOpen={ui.isTimerOpen} onClose={() => ui.setTimerOpen(false)} />

      <SelectionFloatingMenu 
          position={selectionMenuPos} 
          onClose={() => { setSelectionBox(null); setSelectionMenuPos(null); }}
          userRole={userRole}           
          onExplain={handleAIExplain}   
          onMindMap={handleAIMindMap}   
          onGenerateQuiz={handleGenerateQuiz} 
          onLessonPlan={handleLessonPlan}     
      />
      
      <RightSidePanel 
          isOpen={ui.isQuizPanelOpen} 
          onClose={() => {ui.setQuizPanelOpen(false); ui.setSidebarOpen(false)}} 
          selectedText={selectedText} 
          userRole={userRole} 
          initialTab={ui.sidebarInitialTab} 
      />
      
      <Modal isOpen={ui.isDashboardOpen} onClose={() => ui.setDashboardOpen(false)} title="學習數據儀表板" icon={<LayoutDashboard className="w-5 h-5" />} fullWidth>
          <DashboardContent />
      </Modal>

      {/* 鍵盤快捷鍵幫助 */}
      <KeyboardShortcutsHelp
          isOpen={showShortcutsHelp}
          onClose={() => setShowShortcutsHelp(false)}
          shortcuts={shortcuts}
      />

      {/* Onboarding 引導流程 */}
      {showWelcomeTour && (
        <WelcomeTour
          userRole={userRole}
          onComplete={handleCompleteTour}
          onSkip={handleSkipTour}
        />
      )}

      {/* 電子白板 */}
      {collabState.currentWhiteboardId && (
        <Whiteboard onClose={handleCloseWhiteboard} />
      )}
    </div>
  );
};

export default App;