/**
 * Repository 型別定義
 * 
 * 定義 Repository 的通用介面與回傳型別
 */

// ==================== Response Types ====================

export interface RepositoryResponse<T> {
    data: T;
    timestamp: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}

// ==================== Base Repository Interface ====================

export interface IRepository<T, ID = string> {
    getById(id: ID): Promise<T | null>;
    getAll(): Promise<T[]>;
}

// ==================== Data Source Strategy ====================

export type DataSource = 'mock' | 'api';

export function getCurrentDataSource(): DataSource {
    // 動態判斷資料來源
    const useMock = import.meta.env.VITE_USE_MOCK !== 'false';
    return useMock ? 'mock' : 'api';
}
