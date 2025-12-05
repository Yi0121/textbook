import React, { useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

interface DraggableShapeProps {
  data: { id: number; x: number; y: number; type: 'rect' | 'circle' | 'triangle'; color: string; size: number };
  onUpdate: (id: number, newData: any) => void;
  onDelete: (id: number) => void;
  scale: number;
}

const DraggableShape: React.FC<DraggableShapeProps> = ({ data, onUpdate, onDelete, scale }) => {
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
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

  return (
    <div
      className="absolute group cursor-move z-10"
      style={{ left: data.x, top: data.y, width: data.size, height: data.size }}
      onMouseDown={handleMouseDown}
    >
      <div className="w-full h-full relative transition-transform hover:scale-105">
          {/* Render Shape based on type */}
          {data.type === 'rect' && (
              <div className="w-full h-full rounded-xl border-4" style={{ borderColor: data.color, backgroundColor: `${data.color}20` }}></div>
          )}
          {data.type === 'circle' && (
              <div className="w-full h-full rounded-full border-4" style={{ borderColor: data.color, backgroundColor: `${data.color}20` }}></div>
          )}
          {data.type === 'triangle' && (
              <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible drop-shadow-sm">
                  <polygon points="50,5 95,95 5,95" stroke={data.color} strokeWidth="8" fill={`${data.color}20`} strokeLinejoin="round" />
              </svg>
          )}

          {/* Delete Button */}
          <button 
              onClick={(e) => { e.stopPropagation(); onDelete(data.id); }}
              className="absolute -top-3 -right-3 p-1.5 bg-white border border-gray-200 rounded-full shadow-sm text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
          >
              <Trash2 className="w-3.5 h-3.5" />
          </button>
      </div>
    </div>
  );
};

export default DraggableShape;