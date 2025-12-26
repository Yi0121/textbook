/**
 * ErrorState - 錯誤狀態組件
 * 
 * 統一的錯誤狀態呈現，支援重試功能
 */

import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
    /** 錯誤標題 */
    title?: string;
    /** 錯誤訊息 */
    message?: string;
    /** 重試按鈕點擊事件 */
    onRetry?: () => void;
    /** 自訂類別 */
    className?: string;
}

export default function ErrorState({
    title = '發生錯誤',
    message = '抱歉，載入資料時發生問題。請稍後再試。',
    onRetry,
    className = '',
}: ErrorStateProps) {
    return (
        <div className={`empty-state ${className}`}>
            {/* 圖標 */}
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
            </div>

            {/* 標題 */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {title}
            </h3>

            {/* 訊息 */}
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-4">
                {message}
            </p>

            {/* 重試按鈕 */}
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    重試
                </button>
            )}
        </div>
    );
}
