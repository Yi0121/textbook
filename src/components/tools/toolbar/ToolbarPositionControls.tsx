// components/tools/toolbar/ToolbarPositionControls.tsx
import { GripVertical, ChevronRight, MoveLeft, MoveRight } from 'lucide-react';

interface ToolbarPositionControlsProps {
  isExpanded: boolean;
  setIsExpanded: (v: boolean) => void;
  toolbarPosition: 'center' | 'left' | 'right';
  setToolbarPosition: (v: 'center' | 'left' | 'right') => void;
}

export function ToolbarPositionControls({
  isExpanded,
  setIsExpanded,
  toolbarPosition,
  setToolbarPosition,
}: ToolbarPositionControlsProps) {
  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        title={isExpanded ? '收合工具列' : '展開工具列'}
      >
        {isExpanded ? <GripVertical className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {isExpanded && (
        <div className="flex items-center gap-0.5 border-l border-gray-200 pl-1 ml-1">
          <button
            onClick={() => setToolbarPosition('left')}
            className={`p-1 rounded transition-colors ${
              toolbarPosition === 'left'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
            title="移到左側"
          >
            <MoveLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setToolbarPosition('center')}
            className={`p-1 rounded transition-colors ${
              toolbarPosition === 'center'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
            title="置中"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setToolbarPosition('right')}
            className={`p-1 rounded transition-colors ${
              toolbarPosition === 'right'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
            title="移到右側"
          >
            <MoveRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
