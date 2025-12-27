/**
 * AgentContext - Agent 系統 React Context
 * 
 * 提供全域 Agent 系統存取，包含：
 * - Orchestrator 實例
 * - Agent 調用方法
 * - 狀態追蹤
 * 
 * 各模組專用 Hooks 已抽離至獨立檔案：
 * - useTeacherAgents.ts
 * - useStudentAgents.ts
 * - useAnalyticsAgents.ts
 */

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import {
    orchestrator,
    teacherAgents,
    studentAgents,
    analyticsAgents,
    type AgentId,
    type AgentRequest,
    type OrchestratorResponse,
} from '../agents';

// ==================== Types ====================

interface AgentState {
    /** 是否已初始化 */
    initialized: boolean;
    /** 已註冊的 Agent 數量 */
    agentCount: number;
    /** 正在執行的請求數 */
    pendingRequests: number;
    /** 最後一次請求的結果 */
    lastResponse: OrchestratorResponse | null;
    /** 錯誤訊息 */
    error: string | null;
}

interface AgentContextValue {
    state: AgentState;
    /** 調用 Agent */
    callAgent: <T = unknown>(agentId: AgentId, action: string, payload: Record<string, unknown>) => Promise<OrchestratorResponse & { data?: T }>;
    /** 取得所有 Agent 資訊 */
    listAgents: () => ReturnType<typeof orchestrator.listAgents>;
    /** 取得指定分類的 Agents */
    listAgentsByCategory: (category: 'teacher' | 'student' | 'analytics') => ReturnType<typeof orchestrator.listAgentsByCategory>;
    /** 取得所有 Tools */
    listAllTools: () => ReturnType<typeof orchestrator.listAllTools>;
}

// ==================== Context ====================

const AgentContext = createContext<AgentContextValue | null>(null);

// ==================== Provider ====================

interface AgentProviderProps {
    children: ReactNode;
}

export function AgentProvider({ children }: AgentProviderProps) {
    const [state, setState] = useState<AgentState>({
        initialized: false,
        agentCount: 0,
        pendingRequests: 0,
        lastResponse: null,
        error: null,
    });

    // 初始化：註冊所有 Agents
    useEffect(() => {
        try {
            // 清除可能的舊註冊
            orchestrator.reset();

            // 註冊所有 Agents
            orchestrator.registerAll([
                ...teacherAgents,
                ...studentAgents,
                ...analyticsAgents,
            ]);

            setState(prev => ({
                ...prev,
                initialized: true,
                agentCount: orchestrator.listAgentIds().length,
                error: null,
            }));

            console.log('[AgentProvider] Initialized with', orchestrator.listAgentIds().length, 'agents');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            setState(prev => ({
                ...prev,
                initialized: false,
                error: errorMessage,
            }));
            console.error('[AgentProvider] Initialization failed:', error);
        }
    }, []);

    // 調用 Agent
    const callAgent = useCallback(async <T = unknown>(
        agentId: AgentId,
        action: string,
        payload: Record<string, unknown>
    ): Promise<OrchestratorResponse & { data?: T }> => {
        setState(prev => ({ ...prev, pendingRequests: prev.pendingRequests + 1, error: null }));

        try {
            const request: AgentRequest = { action, payload };
            const response = await orchestrator.route(agentId, request);

            setState(prev => ({
                ...prev,
                pendingRequests: prev.pendingRequests - 1,
                lastResponse: response,
                error: response.success ? null : response.error || null,
            }));

            return response as OrchestratorResponse & { data?: T };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);

            setState(prev => ({
                ...prev,
                pendingRequests: prev.pendingRequests - 1,
                error: errorMessage,
            }));

            return {
                success: false,
                error: errorMessage,
                handledBy: agentId,
            };
        }
    }, []);

    // Context value
    const value: AgentContextValue = {
        state,
        callAgent,
        listAgents: () => orchestrator.listAgents(),
        listAgentsByCategory: (category) => orchestrator.listAgentsByCategory(category),
        listAllTools: () => orchestrator.listAllTools(),
    };

    return (
        <AgentContext.Provider value={value}>
            {children}
        </AgentContext.Provider>
    );
}

// ==================== Base Hook ====================

/**
 * 使用 Agent Context
 */
export function useAgent() {
    const context = useContext(AgentContext);
    if (!context) {
        throw new Error('useAgent must be used within an AgentProvider');
    }
    return context;
}

// ==================== Re-exports ====================
// 為向下相容，從獨立檔案 re-export 各模組 Hooks

export { useTeacherAgents } from '../hooks/useTeacherAgents';
export { useStudentAgents } from '../hooks/useStudentAgents';
export { useAnalyticsAgents } from '../hooks/useAnalyticsAgents';
