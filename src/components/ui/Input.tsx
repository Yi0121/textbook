/**
 * Input - 統一輸入框元件
 * 
 * 提供一致的輸入框樣式
 * 支援標籤、錯誤訊息、前後綴圖示
 */

import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';

// ==================== Types ====================

export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
    /** 輸入框尺寸 */
    inputSize?: InputSize;
    /** 標籤文字 */
    label?: string;
    /** 錯誤訊息 */
    error?: string;
    /** 提示文字 */
    hint?: string;
    /** 左側圖示/元素 */
    leftElement?: ReactNode;
    /** 右側圖示/元素 */
    rightElement?: ReactNode;
    /** 是否為全寬 */
    fullWidth?: boolean;
    /** 容器 className */
    containerClassName?: string;
}

// ==================== Styles ====================

const baseInputStyles = `
    w-full
    bg-white dark:bg-gray-800
    border border-gray-300 dark:border-gray-600
    text-gray-900 dark:text-white
    placeholder-gray-400 dark:placeholder-gray-500
    rounded-button
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-teacher-500 focus:border-teacher-500
    disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 dark:disabled:bg-gray-900
`;

const sizeStyles: Record<InputSize, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base',
};

const errorStyles = `
    border-error focus:ring-error focus:border-error
    dark:border-error
`;

// ==================== Component ====================

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            inputSize = 'md',
            label,
            error,
            hint,
            leftElement,
            rightElement,
            fullWidth = false,
            containerClassName = '',
            className = '',
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

        return (
            <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
                {/* Label */}
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                        {label}
                    </label>
                )}

                {/* Input Container */}
                <div className="relative">
                    {/* Left Element */}
                    {leftElement && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            {leftElement}
                        </div>
                    )}

                    {/* Input */}
                    <input
                        ref={ref}
                        id={inputId}
                        className={`
                            ${baseInputStyles}
                            ${sizeStyles[inputSize]}
                            ${error ? errorStyles : ''}
                            ${leftElement ? 'pl-10' : ''}
                            ${rightElement ? 'pr-10' : ''}
                            ${className}
                        `.replace(/\s+/g, ' ').trim()}
                        {...props}
                    />

                    {/* Right Element */}
                    {rightElement && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                            {rightElement}
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <p className="mt-1.5 text-xs text-error">{error}</p>
                )}

                {/* Hint */}
                {hint && !error && (
                    <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{hint}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
