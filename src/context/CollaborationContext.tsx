// context/CollaborationContext.tsx
import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { WhiteboardStroke } from '../types';

// ==================== 協作狀態 ====================
export interface WhiteboardData {
  id: string;
  title: string;
  createdBy: string;
  createdAt: number;
  strokes: WhiteboardStroke[];
  participants: string[];
  isActive: boolean;
}

export interface CollaborationState {
  // 電子白板
  whiteboards: WhiteboardData[];
  currentWhiteboardId: string | null;

  // 參與者狀態
  participants: Array<{
    id: string;
    name: string;
    role: 'teacher' | 'student';
    cursorPosition?: { x: number; y: number };
    isActive: boolean;
  }>;

  // 協作模式
  collaborationMode: 'none' | 'whiteboard' | 'shared-canvas';

  // 當前用戶
  currentUserId: string;
}

// ==================== Actions ====================
export type CollaborationAction =
  | { type: 'CREATE_WHITEBOARD'; payload: { title: string; createdBy: string } }
  | { type: 'OPEN_WHITEBOARD'; payload: string }
  | { type: 'CLOSE_WHITEBOARD' }
  | { type: 'DELETE_WHITEBOARD'; payload: string }
  | { type: 'ADD_WHITEBOARD_STROKE'; payload: { whiteboardId: string; stroke: WhiteboardStroke } }
  | { type: 'CLEAR_WHITEBOARD'; payload: string }
  | { type: 'ADD_PARTICIPANT'; payload: CollaborationState['participants'][0] }
  | { type: 'REMOVE_PARTICIPANT'; payload: string }
  | { type: 'UPDATE_PARTICIPANT_CURSOR'; payload: { id: string; position: { x: number; y: number } } }
  | { type: 'SET_COLLABORATION_MODE'; payload: CollaborationState['collaborationMode'] }
  | { type: 'SET_CURRENT_USER'; payload: string };

// ==================== Helper Functions ====================
const STORAGE_KEY = 'textbook-user-id';

function getOrCreateUserId(): string {
  if (typeof window === 'undefined') {
    return 'user-' + Math.random().toString(36).substring(2, 11);
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return stored;
  const newId = 'user-' + crypto.randomUUID();
  localStorage.setItem(STORAGE_KEY, newId);
  return newId;
}

// ==================== Initial State ====================
export const initialCollaborationState: CollaborationState = {
  whiteboards: [],
  currentWhiteboardId: null,
  participants: [],
  collaborationMode: 'none',
  currentUserId: getOrCreateUserId(),
};

// ==================== Reducer ====================
export function collaborationReducer(
  state: CollaborationState,
  action: CollaborationAction
): CollaborationState {
  switch (action.type) {
    case 'CREATE_WHITEBOARD': {
      const newWhiteboard: WhiteboardData = {
        id: 'wb-' + Date.now(),
        title: action.payload.title,
        createdBy: action.payload.createdBy,
        createdAt: Date.now(),
        strokes: [],
        participants: [action.payload.createdBy],
        isActive: true,
      };
      return {
        ...state,
        whiteboards: [...state.whiteboards, newWhiteboard],
        currentWhiteboardId: newWhiteboard.id,
        collaborationMode: 'whiteboard',
      };
    }

    case 'OPEN_WHITEBOARD':
      return {
        ...state,
        currentWhiteboardId: action.payload,
        collaborationMode: 'whiteboard',
      };

    case 'CLOSE_WHITEBOARD':
      return {
        ...state,
        currentWhiteboardId: null,
        collaborationMode: 'none',
      };

    case 'DELETE_WHITEBOARD':
      return {
        ...state,
        whiteboards: state.whiteboards.filter(wb => wb.id !== action.payload),
        currentWhiteboardId: state.currentWhiteboardId === action.payload ? null : state.currentWhiteboardId,
      };

    case 'ADD_WHITEBOARD_STROKE':
      return {
        ...state,
        whiteboards: state.whiteboards.map(wb =>
          wb.id === action.payload.whiteboardId
            ? { ...wb, strokes: [...wb.strokes, action.payload.stroke] }
            : wb
        ),
      };

    case 'CLEAR_WHITEBOARD':
      return {
        ...state,
        whiteboards: state.whiteboards.map(wb =>
          wb.id === action.payload ? { ...wb, strokes: [] } : wb
        ),
      };

    case 'ADD_PARTICIPANT':
      return {
        ...state,
        participants: [...state.participants, action.payload],
      };

    case 'REMOVE_PARTICIPANT':
      return {
        ...state,
        participants: state.participants.filter(p => p.id !== action.payload),
      };

    case 'UPDATE_PARTICIPANT_CURSOR':
      return {
        ...state,
        participants: state.participants.map(p =>
          p.id === action.payload.id
            ? { ...p, cursorPosition: action.payload.position }
            : p
        ),
      };

    case 'SET_COLLABORATION_MODE':
      return { ...state, collaborationMode: action.payload };

    case 'SET_CURRENT_USER':
      return { ...state, currentUserId: action.payload };

    default:
      return state;
  }
}

// ==================== Context ====================
interface CollaborationContextValue {
  state: CollaborationState;
  dispatch: React.Dispatch<CollaborationAction>;
}

const CollaborationContext = createContext<CollaborationContextValue | undefined>(undefined);

export function CollaborationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(collaborationReducer, initialCollaborationState);
  return (
    <CollaborationContext.Provider value={{ state, dispatch }}>
      {children}
    </CollaborationContext.Provider>
  );
}

export function useCollaboration() {
  const context = useContext(CollaborationContext);
  if (!context) throw new Error('useCollaboration must be used within CollaborationProvider');
  return context;
}

// ==================== Helper Hooks ====================

/**
 * 取得當前白板
 */
export function useCurrentWhiteboard() {
  const { state } = useCollaboration();
  return state.whiteboards.find(wb => wb.id === state.currentWhiteboardId);
}

/**
 * 白板操作
 */
export function useWhiteboardActions() {
  const { dispatch } = useCollaboration();

  const createWhiteboard = (title: string, createdBy: string) => {
    dispatch({ type: 'CREATE_WHITEBOARD', payload: { title, createdBy } });
  };

  const openWhiteboard = (id: string) => {
    dispatch({ type: 'OPEN_WHITEBOARD', payload: id });
  };

  const closeWhiteboard = () => {
    dispatch({ type: 'CLOSE_WHITEBOARD' });
  };

  const deleteWhiteboard = (id: string) => {
    dispatch({ type: 'DELETE_WHITEBOARD', payload: id });
  };

  const clearWhiteboard = (id: string) => {
    dispatch({ type: 'CLEAR_WHITEBOARD', payload: id });
  };

  const addStroke = (whiteboardId: string, stroke: WhiteboardStroke) => {
    dispatch({ type: 'ADD_WHITEBOARD_STROKE', payload: { whiteboardId, stroke } });
  };

  return {
    createWhiteboard,
    openWhiteboard,
    closeWhiteboard,
    deleteWhiteboard,
    clearWhiteboard,
    addStroke,
  };
}
