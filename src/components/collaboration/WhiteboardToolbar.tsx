// components/collaboration/WhiteboardToolbar.tsx
import React from 'react';

const COLORS = ['#000000', '#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7'];

interface WhiteboardToolbarProps {
  currentColor: string;
  currentSize: number;
  onColorChange: (color: string) => void;
  onSizeChange: (size: number) => void;
}

export const WhiteboardToolbar: React.FC<WhiteboardToolbarProps> = ({
  currentColor,
  currentSize,
  onColorChange,
  onSizeChange,
}) => {
  return (
    <div className="flex items-center gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">顏色：</span>
      <div className="flex gap-2">
        {COLORS.map(color => (
          <button
            key={color}
            onClick={() => onColorChange(color)}
            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
              currentColor === color ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'border-gray-300'
            }`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">粗細：</span>
      <input
        type="range"
        min="1"
        max="20"
        value={currentSize}
        onChange={(e) => onSizeChange(Number(e.target.value))}
        className="w-32"
      />
      <span className="text-sm text-gray-600 dark:text-gray-400">{currentSize}px</span>
    </div>
  );
};

export default WhiteboardToolbar;
