/**
 * 學習分析資料型別與 Mock 資料
 * 
 * 包含三大數據來源：
 * - 對話紀錄 (Conversations)
 * - 操作紀錄 (Operations)
 * - 測驗紀錄 (Quizzes)
 */

// ==================== 基礎型別 ====================

export interface StudentBasicInfo {
    id: string;
    name: string;
    class: string;
    avatar?: string;
}

// ==================== 對話紀錄 ====================

export interface ConversationMessage {
    role: 'student' | 'ai';
    content: string;
    timestamp: number;
}

export interface ConversationRecord {
    id: string;
    date: string;
    topic: string;
    messages: ConversationMessage[];
    aiAnalysis: {
        understanding: number;    // 0-100
        engagement: number;        // 0-100
        keyInsight: string;
    };
    duration: number;  // 分鐘
}

// ==================== 操作紀錄 ====================

export interface PageView {
    page: string;
    duration: number;  // 秒
    timestamp: number;
}

export interface ActionLog {
    action: string;
    target: string;
    timestamp: number;
    count: number;
}

export interface OperationRecords {
    totalTime: number;          // 總學習時間 (分鐘)
    sessionCount: number;       // 學習次數
    avgSessionDuration: number; // 平均每次時長
    focusScore: number;         // 專注度 0-100
    pageViews: PageView[];
    actions: ActionLog[];
    dailyActivity: {
        date: string;
        minutes: number;
    }[];
}

// ==================== 測驗紀錄 ====================

export interface QuizQuestion {
    id: string;
    question: string;
    correct: boolean;
    knowledgePoint: string;
    studentAnswer?: string;
    correctAnswer?: string;
}

export interface QuizAttempt {
    id: string;
    quizName: string;
    date: string;
    score: number;
    totalQuestions: number;
    correctCount: number;
    timeSpent: number;  // 分鐘
    questions: QuizQuestion[];
}

export interface KnowledgePoint {
    id: string;
    name: string;
    mastery: number;  // 0-100
    attempts: number;
    lastAttempt: string;
}

export interface QuizRecords {
    averageScore: number;
    totalAttempts: number;
    attempts: QuizAttempt[];
    knowledgeMastery: KnowledgePoint[];
    weakPoints: {
        point: string;
        errorRate: number;
        count: number;
    }[];
}

// ==================== 完整學生分析資料 ====================

export interface StudentAnalyticsData extends StudentBasicInfo {
    // 總覽統計
    overallProgress: number;
    overallScore: number;
    totalLearningTime: number;
    lastActive: string;
    status: 'excellent' | 'good' | 'warning' | 'danger';

    // 三大資料來源
    conversations: ConversationRecord[];
    operations: OperationRecords;
    quizzes: QuizRecords;
}

// ==================== 班級分析資料 ====================

export interface ClassAnalyticsData {
    className: string;
    courseName: string;
    totalStudents: number;

    // 總覽統計
    averageProgress: number;
    averageScore: number;
    averageLearningTime: number;

    // 對話統計
    conversationStats: {
        totalConversations: number;
        averagePerStudent: number;
        hotTopics: { topic: string; count: number }[];
        aiUsageRate: number;  // 百分比
    };

    // 操作統計
    operationStats: {
        avgSessionDuration: number;
        avgFocusScore: number;
        popularFeatures: { feature: string; usage: number }[];
        activityHeatmap: { day: string; hour: number; count: number }[];
    };

    // 測驗統計
    quizStats: {
        averageScore: number;
        scoreDistribution: { range: string; count: number }[];
        classWeakPoints: { point: string; errorRate: number }[];
        passRate: number;
    };

    // 學生列表
    students: StudentAnalyticsData[];
}

// ==================== Mock 資料 ====================

export const MOCK_STUDENTS: StudentAnalyticsData[] = [
    {
        id: '1',
        name: '王小明',
        class: '五年級 A 班',
        overallProgress: 100,
        overallScore: 92,
        totalLearningTime: 245,
        lastActive: '2024-12-23',
        status: 'excellent',
        conversations: [
            {
                id: 'conv-1',
                date: '2024-12-23',
                topic: '除法餘數',
                messages: [
                    { role: 'student', content: '老師，17除以5等於多少？', timestamp: Date.now() - 3600000 },
                    { role: 'ai', content: '17 ÷ 5 = 3 餘 2。商是3，餘數是2。讓我用糖果來舉例...', timestamp: Date.now() - 3500000 },
                    { role: 'student', content: '所以餘數就是剩下的嗎？', timestamp: Date.now() - 3400000 },
                    { role: 'ai', content: '沒錯！餘數就是除不盡剩下來的部分。', timestamp: Date.now() - 3300000 },
                ],
                aiAnalysis: { understanding: 85, engagement: 90, keyInsight: '學生能夠主動提問，顯示良好的學習態度' },
                duration: 8,
            },
            {
                id: 'conv-2',
                date: '2024-12-22',
                topic: '運算順序',
                messages: [
                    { role: 'student', content: '2 + 3 × 4 等於多少？', timestamp: Date.now() - 86400000 },
                    { role: 'ai', content: '記住先乘除後加減！先算 3 × 4 = 12，再算 2 + 12 = 14', timestamp: Date.now() - 86300000 },
                ],
                aiAnalysis: { understanding: 78, engagement: 85, keyInsight: '需要加強運算順序的練習' },
                duration: 5,
            },
        ],
        operations: {
            totalTime: 245,
            sessionCount: 12,
            avgSessionDuration: 20,
            focusScore: 88,
            pageViews: [
                { page: '課程教材', duration: 3600, timestamp: Date.now() - 7200000 },
                { page: '練習題', duration: 2400, timestamp: Date.now() - 5400000 },
                { page: 'AI 家教', duration: 1800, timestamp: Date.now() - 3600000 },
            ],
            actions: [
                { action: '完成練習題', target: '加減法練習', timestamp: Date.now() - 5000000, count: 15 },
                { action: '觀看影片', target: '除法教學', timestamp: Date.now() - 4000000, count: 3 },
                { action: 'AI 對話', target: '數學問題', timestamp: Date.now() - 3000000, count: 8 },
            ],
            dailyActivity: [
                { date: '12/18', minutes: 25 },
                { date: '12/19', minutes: 18 },
                { date: '12/20', minutes: 32 },
                { date: '12/21', minutes: 15 },
                { date: '12/22', minutes: 28 },
                { date: '12/23', minutes: 22 },
            ],
        },
        quizzes: {
            averageScore: 92,
            totalAttempts: 4,
            attempts: [
                {
                    id: 'quiz-1',
                    quizName: '四則運算測驗',
                    date: '2024-12-23',
                    score: 95,
                    totalQuestions: 20,
                    correctCount: 19,
                    timeSpent: 15,
                    questions: [
                        { id: 'q1', question: '17 ÷ 5 = ?', correct: true, knowledgePoint: '除法餘數' },
                        { id: 'q2', question: '2 + 3 × 4 = ?', correct: false, knowledgePoint: '運算順序', studentAnswer: '20', correctAnswer: '14' },
                    ],
                },
                {
                    id: 'quiz-2',
                    quizName: '加減法測驗',
                    date: '2024-12-20',
                    score: 88,
                    totalQuestions: 15,
                    correctCount: 13,
                    timeSpent: 12,
                    questions: [],
                },
            ],
            knowledgeMastery: [
                { id: 'kp-1', name: '加法', mastery: 95, attempts: 20, lastAttempt: '2024-12-23' },
                { id: 'kp-2', name: '減法', mastery: 92, attempts: 18, lastAttempt: '2024-12-22' },
                { id: 'kp-3', name: '乘法', mastery: 85, attempts: 15, lastAttempt: '2024-12-21' },
                { id: 'kp-4', name: '除法', mastery: 78, attempts: 12, lastAttempt: '2024-12-23' },
                { id: 'kp-5', name: '運算順序', mastery: 72, attempts: 8, lastAttempt: '2024-12-22' },
            ],
            weakPoints: [
                { point: '運算順序', errorRate: 0.28, count: 4 },
                { point: '除法餘數', errorRate: 0.22, count: 3 },
            ],
        },
    },
    {
        id: '2',
        name: '李小華',
        class: '五年級 A 班',
        overallProgress: 88,
        overallScore: 85,
        totalLearningTime: 180,
        lastActive: '2024-12-23',
        status: 'good',
        conversations: [
            {
                id: 'conv-3',
                date: '2024-12-23',
                topic: '乘法表',
                messages: [
                    { role: 'student', content: '7 乘以 8 是多少？', timestamp: Date.now() - 7200000 },
                    { role: 'ai', content: '7 × 8 = 56。記憶口訣：七八五十六！', timestamp: Date.now() - 7100000 },
                ],
                aiAnalysis: { understanding: 80, engagement: 75, keyInsight: '乘法表背誦需加強' },
                duration: 3,
            },
        ],
        operations: {
            totalTime: 180,
            sessionCount: 9,
            avgSessionDuration: 20,
            focusScore: 75,
            pageViews: [],
            actions: [
                { action: '完成練習題', target: '乘法練習', timestamp: Date.now() - 5000000, count: 12 },
            ],
            dailyActivity: [
                { date: '12/20', minutes: 30 },
                { date: '12/21', minutes: 25 },
                { date: '12/22', minutes: 20 },
                { date: '12/23', minutes: 15 },
            ],
        },
        quizzes: {
            averageScore: 85,
            totalAttempts: 3,
            attempts: [],
            knowledgeMastery: [
                { id: 'kp-1', name: '加法', mastery: 90, attempts: 15, lastAttempt: '2024-12-22' },
                { id: 'kp-2', name: '減法', mastery: 88, attempts: 14, lastAttempt: '2024-12-21' },
                { id: 'kp-3', name: '乘法', mastery: 78, attempts: 12, lastAttempt: '2024-12-23' },
            ],
            weakPoints: [
                { point: '乘法表', errorRate: 0.22, count: 3 },
            ],
        },
    },
    {
        id: '3',
        name: '張小美',
        class: '五年級 A 班',
        overallProgress: 75,
        overallScore: 78,
        totalLearningTime: 120,
        lastActive: '2024-12-22',
        status: 'good',
        conversations: [
            {
                id: 'conv-4',
                date: '2024-12-22',
                topic: '無關對話',
                messages: [
                    { role: 'student', content: '今天午餐吃什麼好？', timestamp: Date.now() - 86400000 },
                    { role: 'ai', content: '我們現在正在學習數學喔！讓我們專注在四則運算上。你對今天的練習題有什麼問題嗎？', timestamp: Date.now() - 86350000 },
                    { role: 'student', content: '我朋友說她買了新手機', timestamp: Date.now() - 86300000 },
                    { role: 'ai', content: '新手機很有趣，不過現在讓我們回到數學課程。你完成今天的加減法練習了嗎？', timestamp: Date.now() - 86250000 },
                    { role: 'student', content: '還沒...數學好難', timestamp: Date.now() - 86200000 },
                    { role: 'ai', content: '我理解數學有時會有挑戰性。讓我們一起來看看哪個部分你覺得困難，我可以幫你！', timestamp: Date.now() - 86150000 },
                ],
                aiAnalysis: {
                    understanding: 25,
                    engagement: 30,
                    keyInsight: '學生注意力分散，頻繁偏離學習主題，需要引導回到課程內容'
                },
                duration: 6,
            },
            {
                id: 'conv-5',
                date: '2024-12-21',
                topic: '閒聊',
                messages: [
                    { role: 'student', content: '外面在下雨耶', timestamp: Date.now() - 172800000 },
                    { role: 'ai', content: '是的，今天天氣不太好。不過這也是在家好好學習的好機會！我們來做一些數學練習吧？', timestamp: Date.now() - 172750000 },
                    { role: 'student', content: '好無聊...', timestamp: Date.now() - 172700000 },
                ],
                aiAnalysis: {
                    understanding: 15,
                    engagement: 20,
                    keyInsight: '學生缺乏學習動機，AI 嘗試引導但未能有效建立課程互動'
                },
                duration: 2,
            },
        ],
        operations: {
            totalTime: 120,
            sessionCount: 6,
            avgSessionDuration: 20,
            focusScore: 70,
            pageViews: [],
            actions: [],
            dailyActivity: [
                { date: '12/20', minutes: 20 },
                { date: '12/21', minutes: 25 },
                { date: '12/22', minutes: 22 },
            ],
        },
        quizzes: {
            averageScore: 78,
            totalAttempts: 2,
            attempts: [],
            knowledgeMastery: [],
            weakPoints: [],
        },
    },
    {
        id: '4',
        name: '陳小強',
        class: '五年級 A 班',
        overallProgress: 50,
        overallScore: 62,
        totalLearningTime: 65,
        lastActive: '2024-12-21',
        status: 'warning',
        conversations: [],
        operations: {
            totalTime: 65,
            sessionCount: 4,
            avgSessionDuration: 16,
            focusScore: 55,
            pageViews: [],
            actions: [],
            dailyActivity: [
                { date: '12/19', minutes: 15 },
                { date: '12/21', minutes: 20 },
            ],
        },
        quizzes: {
            averageScore: 62,
            totalAttempts: 2,
            attempts: [],
            knowledgeMastery: [],
            weakPoints: [
                { point: '除法', errorRate: 0.45, count: 5 },
                { point: '乘法', errorRate: 0.35, count: 4 },
            ],
        },
    },
    {
        id: '5',
        name: '林小芬',
        class: '五年級 A 班',
        overallProgress: 38,
        overallScore: 55,
        totalLearningTime: 40,
        lastActive: '2024-12-20',
        status: 'danger',
        conversations: [],
        operations: {
            totalTime: 40,
            sessionCount: 3,
            avgSessionDuration: 13,
            focusScore: 45,
            pageViews: [],
            actions: [],
            dailyActivity: [
                { date: '12/18', minutes: 15 },
                { date: '12/20', minutes: 12 },
            ],
        },
        quizzes: {
            averageScore: 55,
            totalAttempts: 1,
            attempts: [],
            knowledgeMastery: [],
            weakPoints: [
                { point: '四則運算', errorRate: 0.50, count: 6 },
            ],
        },
    },
];

export const MOCK_CLASS_ANALYTICS: ClassAnalyticsData = {
    className: '五年級 A 班',
    courseName: '四則運算',
    totalStudents: 32,
    averageProgress: 68,
    averageScore: 75,
    averageLearningTime: 130,

    conversationStats: {
        totalConversations: 156,
        averagePerStudent: 4.9,
        hotTopics: [
            { topic: '除法餘數', count: 28 },
            { topic: '運算順序', count: 22 },
            { topic: '乘法表', count: 18 },
            { topic: '分數運算', count: 15 },
        ],
        aiUsageRate: 78,
    },

    operationStats: {
        avgSessionDuration: 18,
        avgFocusScore: 72,
        popularFeatures: [
            { feature: '練習題', usage: 85 },
            { feature: 'AI 家教', usage: 65 },
            { feature: '教學影片', usage: 58 },
            { feature: '互動遊戲', usage: 42 },
        ],
        activityHeatmap: [
            { day: '週一', hour: 16, count: 25 },
            { day: '週二', hour: 19, count: 32 },
            { day: '週三', hour: 15, count: 28 },
            { day: '週四', hour: 20, count: 35 },
            { day: '週五', hour: 16, count: 22 },
            { day: '週六', hour: 10, count: 45 },
            { day: '週日', hour: 14, count: 38 },
        ],
    },

    quizStats: {
        averageScore: 75,
        scoreDistribution: [
            { range: '90-100', count: 5 },
            { range: '80-89', count: 8 },
            { range: '70-79', count: 10 },
            { range: '60-69', count: 6 },
            { range: '< 60', count: 3 },
        ],
        classWeakPoints: [
            { point: '運算順序', errorRate: 0.32 },
            { point: '除法餘數', errorRate: 0.28 },
            { point: '乘法表', errorRate: 0.22 },
        ],
        passRate: 84,
    },

    students: MOCK_STUDENTS,
};
