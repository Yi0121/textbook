// components/ErrorBoundary.tsx
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
    errorInfo?: React.ErrorInfo;
}

/**
 * Error Boundary 組件
 * 捕獲子組件的 JavaScript 錯誤，防止整個應用程式崩潰
 */
export class ErrorBoundary extends React.Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error('ErrorBoundary caught an error:', error);
        console.error('Component stack:', errorInfo.componentStack);
        this.setState({ errorInfo });
    }

    handleReload = (): void => {
        window.location.reload();
    };

    handleReset = (): void => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    render(): React.ReactNode {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full p-8 text-center">
                        {/* Icon */}
                        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>

                        {/* Title */}
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            發生錯誤
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            應用程式遇到了一個問題，請重新載入頁面。
                        </p>

                        {/* Error Details */}
                        {this.state.error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 text-left">
                                <p className="text-sm font-mono text-red-700 dark:text-red-300 break-words">
                                    {this.state.error.message}
                                </p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                            >
                                嘗試恢復
                            </button>
                            <button
                                onClick={this.handleReload}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <RefreshCw className="w-4 h-4" />
                                重新載入
                            </button>
                        </div>

                        {/* Debug info in development */}
                        {import.meta.env.DEV && this.state.errorInfo && (
                            <details className="mt-6 text-left">
                                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                                    開發者資訊
                                </summary>
                                <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded overflow-auto max-h-40">
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
