import React, { useRef } from 'react';
import {
  Sparkles, FileQuestion, Share2, X, ChevronRight,
  ScrollText, GraduationCap, FileCheck
} from 'lucide-react';
import { type UserRole } from '../../config/toolConfig';

// 按鈕組件 (共用)
const MenuButton = ({ icon, label, subLabel, onClick, colorClass }: any) => (
  <button onClick={onClick} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-all text-left group w-full relative overflow-hidden">
    <div className={`p-2 rounded-lg shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ring-1 ring-gray-100 ${colorClass || 'bg-white'}`}>
      {icon}
    </div>
    <div className="flex-1 z-10">
      <div className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">{label}</div>
      {subLabel && <div className="text-[10px] text-gray-400 font-medium">{subLabel}</div>}
    </div>
    <ChevronRight className="w-3 h-3 text-gray-300 group-hover:translate-x-1 transition-transform" />
  </button>
);

interface SelectionMenuProps {
  position: { top: number; left: number } | null;
  userRole: UserRole; // 新增：傳入角色
  onClose: () => void;

  // 學生功能
  onExplain?: () => void;
  onMindMap?: () => void;

  // 老師功能 (新增)
  onGenerateQuiz?: () => void;
  onLessonPlan?: () => void;
}

const SelectionFloatingMenu: React.FC<SelectionMenuProps> = ({
  position, userRole, onClose,
  onExplain, onMindMap,
  onGenerateQuiz, onLessonPlan
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  if (!position) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-[9999] animate-in fade-in zoom-in-95 duration-200 origin-top-left"
      style={{ top: position.top + 10, left: position.left }}
    >
      <div className="bg-white/95 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl shadow-indigo-500/15 p-1.5 flex flex-col gap-1 min-w-[220px]">

        {/* Header - 根據角色變色 */}
        <div className="px-2 py-1.5 flex items-center justify-between gap-1 border-b border-gray-100 mb-1">
          <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${userRole === 'teacher' ? 'text-orange-600' : 'text-indigo-600'}`}>
            {userRole === 'teacher' ? <GraduationCap className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
            {userRole === 'teacher' ? 'AI 教學助理' : 'AI 學習夥伴'}
          </div>

          <button onClick={onClose} className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* 內容分流區 */}
        {userRole === 'student' ? (
          // === 學生選單 ===
          <>
            <MenuButton
              icon={<FileQuestion className="w-4 h-4 text-indigo-600" />}
              label="解釋這段話"
              subLabel="白話文觀念解析"
              colorClass="bg-indigo-50"
              onClick={onExplain}
            />
            <MenuButton
              icon={<Share2 className="w-4 h-4 text-pink-600" />}
              label="生成心智圖"
              subLabel="自動整理關聯節點"
              colorClass="bg-pink-50"
              onClick={onMindMap}
            />
          </>
        ) : (
          // === 老師選單 ===
          <>
            <MenuButton
              icon={<FileCheck className="w-4 h-4 text-orange-600" />}
              label="生成隨堂測驗"
              subLabel="針對此段落出題"
              colorClass="bg-orange-50"
              onClick={onGenerateQuiz}
            />
            <MenuButton
              icon={<ScrollText className="w-4 h-4 text-emerald-600" />}
              label="產生備課引導"
              subLabel="教學重點與延伸閱讀"
              colorClass="bg-emerald-50"
              onClick={onLessonPlan}
            />
          </>
        )}

      </div>
    </div>
  );
};

export default SelectionFloatingMenu;
