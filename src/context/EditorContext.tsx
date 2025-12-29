// context/EditorContext.tsx
import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import { type UserRole } from '../config/toolConfig';
import type { Stroke, MindMapData, AIMemo, TextObject, SelectionBox, LaserPoint } from '../types';

// ==================== 編輯器狀態 ====================
export interface EditorState {
  // 用戶與權限
  userRole: UserRole;
  isEditMode: boolean;

  // 工具與畫筆
  currentTool: string;
  penColor: string;
  penSize: number;

  // 畫布數據
  strokes: Stroke[];
  mindMaps: MindMapData[];
  aiMemos: AIMemo[];
  textObjects: TextObject[];
  laserPath: LaserPoint[];

  // 選取狀態
  selectionBox: SelectionBox | null;
  selectionMenuPos: { top: number; left: number } | null;
  selectedText: string;

  // 特殊模式
  isStudentStage: boolean;

  // 視圖狀態 (持久化)
  viewport: { x: number; y: number; scale: number };
}

// ==================== Actions ====================
export type EditorAction =
  | { type: 'SET_USER_ROLE'; payload: UserRole }
  | { type: 'SET_EDIT_MODE'; payload: boolean }
  | { type: 'SET_CURRENT_TOOL'; payload: string }
  | { type: 'SET_PEN_COLOR'; payload: string }
  | { type: 'SET_PEN_SIZE'; payload: number }
  | { type: 'ADD_STROKE'; payload: Stroke }
  | { type: 'SET_STROKES'; payload: Stroke[] }
  | { type: 'ADD_MIND_MAP'; payload: MindMapData }
  | { type: 'UPDATE_MIND_MAP'; payload: { id: number; dx: number; dy: number } }
  | { type: 'DELETE_MIND_MAP'; payload: number }
  | { type: 'ADD_AI_MEMO'; payload: AIMemo }
  | { type: 'UPDATE_AI_MEMO'; payload: { id: number; dx: number; dy: number } }
  | { type: 'DELETE_AI_MEMO'; payload: number }
  | { type: 'ADD_TEXT_OBJECT'; payload: TextObject }
  | { type: 'UPDATE_TEXT_OBJECT'; payload: { id: number; data: Partial<TextObject> } }
  | { type: 'DELETE_TEXT_OBJECT'; payload: number }
  | { type: 'SET_SELECTION_BOX'; payload: SelectionBox | null }
  | { type: 'SET_SELECTION_MENU_POS'; payload: { top: number; left: number } | null }
  | { type: 'SET_SELECTED_TEXT'; payload: string }
  | { type: 'SET_LASER_PATH'; payload: LaserPoint[] }
  | { type: 'ADD_LASER_POINT'; payload: LaserPoint }
  | { type: 'TOGGLE_STUDENT_STAGE' }
  | { type: 'SET_VIEWPORT'; payload: { x: number; y: number; scale: number } };

// ==================== Initial State ====================
export const initialEditorState: EditorState = {
  userRole: 'teacher',
  isEditMode: false,
  currentTool: 'cursor',
  penColor: '#ef4444',
  penSize: 4,
  strokes: [],
  mindMaps: [],
  aiMemos: [],
  textObjects: [],
  laserPath: [],
  selectionBox: null,
  selectionMenuPos: null,
  selectedText: '粒線體結構與功能',
  isStudentStage: false,
  viewport: { x: 0, y: 0, scale: 1 },
};

// ==================== Reducer ====================
export function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_USER_ROLE': return { ...state, userRole: action.payload };
    case 'SET_EDIT_MODE': return { ...state, isEditMode: action.payload };
    case 'SET_CURRENT_TOOL': return { ...state, currentTool: action.payload };
    case 'SET_PEN_COLOR': return { ...state, penColor: action.payload };
    case 'SET_PEN_SIZE': return { ...state, penSize: action.payload };
    case 'ADD_STROKE': return { ...state, strokes: [...state.strokes, action.payload] };
    case 'SET_STROKES': return { ...state, strokes: action.payload };
    case 'ADD_MIND_MAP': return { ...state, mindMaps: [...state.mindMaps, action.payload] };
    case 'UPDATE_MIND_MAP':
      return { ...state, mindMaps: state.mindMaps.map(m => m.id === action.payload.id ? { ...m, x: m.x + action.payload.dx, y: m.y + action.payload.dy } : m) };
    case 'DELETE_MIND_MAP': return { ...state, mindMaps: state.mindMaps.filter(m => m.id !== action.payload) };
    case 'ADD_AI_MEMO': return { ...state, aiMemos: [...state.aiMemos, action.payload] };
    case 'UPDATE_AI_MEMO':
      return { ...state, aiMemos: state.aiMemos.map(m => m.id === action.payload.id ? { ...m, x: m.x + action.payload.dx, y: m.y + action.payload.dy } : m) };
    case 'DELETE_AI_MEMO': return { ...state, aiMemos: state.aiMemos.filter(m => m.id !== action.payload) };
    case 'ADD_TEXT_OBJECT': return { ...state, textObjects: [...state.textObjects, action.payload] };
    case 'UPDATE_TEXT_OBJECT':
      return { ...state, textObjects: state.textObjects.map(t => t.id === action.payload.id ? { ...t, ...action.payload.data } : t) };
    case 'DELETE_TEXT_OBJECT': return { ...state, textObjects: state.textObjects.filter(t => t.id !== action.payload) };
    case 'SET_SELECTION_BOX': return { ...state, selectionBox: action.payload };
    case 'SET_SELECTION_MENU_POS': return { ...state, selectionMenuPos: action.payload };
    case 'SET_SELECTED_TEXT': return { ...state, selectedText: action.payload };
    case 'SET_LASER_PATH': return { ...state, laserPath: action.payload };
    case 'ADD_LASER_POINT': return { ...state, laserPath: [...state.laserPath, action.payload] };
    case 'TOGGLE_STUDENT_STAGE': return { ...state, isStudentStage: !state.isStudentStage };
    case 'SET_VIEWPORT': return { ...state, viewport: action.payload };
    default: return state;
  }
}

// ==================== Context ====================
interface EditorContextValue {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
}

const EditorContext = createContext<EditorContextValue | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, initialEditorState);
  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) throw new Error('useEditor must be used within EditorProvider');
  return context;
}
