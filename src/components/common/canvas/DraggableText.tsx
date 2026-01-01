import React, { useState, useRef, useEffect } from 'react';
import { Trash2, GripVertical } from 'lucide-react';

interface DraggableTextProps {
  data: {
    id: number;
    x: number;
    y: number;
    text: string;
    color: string;
    fontSize?: number;
  };
  scale: number;
  onUpdate: (id: number, data: { x: number; y: number; text?: string }) => void;
  onDelete: (id: number) => void;
}

const DraggableText: React.FC<DraggableTextProps> = ({ data, scale, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localText, setLocalText] = useState(data.text);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // 用 ref 記錄拖曳起始狀態，解決晃動問題
  const dragStartRef = useRef<{ 
    mouseX: number; 
    mouseY: number; 
    itemX: number; 
    itemY: number 
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // 當進入編輯模式，自動 focus
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  // 處理拖曳開始
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return; // 編輯中不給拖
    e.stopPropagation(); // 防止觸發畫布拖曳
    
    setIsDragging(true);
    
    // 關鍵修正：記錄「按下瞬間」的滑鼠位置與物件位置
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      itemX: data.x,
      itemY: data.y
    };
  };

  // 全域滑鼠事件 (處理拖曳移動與結束)
  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragStartRef.current) return;

      e.preventDefault();

      // 計算滑鼠移動的距離 (除以 scale 以適應縮放)
      const deltaX = (e.clientX - dragStartRef.current.mouseX) / scale;
      const deltaY = (e.clientY - dragStartRef.current.mouseY) / scale;

      // 絕對位置更新：起始位置 + 移動距離
      // 這種算法不會因為 React 渲染延遲而產生晃動
      onUpdate(data.id, {
        x: dragStartRef.current.itemX + deltaX,
        y: dragStartRef.current.itemY + deltaY
      });
    };

    const handleWindowMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        dragStartRef.current = null;
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleWindowMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isDragging, scale, data.id, onUpdate]);

  const handleBlur = () => {
    setIsEditing(false);
    if (localText.trim() === '') {
      onDelete(data.id); // 如果文字是空的，直接刪除
    } else {
      onUpdate(data.id, { x: data.x, y: data.y, text: localText });
    }
  };

  return (
    <div
      className={`absolute flex items-center group transition-colors duration-200 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        left: data.x,
        top: data.y,
        // 為了讓滑鼠指針在文字中心，可以考慮 transform (這裡先不動，避免位置跳動)
        color: data.color,
        fontSize: `${data.fontSize || 24}px`,
        fontWeight: 'bold',
        zIndex: isDragging || isEditing ? 50 : 10, // 拖曳時浮起
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={() => setIsEditing(true)}
      onMouseDown={handleMouseDown}
    >
      {/* 刪除按鈕 (Hover 時顯示) */}
      {!isEditing && (isHovered || isDragging) && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1 bg-white shadow-lg rounded-lg p-1 border border-slate-200 animate-in fade-in zoom-in duration-150">
           <button 
             onClick={(e) => { e.stopPropagation(); onDelete(data.id); }}
             className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition-colors"
             title="刪除"
           >
             <Trash2 size={16} />
           </button>
           {/* 拖曳手把提示 */}
           <div className="p-1 text-slate-300 border-l border-slate-100 cursor-grab">
              <GripVertical size={16} />
           </div>
        </div>
      )}

      {isEditing ? (
        <input
          ref={inputRef}
          value={localText}
          onChange={(e) => setLocalText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleBlur();
            e.stopPropagation(); // 防止觸發 App 的快捷鍵
          }}
          className="bg-white/80 border-2 border-indigo-400 rounded px-2 py-1 outline-none min-w-[100px] shadow-lg"
          style={{ 
            fontSize: `${data.fontSize || 24}px`,
            color: data.color 
          }}
        />
      ) : (
        <div className={`px-2 py-1 rounded border-2 ${isHovered ? 'border-indigo-200 bg-indigo-50/30' : 'border-transparent'}`}>
          {data.text}
        </div>
      )}
    </div>
  );
};

export default DraggableText;