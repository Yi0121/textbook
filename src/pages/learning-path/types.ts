/**
 * StudentLearningPath - 類型定義
 */

import type { LessonPlan, LessonNode } from '../../types/lessonPlan';
import type { StudentProgress, NodeProgress } from '../../types/studentProgress';

export interface LearningPathProps {
    lesson: LessonPlan;
    studentProgress: StudentProgress;
    onNodeSelect: (nodeId: string | null) => void;
    selectedNodeId: string | null;
}

export interface LearningPathHUDProps {
    lesson: LessonPlan;
    studentProgress: StudentProgress;
    visibleNodes: LessonNode[];
    onNextTask: () => void;
}

export interface TaskDetailModalProps {
    node: LessonNode;
    nodeProgress?: NodeProgress;
    onClose: () => void;
    onNavigate: (path: string) => void;
}

// Helper to clean APOS prefixes from titles
export const cleanTitle = (title: string): string => {
    return title
        .replace(/(Action|Process|Object|Schema)\s*[:：]?\s*/gi, '')
        .replace(/📋 |🔢 |🧪 |⚙️ |✏️ |📦 |🔧 |🧠 |🌍 |📝 |✓ /g, '')
        .trim();
};
