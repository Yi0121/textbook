/**
 * MCP 型別定義
 * 
 * Model Context Protocol 相關介面
 */

// ==================== Tool Schema ====================

export interface McpToolSchema {
    type: 'object';
    properties?: Record<string, {
        type: string;
        description?: string;
        enum?: string[];
    }>;
    required?: string[];
}

export interface McpToolDefinition {
    name: string;
    description: string;
    inputSchema: McpToolSchema;
}

// ==================== Tool Call ====================

export interface McpToolCall {
    name: string;
    arguments: Record<string, unknown>;
}

export interface McpToolResult {
    content: unknown;
    isError?: boolean;
    errorMessage?: string;
}

// ==================== Messages ====================

export interface McpRequest {
    jsonrpc: '2.0';
    id: string | number;
    method: string;
    params?: Record<string, unknown>;
}

export interface McpResponse<T = unknown> {
    jsonrpc: '2.0';
    id: string | number;
    result?: T;
    error?: {
        code: number;
        message: string;
        data?: unknown;
    };
}

// ==================== Server Info ====================

export interface McpServerInfo {
    name: string;
    version: string;
    capabilities?: {
        tools?: boolean;
        resources?: boolean;
        prompts?: boolean;
    };
}

// ==================== Client State ====================

export type McpConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface McpClientConfig {
    serverUrl: string;
    timeout?: number;
    retryAttempts?: number;
    onStateChange?: (state: McpConnectionState) => void;
}
