/**
 * Button - 統一按鈕元件
 * 
 * 提供多種變體 (variant) 與尺寸 (size)
 * 自動支援 Dark Mode 與載入狀態
 */

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

// ==================== Types ====================

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** 按鈕變體 */
    variant?: ButtonVariant;
    /** 按鈕尺寸 */
    size?: ButtonSize;
    /** 是否為載入中 */
    isLoading?: boolean;
    /** 左側圖示 */
    leftIcon?: ReactNode;
    /** 右側圖示 */
    rightIcon?: ReactNode;
    /** 是否為全寬 */
    fullWidth?: boolean;
    /** 角色主題 (覆蓋 primary 色) */
    roleTheme?: 'teacher' | 'student';
}

// ==================== Styles ====================

const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium transition-all duration-200
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    rounded-button
`;

const variantStyles: Record<ButtonVariant, string> = {
    primary: `
        bg-teacher-600 text-white
        hover:bg-teacher-700
        focus-visible:ring-teacher-500
        dark:bg-teacher-500 dark:hover:bg-teacher-600
    `,
    secondary: `
        bg-gray-100 text-gray-700
        hover:bg-gray-200
        focus-visible:ring-gray-400
        dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600
    `,
    ghost: `
        bg-transparent text-gray-600
        hover:bg-gray-100
        focus-visible:ring-gray-400
        dark:text-gray-300 dark:hover:bg-gray-800
    `,
    danger: `
        bg-error text-white
        hover:bg-error-dark
        focus-visible:ring-error
    `,
    success: `
        bg-success text-white
        hover:bg-success-dark
        focus-visible:ring-success
    `,
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
};

// ==================== Component ====================

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            fullWidth = false,
            roleTheme,
            className = '',
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        // 根據 roleTheme 覆蓋 primary 變體色
        const getVariantStyle = () => {
            if (variant === 'primary' && roleTheme === 'student') {
                return `
                    bg-student-600 text-white
                    hover:bg-student-700
                    focus-visible:ring-student-500
                    dark:bg-student-500 dark:hover:bg-student-600
                `;
            }
            return variantStyles[variant];
        };

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={`
                    ${baseStyles}
                    ${getVariantStyle()}
                    ${sizeStyles[size]}
                    ${fullWidth ? 'w-full' : ''}
                    ${className}
                `.replace(/\s+/g, ' ').trim()}
                {...props}
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    leftIcon
                )}
                {children}
                {!isLoading && rightIcon}
            </button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
