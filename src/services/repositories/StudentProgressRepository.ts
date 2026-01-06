/**
 * StudentProgressRepository
 * 
 * 學生進度資料存取抽象層
 */

import type { StudentProgress } from '../../types/studentProgress';
import { MOCK_DIFFERENTIATED_STUDENT_PROGRESS } from '../../mocks';
import { getCurrentDataSource } from './types';

// ==================== Repository Interface ====================

export interface IStudentProgressRepository {
    getProgressByLessonId(lessonId: string): Promise<StudentProgress[]>;
    getProgressByStudentId(studentId: string): Promise<StudentProgress[]>;
    getStudentProgressInLesson(lessonId: string, studentId: string): Promise<StudentProgress | null>;
}

// ==================== Mock Implementation ====================

class MockStudentProgressRepository implements IStudentProgressRepository {
    async getProgressByLessonId(lessonId: string): Promise<StudentProgress[]> {
        await new Promise(resolve => setTimeout(resolve, 100));
        return MOCK_DIFFERENTIATED_STUDENT_PROGRESS.filter(p => p.lessonId === lessonId);
    }

    async getProgressByStudentId(studentId: string): Promise<StudentProgress[]> {
        await new Promise(resolve => setTimeout(resolve, 100));
        return MOCK_DIFFERENTIATED_STUDENT_PROGRESS.filter(p => p.studentId === studentId);
    }

    async getStudentProgressInLesson(lessonId: string, studentId: string): Promise<StudentProgress | null> {
        await new Promise(resolve => setTimeout(resolve, 100));
        return MOCK_DIFFERENTIATED_STUDENT_PROGRESS.find(
            p => p.lessonId === lessonId && p.studentId === studentId
        ) ?? null;
    }
}

// ==================== API Implementation (Placeholder) ====================

class ApiStudentProgressRepository implements IStudentProgressRepository {
    async getProgressByLessonId(_lessonId: string): Promise<StudentProgress[]> {
        throw new Error('API not implemented');
    }

    async getProgressByStudentId(_studentId: string): Promise<StudentProgress[]> {
        throw new Error('API not implemented');
    }

    async getStudentProgressInLesson(_lessonId: string, _studentId: string): Promise<StudentProgress | null> {
        throw new Error('API not implemented');
    }
}

// ==================== Factory ====================

export function createStudentProgressRepository(): IStudentProgressRepository {
    const dataSource = getCurrentDataSource();
    return dataSource === 'mock'
        ? new MockStudentProgressRepository()
        : new ApiStudentProgressRepository();
}

let _instance: IStudentProgressRepository | null = null;

export function getStudentProgressRepository(): IStudentProgressRepository {
    if (!_instance) {
        _instance = createStudentProgressRepository();
    }
    return _instance;
}
