import React, { useRef, useEffect } from 'react';
import { BrainCircuit, Trash2 } from 'lucide-react';

// 注意：這裡假設你已經有 src/types/index.ts，如果沒有，請把 any 換回具體型別
interface DraggableMindMapProps {
  data: any; 
  onDelete: (id: number) => void;
  onUpdate: (id: number, dx: number, dy: number) => void;
  scale: number;
}

const DraggableMindMap: React.FC<DraggableMindMapProps> = ({ data, onDelete, onUpdate, scale }) => {
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
            className="absolute z-10 pointer-events-auto group animate-in zoom-in duration-300"
            style={{ left: data.x, top: data.y }}
        >
            <svg className="absolute overflow-visible pointer-events-none" style={{ left: 0, top: 0 }}>
                {data.edges.map((edge: any, i: number) => {
                    const start = data.nodes.find((n:any) => n.id === edge.source);
                    const end = data.nodes.find((n:any) => n.id === edge.target);
                    if(!start || !end) return null;
                    const startX = start.offsetX;
                    const startY = start.offsetY;
                    const endX = end.offsetX;
                    const endY = end.offsetY;
                    const dx = endX - startX;
                    const c1x = startX + dx * 0.5;
                    const c2x = endX - dx * 0.5;
                    return (
                        <path 
                            key={i}
                            d={`M ${startX} ${startY} C ${c1x} ${startY}, ${c2x} ${endY}, ${endX} ${endY}`}
                            stroke="#cbd5e1" strokeWidth="2" fill="none"
                        />
                    );
                })}
            </svg>

            {data.nodes.map((node: any) => (
                <div 
                    key={node.id}
                    className={`
                        absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center 
                        rounded-2xl shadow-lg border-2 transition-all duration-200
                        ${node.type === 'root' 
                            ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 border-indigo-400 text-white w-32 h-20 z-20 cursor-move shadow-indigo-200'
                            : 'bg-white/90 backdrop-blur border-indigo-100 text-gray-700 w-24 h-14 z-10'
                        }
                    `}
                    style={{ left: node.offsetX, top: node.offsetY }}
                    onMouseDown={node.type === 'root' ? handleMouseDown : undefined}
                >
                    {node.type === 'root' && <BrainCircuit className="w-5 h-5 mb-1 opacity-80" />}
                    <span className={`${node.type === 'root' ? 'text-sm' : 'text-xs'} font-bold text-center leading-tight px-1 select-none`}>
                        {node.label}
                    </span>
                    
                    {node.type === 'root' && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDelete(data.id); }}
                            className="absolute -top-3 -right-3 p-1.5 bg-white border border-gray-200 rounded-full shadow-sm text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DraggableMindMap;