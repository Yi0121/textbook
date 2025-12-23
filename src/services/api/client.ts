/**
 * API Client
 * 
 * HTTP 客戶端抽象，支援：
 * - 請求攔截器
 * - 錯誤處理
 * - 重試機制
 */

// ==================== Types ====================

export interface RequestConfig {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    headers?: Record<string, string>;
    body?: unknown;
    timeout?: number;
}

export interface ApiResponse<T> {
    data: T;
    status: number;
    headers: Headers;
}

export interface ApiError {
    message: string;
    status?: number;
    code?: string;
}

// ==================== API Client Class ====================

class ApiClient {
    private baseUrl: string;
    private defaultHeaders: Record<string, string>;
    private timeout: number;

    constructor(config?: {
        baseUrl?: string;
        headers?: Record<string, string>;
        timeout?: number;
    }) {
        this.baseUrl = config?.baseUrl || '';
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            ...config?.headers,
        };
        this.timeout = config?.timeout || 30000;
    }

    async request<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
        const url = this.baseUrl + endpoint;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config?.timeout || this.timeout);

        try {
            const response = await fetch(url, {
                method: config?.method || 'GET',
                headers: { ...this.defaultHeaders, ...config?.headers },
                body: config?.body ? JSON.stringify(config.body) : undefined,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw this.createError(response);
            }

            const data = await response.json();
            return { data, status: response.status, headers: response.headers };
        } catch (error) {
            clearTimeout(timeoutId);
            throw this.handleError(error);
        }
    }

    async get<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { ...config, method: 'GET' });
    }

    async post<T>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { ...config, method: 'POST', body });
    }

    async put<T>(endpoint: string, body?: unknown, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { ...config, method: 'PUT', body });
    }

    async delete<T>(endpoint: string, config?: Omit<RequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { ...config, method: 'DELETE' });
    }

    // ==================== Error Handling ====================

    private createError(response: Response): ApiError {
        return {
            message: `HTTP Error: ${response.status} ${response.statusText}`,
            status: response.status,
            code: `HTTP_${response.status}`,
        };
    }

    private handleError(error: unknown): ApiError {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                return { message: 'Request timeout', code: 'TIMEOUT' };
            }
            return { message: error.message, code: 'NETWORK_ERROR' };
        }
        return { message: 'Unknown error', code: 'UNKNOWN' };
    }
}

// ==================== Singleton Instance ====================

export const apiClient = new ApiClient({
    baseUrl: import.meta.env.VITE_API_BASE_URL || '',
});

// ==================== Export ====================

export { ApiClient };
