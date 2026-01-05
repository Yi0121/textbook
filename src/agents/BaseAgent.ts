/**
 * BaseAgent - Agent 基礎類別
 * 
 * 提供所有 Agent 的共用功能：
 * - Tool 註冊與查找
 * - 請求執行
 * - 錯誤處理
 * - Mock/MCP 動態切換
 */

import type {
    IAgent,
    AgentId,
    AgentCategory,
    AgentTool,
    AgentRequest,
    AgentResponse,
} from './types';
import { env } from '../config/env';
import { getDefaultMcpClient, createMcpTool } from './mcp';
import type { McpClient, McpToolDefinition } from './mcp';

/**
 * Agent 抽象基礎類別
 */
export abstract class BaseAgent implements IAgent {
    abstract readonly id: AgentId;
    abstract readonly name: string;
    abstract readonly category: AgentCategory;

    /** 子類別需實作此方法來定義 Tools */
    protected abstract defineTools(): AgentTool[];

    private _tools: AgentTool[] | null = null;
    private _mcpClient: McpClient | null = null;

    /**
     * 取得 Agent 的所有 Tools (lazy initialization)
     */
    get tools(): AgentTool[] {
        if (!this._tools) {
            this._tools = this.defineTools();
        }
        return this._tools;
    }

    /**
     * 取得所有 Tool 名稱
     */
    getToolNames(): string[] {
        return this.tools.map((t) => t.name);
    }

    /**
     * 根據名稱查找 Tool
     */
    protected findTool(name: string): AgentTool | undefined {
        return this.tools.find((t) => t.name === name);
    }

    /**
     * 執行 Agent 請求
     */
    async execute<T = unknown>(request: AgentRequest): Promise<AgentResponse<T>> {
        const startTime = Date.now();

        try {
            const tool = this.findTool(request.action);

            if (!tool) {
                return {
                    success: false,
                    error: `Tool "${request.action}" not found in agent "${this.id}". Available tools: ${this.getToolNames().join(', ')}`,
                    duration: Date.now() - startTime,
                };
            }

            const result = await tool.execute(request.payload);

            return {
                success: true,
                data: result as T,
                duration: Date.now() - startTime,
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`[${this.id}] Error executing "${request.action}":`, error);

            return {
                success: false,
                error: errorMessage,
                duration: Date.now() - startTime,
            };
        }
    }

    /**
     * 建立 Mock Tool（用於尚未實作的功能）
     */
    protected createMockTool<TInput = unknown, TOutput = unknown>(
        name: string,
        description: string,
        mockResponse: TOutput | ((input: TInput) => TOutput | Promise<TOutput>)
    ): AgentTool {
        return {
            name,
            description,
            execute: async (input: TInput): Promise<TOutput> => {
                // 模擬 API 延遲
                await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200));

                if (typeof mockResponse === 'function') {
                    return (mockResponse as (input: TInput) => TOutput | Promise<TOutput>)(input);
                }
                return mockResponse;
            },
        };
    }

    /**
     * 建立 Tool（自動切換 Mock/MCP）
     * 
     * 根據環境變數 VITE_USE_MCP 決定使用 Mock 或 MCP 實作
     * 
     * @param name Tool 名稱
     * @param description Tool 描述
     * @param mockFn Mock 實作（當 MCP 未啟用時使用）
     */
    protected createTool<TInput = unknown, TOutput = unknown>(
        name: string,
        description: string,
        mockFn: (input: TInput) => TOutput | Promise<TOutput>
    ): AgentTool {
        // 如果未啟用 MCP，使用 Mock
        if (!env.useMcp) {
            return this.createMockTool(name, description, mockFn);
        }

        // 使用 MCP
        try {
            const client = this.getMcpClient();
            const toolDef: McpToolDefinition = {
                name,
                description,
                inputSchema: { type: 'object' },
            };
            return createMcpTool(client, toolDef);
        } catch (error) {
            // MCP 初始化失敗，fallback 到 Mock
            console.warn(`[${this.id}] MCP not available, falling back to mock for tool "${name}":`, error);
            return this.createMockTool(name, description, mockFn);
        }
    }

    /**
     * 取得 MCP Client（懶載入）
     */
    protected getMcpClient(): McpClient {
        if (!this._mcpClient) {
            this._mcpClient = getDefaultMcpClient();
        }
        return this._mcpClient;
    }
}

