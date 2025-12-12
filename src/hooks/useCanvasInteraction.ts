import { useRef, useCallback, useEffect } from 'react';
import { useAppContext, useCanvasData, useUIState } from '../context/AppContext';
import { distanceBetween } from '../utils/geometry';

// 定義 Props 介面
interface UseCanvasInteractionProps {
  viewport: { x: number; y: number; scale: number };
  setViewport: React.Dispatch<React.SetStateAction<{ x: number; y: number; scale: number }>>;
  
  // 🔥 修正 1: 允許 null，解決 App.tsx 的型別錯誤
  containerRef: React.RefObject<HTMLDivElement | null>;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  previewPathRef: React.RefObject<SVGPathElement | null>;
  
  setSelectionBox: (box: any) => void;
  setSelectionMenuPos: (pos: any) => void;
}

export function useCanvasInteraction({
  viewport,
  setViewport,
  containerRef,
  canvasRef,
  previewPathRef,
  setSelectionBox,
  setSelectionMenuPos,
}: UseCanvasInteractionProps) {
    
  // 1. 取得 Context 資料
  const { state, dispatch } = useAppContext();
  const canvas = useCanvasData();
  const ui = useUIState(); 

  const { currentTool, penColor, penSize, isEditMode } = state;

  // 2. 內部 Refs (狀態追蹤)
  const isDrawing = useRef(false);
  const isPanning = useRef(false);
  const isSpacePressed = useRef(false);
  
  const lastMousePos = useRef({ x: 0, y: 0 });
  const selectionStart = useRef<{x: number, y: number} | null>(null);
  
  // 🔥 新增：紀錄滑鼠當前位置，用於 MouseUp 時計算選單位置
  const currentMousePos = useRef({ x: 0, y: 0 });

  const currentPointsRef = useRef<string[]>([]);
  const rawPointsRef = useRef<{x:number, y:number}[]>([]);

  // ==================== 🔥 修正 2: 雷射筆自動消失邏輯 ====================
  useEffect(() => {
      if (state.laserPath.length === 0) return;

      const timer = setInterval(() => {
          const now = Date.now();
          // 只保留 1 秒內的點
          const newPath = state.laserPath.filter(p => now - p.timestamp < 1000);

          if (newPath.length !== state.laserPath.length) {
              dispatch({ type: 'SET_LASER_PATH', payload: newPath });
          }
      }, 30); // 每 30ms 檢查一次

      return () => clearInterval(timer);
  }, [state.laserPath, dispatch]);


  // 3. 座標計算 Helper
  const getCanvasCoordinates = useCallback((e: React.MouseEvent | MouseEvent) => {
      if (!canvasRef.current) return { x: 0, y: 0 };
      const rect = canvasRef.current.getBoundingClientRect();
      return {
          x: (e.clientX - rect.left) / viewport.scale,
          y: (e.clientY - rect.top) / viewport.scale
      };
  }, [viewport.scale, canvasRef]);


  // 4. 事件處理邏輯

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditMode && !isSpacePressed.current) return;

    // 平移模式
    if (currentTool === 'pan' || e.button === 1 || isSpacePressed.current) {
      isPanning.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      return;
    }

    const { x, y } = getCanvasCoordinates(e);

    // 文字工具
    if (currentTool === 'text') {
        canvas.addTextObject({ id: Date.now(), x, y, text: "輸入筆記...", color: penColor, fontSize: 24 });
        dispatch({ type: 'SET_CURRENT_TOOL', payload: 'cursor' });
        return;
    }

    // 繪圖工具
    if (['pen', 'highlighter'].includes(currentTool)) {
        isDrawing.current = true;
        const startPoint = `M ${x} ${y}`;
        currentPointsRef.current = [startPoint];
        rawPointsRef.current = [{x, y}];
        if (previewPathRef.current) previewPathRef.current.setAttribute('d', startPoint);
    }
    
    // 選取工具
    if (currentTool === 'select') {
        isDrawing.current = true;
        selectionStart.current = { x, y };
        setSelectionBox({ x, y, width: 0, height: 0 }); 
        setSelectionMenuPos(null); // 按下時隱藏選單
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    // 平移拖曳
    if (isPanning.current) {
        const deltaX = e.clientX - lastMousePos.current.x;
        const deltaY = e.clientY - lastMousePos.current.y;
        setViewport(prev => ({ ...prev, x: prev.x + deltaX, y: prev.y + deltaY }));
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        return;
    }

    const { x, y } = getCanvasCoordinates(e);
    currentMousePos.current = { x, y }; // 隨時更新當前滑鼠位置

    // 雷射筆 (不需要按下，只要是該工具且按住左鍵)
    if (currentTool === 'laser' && e.buttons === 1) {
        dispatch({ type: 'ADD_LASER_POINT', payload: { x, y, timestamp: Date.now() } });
        return;
    }

    // 橡皮擦
    if (currentTool === 'eraser' && e.buttons === 1) {
        const eraseRadius = 20 / viewport.scale;
        const newStrokes = canvas.strokes.filter(s => {
             if (!s.rawPoints) return true;
             return !s.rawPoints.some((p:any) => distanceBetween(p, {x, y}) < eraseRadius);
        });
        if (newStrokes.length !== canvas.strokes.length) {
            canvas.setStrokes(newStrokes);
        }
        return;
    }

    if (!isDrawing.current) return;

    // 選取框拖曳
    if (currentTool === 'select' && selectionStart.current) {
        const start = selectionStart.current;
        const width = x - start.x;
        const height = y - start.y;
        
        // 更新藍色選取框
        setSelectionBox({
            x: width > 0 ? start.x : x,
            y: height > 0 ? start.y : y,
            width: Math.abs(width),
            height: Math.abs(height)
        });
        
        // 🔥 確保拖曳過程中選單是隱藏的 (解決選單提早跳出問題)
        setSelectionMenuPos(null);
        return;
    }

    // 繪圖拖曳
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

    // ==================== 🔥 修正 3: 選單位置計算移至此處 ====================
    if (currentTool === 'select' && selectionStart.current) {
        const start = selectionStart.current;
        const end = currentMousePos.current; // 使用最後記錄的滑鼠位置
        
        const width = Math.abs(end.x - start.x);
        const height = Math.abs(end.y - start.y);

        // 只有框框夠大時才顯示選單
        if (width > 10 && height > 10 && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            
            const finalX = Math.min(start.x, end.x);
            const finalY = Math.min(start.y, end.y);

            // 計算螢幕絕對座標
            setSelectionMenuPos({
                top: (finalY + height) * viewport.scale + rect.top,
                left: (finalX + width / 2) * viewport.scale + rect.left
            });
        } else {
            // 太小當作取消
            setSelectionBox(null);
            setSelectionMenuPos(null);
        }
        
        selectionStart.current = null;
        return;
    }

    // 繪圖結束 -> 存入 Context
    if (['pen', 'highlighter'].includes(currentTool) && currentPointsRef.current.length > 0) {
        const finalPath = currentPointsRef.current.join(' ');
        const rawPoints = [...rawPointsRef.current];
        
        canvas.addStroke({ 
            id: Date.now(),
            path: finalPath, color: penColor, size: penSize, tool: currentTool, rawPoints 
        });
        
        currentPointsRef.current = [];
        rawPointsRef.current = [];
        if (previewPathRef.current) previewPathRef.current.setAttribute('d', '');
    }
  };

  // 鍵盤事件
  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if (e.code === 'Space') isSpacePressed.current = true;
          if (e.key === 'Escape') {
              setSelectionBox(null);
              setSelectionMenuPos(null);
              dispatch({ type: 'SET_CURRENT_TOOL', payload: 'cursor' });
              ui.setShowNavGrid(false);
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
  }, [dispatch, ui.setShowNavGrid, setSelectionBox, setSelectionMenuPos]);

  return {
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      isPanning,
      isSpacePressed
  };
}