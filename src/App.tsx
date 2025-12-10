import React, { useState, useEffect, useRef, useCallback } from 'react';
import { LayoutDashboard, Sparkles, UserCog } from 'lucide-react';

// --- Components Imports ---
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
import { distanceBetween } from './utils/geometry';
import { fetchAIImportedContent } from './utils/mockLLMService'; // 🔥 1. 確保引入模擬服務

// 引入型別定義
import { type UserRole } from './config/toolConfig';

import './index.css'

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

const MemoizedTextbook = React.memo(TextbookEditor);

const App = () => {
  // --- 1. UI & State ---
  
  // 角色狀態
  const [userRole, setUserRole] = useState<UserRole>('teacher');
  const [isEditMode, setIsEditMode] = useState(false); 

  // 🔥 2. 新增：儲存教材內容 (從 RAG 匯入或是預設)
  const [textbookContent, setTextbookContent] = useState<any>(undefined);
  
  // 側邊欄控制 (取代原本的 AI 視窗狀態)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);      // 控制 TopNavigation 的狀態同步
  const [isQuizPanelOpen, setIsQuizPanelOpen] = useState(false);  // 控制 RightSidePanel 的開關
  const [sidebarInitialTab, setSidebarInitialTab] = useState<'context' | 'chat'>('context'); // 控制打開時的分頁

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

  // 🔥 3. 新增：處理 RAG 匯入的函式
  const handleImportContent = async () => {
    // 進入思考模式 (顯示 Loading)
    setAiState('thinking');
    
    // 呼叫模擬 API (這會等待 2 秒)
    const newContent = await fetchAIImportedContent();
    
    // 更新內容
    setTextbookContent(newContent);
    setAiState('idle');
    
    // 自動切換到編輯模式讓老師修改
    setIsEditMode(true);
    setCurrentTool('cursor');
  };
  
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

  // [修改] 觸發 AI 對話 (點擊工具列上的按鈕)
  const handleToggleAITutor = () => {
      setSidebarInitialTab('chat'); // 設定預設分頁為聊天
      
      if (isQuizPanelOpen) {
          setIsQuizPanelOpen(prev => !prev);
          setIsSidebarOpen(prev => !prev);
      } else {
          setIsQuizPanelOpen(true);
          setIsSidebarOpen(true);
      }
  };

  // [修改] 觸發 AI 分析 (點擊懸浮選單)
  const handleAITrigger = () => simulateAIProcess(() => { 
      setSidebarInitialTab('context'); // 設定預設分頁為內容分析
      setIsQuizPanelOpen(true); 
      setIsSidebarOpen(true); 
  });

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

  // [老師功能] 生成測驗 (連動側邊欄)
  const handleGenerateQuiz = () => {
    setSelectionBox(null);
    setSelectionMenuPos(null);
    setAiState('thinking');
    setTimeout(() => {
        setAiState('idle');
        setSidebarInitialTab('context'); // 切換到內容分析/測驗頁
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
    // 🔥 如果是編輯模式，且沒按住空白鍵，就直接 Return，讓 TextbookEditor 接管事件
    if (isEditMode && !isSpacePressed.current) return;

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
    
    // 選取工具邏輯 (允許操作，但工具列顯示由 Config 控制)
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
            <div className="relative bg-white shadow-2xl ring-1 ring-black/5 rounded-2xl select-text" ref={canvasRef} style={{ width: 1000, minHeight: 1400 }}>
                  
                  <MemoizedTextbook
                    initialContent={textbookContent} // 🔥 4. 傳入模擬匯入的內容
                    isEditable={isEditMode && userRole === 'teacher'} 
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
                    fileMeta={{
                        title: "Unit 3: Cellular Respiration", // 展示用英文或中文皆可
                        version: isEditMode ? "v2.5 (Draft)" : "v2.4 (Published)", // 編輯模式時顯示 Draft，超有感！
                        lastModified: new Date().toLocaleDateString(),
                        tags: userRole === 'teacher' ? ["Teacher Edition", "Private"] : ["Student Edition"]
                    }}
                    clearSelection={() => {}}
                  />
                  
                  <DrawingLayer 
                    ref={previewPathRef} active={true} strokes={strokes}
                    penColor={penColor} penSize={penSize} currentTool={currentTool}
                    selectionBox={selectionBox} laserPath={laserPath}
                  />
                  
                  {/* 🔥 修改：如果是編輯模式，讓透明層 pointer-events-none (穿透)，這樣才能點到下方的文字 */}
                  <div className={`absolute inset-0 z-10 ${
                      (['pen', 'highlighter', 'eraser', 'laser'].includes(currentTool) || isEditMode) 
                        ? 'pointer-events-none' 
                        : ''
                  }`}>
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

        {/* 工具列 */}
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
            onToggleAITutor={handleToggleAITutor} 
        />
      </div>

       {/* 開發者模式與工具列 (置中顯示於頂部) */}
       <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 bg-black/90 px-4 py-2 rounded-full text-white text-xs backdrop-blur-md shadow-2xl transition-all hover:scale-105 border border-white/10">
          <div className="flex items-center gap-2">
            <UserCog className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 font-bold hidden sm:inline">開發者:</span>
          </div>
          <div className="flex bg-gray-700/50 rounded-full p-1">
            <button onClick={() => { setUserRole('teacher'); setIsEditMode(false); }} className={`px-3 py-1 rounded-full transition-all duration-300 font-medium ${userRole === 'teacher' ? 'bg-indigo-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>老師</button>
            <button onClick={() => { setUserRole('student'); setIsEditMode(false); }} className={`px-3 py-1 rounded-full transition-all duration-300 font-medium ${userRole === 'student' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>學生</button>
          </div>

          {/* 🔥 5. 老師專屬工具 (AI 匯入 + 編輯) */}
          {userRole === 'teacher' && (
            <>
              <div className="w-px h-4 bg-gray-600 mx-1"></div>
              
              {/* AI 匯入按鈕 */}
              <button 
                onClick={handleImportContent}
                className="px-3 py-1 rounded-full font-bold transition-all flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg"
                title="模擬：從 RAG 系統匯入新教材"
              >
                <Sparkles className="w-3 h-3" />
                AI 匯入
              </button>

              <div className="w-px h-4 bg-gray-600 mx-1"></div>

              {/* 編輯模式切換按鈕 */}
              <button 
                onClick={() => {
                    const nextMode = !isEditMode;
                    setIsEditMode(nextMode);
                    if (nextMode) setCurrentTool('cursor'); // 自動切回鼠標
                }}
                className={`px-3 py-1 rounded-full font-bold transition-all flex items-center gap-1 ${
                   isEditMode 
                     ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                     : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {isEditMode ? '💾 完成' : '✏️ 編輯'}
              </button>
            </>
          )}
      </div>

      {/* Widgets & Overlays */}
      <LuckyDraw isOpen={isLuckyDrawOpen} onClose={() => setIsLuckyDrawOpen(false)} />
      <ClassroomWidgets mode={widgetMode} onClose={() => setWidgetMode('none')} />
      <NavigationOverlay 
        isOpen={showNavGrid} onClose={() => setShowNavGrid(false)}
        zones={NAV_ZONES} onNavigate={handleQuickNav}
      />
      <FullScreenTimer isOpen={isTimerOpen} onClose={() => setIsTimerOpen(false)} />

      {/* 選取選單 */}
      <SelectionFloatingMenu 
          position={selectionMenuPos} 
          onClose={() => { setSelectionBox(null); setSelectionMenuPos(null); }}
          
          userRole={userRole}           
          onExplain={handleAIExplain}   
          onMindMap={handleAIMindMap}   
          onGenerateQuiz={handleGenerateQuiz} 
          onLessonPlan={handleLessonPlan}     
      />
      
      {/* 側邊欄 (整合 Context / Chat / Upload / Review) */}
      <RightSidePanel 
          isOpen={isQuizPanelOpen} 
          onClose={() => {setIsQuizPanelOpen(false); setIsSidebarOpen(false)}} 
          selectedText={selectedText} 
          userRole={userRole} 
          initialTab={sidebarInitialTab} // 傳入預設分頁
      />
      
      <Modal isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} title="學習數據儀表板" icon={<LayoutDashboard className="w-5 h-5" />} fullWidth>
          <DashboardContent />
      </Modal>
    </div>
  );
};

export default App;