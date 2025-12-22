/**
 * AgentContext - Agent 系統 React Context
 * 
 * 提供全域 Agent 系統存取，包含：
 * - Orchestrator 實例
 * - Agent 調用方法
 * - 狀態追蹤
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

// ==================== Hook ====================

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

/**
 * 教師模組專用 Hook
 */
export function useTeacherAgents() {
    const { callAgent, state } = useAgent();

    return {
        isReady: state.initialized,
        isPending: state.pendingRequests > 0,
        error: state.error,

        // Lesson Planner
        createLessonPlan: (title: string, options?: { description?: string; targetClass?: string; duration?: number }) =>
            callAgent('lesson-planner', 'create_lesson_plan', { title, ...options }),

        editLessonFlow: (lessonId: string, nodes?: unknown[], edges?: unknown[]) =>
            callAgent('lesson-planner', 'edit_lesson_flow', { lessonId, nodes, edges }),

        assignActivities: (lessonId: string, activities: Array<{ type: string; title: string; duration?: number }>) =>
            callAgent('lesson-planner', 'assign_activities', { lessonId, activities }),

        scheduleContent: (lessonId: string, publishAt: number, notifyStudents?: boolean) =>
            callAgent('lesson-planner', 'schedule_content', { lessonId, publishAt, notifyStudents }),

        // Content Generator
        generateTextContent: (topic: string, options?: { style?: string; length?: string }) =>
            callAgent('content-generator', 'generate_text_content', { topic, ...options }),

        generateExercise: (topic: string, options?: { difficulty?: string; count?: number; type?: string }) =>
            callAgent('content-generator', 'generate_exercise', { topic, ...options }),

        generateQuiz: (topic: string, options?: { questionCount?: number; duration?: number; passingScore?: number }) =>
            callAgent('content-generator', 'generate_quiz', { topic, ...options }),

        generateMultimedia: (topic: string, type: 'image' | 'video' | 'diagram', description?: string) =>
            callAgent('content-generator', 'generate_multimedia', { topic, type, description }),

        analyzeAndGeneratePath: (studentRecord: unknown) =>
            callAgent('content-generator', 'analyze_and_generate_path', { studentRecord }),

        generateKnowledgeContent: (nodeId: string, nodeName: string) =>
            callAgent('content-generator', 'generate_knowledge_content', { nodeId, nodeName }),

        // Grouping
        autoGroupStudents: (classId: string, options?: { groupCount?: number; strategy?: string; maxGroupSize?: number }) =>
            callAgent('grouping', 'auto_group_students', { classId, ...options }),

        manualGroup: (classId: string, groups: Array<{ name: string; studentIds: string[] }>) =>
            callAgent('grouping', 'manual_group', { classId, groups }),

        getGroupAnalytics: (classId: string, groupId?: string) =>
            callAgent('grouping', 'get_group_analytics', { classId, groupId }),
    };
}
