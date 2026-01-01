import React, { useRef, useState, useEffect } from 'react';
import { BrainCircuit, Trash2, GripHorizontal } from 'lucide-react';

interface MindMapNode {
  id: string;
  label: string;
  type: 'root' | 'child';
  offsetX: number;
  offsetY: number;
}

interface MindMapEdge {
  source: string;
  target: string;
}

interface MindMapData {
  id: number;
  x: number;
  y: number;
  nodes: MindMapNode[];
  edges: MindMapEdge[];
}

interface DraggableMindMapProps {
  data: MindMapData;
  onDelete: (id: number) => void;
  onUpdate: (id: number, dx: number, dy: number) => void;
  scale: number;
}

const DraggableMindMap: React.FC<DraggableMindMapProps> = ({ data, onDelete, onUpdate, scale }) => {
    const [isDraggingState, setIsDraggingState] = useState(false);
    const isDraggingRef = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        isDraggingRef.current = true;
        setIsDraggingState(true);
        lastPos.current = { x: e.clientX, y: e.clientY };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDraggingRef.current) return;
            e.preventDefault();
            const dx = (e.clientX - lastPos.current.x) / scale;
            const dy = (e.clientY - lastPos.current.y) / scale;
            onUpdate(data.id, dx, dy);
            lastPos.current = { x: e.clientX, y: e.clientY };
        };

        const handleMouseUp = () => { 
            isDraggingRef.current = false; 
            setIsDraggingState(false); 
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
            className="absolute z-10 pointer-events-auto"
            style={{ left: data.x, top: data.y }}
        >
            {/* 連線層 (SVG) */}
            <svg className="absolute overflow-visible pointer-events-none" style={{ left: 0, top: 0 }}>
                {data.edges.map((edge: MindMapEdge, i: number) => {
                    const start = data.nodes.find((n: MindMapNode) => n.id === edge.source);
                    const end = data.nodes.find((n: MindMapNode) => n.id === edge.target);
                    if(!start || !end) return null;
                    
                    const dx = end.offsetX - start.offsetX;
                    const curvature = 0.5;
                    const c1x = start.offsetX + dx * curvature; 
                    const c1y = start.offsetY;
                    const c2x = end.offsetX - dx * curvature;
                    const c2y = end.offsetY;

                    return (
                        <path 
                            key={i}
                            d={`M ${start.offsetX} ${start.offsetY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${end.offsetX} ${end.offsetY}`}
                            stroke="#cbd5e1" strokeWidth="2" fill="none"
                            className="transition-all duration-75"
                        />
                    );
                })}
            </svg>

            {/* 節點層 */}
            {data.nodes.map((node: MindMapNode) => {
                const isRoot = node.type === 'root';
                return (
                    <div 
                        key={node.id}
                        onMouseDown={isRoot ? handleMouseDown : undefined}
                        className={`
                            absolute flex flex-col items-center justify-center 
                            rounded-2xl border-2 transition-all 
                            ${isRoot 
                                ? `cursor-grab active:cursor-grabbing group
                                   ${isDraggingState 
                                      ? 'scale-110 shadow-2xl rotate-1 border-indigo-500 opacity-90' 
                                      : 'scale-100 shadow-lg border-indigo-400 rotate-0 hover:scale-105'
                                   }
                                   bg-gradient-to-br from-indigo-500 to-indigo-600 text-white w-32 h-20 z-20`
                                : 'bg-white/95 backdrop-blur border-indigo-100 text-gray-700 w-24 h-14 z-10 shadow-sm'
                            }
                        `}
                        style={{ 
                            left: node.offsetX, 
                            top: node.offsetY,
                            transform: 'translate(-50%, -50%)',
                            transitionProperty: 'box-shadow, scale, opacity', 
                            transitionDuration: '0.2s',
                        }}
                    >
                        {isRoot && <BrainCircuit className="w-5 h-5 mb-1 opacity-80" />}
                        
                        <span className={`${isRoot ? 'text-sm' : 'text-xs'} font-bold text-center leading-tight px-1 select-none`}>
                            {node.label}
                        </span>
                        
                        {/* 刪除按鈕 [修正重點] */}
                        {isRoot && (
                            <button 
                                onMouseDown={(e) => e.stopPropagation()} // 再次確保阻擋冒泡
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    e.preventDefault();
                                    onDelete(data.id); 
                                }}
                                // 使用 CSS class 控制顯示，而不是條件渲染，確保 DOM 存在
                                className={`
                                    absolute -top-2 -right-2 p-1.5 bg-white border border-gray-200 rounded-full shadow-md 
                                    text-gray-400 hover:text-red-500 hover:bg-red-50 
                                    transition-all duration-200 cursor-pointer
                                    ${isDraggingState ? 'opacity-0 pointer-events-none scale-0' : 'opacity-0 group-hover:opacity-100 scale-75 hover:scale-100'}
                                `}
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        )}
                        
                        {isRoot && (
                            <div className="absolute top-1 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none">
                                <GripHorizontal className="w-3 h-3 text-white" />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default DraggableMindMap;