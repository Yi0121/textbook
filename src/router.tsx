/**
 * 路由配置
 * 
 * 使用 React.lazy() 實現路由級別 Code Splitting
 */

import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AppLayout from './components/layout/AppLayout';
import { PageLoader } from './components/ui/LoadingSpinner';

// ==================== Lazy Loaded Pages ====================

const HomePage = lazy(() => import('./pages/HomePage'));
const ClassroomPage = lazy(() => import('./pages/ClassroomPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LessonPrepPage = lazy(() => import('./pages/LessonPrepPage'));
const TeachingSuggestionsPage = lazy(() => import('./pages/TeachingSuggestionsPage'));
const LearningSuggestionsPage = lazy(() => import('./pages/LearningSuggestionsPage'));
const MyLearningPathPage = lazy(() => import('./pages/MyLearningPathPage'));
const MyConversationsPage = lazy(() => import('./pages/MyConversationsPage'));
const ClassAnalyticsPage = lazy(() => import('./pages/ClassAnalyticsPage'));
const StudentAnalyticsPage = lazy(() => import('./pages/StudentAnalyticsPage'));
const LessonPrepPreviewPage = lazy(() => import('./pages/LessonPrepPreviewPage'));
const LessonPrepChatPage = lazy(() => import('./pages/LessonPrepChatPage'));
const StudentLearningPathPage = lazy(() => import('./pages/StudentLearningPathPage'));
const LessonProgressDashboard = lazy(() => import('./pages/LessonProgressDashboard'));
const StudentDetailProgressPage = lazy(() => import('./pages/StudentDetailProgressPage'));
const TeacherClassSetupPage = lazy(() => import('./pages/TeacherClassSetupPage'));
const StudentProgressPage = lazy(() => import('./pages/StudentProgressPage'));

// ...



// ==================== Suspense Wrapper ====================

function withSuspense(Component: React.LazyExoticComponent<React.ComponentType>) {
    return (
        <Suspense fallback={<PageLoader />}>
            <Component />
        </Suspense>
    );
}

// ==================== Router ====================

export const router = createBrowserRouter([
    // 全螢幕編輯器（獨立於 AppLayout）
    {
        path: '/lesson-prep/preview',
        element: withSuspense(LessonPrepPreviewPage),
    },
    // 對話式備課（獨立於 AppLayout）
    {
        path: '/lesson-prep/chat',
        element: withSuspense(LessonPrepChatPage),
    },
    // 標準布局頁面
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: withSuspense(HomePage),
            },
            {
                path: 'class',
                element: withSuspense(ClassroomPage),
            },
            {
                path: 'dashboard',
                element: withSuspense(DashboardPage),
            },
            {
                path: 'lesson-prep',
                element: withSuspense(LessonPrepPage),
            },
            {
                path: 'teaching-suggestions',
                element: withSuspense(TeachingSuggestionsPage),
            },
            {
                path: 'learning-suggestions',
                element: withSuspense(LearningSuggestionsPage),
            },
            // 學生端新增
            {
                path: 'my-path',
                element: withSuspense(MyLearningPathPage),
            },
            {
                path: 'my-conversations',
                element: withSuspense(MyConversationsPage),
            },
            // 老師端分析
            {
                path: 'analytics/class',
                element: withSuspense(ClassAnalyticsPage),
            },
            {
                path: 'analytics/student/:id',
                element: withSuspense(StudentAnalyticsPage),
            },
            // 學生學習路徑
            {
                path: 'student/learning-path',
                element: withSuspense(StudentLearningPathPage),
            },
            // 教師課程監控
            {
                path: 'teacher/lesson-progress/:lessonId',
                element: withSuspense(LessonProgressDashboard),
            },
            {
                path: 'teacher/student-progress/:lessonId/:studentId',
                element: withSuspense(StudentDetailProgressPage),
            },
            // 老師端單元選擇
            {
                path: 'teacher/start-class',
                element: withSuspense(TeacherClassSetupPage),
            },
            // 學生端進度
            {
                path: 'progress',
                element: withSuspense(StudentProgressPage),
            },
        ],
    },
]);

