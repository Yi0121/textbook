/**
 * 學生學習進度資料結構
 */

export interface NodeProgress {
    nodeId: string;
    completed: boolean;
    score?: number;
    completedAt?: Date;
    startedAt?: Date;
    timeSpent?: number; // 停留時間（秒）
    retryCount?: number; // 重試次數
    passedCheckpoint?: boolean; // 是否通過條件檢查點
    pathTaken?: 'learned' | 'remedial'; // 走哪條路徑
}

export interface StudentProgress {
    studentId: string;
    studentName: string;
    lessonId: string;
    nodeProgress: NodeProgress[];
    currentNodeId: string;
    overallProgress: number; // 0-100
    lastActiveAt: Date;
}

export interface ClassProgress {
    lessonId: string;
    lessonTitle: string;
    students: StudentProgress[];
    nodeCompletionRates: {
        nodeId: string;
        nodeTitle: string;
        completedCount: number;
        totalCount: number;
        percentage: number;
    }[];
    conditionalBranchStats?: {
        nodeId: string;
        nodeTitle: string;
        learnedCount: number;
        remedialCount: number;
        pendingCount: number;
    }[];
}

// ==================== Mock 資料 ====================
// [Refactored] Mock 資料已移至 src/mocks/ 目錄
// - MOCK_STUDENT_PROGRESS → 已刪除
// - MOCK_DIFFERENTIATED_STUDENT_PROGRESS → mocks/studentProgressMocks.ts
// 使用方式：import { MOCK_DIFFERENTIATED_STUDENT_PROGRESS } from '../mocks';

