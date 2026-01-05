/**
 * McpToolAdapter
 * 
 * 將遠端 MCP Tool 轉換為本地 AgentTool 介面
 */

import type { AgentTool } from '../types';
import type { McpClient } from './McpClient';
import type { McpToolDefinition } from './types';

// ==================== Adapter ====================

/**
 * 將單一 MCP Tool 包裝成 AgentTool
 */
export function createMcpTool(
    mcpClient: McpClient,
    toolDef: McpToolDefinition
): AgentTool {
    return {
        name: toolDef.name,
        description: toolDef.description,
        execute: async (input: unknown) => {
            const result = await mcpClient.callTool({
                name: toolDef.name,
                arguments: input as Record<string, unknown>,
            });

            if (result.isError) {
                throw new Error(result.errorMessage ?? 'MCP Tool execution failed');
            }

            return result.content;
        },
    };
}

/**
 * 將多個 MCP Tools 批次轉換為 AgentTool 陣列
 */
export async function createMcpTools(mcpClient: McpClient): Promise<AgentTool[]> {
    const toolDefs = await mcpClient.listTools();
    return toolDefs.map(def => createMcpTool(mcpClient, def));
}

/**
 * 根據名稱過濾並轉換指定的 MCP Tools
 */
export async function createMcpToolsByNames(
    mcpClient: McpClient,
    toolNames: string[]
): Promise<AgentTool[]> {
    const toolDefs = await mcpClient.listTools();
    const filtered = toolDefs.filter(def => toolNames.includes(def.name));
    return filtered.map(def => createMcpTool(mcpClient, def));
}
