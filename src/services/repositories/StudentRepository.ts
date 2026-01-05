/**
 * StudentRepository
 * 
 * 學生資料存取抽象層，支援 Mock 與 API 切換
 */

import type { StudentLearningRecord } from '../../types';
import { MOCK_STUDENT_RECORDS } from '../../mocks';
import { getCurrentDataSource } from './types';

// ==================== Repository Interface ====================

export interface IStudentRepository {
    getStudentRecord(studentName: string): Promise<StudentLearningRecord | null>;
    getAllStudentRecords(): Promise<StudentLearningRecord[]>;
    getStudentNames(): Promise<string[]>;
}

// ==================== Mock Implementation ====================

class MockStudentRepository implements IStudentRepository {
    async getStudentRecord(studentName: string): Promise<StudentLearningRecord | null> {
        // 模擬網路延遲
        await new Promise(resolve => setTimeout(resolve, 100));
        return MOCK_STUDENT_RECORDS[studentName] ?? null;
    }

    async getAllStudentRecords(): Promise<StudentLearningRecord[]> {
        await new Promise(resolve => setTimeout(resolve, 100));
        return Object.values(MOCK_STUDENT_RECORDS);
    }

    async getStudentNames(): Promise<string[]> {
        await new Promise(resolve => setTimeout(resolve, 50));
        return Object.keys(MOCK_STUDENT_RECORDS);
    }
}

// ==================== API Implementation (Placeholder) ====================

class ApiStudentRepository implements IStudentRepository {
    async getStudentRecord(_studentName: string): Promise<StudentLearningRecord | null> {
        // TODO: 實作 API 串接
        // const response = await apiClient.get<StudentLearningRecord>(`/students/${studentName}/record`);
        // return response.data;
        throw new Error('API not implemented. Please set VITE_USE_MOCK=true');
    }

    async getAllStudentRecords(): Promise<StudentLearningRecord[]> {
        throw new Error('API not implemented. Please set VITE_USE_MOCK=true');
    }

    async getStudentNames(): Promise<string[]> {
        throw new Error('API not implemented. Please set VITE_USE_MOCK=true');
    }
}

// ==================== Factory ====================

export function createStudentRepository(): IStudentRepository {
    const dataSource = getCurrentDataSource();
    return dataSource === 'mock'
        ? new MockStudentRepository()
        : new ApiStudentRepository();
}

// ==================== Singleton ====================

let _instance: IStudentRepository | null = null;

export function getStudentRepository(): IStudentRepository {
    if (!_instance) {
        _instance = createStudentRepository();
    }
    return _instance;
}
