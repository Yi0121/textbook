import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { LayoutDashboard, FileQuestion, Sparkles, Move, MousePointer2, X } from 'lucide-react';

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
import FullScreenTimer from './components/ui/FullScreenTimer'; // [新增] 全螢幕計時器

// Utils
import { distanceBetween } from './utils/geometry';

// [新增] 四格導航區域定義
const NAV_ZONES = [
    { id: 1, label: '左上', x: 0, y: 0, color: 'bg-blue-500' },
    { id: 2, label: '右上', x: -1100, y: 0, color: 'bg-green-500' }, 
    { id: 3, label: '左下', x: 0, y: -1500, color: 'bg-orange-500' }, 
    { id: 4, label: '右下', x: -1100, y: -1500, color: 'bg-purple-500' },
];

// 使用 React.memo 優化底層教科書渲染
const MemoizedTextbook = React.memo(TextbookContent);

const App = () => {
  // --- 1. UI & Demo State ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQuizPanelOpen, setIsQuizPanelOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  
  // AI 狀態
  const [aiState, setAiState] = useState<'idle' | 'thinking' | 'done'>('idle');
  
  // [新增] 教室工具狀態
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isGridMode, setIsGridMode] = useState(false); // 控制四格導航選單

  // --- 2. Tool & Canvas State ---
  const [currentTool, setCurrentTool] = useState('cursor');
  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });
  const [penColor, setPenColor] = useState('#ef4444');
  const [penSize, setPenSize] = useState(4);

  // --- 3. Objects State ---
  const [strokes, setStrokes] = useState<any[]>([]);
  const [mindMaps, setMindMaps] = useState<any[]>([]);
  const [aiMemos, setAiMemos] = useState<any[]>([]);
  const [textObjects, setTextObjects] = useState<any[]>([]);

  
  // --- 4. Interaction Refs & State ---
  const [laserPath, setLaserPath] = useState<{x: number, y: number, timestamp: number}[]>([]);
  const [selectionBox, setSelectionBox] = useState<any>(null); 
  const [selectionMenuPos, setSelectionMenuPos] = useState<any>(null);
  const [selectedText, setSelectedText] = useState('粒線體結構與功能');

  // Refs (效能優化關鍵)
  const isDrawing = useRef(false);
  const isPanning = useRef(false);
  const isSpacePressed = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const selectionStart = useRef<{x: number, y: number} | null>(null);
  
  // [新增] 繪圖優化 Refs (取代 State)
  const previewPathRef = useRef<SVGPathElement>(null); 
  const currentPointsRef = useRef<string[]>([]);       
  const rawPointsRef = useRef<{x:number, y:number}[]>([]); 

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // --- 5. Handlers ---

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

  // --- AI Demo Logic ---
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
      // Fallback: 根據 viewport 中心生成，確保可見
      return { 
          x: (-viewport.x + window.innerWidth/2) / viewport.scale, 
          y: (-viewport.y + window.innerHeight/2) / viewport.scale 
      };
  };

  const handleAITrigger = () => {
    simulateAIProcess(() => {
        setIsQuizPanelOpen(true); 
        setIsSidebarOpen(true);
    });
  };

  const handleAIExplain = () => {
    const pos = getSpawnPosition();
    simulateAIProcess(() => {
        setAiMemos(prev => [...prev, {
            id: Date.now(), x: pos.x, y: pos.y,
            keyword: "重點摘要", 
            content: "AI 分析：這段文字描述了粒線體(Mitochondria)作為細胞能量工廠的角色。關鍵字：ATP合成、雙層膜結構。"
        }]);
    });
  };

  const handleAIMindMap = () => {
      const pos = getSpawnPosition();
      simulateAIProcess(() => {
          setMindMaps(prev => [...prev, {
              id: Date.now(), x: pos.x, y: pos.y,
              nodes: [
                  { id: 'root', offsetX: 0, offsetY: 0, label: '粒線體', type: 'root' },
                  { id: '1', offsetX: 150, offsetY: -50, label: '結構', type: 'child' },
                  { id: '2', offsetX: 150, offsetY: 50, label: '功能', type: 'child' },
                  { id: '3', offsetX: 300, offsetY: -80, label: '外膜', type: 'sub' },
                  { id: '4', offsetX: 300, offsetY: -20, label: '內膜', type: 'sub' },
                  { id: '5', offsetX: 300, offsetY: 50, label: '產生ATP', type: 'sub' }
              ],
              edges: [
                  { source: 'root', target: '1' }, { source: 'root', target: '2' },
                  { source: '1', target: '3' }, { source: '1', target: '4' }, { source: '2', target: '5' }
              ]
          }]);
      });
  };

  // --- Grid Navigation Logic ---
  const handleGridJump = (targetX: number, targetY: number) => {
      setViewport({ x: targetX, y: targetY, scale: 1.0 });
      setIsGridMode(false);
  };

  // --- Interaction Event Handlers ---

  const handleMouseDown = (e: React.MouseEvent) => {
    // 平移模式檢查
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

    // [修改] 繪圖工具：使用 Ref 與 Direct DOM Manipulation
    if (['pen', 'highlighter'].includes(currentTool)) {
        isDrawing.current = true;
        
        const startPoint = `M ${x} ${y}`;
        currentPointsRef.current = [startPoint];
        rawPointsRef.current = [{x, y}];
        
        if (previewPathRef.current) {
            previewPathRef.current.setAttribute('d', startPoint);
        }
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

    // [修改] 繪圖工具：更新 Ref 與 DOM
    if (['pen', 'highlighter'].includes(currentTool)) {
        const pointCommand = `L ${x} ${y}`;
        
        currentPointsRef.current.push(pointCommand);
        rawPointsRef.current.push({x, y});

        if (previewPathRef.current) {
            const d = currentPointsRef.current.join(' '); 
            previewPathRef.current.setAttribute('d', d);
        }
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

    // [修改] 繪圖結束：將 Ref 轉存 State
    if (['pen', 'highlighter'].includes(currentTool) && currentPointsRef.current.length > 0) {
        const finalPath = currentPointsRef.current.join(' ');
        const rawPoints = [...rawPointsRef.current];

        setStrokes(prev => [...prev, { 
            id: Date.now(),
            path: finalPath, 
            color: penColor, 
            size: penSize, 
            tool: currentTool, 
            rawPoints 
        }]);

        currentPointsRef.current = [];
        rawPointsRef.current = [];
        if (previewPathRef.current) {
            previewPathRef.current.setAttribute('d', '');
        }
    }
  };

  // --- Effects ---

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (e.code === 'Space') isSpacePressed.current = true;
          if (e.key === 'Escape') {
              setSelectionBox(null);
              setSelectionMenuPos(null);
              setCurrentTool('cursor');
              setIsGridMode(false); // ESC 關閉導航
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
              const scaleAmount = -e.deltaY * 0.002;
              setViewport(prev => ({ ...prev, scale: Math.min(Math.max(0.5, prev.scale + scaleAmount), 3) }));
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
          <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center bg-white/20 backdrop-blur-sm transition-all duration-300">
              <div className="bg-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 border border-indigo-100 animate-pulse">
                  <Sparkles className="w-6 h-6 text-indigo-600 animate-spin-slow" />
                  <span className="text-indigo-800 font-medium">AI 正在分析教材內容與筆跡...</span>
              </div>
          </div>
      )}

      {/* 主要畫布 */}
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden bg-slate-100 touch-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp} 
        onMouseLeave={handleMouseUp}
        style={{ 
          cursor: isPanning.current || isSpacePressed.current ? 'grabbing' : currentTool === 'cursor' ? 'default' : 'crosshair'
        }}
      >
        <div 
            className="absolute inset-0 pointer-events-none opacity-50"
            style={{
                backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
                backgroundSize: `${20 * viewport.scale}px ${20 * viewport.scale}px`,
                backgroundPosition: `${viewport.x}px ${viewport.y}px`
            }}
        />

        <div 
            className="w-full h-full flex justify-center py-20 origin-top-left will-change-transform"
            style={{ 
              transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
            }}
        >
            <div className="relative bg-white shadow-2xl ring-1 ring-black/5 rounded-2xl" ref={canvasRef} style={{ width: 1000, minHeight: 1400 }}>
                 
                 {/* 教科書層 */}
                 <MemoizedTextbook 
                    currentTool={currentTool}
                    onTextSelected={(data: any) => {
                       if (currentTool !== 'cursor') return; 
                       const rect = data.clientRect;
                       if(!canvasRef.current) return;
                       const baseRect = canvasRef.current.getBoundingClientRect();
                       
                       setSelectionBox({
                           x: (rect.left - baseRect.left) / viewport.scale,
                           y: (rect.top - baseRect.top) / viewport.scale,
                           width: rect.width / viewport.scale,
                           height: rect.height / viewport.scale
                       });
                       setSelectionMenuPos({ 
                           top: rect.bottom, 
                           left: rect.left + rect.width/2 
                       });
                       setSelectedText(data.text);
                    }}
                    clearSelection={() => {}}
                 />
                 
                 {/* 繪圖層 (傳入 Ref) */}
                 <DrawingLayer 
                    ref={previewPathRef}
                    active={true}
                    strokes={strokes}
                    penColor={penColor} 
                    penSize={penSize} 
                    currentTool={currentTool}
                    selectionBox={selectionBox} 
                    laserPath={laserPath}
                 />
                 
                 {/* 物件層 (鎖定穿透邏輯) */}
                 <div className={`absolute inset-0 z-10 ${['pen', 'highlighter', 'eraser', 'laser'].includes(currentTool) ? 'pointer-events-none' : ''}`}>
                    {mindMaps.map(map => (
                        <DraggableMindMap 
                            key={map.id} data={map} scale={viewport.scale} 
                            onUpdate={(id: number, dx: number, dy: number) => handleObjUpdate(id, {dx, dy}, 'mindmap')} 
                            onDelete={(id: number) => setMindMaps(p => p.filter(m => m.id !== id))}
                        />
                    ))}
                    
                    {aiMemos.map(memo => (
                        <AIMemoCard 
                            key={memo.id} data={memo} scale={viewport.scale} 
                            onUpdate={(id: number, dx: number, dy: number) => handleObjUpdate(id, {dx, dy}, 'memo')} 
                            onDelete={() => setAiMemos(p => p.filter(m => m.id !== memo.id))} 
                        />
                    ))}

                    {textObjects.map(text => (
                        <DraggableText
                            key={text.id} data={text} scale={viewport.scale}
                            onUpdate={(id: number, d: any) => handleObjUpdate(id, d, 'text')}
                            onDelete={(id: number) => setTextObjects(p => p.filter(t => t.id !== id))}
                        />
                    ))}
                 </div>
            </div>
        </div>

        <FixedToolbar 
            currentTool={currentTool} setCurrentTool={setCurrentTool}
            onOpenDashboard={() => setIsDashboardOpen(true)}
            zoomLevel={viewport.scale} 
            setZoomLevel={(s: any) => setViewport(prev => ({...prev, scale: typeof s === 'function' ? s(prev.scale) : s}))}
            penColor={penColor} setPenColor={setPenColor}
            penSize={penSize} setPenSize={setPenSize}
            isAIProcessing={aiState === 'thinking'}
            // [新增] 傳遞控制函數
            onToggleTimer={() => setIsTimerOpen(true)}
            onToggleGrid={() => setIsGridMode(true)}
        />
      </div>

{/* [修改] 四格導航 - 工具列上方的小型彈出選單 */ }
{
    isGridMode && (
        <>
            {/* 1. 透明背景層 - 點擊空白處關閉選單 */}
            <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsGridMode(false)} 
            />

            {/* 2. 小選單本體 - 定位在底部工具列上方 */}
            <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
                <div className="bg-white p-2 rounded-2xl shadow-xl border border-gray-200 flex flex-col gap-2 w-64">
                    
                    <div className="text-xs font-bold text-gray-400 px-2 pt-1">快速跳轉</div>
                    
                    <div className="grid grid-cols-2 gap-2">
                        {NAV_ZONES.map(zone => (
                            <button
                                key={zone.id}
                                onClick={() => {
                                    setViewport({ x: zone.x, y: zone.y, scale: 1 });
                                    setIsGridMode(false);
                                }}
                                className={`
                                    relative h-16 rounded-xl border transition-all active:scale-95 flex items-center justify-center
                                    ${zone.color.replace('bg-', 'bg-').replace('500', '50')} 
                                    ${zone.color.replace('bg-', 'border-').replace('500', '200')}
                                    hover:brightness-95
                                `}
                            >
                                <span className={`font-bold ${zone.color.replace('bg-', 'text-').replace('500', '600')}`}>
                                    {zone.label}
                                </span>
                                
                                {/* 小裝飾：顯示區域 ID */}
                                <span className="absolute bottom-1 right-2 text-[10px] opacity-40 font-mono">
                                    0{zone.id}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* 下方小箭頭裝飾 (指向工具列) */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-gray-200 rotate-45"></div>
            </div>
        </>
    )
}

      {/* [新增] 全螢幕計時器 */}
      <FullScreenTimer isOpen={isTimerOpen} onClose={() => setIsTimerOpen(false)} />

      <SelectionFloatingMenu 
          position={selectionMenuPos} 
          onTrigger={handleAITrigger} 
          onExplain={handleAIExplain} 
          onMindMap={handleAIMindMap} 
          onClose={() => { setSelectionBox(null); setSelectionMenuPos(null); }}
      />
      
      <RightSidePanel isOpen={isQuizPanelOpen} onClose={() => {setIsQuizPanelOpen(false); setIsSidebarOpen(false)}} selectedText={selectedText} />
      
      <Modal isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} title="學習數據儀表板" icon={<LayoutDashboard className="w-5 h-5" />} fullWidth>
          <DashboardContent />
      </Modal>
    </div>
  );
};

export default App;