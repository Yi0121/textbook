import React, { createContext, useContext, useReducer, type ReactNode, useCallback } from 'react';
import { type UserRole } from '../config/toolConfig';

// ==================== 1. State Interface (定義資料結構) ====================
export interface AppState {
  userRole: UserRole;
  isEditMode: boolean;
  viewport: { x: number; y: number; scale: number };
  currentTool: string;
  penColor: string;
  penSize: number;
  strokes: any[];
  mindMaps: any[];
  aiMemos: any[];
  textObjects: any[];
  isSidebarOpen: boolean;
  isQuizPanelOpen: boolean;
  sidebarInitialTab: 'context' | 'chat';
  isDashboardOpen: boolean;
  isTimerOpen: boolean;
  showNavGrid: boolean;
  isLuckyDrawOpen: boolean;
  widgetMode: 'none' | 'spotlight' | 'curtain';
  aiState: 'idle' | 'thinking' | 'done';
  selectedText: string;
  textbookContent: any;
  selectionBox: any;
  selectionMenuPos: any;
  laserPath: { x: number; y: number; timestamp: number }[];
}

// ==================== 2. Actions (定義所有可以做的動作) ====================
export type AppAction =
  | { type: 'SET_USER_ROLE'; payload: UserRole }
  | { type: 'SET_EDIT_MODE'; payload: boolean }
  | { type: 'SET_VIEWPORT'; payload: Partial<AppState['viewport']> }
  | { type: 'SET_CURRENT_TOOL'; payload: string }
  | { type: 'SET_PEN_COLOR'; payload: string }
  | { type: 'SET_PEN_SIZE'; payload: number }
  | { type: 'ADD_STROKE'; payload: any }
  | { type: 'SET_STROKES'; payload: any[] }
  | { type: 'ADD_MIND_MAP'; payload: any }
  | { type: 'UPDATE_MIND_MAP'; payload: { id: number; dx: number; dy: number } }
  | { type: 'DELETE_MIND_MAP'; payload: number }
  | { type: 'SET_MIND_MAPS'; payload: any[] }
  | { type: 'ADD_AI_MEMO'; payload: any }
  | { type: 'UPDATE_AI_MEMO'; payload: { id: number; dx: number; dy: number } }
  | { type: 'DELETE_AI_MEMO'; payload: number }
  | { type: 'SET_AI_MEMOS'; payload: any[] }
  | { type: 'ADD_TEXT_OBJECT'; payload: any }
  | { type: 'UPDATE_TEXT_OBJECT'; payload: { id: number; data: any } }
  | { type: 'DELETE_TEXT_OBJECT'; payload: number }
  | { type: 'SET_TEXT_OBJECTS'; payload: any[] }
  | { type: 'SET_SIDEBAR_OPEN'; payload: boolean }
  | { type: 'SET_QUIZ_PANEL_OPEN'; payload: boolean }
  | { type: 'SET_SIDEBAR_INITIAL_TAB'; payload: 'context' | 'chat' }
  | { type: 'SET_DASHBOARD_OPEN'; payload: boolean }
  | { type: 'SET_TIMER_OPEN'; payload: boolean }
  | { type: 'SET_SHOW_NAV_GRID'; payload: boolean }
  | { type: 'SET_LUCKY_DRAW_OPEN'; payload: boolean }
  | { type: 'SET_WIDGET_MODE'; payload: 'none' | 'spotlight' | 'curtain' }
  | { type: 'SET_AI_STATE'; payload: 'idle' | 'thinking' | 'done' }
  | { type: 'SET_SELECTED_TEXT'; payload: string }
  | { type: 'SET_TEXTBOOK_CONTENT'; payload: any }
  | { type: 'SET_SELECTION_BOX'; payload: any }
  | { type: 'SET_SELECTION_MENU_POS'; payload: any }
  | { type: 'SET_LASER_PATH'; payload: { x: number; y: number; timestamp: number }[] }
  | { type: 'ADD_LASER_POINT'; payload: { x: number; y: number; timestamp: number } };

// ==================== 3. Initial State (初始值) ====================
export const initialState: AppState = {
  userRole: 'teacher',
  isEditMode: false,
  viewport: { x: 0, y: 0, scale: 1 },
  currentTool: 'cursor',
  penColor: '#ef4444',
  penSize: 4,
  strokes: [],
  mindMaps: [],
  aiMemos: [],
  textObjects: [],
  isSidebarOpen: false,
  isQuizPanelOpen: false,
  sidebarInitialTab: 'context',
  isDashboardOpen: false,
  isTimerOpen: false,
  showNavGrid: false,
  isLuckyDrawOpen: false,
  widgetMode: 'none',
  aiState: 'idle',
  selectedText: '粒線體結構與功能',
  textbookContent: undefined,
  selectionBox: null,
  selectionMenuPos: null,
  laserPath: [],
};

// ==================== 4. Reducer (大腦：處理狀態變更) ====================
export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER_ROLE': return { ...state, userRole: action.payload };
    case 'SET_EDIT_MODE': return { ...state, isEditMode: action.payload };
    case 'SET_VIEWPORT': return { ...state, viewport: { ...state.viewport, ...action.payload } };
    case 'SET_CURRENT_TOOL': return { ...state, currentTool: action.payload };
    case 'SET_PEN_COLOR': return { ...state, penColor: action.payload };
    case 'SET_PEN_SIZE': return { ...state, penSize: action.payload };
    case 'ADD_STROKE': return { ...state, strokes: [...state.strokes, action.payload] };
    case 'SET_STROKES': return { ...state, strokes: action.payload };
    case 'ADD_MIND_MAP': return { ...state, mindMaps: [...state.mindMaps, action.payload] };
    case 'UPDATE_MIND_MAP':
      return { ...state, mindMaps: state.mindMaps.map(m => m.id === action.payload.id ? { ...m, x: m.x + action.payload.dx, y: m.y + action.payload.dy } : m) };
    case 'DELETE_MIND_MAP': return { ...state, mindMaps: state.mindMaps.filter(m => m.id !== action.payload) };
    case 'SET_MIND_MAPS': return { ...state, mindMaps: action.payload };
    case 'ADD_AI_MEMO': return { ...state, aiMemos: [...state.aiMemos, action.payload] };
    case 'UPDATE_AI_MEMO':
      return { ...state, aiMemos: state.aiMemos.map(m => m.id === action.payload.id ? { ...m, x: m.x + action.payload.dx, y: m.y + action.payload.dy } : m) };
    case 'DELETE_AI_MEMO': return { ...state, aiMemos: state.aiMemos.filter(m => m.id !== action.payload) };
    case 'SET_AI_MEMOS': return { ...state, aiMemos: action.payload };
    case 'ADD_TEXT_OBJECT': return { ...state, textObjects: [...state.textObjects, action.payload] };
    case 'UPDATE_TEXT_OBJECT':
      return { ...state, textObjects: state.textObjects.map(t => t.id === action.payload.id ? { ...t, ...action.payload.data } : t) };
    case 'DELETE_TEXT_OBJECT': return { ...state, textObjects: state.textObjects.filter(t => t.id !== action.payload) };
    case 'SET_TEXT_OBJECTS': return { ...state, textObjects: action.payload };
    case 'SET_SIDEBAR_OPEN': return { ...state, isSidebarOpen: action.payload };
    case 'SET_QUIZ_PANEL_OPEN': return { ...state, isQuizPanelOpen: action.payload };
    case 'SET_SIDEBAR_INITIAL_TAB': return { ...state, sidebarInitialTab: action.payload };
    case 'SET_DASHBOARD_OPEN': return { ...state, isDashboardOpen: action.payload };
    case 'SET_TIMER_OPEN': return { ...state, isTimerOpen: action.payload };
    case 'SET_SHOW_NAV_GRID': return { ...state, showNavGrid: action.payload };
    case 'SET_LUCKY_DRAW_OPEN': return { ...state, isLuckyDrawOpen: action.payload };
    case 'SET_WIDGET_MODE': return { ...state, widgetMode: action.payload };
    case 'SET_AI_STATE': return { ...state, aiState: action.payload };
    case 'SET_SELECTED_TEXT': return { ...state, selectedText: action.payload };
    case 'SET_TEXTBOOK_CONTENT': return { ...state, textbookContent: action.payload };
    case 'SET_SELECTION_BOX': return { ...state, selectionBox: action.payload };
    case 'SET_SELECTION_MENU_POS': return { ...state, selectionMenuPos: action.payload };
    case 'SET_LASER_PATH': return { ...state, laserPath: action.payload };
    case 'ADD_LASER_POINT': return { ...state, laserPath: [...state.laserPath, action.payload] };
    default: return state;
  }
}

// ==================== 5. Provider & Core Hook ====================
interface AppContextValue {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}
const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}

// ==================== 6. 新功能 Hooks (分擔 App.tsx 的工作) ====================

// [UI 控制] 管理 Sidebar, Modal 等開關
export function useUIState() {
    const { state, dispatch } = useAppContext();
    return {
        isSidebarOpen: state.isSidebarOpen,
        isQuizPanelOpen: state.isQuizPanelOpen,
        sidebarInitialTab: state.sidebarInitialTab,
        isDashboardOpen: state.isDashboardOpen,
        isTimerOpen: state.isTimerOpen,
        showNavGrid: state.showNavGrid,
        isLuckyDrawOpen: state.isLuckyDrawOpen,
        widgetMode: state.widgetMode,
        
        // 動作
        setSidebarOpen: (v: boolean) => dispatch({ type: 'SET_SIDEBAR_OPEN', payload: v }),
        setQuizPanelOpen: (v: boolean) => dispatch({ type: 'SET_QUIZ_PANEL_OPEN', payload: v }),
        setSidebarInitialTab: (v: 'context' | 'chat') => dispatch({ type: 'SET_SIDEBAR_INITIAL_TAB', payload: v }),
        setDashboardOpen: (v: boolean) => dispatch({ type: 'SET_DASHBOARD_OPEN', payload: v }),
        setTimerOpen: (v: boolean) => dispatch({ type: 'SET_TIMER_OPEN', payload: v }),
        setShowNavGrid: (v: boolean) => dispatch({ type: 'SET_SHOW_NAV_GRID', payload: v }),
        setLuckyDrawOpen: (v: boolean) => dispatch({ type: 'SET_LUCKY_DRAW_OPEN', payload: v }),
        setWidgetMode: (v: 'none' | 'spotlight' | 'curtain') => dispatch({ type: 'SET_WIDGET_MODE', payload: v }),
    };
}

// [資料控制] 管理畫布上的物件 (筆跡、心智圖、便利貼)
export function useCanvasData() {
    const { state, dispatch } = useAppContext();
    
    // 🔥 重要修正：這裡的 data 使用 any，以相容「心智圖的移動 {dx,dy}」和「文字的更新 {text,color...}」
    const updateObject = useCallback((id: number, data: any, type: 'memo' | 'mindmap' | 'text') => {
        if (type === 'memo') {
             dispatch({ type: 'UPDATE_AI_MEMO', payload: { id, dx: data.dx, dy: data.dy } });
        }
        else if (type === 'mindmap') {
             dispatch({ type: 'UPDATE_MIND_MAP', payload: { id, dx: data.dx, dy: data.dy } });
        }
        else if (type === 'text') {
             dispatch({ type: 'UPDATE_TEXT_OBJECT', payload: { id, data: data } }); 
        }
    }, [dispatch]);

    return {
        strokes: state.strokes,
        mindMaps: state.mindMaps,
        aiMemos: state.aiMemos,
        textObjects: state.textObjects,
        
        addStroke: (stroke: any) => dispatch({ type: 'ADD_STROKE', payload: stroke }),
        setStrokes: (strokes: any[]) => dispatch({ type: 'SET_STROKES', payload: strokes }),
        
        addMindMap: (map: any) => dispatch({ type: 'ADD_MIND_MAP', payload: map }),
        deleteMindMap: (id: number) => dispatch({ type: 'DELETE_MIND_MAP', payload: id }),
        
        addAIMemo: (memo: any) => dispatch({ type: 'ADD_AI_MEMO', payload: memo }),
        deleteAIMemo: (id: number) => dispatch({ type: 'DELETE_AI_MEMO', payload: id }),

        addTextObject: (text: any) => dispatch({ type: 'ADD_TEXT_OBJECT', payload: text }),
        deleteTextObject: (id: number) => dispatch({ type: 'DELETE_TEXT_OBJECT', payload: id }),
        setTextObjects: (texts: any[]) => dispatch({ type: 'SET_TEXT_OBJECTS', payload: texts }),

        updateObject, 
    };
}

// [AI 狀態] 管理 AI 思考中狀態
export function useAIState() {
    const { state, dispatch } = useAppContext();
    return {
        aiState: state.aiState,
        textbookContent: state.textbookContent,
        setAiState: (s: 'idle' | 'thinking' | 'done') => dispatch({ type: 'SET_AI_STATE', payload: s }),
        setTextbookContent: (content: any) => dispatch({ type: 'SET_TEXTBOOK_CONTENT', payload: content }),
    };
}

// ==================== 7. 相容性 Hooks (修復 App.tsx 的錯誤) ====================
// 這些 Hook 讓 App.tsx 可以繼續使用原本的寫法，但底層已經改成用 Context 了

export function useUserRole() {
  const { state, dispatch } = useAppContext();
  // 回傳格式 [值, 設定函式]
  return [
    state.userRole,
    (role: UserRole) => dispatch({ type: 'SET_USER_ROLE', payload: role })
  ] as const;
}

export function useEditMode() {
  const { state, dispatch } = useAppContext();
  return [
    state.isEditMode,
    (mode: boolean) => dispatch({ type: 'SET_EDIT_MODE', payload: mode })
  ] as const;
}

export function useCurrentTool() {
  const { state, dispatch } = useAppContext();
  return [
    state.currentTool,
    (tool: string) => dispatch({ type: 'SET_CURRENT_TOOL', payload: tool })
  ] as const;
}