/**
 * 學習路徑 LocalStorage 儲存工具
 * 
 * 功能：
 * - 自動儲存學習路徑到 LocalStorage
 * - 載入已儲存的路徑
 * - 支援多個路徑（以 pathId 區分）
 */

import type { StudentLearningPath, LearningPathNode, LearningPathEdge } from '../types';

// LocalStorage Key 前綴
const STORAGE_PREFIX = 'learning-path';
const PATHS_INDEX_KEY = `${STORAGE_PREFIX}:index`;

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
    try {
        const key = `${STORAGE_PREFIX}:${path.studentId}`;
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

        localStorage.setItem(key, JSON.stringify(serialized));

        // 更新索引
        updatePathIndex(path.studentId);

        console.log(`✓ 學習路徑已儲存: ${path.studentName}`);
    } catch (error) {
        console.error('儲存學習路徑失敗:', error);
    }
}

/**
 * 從 LocalStorage 載入學習路徑
 */
export function loadPath(studentId: string): StudentLearningPath | null {
    try {
        const key = `${STORAGE_PREFIX}:${studentId}`;
        const data = localStorage.getItem(key);

        if (!data) {
            return null;
        }

        const parsed: SerializedPath = JSON.parse(data);

        // 轉換為 StudentLearningPath
        return {
            ...parsed,
        };
    } catch (error) {
        console.error('載入學習路徑失敗:', error);
        return null;
    }
}

/**
 * 載入所有已儲存的學習路徑
 */
export function loadAllPaths(): Map<string, StudentLearningPath> {
    const paths = new Map<string, StudentLearningPath>();

    try {
        const indexData = localStorage.getItem(PATHS_INDEX_KEY);
        if (!indexData) {
            return paths;
        }

        const index: string[] = JSON.parse(indexData);

        for (const studentId of index) {
            const path = loadPath(studentId);
            if (path) {
                paths.set(studentId, path);
            }
        }

        console.log(`✓ 載入 ${paths.size} 個學習路徑`);
    } catch (error) {
        console.error('載入所有學習路徑失敗:', error);
    }

    return paths;
}

/**
 * 刪除學習路徑
 */
export function deletePath(studentId: string): void {
    try {
        const key = `${STORAGE_PREFIX}:${studentId}`;
        localStorage.removeItem(key);

        // 更新索引
        removeFromPathIndex(studentId);

        console.log(`✓ 已刪除學習路徑: ${studentId}`);
    } catch (error) {
        console.error('刪除學習路徑失敗:', error);
    }
}

/**
 * 清除所有學習路徑
 */
export function clearAllPaths(): void {
    try {
        const indexData = localStorage.getItem(PATHS_INDEX_KEY);
        if (indexData) {
            const index: string[] = JSON.parse(indexData);
            for (const studentId of index) {
                localStorage.removeItem(`${STORAGE_PREFIX}:${studentId}`);
            }
        }
        localStorage.removeItem(PATHS_INDEX_KEY);

        console.log('✓ 已清除所有學習路徑');
    } catch (error) {
        console.error('清除學習路徑失敗:', error);
    }
}

/**
 * 更新路徑索引
 */
function updatePathIndex(studentId: string): void {
    try {
        const indexData = localStorage.getItem(PATHS_INDEX_KEY);
        const index: string[] = indexData ? JSON.parse(indexData) : [];

        if (!index.includes(studentId)) {
            index.push(studentId);
            localStorage.setItem(PATHS_INDEX_KEY, JSON.stringify(index));
        }
    } catch (error) {
        console.error('更新路徑索引失敗:', error);
    }
}

/**
 * 從索引中移除
 */
function removeFromPathIndex(studentId: string): void {
    try {
        const indexData = localStorage.getItem(PATHS_INDEX_KEY);
        if (!indexData) return;

        const index: string[] = JSON.parse(indexData);
        const newIndex = index.filter(id => id !== studentId);
        localStorage.setItem(PATHS_INDEX_KEY, JSON.stringify(newIndex));
    } catch (error) {
        console.error('移除索引失敗:', error);
    }
}

/**
 * 檢查是否有已儲存的路徑
 */
export function hasStoredPaths(): boolean {
    try {
        const indexData = localStorage.getItem(PATHS_INDEX_KEY);
        if (!indexData) return false;

        const index: string[] = JSON.parse(indexData);
        return index.length > 0;
    } catch {
        return false;
    }
}

/**
 * 取得儲存資訊（用於 UI 顯示）
 */
export function getStorageInfo(): {
    pathCount: number;
    lastSaved: number | null;
    totalSize: string;
} {
    try {
        const indexData = localStorage.getItem(PATHS_INDEX_KEY);
        if (!indexData) {
            return { pathCount: 0, lastSaved: null, totalSize: '0 KB' };
        }

        const index: string[] = JSON.parse(indexData);
        let lastSaved: number | null = null;
        let totalBytes = 0;

        for (const studentId of index) {
            const key = `${STORAGE_PREFIX}:${studentId}`;
            const data = localStorage.getItem(key);
            if (data) {
                totalBytes += data.length * 2; // UTF-16
                const parsed: SerializedPath = JSON.parse(data);
                if (!lastSaved || parsed.lastModified > lastSaved) {
                    lastSaved = parsed.lastModified;
                }
            }
        }

        const totalKB = (totalBytes / 1024).toFixed(1);

        return {
            pathCount: index.length,
            lastSaved,
            totalSize: `${totalKB} KB`,
        };
    } catch {
        return { pathCount: 0, lastSaved: null, totalSize: '0 KB' };
    }
}
