import React, { useState, useEffect, useRef } from 'react';
import { X, Dices, RotateCcw, Settings2 } from 'lucide-react';

interface LuckyDrawProps {
  isOpen: boolean;
  onClose: () => void;
}

const LuckyDraw: React.FC<LuckyDrawProps> = ({ isOpen, onClose }) => {
  // --- State ---
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(30); // 預設 30 人
  const [currentNumber, setCurrentNumber] = useState<number | string>('?');
  const [isRolling, setIsRolling] = useState(false);
  const [history, setHistory] = useState<number[]>([]); // 紀錄抽過的號碼 (避免重複)

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- Logic ---
  const startRoll = () => {
    if (isRolling) {
      // 停止滾動 (Stop)
      if (timerRef.current) clearInterval(timerRef.current);
      
      // 產生最終結果 (排除已抽過的，如果老師希望不重複的話)
      // 這裡先做簡單版：純隨機，不排除重複 (若要排除重複邏輯會再複雜一點)
      const final = Math.floor(Math.random() * (max - min + 1)) + min;
      
      setCurrentNumber(final);
      setIsRolling(false);
      setHistory(prev => [final, ...prev].slice(0, 5)); // 只留最近 5 筆
    } else {
      // 開始滾動 (Start)
      setIsRolling(true);
      timerRef.current = setInterval(() => {
        const temp = Math.floor(Math.random() * (max - min + 1)) + min;
        setCurrentNumber(temp);
      }, 50); // 每 50ms 跳一次
    }
  };

  const reset = () => {
    setCurrentNumber('?');
    setHistory([]);
    setIsRolling(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // 當視窗關閉時清理 Timer
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center pointer-events-none">
      {/* 背景遮罩 (點擊關閉) */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto" onClick={onClose} />

      {/* 主視窗 */}
      <div className="relative bg-white w-80 rounded-3xl shadow-2xl border border-white/50 overflow-hidden pointer-events-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-purple-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Dices className="w-5 h-5" />
            <span>幸運抽籤</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Display Area */}
        <div className="p-8 bg-purple-50 flex flex-col items-center justify-center gap-4">
          <div className={`
             text-8xl font-black text-purple-600 font-mono tracking-tighter
             ${isRolling ? 'opacity-50 scale-90 blur-[1px]' : 'scale-110 opacity-100'}
             transition-all duration-200
          `}>
            {currentNumber}
          </div>
          
          {/* 狀態提示 */}
          <div className="text-xs font-bold text-purple-300 uppercase tracking-widest">
            {isRolling ? 'ROLLING...' : 'READY'}
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 bg-white space-y-4">
            
            {/* 設定範圍 */}
            <div className="flex items-center justify-between gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                    <span>Min</span>
                    <input 
                        type="number" value={min} onChange={(e) => setMin(Number(e.target.value))} 
                        className="w-10 bg-transparent text-center font-bold text-gray-800 outline-none"
                    />
                </div>
                <div className="h-px w-4 bg-gray-300"></div>
                <div className="flex items-center justify-between gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
                    <span>Max</span>
                    <input 
                        type="number" value={max} onChange={(e) => setMax(Number(e.target.value))} 
                        className="w-10 bg-transparent text-center font-bold text-gray-800 outline-none"
                    />
                </div>
            </div>

            {/* 按鈕群 */}
            <div className="flex gap-2">
                <button 
                    onClick={startRoll}
                    className={`
                        flex-1 py-3 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2
                        ${isRolling 
                            ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-200' 
                            : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-200'
                        }
                    `}
                >
                    {isRolling ? '停止 (STOP)' : '開始抽籤 (GO)'}
                </button>
                
                <button onClick={reset} className="p-3 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 active:scale-95" title="重置">
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>

            {/* 歷史紀錄 (選用) */}
            {history.length > 0 && (
                <div className="pt-2 border-t border-gray-100">
                    <div className="text-[10px] text-gray-400 font-bold mb-1">最近紀錄:</div>
                    <div className="flex gap-2">
                        {history.map((num, i) => (
                            <span key={i} className="bg-gray-100 text-gray-500 text-xs font-bold px-2 py-1 rounded-md">
                                {num}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default LuckyDraw;