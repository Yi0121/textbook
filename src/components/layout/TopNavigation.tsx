import React from 'react';
import { BrainCircuit, BookOpen, ChevronRight, PanelRightClose, PanelRightOpen } from 'lucide-react';

// ✅ 這裡定義了 TopNavigation 應該接收什麼資料
interface TopNavigationProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

// ✅ 元件宣告時，必須使用上面的介面
const TopNavigation: React.FC<TopNavigationProps> = ({ isSidebarOpen, toggleSidebar }) => (
  <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm sticky top-0 z-50 transition-all duration-300">
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mr-4">
        <span className="p-1.5 bg-indigo-600 text-white rounded-lg"><BrainCircuit size={18} /></span>
        <span className="font-bold text-gray-800 text-lg tracking-tight">AI EduBoard</span>
      </div>
      <div className="h-6 w-px bg-gray-300"></div>
      <div className="flex items-center gap-2 text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors">
        <BookOpen className="w-4 h-4" />
        <span className="font-medium">康軒生物 2-1：細胞的能量</span>
        <ChevronRight className="w-3 h-3 text-gray-400" />
      </div>
    </div>

    <div className="flex items-center gap-4">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse flex items-center gap-2">
         <span className="w-2 h-2 bg-green-400 rounded-full"></span>
         Live Demo Mode
      </div>
      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full border-2 border-white shadow-md cursor-pointer"></div>
      <button 
        onClick={toggleSidebar} 
        className={`p-2 rounded-lg transition-colors border border-gray-200 ${isSidebarOpen ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'text-gray-500 hover:bg-gray-100'}`}
        title="AI 側邊欄"
      >
         {isSidebarOpen ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
      </button>
    </div>
  </div>
);

export default TopNavigation;