/**
 * StudentLogRepository
 * 
 * 學生 Log 資料存取抽象層
 */

import type { StudentLog } from '../../mocks/reviewMocks';
import { MOCK_STUDENT_LOGS } from '../../mocks/reviewMocks';
import { getCurrentDataSource } from './types';

// ==================== Repository Interface ====================

export interface IStudentLogRepository {
    getAllLogs(): Promise<StudentLog[]>;
    getFlaggedLogs(): Promise<StudentLog[]>;
}

// ==================== Mock Implementation ====================

class MockStudentLogRepository implements IStudentLogRepository {
    async getAllLogs(): Promise<StudentLog[]> {
        await new Promise(resolve => setTimeout(resolve, 100));
        return MOCK_STUDENT_LOGS;
    }

    async getFlaggedLogs(): Promise<StudentLog[]> {
        await new Promise(resolve => setTimeout(resolve, 100));
        return MOCK_STUDENT_LOGS.filter(log => log.status === 'flagged');
    }
}

// ==================== API Implementation (Placeholder) ====================

class ApiStudentLogRepository implements IStudentLogRepository {
    async getAllLogs(): Promise<StudentLog[]> {
        throw new Error('API not implemented');
    }

    async getFlaggedLogs(): Promise<StudentLog[]> {
        throw new Error('API not implemented');
    }
}

// ==================== Factory ====================

export function createStudentLogRepository(): IStudentLogRepository {
    const dataSource = getCurrentDataSource();
    return dataSource === 'mock'
        ? new MockStudentLogRepository()
        : new ApiStudentLogRepository();
}

let _instance: IStudentLogRepository | null = null;

export function getStudentLogRepository(): IStudentLogRepository {
    if (!_instance) {
        _instance = createStudentLogRepository();
    }
    return _instance;
}

// Re-export types
export type { StudentLog };
