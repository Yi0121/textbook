import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LayoutDashboard, Sparkles } from 'lucide-react';

// --- Components Imports ---
import TopNavigation from './components/layout/TopNavigation';
import FixedToolbar from './components/tools/FixedToolbar';
import RightSidePanel from './components/layout/RightSidePanel';
import Modal from './components/ui/Modal';
import SelectionFloatingMenu from './components/ui/SelectionFloatingMenu';

// Canvas Components
import TextbookContent from './components/canvas/TextbookContent';
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
import { distanceBetween } from './utils/geometry';

// 引入型別定義
import { type UserRole } from './config/toolConfig';

const getTouchDistance = (touches: React.TouchList) => {
  return Math.hypot(
    touches[0].clientX - touches[1].clientX,
    touches[0].clientY - touches[1].clientY
  );
};

// 計算兩個觸控點的中心座標
const getTouchCenter = (touches: React.TouchList) => {
  return {
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  };
};

// 四格導航配置
const NAV_ZONES = [
    { id: 1, label: '課程大綱', description: '本章節學習重點與目標', x: 0, y: 0, color: 'bg-blue-500' },
    { id: 2, label: '核心觀念', description: '粒線體與細胞呼吸作用', x: 1200, y: 0, color: 'bg-green-500' },
    { id: 3, label: '實驗數據', description: 'ATP 生成效率分析圖表', x: 0, y: 800, color: 'bg-orange-500' },
    { id: 4, label: '課後練習', description: '隨堂測驗與重點複習', x: 1200, y: 800, color: 'bg-purple-500' },
];

const MemoizedTextbook = React.memo(TextbookContent);

const App = () => {
  // --- 1. UI & State ---
  
  // 角色與 AI 視窗狀態
  const [userRole, setUserRole] = useState<UserRole>('teacher'); 
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);     

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQuizPanelOpen, setIsQuizPanelOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [aiState, setAiState] = useState<'idle' | 'thinking' | 'done'>('idle');
  const [widgetMode, setWidgetMode] = useState<'none' | 'spotlight' | 'curtain'>('none');
  const [isLuckyDrawOpen, setIsLuckyDrawOpen] = useState(false);
  
  // 工具與導航狀態
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [showNavGrid, setShowNavGrid] = useState(false);
  
  // 畫布狀態
  const [currentTool, setCurrentTool] = useState('cursor');
  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });
  const [penColor, setPenColor] = useState('#ef4444');
  const [penSize, setPenSize] = useState(4);

  // 物件狀態
  const [strokes, setStrokes] = useState<any[]>([]);
  const [mindMaps, setMindMaps] = useState<any[]>([]);
  const [aiMemos, setAiMemos] = useState<any[]>([]);
  const [textObjects, setTextObjects] = useState<any[]>([]);

  // 互動暫存狀態
  const [laserPath, setLaserPath] = useState<{x: number, y: number, timestamp: number}[]>([]);
  const [selectionBox, setSelectionBox] = useState<any>(null); 
  const [selectionMenuPos, setSelectionMenuPos] = useState<any>(null);
  const [selectedText, setSelectedText] = useState('粒線體結構與功能');

  // Refs
  const isDrawing = useRef(false);
  const isPanning = useRef(false);
  const isSpacePressed = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastTouchDistance = useRef<number | null>(null);
  const isPinching = useRef(false);
  const selectionStart = useRef<{x: number, y: number} | null>(null);
  
  const previewPathRef = useRef<SVGPathElement>(null); 
  const currentPointsRef = useRef<string[]>([]);       
  const rawPointsRef = useRef<{x:number, y:number}[]>([]); 

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // --- 2. 核心邏輯 Helpers ---

  // 坐標轉換
  const getCanvasCoordinates = useCallback((e: React.MouseEvent | MouseEvent) => {
      if (!canvasRef.current) return { x: 0, y: 0 };
      const rect = canvasRef.current.getBoundingClientRect();
      return {
          x: (e.clientX - rect.left) / viewport.scale,
          y: (e.clientY - rect.top) / viewport.scale
      };
  }, [viewport.scale]);

  const handleObjUpdate = useCallback((id: number, data: any, type: 'memo' | 'mindmap' | 'text') => {
      if (type === 'memo') setAiMemos(p => p.map(m => m.id === id ? { ...m, x: m.x + data.dx, y: m.y + data.dy } : m));
      else if (type === 'mindmap') setMindMaps(p => p.map(m => m.id === id ? { ...m, x: m.x + data.dx, y: m.y + data.dy } : m));
      else if (type === 'text') setTextObjects(p => p.map(t => t.id === id ? { ...t, ...data } : t));
  }, []);

  const handleQuickNav = (targetX: number, targetY: number) => {
      setViewport({ x: -targetX, y: -targetY, scale: 1.0 });
      setShowNavGrid(false);
  };

  // --- 3. AI 功能邏輯 ---
  
  const simulateAIProcess = (callback: () => void) => {
      setSelectionMenuPos(null);
      setSelectionBox(null);
      setAiState('thinking');
      setTimeout(() => {
          setAiState('idle');
          callback();
      }, 1500);
  };

  const getSpawnPosition = () => {
      if (selectionMenuPos && canvasRef.current) {
          const rect = canvasRef.current.getBoundingClientRect();
          return { 
              x: (selectionMenuPos.left - rect.left) / viewport.scale + 50,
              y: (selectionMenuPos.top - rect.top) / viewport.scale 
          };
      }
      return { 
          x: (-viewport.x + window.innerWidth/2) / viewport.scale, 
          y: (-viewport.y + window.innerHeight/2) / viewport.scale 
      };
  };

  // 共通 Trigger
  const handleAITrigger = () => simulateAIProcess(() => { setIsQuizPanelOpen(true); setIsSidebarOpen(true); });

  // [學生功能] 解釋
  const handleAIExplain = () => {
    const pos = getSpawnPosition();
    simulateAIProcess(() => {
        setAiMemos(prev => [...prev, {
            id: Date.now(), x: pos.x, y: pos.y, keyword: "重點摘要", 
            content: "AI 分析：這段文字描述了粒線體(Mitochondria)作為細胞能量工廠的角色。"
        }]);
    });
  };

  // [學生功能] 心智圖
  const handleAIMindMap = () => {
      const pos = getSpawnPosition();
      simulateAIProcess(() => {
          setMindMaps(prev => [...prev, {
              id: Date.now(), x: pos.x, y: pos.y,
              nodes: [
                  { id: 'root', offsetX: 0, offsetY: 0, label: '粒線體', type: 'root' },
                  { id: '1', offsetX: 150, offsetY: -50, label: '結構', type: 'child' },
                  { id: '2', offsetX: 150, offsetY: 50, label: '功能', type: 'child' }
              ],
              edges: [ { source: 'root', target: '1' }, { source: 'root', target: '2' } ]
          }]);
      });
  };

  // [老師功能] 生成測驗
  const handleGenerateQuiz = () => {
    setSelectionBox(null);
    setSelectionMenuPos(null);
    setAiState('thinking');
    setTimeout(() => {
        setAiState('idle');
        setIsQuizPanelOpen(true);
        setIsSidebarOpen(true);
    }, 1000);
  };

  // [老師功能] 備課引導
  const handleLessonPlan = () => {
    const pos = getSpawnPosition();
    setSelectionBox(null);
    setSelectionMenuPos(null);
    setAiState('thinking');
    setTimeout(() => {
        setAiState('idle');
        setAiMemos(prev => [...prev, {
            id: Date.now(), x: pos.x, y: pos.y, 
            keyword: "教學建議", 
            content: "💡 教學引導：建議此處搭配 3D 模型展示 ATP 合成酶的旋轉機制，並提問學生關於原核生物的差異。"
        }]);
    }, 1000);
  };

  // --- 4. 滑鼠與繪圖事件 ---

  const handleMouseDown = (e: React.MouseEvent) => {
    if (currentTool === 'pan' || e.button === 1 || isSpacePressed.current) {
      isPanning.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      return;
    }

    const { x, y } = getCanvasCoordinates(e);

    if (currentTool === 'text') {
        setTextObjects(prev => [...prev, { id: Date.now(), x, y, text: "輸入筆記...", color: penColor, fontSize: 24 }]);
        setCurrentTool('cursor');
        return;
    }

    if (['pen', 'highlighter'].includes(currentTool)) {
        isDrawing.current = true;
        const startPoint = `M ${x} ${y}`;
        currentPointsRef.current = [startPoint];
        rawPointsRef.current = [{x, y}];
        if (previewPathRef.current) previewPathRef.current.setAttribute('d', startPoint);
    }
    
    if (currentTool === 'select') {
        isDrawing.current = true;
        selectionStart.current = { x, y };
        setSelectionBox({ x, y, width: 0, height: 0 }); 
        setSelectionMenuPos(null); 
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning.current) {
        const deltaX = e.clientX - lastMousePos.current.x;
        const deltaY = e.clientY - lastMousePos.current.y;
        setViewport(prev => ({ ...prev, x: prev.x + deltaX, y: prev.y + deltaY }));
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        return;
    }

    const { x, y } = getCanvasCoordinates(e);

    if (currentTool === 'laser' && e.buttons === 1) {
        setLaserPath(prev => [...prev, { x, y, timestamp: Date.now() }]);
        return;
    }

    if (currentTool === 'eraser' && e.buttons === 1) {
        const eraseRadius = 20 / viewport.scale;
        setStrokes(prev => prev.filter(s => {
             if (!s.rawPoints) return true;
             return !s.rawPoints.some((p:any) => distanceBetween(p, {x, y}) < eraseRadius);
        }));
        return;
    }

    if (!isDrawing.current) return;

    if (currentTool === 'select' && selectionStart.current) {
        const start = selectionStart.current;
        const width = x - start.x;
        const height = y - start.y;
        setSelectionBox({
            x: width > 0 ? start.x : x,
            y: height > 0 ? start.y : y,
            width: Math.abs(width),
            height: Math.abs(height)
        });
        return;
    }

    if (['pen', 'highlighter'].includes(currentTool)) {
        const pointCommand = `L ${x} ${y}`;
        currentPointsRef.current.push(pointCommand);
        rawPointsRef.current.push({x, y});
        if (previewPathRef.current) previewPathRef.current.setAttribute('d', currentPointsRef.current.join(' '));
    }
  };

  const handleMouseUp = () => {
    isPanning.current = false;
    if (!isDrawing.current) return;
    isDrawing.current = false;

    if (currentTool === 'select' && selectionBox) {
        if (selectionBox.width > 10 && selectionBox.height > 10) {
            if (canvasRef.current) {
                const rect = canvasRef.current.getBoundingClientRect();
                setSelectionMenuPos({ 
                    top: (selectionBox.y + selectionBox.height) * viewport.scale + rect.top, 
                    left: (selectionBox.x + selectionBox.width/2) * viewport.scale + rect.left 
                });
            }
        } else {
            setSelectionBox(null);
        }
        selectionStart.current = null;
        return;
    }

    if (['pen', 'highlighter'].includes(currentTool) && currentPointsRef.current.length > 0) {
        const finalPath = currentPointsRef.current.join(' ');
        const rawPoints = [...rawPointsRef.current];
        setStrokes(prev => [...prev, { 
            id: Date.now(),
            path: finalPath, color: penColor, size: penSize, tool: currentTool, rawPoints 
        }]);
        currentPointsRef.current = [];
        rawPointsRef.current = [];
        if (previewPathRef.current) previewPathRef.current.setAttribute('d', '');
    }
  };

  // --- 5. Global Events ---

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (e.code === 'Space') isSpacePressed.current = true;
          if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
              setStrokes(prev => prev.slice(0, -1));
          }
          if (e.key === 'Escape') {
              setSelectionBox(null);
              setSelectionMenuPos(null);
              setCurrentTool('cursor');
              setShowNavGrid(false);
          }
      };
      const handleKeyUp = (e: KeyboardEvent) => {
          if (e.code === 'Space') isSpacePressed.current = false;
      };
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      return () => {
          window.removeEventListener('keydown', handleKeyDown);
          window.removeEventListener('keyup', handleKeyUp);
      };
  }, []);

  useEffect(() => {
    if (laserPath.length === 0) return;
    let frameId: number;
    const animate = () => {
        const now = Date.now();
        setLaserPath(prev => {
            const next = prev.filter(p => now - p.timestamp < 500);
            return next.length === prev.length ? prev : next;
        });
        frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [laserPath]);

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
                  const rect = container.getBoundingClientRect();
                  const mouseX = e.clientX - rect.left;
                  const mouseY = e.clientY - rect.top;
                  const scaleRatio = newScale / prev.scale;
                  const newX = mouseX - (mouseX - prev.x) * scaleRatio;
                  const newY = mouseY - (mouseY - prev.y) * scaleRatio;
                  return { x: newX, y: newY, scale: newScale };
              });
          }
      };
      container.addEventListener('wheel', onWheel, { passive: false });
      return () => container.removeEventListener('wheel', onWheel);
  }, []);

  // --- Render ---
  return (
    <div className="h-screen w-screen bg-slate-50 overflow-hidden flex flex-col select-none overscroll-none">
      
      <TopNavigation 
        isSidebarOpen={isSidebarOpen || isQuizPanelOpen} 
        toggleSidebar={() => {setIsSidebarOpen(!isSidebarOpen); setIsQuizPanelOpen(!isQuizPanelOpen)}} 
      />
      
      {aiState === 'thinking' && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in slide-in-from-top-2 fade-in duration-300">
              <div className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-indigo-200 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-indigo-600 animate-spin" style={{ animationDuration: '3s' }} />
                  <span className="text-indigo-700 font-medium text-sm">AI 正在分析教材與筆跡...</span>
              </div>
          </div>
      )}

      {/* 主要畫布 Container */}
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden bg-slate-100 touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp} 
        onMouseLeave={handleMouseUp}
        
        onTouchStart={(e) => {
            if (e.touches.length === 2) {
                isPinching.current = true;
                isDrawing.current = false;
                lastTouchDistance.current = getTouchDistance(e.touches);
                return;
            }
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                const mouseEvent = { ...e, clientX: touch.clientX, clientY: touch.clientY, button: 0, buttons: 1 } as any;
                handleMouseDown(mouseEvent);
            }
        }}
        onTouchMove={(e) => {
            if (e.touches.length === 2 && isPinching.current && lastTouchDistance.current) {
                const newDistance = getTouchDistance(e.touches);
                const center = getTouchCenter(e.touches);
                const scaleFactor = newDistance / lastTouchDistance.current;
                lastTouchDistance.current = newDistance;
                setViewport(prev => {
                    const newScale = Math.min(Math.max(0.5, prev.scale * scaleFactor), 3);
                    const rect = containerRef.current!.getBoundingClientRect();
                    const mouseX = center.x - rect.left;
                    const mouseY = center.y - rect.top;
                    const scaleRatio = newScale / prev.scale;
                    const newX = mouseX - (mouseX - prev.x) * scaleRatio;
                    const newY = mouseY - (mouseY - prev.y) * scaleRatio;
                    return { x: newX, y: newY, scale: newScale };
                });
                return;
            }
            if (e.touches.length === 1 && !isPinching.current) {
                const touch = e.touches[0];
                const mouseEvent = { ...e, clientX: touch.clientX, clientY: touch.clientY, buttons: 1 } as any;
                handleMouseMove(mouseEvent);
            }
        }}
        onTouchEnd={() => {
            isPinching.current = false;
            lastTouchDistance.current = null;
            handleMouseUp();
        }}
        style={{ cursor: isPanning.current || isSpacePressed.current ? 'grabbing' : currentTool === 'cursor' ? 'default' : 'crosshair' }}
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

        {/* 內容層 */}
        <div 
            className="w-full h-full flex justify-center py-20 origin-top-left will-change-transform"
            style={{ transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})` }}
        >
            <div className="relative bg-white shadow-2xl ring-1 ring-black/5 rounded-2xl" ref={canvasRef} style={{ width: 1000, minHeight: 1400 }}>
                  
                  <MemoizedTextbook 
                    currentTool={currentTool}
                    onTextSelected={(data: any) => {
                       if ((currentTool !== 'cursor' && currentTool !== 'select') || !canvasRef.current) return; 
                       const rect = data.clientRect;
                       const baseRect = canvasRef.current.getBoundingClientRect();
                       setSelectionBox({
                           x: (rect.left - baseRect.left) / viewport.scale,
                           y: (rect.top - baseRect.top) / viewport.scale,
                           width: rect.width / viewport.scale,
                           height: rect.height / viewport.scale
                       });
                       setSelectionMenuPos({ top: rect.bottom, left: rect.left + rect.width/2 });
                       setSelectedText(data.text);
                    }}
                    clearSelection={() => {}}
                  />
                  
                  <DrawingLayer 
                    ref={previewPathRef} active={true} strokes={strokes}
                    penColor={penColor} penSize={penSize} currentTool={currentTool}
                    selectionBox={selectionBox} laserPath={laserPath}
                  />
                  
                  <div className={`absolute inset-0 z-10 ${['pen', 'highlighter', 'eraser', 'laser'].includes(currentTool) ? 'pointer-events-none' : ''}`}>
                     {mindMaps.map(map => (
                         <DraggableMindMap key={map.id} data={map} scale={viewport.scale} 
                            onUpdate={(id, dx, dy) => handleObjUpdate(id, {dx, dy}, 'mindmap')} 
                            onDelete={(id) => setMindMaps(p => p.filter(m => m.id !== id))}
                         />
                     ))}
                     {aiMemos.map(memo => (
                         <AIMemoCard key={memo.id} data={memo} scale={viewport.scale} 
                            onUpdate={(id, dx, dy) => handleObjUpdate(id, {dx, dy}, 'memo')} 
                            onDelete={() => setAiMemos(p => p.filter(m => m.id !== memo.id))} 
                         />
                     ))}
                     {textObjects.map(text => (
                         <DraggableText key={text.id} data={text} scale={viewport.scale}
                            onUpdate={(id, d) => handleObjUpdate(id, d, 'text')}
                            onDelete={(id) => setTextObjects(p => p.filter(t => t.id !== id))}
                         />
                     ))}
                  </div>
            </div>
        </div>

        {/* 工具列：依 userRole 顯示 */}
        <FixedToolbar 
            userRole={userRole}
            currentTool={currentTool} setCurrentTool={setCurrentTool}
            zoomLevel={viewport.scale} setZoomLevel={(s: any) => setViewport(prev => ({...prev, scale: typeof s === 'function' ? s(prev.scale) : s}))}
            penColor={penColor} setPenColor={setPenColor}
            penSize={penSize} setPenSize={setPenSize}
            onToggleTimer={() => setIsTimerOpen(true)}
            onToggleGrid={() => setShowNavGrid(true)}
            onOpenDashboard={() => setIsDashboardOpen(true)}
            onToggleSpotlight={() => setWidgetMode(p => p === 'spotlight' ? 'none' : 'spotlight')}
            onToggleLuckyDraw={() => setIsLuckyDrawOpen(true)}
            onToggleAITutor={() => setIsAITutorOpen(prev => !prev)}
        />
      </div>

      {/* 開發測試用：角色切換器 */}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 bg-black/80 p-2 rounded-lg text-white text-xs opacity-50 hover:opacity-100 transition-opacity">
          <div className="text-gray-400 font-bold mb-1">開發者模式:</div>
          <div className="flex gap-2">
            <button onClick={() => setUserRole('teacher')} className={`px-2 py-1 rounded ${userRole === 'teacher' ? 'bg-indigo-600' : 'bg-gray-700'}`}>老師端</button>
            <button onClick={() => setUserRole('student')} className={`px-2 py-1 rounded ${userRole === 'student' ? 'bg-purple-600' : 'bg-gray-700'}`}>學生端</button>
          </div>
      </div>

      {/* Widgets & Overlays */}
      <LuckyDraw isOpen={isLuckyDrawOpen} onClose={() => setIsLuckyDrawOpen(false)} />
      <ClassroomWidgets mode={widgetMode} onClose={() => setWidgetMode('none')} />
      <NavigationOverlay 
        isOpen={showNavGrid} onClose={() => setShowNavGrid(false)}
        zones={NAV_ZONES} onNavigate={handleQuickNav}
      />
      <FullScreenTimer isOpen={isTimerOpen} onClose={() => setIsTimerOpen(false)} />

      {/* AI 家教視窗 (學生端) */}
      {isAITutorOpen && (
          <div className="fixed right-6 bottom-24 w-80 h-96 bg-white shadow-2xl rounded-2xl border-2 border-purple-100 z-50 animate-in slide-in-from-right flex items-center justify-center">
             <div className="text-center text-gray-400">
                <span className="text-4xl block mb-2">🤖</span>
                <p>AI 家教對話視窗</p>
             </div>
          </div>
      )}

      {/* 選取選單：傳入角色與不同功能 */}
      <SelectionFloatingMenu 
          position={selectionMenuPos} 
          onClose={() => { setSelectionBox(null); setSelectionMenuPos(null); }}
          
          userRole={userRole}           
          onExplain={handleAIExplain}   
          onMindMap={handleAIMindMap}   
          onGenerateQuiz={handleGenerateQuiz} 
          onLessonPlan={handleLessonPlan}     
      />
      
      {/* 側邊欄：傳入角色以改變內容 */}
      <RightSidePanel 
          isOpen={isQuizPanelOpen} 
          onClose={() => {setIsQuizPanelOpen(false); setIsSidebarOpen(false)}} 
          selectedText={selectedText} 
          userRole={userRole} 
      />
      
      <Modal isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} title="學習數據儀表板" icon={<LayoutDashboard className="w-5 h-5" />} fullWidth>
          <DashboardContent />
      </Modal>
    </div>
  );
};

export default App;