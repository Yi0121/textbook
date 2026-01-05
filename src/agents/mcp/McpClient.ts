/**
 * McpClient
 * 
 * MCP (Model Context Protocol) 客戶端實作
 * 負責與 MCP Server 建立連線並呼叫遠端 Tools
 */

import type {
    McpClientConfig,
    McpConnectionState,
    McpToolCall,
    McpToolResult,
    McpToolDefinition,
    McpRequest,
    McpResponse,
    McpServerInfo,
} from './types';

// ==================== Client Implementation ====================

export class McpClient {
    private serverUrl: string;
    private timeout: number;
    private retryAttempts: number;
    private state: McpConnectionState = 'disconnected';
    private onStateChange?: (state: McpConnectionState) => void;
    private requestId = 0;
    private cachedTools: McpToolDefinition[] | null = null;

    constructor(config: McpClientConfig) {
        this.serverUrl = config.serverUrl;
        this.timeout = config.timeout ?? 30000;
        this.retryAttempts = config.retryAttempts ?? 2;
        this.onStateChange = config.onStateChange;
    }

    // ==================== Connection ====================

    private setState(newState: McpConnectionState): void {
        this.state = newState;
        this.onStateChange?.(newState);
    }

    getState(): McpConnectionState {
        return this.state;
    }

    async connect(): Promise<McpServerInfo> {
        this.setState('connecting');

        try {
            const response = await this.sendRequest<McpServerInfo>('initialize', {
                protocolVersion: '2024-11-05',
                clientInfo: {
                    name: 'textbook-client',
                    version: '1.0.0',
                },
                capabilities: {},
            });

            this.setState('connected');
            return response;
        } catch (error) {
            this.setState('error');
            throw error;
        }
    }

    async disconnect(): Promise<void> {
        this.cachedTools = null;
        this.setState('disconnected');
    }

    // ==================== Tools ====================

    async listTools(): Promise<McpToolDefinition[]> {
        if (this.cachedTools) {
            return this.cachedTools;
        }

        const response = await this.sendRequest<{ tools: McpToolDefinition[] }>('tools/list', {});
        this.cachedTools = response.tools;
        return response.tools;
    }

    async callTool(call: McpToolCall): Promise<McpToolResult> {
        try {
            const response = await this.sendRequest<{ content: unknown[] }>('tools/call', {
                name: call.name,
                arguments: call.arguments,
            });

            // MCP 回傳的 content 是陣列，取第一個元素
            const content = response.content?.[0];

            return {
                content: typeof content === 'object' && content !== null && 'text' in content
                    ? (content as { text: unknown }).text
                    : content,
                isError: false,
            };
        } catch (error) {
            return {
                content: null,
                isError: true,
                errorMessage: error instanceof Error ? error.message : String(error),
            };
        }
    }

    // ==================== Request Handling ====================

    private async sendRequest<T>(method: string, params: Record<string, unknown>): Promise<T> {
        const requestId = ++this.requestId;

        const request: McpRequest = {
            jsonrpc: '2.0',
            id: requestId,
            method,
            params,
        };

        let lastError: Error | null = null;

        for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), this.timeout);

                const response = await fetch(this.serverUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(request),
                    signal: controller.signal,
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const jsonResponse = await response.json() as McpResponse<T>;

                if (jsonResponse.error) {
                    throw new Error(`MCP Error ${jsonResponse.error.code}: ${jsonResponse.error.message}`);
                }

                return jsonResponse.result as T;
            } catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));

                if (attempt < this.retryAttempts) {
                    // 指數退避
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
                }
            }
        }

        throw lastError ?? new Error('Unknown error');
    }
}

// ==================== Factory ====================

let _defaultClient: McpClient | null = null;

export function getDefaultMcpClient(): McpClient {
    if (!_defaultClient) {
        const serverUrl = import.meta.env.VITE_MCP_SERVER_URL;

        if (!serverUrl) {
            throw new Error('VITE_MCP_SERVER_URL is not configured');
        }

        _defaultClient = new McpClient({ serverUrl });
    }
    return _defaultClient;
}

export function createMcpClient(config: McpClientConfig): McpClient {
    return new McpClient(config);
}
