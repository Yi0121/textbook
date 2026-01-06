/**
 * Data Fetching Hooks Barrel Export
 */

// Student Hooks
export {
    useStudentRecords,
    useStudentRecord,
    useStudentNames,
    studentKeys,
} from './useStudentRecords';

// Lesson Hooks
export {
    useLessons,
    useLesson,
    lessonKeys,
} from './useLessonData';

// Student Progress Hooks
export {
    useStudentProgressByLesson,
    useStudentProgressByStudent,
    useStudentLessonProgress,
    studentProgressKeys,
} from './useStudentProgress';

// Analytics Hooks
export {
    useAllStudentsAnalytics,
    useStudentAnalytics,
    useClassAnalytics,
    useStudentConversations,
    analyticsKeys,
} from './useAnalytics';

// Student Logs Hooks
export {
    useStudentLogs,
    useFlaggedStudentLogs,
    studentLogKeys,
} from './useStudentLogs';

// Lesson Editor Hooks
export {
    useLessonEditor,
    useNewLessonEditor,
    type LessonEditorState,
    type LessonEditorActions,
} from './useLessonEditor';
