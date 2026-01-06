/**
 * useStudentProgress
 * 
 * TanStack Query hooks for student progress data
 */

import { useQuery } from '@tanstack/react-query';
import { getStudentProgressRepository } from '../../services/repositories';
import type { StudentProgress } from '../../types/studentProgress';

// ==================== Query Keys ====================

export const studentProgressKeys = {
    all: ['studentProgress'] as const,
    byLesson: (lessonId: string) => [...studentProgressKeys.all, 'lesson', lessonId] as const,
    byStudent: (studentId: string) => [...studentProgressKeys.all, 'student', studentId] as const,
    detail: (lessonId: string, studentId: string) =>
        [...studentProgressKeys.all, 'detail', lessonId, studentId] as const,
};

// ==================== Hooks ====================

/**
 * 取得指定課程的所有學生進度
 */
export function useStudentProgressByLesson(lessonId: string) {
    const repository = getStudentProgressRepository();

    return useQuery({
        queryKey: studentProgressKeys.byLesson(lessonId),
        queryFn: () => repository.getProgressByLessonId(lessonId),
        enabled: !!lessonId,
    });
}

/**
 * 取得指定學生在所有課程的進度
 */
export function useStudentProgressByStudent(studentId: string) {
    const repository = getStudentProgressRepository();

    return useQuery({
        queryKey: studentProgressKeys.byStudent(studentId),
        queryFn: () => repository.getProgressByStudentId(studentId),
        enabled: !!studentId,
    });
}

/**
 * 取得單一學生在指定課程的進度
 */
export function useStudentLessonProgress(lessonId: string, studentId: string) {
    const repository = getStudentProgressRepository();

    return useQuery({
        queryKey: studentProgressKeys.detail(lessonId, studentId),
        queryFn: () => repository.getStudentProgressInLesson(lessonId, studentId),
        enabled: !!lessonId && !!studentId,
    });
}

export type { StudentProgress };
