/**
 * Toast 通知組件
 * 
 * 提供全域 Toast 通知功能
 */

import { useState, useCallback, createContext, useContext, type ReactNode } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// Toast 類型
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextValue {
    toasts: Toast[];
    addToast: (type: ToastType, message: string, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// Hook 使用 Toast
export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

// Toast Provider
export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((type: ToastType, message: string, duration = 3000) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newToast: Toast = { id, type, message, duration };

        setToasts(prev => [...prev, newToast]);

        // 自動移除
        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

// Toast 容器
function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
}

// 單個 Toast
function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    const iconMap = {
        success: CheckCircle,
        error: XCircle,
        warning: AlertCircle,
        info: Info,
    };

    const colorMap = {
        success: 'bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-800',
        error: 'bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-800',
        warning: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800',
        info: 'bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800',
    };

    const iconColorMap = {
        success: 'text-green-600 dark:text-green-400',
        error: 'text-red-600 dark:text-red-400',
        warning: 'text-yellow-600 dark:text-yellow-400',
        info: 'text-blue-600 dark:text-blue-400',
    };

    const Icon = iconMap[toast.type];

    return (
        <div
            className={`
                flex items-center gap-3 p-4 rounded-xl border shadow-lg pointer-events-auto
                animate-slide-up
                ${colorMap[toast.type]}
            `}
        >
            <Icon className={`w-5 h-5 shrink-0 ${iconColorMap[toast.type]}`} />
            <p className="flex-1 text-sm font-medium text-gray-900 dark:text-white">
                {toast.message}
            </p>
            <button
                onClick={onClose}
                className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors"
            >
                <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
        </div>
    );
}

export default ToastProvider;
