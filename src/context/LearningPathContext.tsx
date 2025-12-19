/**
 * LearningPathContext - 學習路徑狀態管理
 *
 * 職責：
 * - 管理學生學習路徑（節點、邊）
 * - 管理學生學習記錄與弱點分析
 * - 管理流程圖編輯器狀態
 */

import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type {
  StudentLearningPath,
  LearningPathNode,
  LearningPathEdge,
  StudentLearningRecord,
  NodeTemplate,
} from '../types';

// ==================== 學習路徑狀態 ====================

export interface LearningPathState {
  // 學生學習路徑管理
  studentPaths: Map<string, StudentLearningPath>;  // key: studentId
  currentStudentId: string | null;

  // 學習記錄快取
  learningRecords: Map<string, StudentLearningRecord>;

  // 編輯器狀態
  isEditorOpen: boolean;  // 控制 WorkflowEditor Modal 開關
  isGenerating: boolean;  // AI 生成中

  // 節點庫（教師可選擇的節點類型）
  nodeTemplates: NodeTemplate[];
}

// ==================== Actions ====================

export type LearningPathAction =
  // 路徑管理
  | { type: 'CREATE_PATH'; payload: { studentId: string; studentName: string } }
  | { type: 'LOAD_PATH'; payload: StudentLearningPath }
  | { type: 'SET_CURRENT_STUDENT'; payload: string | null }
  | { type: 'DELETE_PATH'; payload: string }

  // 節點操作
  | {
    type: 'ADD_NODE';
    payload: { studentId: string; node: LearningPathNode };
  }
  | {
    type: 'UPDATE_NODE';
    payload: {
      studentId: string;
      nodeId: string;
      changes: Partial<LearningPathNode>;
    };
  }
  | {
    type: 'DELETE_NODE';
    payload: { studentId: string; nodeId: string };
  }
  | {
    type: 'UPDATE_NODE_POSITION';
    payload: {
      studentId: string;
      nodeId: string;
      position: { x: number; y: number };
    };
  }

  // 邊操作
  | {
    type: 'ADD_EDGE';
    payload: { studentId: string; edge: LearningPathEdge };
  }
  | {
    type: 'UPDATE_EDGE';
    payload: {
      studentId: string;
      edgeId: string;
      changes: Partial<LearningPathEdge>;
    };
  }
  | {
    type: 'DELETE_EDGE';
    payload: { studentId: string; edgeId: string };
  }

  // 進度追蹤
  | {
    type: 'UPDATE_PROGRESS';
    payload: {
      studentId: string;
      nodeId: string;
      status: 'completed' | 'in_progress';
    };
  }

  // AI 推薦
  | {
    type: 'SET_AI_RECOMMENDATION';
    payload: {
      studentId: string;
      recommendation: StudentLearningPath['aiRecommendation'];
    };
  }
  | { type: 'SET_GENERATING'; payload: boolean }

  // 編輯器
  | { type: 'OPEN_EDITOR'; payload: string }
  | { type: 'CLOSE_EDITOR' }

  // 學習記錄
  | { type: 'LOAD_LEARNING_RECORD'; payload: StudentLearningRecord };

// ==================== Initial State ====================

export const initialLearningPathState: LearningPathState = {
  studentPaths: new Map(),
  currentStudentId: null,
  learningRecords: new Map(),
  isEditorOpen: false,
  isGenerating: false,
  nodeTemplates: [
    {
      type: 'chapter',
      label: '章節閱讀',
      icon: 'BookOpen',
      defaultData: { label: '新章節', isRequired: true },
    },
    {
      type: 'exercise',
      label: '練習題',
      icon: 'PenTool',
      defaultData: { label: '練習', content: { passingScore: 60 } },
    },
    {
      type: 'video',
      label: '教學影片',
      icon: 'Video',
      defaultData: { label: '影片教材' },
    },
    {
      type: 'ai_tutor',
      label: 'AI 家教',
      icon: 'Sparkles',
      defaultData: { label: 'AI 輔導', aiGenerated: true },
    },
    {
      type: 'collaboration',
      label: '小組討論',
      icon: 'Users',
      defaultData: { label: '協作', content: { groupSize: 4 } },
    },
    {
      type: 'quiz',
      label: '測驗',
      icon: 'ClipboardCheck',
      defaultData: { label: '測驗', content: { passingScore: 70 } },
    },
  ],
};

// ==================== Reducer ====================

export function learningPathReducer(
  state: LearningPathState,
  action: LearningPathAction
): LearningPathState {
  switch (action.type) {
    case 'CREATE_PATH': {
      const newPath: StudentLearningPath = {
        id: `path-${Date.now()}`,
        studentId: action.payload.studentId,
        studentName: action.payload.studentName,
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 },
        createdAt: Date.now(),
        createdBy: 'current-teacher-id', // 應從 auth context 取得
        lastModified: Date.now(),
        progress: {
          totalNodes: 0,
          completedNodes: 0,
        },
      };

      const newPaths = new Map(state.studentPaths);
      newPaths.set(action.payload.studentId, newPath);

      return { ...state, studentPaths: newPaths };
    }

    case 'LOAD_PATH': {
      const newPaths = new Map(state.studentPaths);
      newPaths.set(action.payload.studentId, action.payload);
      return { ...state, studentPaths: newPaths };
    }

    case 'SET_CURRENT_STUDENT':
      return { ...state, currentStudentId: action.payload };

    case 'DELETE_PATH': {
      const newPaths = new Map(state.studentPaths);
      newPaths.delete(action.payload);
      return { ...state, studentPaths: newPaths };
    }

    case 'ADD_NODE': {
      const path = state.studentPaths.get(action.payload.studentId);
      if (!path) return state;

      const updatedPath: StudentLearningPath = {
        ...path,
        nodes: [...path.nodes, action.payload.node],
        lastModified: Date.now(),
        progress: {
          ...path.progress,
          totalNodes: path.nodes.length + 1,
        },
      };

      const newPaths = new Map(state.studentPaths);
      newPaths.set(action.payload.studentId, updatedPath);

      return { ...state, studentPaths: newPaths };
    }

    case 'UPDATE_NODE': {
      const path = state.studentPaths.get(action.payload.studentId);
      if (!path) return state;

      const updatedPath: StudentLearningPath = {
        ...path,
        nodes: path.nodes.map((node) =>
          node.id === action.payload.nodeId
            ? { ...node, ...action.payload.changes }
            : node
        ),
        lastModified: Date.now(),
      };

      const newPaths = new Map(state.studentPaths);
      newPaths.set(action.payload.studentId, updatedPath);

      return { ...state, studentPaths: newPaths };
    }

    case 'UPDATE_NODE_POSITION': {
      const path = state.studentPaths.get(action.payload.studentId);
      if (!path) return state;

      const updatedPath: StudentLearningPath = {
        ...path,
        nodes: path.nodes.map((node) =>
          node.id === action.payload.nodeId
            ? { ...node, position: action.payload.position }
            : node
        ),
        lastModified: Date.now(),
      };

      const newPaths = new Map(state.studentPaths);
      newPaths.set(action.payload.studentId, updatedPath);

      return { ...state, studentPaths: newPaths };
    }

    case 'DELETE_NODE': {
      const path = state.studentPaths.get(action.payload.studentId);
      if (!path) return state;

      // 刪除節點時，同時刪除相關的邊
      const updatedPath: StudentLearningPath = {
        ...path,
        nodes: path.nodes.filter((n) => n.id !== action.payload.nodeId),
        edges: path.edges.filter(
          (e) =>
            e.source !== action.payload.nodeId &&
            e.target !== action.payload.nodeId
        ),
        lastModified: Date.now(),
        progress: {
          ...path.progress,
          totalNodes: path.nodes.length - 1,
        },
      };

      const newPaths = new Map(state.studentPaths);
      newPaths.set(action.payload.studentId, updatedPath);

      return { ...state, studentPaths: newPaths };
    }

    case 'ADD_EDGE': {
      const path = state.studentPaths.get(action.payload.studentId);
      if (!path) return state;

      const updatedPath: StudentLearningPath = {
        ...path,
        edges: [...path.edges, action.payload.edge],
        lastModified: Date.now(),
      };

      const newPaths = new Map(state.studentPaths);
      newPaths.set(action.payload.studentId, updatedPath);

      return { ...state, studentPaths: newPaths };
    }

    case 'UPDATE_EDGE': {
      const path = state.studentPaths.get(action.payload.studentId);
      if (!path) return state;

      const updatedPath: StudentLearningPath = {
        ...path,
        edges: path.edges.map((edge) =>
          edge.id === action.payload.edgeId
            ? { ...edge, ...action.payload.changes }
            : edge
        ),
        lastModified: Date.now(),
      };

      const newPaths = new Map(state.studentPaths);
      newPaths.set(action.payload.studentId, updatedPath);

      return { ...state, studentPaths: newPaths };
    }

    case 'DELETE_EDGE': {
      const path = state.studentPaths.get(action.payload.studentId);
      if (!path) return state;

      const updatedPath: StudentLearningPath = {
        ...path,
        edges: path.edges.filter((e) => e.id !== action.payload.edgeId),
        lastModified: Date.now(),
      };

      const newPaths = new Map(state.studentPaths);
      newPaths.set(action.payload.studentId, updatedPath);

      return { ...state, studentPaths: newPaths };
    }

    case 'UPDATE_PROGRESS': {
      const path = state.studentPaths.get(action.payload.studentId);
      if (!path) return state;

      let completedCount = path.progress.completedNodes;
      const node = path.nodes.find((n) => n.id === action.payload.nodeId);

      if (
        node &&
        node.data.status !== 'completed' &&
        action.payload.status === 'completed'
      ) {
        completedCount++;
      }

      const updatedPath: StudentLearningPath = {
        ...path,
        nodes: path.nodes.map((n) =>
          n.id === action.payload.nodeId
            ? { ...n, data: { ...n.data, status: action.payload.status } }
            : n
        ),
        progress: {
          ...path.progress,
          completedNodes: completedCount,
          currentNodeId:
            action.payload.status === 'in_progress'
              ? action.payload.nodeId
              : path.progress.currentNodeId,
        },
        lastModified: Date.now(),
      };

      const newPaths = new Map(state.studentPaths);
      newPaths.set(action.payload.studentId, updatedPath);

      return { ...state, studentPaths: newPaths };
    }

    case 'SET_AI_RECOMMENDATION': {
      const path = state.studentPaths.get(action.payload.studentId);
      if (!path) return state;

      const updatedPath: StudentLearningPath = {
        ...path,
        aiRecommendation: action.payload.recommendation,
        lastModified: Date.now(),
      };

      const newPaths = new Map(state.studentPaths);
      newPaths.set(action.payload.studentId, updatedPath);

      return { ...state, studentPaths: newPaths };
    }

    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload };

    case 'OPEN_EDITOR':
      return {
        ...state,
        isEditorOpen: true,
        currentStudentId: action.payload,
      };

    case 'CLOSE_EDITOR':
      return { ...state, isEditorOpen: false };

    case 'LOAD_LEARNING_RECORD': {
      const newRecords = new Map(state.learningRecords);
      newRecords.set(action.payload.studentId, action.payload);
      return { ...state, learningRecords: newRecords };
    }

    default:
      return state;
  }
}

// ==================== Context ====================

interface LearningPathContextValue {
  state: LearningPathState;
  dispatch: React.Dispatch<LearningPathAction>;
}

const LearningPathContext = createContext<
  LearningPathContextValue | undefined
>(undefined);

export function LearningPathProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    learningPathReducer,
    initialLearningPathState
  );

  return (
    <LearningPathContext.Provider value={{ state, dispatch }}>
      {children}
    </LearningPathContext.Provider>
  );
}

export function useLearningPath() {
  const context = useContext(LearningPathContext);
  if (!context) {
    throw new Error(
      'useLearningPath must be used within LearningPathProvider'
    );
  }
  return context;
}

// ==================== Helper Hooks ====================

/**
 * 取得當前學生的學習路徑
 */
export function useCurrentStudentPath() {
  const { state } = useLearningPath();
  if (!state.currentStudentId) return null;
  return state.studentPaths.get(state.currentStudentId) || null;
}

/**
 * 取得當前學生的學習記錄
 */
export function useCurrentStudentRecord() {
  const { state } = useLearningPath();
  if (!state.currentStudentId) return null;
  return state.learningRecords.get(state.currentStudentId) || null;
}
