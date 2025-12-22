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

/**
 * 學生模組專用 Hook
 */
export function useStudentAgents() {
    const { callAgent, state } = useAgent();

    return {
        isReady: state.initialized,
        isPending: state.pendingRequests > 0,
        error: state.error,

        // ==================== Scaffolding Agent ====================
        /** 切換鷹架模式 (示範/引導/獨立) */
        switchScaffoldMode: (studentId: string, mode: 'demo' | 'guided' | 'independent') =>
            callAgent('scaffolding', 'switch_scaffold_mode', { studentId, mode }),

        /** 提供解題提示 */
        provideHint: (studentId: string, problemId: string, hintLevel: number) =>
            callAgent('scaffolding', 'provide_hint', { studentId, problemId, hintLevel }),

        /** 調整難度 */
        adjustDifficulty: (studentId: string, currentDifficulty: number, performanceScore: number) =>
            callAgent('scaffolding', 'adjust_difficulty', { studentId, currentDifficulty, performanceScore }),

        /** 啟動 GeoGebra */
        launchGeogebra: (studentId: string, topic: string, config?: unknown) =>
            callAgent('scaffolding', 'launch_geogebra', { studentId, topic, config }),

        /** 啟用手寫板 */
        enableHandwriting: (studentId: string, lessonId?: string) =>
            callAgent('scaffolding', 'enable_handwriting', { studentId, lessonId }),

        // ==================== Grader Agent ====================
        /** 自動評分 */
        autoGrade: (submissionId: string, questionType: string, studentAnswer: unknown, correctAnswer?: unknown) =>
            callAgent('grader', 'auto_grade', { submissionId, questionType, studentAnswer, correctAnswer }),

        /** 檢查答案 */
        checkAnswer: (questionId: string, studentAnswer: unknown, correctAnswer: unknown) =>
            callAgent('grader', 'check_answer', { questionId, studentAnswer, correctAnswer }),

        /** 提供回饋 */
        provideFeedback: (submissionId: string, score: number, isCorrect: boolean) =>
            callAgent('grader', 'provide_feedback', { submissionId, score, isCorrect }),

        /** 計算總分 */
        calculateScore: (submissions: Array<{ score: number; weight?: number }>) =>
            callAgent('grader', 'calculate_score', { submissions }),

        /** 決定下一步學習路徑 */
        decideNextPath: (score: number, nodeId: string) =>
            callAgent('grader', 'decide_next_path', { score, nodeId }),

        // ==================== Learning Observer Agent ====================
        /** 追蹤學習行為 */
        trackBehavior: (studentId: string, eventType: string, eventData?: unknown) =>
            callAgent('learning-observer', 'track_behavior', { studentId, eventType, eventData }),

        /** 記錄互動 */
        logInteraction: (studentId: string, action: string, target: string, metadata?: unknown) =>
            callAgent('learning-observer', 'log_interaction', { studentId, action, target, metadata }),

        /** 偵測學習困難 */
        detectStruggle: (studentId: string, sessionData: unknown) =>
            callAgent('learning-observer', 'detect_struggle', { studentId, sessionData }),

        /** 監控投入度 */
        monitorEngagement: (studentId: string, timeWindow?: number) =>
            callAgent('learning-observer', 'monitor_engagement', { studentId, timeWindow }),

        // ==================== Peer Facilitator Agent ====================
        /** 加入白板 */
        joinWhiteboard: (sessionId: string, studentId: string) =>
            callAgent('peer-facilitator', 'join_whiteboard', { sessionId, studentId }),

        /** 發送聊天訊息 */
        sendChatMessage: (sessionId: string, studentId: string, message: string) =>
            callAgent('peer-facilitator', 'send_chat_message', { sessionId, studentId, message }),

        /** AI 協助討論 */
        aiFacilitate: (sessionId: string, context: string) =>
            callAgent('peer-facilitator', 'ai_facilitate', { sessionId, context }),

        /** 建議合作方式 */
        suggestCollaboration: (sessionId: string, participants: string[]) =>
            callAgent('peer-facilitator', 'suggest_collaboration', { sessionId, participants }),

        // ==================== Realtime Hint Agent ====================
        /** 提供解題策略建議 */
        suggestStrategy: (studentId: string, problemType: string, currentStep?: number) =>
            callAgent('realtime-hint', 'suggest_strategy', { studentId, problemType, currentStep }),

        /** 提供 CPS (合作問題解決) 建議 */
        suggestCPSAction: (sessionId: string, studentId: string, cpsPhase: string, teamProgress?: unknown) =>
            callAgent('realtime-hint', 'suggest_cps_action', { sessionId, studentId, cpsPhase, teamProgress }),

        // ==================== SRL Agent ====================
        /** 評估自主學習狀態 */
        assessSRLState: (studentId: string, sessionData?: unknown) =>
            callAgent('srl', 'assess_srl_state', { studentId, sessionData }),

        /** 觸發後設認知反思 */
        promptMetacognition: (studentId: string, currentProgress: number, topic: string) =>
            callAgent('srl', 'prompt_metacognition', { studentId, currentProgress, topic }),

        /** 建議學習策略 */
        suggestLearningStrategy: (studentId: string, learningStyle?: string, weakAreas?: string[], availableTime?: number) =>
            callAgent('srl', 'suggest_learning_strategy', { studentId, learningStyle, weakAreas, availableTime }),
    };
}

/**
 * 分析模組專用 Hook
 */
export function useAnalyticsAgents() {
    const { callAgent, state } = useAgent();

    return {
        isReady: state.initialized,
        isPending: state.pendingRequests > 0,
        error: state.error,

        // ==================== Data Steward Agent ====================
        /** 收集原始資料 */
        collectRawData: (source: string, dataType: string, rawData: unknown) =>
            callAgent('data-steward', 'collect_raw_data', { source, dataType, rawData }),

        /** 清理資料 */
        cleanData: (dataId: string) =>
            callAgent('data-steward', 'clean_data', { dataId }),

        /** 儲存資料 */
        storeData: (dataId: string, storage?: string) =>
            callAgent('data-steward', 'store_data', { dataId, storage }),

        /** 匯出資料 */
        exportData: (dataIds: string[], format: 'json' | 'csv' | 'xlsx') =>
            callAgent('data-steward', 'export_data', { dataIds, format }),

        /** 載入學習路徑 */
        loadLearningPath: (pathId: string) =>
            callAgent('data-steward', 'load_learning_path', { pathId }),

        /** 儲存學習路徑 */
        saveLearningPath: (pathId: string, pathData: unknown) =>
            callAgent('data-steward', 'save_learning_path', { pathId, pathData }),

        /** 載入所有路徑 */
        loadAllPaths: () =>
            callAgent('data-steward', 'load_all_paths', {}),

        // ==================== SNA Analyst Agent ====================
        /** 分析社會網絡 */
        analyzeSocialNetwork: (classId: string, interactionType?: string) =>
            callAgent('sna-analyst', 'analyze_social_network', { classId, interactionType }),

        /** 識別群組 */
        identifyClusters: (networkData: unknown) =>
            callAgent('sna-analyst', 'identify_clusters', { networkData }),

        /** 計算中心性 */
        measureCentrality: (networkData: unknown, studentId?: string) =>
            callAgent('sna-analyst', 'measure_centrality', { networkData, studentId }),

        // ==================== ENA Analyst Agent ====================
        /** 分析知識網絡 */
        analyzeEpistemicNetwork: (studentId: string, learningData: unknown) =>
            callAgent('ena-analyst', 'analyze_epistemic_network', { studentId, learningData }),

        /** 識別知識連結 */
        identifyKnowledgeConnections: (conceptData: unknown) =>
            callAgent('ena-analyst', 'identify_knowledge_connections', { conceptData }),

        /** 比較學習模式 */
        compareLearningPatterns: (studentIds: string[]) =>
            callAgent('ena-analyst', 'compare_learning_patterns', { studentIds }),

        // ==================== SRL Analyst Agent ====================
        /** 分析自主學習模式 */
        analyzeSRLPatterns: (studentId: string, timeRange?: { start: number; end: number }) =>
            callAgent('srl-analyst', 'analyze_srl_patterns', { studentId, timeRange }),

        /** 評估自我調節 */
        measureSelfRegulation: (studentId: string) =>
            callAgent('srl-analyst', 'measure_self_regulation', { studentId }),

        /** 識別自主學習弱點 */
        identifySRLWeakness: (studentId: string) =>
            callAgent('srl-analyst', 'identify_srl_weakness', { studentId }),

        // ==================== Process Analyst Agent ====================
        /** 分析學習軌跡 */
        analyzeLearningTrajectory: (studentId: string, pathId?: string) =>
            callAgent('process-analyst', 'analyze_learning_trajectory', { studentId, pathId }),

        /** 識別瓶頸 */
        identifyBottlenecks: (studentId: string) =>
            callAgent('process-analyst', 'identify_bottlenecks', { studentId }),

        /** 評估進度 */
        measureProgress: (studentId: string, targetProgress?: number) =>
            callAgent('process-analyst', 'measure_progress', { studentId, targetProgress }),

        // ==================== Math Problem Analyst Agent ====================
        /** 分析解題過程 */
        analyzeProblemSolving: (submissionId: string, solutionSteps: unknown[]) =>
            callAgent('math-problem-analyst', 'analyze_problem_solving', { submissionId, solutionSteps }),

        /** 識別迷思概念 */
        identifyMisconceptions: (studentId: string, errorPatterns: unknown[]) =>
            callAgent('math-problem-analyst', 'identify_misconceptions', { studentId, errorPatterns }),

        /** 追蹤解題路徑 */
        traceSolutionPath: (submissionId: string) =>
            callAgent('math-problem-analyst', 'trace_solution_path', { submissionId }),

        // ==================== Synthesis Agent ====================
        /** 彙整分析結果 */
        aggregateAnalyses: (analysisIds: string[]) =>
            callAgent('synthesis', 'aggregate_analyses', { analysisIds }),

        /** 生成教學建議 */
        generateTeachingSuggestions: (classId: string, analysisData: unknown) =>
            callAgent('synthesis', 'generate_teaching_suggestions', { classId, analysisData }),

        /** 優先排序介入措施 */
        prioritizeInterventions: (suggestions: unknown[]) =>
            callAgent('synthesis', 'prioritize_interventions', { suggestions }),

        // ==================== Dashboard Agent ====================
        /** 渲染教師儀表板 */
        renderTeacherDashboard: (classId: string) =>
            callAgent('dashboard', 'render_teacher_dashboard', { classId }),

        /** 渲染學生儀表板 */
        renderStudentDashboard: (studentId: string) =>
            callAgent('dashboard', 'render_student_dashboard', { studentId }),

        /** 渲染記憶儀表板 */
        renderMemoryDashboard: (studentId: string) =>
            callAgent('dashboard', 'render_memory_dashboard', { studentId }),

        /** 渲染知識儀表板 */
        renderKnowledgeDashboard: (studentId: string) =>
            callAgent('dashboard', 'render_knowledge_dashboard', { studentId }),

        /** 匯出報告 */
        exportReport: (dashboardType: string, entityId: string, format: 'pdf' | 'html' | 'json') =>
            callAgent('dashboard', 'export_report', { dashboardType, entityId, format }),
    };
}
