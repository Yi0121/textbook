/**
 * 學習路徑 LocalStorage 儲存工具
 * 
 * 功能：
 * - 自動儲存學習路徑到 LocalStorage
 * - 載入已儲存的路徑
 * - 支援多個路徑（以 pathId 區分）
 * 
 * 使用 StorageManager 進行統一存取
 */

import type { StudentLearningPath, LearningPathNode, LearningPathEdge } from '../types';
import { learningPathStorage } from './StorageManager';

// LocalStorage Key
const INDEX_KEY = 'index';

/**
 * 可序列化的路徑資料結構（用於 LocalStorage）
 */
interface SerializedPath {
    id: string;
    studentId: string;
    studentName: string;
    nodes: LearningPathNode[];
    edges: LearningPathEdge[];
    viewport: { x: number; y: number; zoom: number };
    createdAt: number;
    createdBy: string;
    lastModified: number;
    aiRecommendation?: StudentLearningPath['aiRecommendation'];
    progress: StudentLearningPath['progress'];
}

/**
 * 儲存學習路徑到 LocalStorage
 */
export function savePath(path: StudentLearningPath): void {
    const serialized: SerializedPath = {
        id: path.id,
        studentId: path.studentId,
        studentName: path.studentName,
        nodes: path.nodes,
        edges: path.edges,
        viewport: path.viewport,
        createdAt: path.createdAt,
        createdBy: path.createdBy,
        lastModified: Date.now(),
        aiRecommendation: path.aiRecommendation,
        progress: path.progress,
    };

    const success = learningPathStorage.set(path.studentId, serialized);

    if (success) {
        // 更新索引
        updatePathIndex(path.studentId);
        console.log(`✓ 學習路徑已儲存: ${path.studentName}`);
    } else {
        console.error('儲存學習路徑失敗');
    }
}

/**
 * 從 LocalStorage 載入學習路徑
 */
export function loadPath(studentId: string): StudentLearningPath | null {
    const data = learningPathStorage.get<SerializedPath>(studentId);
    if (!data) return null;
    return { ...data };
}

/**
 * 載入所有已儲存的學習路徑
 */
export function loadAllPaths(): Map<string, StudentLearningPath> {
    const paths = new Map<string, StudentLearningPath>();
    const index = learningPathStorage.get<string[]>(INDEX_KEY, []);

    if (!index || index.length === 0) {
        return paths;
    }

    for (const studentId of index) {
        const path = loadPath(studentId);
        if (path) {
            paths.set(studentId, path);
        }
    }

    console.log(`✓ 載入 ${paths.size} 個學習路徑`);
    return paths;
}

/**
 * 刪除學習路徑
 */
export function deletePath(studentId: string): void {
    const success = learningPathStorage.remove(studentId);
    if (success) {
        removeFromPathIndex(studentId);
        console.log(`✓ 已刪除學習路徑: ${studentId}`);
    }
}

/**
 * 清除所有學習路徑
 */
export function clearAllPaths(): void {
    const cleared = learningPathStorage.clear();
    console.log(`✓ 已清除 ${cleared} 個學習路徑`);
}

/**
 * 更新路徑索引
 */
function updatePathIndex(studentId: string): void {
    const index = learningPathStorage.get<string[]>(INDEX_KEY, []) || [];
    if (!index.includes(studentId)) {
        index.push(studentId);
        learningPathStorage.set(INDEX_KEY, index);
    }
}

/**
 * 從索引中移除
 */
function removeFromPathIndex(studentId: string): void {
    const index = learningPathStorage.get<string[]>(INDEX_KEY, []) || [];
    const newIndex = index.filter(id => id !== studentId);
    learningPathStorage.set(INDEX_KEY, newIndex);
}

/**
 * 檢查是否有已儲存的路徑
 */
export function hasStoredPaths(): boolean {
    const index = learningPathStorage.get<string[]>(INDEX_KEY, []);
    return (index?.length ?? 0) > 0;
}

/**
 * 取得儲存資訊（用於 UI 顯示）
 */
export function getStorageInfo(): {
    pathCount: number;
    lastSaved: number | null;
    totalSize: string;
} {
    const info = learningPathStorage.getStorageInfo();
    const index = learningPathStorage.get<string[]>(INDEX_KEY, []) || [];

    let lastSaved: number | null = null;
    for (const studentId of index) {
        const data = learningPathStorage.get<SerializedPath>(studentId);
        if (data && (!lastSaved || data.lastModified > lastSaved)) {
            lastSaved = data.lastModified;
        }
    }

    return {
        pathCount: index.length,
        lastSaved,
        totalSize: info.formattedSize,
    };
}

