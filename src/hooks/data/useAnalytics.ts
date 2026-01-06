/**
 * useAnalytics
 * 
 * TanStack Query hooks for learning analytics data
 */

import { useQuery } from '@tanstack/react-query';
import { getAnalyticsRepository } from '../../services/repositories';

// ==================== Query Keys ====================

export const analyticsKeys = {
    all: ['analytics'] as const,
    students: () => [...analyticsKeys.all, 'students'] as const,
    student: (id: string) => [...analyticsKeys.students(), id] as const,
    class: () => [...analyticsKeys.all, 'class'] as const,
    conversations: (studentId: string) => [...analyticsKeys.all, 'conversations', studentId] as const,
};

// ==================== Hooks ====================

/**
 * 取得所有學生的分析資料
 */
export function useAllStudentsAnalytics() {
    const repository = getAnalyticsRepository();

    return useQuery({
        queryKey: analyticsKeys.students(),
        queryFn: () => repository.getAllStudentsAnalytics(),
    });
}

/**
 * 取得單一學生的分析資料
 */
export function useStudentAnalytics(studentId: string) {
    const repository = getAnalyticsRepository();

    return useQuery({
        queryKey: analyticsKeys.student(studentId),
        queryFn: () => repository.getStudentAnalytics(studentId),
        enabled: !!studentId,
    });
}

/**
 * 取得班級分析資料
 */
export function useClassAnalytics() {
    const repository = getAnalyticsRepository();

    return useQuery({
        queryKey: analyticsKeys.class(),
        queryFn: () => repository.getClassAnalytics(),
    });
}

/**
 * 取得學生對話紀錄
 */
export function useStudentConversations(studentId: string) {
    const repository = getAnalyticsRepository();

    return useQuery({
        queryKey: analyticsKeys.conversations(studentId),
        queryFn: () => repository.getStudentConversations(studentId),
        enabled: !!studentId,
    });
}
