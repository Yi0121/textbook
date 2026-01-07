/**
 * LessonPlannerAgent - 教案規劃 Agent
 * 
 * 職責：
 * - 建立與編輯教案工作流
 * - 指派學習活動
 * - 排程內容發布
 */

import { BaseAgent } from '../BaseAgent';
import type { AgentId, AgentCategory, AgentTool, ToolInput } from '../types';

// ==================== Tool Input Types ====================

interface CreateLessonPlanInput extends ToolInput {
    title: string;
    description?: string;
    targetClass?: string;
    duration?: number; // 分鐘
}

interface EditLessonFlowInput extends ToolInput {
    lessonId: string;
    nodes?: Array<{
        id: string;
        type: string;
        label: string;
        position: { x: number; y: number };
    }>;
    edges?: Array<{
        source: string;
        target: string;
    }>;
}

interface AssignActivitiesInput extends ToolInput {
    lessonId: string;
    activities: Array<{
        type: string;
        title: string;
        duration?: number;
    }>;
}

interface ScheduleContentInput extends ToolInput {
    lessonId: string;
    publishAt: number; // timestamp
    notifyStudents?: boolean;
}

// ==================== Agent Implementation ====================

export class LessonPlannerAgent extends BaseAgent {
    readonly id: AgentId = 'curriculum-design';
    readonly name = '課程設計 Agent'; // Curriculum Design Agent
    readonly category: AgentCategory = 'teacher';

    protected defineTools(): AgentTool[] {
        return [
            this.createMockTool(
                'create_lesson_plan',
                '建立新的教案工作流',
                (input: CreateLessonPlanInput) => ({
                    id: `lesson-${Date.now()}`,
                    title: input.title,
                    description: input.description || '',
                    targetClass: input.targetClass || 'default',
                    duration: input.duration || 45,
                    nodes: [],
                    edges: [],
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                })
            ),

            this.createMockTool(
                'edit_lesson_flow',
                '編輯教學流程節點與連線',
                (input: EditLessonFlowInput) => ({
                    success: true,
                    updatedAt: Date.now(),
                    lessonId: input.lessonId,
                })
            ),

            this.createMockTool(
                'assign_activities',
                '指派學習活動到教案',
                (input: AssignActivitiesInput) => ({
                    assignedCount: input.activities.length,
                })
            ),

            this.createMockTool(
                'schedule_content',
                '排程內容發布時間',
                (input: ScheduleContentInput) => ({
                    scheduled: true,
                    publishAt: input.publishAt,
                })
            ),
        ];
    }
}

/**
 * LessonPlannerAgent 單例
 */
export const lessonPlannerAgent = new LessonPlannerAgent();
