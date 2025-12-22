/**
 * Orchestrator - Agent 總控服務
 * 
 * 職責：
 * - 註冊與管理所有 Agent
 * - 路由請求至正確的 Agent
 * - 提供 Agent 查詢功能
 */

import type {
    IAgent,
    AgentId,
    AgentCategory,
    AgentRequest,
    AgentRegistration,
    OrchestratorRequest,
    OrchestratorResponse,
} from './types';

/**
 * Agent 總控服務
 */
export class Orchestrator {
    private agents: Map<AgentId, IAgent> = new Map();

    /**
     * 註冊 Agent
     */
    register(agent: IAgent): void {
        if (this.agents.has(agent.id)) {
            console.warn(`[Orchestrator] Agent "${agent.id}" is already registered. Overwriting.`);
        }
        this.agents.set(agent.id, agent);
        console.log(`[Orchestrator] Registered agent: ${agent.id} (${agent.name})`);
    }

    /**
     * 批次註冊多個 Agent
     */
    registerAll(agents: IAgent[]): void {
        agents.forEach((agent) => this.register(agent));
    }

    /**
     * 取消註冊 Agent
     */
    unregister(agentId: AgentId): boolean {
        const result = this.agents.delete(agentId);
        if (result) {
            console.log(`[Orchestrator] Unregistered agent: ${agentId}`);
        }
        return result;
    }

    /**
     * 路由請求至指定 Agent
     */
    async route(
        agentId: AgentId,
        request: AgentRequest
    ): Promise<OrchestratorResponse> {
        const startTime = Date.now();

        const agent = this.agents.get(agentId);

        if (!agent) {
            return {
                success: false,
                error: `Agent "${agentId}" not found. Available agents: ${this.listAgentIds().join(', ')}`,
                handledBy: 'orchestrator',
                duration: Date.now() - startTime,
            };
        }

        const response = await agent.execute(request);

        return {
            ...response,
            handledBy: agentId,
        };
    }

    /**
     * 使用 OrchestratorRequest 格式路由
     */
    async dispatch(request: OrchestratorRequest): Promise<OrchestratorResponse> {
        return this.route(request.targetAgent, request.request);
    }

    /**
     * 取得指定 Agent
     */
    getAgent(id: AgentId): IAgent | undefined {
        return this.agents.get(id);
    }

    /**
     * 檢查 Agent 是否已註冊
     */
    hasAgent(id: AgentId): boolean {
        return this.agents.has(id);
    }

    /**
     * 列出所有已註冊的 Agent ID
     */
    listAgentIds(): AgentId[] {
        return Array.from(this.agents.keys());
    }

    /**
     * 列出所有已註冊的 Agent 資訊
     */
    listAgents(): AgentRegistration[] {
        return Array.from(this.agents.values()).map((agent) => ({
            id: agent.id,
            name: agent.name,
            category: agent.category,
            toolNames: agent.getToolNames(),
            description: `${agent.name} (${agent.category})`,
        }));
    }

    /**
     * 依分類列出 Agent
     */
    listAgentsByCategory(category: AgentCategory): AgentRegistration[] {
        return this.listAgents().filter((agent) => agent.category === category);
    }

    /**
     * 查找提供特定 Tool 的 Agent
     */
    findAgentByTool(toolName: string): IAgent | undefined {
        for (const agent of this.agents.values()) {
            if (agent.getToolNames().includes(toolName)) {
                return agent;
            }
        }
        return undefined;
    }

    /**
     * 取得所有可用的 Tool 名稱
     */
    listAllTools(): Array<{ agentId: AgentId; toolName: string; description: string }> {
        const tools: Array<{ agentId: AgentId; toolName: string; description: string }> = [];

        for (const agent of this.agents.values()) {
            for (const tool of agent.tools) {
                tools.push({
                    agentId: agent.id,
                    toolName: tool.name,
                    description: tool.description,
                });
            }
        }

        return tools;
    }

    /**
     * 重置 Orchestrator（移除所有已註冊的 Agent）
     */
    reset(): void {
        this.agents.clear();
        console.log('[Orchestrator] All agents unregistered.');
    }
}

/**
 * 全域 Orchestrator 單例
 */
export const orchestrator = new Orchestrator();
