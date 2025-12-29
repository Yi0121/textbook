/**
 * Progress Helpers
 * 
 * 共用的學習路徑進度處理函式
 */

import type { NodeProgress } from '../types/studentProgress';
import type { LessonNode } from '../types/lessonPlan';

/**
 * 查找特定節點的進度資料
 */
export function getNodeProgress(
    nodeProgress: NodeProgress[],
    nodeId: string
): NodeProgress | undefined {
    return nodeProgress.find(np => np.nodeId === nodeId);
}

/**
 * 計算節點狀態
 */
export function getNodeStatus(
    node: LessonNode,
    nodeProgress: NodeProgress[],
    currentNodeId: string
): 'completed' | 'current' | 'locked' {
    const progress = getNodeProgress(nodeProgress, node.id);
    if (!progress) return 'locked';
    if (progress.completed) return 'completed';
    if (node.id === currentNodeId) return 'current';
    return 'locked';
}

/**
 * 格式化時間為「X 分鐘」
 */
export function formatDuration(seconds?: number): string {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    return `${mins} 分鐘`;
}

/**
 * 格式化時間為「mm:ss」
 */
export function formatTimeMMSS(seconds?: number): string {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
