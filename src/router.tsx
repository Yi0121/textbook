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
const TeacherClassroomPage = lazy(() => import('./pages/TeacherClassroomPage'));
const TeacherLessonPrepPage = lazy(() => import('./pages/TeacherLessonPrepPage'));
const TeachingSuggestionsPage = lazy(() => import('./pages/TeachingSuggestionsPage'));
const StudentSuggestionsPage = lazy(() => import('./pages/StudentSuggestionsPage'));
const StudentConversationsPage = lazy(() => import('./pages/StudentConversationsPage'));
const TeacherClassAnalyticsPage = lazy(() => import('./pages/TeacherClassAnalyticsPage'));
const TeacherLessonFlowPage = lazy(() => import('./pages/TeacherLessonFlowPage'));
const TeacherLessonChatPage = lazy(() => import('./pages/TeacherLessonChatPage'));
const StudentLearningPathPage = lazy(() => import('./pages/StudentLearningPathPage'));
const TeacherLessonProgressPage = lazy(() => import('./pages/TeacherLessonProgressPage'));
const TeacherAssignmentPage = lazy(() => import('./pages/TeacherAssignmentPage'));
const TeacherStudentOverviewPage = lazy(() => import('./pages/TeacherStudentOverviewPage'));
const TeacherClassSetupPage = lazy(() => import('./pages/TeacherClassSetupPage'));
const StudentAnalyticsPage = lazy(() => import('./pages/StudentAnalyticsPage'));
const StudentQuizPage = lazy(() => import('./pages/StudentQuizPage'));
const TeacherGroupMonitorPage = lazy(() => import('./pages/TeacherGroupMonitorPage'));
const CPSStudentView = lazy(() => import('./pages/CPSStudentView'));
const TeacherDivisionExplorationMonitor = lazy(() => import('./pages/TeacherDivisionExplorationMonitor.tsx'));
const TeacherDivisionExplorationAdvanced = lazy(() => import('./pages/TeacherDivisionExplorationAdvanced'));
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
        element: withSuspense(TeacherLessonFlowPage),
    },
    // 對話式備課（獨立於 AppLayout）
    {
        path: '/teacher/lesson-prep/chat',
        element: withSuspense(TeacherLessonChatPage),
    },
    // 標準布局頁面
    {
        path: '/student/cps-view',
        element: withSuspense(CPSStudentView),
    },
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
                element: withSuspense(TeacherClassroomPage),
            },
            {
                path: 'teacher/lesson-prep',
                element: withSuspense(TeacherLessonPrepPage),
            },
            {
                path: 'teacher/assignment',
                element: withSuspense(TeacherAssignmentPage),
            },
            {
                path: 'teacher/suggestions',
                element: withSuspense(TeachingSuggestionsPage),
            },
            {
                path: 'teacher/class-analytics',
                element: withSuspense(TeacherClassAnalyticsPage),
            },
            {
                path: 'teacher/class-setup',
                element: withSuspense(TeacherClassSetupPage),
            },
            {
                path: 'teacher/lesson-progress/:lessonId',
                element: withSuspense(TeacherLessonProgressPage),
            },
            {
                path: 'teacher/student-overview/:lessonId/:studentId',
                element: withSuspense(TeacherStudentOverviewPage),
            },
            {
                path: 'teacher/student-detail/:lessonId/:studentId',
                element: withSuspense(StudentAnalyticsPage),
            },
            {
                path: 'teacher/groups',
                element: withSuspense(TeacherGroupMonitorPage),
            },
            {
                path: 'teacher/division-exploration-monitor',
                element: withSuspense(TeacherDivisionExplorationMonitor),
            },
            {
                path: 'teacher/division-exploration-advanced',
                element: withSuspense(TeacherDivisionExplorationAdvanced),
            },

            // ==================== 學生端路由 /student/* ====================
            {
                path: 'student/dashboard',
                element: withSuspense(StudentAnalyticsPage),
            },
            {
                path: 'student/conversations',
                element: withSuspense(StudentConversationsPage),
            },
            {
                path: 'student/suggestions',
                element: withSuspense(StudentSuggestionsPage),
            },
            {
                path: 'student/path/:lessonId',
                element: withSuspense(StudentLearningPathPage),
            },
            {
                path: 'student/quiz/:assignmentId',
                element: withSuspense(StudentQuizPage),
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
                path: 'materials',
                element: <ComingSoonPage title="教材庫" description="教學資源與素材庫即將上線。" />,
            },
            {
                path: 'settings',
                element: <ComingSoonPage title="設定" description="個人設定與偏好設置即將上線。" />,
            },
            {
                path: 'assignments',
                element: <ComingSoonPage title="作業管理" description="發布、批改與檢討作業的功能即將上線。" />,
            },
            {
                path: '*',
                element: <Navigate to="/" replace />,
            },
        ],
    },
]);
