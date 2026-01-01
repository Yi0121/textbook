/**
 * useTeacherAgents - 教師模組專用 Hook
 * 
 * 提供教師端 Agent 功能封裝：
 * - Lesson Planner: 課程規劃
 * - Content Generator: 內容生成
 * - Grouping: 學生分組
 */

import { useAgent } from '../../context/AgentContext';

/**
 * 教師模組專用 Hook
 */
export function useTeacherAgents() {
    const { callAgent, state } = useAgent();

    return {
        isReady: state.initialized,
        isPending: state.pendingRequests > 0,
        error: state.error,

        // ==================== Lesson Planner ====================
        createLessonPlan: (title: string, options?: { description?: string; targetClass?: string; duration?: number }) =>
            callAgent('lesson-planner', 'create_lesson_plan', { title, ...options }),

        editLessonFlow: (lessonId: string, nodes?: unknown[], edges?: unknown[]) =>
            callAgent('lesson-planner', 'edit_lesson_flow', { lessonId, nodes, edges }),

        assignActivities: (lessonId: string, activities: Array<{ type: string; title: string; duration?: number }>) =>
            callAgent('lesson-planner', 'assign_activities', { lessonId, activities }),

        scheduleContent: (lessonId: string, publishAt: number, notifyStudents?: boolean) =>
            callAgent('lesson-planner', 'schedule_content', { lessonId, publishAt, notifyStudents }),

        // ==================== Content Generator ====================
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

        // ==================== Grouping ====================
        autoGroupStudents: (classId: string, options?: { groupCount?: number; strategy?: string; maxGroupSize?: number }) =>
            callAgent('grouping', 'auto_group_students', { classId, ...options }),

        manualGroup: (classId: string, groups: Array<{ name: string; studentIds: string[] }>) =>
            callAgent('grouping', 'manual_group', { classId, groups }),

        getGroupAnalytics: (classId: string, groupId?: string) =>
            callAgent('grouping', 'get_group_analytics', { classId, groupId }),
    };
}
