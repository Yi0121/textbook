import React, { useMemo, forwardRef } from 'react';

// --- 1. 幾何演算法：將點陣列轉換為平滑曲線 (Quadratic Bezier) ---
const getSmoothPath = (points: {x: number, y: number}[]) => {
  if (!points || points.length === 0) return '';
  if (points.length < 3) return `M ${points[0].x} ${points[0].y} L ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;

  // 使用二次貝茲曲線連接中點，消除鋸齒
  for (let i = 1; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    d += ` Q ${p1.x} ${p1.y} ${midX} ${midY}`;
  }

  const last = points[points.length - 1];
  d += ` L ${last.x} ${last.y}`;

  return d;
};

// --- 2. 獨立筆畫元件 (效能關鍵：React.memo) ---
const StrokePath = React.memo(({ stroke }: { stroke: any }) => {
  const d = useMemo(() => {
    // 如果有原始點資料(rawPoints)，就進行平滑運算；否則使用原本的 path
    return stroke.rawPoints ? getSmoothPath(stroke.rawPoints) : stroke.path;
  }, [stroke.rawPoints, stroke.path]);

  const isHighlighter = stroke.tool === 'highlighter';

  return (
    <path
      d={d}
      stroke={stroke.color}
      strokeWidth={stroke.size}
      fill="none"
      strokeLinecap={isHighlighter ? "butt" : "round"}
      strokeLinejoin="round"
      strokeOpacity={isHighlighter ? 0.5 : 1}
      style={{ mixBlendMode: isHighlighter ? 'multiply' : 'normal' }}
    />
  );
});

// --- Main Component ---
interface DrawingLayerProps {
  active: boolean;
  strokes: any[];
  penColor: string;
  penSize: number;
  currentTool: string;
  selectionBox: any;
  laserPath: any[];
}

const DrawingLayer = forwardRef<SVGPathElement, DrawingLayerProps>(({
  strokes,
  penColor,
  penSize,
  currentTool,
  selectionBox,
  laserPath
}, ref) => {

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20">
      <defs>
        {/* 雷射筆發光濾鏡 */}
        <filter id="laser-bloom" height="300%" width="300%" x="-100%" y="-100%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 1. 歷史筆跡 (使用優化過的 StrokePath) */}
      {strokes.map((stroke: any) => (
        <StrokePath key={stroke.id} stroke={stroke} />
      ))}

      {/* 2. 正在畫的筆跡 (Ghost Path - 透過 Ref 直接操作 DOM) */}
      <path
        ref={ref}
        stroke={penColor}
        strokeWidth={penSize}
        fill="none"
        strokeLinecap={currentTool === 'highlighter' ? "butt" : "round"}
        strokeLinejoin="round"
        strokeOpacity={currentTool === 'highlighter' ? 0.5 : 1}
        style={currentTool === 'highlighter' ? { mixBlendMode: 'multiply' } : {}}
      />

      {/* 3. 範圍選取框 */}
      {selectionBox && (
         <rect 
            x={selectionBox.x} y={selectionBox.y}
            width={selectionBox.width} height={selectionBox.height}
            fill="rgba(59, 130, 246, 0.1)" stroke="#3b82f6" strokeWidth={1.5} strokeDasharray="4 2" rx={4}
         />
      )}

      {/* 4. 雷射筆特效 */}
      {laserPath.length > 0 && (
          <g filter="url(#laser-bloom)">
            <path
                d={getSmoothPath(laserPath)}
                stroke="#ef4444" strokeWidth="6" strokeOpacity={0.6} fill="none" strokeLinecap="round"
                className="transition-opacity duration-75"
            />
            <circle 
                cx={laserPath[laserPath.length - 1].x} 
                cy={laserPath[laserPath.length - 1].y} 
                r={6} fill="#ffffff" stroke="#ef4444" strokeWidth={2}
            />
          </g>
      )}
    </svg>
  );
});

DrawingLayer.displayName = 'DrawingLayer';
export default DrawingLayer;