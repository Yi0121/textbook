// components/tools/toolbar/ColorPicker.tsx

interface ColorPickerProps {
  currentTool: string;
  penColor: string;
  setPenColor: (color: string) => void;
  penSize: number;
  setPenSize: (size: number) => void;
}

const COLORS = {
  pen: ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#000000'],
  highlighter: ['#fef08a', '#bbf7d0', '#bfdbfe', '#ddd6fe', '#fbcfe8'],
};

export function ColorPicker({
  currentTool,
  penColor,
  setPenColor,
  penSize,
  setPenSize,
}: ColorPickerProps) {
  const colors = currentTool === 'pen' ? COLORS.pen : COLORS.highlighter;

  return (
    <div
      className="absolute bottom-20 left-12 bg-white p-3 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3 animate-in slide-in-from-bottom-2 z-10"
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* 顏色選擇 */}
      <div className="flex gap-2">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => setPenColor(c)}
            className={`w-6 h-6 rounded-full border border-gray-200 transition-transform ${
              penColor === c
                ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110'
                : 'hover:scale-110'
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <div className="w-px h-6 bg-gray-200" />

      {/* 筆刷大小 */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setPenSize(Math.max(2, penSize - 2))}
          className="p-1 hover:bg-gray-100 rounded"
          title="減小筆刷"
        >
          <div className="w-1 h-1 bg-gray-800 rounded-full" />
        </button>
        <button
          onClick={() => setPenSize(Math.min(20, penSize + 2))}
          className="p-1 hover:bg-gray-100 rounded"
          title="增大筆刷"
        >
          <div className="w-2.5 h-2.5 bg-gray-800 rounded-full" />
        </button>
      </div>
    </div>
  );
}

export { COLORS };
