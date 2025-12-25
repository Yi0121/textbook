/**
 * Badge - 統一標籤/徽章元件
 * 
 * 用於狀態標示、分類標籤、數量計數等
 */

import { type HTMLAttributes, type ReactNode } from 'react';

// ==================== Types ====================

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'teacher' | 'student';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    /** 變體 */
    variant?: BadgeVariant;
    /** 尺寸 */
    size?: BadgeSize;
    /** 左側圖示 */
    icon?: ReactNode;
    /** 是否為圓點樣式 (無文字) */
    dot?: boolean;
    /** 是否為外框樣式 */
    outlined?: boolean;
}

// ==================== Styles ====================

const baseStyles = `
    inline-flex items-center justify-center gap-1
    font-medium rounded-full
    transition-colors duration-200
`;

const variantStyles: Record<BadgeVariant, { solid: string; outlined: string }> = {
    default: {
        solid: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
        outlined: 'border border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400',
    },
    success: {
        solid: 'bg-success-light text-success-dark dark:bg-success-dark/20 dark:text-success',
        outlined: 'border border-success text-success',
    },
    warning: {
        solid: 'bg-warning-light text-warning-dark dark:bg-warning-dark/20 dark:text-warning',
        outlined: 'border border-warning text-warning-dark',
    },
    error: {
        solid: 'bg-error-light text-error-dark dark:bg-error-dark/20 dark:text-error',
        outlined: 'border border-error text-error',
    },
    info: {
        solid: 'bg-info-light text-info-dark dark:bg-info-dark/20 dark:text-info',
        outlined: 'border border-info text-info',
    },
    teacher: {
        solid: 'bg-teacher-100 text-teacher-700 dark:bg-teacher-900/30 dark:text-teacher-400',
        outlined: 'border border-teacher-400 text-teacher-600 dark:text-teacher-400',
    },
    student: {
        solid: 'bg-student-100 text-student-700 dark:bg-student-900/30 dark:text-student-400',
        outlined: 'border border-student-400 text-student-600 dark:text-student-400',
    },
};

const sizeStyles: Record<BadgeSize, string> = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
};

const dotSizeStyles: Record<BadgeSize, string> = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
};

// ==================== Component ====================

export function Badge({
    variant = 'default',
    size = 'md',
    icon,
    dot = false,
    outlined = false,
    className = '',
    children,
    ...props
}: BadgeProps) {
    // 純圓點模式
    if (dot) {
        const dotColors: Record<BadgeVariant, string> = {
            default: 'bg-gray-400',
            success: 'bg-success',
            warning: 'bg-warning',
            error: 'bg-error',
            info: 'bg-info',
            teacher: 'bg-teacher-500',
            student: 'bg-student-500',
        };

        return (
            <span
                className={`inline-block rounded-full ${dotSizeStyles[size]} ${dotColors[variant]} ${className}`}
                {...props}
            />
        );
    }

    return (
        <span
            className={`
                ${baseStyles}
                ${outlined ? variantStyles[variant].outlined : variantStyles[variant].solid}
                ${sizeStyles[size]}
                ${className}
            `.replace(/\s+/g, ' ').trim()}
            {...props}
        >
            {icon && <span className="shrink-0">{icon}</span>}
            {children}
        </span>
    );
}

export default Badge;
