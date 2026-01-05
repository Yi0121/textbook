/**
 * TanStack Query 配置
 * 
 * 提供全域 QueryClient 設定
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

// ==================== Query Client ====================

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // 錯誤重試次數
            retry: 1,
            // 資料過期時間 (5 分鐘)
            staleTime: 5 * 60 * 1000,
            // 快取保留時間 (10 分鐘)
            gcTime: 10 * 60 * 1000,
            // 視窗聚焦時不自動重新取得
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: 0,
        },
    },
});

// ==================== Provider ====================

interface QueryProviderProps {
    children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
    return (
        <QueryClientProvider client= { queryClient } >
        { children }
        </QueryClientProvider>
  );
}
