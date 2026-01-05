/**
 * useLessonData
 * 
 * TanStack Query hook for fetching lesson data
 */

import { useQuery } from '@tanstack/react-query';
import { getLessonRepository } from '../../services/repositories';
import type { LessonPlan } from '../../types';

// ==================== Query Keys ====================

export const lessonKeys = {
    all: ['lessons'] as const,
    lists: () => [...lessonKeys.all, 'list'] as const,
    detail: (id: string) => [...lessonKeys.all, 'detail', id] as const,
};

// ==================== Hooks ====================

/**
 * 取得所有課程
 */
export function useLessons() {
    const repository = getLessonRepository();

    return useQuery({
        queryKey: lessonKeys.lists(),
        queryFn: () => repository.getAllLessons(),
    });
}

/**
 * 取得單一課程詳情
 */
export function useLesson(lessonId: string) {
    const repository = getLessonRepository();

    return useQuery({
        queryKey: lessonKeys.detail(lessonId),
        queryFn: () => repository.getLessonById(lessonId),
        enabled: !!lessonId,
    });
}

// ==================== Types ====================

export type { LessonPlan };
