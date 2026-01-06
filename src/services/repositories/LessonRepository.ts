/**
 * LessonRepository
 * 
 * 課程資料存取抽象層，支援 Mock 與 API 切換
 */

import type { LessonPlan } from '../../types';
import {
    MOCK_DIFFERENTIATED_LESSON,
    ALGEBRA_APOS_LESSON,
    ARITHMETIC_APOS_LESSON,
    GEOMETRY_APOS_LESSON,
} from '../../mocks';
import { getCurrentDataSource } from './types';

// ==================== Repository Interface ====================

export interface ILessonRepository {
    getLessonById(lessonId: string): Promise<LessonPlan | null>;
    getAllLessons(): Promise<LessonPlan[]>;
}

// ==================== Mock Data ====================

const MOCK_LESSONS: Record<string, LessonPlan> = {
    'differentiated-lesson': MOCK_DIFFERENTIATED_LESSON,
    'lesson-math-002': MOCK_DIFFERENTIATED_LESSON, // alias
    'algebra-apos': ALGEBRA_APOS_LESSON,
    'arithmetic-apos': ARITHMETIC_APOS_LESSON,
    'geometry-apos': GEOMETRY_APOS_LESSON,
};

// ==================== Mock Implementation ====================

class MockLessonRepository implements ILessonRepository {
    async getLessonById(lessonId: string): Promise<LessonPlan | null> {
        await new Promise(resolve => setTimeout(resolve, 100));
        return MOCK_LESSONS[lessonId] ?? null;
    }

    async getAllLessons(): Promise<LessonPlan[]> {
        await new Promise(resolve => setTimeout(resolve, 100));
        return Object.values(MOCK_LESSONS);
    }
}

// ==================== API Implementation (Placeholder) ====================

class ApiLessonRepository implements ILessonRepository {
    async getLessonById(lessonId: string): Promise<LessonPlan | null> {
        // TODO: 實作 API 串接
        // const response = await apiClient.get<LessonPlan>(`/lessons/${lessonId}`);
        // return response.data;
        throw new Error(`API not implemented for lessonId: ${lessonId}`);
    }

    async getAllLessons(): Promise<LessonPlan[]> {
        throw new Error('API not implemented');
    }
}

// ==================== Factory ====================

export function createLessonRepository(): ILessonRepository {
    const dataSource = getCurrentDataSource();
    return dataSource === 'mock'
        ? new MockLessonRepository()
        : new ApiLessonRepository();
}

// ==================== Singleton ====================

let _instance: ILessonRepository | null = null;

export function getLessonRepository(): ILessonRepository {
    if (!_instance) {
        _instance = createLessonRepository();
    }
    return _instance;
}
