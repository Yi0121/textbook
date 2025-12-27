/**
 * useAnalyticsAgents - 分析模組專用 Hook
 * 
 * 提供分析端 Agent 功能封裝：
 * - Data Steward: 資料管理
 * - SNA Analyst: 社會網絡分析
 * - ENA Analyst: 知識網絡分析
 * - SRL Analyst: 自主學習分析
 * - Process Analyst: 過程分析
 * - Math Problem Analyst: 數學解題分析
 * - Synthesis: 綜合分析
 * - Dashboard: 儀表板
 */

import { useAgent } from '../context/AgentContext';

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
