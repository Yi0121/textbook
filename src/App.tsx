import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, FileQuestion } from 'lucide-react';

// --- 1. Components Imports ---
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
import DraggableShape from './components/canvas/DraggableShape';
import DashboardContent from './components/features/Dashboard';

// Utils
import { distanceBetween } from './utils/geometry';

const App = () => {
  // --- 2. State Management ---
  
  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isQuizPanelOpen, setIsQuizPanelOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  
  // Tool State
  const [currentTool, setCurrentTool] = useState('cursor');
  const [viewport, setViewport] = useState({ x: 0, y: 0, scale: 1 });
  const [penColor, setPenColor] = useState('#ef4444');
  const [penSize, setPenSize] = useState(4);

  // Data State (Canvas Objects)
  const [strokes, setStrokes] = useState<any[]>([]);
  const [mindMaps, setMindMaps] = useState<any[]>([]);
  const [aiMemos, setAiMemos] = useState<any[]>([]);
  const [textObjects, setTextObjects] = useState<any[]>([]);
  const [shapes, setShapes] = useState<any[]>([]);
  
  // Interaction State
  const [currentPoints, setCurrentPoints] = useState<string[]>([]);
  const [currentPointsRaw, setCurrentPointsRaw] = useState<{x:number, y:number}[]>([]); 
  const [laserPath, setLaserPath] = useState<{x: number, y: number, timestamp: number}[]>([]);
  const [selectionBox, setSelectionBox] = useState<any>(null); 
  const [selectionMenuPos, setSelectionMenuPos] = useState<any>(null);
  const [selectedText, setSelectedText] = useState('選取範圍內容');
  
  // Refs
  const isDrawing = useRef(false);
  const isPanning = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const selectionStart = useRef<{x: number, y: number} | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // --- 3. Effects ---

  // E1. 雷射筆消失動畫 (500ms)
  useEffect(() => {
    let animationFrameId: number;
    const decayLaser = () => {
        const now = Date.now();
        setLaserPath(prev => {
            const newPath = prev.filter(p => now - p.timestamp < 500); 
            return newPath.length !== prev.length ? newPath : prev;
        });
        animationFrameId = requestAnimationFrame(decayLaser);
    };
    if (laserPath.length > 0) {
        animationFrameId = requestAnimationFrame(decayLaser);
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [laserPath.length]);

  // E2. 縮放控制
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
        if (isDashboardOpen) return;
        if (e.ctrlKey || e.metaKey) { 
            e.preventDefault(); 
            const scaleAmount = -e.deltaY * 0.002; 
            setViewport(prev => {
                const newScale = Math.min(Math.max(0.5, prev.scale + scaleAmount), 3);
                return { ...prev, scale: newScale };
            });
        }
    };
    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, [isDashboardOpen]);

  // --- 4. Logic & Handlers ---

  const getCanvasCoordinates = (e: React.MouseEvent) => {
     if (!canvasRef.current) return { x: 0, y: 0 };
     const rect = canvasRef.current.getBoundingClientRect();
     return {
         x: (e.clientX - rect.left) / viewport.scale,
         y: (e.clientY - rect.top) / viewport.scale
     };
  };

  const handleObjUpdate = (id: number, data: any, type: 'memo' | 'mindmap' | 'text' | 'shape') => {
      if (type === 'memo') {
          setAiMemos(prev => prev.map(m => m.id === id ? { ...m, x: m.x + data.dx, y: m.y + data.dy } : m));
      } else if (type === 'mindmap') {
          setMindMaps(prev => prev.map(m => m.id === id ? { ...m, x: m.x + data.dx, y: m.y + data.dy } : m));
      } else if (type === 'text') {
          setTextObjects(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
      } else if (type === 'shape') {
          setShapes(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
      }
  };

  const handleAddShape = (type: 'rect' | 'circle' | 'triangle') => {
      const centerX = (window.innerWidth / 2 - viewport.x) / viewport.scale;
      const centerY = (window.innerHeight / 2 - viewport.y) / viewport.scale;
      
      const newShape = {
          id: Date.now(),
          type: type,
          x: centerX - 50,
          y: centerY - 50,
          color: '#10b981',
          size: 100
      };
      setShapes(prev => [...prev, newShape]);
      setCurrentTool('cursor');
  };

  // --- AI Actions ---
  const handleAITrigger = () => {
    setSelectionMenuPos(null);
    setSelectionBox(null); 
    setIsAIProcessing(true);
    setTimeout(() => { 
        setIsAIProcessing(false); 
        setIsQuizPanelOpen(true); 
        setIsSidebarOpen(true); 
    }, 2500);
  };

  const getSpawnPosition = () => {
      let spawnX = 400; let spawnY = 300;
      if (selectionMenuPos && canvasRef.current) {
          const rect = canvasRef.current.getBoundingClientRect();
          spawnX = (selectionMenuPos.left - rect.left) / viewport.scale + 20;
          spawnY = (selectionMenuPos.top - rect.top) / viewport.scale + 20;
      }
      return { x: spawnX, y: spawnY };
  };

  const handleAIExplain = () => {
    const pos = getSpawnPosition();
    setSelectionMenuPos(null);
    setSelectionBox(null);
    setIsAIProcessing(true);
    setTimeout(() => {
        setIsAIProcessing(false);
        setAiMemos(prev => [...prev, {
            id: Date.now(), x: pos.x, y: pos.y,
            keyword: "重點分析", content: "AI 已分析您選取的區域：包含粒線體結構圖與相關文字。粒線體是細胞產生能量(ATP)的場所。"
        }]);
    }, 2000);
  };

  const handleAIMindMap = () => {
      const pos = getSpawnPosition();
      setSelectionMenuPos(null);
      setSelectionBox(null);
      setIsAIProcessing(true);
      setTimeout(() => {
          setIsAIProcessing(false);
          setMindMaps(prev => [...prev, {
              id: Date.now(), x: pos.x, y: pos.y,
              nodes: [
                  { id: 'root', offsetX: 0, offsetY: 0, label: '核心概念', type: 'root' },
                  { id: '1', offsetX: 180, offsetY: -60, label: '特徵分析', type: 'child' },
                  { id: '2', offsetX: 180, offsetY: 60, label: '功能運作', type: 'child' },
                  { id: '3', offsetX: 340, offsetY: -60, label: '結構組成', type: 'child' },
                  { id: '4', offsetX: 340, offsetY: 60, label: '能量轉換', type: 'child' }
              ],
              edges: [
                  { source: 'root', target: '1' }, { source: 'root', target: '2' },
                  { source: '1', target: '3' }, { source: '2', target: '4' }
              ]
          }]);
      }, 1500);
  };

  // --- Interactions ---
  const handlePanStart = (e: React.MouseEvent) => {
    if (currentTool === 'pan' || (e.button === 1) || (e.buttons === 4)) {
      isPanning.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    }
  };
  const handlePanMove = (e: React.MouseEvent) => {
    if (!isPanning.current) return;
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    setViewport(prev => ({ ...prev, x: prev.x + deltaX, y: prev.y + deltaY }));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };
  const handlePanEnd = () => { isPanning.current = false; };

  const handleDrawStart = (e: React.MouseEvent) => {
    const { x, y } = getCanvasCoordinates(e);
    
    if (currentTool === 'text') {
        const newText = {
            id: Date.now(),
            x: x,
            y: y,
            text: "",
            color: penColor,
            fontSize: 24
        };
        setTextObjects(prev => [...prev, newText]);
        setCurrentTool('cursor'); 
        return;
    }

    if (currentTool === 'pen' || currentTool === 'highlighter') {
        isDrawing.current = true;
        setCurrentPoints([`M ${x} ${y}`]);
        setCurrentPointsRaw([{x, y}]);
    }
    
    if (currentTool === 'select') {
        isDrawing.current = true;
        selectionStart.current = { x, y };
        setSelectionBox({ x, y, width: 0, height: 0 }); 
        setSelectionMenuPos(null); 
    }
  };

  const handleDrawMove = (e: React.MouseEvent) => {
    const { x, y } = getCanvasCoordinates(e);

    if (currentTool === 'laser') {
        if (e.buttons === 1) setLaserPath(prev => [...prev, { x, y, timestamp: Date.now() }]);
        return;
    }

    if (currentTool === 'eraser' && e.buttons === 1) {
        const eraseRadius = 20 / viewport.scale;
        setStrokes(prevStrokes => prevStrokes.filter(stroke => {
            if (!stroke.rawPoints) return true;
            return !stroke.rawPoints.some((p: any) => distanceBetween(p, {x, y}) < eraseRadius);
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

    if (currentTool !== 'pen' && currentTool !== 'highlighter') return;
    setCurrentPoints(prev => [...prev, `L ${x} ${y}`]);
    setCurrentPointsRaw(prev => [...prev, {x, y}]);
  };

  const handleDrawEnd = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;

    if (currentTool === 'select' && selectionBox) {
        if (selectionBox.width < 5 || selectionBox.height < 5) {
            setSelectionBox(null);
            setSelectionMenuPos(null);
        } else {
            if (canvasRef.current) {
                const rect = canvasRef.current.getBoundingClientRect();
                const menuX = (selectionBox.x + selectionBox.width) * viewport.scale + rect.left;
                const menuY = (selectionBox.y + selectionBox.height) * viewport.scale + rect.top;
                setSelectionMenuPos({ top: menuY, left: menuX });
                setSelectedText("已選取區域內容");
            }
        }
        selectionStart.current = null;
        return;
    }

    if ((currentTool === 'pen' || currentTool === 'highlighter') && currentPoints.length > 0) {
        let finalPath = currentPoints.join(' ');
        let rawPoints = currentPointsRaw;

        if (currentTool === 'highlighter' && currentPointsRaw.length > 5) {
            const ys = currentPointsRaw.map(p => p.y);
            const xs = currentPointsRaw.map(p => p.x);
            const maxDiffY = Math.max(...ys) - Math.min(...ys);
            const width = Math.max(...xs) - Math.min(...xs);

            if (width > 20 && maxDiffY < 15) {
                const avgY = ys.reduce((a, b) => a + b, 0) / ys.length;
                const minX = Math.min(...xs);
                const maxX = Math.max(...xs);
                finalPath = `M ${minX} ${avgY} L ${maxX} ${avgY}`;
                
                const interpolatedPoints = [];
                const steps = Math.ceil(width / 5);
                for (let i = 0; i <= steps; i++) {
                    interpolatedPoints.push({ x: minX + (maxX - minX) * (i / steps), y: avgY });
                }
                rawPoints = interpolatedPoints;
            }
        }

        setStrokes(prev => [...prev, { path: finalPath, color: penColor, size: penSize, tool: currentTool, rawPoints }]);
        setCurrentPoints([]);
        setCurrentPointsRaw([]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 overflow-hidden flex flex-col select-none">
      <TopNavigation isSidebarOpen={isSidebarOpen || isQuizPanelOpen} toggleSidebar={() => {setIsSidebarOpen(!isSidebarOpen); setIsQuizPanelOpen(!isQuizPanelOpen)}} />
      
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden bg-slate-100 touch-none"
        onMouseDown={(e) => { handlePanStart(e); handleDrawStart(e); }}
        onMouseMove={(e) => { handlePanMove(e); handleDrawMove(e); }}
        onMouseUp={(e) => { handlePanEnd(); handleDrawEnd(); }} 
        onMouseLeave={(e) => { handlePanEnd(); handleDrawEnd(); }}
        style={{ 
          cursor: (() => {
              if (currentTool === 'pan' || isPanning.current) return isPanning.current ? 'grabbing' : 'grab';
              if (currentTool === 'cursor') return 'default';
              if (currentTool === 'text') return 'text';
              if (currentTool === 'select') return 'crosshair';
              if (currentTool === 'laser') return 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'24\' height=\'24\' viewport=\'0 0 24 24\' style=\'fill:none;stroke:white;stroke-width:2px;\'><circle cx=\'12\' cy=\'12\' r=\'6\' fill=\'%23ef4444\'/></svg>") 12 12, auto';
              return 'crosshair';
          })(),
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: `${20 * viewport.scale}px ${20 * viewport.scale}px`,
          backgroundPosition: `${viewport.x}px ${viewport.y}px`
        }}
      >
        <FixedToolbar 
            currentTool={currentTool} setCurrentTool={setCurrentTool}
            onOpenDashboard={() => setIsDashboardOpen(true)}
            zoomLevel={viewport.scale} setZoomLevel={(newScale: any) => setViewport(prev => ({...prev, scale: typeof newScale === 'function' ? newScale(prev.scale) : newScale}))}
            penColor={penColor} setPenColor={setPenColor}
            penSize={penSize} setPenSize={setPenSize}
            isAIProcessing={isAIProcessing}
            onAddShape={handleAddShape}
        />

        <div 
            className="w-full min-h-full flex justify-center py-20 origin-top-left will-change-transform"
            style={{ 
              transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.scale})`,
              pointerEvents: isPanning.current ? 'none' : 'auto' 
            }}
        >
            <div className="relative" ref={canvasRef}>
                 <TextbookContent 
                    currentTool={currentTool}
                    onTextSelected={(data: any) => {
                       if (currentTool === 'cursor') return; 
                       if (!canvasRef.current) return;

                       const rect = canvasRef.current.getBoundingClientRect();
                       const textRect = data.clientRect;
                       setSelectionBox({
                           x: (textRect.left - rect.left) / viewport.scale,
                           y: (textRect.top - rect.top) / viewport.scale,
                           width: textRect.width / viewport.scale,
                           height: textRect.height / viewport.scale
                       });
                       setSelectionMenuPos({ top: textRect.top + textRect.height, left: textRect.left + textRect.width/2 });
                       setSelectedText(data.text);
                    }}
                    clearSelection={() => {}}
                 />
                 
                 <DrawingLayer 
                    active={['pen', 'highlighter', 'eraser', 'laser', 'select'].includes(currentTool)}
                    strokes={strokes}
                    currentPath={currentPoints}
                    onDrawStart={()=>{}} onDrawMove={()=>{}} onDrawEnd={()=>{}}
                    penColor={penColor} penSize={penSize} currentTool={currentTool}
                    selectionBox={selectionBox} laserPath={laserPath}
                 />
                 
                 {mindMaps.map(map => (
                     <DraggableMindMap 
                        key={map.id} data={map} scale={viewport.scale} 
                        onUpdate={(id: number, dx: number, dy: number) => handleObjUpdate(id, {dx, dy}, 'mindmap')} 
                        onDelete={(id: number) => setMindMaps(prev => prev.filter(m => m.id !== id))}
                     />
                 ))}
                 
                 {aiMemos.map(memo => (
                    <AIMemoCard 
                        key={memo.id} data={memo} scale={viewport.scale} 
                        onUpdate={(id: number, dx: number, dy: number) => handleObjUpdate(id, {dx, dy}, 'memo')} 
                        onDelete={() => setAiMemos(prev => prev.filter(m => m.id !== memo.id))} 
                    />
                 ))}

                 {textObjects.map(text => (
                    <DraggableText
                        key={text.id} data={text} scale={viewport.scale}
                        onUpdate={(id: number, newData: any) => handleObjUpdate(id, newData, 'text')}
                        onDelete={(id: number) => setTextObjects(prev => prev.filter(t => t.id !== id))}
                    />
                 ))}

                 {shapes.map(shape => (
                    <DraggableShape 
                        key={shape.id} data={shape} scale={viewport.scale}
                        onUpdate={(id: number, newData: any) => handleObjUpdate(id, newData, 'shape')}
                        onDelete={(id: number) => setShapes(prev => prev.filter(s => s.id !== id))}
                    />
                 ))}
            </div>
        </div>
      </div>

      <SelectionFloatingMenu 
          position={selectionMenuPos} 
          onTrigger={handleAITrigger} 
          onExplain={handleAIExplain} 
          onMindMap={handleAIMindMap} 
          onClose={() => { setSelectionBox(null); setSelectionMenuPos(null); }}
      />
      
      <RightSidePanel isOpen={isQuizPanelOpen} onClose={() => {setIsQuizPanelOpen(false); setIsSidebarOpen(false)}} selectedText={selectedText} />
      
      <Modal isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} title="隨堂練習儀表板" icon={<LayoutDashboard className="w-5 h-5" />} fullWidth>
          <DashboardContent />
      </Modal>
    </div>
  );
};

export default App;