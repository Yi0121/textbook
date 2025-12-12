// ========================================
// 📁 src/context/CanvasContext.tsx
// 功能：管理畫布資料（筆跡、物件）
// ========================================
import React, { createContext, useContext, useReducer, type ReactNode } from 'react';

// 型別定義
export interface CanvasState {
  strokes: any[];
  mindMaps: any[];
  aiMemos: any[];
  textObjects: any[];
}

type CanvasAction =
  | { type: 'ADD_STROKE'; payload: any }
  | { type: 'SET_STROKES'; payload: any[] }
  | { type: 'ADD_MIND_MAP'; payload: any }
  | { type: 'UPDATE_MIND_MAP'; payload: { id: number; dx: number; dy: number } }
  | { type: 'DELETE_MIND_MAP'; payload: number }
  | { type: 'ADD_AI_MEMO'; payload: any }
  | { type: 'UPDATE_AI_MEMO'; payload: { id: number; dx: number; dy: number } }
  | { type: 'DELETE_AI_MEMO'; payload: number }
  | { type: 'ADD_TEXT_OBJECT'; payload: any }
  | { type: 'UPDATE_TEXT_OBJECT'; payload: { id: number; data: any } }
  | { type: 'DELETE_TEXT_OBJECT'; payload: number };

const initialState: CanvasState = {
  strokes: [],
  mindMaps: [],
  aiMemos: [],
  textObjects: [],
};

function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {
    case 'ADD_STROKE':
      return { ...state, strokes: [...state.strokes, action.payload] };
    case 'SET_STROKES':
      return { ...state, strokes: action.payload };
    case 'ADD_MIND_MAP':
      return { ...state, mindMaps: [...state.mindMaps, action.payload] };
    case 'UPDATE_MIND_MAP':
      return {
        ...state,
        mindMaps: state.mindMaps.map(m =>
          m.id === action.payload.id
            ? { ...m, x: m.x + action.payload.dx, y: m.y + action.payload.dy }
            : m
        ),
      };
    case 'DELETE_MIND_MAP':
      return { ...state, mindMaps: state.mindMaps.filter(m => m.id !== action.payload) };
    case 'ADD_AI_MEMO':
      return { ...state, aiMemos: [...state.aiMemos, action.payload] };
    case 'UPDATE_AI_MEMO':
      return {
        ...state,
        aiMemos: state.aiMemos.map(m =>
          m.id === action.payload.id
            ? { ...m, x: m.x + action.payload.dx, y: m.y + action.payload.dy }
            : m
        ),
      };
    case 'DELETE_AI_MEMO':
      return { ...state, aiMemos: state.aiMemos.filter(m => m.id !== action.payload) };
    case 'ADD_TEXT_OBJECT':
      return { ...state, textObjects: [...state.textObjects, action.payload] };
    case 'UPDATE_TEXT_OBJECT':
      return {
        ...state,
        textObjects: state.textObjects.map(t =>
          t.id === action.payload.id ? { ...t, ...action.payload.data } : t
        ),
      };
    case 'DELETE_TEXT_OBJECT':
      return { ...state, textObjects: state.textObjects.filter(t => t.id !== action.payload) };
    default:
      return state;
  }
}

const CanvasContext = createContext<{
  state: CanvasState;
  dispatch: React.Dispatch<CanvasAction>;
} | undefined>(undefined);

export function CanvasProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(canvasReducer, initialState);
  return <CanvasContext.Provider value={{ state, dispatch }}>{children}</CanvasContext.Provider>;
}

export function useCanvas() {
  const context = useContext(CanvasContext);
  if (!context) throw new Error('useCanvas must be used within CanvasProvider');
  return context;
}