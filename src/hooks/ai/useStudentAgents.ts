/**
 * useStudentAgents - 學生模組專用 Hook
 * 
 * 提供學生端 Agent 功能封裝：
 * - Scaffolding: 鷹架支援
 * - Grader: 評分系統
 * - Learning Observer: 學習觀察
 * - Peer Facilitator: 同儕協作
 * - Realtime Hint: 即時提示
 * - SRL: 自主學習調節
 */

import { useAgent } from '../../context/AgentContext';

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
