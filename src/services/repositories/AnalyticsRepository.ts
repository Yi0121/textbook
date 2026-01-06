/**
 * AnalyticsRepository
 * 
 * 學習分析資料存取抽象層
 */

import type {
    StudentAnalyticsData,
    ClassAnalyticsData,
    ConversationRecord,
} from '../../mocks/analyticsData';
import { MOCK_STUDENTS, MOCK_CLASS_ANALYTICS } from '../../mocks/analyticsData';
import { getCurrentDataSource } from './types';

// ==================== Repository Interface ====================

export interface IAnalyticsRepository {
    getStudentAnalytics(studentId: string): Promise<StudentAnalyticsData | null>;
    getAllStudentsAnalytics(): Promise<StudentAnalyticsData[]>;
    getClassAnalytics(): Promise<ClassAnalyticsData>;
    getStudentConversations(studentId: string): Promise<ConversationRecord[]>;
}

// ==================== Mock Implementation ====================

class MockAnalyticsRepository implements IAnalyticsRepository {
    async getStudentAnalytics(studentId: string): Promise<StudentAnalyticsData | null> {
        await new Promise(resolve => setTimeout(resolve, 100));
        return MOCK_STUDENTS.find(s => s.id === studentId) ?? null;
    }

    async getAllStudentsAnalytics(): Promise<StudentAnalyticsData[]> {
        await new Promise(resolve => setTimeout(resolve, 100));
        return MOCK_STUDENTS;
    }

    async getClassAnalytics(): Promise<ClassAnalyticsData> {
        await new Promise(resolve => setTimeout(resolve, 100));
        return MOCK_CLASS_ANALYTICS;
    }

    async getStudentConversations(studentId: string): Promise<ConversationRecord[]> {
        await new Promise(resolve => setTimeout(resolve, 100));
        const student = MOCK_STUDENTS.find(s => s.id === studentId);
        return student?.conversations ?? [];
    }
}

// ==================== API Implementation (Placeholder) ====================

class ApiAnalyticsRepository implements IAnalyticsRepository {
    async getStudentAnalytics(_studentId: string): Promise<StudentAnalyticsData | null> {
        throw new Error('API not implemented');
    }

    async getAllStudentsAnalytics(): Promise<StudentAnalyticsData[]> {
        throw new Error('API not implemented');
    }

    async getClassAnalytics(): Promise<ClassAnalyticsData> {
        throw new Error('API not implemented');
    }

    async getStudentConversations(_studentId: string): Promise<ConversationRecord[]> {
        throw new Error('API not implemented');
    }
}

// ==================== Factory ====================

export function createAnalyticsRepository(): IAnalyticsRepository {
    const dataSource = getCurrentDataSource();
    return dataSource === 'mock'
        ? new MockAnalyticsRepository()
        : new ApiAnalyticsRepository();
}

let _instance: IAnalyticsRepository | null = null;

export function getAnalyticsRepository(): IAnalyticsRepository {
    if (!_instance) {
        _instance = createAnalyticsRepository();
    }
    return _instance;
}

// Re-export types for convenience
export type { StudentAnalyticsData, ClassAnalyticsData, ConversationRecord };
