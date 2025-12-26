/**
 * AppHeader - 應用程式頂部導航
 * 
 * 功能：
 * - Hamburger Menu (行動版)
 * - 角色切換 (老師/學生)
 * - 主題切換
 * - 使用者頭像
 */

import { UserCog, Menu } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import { type UserRole } from '../../config/toolConfig';

interface AppHeaderProps {
    userRole: UserRole;
    setUserRole: (role: 'teacher' | 'student') => void;
    onMenuClick?: () => void;
    showMenuButton?: boolean;
}

export default function AppHeader({ userRole, setUserRole, onMenuClick, showMenuButton }: AppHeaderProps) {
    return (
        <header className="h-14 md:h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 flex items-center justify-between shrink-0">
            {/* 左側：Hamburger Menu + 頁面標題 */}
            <div className="flex items-center gap-3">
                {showMenuButton && (
                    <button
                        onClick={onMenuClick}
                        className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        aria-label="開啟選單"
                    >
                        <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                )}
                {/* Breadcrumb 可擴充 */}
            </div>

            {/* 右側：角色切換、主題、頭像 */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* 角色切換 - 行動版精簡 */}
                <div className="flex items-center gap-1 md:gap-2 bg-gray-100 dark:bg-gray-700 px-2 md:px-3 py-1 md:py-1.5 rounded-full">
                    <UserCog className="w-4 h-4 text-gray-500 dark:text-gray-400 hidden md:block" />
                    <div className="flex bg-white dark:bg-gray-600 rounded-full p-0.5 gap-0.5">
                        <button
                            onClick={() => setUserRole('teacher')}
                            className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium transition-all ${userRole === 'teacher'
                                ? 'bg-indigo-500 text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
                                }`}
                        >
                            <span className="hidden md:inline">老師</span>
                            <span className="md:hidden">師</span>
                        </button>
                        <button
                            onClick={() => setUserRole('student')}
                            className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium transition-all ${userRole === 'student'
                                ? 'bg-purple-500 text-white shadow-sm'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
                                }`}
                        >
                            <span className="hidden md:inline">學生</span>
                            <span className="md:hidden">生</span>
                        </button>
                    </div>
                </div>

                {/* 主題切換 */}
                <ThemeToggle />

                {/* 使用者頭像 */}
                <div className="w-8 h-8 md:w-9 md:h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full border-2 border-white dark:border-gray-600 shadow-md cursor-pointer hover:scale-105 transition-transform" />
            </div>
        </header>
    );
}
