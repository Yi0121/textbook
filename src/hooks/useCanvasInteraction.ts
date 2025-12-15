import { useRef, useCallback, useEffect } from 'react';
import { useEditor } from '../context/EditorContext';
import { useUI } from '../context/UIContext';
import { distanceBetween } from '../utils/geometry';

interface UseCanvasInteractionProps {
  viewport: { x: number; y: number; scale: number };
  setViewport: React.Dispatch<React.SetStateAction<{ x: number; y: number; scale: number }>>;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  previewPathRef: React.RefObject<SVGPathElement | null>;
  setSelectionBox: (box: any) => void;
  setSelectionMenuPos: (pos: any) => void;
}

export function useCanvasInteraction({
  viewport,
  setViewport,
  canvasRef,
  previewPathRef,
  setSelectionBox,
  setSelectionMenuPos,
}: UseCanvasInteractionProps) {

  const { state: editorState, dispatch: editorDispatch } = useEditor();
  const ui = useUI();

  const { currentTool, penColor, penSize, isEditMode } = editorState;

  const isDrawing = useRef(false);
  const isPanning = useRef(false);
  const isSpacePressed = useRef(false);
  
  const lastMousePos = useRef({ x: 0, y: 0 });
  const selectionStart = useRef<{x: number, y: number} | null>(null);
  const currentMousePos = useRef({ x: 0, y: 0 });

  const currentPointsRef = useRef<string[]>([]);
  const rawPointsRef = useRef<{x:number, y:number}[]>([]);

  // 雷射筆自動消失邏輯
  useEffect(() => {
      if (editorState.laserPath.length === 0) return;
      const timer = setInterval(() => {
          const now = Date.now();
          const newPath = editorState.laserPath.filter(p => now - p.timestamp < 1000);
          if (newPath.length !== editorState.laserPath.length) {
              editorDispatch({ type: 'SET_LASER_PATH', payload: newPath });
          }
      }, 30);
      return () => clearInterval(timer);
  }, [editorState.laserPath, editorDispatch]);

  const getCanvasCoordinates = useCallback((e: React.MouseEvent | MouseEvent) => {
      if (!canvasRef.current) return { x: 0, y: 0 };
      const rect = canvasRef.current.getBoundingClientRect();
      return {
          x: (e.clientX - rect.left) / viewport.scale,
          y: (e.clientY - rect.top) / viewport.scale
      };
  }, [viewport.scale, canvasRef]);

  // --- 1. Mouse Down ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditMode && !isSpacePressed.current) return;

    if (currentTool === 'pan' || e.button === 1 || isSpacePressed.current) {
      isPanning.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      return;
    }

    const { x, y } = getCanvasCoordinates(e);

    if (currentTool === 'text') {
        editorDispatch({
            type: 'ADD_TEXT_OBJECT',
            payload: { id: Date.now(), x, y, text: "輸入筆記...", color: penColor, fontSize: 24 }
        });
        editorDispatch({ type: 'SET_CURRENT_TOOL', payload: 'cursor' });
        return;
    }

    // 🔥 修正 1：這裡一定要包含 'highlighter'，否則 isDrawing 不會變成 true
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

  // --- 2. Mouse Move ---
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning.current) {
        const deltaX = e.clientX - lastMousePos.current.x;
        const deltaY = e.clientY - lastMousePos.current.y;
        setViewport(prev => ({ ...prev, x: prev.x + deltaX, y: prev.y + deltaY }));
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        return;
    }

    const { x, y } = getCanvasCoordinates(e);
    currentMousePos.current = { x, y };

    if (currentTool === 'laser' && e.buttons === 1) {
        editorDispatch({ type: 'ADD_LASER_POINT', payload: { x, y, timestamp: Date.now() } });
        return;
    }

    if (currentTool === 'eraser' && e.buttons === 1) {
        const eraseRadius = 20 / viewport.scale;
        const newStrokes = editorState.strokes.filter(s => {
             if (!s.rawPoints) return true;
             return !s.rawPoints.some((p:any) => distanceBetween(p, {x, y}) < eraseRadius);
        });
        if (newStrokes.length !== editorState.strokes.length) {
            editorDispatch({ type: 'SET_STROKES', payload: newStrokes });
        }
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
        setSelectionMenuPos(null);
        return;
    }

    // 🔥 修正 2：這裡也要包含 'highlighter'，否則拖曳時不會畫線
    if (['pen', 'highlighter'].includes(currentTool)) {
        const pointCommand = `L ${x} ${y}`;
        currentPointsRef.current.push(pointCommand);
        rawPointsRef.current.push({x, y});
        if (previewPathRef.current) previewPathRef.current.setAttribute('d', currentPointsRef.current.join(' '));
    }
  };

  // --- 3. Mouse Up ---
  const handleMouseUp = () => {
    isPanning.current = false;
    if (!isDrawing.current) return;
    isDrawing.current = false;

    if (currentTool === 'select' && selectionStart.current) {
        const start = selectionStart.current;
        const end = currentMousePos.current;
        const width = Math.abs(end.x - start.x);
        const height = Math.abs(end.y - start.y);

        if (width > 10 && height > 10 && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const finalX = Math.min(start.x, end.x);
            const finalY = Math.min(start.y, end.y);
            setSelectionMenuPos({
                top: (finalY + height) * viewport.scale + rect.top,
                left: (finalX + width / 2) * viewport.scale + rect.left
            });
        } else {
            setSelectionBox(null);
            setSelectionMenuPos(null);
        }
        selectionStart.current = null;
        return;
    }

    // 🔥 修正 3：白名單加入 'highlighter'
    const RECORDABLE_TOOLS = ['pen', 'highlighter'];

    if (RECORDABLE_TOOLS.includes(currentTool) && currentPointsRef.current.length > 0) {
        const finalPath = currentPointsRef.current.join(' ');
        const rawPoints = [...rawPointsRef.current];
        const author = editorState.isStudentStage ? 'student' : editorState.userRole;

        editorDispatch({
            type: 'ADD_STROKE',
            payload: {
                id: Date.now(),
                path: finalPath,
                color: penColor,
                size: penSize,
                tool: currentTool,
                rawPoints,
                author: author
            }
        });
        
        currentPointsRef.current = [];
        rawPointsRef.current = [];
        if (previewPathRef.current) previewPathRef.current.setAttribute('d', '');
    } else {
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
              editorDispatch({ type: 'SET_CURRENT_TOOL', payload: 'cursor' });
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
  }, [editorDispatch, ui.setShowNavGrid, setSelectionBox, setSelectionMenuPos]);

  return {
      handleMouseDown,
      handleMouseMove,
      handleMouseUp,
      isPanning,
      isSpacePressed
  };
}