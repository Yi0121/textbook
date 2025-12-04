import React, { useRef, useEffect } from 'react';
import { Sparkles, XCircle } from 'lucide-react';

interface AIMemoCardProps {
  data: { id: number; x: number; y: number; keyword: string; content: string };
  onDelete: () => void;
  onUpdate: (id: number, dx: number, dy: number) => void;
  scale: number;
}

const AIMemoCard: React.FC<AIMemoCardProps> = ({ data, onDelete, onUpdate, scale }) => {
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
            onUpdate(data.id, dx, dy);
            lastPos.current = { x: e.clientX, y: e.clientY };
        };
        const handleMouseUp = () => { isDragging.current = false; };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [data.id, onUpdate, scale]);

    return (
        <div 
            className="absolute z-10 w-64 bg-yellow-50 rounded-xl shadow-xl border border-yellow-200/60 p-4 origin-top-left group cursor-move hover:shadow-2xl hover:scale-105 transition-all animate-in zoom-in duration-300" 
            style={{ top: data.y, left: data.x }}
            onMouseDown={handleMouseDown}
        >
            <div className="flex justify-between items-start mb-2 pointer-events-none">
                <div className="flex items-center gap-1.5 text-yellow-700 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" /> AI Summary
                </div>
                <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="pointer-events-auto text-yellow-400 hover:text-yellow-700 opacity-0 group-hover:opacity-100 transition-opacity"><XCircle className="w-4 h-4" /></button>
            </div>
            <div className="text-sm font-bold text-gray-800 mb-1 pointer-events-none select-none">{data.keyword}</div>
            <p className="text-xs text-gray-600 leading-relaxed font-medium pointer-events-none select-none">{data.content}</p>
        </div>
    );
};

export default AIMemoCard;