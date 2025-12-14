import React from 'react';
import { BrainCircuit, BookOpen, ChevronRight, PanelRightClose, PanelRightOpen, Keyboard } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';

// ✅ 這裡定義了 TopNavigation 應該接收什麼資料
interface TopNavigationProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  onShowShortcuts?: () => void; // 新增：顯示快捷鍵說明
}

// ✅ 元件宣告時，必須使用上面的介面
const TopNavigation: React.FC<TopNavigationProps> = ({ isSidebarOpen, toggleSidebar, onShowShortcuts }) => (
  <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-3 md:px-6 py-2 md:py-3 flex items-center justify-between shadow-sm sticky top-0 z-50 transition-all duration-300">
    <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
        <span className="p-1.5 bg-indigo-600 text-white rounded-lg shrink-0"><BrainCircuit size={18} /></span>
        <span className="font-bold text-gray-800 dark:text-gray-200 text-base md:text-lg tracking-tight hidden sm:inline">AI EduBoard</span>
      </div>
      <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 hidden md:block"></div>
      <div className="flex items-center gap-1.5 md:gap-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors overflow-hidden">
        <BookOpen className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
        <span className="font-medium truncate">康軒生物 2-1：細胞的能量</span>
        <ChevronRight className="w-3 h-3 text-gray-400 dark:text-gray-500 hidden sm:block shrink-0" />
      </div>
    </div>

    <div className="flex items-center gap-2 md:gap-4 shrink-0">
      <div className="hidden md:flex bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse items-center gap-2">
         <span className="w-2 h-2 bg-green-400 rounded-full"></span>
         Live Demo Mode
      </div>
      <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full border-2 border-white shadow-md cursor-pointer shrink-0"></div>
      {/* 主題切換按鈕 */}
      <ThemeToggle />
      {/* 快捷鍵說明按鈕 - 小螢幕時隱藏 */}
      {onShowShortcuts && (
        <button
          onClick={onShowShortcuts}
          className="hidden md:flex p-2 rounded-lg transition-colors border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400 hover:text-indigo-600"
          title="鍵盤快捷鍵 (?)"
        >
          <Keyboard className="w-5 h-5" />
        </button>
      )}
      <button
        onClick={toggleSidebar}
        className={`p-1.5 md:p-2 rounded-lg transition-colors border shrink-0 ${
          isSidebarOpen
            ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-700'
            : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
        }`}
        title="AI 側邊欄"
      >
         {isSidebarOpen ? <PanelRightClose className="w-4 h-4 md:w-5 md:h-5" /> : <PanelRightOpen className="w-4 h-4 md:w-5 md:h-5" />}
      </button>
    </div>
  </div>
);

export default TopNavigation;