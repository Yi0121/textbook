import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, XCircle, GripHorizontal } from 'lucide-react';

interface AIMemoCardProps {
  data: { id: number; x: number; y: number; keyword: string; content: string };
  onDelete: () => void;
  onUpdate: (id: number, dx: number, dy: number) => void;
  scale: number;
}

const AIMemoCard: React.FC<AIMemoCardProps> = ({ data, onDelete, onUpdate, scale }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [isDraggingState, setIsDraggingState] = useState(false);
    
    const dragData = useRef({
        isDragging: false,
        startX: 0,
        startY: 0,
        totalDx: 0,
        totalDy: 0
    });

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        dragData.current = {
            isDragging: true,
            startX: e.clientX,
            startY: e.clientY,
            totalDx: 0,
            totalDy: 0
        };
        setIsDraggingState(true);
        
        // 拖曳開始，立刻移除 transition 以求跟手性
        if (cardRef.current) {
            cardRef.current.style.transition = 'none';
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!dragData.current.isDragging || !cardRef.current) return;
            e.preventDefault();

            const dx = (e.clientX - dragData.current.startX) / scale;
            const dy = (e.clientY - dragData.current.startY) / scale;
            
            // 直接操作 DOM transform
            cardRef.current.style.transform = `translate(${dx}px, ${dy}px) scale(1.02) rotate(1deg)`;
            
            dragData.current.totalDx = dx;
            dragData.current.totalDy = dy;
        };

        const handleMouseUp = () => {
            if (!dragData.current.isDragging) return;
            
            dragData.current.isDragging = false;

            // 1. 先更新資料位置 (React 狀態更新)
            if (dragData.current.totalDx !== 0 || dragData.current.totalDy !== 0) {
                onUpdate(data.id, dragData.current.totalDx, dragData.current.totalDy);
            }

            // 2. [修正重點] 手動重置 DOM 狀態，確保畫面停在正確位置，且沒有 transition
            if (cardRef.current) {
                cardRef.current.style.transition = 'none';
                cardRef.current.style.transform = 'none';
            }

            // 3. [修正重點] 延遲切換 React 狀態
            // 等待瀏覽器完成位置重繪後，再切換回 "非拖曳狀態" (這時 transition 才會恢復)
            // 這能完美避免 "歸零動畫" 造成的晃動
            setTimeout(() => {
                setIsDraggingState(false);
            }, 50);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [data.id, onUpdate, scale]);

    return (
        <div 
            ref={cardRef}
            className={`
                absolute z-20 w-64 origin-center
                flex flex-col gap-2 p-4
                bg-amber-50/95 backdrop-blur-sm
                border border-amber-200/60 rounded-2xl
                transition-shadow duration-300
                ${isDraggingState 
                    ? 'cursor-grabbing shadow-2xl shadow-amber-500/20 z-30'
                    : 'cursor-grab shadow-lg hover:shadow-xl hover:scale-[1.01] hover:-translate-y-0.5' 
                }
            `} 
            style={{ 
                top: data.y, 
                left: data.x,
                // 當 isDraggingState 為 true 時，強制關閉 transition
                // 恢復時只對 shadow 和 transform 做動畫 (transform 僅用於 hover 效果)
                transition: isDraggingState ? 'none' : 'box-shadow 0.2s, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            onMouseDown={handleMouseDown}
        >
            <div className="flex justify-between items-start pointer-events-none select-none">
                <div className="flex items-center gap-1.5 text-amber-600 font-bold text-[10px] uppercase tracking-wider bg-amber-100/50 px-2 py-1 rounded-full">
                    <Sparkles className="w-3 h-3 fill-amber-500" /> AI 筆記
                </div>
                <button 
                    onMouseDown={(e) => e.stopPropagation()} 
                    onClick={(e) => { e.stopPropagation(); onDelete(); }} 
                    className="pointer-events-auto p-1 text-amber-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                    <XCircle className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-1 pointer-events-none select-none">
                <div className="text-base font-bold text-gray-800 leading-tight">{data.keyword}</div>
                <div className="text-xs text-gray-600 leading-relaxed font-medium">
                    {data.content}
                </div>
            </div>

            <div className="flex justify-center opacity-0 group-hover:opacity-20 transition-opacity">
                 <GripHorizontal className="w-4 h-4 text-amber-900" />
            </div>
        </div>
    );
};

export default AIMemoCard;