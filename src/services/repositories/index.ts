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
