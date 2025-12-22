/**
 * BaseAgent - Agent 基礎類別
 * 
 * 提供所有 Agent 的共用功能：
 * - Tool 註冊與查找
 * - 請求執行
 * - 錯誤處理
 */

import type {
    IAgent,
    AgentId,
    AgentCategory,
    AgentTool,
    AgentRequest,
    AgentResponse,
} from './types';

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
}
