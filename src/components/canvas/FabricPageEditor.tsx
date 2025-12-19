// components/canvas/FabricPageEditor.tsx
import React, { useRef, useEffect, useCallback } from 'react';
import { Canvas, IText, Image as FabricImage, Rect, PencilBrush } from 'fabric';
import type { FabricPage } from '../../types';

interface FabricPageEditorProps {
  page: FabricPage;
  isSelected: boolean;
  scale: number;
  isEditMode: boolean;
  currentTool: string;
  penColor: string;
  penSize: number;
  onUpdate: (id: string, canvasJSON: string) => void;
  onSelect: (id: string) => void;
}

const FabricPageEditor: React.FC<FabricPageEditorProps> = ({
  page,
  isSelected,
  scale,
  isEditMode,
  currentTool,
  penColor,
  penSize,
  onUpdate,
  onSelect,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  const isInitializedRef = useRef(false);

  // 初始化 Fabric Canvas
  useEffect(() => {
    if (!canvasRef.current || isInitializedRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: page.width,
      height: page.height,
      backgroundColor: '#ffffff',
      selection: isEditMode,
    });

    fabricRef.current = canvas;
    isInitializedRef.current = true;

    // 載入現有內容
    if (page.canvasJSON) {
      try {
        canvas.loadFromJSON(page.canvasJSON).then(() => {
          canvas.renderAll();
        });
      } catch (error) {
        console.error('Failed to load canvas JSON:', error);
      }
    }

    // 監聽物件變更
    const handleObjectModified = () => {
      const json = JSON.stringify(canvas.toJSON());
      onUpdate(page.id, json);
    };

    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:added', handleObjectModified);
    canvas.on('object:removed', handleObjectModified);

    // 點擊選中頁面
    canvas.on('mouse:down', () => {
      if (!isSelected) {
        onSelect(page.id);
      }
    });

    return () => {
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:added', handleObjectModified);
      canvas.off('object:removed', handleObjectModified);
      canvas.dispose();
      fabricRef.current = null;
      isInitializedRef.current = false;
    };
  }, [page.id, page.width, page.height]);

  // 更新編輯模式
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.selection = isEditMode;
    canvas.forEachObject((obj) => {
      obj.selectable = isEditMode;
      obj.evented = isEditMode;
    });
    canvas.renderAll();
  }, [isEditMode]);

  // 更新工具
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // 重置繪圖模式
    canvas.isDrawingMode = false;

    switch (currentTool) {
      case 'pen':
      case 'highlighter':
        canvas.isDrawingMode = true;
        const brush = new PencilBrush(canvas);
        brush.color = currentTool === 'highlighter'
          ? `${penColor}80` // 半透明
          : penColor;
        brush.width = currentTool === 'highlighter' ? penSize * 3 : penSize;
        canvas.freeDrawingBrush = brush;
        break;
      case 'cursor':
      default:
        canvas.isDrawingMode = false;
        break;
    }

    canvas.renderAll();
  }, [currentTool, penColor, penSize]);

  // 新增文字
  const addText = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const text = new IText('雙擊編輯文字', {
      left: 100,
      top: 100,
      fontSize: 24,
      fontFamily: 'Noto Sans TC, sans-serif',
      fill: '#1e293b',
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
  }, []);

  // 新增圖片
  const addImage = useCallback((url: string) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    FabricImage.fromURL(url).then((img) => {
      // 縮放圖片以適應頁面
      const maxWidth = page.width * 0.8;
      const maxHeight = page.height * 0.5;
      const scale = Math.min(maxWidth / (img.width || 1), maxHeight / (img.height || 1));

      img.set({
        left: 50,
        top: 50,
        scaleX: scale,
        scaleY: scale,
      });
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
    });
  }, [page.width, page.height]);

  // 新增形狀
  const addShape = useCallback((type: 'rect' | 'circle') => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    if (type === 'rect') {
      const rect = new Rect({
        left: 100,
        top: 100,
        width: 150,
        height: 100,
        fill: '#e0e7ff',
        stroke: '#6366f1',
        strokeWidth: 2,
        rx: 8,
        ry: 8,
      });
      canvas.add(rect);
      canvas.setActiveObject(rect);
    }

    canvas.renderAll();
  }, []);

  // 暴露方法供外部使用
  useEffect(() => {
    // 將方法附加到 DOM 元素以便外部訪問
    if (canvasRef.current) {
      (canvasRef.current as any).fabricMethods = {
        addText,
        addImage,
        addShape,
        getCanvas: () => fabricRef.current,
      };
    }
  }, [addText, addImage, addShape]);

  return (
    <div
      className={`relative transition-all duration-200 ${
        isSelected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
      }`}
      style={{
        width: page.width,
        height: page.height,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
      }}
    >
      <canvas
        ref={canvasRef}
        className="block"
        style={{
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          borderRadius: '4px',
        }}
      />
    </div>
  );
};

export default FabricPageEditor;
