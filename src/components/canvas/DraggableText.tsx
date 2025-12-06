import React, { useState, useRef, useEffect } from 'react';
import { Trash2, GripVertical } from 'lucide-react';

interface DraggableTextProps {
  data: { id: number; x: number; y: number; text: string; color: string; fontSize: number; fontFamily?: string };
  onUpdate: (id: number, newData: any) => void;
  onDelete: (id: number) => void;
  scale: number;
}

const DraggableText: React.FC<DraggableTextProps> = ({ data, onUpdate, onDelete, scale }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempText, setTempText] = useState(data.text);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // UI 狀態：控制視覺 (是否被抓起)
  const [isDraggingState, setIsDraggingState] = useState(false);

  // 效能優化：使用 Ref 紀錄拖曳數據，不觸發 Render
  const dragData = useRef({
      isDragging: false,
      startX: 0,
      startY: 0,
      totalDx: 0,
      totalDy: 0
  });

  // 自動聚焦輸入框
  useEffect(() => {
    if (isEditing && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select(); // 全選方便修改
    }
  }, [isEditing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // [重要] 如果正在編輯，或者點擊的是輸入框，就不啟動拖曳
    if (isEditing) return;
    
    e.stopPropagation();
    
    dragData.current = {
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY,
        totalDx: 0,
        totalDy: 0
    };
    setIsDraggingState(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragData.current.isDragging || !containerRef.current) return;
      e.preventDefault();

      const dx = (e.clientX - dragData.current.startX) / scale;
      const dy = (e.clientY - dragData.current.startY) / scale;

      // 直接移動 DOM，不寫入 React State -> 解決延遲
      containerRef.current.style.transform = `translate(${dx}px, ${dy}px) scale(1.05)`;
      
      dragData.current.totalDx = dx;
      dragData.current.totalDy = dy;
    };

    const handleMouseUp = () => {
      if (!dragData.current.isDragging) return;
      
      dragData.current.isDragging = false;
      setIsDraggingState(false);

      // 拖曳結束，更新真實座標
      if (dragData.current.totalDx !== 0 || dragData.current.totalDy !== 0) {
         // 注意：這裡我們只更新位置，不更新文字內容
         onUpdate(data.id, { 
             x: data.x + dragData.current.totalDx, 
             y: data.y + dragData.current.totalDy 
         });
      }

      // 重置 transform
      if (containerRef.current) {
          containerRef.current.style.transform = 'none';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [data.id, data.x, data.y, onUpdate, scale]); // 依賴項加入 x, y 確保計算基準正確

  // 處理文字輸入完成
  const handleBlur = () => {
      setIsEditing(false);
      if (tempText !== data.text) {
          onUpdate(data.id, { text: tempText });
      }
  };

  return (
    <div
      ref={containerRef}
      className={`absolute z-30 group flex items-start`}
      style={{ 
          top: data.y, 
          left: data.x,
          transition: isDraggingState ? 'none' : 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={() => setIsEditing(true)}
    >
      
      {/* 拖曳時的裝飾把手 (只有 Hover 或 拖曳時顯示) */}
      {!isEditing && (
        <div className={`
            absolute -left-6 top-1/2 -translate-y-1/2 p-1 rounded-md
            text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 cursor-grab active:cursor-grabbing
            transition-opacity duration-200
            ${isDraggingState ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        `}>
            <GripVertical className="w-4 h-4" />
        </div>
      )}

      {isEditing ? (
        <textarea
          ref={inputRef}
          value={tempText}
          onChange={(e) => setTempText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => { e.stopPropagation(); }} // 防止觸發全域快捷鍵
          className="bg-white shadow-xl rounded-lg p-3 outline-none min-w-[120px] resize overflow-hidden border-2 border-indigo-500 animate-in zoom-in-95 duration-200"
          style={{ 
              fontSize: `${data.fontSize}px`, 
              color: data.color,
              fontFamily: data.fontFamily || 'sans-serif',
              lineHeight: 1.4
          }}
          placeholder="輸入文字..."
        />
      ) : (
        <div className="relative">
            <div 
                className={`
                    whitespace-pre-wrap px-2 py-1 border-2 border-transparent rounded-lg transition-all
                    ${isDraggingState 
                        ? 'bg-indigo-50/50 border-indigo-300/50 scale-105' 
                        : 'hover:bg-gray-50/50 hover:border-gray-200'
                    }
                `}
                style={{ 
                    fontSize: `${data.fontSize}px`, 
                    color: data.color,
                    fontFamily: data.fontFamily || 'sans-serif',
                    lineHeight: 1.4,
                    cursor: isDraggingState ? 'grabbing' : 'grab'
                }}
            >
                {data.text || <span className="text-gray-400 italic">點擊輸入文字...</span>}
            </div>
            
            {/* 刪除按鈕 */}
            {!isDraggingState && (
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(data.id); }}
                    className="absolute -top-3 -right-3 p-1.5 bg-white border border-gray-200 rounded-full shadow-sm text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                    title="刪除"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
      )}
    </div>
  );
};

export default DraggableText;