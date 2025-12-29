import React, { useState, useEffect } from 'react';
import { Power } from 'lucide-react';

interface ClassroomWidgetsProps {
  mode: 'none' | 'spotlight' | 'curtain';
  onClose: () => void;
}

// 抽離出一個共用的「底部退出按鈕」，確保位置統一且好按
const BottomExitButton = ({ label, onClose }: { label: string; onClose: () => void }) => (
  <button
      onClick={onClose}
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[110]
                 bg-gray-900/80 text-white backdrop-blur-md border border-white/20
                 px-6 py-3 rounded-full shadow-2xl flex items-center gap-2
                 hover:bg-red-600/90 transition-colors cursor-pointer pointer-events-auto
                 group animate-in slide-in-from-bottom-4 fade-in duration-300"
  >
      <Power className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span className="font-bold tracking-wide">{label}</span>
      <span className="text-xs opacity-50 ml-2 border-l border-white/30 pl-2">雙擊畫面也可關閉</span>
  </button>
);

const ClassroomWidgets: React.FC<ClassroomWidgetsProps> = ({ mode, onClose }) => {
  // --- 聚光燈邏輯 ---
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });

  // --- 遮幕邏輯 ---
  const [curtainHeight, setCurtainHeight] = useState(window.innerHeight * 0.4);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (mode === 'spotlight') {
      const move = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
      window.addEventListener('mousemove', move);
      return () => window.removeEventListener('mousemove', move);
    }
  }, [mode]);

  useEffect(() => {
    if (mode === 'curtain' && isDragging) {
      const drag = (e: MouseEvent) => setCurtainHeight(e.clientY);
      const up = () => setIsDragging(false);
      window.addEventListener('mousemove', drag);
      window.addEventListener('mouseup', up);
      return () => {
          window.removeEventListener('mousemove', drag);
          window.removeEventListener('mouseup', up);
      };
    }
  }, [mode, isDragging]);

  if (mode === 'none') return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden pointer-events-none">

      {/* 1. 聚光燈模式 */}
      {mode === 'spotlight' && (
        <div
            className="w-full h-full relative pointer-events-auto cursor-none"
            onDoubleClick={onClose} // [優化] 雙擊任意處關閉
        >
            <svg width="100%" height="100%">
              <defs>
                <mask id="spotlight-mask">
                  <rect x="0" y="0" width="100%" height="100%" fill="white" />
                  {/* 稍微加大聚光燈範圍，讓視野好一點 */}
                  <circle cx={mousePos.x} cy={mousePos.y} r="200" fill="black" />
                </mask>
              </defs>
              <rect width="100%" height="100%" fill="rgba(0,0,0,0.9)" mask="url(#spotlight-mask)" />
            </svg>

            {/* 位於底部正中央的大按鈕 */}
            <BottomExitButton label="關閉聚光燈" onClose={onClose} />
        </div>
      )}

      {/* 2. 遮幕模式 */}
      {mode === 'curtain' && (
        <div
            className="w-full h-full relative pointer-events-auto"
            onDoubleClick={(e) => {
                // 防止雙擊拉桿時誤觸關閉
                if(e.clientY > curtainHeight) onClose();
            }}
        >
            <div className="w-full bg-emerald-700 shadow-2xl relative flex flex-col items-center justify-end transition-all duration-75 ease-out"
                style={{ height: curtainHeight, maxHeight: window.innerHeight - 50 }}
            >
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                {/* 裝飾：窗簾皺褶感 */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />

                {/* 拖曳把手 */}
                <div className="w-full h-14 bg-emerald-800 cursor-row-resize flex items-center justify-center hover:bg-emerald-600 transition-colors shadow-lg border-t border-emerald-600/30"
                    onMouseDown={() => setIsDragging(true)}
                >
                    <div className="w-32 h-1.5 bg-emerald-200/30 rounded-full" />
                </div>
            </div>

            {/* 位於底部正中央的大按鈕 */}
            <BottomExitButton label="收起遮幕" onClose={onClose} />
        </div>
      )}
    </div>
  );
};

export default ClassroomWidgets;
