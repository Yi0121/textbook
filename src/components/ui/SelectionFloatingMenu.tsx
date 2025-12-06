import React, { useRef, useState, useLayoutEffect } from 'react';
import { Sparkles, FileQuestion, BookOpen, Share2, ChevronRight, X } from 'lucide-react';

const MenuButton = ({ icon, label, onClick, subLabel }: any) => (
    <button onClick={onClick} className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-indigo-50 hover:text-indigo-900 text-gray-700 transition-all text-left group w-full">
        <div className="bg-white p-1.5 rounded-lg shadow-sm group-hover:scale-110 transition-transform">{icon}</div>
        <div className="flex-1">
            <div className="text-sm font-bold">{label}</div>
            {subLabel && <div className="text-[10px] text-gray-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity -mt-0.5">{subLabel}</div>}
        </div>
        <ChevronRight className="w-3 h-3 text-gray-300 group-hover:translate-x-1 transition-transform" />
    </button>
);

const SelectionFloatingMenu = ({ position, onTrigger, onExplain, onMindMap, onClose }: any) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPos, setAdjustedPos] = useState(position);

// 在 SelectionFloatingMenu.tsx 的 useLayoutEffect 中

  useLayoutEffect(() => {
    if (position && menuRef.current) {
        const rect = menuRef.current.getBoundingClientRect();
        let newTop = position.top + 10;
        let newLeft = position.left;

        // 右側邊界檢查
        if (newLeft + rect.width > window.innerWidth) {
            newLeft = window.innerWidth - rect.width - 20; 
        }
        
        // [新增] 底部邊界檢查 (Flip Logic)
        // 如果選單高度 + 預留空間會超出視窗高度
        if (newTop + rect.height > window.innerHeight) {
            // 改為顯示在選取框的「上方」
            // 假設 position.top 是選取框的底部，我們需要知道選取框的高度來計算頂部
            // 但這裡簡化處理：直接往上扣除選單高度 + 一些緩衝
            newTop = position.top - rect.height - 40; 
        }
        
        setAdjustedPos({ top: newTop, left: newLeft });
    }
}, [position]);

  if (!position) return null;

  return (
    <div 
      ref={menuRef}
      className="fixed z-[70] flex flex-col gap-2 animate-in zoom-in-95 duration-200" 
      style={{ top: adjustedPos?.top, left: adjustedPos?.left }}
    >
      <div className="relative bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl shadow-indigo-500/20 p-1.5 flex flex-col gap-1 min-w-[180px]">
        {/* Header with Close Button */}
        <div className="px-2 py-1.5 text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center justify-between gap-1 border-b border-indigo-50/50 mb-1">
            <div className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI Assistant</div>
            
            <button 
                onClick={onClose}
                className="bg-gray-100 hover:bg-gray-200 p-0.5 rounded text-gray-500 transition-colors"
                title="取消選取"
            >
                <X className="w-3 h-3" />
            </button>
        </div>

        <MenuButton icon={<FileQuestion className="w-4 h-4 text-purple-500" />} label="解釋這段話" subLabel="用小學生聽得懂的方式" onClick={onExplain} />
        <MenuButton icon={<Share2 className="w-4 h-4 text-pink-500" />} label="生成心智圖" subLabel="建立知識節點關聯" onClick={onMindMap} />
        <MenuButton icon={<BookOpen className="w-4 h-4 text-blue-500" />} label="出題測驗" subLabel="生成3題相關選擇題" onClick={onTrigger} />
      </div>
    </div>
  );
};

export default SelectionFloatingMenu;