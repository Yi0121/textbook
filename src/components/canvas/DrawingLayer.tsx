import React from 'react';

// 定義 Props 介面
interface DrawingLayerProps {
  active: boolean;
  strokes: any[];
  currentPath: string[];
  onDrawStart: (e: React.MouseEvent) => void;
  onDrawMove: (e: React.MouseEvent) => void;
  onDrawEnd: (e: React.MouseEvent) => void;
  penColor: string;
  penSize: number;
  currentTool: string;
  selectionBox: any;
  laserPath: any[];
}

const DrawingLayer: React.FC<DrawingLayerProps> = ({ 
  active, strokes, currentPath, onDrawStart, onDrawMove, onDrawEnd, 
  penColor, penSize, currentTool, selectionBox, laserPath 
}) => {
  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20"
      style={{ pointerEvents: active ? 'auto' : 'none' }} 
      onMouseDown={onDrawStart}
      onMouseMove={onDrawMove}
      onMouseUp={onDrawEnd}
      onMouseLeave={onDrawEnd}
    >
      <defs>
        {/* 雷射筆發光濾鏡 */}
        <filter id="laser-bloom" height="300%" width="300%" x="-100%" y="-100%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur1" />
          <feColorMatrix in="blur1" type="matrix" values="0 0 0 0 1  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0" result="redGlow" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur2" />
          <feMerge>
            <feMergeNode in="redGlow" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 螢光筆 (底層，Multiply) */}
      {strokes.filter((s:any) => s.tool === 'highlighter').map((stroke: any, i: number) => (
        <path
          key={`hl-${i}`}
          d={stroke.path}
          stroke={stroke.color}
          strokeWidth={stroke.size}
          fill="none"
          strokeLinecap="butt"
          strokeLinejoin="round"
          style={{ mixBlendMode: 'multiply', opacity: 0.6 }}
        />
      ))}

      {/* 普通畫筆 (中層) */}
      {strokes.filter((s:any) => s.tool !== 'highlighter').map((stroke: any, i: number) => (
        <path
          key={`pen-${i}`}
          d={stroke.path}
          stroke={stroke.color}
          strokeWidth={stroke.size}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
      
      {/* 正在畫的筆跡 */}
      {currentPath.length > 0 && (
        <path
          d={currentPath.join(' ')}
          stroke={penColor}
          strokeWidth={penSize}
          fill="none"
          strokeLinecap={currentTool === 'highlighter' ? "butt" : "round"}
          strokeLinejoin="round"
          style={currentTool === 'highlighter' ? { mixBlendMode: 'multiply', opacity: 0.6 } : {}}
        />
      )}

      {/* 範圍選取框 */}
      {selectionBox && (
         <rect 
            x={selectionBox.x}
            y={selectionBox.y}
            width={selectionBox.width}
            height={selectionBox.height}
            fill="rgba(59, 130, 246, 0.1)" 
            stroke="#3b82f6"              
            strokeWidth={1.5}
            strokeDasharray="4 2"
            rx={4}
         />
      )}

      {/* 雷射筆特效 */}
      {laserPath.length > 0 && (
          <g filter="url(#laser-bloom)">
            {/* 紅色光暈 */}
            {laserPath.map((point: any, i: number) => {
                if (i === laserPath.length - 1) return null;
                const nextPoint = laserPath[i + 1];
                const progress = i / (laserPath.length - 1);
                const size = 1 + (8 * Math.pow(progress, 3)); 

                return (
                    <line
                        key={`glow-${point.timestamp}`}
                        x1={point.x} y1={point.y}
                        x2={nextPoint.x} y2={nextPoint.y}
                        stroke="#ef4444" 
                        strokeWidth={size}
                        strokeOpacity={0.8}
                        strokeLinecap="round"
                    />
                );
            })}
            {/* 白色核心 */}
            {laserPath.map((point: any, i: number) => {
                if (i === laserPath.length - 1) return null;
                const nextPoint = laserPath[i + 1];
                const progress = i / (laserPath.length - 1);
                if (progress < 0.3) return null;
                const size = 1 + (4 * Math.pow(progress, 4)); 

                return (
                    <line
                        key={`core-${point.timestamp}`}
                        x1={point.x} y1={point.y}
                        x2={nextPoint.x} y2={nextPoint.y}
                        stroke="#ffffff"
                        strokeWidth={size}
                        strokeOpacity={0.9}
                        strokeLinecap="round"
                    />
                );
            })}
            {/* 筆尖 */}
            {laserPath.length > 0 && (
                <circle 
                    cx={laserPath[laserPath.length - 1].x} 
                    cy={laserPath[laserPath.length - 1].y} 
                    r={5} 
                    fill="#ffffff" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                />
            )}
          </g>
      )}
    </svg>
  );
};

export default DrawingLayer;