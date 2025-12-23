/**
 * 備課工作流程模板設定
 * 
 * 將硬編碼的節點定義抽離為可配置模板
 */

import type { LearningPathNode, LearningPathEdge } from '../types';

// ==================== 節點模板 ====================

interface NodeTemplate {
    type: LearningPathNode['type'];
    label: string;
    description: string;
    isRequired?: boolean;
    aiGenerated?: boolean;
    content?: Record<string, unknown>;
}

interface EdgeTemplate {
    fromIndex: number;
    toIndex: number;
    type?: LearningPathEdge['type'];
}

interface WorkflowTemplate {
    id: string;
    name: string;
    description: string;
    nodes: NodeTemplate[];
    edges: EdgeTemplate[];
    layout: {
        spacing: number;
        startX: number;
        startY: number;
        direction: 'horizontal' | 'vertical';
    };
}

// ==================== 預設模板 ====================

/**
 * 極簡備課流程（4 節點）
 */
export const LESSON_PREP_SIMPLE: WorkflowTemplate = {
    id: 'lesson-prep-simple',
    name: '極簡備課流程',
    description: '適合快速備課的簡化流程',
    nodes: [
        {
            type: 'chapter',
            label: '📋 四則運算課程',
            description: '五年級數學 - 四則運算單元',
            isRequired: true,
            aiGenerated: true,
        },
        {
            type: 'adaptive_exercise',
            label: '✨ AI 內容生成',
            description: '根據診斷生成教材',
            isRequired: true,
            aiGenerated: true,
        },
        {
            type: 'quiz',
            label: '📝 四則運算測驗',
            description: '單元學習評量',
            isRequired: true,
            aiGenerated: true,
            content: { passingScore: 70 },
        },
        {
            type: 'chapter',
            label: '📤 發布課程',
            description: '發布給全班學生',
            isRequired: true,
            aiGenerated: true,
        },
    ],
    edges: [
        { fromIndex: 0, toIndex: 1, type: 'default' },
        { fromIndex: 1, toIndex: 2, type: 'default' },
        { fromIndex: 2, toIndex: 3, type: 'default' },
    ],
    layout: {
        spacing: 350,
        startX: 100,
        startY: 300,
        direction: 'horizontal',
    },
};

/**
 * 標準備課流程（5 節點）
 */
export const LESSON_PREP_STANDARD: WorkflowTemplate = {
    id: 'lesson-prep-standard',
    name: '標準備課流程',
    description: '包含診斷與分組的完整流程',
    nodes: [
        {
            type: 'chapter',
            label: '📋 四則運算課程',
            description: '五年級數學 - 四則運算單元',
            isRequired: true,
            aiGenerated: true,
        },
        {
            type: 'ai_diagnosis',
            label: '🧠 AI 學習診斷',
            description: '分析學生先備知識與弱點',
            isRequired: true,
            aiGenerated: true,
            content: { analysisType: 'comprehensive' },
        },
        {
            type: 'adaptive_exercise',
            label: '✨ AI 內容生成',
            description: '生成個人化教材內容',
            isRequired: true,
            aiGenerated: true,
        },
        {
            type: 'quiz',
            label: '📝 四則運算測驗',
            description: '綜合運算評量',
            isRequired: true,
            aiGenerated: true,
            content: { passingScore: 70 },
        },
        {
            type: 'chapter',
            label: '📤 發布課程',
            description: '發布給學生開始學習',
            isRequired: true,
            aiGenerated: true,
        },
    ],
    edges: [
        { fromIndex: 0, toIndex: 1, type: 'default' },
        { fromIndex: 1, toIndex: 2, type: 'default' },
        { fromIndex: 2, toIndex: 3, type: 'default' },
        { fromIndex: 3, toIndex: 4, type: 'default' },
    ],
    layout: {
        spacing: 300,
        startX: 100,
        startY: 250,
        direction: 'horizontal',
    },
};

// ==================== 工具函式 ====================

/**
 * 根據模板生成節點和邊
 */
export function generateFromTemplate(template: WorkflowTemplate): {
    nodes: LearningPathNode[];
    edges: LearningPathEdge[];
} {
    const timestamp = Date.now();
    const nodeIds: string[] = [];
    const nodes: LearningPathNode[] = [];
    const edges: LearningPathEdge[] = [];

    // 生成節點
    template.nodes.forEach((nodeTemplate, index) => {
        const nodeId = `${nodeTemplate.type}-${timestamp}-${index}`;
        nodeIds.push(nodeId);

        const x = template.layout.direction === 'horizontal'
            ? template.layout.startX + index * template.layout.spacing
            : template.layout.startX;
        const y = template.layout.direction === 'horizontal'
            ? template.layout.startY
            : template.layout.startY + index * template.layout.spacing;

        nodes.push({
            id: nodeId,
            type: nodeTemplate.type,
            position: { x, y },
            data: {
                label: nodeTemplate.label,
                description: nodeTemplate.description,
                isRequired: nodeTemplate.isRequired,
                aiGenerated: nodeTemplate.aiGenerated,
                content: nodeTemplate.content,
            },
        });
    });

    // 生成邊
    template.edges.forEach((edgeTemplate, index) => {
        const sourceId = nodeIds[edgeTemplate.fromIndex];
        const targetId = nodeIds[edgeTemplate.toIndex];

        edges.push({
            id: `e-${sourceId}-${targetId}-${index}`,
            source: sourceId,
            target: targetId,
            type: edgeTemplate.type || 'default',
        });
    });

    return { nodes, edges };
}

// ==================== 預設導出 ====================

export const WORKFLOW_TEMPLATES: Record<string, WorkflowTemplate> = {
    simple: LESSON_PREP_SIMPLE,
    standard: LESSON_PREP_STANDARD,
};

export type { WorkflowTemplate, NodeTemplate, EdgeTemplate };
