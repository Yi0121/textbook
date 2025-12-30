/**
 * 路由配置
 * 
 * 使用 React.lazy() 實現路由級別 Code Splitting
 */

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AppLayout from './components/layout/AppLayout';
import { PageLoader } from './components/ui/LoadingSpinner';

// ==================== Lazy Loaded Pages ====================

const HomePage = lazy(() => import('./pages/HomePage'));
const ClassroomPage = lazy(() => import('./pages/ClassroomPage'));
const LessonPrepPage = lazy(() => import('./pages/LessonPrepPage'));
const TeachingSuggestionsPage = lazy(() => import('./pages/TeachingSuggestionsPage'));
const LearningSuggestionsPage = lazy(() => import('./pages/LearningSuggestionsPage'));
const MyConversationsPage = lazy(() => import('./pages/MyConversationsPage'));
const ClassAnalyticsPage = lazy(() => import('./pages/ClassAnalyticsPage'));
const LessonPrepPreviewPage = lazy(() => import('./pages/LessonPrepPreviewPage'));
const LessonPrepChatPage = lazy(() => import('./pages/LessonPrepChatPage'));
const StudentLearningPathPage = lazy(() => import('./pages/StudentLearningPathPage'));
const LessonProgressDashboard = lazy(() => import('./pages/LessonProgressDashboard'));
const TeacherStudentOverviewPage = lazy(() => import('./pages/TeacherStudentOverviewPage'));
const TeacherClassSetupPage = lazy(() => import('./pages/TeacherClassSetupPage'));
const StudentAnalyticsPage = lazy(() => import('./pages/StudentAnalyticsPage'));
import ComingSoonPage from './pages/ComingSoonPage';

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
        path: '/teacher/lesson-prep/preview/:lessonId',
        element: withSuspense(LessonPrepPreviewPage),
    },
    // 對話式備課（獨立於 AppLayout）
    {
        path: '/teacher/lesson-prep/chat',
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

            // ==================== 教師端路由 /teacher/* ====================
            {
                path: 'teacher/classroom',
                element: withSuspense(ClassroomPage),
            },
            {
                path: 'teacher/lesson-prep',
                element: withSuspense(LessonPrepPage),
            },
            {
                path: 'teacher/suggestions',
                element: withSuspense(TeachingSuggestionsPage),
            },
            {
                path: 'teacher/class-analytics',
                element: withSuspense(ClassAnalyticsPage),
            },
            {
                path: 'teacher/class-setup',
                element: withSuspense(TeacherClassSetupPage),
            },
            {
                path: 'teacher/lesson-progress/:lessonId',
                element: withSuspense(LessonProgressDashboard),
            },
            {
                path: 'teacher/student-overview/:lessonId/:studentId',
                element: withSuspense(TeacherStudentOverviewPage),
            },
            {
                path: 'teacher/student-detail/:lessonId/:studentId',
                element: withSuspense(StudentAnalyticsPage),
            },

            // ==================== 學生端路由 /student/* ====================
            {
                path: 'student/dashboard',
                element: withSuspense(StudentAnalyticsPage),
            },
            {
                path: 'student/conversations',
                element: withSuspense(MyConversationsPage),
            },
            {
                path: 'student/suggestions',
                element: withSuspense(LearningSuggestionsPage),
            },
            {
                path: 'student/path/:lessonId',
                element: withSuspense(StudentLearningPathPage),
            },
            // ==================== Legacy Redirects & 404 ====================
            {
                path: 'lesson-prep',
                element: <Navigate to="/teacher/lesson-prep" replace />,
            },
            {
                path: 'class',
                element: <Navigate to="/teacher/classroom" replace />,
            },
            {
                path: '*',
                element: <Navigate to="/" replace />,
            },
            {
                path: 'assignments',
                element: <ComingSoonPage title="作業管理" description="發布、批改與檢討作業的功能即將上線。" />,
            },
            {
                path: 'groups',
                element: <ComingSoonPage title="分組協作" description="小組討論、分組任務與即時協作功能正在建置中。" />,
            },
        ],
    },
]);

