/**
 * LoadingSpinner - 統一的載入指示器
 * 
 * 用於 Suspense fallback 和各種載入狀態
 */

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    /** 顯示文字 */
    text?: string;
    /** 尺寸 */
    size?: 'sm' | 'md' | 'lg';
    /** 是否全螢幕 */
    fullScreen?: boolean;
}

const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
};

export function LoadingSpinner({
    text = '載入中...',
    size = 'md',
    fullScreen = false
}: LoadingSpinnerProps) {
    const content = (
        <div className="flex flex-col items-center justify-center gap-3">
            <Loader2 className={`${sizeClasses[size]} animate-spin text-indigo-600`} />
            {text && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
                {content}
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-[200px] w-full">
            {content}
        </div>
    );
}

/**
 * PageLoader - 頁面級別載入器
 */
export function PageLoader({ text = '頁面載入中...' }: { text?: string }) {
    return (
        <div className="flex items-center justify-center h-full w-full min-h-[400px]">
            <LoadingSpinner size="lg" text={text} />
        </div>
    );
}

export default LoadingSpinner;
