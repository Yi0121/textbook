import React, { useRef, useState, useLayoutEffect } from 'react';
import { Sparkles, FileQuestion, BookOpen, Share2, ChevronRight, X } from 'lucide-react';

const MenuButton = ({ icon, label, onClick, subLabel }: any) => (
    <button onClick={onClick} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-50 transition-all text-left group w-full relative overflow-hidden">
        <div className="bg-white p-1.5 rounded-lg shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ring-1 ring-gray-100">
            {icon}
        </div>
        <div className="flex-1 z-10">
            <div className="text-sm font-bold text-gray-700 group-hover:text-indigo-700 transition-colors">{label}</div>
            {subLabel && <div className="text-[10px] text-gray-400 font-medium group-hover:text-indigo-400 transition-colors">{subLabel}</div>}
        </div>
        <ChevronRight className="w-3 h-3 text-gray-300 group-hover:translate-x-1 group-hover:text-indigo-400 transition-transform" />
    </button>
);

const SelectionFloatingMenu = ({ position, onTrigger, onExplain, onMindMap, onClose }: any) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPos, setAdjustedPos] = useState<any>(null);

  useLayoutEffect(() => {
    if (position && menuRef.current) {
        const rect = menuRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const padding = 20; // 邊緣緩衝區

        // 預設位置：在選取框的右下方一點點
        let newTop = position.top + 10;
        let newLeft = position.left;

        // 1. 檢查右邊界：如果超出右邊，就靠左顯示
        if (newLeft + rect.width > viewportWidth - padding) {
            newLeft = viewportWidth - rect.width - padding;
        }
        // 2. 檢查左邊界 (防呆)
        if (newLeft < padding) {
            newLeft = padding;
        }

        // 3. 檢查下邊界：如果超出底部，就往上翻 (Flip)
        if (newTop + rect.height > viewportHeight - padding) {
            // 翻轉邏輯：選單底部貼齊原本的 top 位置，再扣除一點緩衝
            // 注意：這裡假設 position.top 是選取框的「底部」，所以往上翻要扣更多
            // 為了更精準，通常需要傳入 selectionBox 的 height，這裡我們先做簡易版上移
            newTop = position.top - rect.height - 40;
        }
        
        // 4. 檢查上邊界：如果往上翻後超出頂部 (這在選取螢幕最上方文字時會發生)
        if (newTop < padding) {
            newTop = padding;
        }

        setAdjustedPos({ top: newTop, left: newLeft });
    }
  }, [position]);

  if (!position) return null;

  // 使用 adjustedPos 渲染，如果還沒計算完位置先隱藏 (opacity-0)，避免閃爍
  return (
    <div 
      ref={menuRef}
      className={`fixed z-[70] flex flex-col gap-2 transition-opacity duration-200 ${adjustedPos ? 'opacity-100' : 'opacity-0'}`}
      style={{ 
        top: adjustedPos?.top ?? 0, 
        left: adjustedPos?.left ?? 0,
        // 加入一個微小的彈性動畫
        animation: adjustedPos ? 'float-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none'
      }}
    >
      <div className="relative bg-white/95 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl shadow-indigo-500/15 p-1.5 flex flex-col gap-1 min-w-[200px]">
        {/* Header */}
        <div className="px-2 py-1.5 flex items-center justify-between gap-1 border-b border-gray-100 mb-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 fill-indigo-100" /> 
                AI 助理
            </div>
            
            <button 
                onClick={onClose}
                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                title="關閉"
            >
                <X className="w-3 h-3" />
            </button>
        </div>

        <MenuButton icon={<FileQuestion className="w-4 h-4 text-purple-600" />} label="解釋這段話" subLabel="適合學生的白話解釋" onClick={onExplain} />
        <MenuButton icon={<Share2 className="w-4 h-4 text-pink-600" />} label="生成心智圖" subLabel="自動整理關聯節點" onClick={onMindMap} />
        <MenuButton icon={<BookOpen className="w-4 h-4 text-blue-600" />} label="出題測驗" subLabel="生成重點選擇題" onClick={onTrigger} />
      </div>

      <style>{`
        @keyframes float-in {
          0% { transform: translateY(10px) scale(0.95); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default SelectionFloatingMenu;