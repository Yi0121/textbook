// components/canvas/PageContainer.tsx
import React, { useRef, useState, useEffect } from 'react';
import { GripHorizontal, Trash2, FileText } from 'lucide-react';
import type { FabricPage } from '../../types';

interface PageContainerProps {
  page: FabricPage;
  isSelected: boolean;
  scale: number;
  onSelect: (id: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onDelete: (id: string) => void;
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({
  page,
  isSelected,
  scale,
  onSelect,
  onMove,
  onDelete,
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const startPagePos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    isDraggingRef.current = true;
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
    startPagePos.current = { x: page.x, y: page.y };
    onSelect(page.id);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();

      const dx = (e.clientX - lastPos.current.x) / scale;
      const dy = (e.clientY - lastPos.current.y) / scale;

      onMove(page.id, startPagePos.current.x + dx + (e.clientX - lastPos.current.x) / scale, startPagePos.current.y + dy + (e.clientY - lastPos.current.y) / scale);
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, page.id, scale, onMove]);

  // 簡化的拖曳處理
  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent) => {
      const dx = (e.clientX - lastPos.current.x) / scale;
      const dy = (e.clientY - lastPos.current.y) / scale;
      onMove(page.id, page.x + dx, page.y + dy);
      lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleUp = () => {
      isDraggingRef.current = false;
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging, page.id, page.x, page.y, scale, onMove]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`確定要刪除頁面「${page.title}」嗎？`)) {
      onDelete(page.id);
    }
  };

  return (
    <div
      className={`absolute pointer-events-auto transition-shadow duration-200 ${
        isDragging ? 'z-50' : 'z-10'
      }`}
      style={{
        left: page.x,
        top: page.y,
        width: page.width,
      }}
      onClick={() => onSelect(page.id)}
    >
      {/* 標題列 */}
      <div
        className={`flex items-center justify-between px-3 py-2 rounded-t-lg transition-colors ${
          isSelected
            ? 'bg-indigo-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        } ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <GripHorizontal className="w-4 h-4 opacity-50" />
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium truncate max-w-[200px]">
            {page.title || '未命名頁面'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs opacity-70">
            {page.order + 1}
          </span>
          <button
            onClick={handleDelete}
            className={`p-1 rounded transition-colors ${
              isSelected
                ? 'hover:bg-indigo-700 text-white/80 hover:text-white'
                : 'hover:bg-red-100 text-gray-400 hover:text-red-600'
            }`}
            title="刪除頁面"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 頁面內容 */}
      <div
        className={`rounded-b-lg overflow-hidden transition-all duration-200 ${
          isSelected
            ? 'ring-2 ring-indigo-500'
            : 'ring-1 ring-gray-200 hover:ring-gray-300'
        } ${isDragging ? 'opacity-90 shadow-2xl' : 'shadow-lg'}`}
      >
        {children}
      </div>

      {/* 頁面尺寸標籤 */}
      {isSelected && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400">
          {page.width} × {page.height}
        </div>
      )}
    </div>
  );
};

export default PageContainer;
