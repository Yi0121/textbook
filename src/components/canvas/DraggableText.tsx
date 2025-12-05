import React, { useState, useRef, useEffect } from 'react';
import { Trash2, Plus, Minus, Type } from 'lucide-react';

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
  
  // 拖曳邏輯
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isEditing && inputRef.current) {
        inputRef.current.focus();
    }
  }, [isEditing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    e.stopPropagation();
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const dx = (e.clientX - lastPos.current.x) / scale;
      const dy = (e.clientY - lastPos.current.y) / scale;
      onUpdate(data.id, { x: data.x + dx, y: data.y + dy });
      lastPos.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseUp = () => { isDragging.current = false; };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [data.id, data.x, data.y, onUpdate, scale]);

  const handleBlur = () => {
      // 稍微延遲 Blur，防止點擊上方工具列時觸發 Blur 導致關閉
      setTimeout(() => {
        // 如果點擊的是工具列按鈕，我們不關閉編輯模式 (這裡簡化處理，實際專案可用 relatedTarget)
      }, 100);
  };

  const finishEditing = () => {
      setIsEditing(false);
      onUpdate(data.id, { text: tempText });
      if (tempText.trim() === "") onDelete(data.id);
  };

  // 字體切換列表
  const fonts = ['sans-serif', 'serif', 'monospace', 'cursive'];

  return (
    <div
      className={`absolute group ${isEditing ? 'z-50' : 'z-10 cursor-move'}`}
      style={{ left: data.x, top: data.y }}
      onMouseDown={handleMouseDown}
      onDoubleClick={() => setIsEditing(true)}
    >
      {/* 編輯模式下的迷你工具列 */}
      {isEditing && (
          <div 
            className="absolute -top-12 left-0 bg-white shadow-lg rounded-lg border border-gray-200 flex items-center gap-1 p-1 z-50 whitespace-nowrap"
            onMouseDown={(e) => e.stopPropagation()} // 防止拖曳
          >
              <button onClick={() => onUpdate(data.id, { fontSize: Math.max(12, data.fontSize - 2) })} className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Minus className="w-3 h-3" /></button>
              <span className="text-xs font-mono w-6 text-center select-none">{data.fontSize}</span>
              <button onClick={() => onUpdate(data.id, { fontSize: Math.min(72, data.fontSize + 2) })} className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Plus className="w-3 h-3" /></button>
              <div className="w-px h-4 bg-gray-200 mx-1"></div>
              <button 
                onClick={() => {
                    const currentIdx = fonts.indexOf(data.fontFamily || 'sans-serif');
                    const nextFont = fonts[(currentIdx + 1) % fonts.length];
                    onUpdate(data.id, { fontFamily: nextFont });
                }} 
                className="p-1.5 hover:bg-gray-100 rounded text-gray-600 flex items-center gap-1 text-xs font-bold"
              >
                  <Type className="w-3 h-3" />
                  {data.fontFamily === 'serif' ? '襯線' : (data.fontFamily === 'cursive' ? '手寫' : '黑體')}
              </button>
              <div className="w-px h-4 bg-gray-200 mx-1"></div>
              <button onClick={finishEditing} className="px-2 py-1 bg-indigo-500 text-white text-xs rounded hover:bg-indigo-600">完成</button>
          </div>
      )}

      {isEditing ? (
        <textarea
          ref={inputRef}
          value={tempText}
          onChange={(e) => setTempText(e.target.value)}
          className="bg-white/90 border-2 border-indigo-500 rounded p-1 outline-none min-w-[100px] shadow-lg overflow-hidden"
          style={{ 
              fontSize: `${data.fontSize}px`, 
              color: data.color,
              fontFamily: data.fontFamily || 'sans-serif',
              resize: 'both'
          }}
        />
      ) : (
        <div className="relative">
            <div 
                className="whitespace-pre-wrap p-1 border-2 border-transparent hover:border-indigo-200 rounded transition-colors select-none"
                style={{ 
                    fontSize: `${data.fontSize}px`, 
                    color: data.color,
                    fontFamily: data.fontFamily || 'sans-serif'
                }}
            >
                {data.text || "點擊輸入文字"}
            </div>
            {/* 刪除按鈕 */}
            <button 
                onClick={(e) => { e.stopPropagation(); onDelete(data.id); }}
                className="absolute -top-4 -right-4 p-1 bg-white border border-gray-200 rounded-full shadow-sm text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Trash2 className="w-3 h-3" />
            </button>
        </div>
      )}
    </div>
  );
};

export default DraggableText;