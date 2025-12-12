import React, { useEffect, useRef } from 'react';
import { LayoutDashboard, Sparkles, UserCog } from 'lucide-react';

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

// Utils
import { fetchAIImportedContent } from './utils/mockLLMService';

// 🔥 1. 引入我們做好的 Context Hooks 和 Interaction Hook
import { 
    useAppContext, 
    useUserRole, 
    useEditMode, 
    useCurrentTool, 
    useUIState, 
    useCanvasData,
    useAIState 
} from './context/AppContext';

// 這是上一大步建立的「互動邏輯」檔案
import { useCanvasInteraction } from './hooks/useCanvasInteraction';

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
  // 這裡我們不再用 useState 宣告一堆變數，而是從 Context 領取

  const { state, dispatch } = useAppContext(); // 取得全域 state (用來讀取顏色、雷射筆路徑等)

  
  const prevStrokeCountRef = useRef(0);
  // 🔥 2. 修改原本的 useEffect
  useEffect(() => {
      // 只有當「現在的筆跡數量」 > 「原本的數量」時，代表是新增，才印 Log
      if (state.strokes.length > prevStrokeCountRef.current) {
          const lastStroke = state.strokes[state.strokes.length - 1];
          
          console.log('%c 🎨 新增筆跡 (New Stroke)', 'background: #22c55e; color: #fff; padding: 2px 4px; border-radius: 4px;');
          console.log('作者 (Author):', lastStroke.author);
          console.log('工具 (Tool):', lastStroke.tool);
          console.log('詳細資料:', lastStroke);
          console.log('--------------------------------');
      }
      // 如果數量變少 (例如橡皮擦)，我們就不印 Log，但還是要更新計數器
      else if (state.strokes.length < prevStrokeCountRef.current) {
          console.log('%c 🧹 橡皮擦已刪除筆跡', 'background: #cbd5e1; color: #334155; padding: 2px 4px; border-radius: 4px;');
      }

      // 更新計數器，供下次比對
      prevStrokeCountRef.current = state.strokes.length;

  }, [state.strokes]);
  
  // 這些 Helper Hooks 幫我們簡化了程式碼
  const [userRole, setUserRole] = useUserRole();
  const [isEditMode, setIsEditMode] = useEditMode();
  const [currentTool, setCurrentTool] = useCurrentTool();
  
  const ui = useUIState();       // 所有 UI 開關都在這
  const ai = useAIState();       // AI 思考狀態在這
  const canvas = useCanvasData(); // 畫布上的物件 (筆跡、便利貼) 在這

  // ⚠️ 為什麼這些還留在這裡？
  // Viewport (視角) 和 SelectionBox (選取框) 屬於「高頻率變動」且「只跟目前畫面有關」的狀態。
  // 雖然可以放 Context，但為了效能和簡單化，暫時保留在 App 層級也是常見做法。
  const [viewport, setViewport] = React.useState({ x: 0, y: 0, scale: 1 });
  const [selectionBox, setSelectionBox] = React.useState<any>(null); 
  const [selectionMenuPos, setSelectionMenuPos] = React.useState<any>(null);
  
  // 這個只是範例文字，可以暫時保留
  const [selectedText, setSelectedText] = React.useState('粒線體結構與功能');

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
      containerRef,
      canvasRef,
      previewPathRef,
      setSelectionBox,
      setSelectionMenuPos
  });

  // ==================== 4. 副作用與其他邏輯 (Effects) ====================

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


  // --- AI 功能函式 (保持不變，但內部改呼叫新的 Hook 方法) ---
  const handleImportContent = async () => {
    ai.setAiState('thinking');
    const newContent = await fetchAIImportedContent();
    ai.setTextbookContent(newContent);
    ai.setAiState('idle');
    setIsEditMode(true);
    setCurrentTool('cursor');
  };
  
  const simulateAIProcess = (callback: () => void) => {
      setSelectionMenuPos(null);
      setSelectionBox(null);
      ai.setAiState('thinking');
      setTimeout(() => {
          ai.setAiState('idle');
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
    simulateAIProcess(() => canvas.addAIMemo({
        id: Date.now(), x: pos.x, y: pos.y, keyword: "重點摘要", 
        content: "AI 分析：這段文字描述了粒線體(Mitochondria)作為細胞能量工廠的角色。"
    }));
  };

  const handleAIMindMap = () => {
      const pos = getSpawnPosition();
      simulateAIProcess(() => canvas.addMindMap({
          id: Date.now(), x: pos.x, y: pos.y,
          nodes: [
              { id: 'root', offsetX: 0, offsetY: 0, label: '粒線體', type: 'root' },
              { id: '1', offsetX: 150, offsetY: -50, label: '結構', type: 'child' },
              { id: '2', offsetX: 150, offsetY: 50, label: '功能', type: 'child' }
          ],
          edges: [ { source: 'root', target: '1' }, { source: 'root', target: '2' } ]
      }));
  };

  const handleGenerateQuiz = () => {
    setSelectionBox(null);
    setSelectionMenuPos(null);
    ai.setAiState('thinking');
    setTimeout(() => {
        ai.setAiState('idle');
        ui.setSidebarInitialTab('context');
        ui.setQuizPanelOpen(true);
        ui.setSidebarOpen(true);
    }, 1000);
  };

  const handleLessonPlan = () => {
    const pos = getSpawnPosition();
    setSelectionBox(null);
    setSelectionMenuPos(null);
    ai.setAiState('thinking');
    setTimeout(() => {
        ai.setAiState('idle');
        canvas.addAIMemo({
            id: Date.now(), x: pos.x, y: pos.y, keyword: "教學建議", 
            content: "💡 教學引導：建議此處搭配 3D 模型展示 ATP 合成酶的旋轉機制。"
        });
    }, 1000);
  };

  const handleQuickNav = (targetX: number, targetY: number) => {
      setViewport({ x: -targetX, y: -targetY, scale: 1.0 });
      ui.setShowNavGrid(false);
  };

  // ==================== 5. 畫面渲染 (Render) ====================
  return (
    <div className="h-screen w-screen bg-slate-50 overflow-hidden flex flex-col select-none overscroll-none">
      
      {/* 導覽列：透過 UI Hook 控制開關 */}
      <TopNavigation 
        isSidebarOpen={ui.isSidebarOpen || ui.isQuizPanelOpen} 
        toggleSidebar={() => {ui.setSidebarOpen(!ui.isSidebarOpen); ui.setQuizPanelOpen(!ui.isQuizPanelOpen)}} 
      />
      
      {/* AI 思考中動畫 */}
      {ai.aiState === 'thinking' && (
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
        className="flex-1 relative overflow-hidden bg-slate-100 touch-none"
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
        <div 
            className="w-full h-full flex justify-center py-20 origin-top-left will-change-transform"
            style={{ transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})` }}
        >
            <div className="relative bg-white shadow-2xl ring-1 ring-black/5 rounded-2xl select-text" ref={canvasRef} style={{ width: 1000, minHeight: 1400 }}>
                  
                  {/* 教科書內容 */}
                  <MemoizedTextbook
                    initialContent={ai.textbookContent}
                    isEditable={isEditMode && userRole === 'teacher'} 
                    currentTool={currentTool}
                    onTextSelected={(data: any) => setSelectedText(data.text)} // 這裡可以根據需要調整
                    fileMeta={{
                        title: "Unit 3: Cellular Respiration",
                        version: isEditMode ? "v2.5 (Draft)" : "v2.4 (Published)",
                        lastModified: new Date().toLocaleDateString(),
                        tags: userRole === 'teacher' ? ["Teacher Edition", "Private"] : ["Student Edition"]
                    }}
                    clearSelection={() => {}}
                  />
                  
                  {/* 繪圖層 
                     注意：我們把 previewPathRef 傳進去，讓 Hook 可以控制預覽線 
                     資料來源則是從 canvas (Context) 讀取
                  */}
                  <DrawingLayer 
                    ref={previewPathRef} 
                    active={true} 
                    strokes={canvas.strokes} 
                    penColor={state.penColor} 
                    penSize={state.penSize} 
                    currentTool={currentTool}
                    selectionBox={selectionBox} 
                    laserPath={state.laserPath}
                  />
                  
                  {/* 物件層 (心智圖、便利貼、文字) */}
                  <div className={`absolute inset-0 z-10 ${
                      (['pen', 'highlighter', 'eraser', 'laser'].includes(currentTool) || isEditMode) 
                        ? 'pointer-events-none' 
                        : ''
                  }`}>
                      {/* 資料直接從 Context 的 canvas.mindMaps 拿，不用 App 自己管 */}
                      {canvas.mindMaps.map(map => (
                          <DraggableMindMap key={map.id} data={map} scale={viewport.scale} 
                             onUpdate={(id, dx, dy) => canvas.updateObject(id, {dx, dy}, 'mindmap')} 
                             onDelete={(id) => canvas.deleteMindMap(id)}
                          />
                      ))}
                      {canvas.aiMemos.map(memo => (
                          <AIMemoCard key={memo.id} data={memo} scale={viewport.scale} 
                             onUpdate={(id, dx, dy) => canvas.updateObject(id, {dx, dy}, 'memo')} 
                             onDelete={() => canvas.deleteAIMemo(memo.id)} 
                          />
                      ))}
                      {canvas.textObjects.map(text => (
                          <DraggableText key={text.id} data={text} scale={viewport.scale}
                             onUpdate={(id, d) => canvas.updateObject(id, d, 'text')}
                             onDelete={(id) => canvas.deleteTextObject(id)}
                          />
                      ))}
                  </div>
            </div>
        </div>

        {/* 底部工具列 */}
        <FixedToolbar 
            userRole={userRole}
            currentTool={currentTool} setCurrentTool={setCurrentTool}
            zoomLevel={viewport.scale} setZoomLevel={(s: any) => setViewport(prev => ({...prev, scale: typeof s === 'function' ? s(prev.scale) : s}))}
            penColor={state.penColor} setPenColor={(c) => dispatch({type: 'SET_PEN_COLOR', payload: c})}
            penSize={state.penSize} setPenSize={(s) => dispatch({type: 'SET_PEN_SIZE', payload: s})}
            onToggleTimer={() => ui.setTimerOpen(true)}
            onToggleGrid={() => ui.setShowNavGrid(true)}
            onOpenDashboard={() => ui.setDashboardOpen(true)}
            onToggleSpotlight={() => ui.setWidgetMode(ui.widgetMode === 'spotlight' ? 'none' : 'spotlight')}
            onToggleLuckyDraw={() => ui.setLuckyDrawOpen(true)}
            onToggleAITutor={handleToggleAITutor} 
        />
      </div>

      {/* 開發者切換按鈕 (簡化顯示) */}
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 bg-black/90 px-4 py-2 rounded-full text-white text-xs backdrop-blur-md shadow-2xl transition-all hover:scale-105 border border-white/10">
          <div className="flex items-center gap-2">
            <UserCog className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 font-bold hidden sm:inline">開發者:</span>
          </div>
          <div className="flex bg-gray-700/50 rounded-full p-1">
            <button onClick={() => { setUserRole('teacher'); setIsEditMode(false); }} className={`px-3 py-1 rounded-full transition-all duration-300 font-medium ${userRole === 'teacher' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>老師</button>
            <button onClick={() => { setUserRole('student'); setIsEditMode(false); }} className={`px-3 py-1 rounded-full transition-all duration-300 font-medium ${userRole === 'student' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>學生</button>
          </div>
          {userRole === 'teacher' && (
            <>
              <div className="w-px h-4 bg-gray-600 mx-1"></div>
              <button onClick={handleImportContent} className="px-3 py-1 rounded-full font-bold transition-all flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg"><Sparkles className="w-3 h-3" /> AI 匯入</button>
              <div className="w-px h-4 bg-gray-600 mx-1"></div>
              <button onClick={() => { const next = !isEditMode; setIsEditMode(next); if (next) setCurrentTool('cursor'); }} className={`px-3 py-1 rounded-full font-bold transition-all flex items-center gap-1 ${isEditMode ? 'bg-emerald-500 text-white shadow-lg' : 'bg-gray-700 text-gray-300'}`}>{isEditMode ? '💾 完成' : '✏️ 編輯'}</button>
            </>
          )}
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
    </div>
  );
};

export default App;