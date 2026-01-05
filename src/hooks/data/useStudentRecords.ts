/**
 * useStudentRecords
 * 
 * TanStack Query hook for fetching student records
 */

import { useQuery } from '@tanstack/react-query';
import { getStudentRepository } from '../../services/repositories';
import type { StudentLearningRecord } from '../../types';

// ==================== Query Keys ====================

export const studentKeys = {
    all: ['students'] as const,
    records: () => [...studentKeys.all, 'records'] as const,
    record: (name: string) => [...studentKeys.records(), name] as const,
    names: () => [...studentKeys.all, 'names'] as const,
};

// ==================== Hooks ====================

/**
 * 取得所有學生學習記錄
 */
export function useStudentRecords() {
    const repository = getStudentRepository();

    return useQuery({
        queryKey: studentKeys.records(),
        queryFn: () => repository.getAllStudentRecords(),
    });
}

/**
 * 取得單一學生學習記錄
 */
export function useStudentRecord(studentName: string) {
    const repository = getStudentRepository();

    return useQuery({
        queryKey: studentKeys.record(studentName),
        queryFn: () => repository.getStudentRecord(studentName),
        enabled: !!studentName,
    });
}

/**
 * 取得所有學生名稱列表
 */
export function useStudentNames() {
    const repository = getStudentRepository();

    return useQuery({
        queryKey: studentKeys.names(),
        queryFn: () => repository.getStudentNames(),
    });
}

// ==================== Types ====================

export type { StudentLearningRecord };
