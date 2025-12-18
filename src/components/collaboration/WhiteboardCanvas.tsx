// components/collaboration/WhiteboardCanvas.tsx
import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';

// 白板內部使用的筆觸介面，兼容 WhiteboardStroke
interface WhiteboardCanvasStroke {
  color: string;
  size: number;
  points?: Array<{ x: number; y: number }>;  // 用於即時繪製
  path?: string;                              // SVG path 格式（兼容全局 Stroke）
  rawPoints?: Array<{ x: number; y: number; timestamp?: number }>; // 兼容全局 Stroke
  timestamp?: number;
  author?: string;
  authorRole?: string;
  tool?: string;
  participantId?: string;
}

interface WhiteboardCanvasProps {
  strokes: WhiteboardCanvasStroke[];
  currentColor: string;
  currentSize: number;
  isStudentStage: boolean;
  onStrokeComplete: (stroke: WhiteboardCanvasStroke) => void;
}

export interface WhiteboardCanvasRef {
  toDataURL: () => string | undefined;
}

export const WhiteboardCanvas = forwardRef<WhiteboardCanvasRef, WhiteboardCanvasProps>(
  ({ strokes, currentColor, currentSize, isStudentStage, onStrokeComplete }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isDrawingRef = useRef(false);
    const newStrokeRef = useRef<WhiteboardCanvasStroke | null>(null);

    useImperativeHandle(ref, () => ({
      toDataURL: () => canvasRef.current?.toDataURL(),
    }));

    // 初始化畫布並繪製現有筆觸
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 設定畫布大小
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      // 繪製現有筆觸
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      strokes.forEach((stroke) => {
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // 如果是學生上台模式且有作者資訊，可以用不同透明度區分
        if (isStudentStage && stroke.author) {
          ctx.globalAlpha = stroke.authorRole === 'teacher' ? 0.4 : 1.0;
        }

        ctx.beginPath();
        // 優先使用 points，若無則使用 rawPoints
        const pointsToRender = stroke.points || stroke.rawPoints?.map(p => ({ x: p.x, y: p.y }));
        if (pointsToRender && pointsToRender.length > 0) {
          pointsToRender.forEach((point, index) => {
            if (index === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          ctx.stroke();
        }

        // 重置透明度
        ctx.globalAlpha = 1.0;
      });
    }, [strokes, isStudentStage]);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
      isDrawingRef.current = true;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.strokeStyle = currentColor;
      ctx.lineWidth = currentSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(x, y);

      // 開始新筆觸
      newStrokeRef.current = {
        color: currentColor,
        size: currentSize,
        points: [{ x, y }],
        timestamp: Date.now(),
      };
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawingRef.current) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.lineTo(x, y);
      ctx.stroke();

      // 記錄點
      if (newStrokeRef.current?.points) {
        newStrokeRef.current.points.push({ x, y });
      }
    };

    const stopDrawing = () => {
      if (isDrawingRef.current && newStrokeRef.current) {
        onStrokeComplete(newStrokeRef.current);
        newStrokeRef.current = null;
      }
      isDrawingRef.current = false;
    };

    return (
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="w-full h-full bg-white dark:bg-gray-950 rounded-lg shadow-inner cursor-crosshair"
        style={{ touchAction: 'none' }}
      />
    );
  }
);

WhiteboardCanvas.displayName = 'WhiteboardCanvas';

export default WhiteboardCanvas;
