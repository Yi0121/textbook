/**
 * DashboardAgent - 儀表板 Agent
 * 
 * 職責（第三層產出）：
 * - 渲染教師儀表板
 * - 渲染學生儀表板
 * - 渲染專項儀表板 (工作記憶/數學知識)
 * - 匯出報告
 */

import { BaseAgent } from '../BaseAgent';
import type { AgentId, AgentCategory, AgentTool } from '../types';

// ==================== Tool Input Types ====================

interface RenderTeacherDashboardInput {
    teacherId: string;
    classId: string;
    view?: 'overview' | 'detailed' | 'comparison';
}

interface RenderStudentDashboardInput {
    studentId: string;
    sections?: ('progress' | 'performance' | 'goals' | 'recommendations')[];
}

interface RenderMemoryDashboardInput {
    studentId: string;
    testType?: 'working-memory' | 'long-term' | 'recall';
}

interface RenderKnowledgeDashboardInput {
    studentId: string;
    topic?: string;
    showMisconceptions?: boolean;
}

interface ExportReportInput {
    reportType: 'individual' | 'class' | 'comparison';
    targetId: string; // studentId or classId
    format: 'pdf' | 'html' | 'json';
    sections?: string[];
}

// ==================== Agent Implementation ====================

export class DashboardAgent extends BaseAgent {
    readonly id: AgentId = 'viz';
    readonly name = '視覺化 Agent';
    readonly category: AgentCategory = 'analytics';

    protected defineTools(): AgentTool[] {
        return [
            this.createMockTool(
                'render_teacher_dashboard',
                '渲染教師儀表板',
                (input: RenderTeacherDashboardInput) => ({
                    teacherId: input.teacherId,
                    classId: input.classId,
                    view: input.view || 'overview',
                    widgets: [
                        { type: 'class-progress', data: { completed: 65, total: 100 } },
                        { type: 'at-risk-students', data: { count: 3, names: ['學生A', '學生B', '學生C'] } },
                        { type: 'recent-activity', data: { submissions: 45, avgScore: 72 } },
                        { type: 'upcoming-deadlines', data: { count: 2 } },
                    ],
                    generatedAt: Date.now(),
                })
            ),

            this.createMockTool(
                'render_student_dashboard',
                '渲染學生儀表板',
                (input: RenderStudentDashboardInput) => ({
                    studentId: input.studentId,
                    sections: input.sections || ['progress', 'performance'],
                    data: {
                        progress: { overall: 68, byTopic: { '方程式': 80, '函數': 55 } },
                        performance: { avgScore: 75, trend: 'improving' },
                        goals: { current: '完成第三章', deadline: Date.now() + 86400000 * 3 },
                        recommendations: ['複習二次函數', '多做練習題'],
                    },
                    generatedAt: Date.now(),
                })
            ),

            this.createMockTool(
                'render_memory_dashboard',
                '渲染工作記憶儀表板',
                (input: RenderMemoryDashboardInput) => ({
                    studentId: input.studentId,
                    testType: input.testType || 'working-memory',
                    memoryMetrics: {
                        capacity: Math.round(3 + Math.random() * 4),
                        accuracy: Math.round(70 + Math.random() * 25),
                        speed: Math.round(80 + Math.random() * 15),
                    },
                    comparison: {
                        classAvg: { capacity: 5, accuracy: 78, speed: 85 },
                        percentile: Math.round(40 + Math.random() * 50),
                    },
                    recommendations: ['嘗試分塊記憶策略', '使用視覺化輔助'],
                })
            ),

            this.createMockTool(
                'render_knowledge_dashboard',
                '渲染數學知識儀表板',
                (input: RenderKnowledgeDashboardInput) => ({
                    studentId: input.studentId,
                    topic: input.topic || '二次方程式',
                    knowledgeMap: {
                        masteredConcepts: ['一元一次方程式', '因式分解基礎'],
                        inProgressConcepts: ['二次方程式解法', '判別式'],
                        notStartedConcepts: ['二次函數圖形', '頂點式'],
                    },
                    misconceptions: input.showMisconceptions
                        ? [{ concept: '開口方向', description: 'a 的正負與開口關係混淆' }]
                        : [],
                    nextSteps: ['練習判別式計算', '觀看圖形變化影片'],
                })
            ),

            this.createMockTool(
                'export_report',
                '匯出學習報告',
                (input: ExportReportInput) => ({
                    reportType: input.reportType,
                    targetId: input.targetId,
                    format: input.format,
                    filename: `report-${input.reportType}-${input.targetId}-${Date.now()}.${input.format}`,
                    downloadUrl: `https://example.com/reports/${Date.now()}.${input.format}`,
                    sections: input.sections || ['summary', 'details', 'recommendations'],
                    generatedAt: Date.now(),
                })
            ),
        ];
    }
}

export const dashboardAgent = new DashboardAgent();
