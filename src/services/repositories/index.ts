/**
 * Repositories Barrel Export
 */

// Types
export * from './types';

// Repositories
export {
    getStudentRepository,
    createStudentRepository,
    type IStudentRepository,
} from './StudentRepository';

export {
    getLessonRepository,
    createLessonRepository,
    type ILessonRepository,
} from './LessonRepository';

export {
    getStudentProgressRepository,
    createStudentProgressRepository,
    type IStudentProgressRepository,
} from './StudentProgressRepository';

export {
    getAnalyticsRepository,
    createAnalyticsRepository,
    type IAnalyticsRepository,
} from './AnalyticsRepository';

export {
    getStudentLogRepository,
    createStudentLogRepository,
    type IStudentLogRepository,
    type StudentLog,
} from './StudentLogRepository';
