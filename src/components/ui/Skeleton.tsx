/**
 * Skeleton - 骨架屏組件
 * 
 * 用於載入狀態的佔位符，提供多種預設形狀
 */

import type { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    /** 形狀變體 */
    variant?: 'text' | 'circular' | 'rectangular' | 'card';
    /** 寬度（支援 Tailwind 類別或 CSS 值） */
    width?: string;
    /** 高度（支援 Tailwind 類別或 CSS 值） */
    height?: string;
}

export default function Skeleton({
    variant = 'text',
    width,
    height,
    className = '',
    ...props
}: SkeletonProps) {
    const baseStyles = 'animate-pulse bg-gray-200 dark:bg-gray-700';

    const variantStyles = {
        text: 'h-4 rounded',
        circular: 'rounded-full',
        rectangular: 'rounded-lg',
        card: 'rounded-2xl',
    };

    // 處理尺寸
    const sizeStyles = [
        width?.startsWith('w-') ? width : width ? '' : (variant === 'text' ? 'w-full' : ''),
        height?.startsWith('h-') ? height : height ? '' : (variant === 'circular' ? 'aspect-square' : ''),
    ].filter(Boolean).join(' ');

    const inlineStyles: React.CSSProperties = {
        ...(width && !width.startsWith('w-') && !width.startsWith('h-') ? { width } : {}),
        ...(height && !height.startsWith('w-') && !height.startsWith('h-') ? { height } : {}),
    };

    return (
        <div
            className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles} ${className}`}
            style={Object.keys(inlineStyles).length > 0 ? inlineStyles : undefined}
            {...props}
        />
    );
}

// ==================== 預組裝骨架屏 ====================

/** 卡片骨架屏 */
export function CardSkeleton({ className = '' }: { className?: string }) {
    return (
        <div className={`card-base p-6 ${className}`}>
            <Skeleton variant="rectangular" className="h-4 w-3/4 mb-4" />
            <Skeleton variant="text" className="mb-2" />
            <Skeleton variant="text" className="w-2/3" />
        </div>
    );
}

/** 列表項目骨架屏 */
export function ListItemSkeleton({ className = '' }: { className?: string }) {
    return (
        <div className={`flex items-center gap-4 p-4 ${className}`}>
            <Skeleton variant="circular" className="w-10 h-10" />
            <div className="flex-1">
                <Skeleton variant="text" className="w-1/2 mb-2" />
                <Skeleton variant="text" className="w-3/4 h-3" />
            </div>
        </div>
    );
}

/** 統計卡片骨架屏 */
export function StatCardSkeleton({ className = '' }: { className?: string }) {
    return (
        <div className={`stat-card ${className}`}>
            <Skeleton variant="rectangular" className="w-12 h-12 rounded-xl" />
            <div className="flex-1">
                <Skeleton variant="text" className="w-20 h-3 mb-2" />
                <Skeleton variant="text" className="w-16 h-6" />
            </div>
        </div>
    );
}

/** 表格骨架屏 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-3">
            {/* 表頭 */}
            <div className="flex gap-4 pb-3 border-b border-gray-200 dark:border-gray-700">
                <Skeleton variant="text" className="w-1/4" />
                <Skeleton variant="text" className="w-1/3" />
                <Skeleton variant="text" className="w-1/4" />
                <Skeleton variant="text" className="w-1/6" />
            </div>
            {/* 資料列 */}
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4 py-2">
                    <Skeleton variant="text" className="w-1/4 h-5" />
                    <Skeleton variant="text" className="w-1/3 h-5" />
                    <Skeleton variant="text" className="w-1/4 h-5" />
                    <Skeleton variant="text" className="w-1/6 h-5" />
                </div>
            ))}
        </div>
    );
}
