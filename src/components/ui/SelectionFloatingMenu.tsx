import React, { useRef, useState, useLayoutEffect } from 'react';
import { Sparkles, FileQuestion, BookOpen, Share2, ChevronRight } from 'lucide-react';

// 小元件 MenuButton
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

const SelectionFloatingMenu = ({ position, onTrigger, onExplain, onMindMap }: any) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPos, setAdjustedPos] = useState(position);

  useLayoutEffect(() => {
      if (position && menuRef.current) {
          const rect = menuRef.current.getBoundingClientRect();
          let newTop = position.top + 10;
          let newLeft = position.left;

          if (newLeft + rect.width > window.innerWidth) {
              newLeft = window.innerWidth - rect.width - 20; 
          }
          if (newTop + rect.height > window.innerHeight) {
              newTop = position.top - rect.height - 20;
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
      <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl shadow-indigo-500/20 p-1.5 flex flex-col gap-1 min-w-[180px]">
        <div className="px-2 py-1.5 text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI Assistant
        </div>
        <MenuButton icon={<FileQuestion className="w-4 h-4 text-purple-500" />} label="生成測驗題" onClick={onTrigger} />
        <MenuButton icon={<BookOpen className="w-4 h-4 text-blue-500" />} label="重點摘要卡" onClick={onExplain} subLabel="Summarize"/>
        <MenuButton icon={<Share2 className="w-4 h-4 text-emerald-500" />} label="生成關聯圖" onClick={onMindMap} subLabel="Mind Map"/>
      </div>
    </div>
  );
};

export default SelectionFloatingMenu;