/**
 * useLearningPathStore - Zustand 學習路徑狀態管理
 * 
 * 取代 LearningPathContext，提供：
 * - 更簡潔的 API
 * - 直接訂閱部分狀態
 * - DevTools 支援
 * - 持久化選項
 */

import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import type {
    StudentLearningPath,
    LearningPathNode,
    LearningPathEdge,
    StudentLearningRecord,
    NodeTemplate,
} from '../types';

// ==================== Types ====================

interface LearningPathState {
    // 學生學習路徑管理
    studentPaths: Map<string, StudentLearningPath>;
    currentStudentId: string | null;

    // 學習記錄快取
    learningRecords: Map<string, StudentLearningRecord>;

    // 編輯器狀態
    isEditorOpen: boolean;
    isGenerating: boolean;

    // 節點庫
    nodeTemplates: NodeTemplate[];
}

interface LearningPathActions {
    // 路徑管理
    createPath: (studentId: string, studentName: string) => void;
    loadPath: (path: StudentLearningPath) => void;
    setCurrentStudent: (studentId: string | null) => void;
    deletePath: (studentId: string) => void;

    // 節點操作
    addNode: (studentId: string, node: LearningPathNode) => void;
    updateNode: (studentId: string, nodeId: string, changes: Partial<LearningPathNode>) => void;
    deleteNode: (studentId: string, nodeId: string) => void;
    updateNodePosition: (studentId: string, nodeId: string, position: { x: number; y: number }) => void;

    // 邊操作
    addEdge: (studentId: string, edge: LearningPathEdge) => void;
    updateEdge: (studentId: string, edgeId: string, changes: Partial<LearningPathEdge>) => void;
    deleteEdge: (studentId: string, edgeId: string) => void;

    // 批量操作
    setNodesAndEdges: (studentId: string, nodes: LearningPathNode[], edges: LearningPathEdge[]) => void;

    // 進度追蹤
    updateProgress: (studentId: string, nodeId: string, status: 'completed' | 'in_progress') => void;

    // AI 推薦
    setAIRecommendation: (studentId: string, recommendation: StudentLearningPath['aiRecommendation']) => void;
    setGenerating: (isGenerating: boolean) => void;

    // 編輯器
    openEditor: (studentId: string) => void;
    closeEditor: () => void;

    // 學習記錄
    loadLearningRecord: (record: StudentLearningRecord) => void;

    // 工具方法
    getCurrentPath: () => StudentLearningPath | null;
    reset: () => void;
}

type LearningPathStore = LearningPathState & LearningPathActions;

// ==================== Initial State ====================

const defaultNodeTemplates: NodeTemplate[] = [
    { type: 'chapter', label: '章節閱讀', icon: 'BookOpen', defaultData: { label: '新章節', isRequired: true } },
    { type: 'exercise', label: '練習題', icon: 'PenTool', defaultData: { label: '練習', content: { passingScore: 60 } } },
    { type: 'video', label: '教學影片', icon: 'Video', defaultData: { label: '影片教材' } },
    { type: 'ai_tutor', label: 'AI 家教', icon: 'Sparkles', defaultData: { label: 'AI 輔導', aiGenerated: true } },
    { type: 'collaboration', label: '小組討論', icon: 'Users', defaultData: { label: '協作', content: { groupSize: 4 } } },
    { type: 'quiz', label: '測驗', icon: 'ClipboardCheck', defaultData: { label: '測驗', content: { passingScore: 70 } } },
];

const initialState: LearningPathState = {
    studentPaths: new Map(),
    currentStudentId: null,
    learningRecords: new Map(),
    isEditorOpen: false,
    isGenerating: false,
    nodeTemplates: defaultNodeTemplates,
};

// ==================== Store ====================

export const useLearningPathStore = create<LearningPathStore>()(
    devtools(
        subscribeWithSelector((set, get) => ({
            ...initialState,

            // ==================== 路徑管理 ====================

            createPath: (studentId, studentName) => {
                const newPath: StudentLearningPath = {
                    id: `path-${Date.now()}`,
                    studentId,
                    studentName,
                    nodes: [],
                    edges: [],
                    viewport: { x: 0, y: 0, zoom: 1 },
                    createdAt: Date.now(),
                    createdBy: 'current-teacher-id',
                    lastModified: Date.now(),
                    progress: { totalNodes: 0, completedNodes: 0 },
                };

                set((state) => {
                    const newPaths = new Map(state.studentPaths);
                    newPaths.set(studentId, newPath);
                    return { studentPaths: newPaths };
                }, false, 'createPath');
            },

            loadPath: (path) => {
                set((state) => {
                    const newPaths = new Map(state.studentPaths);
                    newPaths.set(path.studentId, path);
                    return { studentPaths: newPaths };
                }, false, 'loadPath');
            },

            setCurrentStudent: (studentId) => {
                set({ currentStudentId: studentId }, false, 'setCurrentStudent');
            },

            deletePath: (studentId) => {
                set((state) => {
                    const newPaths = new Map(state.studentPaths);
                    newPaths.delete(studentId);
                    return { studentPaths: newPaths };
                }, false, 'deletePath');
            },

            // ==================== 節點操作 ====================

            addNode: (studentId, node) => {
                set((state) => {
                    const path = state.studentPaths.get(studentId);
                    if (!path) return state;

                    const updatedPath: StudentLearningPath = {
                        ...path,
                        nodes: [...path.nodes, node],
                        lastModified: Date.now(),
                        progress: { ...path.progress, totalNodes: path.nodes.length + 1 },
                    };

                    const newPaths = new Map(state.studentPaths);
                    newPaths.set(studentId, updatedPath);
                    return { studentPaths: newPaths };
                }, false, 'addNode');
            },

            updateNode: (studentId, nodeId, changes) => {
                set((state) => {
                    const path = state.studentPaths.get(studentId);
                    if (!path) return state;

                    const updatedPath: StudentLearningPath = {
                        ...path,
                        nodes: path.nodes.map((node) =>
                            node.id === nodeId ? { ...node, ...changes } : node
                        ),
                        lastModified: Date.now(),
                    };

                    const newPaths = new Map(state.studentPaths);
                    newPaths.set(studentId, updatedPath);
                    return { studentPaths: newPaths };
                }, false, 'updateNode');
            },

            deleteNode: (studentId, nodeId) => {
                set((state) => {
                    const path = state.studentPaths.get(studentId);
                    if (!path) return state;

                    const updatedPath: StudentLearningPath = {
                        ...path,
                        nodes: path.nodes.filter((n) => n.id !== nodeId),
                        edges: path.edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
                        lastModified: Date.now(),
                        progress: { ...path.progress, totalNodes: path.nodes.length - 1 },
                    };

                    const newPaths = new Map(state.studentPaths);
                    newPaths.set(studentId, updatedPath);
                    return { studentPaths: newPaths };
                }, false, 'deleteNode');
            },

            updateNodePosition: (studentId, nodeId, position) => {
                set((state) => {
                    const path = state.studentPaths.get(studentId);
                    if (!path) return state;

                    const updatedPath: StudentLearningPath = {
                        ...path,
                        nodes: path.nodes.map((node) =>
                            node.id === nodeId ? { ...node, position } : node
                        ),
                        lastModified: Date.now(),
                    };

                    const newPaths = new Map(state.studentPaths);
                    newPaths.set(studentId, updatedPath);
                    return { studentPaths: newPaths };
                }, false, 'updateNodePosition');
            },

            // ==================== 邊操作 ====================

            addEdge: (studentId, edge) => {
                set((state) => {
                    const path = state.studentPaths.get(studentId);
                    if (!path) return state;

                    const updatedPath: StudentLearningPath = {
                        ...path,
                        edges: [...path.edges, edge],
                        lastModified: Date.now(),
                    };

                    const newPaths = new Map(state.studentPaths);
                    newPaths.set(studentId, updatedPath);
                    return { studentPaths: newPaths };
                }, false, 'addEdge');
            },

            updateEdge: (studentId, edgeId, changes) => {
                set((state) => {
                    const path = state.studentPaths.get(studentId);
                    if (!path) return state;

                    const updatedPath: StudentLearningPath = {
                        ...path,
                        edges: path.edges.map((edge) =>
                            edge.id === edgeId ? { ...edge, ...changes } : edge
                        ),
                        lastModified: Date.now(),
                    };

                    const newPaths = new Map(state.studentPaths);
                    newPaths.set(studentId, updatedPath);
                    return { studentPaths: newPaths };
                }, false, 'updateEdge');
            },

            deleteEdge: (studentId, edgeId) => {
                set((state) => {
                    const path = state.studentPaths.get(studentId);
                    if (!path) return state;

                    const updatedPath: StudentLearningPath = {
                        ...path,
                        edges: path.edges.filter((e) => e.id !== edgeId),
                        lastModified: Date.now(),
                    };

                    const newPaths = new Map(state.studentPaths);
                    newPaths.set(studentId, updatedPath);
                    return { studentPaths: newPaths };
                }, false, 'deleteEdge');
            },

            // ==================== 批量操作 ====================

            setNodesAndEdges: (studentId, nodes, edges) => {
                set((state) => {
                    const path = state.studentPaths.get(studentId);

                    if (!path) {
                        // 如果路徑不存在，先建立
                        const newPath: StudentLearningPath = {
                            id: `path-${Date.now()}`,
                            studentId,
                            studentName: studentId,
                            nodes,
                            edges,
                            viewport: { x: 0, y: 0, zoom: 1 },
                            createdAt: Date.now(),
                            createdBy: 'ai-agent',
                            lastModified: Date.now(),
                            progress: { totalNodes: nodes.length, completedNodes: 0 },
                        };
                        const newPaths = new Map(state.studentPaths);
                        newPaths.set(studentId, newPath);
                        return { studentPaths: newPaths };
                    }

                    const updatedPath: StudentLearningPath = {
                        ...path,
                        nodes,
                        edges,
                        lastModified: Date.now(),
                        progress: { ...path.progress, totalNodes: nodes.length },
                    };

                    const newPaths = new Map(state.studentPaths);
                    newPaths.set(studentId, updatedPath);
                    return { studentPaths: newPaths };
                }, false, 'setNodesAndEdges');
            },

            // ==================== 進度追蹤 ====================

            updateProgress: (studentId, nodeId, status) => {
                set((state) => {
                    const path = state.studentPaths.get(studentId);
                    if (!path) return state;

                    let completedCount = path.progress.completedNodes;
                    const node = path.nodes.find((n) => n.id === nodeId);

                    if (node && node.data.status !== 'completed' && status === 'completed') {
                        completedCount++;
                    }

                    const updatedPath: StudentLearningPath = {
                        ...path,
                        nodes: path.nodes.map((n) =>
                            n.id === nodeId ? { ...n, data: { ...n.data, status } } : n
                        ),
                        progress: {
                            ...path.progress,
                            completedNodes: completedCount,
                            currentNodeId: status === 'in_progress' ? nodeId : path.progress.currentNodeId,
                        },
                        lastModified: Date.now(),
                    };

                    const newPaths = new Map(state.studentPaths);
                    newPaths.set(studentId, updatedPath);
                    return { studentPaths: newPaths };
                }, false, 'updateProgress');
            },

            // ==================== AI 推薦 ====================

            setAIRecommendation: (studentId, recommendation) => {
                set((state) => {
                    const path = state.studentPaths.get(studentId);
                    if (!path) return state;

                    const updatedPath: StudentLearningPath = {
                        ...path,
                        aiRecommendation: recommendation,
                        lastModified: Date.now(),
                    };

                    const newPaths = new Map(state.studentPaths);
                    newPaths.set(studentId, updatedPath);
                    return { studentPaths: newPaths };
                }, false, 'setAIRecommendation');
            },

            setGenerating: (isGenerating) => {
                set({ isGenerating }, false, 'setGenerating');
            },

            // ==================== 編輯器 ====================

            openEditor: (studentId) => {
                set({ isEditorOpen: true, currentStudentId: studentId }, false, 'openEditor');
            },

            closeEditor: () => {
                set({ isEditorOpen: false }, false, 'closeEditor');
            },

            // ==================== 學習記錄 ====================

            loadLearningRecord: (record) => {
                set((state) => {
                    const newRecords = new Map(state.learningRecords);
                    newRecords.set(record.studentId, record);
                    return { learningRecords: newRecords };
                }, false, 'loadLearningRecord');
            },

            // ==================== 工具方法 ====================

            getCurrentPath: () => {
                const { currentStudentId, studentPaths } = get();
                if (!currentStudentId) return null;
                return studentPaths.get(currentStudentId) || null;
            },

            reset: () => {
                set(initialState, false, 'reset');
            },
        })),
        { name: 'learning-path-store' }
    )
);

// ==================== Selectors ====================

export const selectCurrentPath = (state: LearningPathStore) =>
    state.currentStudentId ? state.studentPaths.get(state.currentStudentId) : null;

export const selectCurrentNodes = (state: LearningPathStore) =>
    selectCurrentPath(state)?.nodes ?? [];

export const selectCurrentEdges = (state: LearningPathStore) =>
    selectCurrentPath(state)?.edges ?? [];

export const selectIsGenerating = (state: LearningPathStore) =>
    state.isGenerating;
