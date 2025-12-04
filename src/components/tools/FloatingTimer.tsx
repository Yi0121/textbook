import React, { useState, useEffect } from 'react';
import { Timer, Minus, X, Pause, Play, RefreshCw } from 'lucide-react';

const FloatingTimer = ({ onClose }: { onClose: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(300);
  const [isActive, setIsActive] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isMinimized) {
      return (
          <div className="fixed top-24 right-24 z-[55] bg-white border border-gray-200 rounded-full shadow-xl p-2 px-4 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform" onClick={() => setIsMinimized(false)}>
              <Timer className="w-4 h-4 text-indigo-600" />
              <span className="font-mono font-bold text-slate-800">{formatTime(timeLeft)}</span>
          </div>
      )
  }

  return (
    <div className="fixed top-24 right-24 z-[55] bg-white border border-gray-200 rounded-3xl shadow-2xl p-5 flex flex-col items-center gap-4 w-56 animate-in slide-in-from-right-4 duration-300">
      <div className="flex justify-between w-full items-center">
         <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <Timer className="w-3.5 h-3.5" />
            <span>Class Timer</span>
         </div>
         <div className="flex gap-1">
            <button onClick={() => setIsMinimized(true)} className="text-gray-300 hover:text-indigo-500 transition-colors"><Minus className="w-4 h-4" /></button>
            <button onClick={onClose} className="text-gray-300 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
         </div>
      </div>
      <div className="text-5xl font-mono font-black text-slate-800 tracking-tighter">
        {formatTime(timeLeft)}
      </div>
      <div className="flex gap-2 w-full">
         <button 
           className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isActive ? 'bg-orange-50 text-orange-600 ring-1 ring-orange-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'}`}
           onClick={() => setIsActive(!isActive)}
         >
           {isActive ? <Pause className="w-4 h-4 fill-current"/> : <Play className="w-4 h-4 fill-current"/>}
           {isActive ? '暫停' : '開始'}
         </button>
         <button 
           className="p-2.5 bg-gray-50 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 border border-gray-200"
           onClick={() => {setIsActive(false); setTimeLeft(300);}}
         >
           <RefreshCw className="w-4 h-4" />
         </button>
      </div>
    </div>
  );
};

export default FloatingTimer;