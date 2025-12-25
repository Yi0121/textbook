/**
 * Card - 統一卡片容器元件
 * 
 * 提供一致的卡片樣式，包含 padding、陰影、圓角
 * 支援 hover 效果和可點擊模式
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

// ==================== Types ====================

export type CardVariant = 'default' | 'outlined' | 'elevated' | 'interactive';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    /** 卡片變體 */
    variant?: CardVariant;
    /** 內部 padding */
    padding?: 'none' | 'sm' | 'md' | 'lg';
    /** 卡片標題區 */
    header?: ReactNode;
    /** 卡片頁腳區 */
    footer?: ReactNode;
    /** 是否為無間距內容 (圖片卡片) */
    noPadding?: boolean;
}

// ==================== Styles ====================

const baseStyles = `
    bg-white dark:bg-gray-800
    rounded-card
    transition-all duration-200
`;

const variantStyles: Record<CardVariant, string> = {
    default: `
        shadow-card
        border border-gray-100 dark:border-gray-700
    `,
    outlined: `
        border-2 border-gray-200 dark:border-gray-700
    `,
    elevated: `
        shadow-lg
        border border-gray-100 dark:border-gray-700
    `,
    interactive: `
        shadow-card border border-gray-200 dark:border-gray-700
        hover:shadow-card-hover hover:border-teacher-300 dark:hover:border-teacher-500
        cursor-pointer
    `,
};

const paddingStyles: Record<NonNullable<CardProps['padding']>, string> = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
};

// ==================== Sub-components ====================

export const CardHeader = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
    <div className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 ${className}`}>
        {children}
    </div>
);

export const CardBody = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
    <div className={`p-4 ${className}`}>
        {children}
    </div>
);

export const CardFooter = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
    <div className={`px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-card ${className}`}>
        {children}
    </div>
);

// ==================== Main Component ====================

export const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            variant = 'default',
            padding = 'md',
            header,
            footer,
            noPadding = false,
            className = '',
            children,
            ...props
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={`
                    ${baseStyles}
                    ${variantStyles[variant]}
                    ${className}
                `.replace(/\s+/g, ' ').trim()}
                {...props}
            >
                {header && (
                    <CardHeader>{header}</CardHeader>
                )}

                <div className={noPadding ? '' : paddingStyles[padding]}>
                    {children}
                </div>

                {footer && (
                    <CardFooter>{footer}</CardFooter>
                )}
            </div>
        );
    }
);

Card.displayName = 'Card';

export default Card;
