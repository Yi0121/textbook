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

// ==================== Mock 學生進度資料 ====================

export const MOCK_STUDENT_PROGRESS: StudentProgress[] = [
    {
        studentId: 'student-1',
        studentName: '張小明',
        lessonId: 'lesson-math-001',
        currentNodeId: 'node-2-补强',
        overallProgress: 60,
        lastActiveAt: new Date('2024-01-15T10:20:00'),
        nodeProgress: [
            {
                nodeId: 'node-1',
                completed: true,
                score: 85,
                completedAt: new Date('2024-01-15T09:12:00'),
                startedAt: new Date('2024-01-15T09:00:00'),
                timeSpent: 720, // 12分鐘
                retryCount: 0,
            },
            {
                nodeId: 'node-2',
                completed: true,
                score: 60,
                completedAt: new Date('2024-01-15T09:25:00'),
                startedAt: new Date('2024-01-15T09:15:00'),
                timeSpent: 600, // 10分鐘
                retryCount: 2,
                passedCheckpoint: false,
                pathTaken: 'remedial',
            },
            {
                nodeId: 'node-2-补强',
                completed: false,
                startedAt: new Date('2024-01-15T09:30:00'),
                timeSpent: 300, // 5分鐘（進行中）
            },
        ],
    },
    {
        studentId: 'student-2',
        studentName: '李小華',
        lessonId: 'lesson-math-001',
        currentNodeId: 'node-3',
        overallProgress: 75,
        lastActiveAt: new Date('2024-01-15T11:00:00'),
        nodeProgress: [
            {
                nodeId: 'node-1',
                completed: true,
                score: 90,
                completedAt: new Date('2024-01-15T09:10:00'),
                startedAt: new Date('2024-01-15T09:00:00'),
                timeSpent: 600,
                retryCount: 0,
            },
            {
                nodeId: 'node-2',
                completed: true,
                score: 88,
                completedAt: new Date('2024-01-15T09:30:00'),
                startedAt: new Date('2024-01-15T09:12:00'),
                timeSpent: 1080, // 18分鐘
                retryCount: 0,
                passedCheckpoint: true,
                pathTaken: 'learned',
            },
            {
                nodeId: 'node-3',
                completed: false,
                startedAt: new Date('2024-01-15T09:35:00'),
                timeSpent: 600,
            },
        ],
    },
    {
        studentId: 'student-3',
        studentName: '王小美',
        lessonId: 'lesson-math-001',
        currentNodeId: 'node-4',
        overallProgress: 95,
        lastActiveAt: new Date('2024-01-15T12:00:00'),
        nodeProgress: [
            {
                nodeId: 'node-1',
                completed: true,
                score: 95,
                completedAt: new Date('2024-01-15T09:08:00'),
                startedAt: new Date('2024-01-15T09:00:00'),
                timeSpent: 480,
                retryCount: 0,
            },
            {
                nodeId: 'node-2',
                completed: true,
                score: 92,
                completedAt: new Date('2024-01-15T09:25:00'),
                startedAt: new Date('2024-01-15T09:10:00'),
                timeSpent: 900,
                retryCount: 0,
                passedCheckpoint: true,
                pathTaken: 'learned',
            },
            {
                nodeId: 'node-3',
                completed: true,
                score: 90,
                completedAt: new Date('2024-01-15T10:00:00'),
                startedAt: new Date('2024-01-15T09:30:00'),
                timeSpent: 1800,
                retryCount: 0,
            },
            {
                nodeId: 'node-4',
                completed: false,
                startedAt: new Date('2024-01-15T10:05:00'),
                timeSpent: 300,
            },
        ],
    },
];

// ==================== 差異化課程的學生進度資料 ====================
// 對應 MOCK_DIFFERENTIATED_LESSON

export const MOCK_DIFFERENTIATED_STUDENT_PROGRESS: StudentProgress[] = [
    {
        studentId: 'student-1',
        studentName: '張小明',
        lessonId: 'lesson-math-002',
        currentNodeId: 'step3',
        overallProgress: 60,
        lastActiveAt: new Date('2024-01-15T10:20:00'),
        nodeProgress: [
            {
                nodeId: 'step1',
                completed: true,
                score: 85,
                completedAt: new Date('2024-01-15T09:08:00'),
                startedAt: new Date('2024-01-15T09:00:00'),
                timeSpent: 480,
                retryCount: 0,
            },
            {
                nodeId: 'step2-video', // 選擇了影片方式學習
                completed: true,
                score: 90,
                completedAt: new Date('2024-01-15T09:18:00'),
                startedAt: new Date('2024-01-15T09:10:00'),
                timeSpent: 480,
                retryCount: 0,
            },
            {
                nodeId: 'step3',
                completed: false,
                startedAt: new Date('2024-01-15T09:20:00'),
                timeSpent: 300, // 進行中
            },
        ],
    },
    {
        studentId: 'student-2',
        studentName: '李小華',
        lessonId: 'lesson-math-002',
        currentNodeId: 'step5',
        overallProgress: 75,
        lastActiveAt: new Date('2024-01-15T11:00:00'),
        nodeProgress: [
            {
                nodeId: 'step1',
                completed: true,
                score: 95,
                completedAt: new Date('2024-01-15T09:06:00'),
                startedAt: new Date('2024-01-15T09:00:00'),
                timeSpent: 360,
                retryCount: 0,
            },
            {
                nodeId: 'step2-game', // 選擇了遊戲方式學習
                completed: true,
                score: 92,
                completedAt: new Date('2024-01-15T09:16:00'),
                startedAt: new Date('2024-01-15T09:08:00'),
                timeSpent: 480,
                retryCount: 0,
            },
            {
                nodeId: 'step3',
                completed: true,
                score: 88,
                completedAt: new Date('2024-01-15T09:28:00'),
                startedAt: new Date('2024-01-15T09:18:00'),
                timeSpent: 600,
                retryCount: 0,
            },
            {
                nodeId: 'step4-test',
                completed: true,
                score: 85,
                completedAt: new Date('2024-01-15T09:45:00'),
                startedAt: new Date('2024-01-15T09:30:00'),
                timeSpent: 900,
                retryCount: 0,
                passedCheckpoint: true,
                pathTaken: 'learned',
            },
            {
                nodeId: 'step5',
                completed: false,
                startedAt: new Date('2024-01-15T09:50:00'),
                timeSpent: 420,
            },
        ],
    },
    {
        studentId: 'student-3',
        studentName: '王小美',
        lessonId: 'lesson-math-002',
        currentNodeId: 'remedial-test',
        overallProgress: 45,
        lastActiveAt: new Date('2024-01-15T10:30:00'),
        nodeProgress: [
            {
                nodeId: 'step1',
                completed: true,
                score: 78,
                completedAt: new Date('2024-01-15T09:12:00'),
                startedAt: new Date('2024-01-15T09:00:00'),
                timeSpent: 720,
                retryCount: 0,
            },
            {
                nodeId: 'step2-reading', // 選擇了閱讀方式學習
                completed: true,
                score: 80,
                completedAt: new Date('2024-01-15T09:25:00'),
                startedAt: new Date('2024-01-15T09:15:00'),
                timeSpent: 600,
                retryCount: 0,
            },
            {
                nodeId: 'step3',
                completed: true,
                score: 72,
                completedAt: new Date('2024-01-15T09:40:00'),
                startedAt: new Date('2024-01-15T09:28:00'),
                timeSpent: 720,
                retryCount: 1,
            },
            {
                nodeId: 'step4-test',
                completed: true,
                score: 65, // 未達 80 分，進入補救
                completedAt: new Date('2024-01-15T10:00:00'),
                startedAt: new Date('2024-01-15T09:45:00'),
                timeSpent: 900,
                retryCount: 0,
                passedCheckpoint: false,
                pathTaken: 'remedial',
            },
            {
                nodeId: 'remedial1',
                completed: true,
                score: 85,
                completedAt: new Date('2024-01-15T10:20:00'),
                startedAt: new Date('2024-01-15T10:05:00'),
                timeSpent: 900,
                retryCount: 0,
            },
            {
                nodeId: 'remedial-test',
                completed: false,
                startedAt: new Date('2024-01-15T10:25:00'),
                timeSpent: 300, // 進行中
            },
        ],
    },
    {
        studentId: 'student-4',
        studentName: '陳小強',
        lessonId: 'lesson-math-002',
        currentNodeId: 'finish',
        overallProgress: 100,
        lastActiveAt: new Date('2024-01-15T12:00:00'),
        nodeProgress: [
            {
                nodeId: 'step1',
                completed: true,
                score: 100,
                completedAt: new Date('2024-01-15T09:05:00'),
                startedAt: new Date('2024-01-15T09:00:00'),
                timeSpent: 300,
                retryCount: 0,
            },
            {
                nodeId: 'step2-video',
                completed: true,
                score: 98,
                completedAt: new Date('2024-01-15T09:12:00'),
                startedAt: new Date('2024-01-15T09:06:00'),
                timeSpent: 360,
                retryCount: 0,
            },
            {
                nodeId: 'step3',
                completed: true,
                score: 95,
                completedAt: new Date('2024-01-15T09:22:00'),
                startedAt: new Date('2024-01-15T09:14:00'),
                timeSpent: 480,
                retryCount: 0,
            },
            {
                nodeId: 'step4-test',
                completed: true,
                score: 92,
                completedAt: new Date('2024-01-15T09:35:00'),
                startedAt: new Date('2024-01-15T09:25:00'),
                timeSpent: 600,
                retryCount: 0,
                passedCheckpoint: true,
                pathTaken: 'learned',
            },
            {
                nodeId: 'step5',
                completed: true,
                score: 90,
                completedAt: new Date('2024-01-15T09:50:00'),
                startedAt: new Date('2024-01-15T09:38:00'),
                timeSpent: 720,
                retryCount: 0,
            },
            {
                nodeId: 'step6',
                completed: true,
                score: 88,
                completedAt: new Date('2024-01-15T10:05:00'),
                startedAt: new Date('2024-01-15T09:52:00'),
                timeSpent: 780,
                retryCount: 0,
            },
            {
                nodeId: 'step7',
                completed: true,
                score: 85,
                completedAt: new Date('2024-01-15T10:25:00'),
                startedAt: new Date('2024-01-15T10:08:00'),
                timeSpent: 1020,
                retryCount: 0,
                passedCheckpoint: true,
                pathTaken: 'learned',
            },
            {
                nodeId: 'finish',
                completed: true,
                score: 100,
                completedAt: new Date('2024-01-15T10:28:00'),
                startedAt: new Date('2024-01-15T10:27:00'),
                timeSpent: 60,
                retryCount: 0,
            },
        ],
    },
];
