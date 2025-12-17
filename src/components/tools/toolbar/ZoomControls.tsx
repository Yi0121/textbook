// components/tools/toolbar/ZoomControls.tsx
import { Plus, Minus } from 'lucide-react';

interface ZoomControlsProps {
  zoomLevel: number;
  setZoomLevel: (level: number | ((prev: number) => number)) => void;
}

export function ZoomControls({ zoomLevel, setZoomLevel }: ZoomControlsProps) {
  return (
    <div className="hidden sm:flex flex-col items-center gap-0.5 mx-1 shrink-0">
      <button
        onClick={() => setZoomLevel(p => Math.min(3, p + 0.1))}
        className="p-0.5 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 rounded"
        title="放大"
      >
        <Plus className="w-3 h-3" />
      </button>
      <span className="text-[9px] font-bold text-gray-400 font-mono select-none">
        {Math.round(zoomLevel * 100)}%
      </span>
      <button
        onClick={() => setZoomLevel(p => Math.max(0.5, p - 0.1))}
        className="p-0.5 text-gray-400 hover:text-indigo-600 hover:bg-gray-100 rounded"
        title="縮小"
      >
        <Minus className="w-3 h-3" />
      </button>
    </div>
  );
}
