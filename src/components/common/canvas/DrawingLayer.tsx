import React, { useMemo, forwardRef } from 'react';
import type { Stroke, SelectionBox, Point, LaserPoint } from '../../types';

// --- 1. 幾何演算法：將點陣列轉換為平滑曲線 ---
const getSmoothPath = (points: Point[]) => {
  if (!points || points.length === 0) return '';
  if (points.length < 3) return `M ${points[0].x} ${points[0].y} L ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;

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

// --- 2. 獨立筆畫元件 ---
const StrokePath = React.memo(({ stroke }: { stroke: Stroke }) => {
  const d = useMemo(() => {
    return stroke.rawPoints ? getSmoothPath(stroke.rawPoints) : stroke.path;
  }, [stroke.rawPoints, stroke.path]);

  const isHighlighter = stroke.tool === 'highlighter';

  return (
    <path
      d={d}
      stroke={stroke.color}
      strokeWidth={stroke.size}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={isHighlighter ? 0.4 : 1}
      style={{
        mixBlendMode: isHighlighter ? 'multiply' : 'normal',
        transition: 'stroke-width 0.2s',
      }}
      shapeRendering="geometricPrecision"
    />
  );
}, (prev, next) => prev.stroke.id === next.stroke.id);

// --- Main Component ---
interface DrawingLayerProps {
  active: boolean;
  strokes: Stroke[];
  penColor: string;
  penSize: number;
  currentTool: string;
  selectionBox: SelectionBox | null;
  laserPath: LaserPoint[];
}

const DrawingLayer = forwardRef<SVGPathElement, DrawingLayerProps>(({
  strokes,
  penColor,
  penSize,
  currentTool,
  selectionBox,
  laserPath
}, ref) => {

  // 計算雷射筆的路徑
  const laserD = useMemo(() => getSmoothPath(laserPath), [laserPath]);
  const laserTip = laserPath.length > 0 ? laserPath[laserPath.length - 1] : null;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-20"
      style={{ willChange: 'contents' }}
    >
      <defs>
        {/* [修正] 雷射光暈濾鏡：改用單純的高斯模糊，去除產生白點的 ColorMatrix */}
        <filter id="laser-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* 1. 歷史筆跡 */}
      {strokes.map((stroke: Stroke) => (
        <StrokePath key={stroke.id} stroke={stroke} />
      ))}

      {/* 2. 正在畫的筆跡 (Ghost Path) */}
      <path
        ref={ref}
        stroke={penColor}
        strokeWidth={penSize}
        fill="none"
        strokeLinecap={currentTool === 'highlighter' ? "butt" : "round"}
        strokeLinejoin="round"
        strokeOpacity={currentTool === 'highlighter' ? 0.5 : 1}
        style={{ mixBlendMode: currentTool === 'highlighter' ? 'multiply' : 'normal' }}
      />

      {/* 3. 範圍選取框 */}
      {selectionBox && (
        <rect
          x={selectionBox.x} y={selectionBox.y}
          width={selectionBox.width} height={selectionBox.height}
          fill="rgba(99, 102, 241, 0.1)"
          stroke="#6366f1"
          strokeWidth={1.5}
          strokeDasharray="6 4"
          rx={8}
          className="animate-pulse"
        />
      )}

      {/* 4. [修正] 雷射筆特效：移除動畫，改用靜態光暈 */}
      {laserPath.length > 0 && laserTip && (
        <g>
          {/* 層級 A: 紅色路徑光暈 */}
          <path
            d={laserD}
            stroke="#ef4444"
            strokeWidth="8"
            strokeOpacity={0.3}
            fill="none"
            strokeLinecap="round"
            filter="url(#laser-glow)"
          />

          {/* 層級 B: 亮白核心路徑 */}
          <path
            d={laserD}
            stroke="#ffffff"
            strokeWidth="2"
            strokeOpacity={0.9}
            fill="none"
            strokeLinecap="round"
          />

          {/* 筆頭：外層光暈 (靜態，無動畫) */}
          <circle
            cx={laserTip.x}
            cy={laserTip.y}
            r={8}
            fill="#ef4444"
            fillOpacity={0.5}
            stroke="none"
          />

          {/* 筆頭：中心實心白點 */}
          <circle
            cx={laserTip.x}
            cy={laserTip.y}
            r={3.5}
            fill="#ffffff"
            stroke="none"
          />
        </g>
      )}
    </svg>
  );
});

DrawingLayer.displayName = 'DrawingLayer';
export default DrawingLayer;