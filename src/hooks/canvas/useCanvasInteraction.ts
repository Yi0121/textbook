import { useRef, useCallback, useEffect } from 'react';
import { useEditor } from '../../context/EditorContext';
import { useUI } from '../../context/UIContext';
import { distanceBetween } from '../../utils/geometry';
import { getStroke } from 'perfect-freehand';
import type { Point } from '../../types/canvas';

interface SelectionBox {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface SelectionMenuPos {
    top: number;
    left: number;
}

interface UseCanvasInteractionProps {
    viewport: { x: number; y: number; scale: number };
    setViewport: React.Dispatch<React.SetStateAction<{ x: number; y: number; scale: number }>>;
    canvasRef: React.RefObject<HTMLDivElement | null>;
    previewPathRef: React.RefObject<SVGPathElement | null>;
    setSelectionBox: (box: SelectionBox | null) => void;
    setSelectionMenuPos: (pos: SelectionMenuPos | null) => void;
}

// 根據 perfect-freehand 的點生成 SVG path
function getSvgPathFromStroke(stroke: number[][]) {
    if (!stroke.length) return "";
    const d = stroke.reduce(
        (acc, [x0, y0], i, arr) => {
            const [x1, y1] = arr[(i + 1) % arr.length];
            acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
            return acc;
        },
        ["M", ...stroke[0], "Q"]
    );
    d.push("Z");
    return d.join(" ");
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
    const selectionStart = useRef<{ x: number, y: number } | null>(null);
    const currentMousePos = useRef({ x: 0, y: 0 });

    // Store raw points for the current stroke
    const rawPointsRef = useRef<Point[]>([]);

    // 雷射筆自動消失邏輯
    useEffect(() => {
        if (editorState.laserPath.length === 0) return;
        const timer = setInterval(() => {
            const now = Date.now();
            const newPath = editorState.laserPath.filter(p => p.timestamp !== undefined && now - p.timestamp < 1000);
            if (newPath.length !== editorState.laserPath.length) {
                editorDispatch({ type: 'SET_LASER_PATH', payload: newPath });
            }
        }, 30);
        return () => clearInterval(timer);
    }, [editorState.laserPath, editorDispatch]);

    const getCanvasCoordinates = useCallback((e: React.PointerEvent | PointerEvent | React.MouseEvent) => {
        if (!canvasRef.current) return { x: 0, y: 0 };
        const rect = canvasRef.current.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) / viewport.scale,
            y: (e.clientY - rect.top) / viewport.scale
        };
    }, [viewport.scale, canvasRef]);

    // --- 1. Pointer Down ---
    const handlePointerDown = (e: React.PointerEvent) => {
        // Essential for capturing pointer events even if they leave the element
        (e.target as Element).setPointerCapture(e.pointerId);

        if (isEditMode && !isSpacePressed.current) return;

        // Middle mouse button or Space key enables panning
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

        if (['pen', 'highlighter'].includes(currentTool)) {
            isDrawing.current = true;

            const newPoint: Point = {
                x,
                y,
                pressure: e.pressure,
                timestamp: Date.now()
            };

            rawPointsRef.current = [newPoint];

            // Render initial point (dot)
            if (previewPathRef.current) {
                const strokePoints = getStroke(
                    rawPointsRef.current.map(p => [p.x, p.y, p.pressure || 0.5]),
                    {
                        size: penSize / viewport.scale,
                        thinning: 0.5,
                        smoothing: 0.5,
                        streamline: 0.5,
                    }
                );
                previewPathRef.current.setAttribute('d', getSvgPathFromStroke(strokePoints));
            }
        }

        if (currentTool === 'select') {
            isDrawing.current = true;
            selectionStart.current = { x, y };
            setSelectionBox({ x, y, width: 0, height: 0 });
            setSelectionMenuPos(null);
        }
    };

    // --- 2. Pointer Move ---
    const handlePointerMove = (e: React.PointerEvent) => {
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
            // Using e.getCoalescedEvents() for smoother laser if needed, but simple sampling is usually fine for laser
            editorDispatch({ type: 'ADD_LASER_POINT', payload: { x, y, timestamp: Date.now() } });
            return;
        }

        if (currentTool === 'eraser' && e.buttons === 1) {
            // Eraser logic remains simple direct manipulation
            // TODO: Eraser could also benefit from coalesced events ensures no missed spots
            const eraseRadius = 20 / viewport.scale;
            // Native PointerEvent has getCoalescedEvents
            const nativeEvent = e.nativeEvent as PointerEvent;
            const coalesced = (nativeEvent && typeof nativeEvent.getCoalescedEvents === 'function')
                ? nativeEvent.getCoalescedEvents()
                : [nativeEvent || e];

            let strokesToRemove: string[] = [];

            coalesced.forEach((ce) => {
                const cCoords = getCanvasCoordinates(ce as PointerEvent);
                const currentStateStrokes = editorState.strokes; // Note: access latest state if possible, though React batching might delay

                // Finding strokes to remove (simplified for performance)
                // A real implementation might need a spatial index
                currentStateStrokes.forEach(s => {
                    if (s.rawPoints && s.rawPoints.some((p: Point) => distanceBetween(p, cCoords) < eraseRadius)) {
                        strokesToRemove.push(s.id);
                    }
                });
            });

            if (strokesToRemove.length > 0) {
                const newStrokes = editorState.strokes.filter(s => !strokesToRemove.includes(s.id));
                if (newStrokes.length !== editorState.strokes.length) {
                    editorDispatch({ type: 'SET_STROKES', payload: newStrokes });
                }
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

        if (['pen', 'highlighter'].includes(currentTool)) {
            // Use coalesced events for higher precision
            const nativeEvent = e.nativeEvent as PointerEvent;
            const events = (nativeEvent && typeof nativeEvent.getCoalescedEvents === 'function')
                ? nativeEvent.getCoalescedEvents()
                : [nativeEvent || e];

            events.forEach((ce) => {
                const coords = getCanvasCoordinates(ce as PointerEvent);
                rawPointsRef.current.push({
                    x: coords.x,
                    y: coords.y,
                    pressure: ce.pressure,
                    timestamp: Date.now()
                });
            });

            if (previewPathRef.current) {
                const strokePoints = getStroke(
                    rawPointsRef.current.map(p => [p.x, p.y, p.pressure || 0.5]),
                    {
                        size: penSize / viewport.scale,
                        thinning: 0.5,
                        smoothing: 0.5,
                        streamline: 0.5,
                    }
                );
                previewPathRef.current.setAttribute('d', getSvgPathFromStroke(strokePoints));
            }
        }
    };

    // --- 3. Pointer Up ---
    const handlePointerUp = (e: React.PointerEvent) => {
        (e.target as Element).releasePointerCapture(e.pointerId);

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

        const RECORDABLE_TOOLS = ['pen', 'highlighter'];

        if (RECORDABLE_TOOLS.includes(currentTool) && rawPointsRef.current.length > 0) {
            const author = editorState.isStudentStage ? 'student' : editorState.userRole;

            // Generate final path
            const strokePoints = getStroke(
                rawPointsRef.current.map(p => [p.x, p.y, p.pressure || 0.5]),
                {
                    size: penSize / viewport.scale,
                    thinning: 0.5,
                    smoothing: 0.5,
                    streamline: 0.5,
                }
            );
            const finalPath = getSvgPathFromStroke(strokePoints);

            editorDispatch({
                type: 'ADD_STROKE',
                payload: {
                    id: String(Date.now()),
                    path: finalPath,
                    color: penColor,
                    size: penSize,
                    tool: currentTool,
                    rawPoints: [...rawPointsRef.current],
                    author: author,
                    timestamp: Date.now()
                }
            });

            rawPointsRef.current = [];
            if (previewPathRef.current) previewPathRef.current.setAttribute('d', '');
        } else {
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
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        isPanning,
        isSpacePressed
    };
}