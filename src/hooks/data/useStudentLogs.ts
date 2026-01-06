/**
 * useStudentLogs
 * 
 * TanStack Query hooks for student log data
 */

import { useQuery } from '@tanstack/react-query';
import { getStudentLogRepository } from '../../services/repositories/StudentLogRepository';

// ==================== Query Keys ====================

export const studentLogKeys = {
    all: ['studentLogs'] as const,
    flagged: () => [...studentLogKeys.all, 'flagged'] as const,
};

// ==================== Hooks ====================

/**
 * 取得所有學生 logs
 */
export function useStudentLogs() {
    const repository = getStudentLogRepository();

    return useQuery({
        queryKey: studentLogKeys.all,
        queryFn: () => repository.getAllLogs(),
    });
}

/**
 * 取得被標記的 logs (需審查)
 */
export function useFlaggedStudentLogs() {
    const repository = getStudentLogRepository();

    return useQuery({
        queryKey: studentLogKeys.flagged(),
        queryFn: () => repository.getFlaggedLogs(),
    });
}
