import React from 'react';
import { BrainCircuit, BookOpen, ChevronRight, PanelRightClose, PanelRightOpen, Keyboard, UserCog, Sparkles } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import { type UserRole } from '../../config/toolConfig';

// ✅ 這裡定義了 TopNavigation 應該接收什麼資料
interface TopNavigationProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  onShowShortcuts?: () => void; // 新增:顯示快捷鍵說明
  // 新增開發者切換相關
  userRole?: UserRole;
  setUserRole?: (role: 'teacher' | 'student') => void; // 只接受 teacher 或 student
  isEditMode?: boolean;
  setIsEditMode?: (value: boolean) => void;
  onImportContent?: () => void;
}

// ✅ 元件宣告時,必須使用上面的介面
const TopNavigation: React.FC<TopNavigationProps> = ({
  isSidebarOpen,
  toggleSidebar,
  onShowShortcuts,
  userRole,
  setUserRole,
  isEditMode,
  setIsEditMode,
  onImportContent
}) => (
  <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-3 md:px-6 py-2 md:py-3 flex items-center justify-between shadow-sm sticky top-0 z-50 transition-all duration-300">
    <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
        <span className="p-1.5 bg-indigo-600 text-white rounded-lg shrink-0"><BrainCircuit size={18} /></span>
        <span className="font-bold text-gray-800 dark:text-gray-200 text-base md:text-lg tracking-tight hidden sm:inline">AI EduBoard</span>
      </div>
      <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 hidden md:block"></div>
      <div className="flex items-center gap-1.5 md:gap-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-colors overflow-hidden">
        <BookOpen className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
        <span className="font-medium truncate">康軒數學 2-1：一元二次方程式</span>
        <ChevronRight className="w-3 h-3 text-gray-400 dark:text-gray-500 hidden sm:block shrink-0" />
      </div>
    </div>

    <div className="flex items-center gap-2 md:gap-4 shrink-0">
      {/* 開發者模式切換 */}
      {userRole && setUserRole && (
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 shrink-0">
          <UserCog className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
          <div className="flex bg-white dark:bg-gray-700 rounded-full p-0.5 gap-0.5">
            <button
              onClick={() => {
                setUserRole('teacher');
                if (setIsEditMode) setIsEditMode(false);
              }}
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${userRole === 'teacher'
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
            >
              老師
            </button>
            <button
              onClick={() => {
                setUserRole('student');
                if (setIsEditMode) setIsEditMode(false);
              }}
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${userRole === 'student'
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
            >
              學生
            </button>
          </div>

          {/* 老師專用功能 */}
          {userRole === 'teacher' && onImportContent && setIsEditMode && (
            <>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
              <button
                onClick={onImportContent}
                className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-sm transition-all flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                AI匯入
              </button>
              <button
                onClick={() => {
                  const next = !isEditMode;
                  setIsEditMode(next);
                }}
                className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all ${isEditMode
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
              >
                {isEditMode ? '💾完成' : '✏️編輯'}
              </button>
            </>
          )}
        </div>
      )}

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
        className={`p-1.5 md:p-2 rounded-lg transition-colors border shrink-0 ${isSidebarOpen
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
