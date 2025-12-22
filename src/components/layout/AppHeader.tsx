/**
 * AppHeader - 應用程式頂部導航
 * 
 * 功能：
 * - 角色切換 (老師/學生)
 * - 主題切換
 * - 使用者頭像
 */

import { UserCog } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import { type UserRole } from '../../config/toolConfig';

interface AppHeaderProps {
    userRole: UserRole;
    setUserRole: (role: 'teacher' | 'student') => void;
}

export default function AppHeader({ userRole, setUserRole }: AppHeaderProps) {
    return (
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between shrink-0">
            {/* 左側：頁面標題或 Breadcrumb (可擴充) */}
            <div className="flex items-center gap-4">
                {/* 可以在這裡加入 Breadcrumb */}
            </div>

            {/* 右側：角色切換、主題、頭像 */}
            <div className="flex items-center gap-4">
                {/* 角色切換 */}
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full">
                    <UserCog className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <div className="flex bg-white dark:bg-gray-600 rounded-full p-0.5 gap-0.5">
                        <button
                            onClick={() => setUserRole('teacher')}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${userRole === 'teacher'
                                    ? 'bg-indigo-500 text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
                                }`}
                        >
                            老師
                        </button>
                        <button
                            onClick={() => setUserRole('student')}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${userRole === 'student'
                                    ? 'bg-purple-500 text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
                                }`}
                        >
                            學生
                        </button>
                    </div>
                </div>

                {/* 主題切換 */}
                <ThemeToggle />

                {/* 使用者頭像 */}
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full border-2 border-white dark:border-gray-600 shadow-md cursor-pointer hover:scale-105 transition-transform" />
            </div>
        </header>
    );
}
