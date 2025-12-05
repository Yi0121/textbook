import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X } from 'lucide-react';

interface FullScreenTimerProps {
  isOpen: boolean;
  onClose: () => void;
}

const FullScreenTimer: React.FC<FullScreenTimerProps> = ({ isOpen, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(300); // 預設 5 分鐘
  const [isActive, setIsActive] = useState(false);
  const [initialTime, setInitialTime] = useState(300);

useEffect(() => {
    let interval: any; // 改成 any，相容瀏覽器環境的 number ID
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // 如果沒開啟，就不渲染任何東西
  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const setTime = (mins: number) => {
    const secs = mins * 60;
    setTimeLeft(secs);
    setInitialTime(secs);
    setIsActive(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/95 flex flex-col items-center justify-center animate-in fade-in duration-300 backdrop-blur-sm">
      {/* 關閉按鈕 */}
      <button 
        onClick={() => { setIsActive(false); onClose(); }}
        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors p-4"
      >
        <X className="w-12 h-12" />
      </button>

      {/* 數字顯示 */}
      <div className={`font-mono text-[25vw] leading-none font-bold tabular-nums tracking-tighter drop-shadow-2xl select-none mb-8
        ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}
      `}>
        {formatTime(timeLeft)}
      </div>

      {/* 快速時間選擇 */}
      <div className="flex gap-6 mb-16">
        {[1, 3, 5, 10, 30].map(min => (
           <button
             key={min}
             onClick={() => setTime(min)}
             className={`px-8 py-3 rounded-full border-2 font-bold text-2xl transition-all
               ${initialTime === min * 60 
                 ? 'bg-white text-slate-900 border-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                 : 'border-slate-600 text-slate-400 hover:border-slate-400 hover:text-white'}
             `}
           >
             {min}m
           </button>
        ))}
      </div>

      {/* 控制按鈕 */}
      <div className="flex items-center gap-12">
        <button 
            onClick={() => setIsActive(!isActive)}
            className="w-32 h-32 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95 shadow-2xl shadow-indigo-900/50"
        >
            {isActive ? <Pause className="w-14 h-14 fill-current" /> : <Play className="w-14 h-14 fill-current ml-2" />}
        </button>
        
        <button 
            onClick={() => { setIsActive(false); setTimeLeft(initialTime); }}
            className="w-20 h-20 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-white transition-colors"
        >
            <RotateCcw className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default FullScreenTimer;