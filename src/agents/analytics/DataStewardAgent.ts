/**
 * DataStewardAgent - 資料管家 Agent
 * 
 * 職責 (第一層分析)：
 * - 收集原始資料
 * - 資料清洗
 * - 儲存資料
 * - 匯出資料
 */

import { BaseAgent } from '../BaseAgent';
import type { AgentId, AgentCategory, AgentTool } from '../types';
import { savePath, loadPath, loadAllPaths } from '../../utils/learningPathStorage';

// ==================== Tool Input Types ====================

interface CollectRawDataInput {
    dataType: 'learning-behavior' | 'assessment' | 'interaction' | 'progress';
    studentId?: string;
    classId?: string;
    timeRange?: { start: number; end: number };
}

interface CleanDataInput {
    dataId: string;
    operations?: ('remove_duplicates' | 'fill_missing' | 'normalize' | 'validate')[];
}

interface StoreDataInput {
    dataType: string;
    data: Record<string, unknown>;
    metadata?: Record<string, unknown>;
}

interface ExportDataInput {
    dataType: string;
    format: 'json' | 'csv' | 'xlsx';
    filters?: Record<string, unknown>;
}

interface LoadPathInput {
    studentId: string;
}

interface SavePathInput {
    studentId: string;
    path: {
        nodes: Array<unknown>;
        edges: Array<unknown>;
        viewport?: { x: number; y: number; zoom: number };
    };
}

// ==================== Agent Implementation ====================

export class DataStewardAgent extends BaseAgent {
    readonly id: AgentId = 'data-steward';
    readonly name = '資料管家 Agent';
    readonly category: AgentCategory = 'analytics';

    protected defineTools(): AgentTool[] {
        return [
            this.createMockTool(
                'collect_raw_data',
                '收集原始學習資料',
                (input: CollectRawDataInput) => ({
                    collected: true,
                    dataType: input.dataType,
                    recordCount: Math.floor(Math.random() * 100) + 50,
                    timeRange: input.timeRange || { start: Date.now() - 86400000, end: Date.now() },
                    dataId: `data-${Date.now()}`,
                })
            ),

            this.createMockTool(
                'clean_data',
                '清洗與驗證資料',
                (input: CleanDataInput) => ({
                    cleaned: true,
                    dataId: input.dataId,
                    operations: input.operations || ['remove_duplicates', 'validate'],
                    removedRecords: Math.floor(Math.random() * 10),
                    filledMissing: Math.floor(Math.random() * 5),
                    qualityScore: 0.85 + Math.random() * 0.15,
                })
            ),

            this.createMockTool(
                'store_data',
                '儲存資料至儲存系統',
                (input: StoreDataInput) => ({
                    stored: true,
                    dataType: input.dataType,
                    storageId: `storage-${Date.now()}`,
                    timestamp: Date.now(),
                    size: JSON.stringify(input.data).length,
                })
            ),

            this.createMockTool(
                'export_data',
                '匯出資料為指定格式',
                (input: ExportDataInput) => ({
                    exported: true,
                    format: input.format,
                    filename: `export-${input.dataType}-${Date.now()}.${input.format}`,
                    downloadUrl: `https://example.com/exports/${Date.now()}.${input.format}`,
                    recordCount: Math.floor(Math.random() * 200) + 100,
                })
            ),

            // 整合現有 learningPathStorage
            {
                name: 'load_learning_path',
                description: '載入學生的學習路徑',
                execute: async (input: LoadPathInput) => {
                    const path = loadPath(input.studentId);
                    return {
                        found: !!path,
                        studentId: input.studentId,
                        path: path || null,
                    };
                },
            },

            {
                name: 'save_learning_path',
                description: '儲存學生的學習路徑',
                execute: async (input: SavePathInput) => {
                    // savePath 需要完整的 StudentLearningPath 物件
                    const pathToSave = {
                        id: `path-${input.studentId}`,
                        studentId: input.studentId,
                        studentName: input.studentId, // 簡化處理
                        nodes: input.path.nodes || [],
                        edges: input.path.edges || [],
                        viewport: input.path.viewport || { x: 0, y: 0, zoom: 1 },
                        createdAt: Date.now(),
                        createdBy: 'agent',
                        lastModified: Date.now(),
                        progress: { completedNodes: 0, totalNodes: 0, percentage: 0 },
                    };
                    savePath(pathToSave as any);
                    return {
                        saved: true,
                        studentId: input.studentId,
                        timestamp: Date.now(),
                    };
                },
            },

            {
                name: 'load_all_paths',
                description: '載入所有已儲存的學習路徑',
                execute: async () => {
                    const pathsMap = loadAllPaths();
                    const pathsArray = Array.from(pathsMap.values());
                    return {
                        count: pathsArray.length,
                        paths: pathsArray.map((p) => ({
                            id: p.id,
                            studentId: p.studentId,
                            nodeCount: p.nodes?.length || 0,
                        })),
                    };
                },
            },
        ];
    }
}

export const dataStewardAgent = new DataStewardAgent();
