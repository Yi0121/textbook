/**
 * EmptyState - 空狀態組件
 * 
 * 統一的空狀態呈現，可自訂圖標、標題、描述與行動按鈕
 */

import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
    /** 圖標組件 */
    icon?: LucideIcon;
    /** 標題文字 */
    title: string;
    /** 描述文字 */
    description?: string;
    /** 行動按鈕文字 */
    actionLabel?: string;
    /** 行動按鈕點擊事件 */
    onAction?: () => void;
    /** 自訂類別 */
    className?: string;
}

export default function EmptyState({
    icon: Icon = Inbox,
    title,
    description,
    actionLabel,
    onAction,
    className = '',
}: EmptyStateProps) {
    return (
        <div className={`empty-state ${className}`}>
            {/* 圖標 */}
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>

            {/* 標題 */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {title}
            </h3>

            {/* 描述 */}
            {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-4">
                    {description}
                </p>
            )}

            {/* 行動按鈕 */}
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
