// components/collaboration/Whiteboard.tsx
import React, { useRef, useState, useEffect } from 'react';
import { X, Trash2, Users, Download } from 'lucide-react';
import { useCollaboration, useCurrentWhiteboard, useWhiteboardActions } from '../../context/CollaborationContext';

interface WhiteboardProps {
  onClose: () => void;
}

const Whiteboard: React.FC<WhiteboardProps> = ({ onClose }) => {
  const { state } = useCollaboration();
  const currentWhiteboard = useCurrentWhiteboard();
  const { addStroke, clearWhiteboard } = useWhiteboardActions();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentSize, setCurrentSize] = useState(3);

  // 初始化畫布
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 設定畫布大小
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // 繪製現有筆觸
    if (currentWhiteboard) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      currentWhiteboard.strokes.forEach(stroke => {
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        stroke.points.forEach((point: { x: number; y: number }, index: number) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      });
    }
  }, [currentWhiteboard?.strokes]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);

    // 開始新筆觸
    newStroke.current = {
      color: currentColor,
      size: currentSize,
      points: [{ x, y }],
      timestamp: Date.now(),
      author: state.currentUserId,
    };
  };

  const newStroke = useRef<any>(null);

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();

    // 記錄點
    if (newStroke.current) {
      newStroke.current.points.push({ x, y });
    }
  };

  const stopDrawing = () => {
    if (isDrawing && newStroke.current && currentWhiteboard) {
      addStroke(currentWhiteboard.id, newStroke.current);
      newStroke.current = null;
    }
    setIsDrawing(false);
  };

  const handleClear = () => {
    if (currentWhiteboard && confirm('確定要清空白板嗎？')) {
      clearWhiteboard(currentWhiteboard.id);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  if (!currentWhiteboard) {
    return null;
  }

  const colors = ['#000000', '#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7'];

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* 白板主體 */}
      <div className="fixed inset-8 z-[151] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-300">
        {/* 標題列 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Users className="w-6 h-6" />
              <h2 className="text-xl font-bold">{currentWhiteboard.title}</h2>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {currentWhiteboard.participants.length} 位參與者
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="下載白板"
            >
              <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={handleClear}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="清空白板"
            >
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* 工具列 */}
        <div className="flex items-center gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">顏色：</span>
          <div className="flex gap-2">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => setCurrentColor(color)}
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
            onChange={(e) => setCurrentSize(Number(e.target.value))}
            className="w-32"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">{currentSize}px</span>
        </div>

        {/* 畫布 */}
        <div className="flex-1 p-4 overflow-hidden">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            className="w-full h-full bg-white dark:bg-gray-950 rounded-lg shadow-inner cursor-crosshair"
            style={{ touchAction: 'none' }}
          />
        </div>

        {/* 提示文字 */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            💡 提示：按住滑鼠左鍵拖曳即可繪圖，所有參與者都能看到您的繪製內容
          </p>
        </div>
      </div>
    </>
  );
};

export default Whiteboard;
