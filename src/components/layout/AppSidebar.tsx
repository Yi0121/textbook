/**
 * AppSidebar - 應用程式側邊欄
 * 
 * 根據 userRole 顯示不同的導航選單：
 * - 教師：AI 助教、上課、學習數據、作業管理、分組協作、教材庫
 * - 學生：AI 家教、上課、學習進度、作業、錯題本
 */

import { NavLink } from 'react-router-dom';
import {
    MessageSquare,
    BookOpen,
    BarChart3,
    ClipboardList,
    Users,
    FolderOpen,
    Settings,
    Sparkles,
    TrendingUp,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    BrainCircuit,
} from 'lucide-react';
import { type UserRole } from '../../config/toolConfig';

interface NavItem {
    path: string;
    label: string;
    icon: React.ElementType;
}

// 教師模式選單
const TEACHER_NAV: NavItem[] = [
    { path: '/', label: 'AI 助教', icon: MessageSquare },
    { path: '/class', label: '上課', icon: BookOpen },
    { path: '/dashboard', label: '學習數據', icon: BarChart3 },
    { path: '/assignments', label: '作業管理', icon: ClipboardList },
    { path: '/groups', label: '分組協作', icon: Users },
    { path: '/materials', label: '教材庫', icon: FolderOpen },
];

// 學生模式選單
const STUDENT_NAV: NavItem[] = [
    { path: '/', label: 'AI 家教', icon: Sparkles },
    { path: '/class', label: '上課', icon: BookOpen },
    { path: '/progress', label: '學習進度', icon: TrendingUp },
    { path: '/assignments', label: '作業', icon: ClipboardList },
    { path: '/mistakes', label: '錯題本', icon: AlertCircle },
];

interface AppSidebarProps {
    userRole: UserRole;
    collapsed: boolean;
    onToggleCollapse: () => void;
}

export default function AppSidebar({ userRole, collapsed, onToggleCollapse }: AppSidebarProps) {
    const navItems = userRole === 'teacher' ? TEACHER_NAV : STUDENT_NAV;
    const roleColor = userRole === 'teacher' ? 'indigo' : 'purple';

    return (
        <aside
            className={`
        ${collapsed ? 'w-16' : 'w-56'} 
        bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
        flex flex-col transition-all duration-300 ease-in-out
      `}
        >
            {/* Logo 區域 */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className={`p-1.5 bg-${roleColor}-600 text-white rounded-lg shrink-0`}>
                        <BrainCircuit className="w-5 h-5" />
                    </div>
                    {!collapsed && (
                        <span className="font-bold text-gray-800 dark:text-white text-sm whitespace-nowrap">
                            AI EduBoard
                        </span>
                    )}
                </div>
                <button
                    onClick={onToggleCollapse}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 transition-colors"
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </div>

            {/* 導航選單 */}
            <nav className="flex-1 py-4 overflow-y-auto">
                <ul className="space-y-1 px-2">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                end={item.path === '/'}
                                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
                  ${isActive
                                        ? `bg-${roleColor}-50 dark:bg-${roleColor}-900/30 text-${roleColor}-600 dark:text-${roleColor}-400 font-semibold`
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }
                  ${collapsed ? 'justify-center' : ''}
                `}
                                title={collapsed ? item.label : undefined}
                            >
                                <item.icon className="w-5 h-5 shrink-0" />
                                {!collapsed && <span className="text-sm">{item.label}</span>}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* 底部設定 */}
            <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                <NavLink
                    to="/settings"
                    className={({ isActive }) => `
            flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all
            ${isActive
                            ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
            ${collapsed ? 'justify-center' : ''}
          `}
                    title={collapsed ? '設定' : undefined}
                >
                    <Settings className="w-5 h-5 shrink-0" />
                    {!collapsed && <span className="text-sm">設定</span>}
                </NavLink>
            </div>
        </aside>
    );
}
