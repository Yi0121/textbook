/**
 * AppSidebar - 應用程式側邊欄
 * 
 * 採用分群式導航設計：
 * - 教師：教學中心、課程管理、學生管理
 * - 學生：學習中心、我的學習
 */

import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
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
    Lightbulb,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    BrainCircuit,
    Edit3,
    GraduationCap,
    Library,
    Activity,
} from 'lucide-react';
import { type UserRole } from '../../config/toolConfig';

interface NavItem {
    path: string;
    label: string;
    icon: React.ElementType;
}

interface NavGroup {
    id: string;
    label: string;
    icon: React.ElementType;
    items: NavItem[];
}

// 教師模式 - 分群導航
const TEACHER_NAV_GROUPS: NavGroup[] = [
    {
        id: 'teaching',
        label: '教學中心',
        icon: GraduationCap,
        items: [
            { path: '/', label: 'AI 助教', icon: MessageSquare },
            { path: '/teacher/class-setup', label: '上課', icon: BookOpen },
        ],
    },
    {
        id: 'course',
        label: '課程管理',
        icon: Library,
        items: [
            { path: '/teacher/lesson-prep', label: '備課', icon: Edit3 },
            { path: '/teacher/lesson-progress/lesson-apos-001', label: '課程監控', icon: Activity },
            { path: '/materials', label: '教材庫', icon: FolderOpen },
        ],
    },
    {
        id: 'student',
        label: '學生管理',
        icon: Users,
        items: [
            { path: '/teacher/class-analytics', label: '學習分析', icon: BarChart3 },
            { path: '/teacher/assignment', label: '作業管理', icon: ClipboardList },
            { path: '/teacher/groups', label: '分組協作', icon: Users },
            { path: '/teacher/suggestions', label: '教學建議', icon: Lightbulb },
        ],
    },
];

// 學生模式 - 分群導航
const STUDENT_NAV_GROUPS: NavGroup[] = [
    {
        id: 'learning',
        label: '學習中心',
        icon: Sparkles,
        items: [
            { path: '/', label: 'AI 家教', icon: Sparkles },
            { path: '/teacher/classroom', label: '上課', icon: BookOpen },
        ],
    },
    {
        id: 'progress',
        label: '我的學習',
        icon: TrendingUp,
        items: [
            { path: '/student/path/lesson-apos-001', label: '學習路徑', icon: TrendingUp },
            { path: '/student/dashboard', label: '學習進度', icon: BarChart3 },
            { path: '/student/conversations', label: '對話紀錄', icon: MessageSquare },
        ],
    },
    {
        id: 'tasks',
        label: '任務區',
        icon: ClipboardList,
        items: [
            { path: '/assignments', label: '作業', icon: ClipboardList },
            { path: '/student/quiz/assign-001', label: '任務：除法探究', icon: ClipboardList },
            { path: '/student/quiz/assign-002', label: '任務：圓周長 (CPS)', icon: BrainCircuit },
            { path: '/student/suggestions', label: '學習建議', icon: Lightbulb },
        ],
    },
];

interface AppSidebarProps {
    userRole: UserRole;
    collapsed: boolean;
    onToggleCollapse: () => void;
}

// 顯式定義角色樣式
const ROLE_STYLES = {
    teacher: {
        logoBg: 'bg-indigo-600',
        activeBg: 'bg-indigo-50 dark:bg-indigo-900/30',
        activeText: 'text-indigo-600 dark:text-indigo-400',
        groupHover: 'hover:bg-indigo-50 dark:hover:bg-indigo-900/20',
    },
    student: {
        logoBg: 'bg-purple-600',
        activeBg: 'bg-purple-50 dark:bg-purple-900/30',
        activeText: 'text-purple-600 dark:text-purple-400',
        groupHover: 'hover:bg-purple-50 dark:hover:bg-purple-900/20',
    },
} as const;

export default function AppSidebar({ userRole, collapsed, onToggleCollapse }: AppSidebarProps) {
    const location = useLocation();
    const navGroups = userRole === 'teacher' ? TEACHER_NAV_GROUPS : STUDENT_NAV_GROUPS;
    const styles = userRole in ROLE_STYLES ? ROLE_STYLES[userRole as keyof typeof ROLE_STYLES] : ROLE_STYLES.teacher;

    // 根據當前路徑自動展開對應群組
    const getInitialExpandedGroups = () => {
        const expanded: Record<string, boolean> = {};
        navGroups.forEach(group => {
            const hasActiveItem = group.items.some(item =>
                item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)
            );
            expanded[group.id] = hasActiveItem;
        });
        // 確保至少第一個群組展開
        if (!Object.values(expanded).some(v => v)) {
            expanded[navGroups[0].id] = true;
        }
        return expanded;
    };

    const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(getInitialExpandedGroups);

    const toggleGroup = (groupId: string) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId],
        }));
    };

    const isItemActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <aside
            className={`
                ${collapsed ? 'w-16' : 'w-60'} 
                bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
                flex flex-col transition-all duration-300 ease-in-out
            `}
        >
            {/* Logo 區域 */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className={`p-1.5 ${styles.logoBg} text-white rounded-lg shrink-0`}>
                        <BrainCircuit className="w-5 h-5" />
                    </div>
                    {!collapsed && (
                        <span className="font-bold text-gray-800 dark:text-white text-sm whitespace-nowrap">
                            AI textbook
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

            {/* 導航選單 - 分群式 */}
            <nav className="flex-1 py-3 overflow-y-auto">
                <div className="space-y-1 px-2">
                    {navGroups.map((group) => {
                        const isExpanded = expandedGroups[group.id];
                        const hasActiveChild = group.items.some(item => isItemActive(item.path));

                        return (
                            <div key={group.id} className="mb-1">
                                {/* 群組標題 */}
                                {!collapsed ? (
                                    <button
                                        onClick={() => toggleGroup(group.id)}
                                        className={`
                                            w-full flex items-center justify-between px-3 py-2 rounded-lg
                                            text-xs font-semibold uppercase tracking-wider
                                            transition-colors
                                            ${hasActiveChild
                                                ? `${styles.activeText}`
                                                : 'text-gray-500 dark:text-gray-400'
                                            }
                                            ${styles.groupHover}
                                        `}
                                    >
                                        <div className="flex items-center gap-2">
                                            <group.icon className="w-4 h-4" />
                                            <span>{group.label}</span>
                                        </div>
                                        <ChevronDown
                                            className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                ) : (
                                    <div className="flex justify-center py-2">
                                        <div
                                            className={`w-6 h-0.5 rounded-full ${hasActiveChild ? styles.logoBg : 'bg-gray-300 dark:bg-gray-600'}`}
                                        />
                                    </div>
                                )}

                                {/* 群組項目 */}
                                <ul
                                    className={`
                                        space-y-0.5 overflow-hidden transition-all duration-200
                                        ${!collapsed && !isExpanded ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'}
                                        ${!collapsed ? 'ml-2 mt-1' : ''}
                                    `}
                                >
                                    {group.items.map((item) => (
                                        <li key={item.path}>
                                            <NavLink
                                                to={item.path}
                                                end={item.path === '/'}
                                                className={({ isActive }) => `
                                                    flex items-center gap-3 px-3 py-2 rounded-lg transition-all
                                                    ${isActive
                                                        ? `${styles.activeBg} ${styles.activeText} font-semibold`
                                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                    }
                                                    ${collapsed ? 'justify-center' : ''}
                                                `}
                                                title={collapsed ? item.label : undefined}
                                            >
                                                <item.icon className="w-4.5 h-4.5 shrink-0" />
                                                {!collapsed && <span className="text-sm">{item.label}</span>}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
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
