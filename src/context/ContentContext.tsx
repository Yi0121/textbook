// context/ContentContext.tsx
import React, { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { TiptapContent, EPUBMetadata, EPUBChapter, FabricPage, EPUBSource } from '../types';

// ==================== TextbookContent 類型 ====================
export interface TextbookPage {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  content: string;
  chapter: number;
  imageUrl?: string;
}

export interface TextbookContent {
  title: string;
  author: string;
  pages: TextbookPage[];
}

// ==================== 內容狀態 ====================
export interface ContentState {
  // 教科書內容 (Tiptap - 向後相容)
  textbookContent: TiptapContent | undefined;

  // EPUB 相關 (向後相容)
  epubMetadata: EPUBMetadata | null;
  epubChapters: EPUBChapter[];
  currentChapterId: string | null;

  // Fabric.js 頁面系統 (新架構)
  fabricPages: FabricPage[];
  epubSources: EPUBSource[];
  currentPageId: string | null;

  // AI 狀態
  aiState: 'idle' | 'thinking' | 'processing' | 'done';

  // 載入狀態
  isLoading: boolean;
  loadingMessage: string;
}

// ==================== Actions ====================
export type ContentAction =
  // Tiptap 相關 (向後相容)
  | { type: 'SET_TEXTBOOK_CONTENT'; payload: TiptapContent | undefined }
  | { type: 'SET_EPUB_METADATA'; payload: EPUBMetadata | null }
  | { type: 'SET_EPUB_CHAPTERS'; payload: EPUBChapter[] }
  | { type: 'ADD_EPUB_CHAPTER'; payload: EPUBChapter }
  | { type: 'UPDATE_CHAPTER_CONTENT'; payload: { chapterId: string; content: TiptapContent | string } }
  | { type: 'SET_CURRENT_CHAPTER'; payload: string }
  | { type: 'IMPORT_EPUB'; payload: { metadata: EPUBMetadata | null; chapters: EPUBChapter[] } }
  // Fabric.js 頁面系統 (新架構)
  | { type: 'APPEND_EPUB'; payload: { source: EPUBSource; pages: FabricPage[] } }
  | { type: 'ADD_FABRIC_PAGE'; payload: FabricPage }
  | { type: 'UPDATE_FABRIC_PAGE'; payload: { id: string; changes: Partial<FabricPage> } }
  | { type: 'MOVE_FABRIC_PAGE'; payload: { id: string; x: number; y: number } }
  | { type: 'DELETE_FABRIC_PAGE'; payload: string }
  | { type: 'SET_CURRENT_PAGE'; payload: string | null }
  | { type: 'DELETE_EPUB_SOURCE'; payload: string }
  // 通用
  | { type: 'SET_AI_STATE'; payload: ContentState['aiState'] }
  | { type: 'SET_LOADING'; payload: { isLoading: boolean; message?: string } };

// ==================== Initial State ====================
export const initialContentState: ContentState = {
  // Tiptap (向後相容)
  textbookContent: undefined,
  epubMetadata: null,
  epubChapters: [],
  currentChapterId: null,
  // Fabric.js 頁面系統
  fabricPages: [],
  epubSources: [],
  currentPageId: null,
  // 通用
  aiState: 'idle',
  isLoading: true,
  loadingMessage: '載入教材中...',
};

// ==================== Reducer ====================
export function contentReducer(state: ContentState, action: ContentAction): ContentState {
  switch (action.type) {
    case 'SET_TEXTBOOK_CONTENT':
      return { ...state, textbookContent: action.payload };

    case 'SET_EPUB_METADATA':
      return { ...state, epubMetadata: action.payload };

    case 'SET_EPUB_CHAPTERS':
      return { ...state, epubChapters: action.payload };

    case 'ADD_EPUB_CHAPTER':
      return { ...state, epubChapters: [...state.epubChapters, action.payload].sort((a, b) => a.order - b.order) };

    case 'UPDATE_CHAPTER_CONTENT':
      return {
        ...state,
        epubChapters: state.epubChapters.map(ch =>
          ch.id === action.payload.chapterId
            ? { ...ch, content: action.payload.content }
            : ch
        ),
      };

    case 'SET_CURRENT_CHAPTER':
      return { ...state, currentChapterId: action.payload };

    case 'SET_AI_STATE':
      return { ...state, aiState: action.payload };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload.isLoading,
        loadingMessage: action.payload.message || state.loadingMessage,
      };

    case 'IMPORT_EPUB':
      return {
        ...state,
        epubMetadata: action.payload.metadata,
        epubChapters: action.payload.chapters,
        currentChapterId: action.payload.chapters[0]?.id || null,
      };

    // ==================== Fabric.js 頁面系統 ====================

    case 'APPEND_EPUB':
      return {
        ...state,
        epubSources: [...state.epubSources, action.payload.source],
        fabricPages: [...state.fabricPages, ...action.payload.pages],
        currentPageId: action.payload.pages[0]?.id || state.currentPageId,
      };

    case 'ADD_FABRIC_PAGE':
      return {
        ...state,
        fabricPages: [...state.fabricPages, action.payload],
      };

    case 'UPDATE_FABRIC_PAGE':
      return {
        ...state,
        fabricPages: state.fabricPages.map(page =>
          page.id === action.payload.id
            ? { ...page, ...action.payload.changes }
            : page
        ),
      };

    case 'MOVE_FABRIC_PAGE':
      return {
        ...state,
        fabricPages: state.fabricPages.map(page =>
          page.id === action.payload.id
            ? { ...page, x: action.payload.x, y: action.payload.y }
            : page
        ),
      };

    case 'DELETE_FABRIC_PAGE':
      return {
        ...state,
        fabricPages: state.fabricPages.filter(page => page.id !== action.payload),
        currentPageId: state.currentPageId === action.payload ? null : state.currentPageId,
      };

    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPageId: action.payload,
      };

    case 'DELETE_EPUB_SOURCE': {
      const sourceToDelete = state.epubSources.find(s => s.id === action.payload);
      if (!sourceToDelete) return state;
      return {
        ...state,
        epubSources: state.epubSources.filter(s => s.id !== action.payload),
        fabricPages: state.fabricPages.filter(page => page.sourceId !== action.payload),
        currentPageId: sourceToDelete.pageIds.includes(state.currentPageId || '')
          ? null
          : state.currentPageId,
      };
    }

    default:
      return state;
  }
}

// ==================== Context ====================
interface ContentContextValue {
  state: ContentState;
  dispatch: React.Dispatch<ContentAction>;
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(contentReducer, initialContentState);
  return (
    <ContentContext.Provider value={{ state, dispatch }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContent must be used within ContentProvider');
  return context;
}

// ==================== Helper Hooks ====================

/**
 * 取得當前章節
 */
export function useCurrentChapter() {
  const { state } = useContent();
  return state.epubChapters.find(ch => ch.id === state.currentChapterId);
}

/**
 * 取得當前章節內容（衍生狀態，避免冗餘）
 * 優先使用 EPUB 章節內容，否則回退到 textbookContent
 */
export function useCurrentChapterContent() {
  const { state } = useContent();
  const currentChapter = state.epubChapters.find(ch => ch.id === state.currentChapterId);
  // 如果有 EPUB 章節，使用章節內容；否則使用 textbookContent
  return currentChapter?.content ?? state.textbookContent;
}

/**
 * 切換章節
 */
export function useChapterNavigation() {
  const { state, dispatch } = useContent();

  const goToChapter = (chapterId: string) => {
    const chapter = state.epubChapters.find(ch => ch.id === chapterId);
    if (chapter) {
      dispatch({ type: 'SET_CURRENT_CHAPTER', payload: chapterId });
    }
  };

  const nextChapter = () => {
    const currentIndex = state.epubChapters.findIndex(ch => ch.id === state.currentChapterId);
    if (currentIndex < state.epubChapters.length - 1) {
      goToChapter(state.epubChapters[currentIndex + 1].id);
    }
  };

  const prevChapter = () => {
    const currentIndex = state.epubChapters.findIndex(ch => ch.id === state.currentChapterId);
    if (currentIndex > 0) {
      goToChapter(state.epubChapters[currentIndex - 1].id);
    }
  };

  return { goToChapter, nextChapter, prevChapter };
}

// ==================== Fabric.js 頁面 Hooks ====================

/**
 * 取得當前選中的 Fabric 頁面
 */
export function useCurrentFabricPage() {
  const { state } = useContent();
  return state.fabricPages.find(page => page.id === state.currentPageId);
}

/**
 * 取得所有 Fabric 頁面
 */
export function useFabricPages() {
  const { state } = useContent();
  return state.fabricPages;
}

/**
 * 取得所有 EPUB 來源
 */
export function useEPUBSources() {
  const { state } = useContent();
  return state.epubSources;
}

/**
 * Fabric 頁面導航
 */
export function useFabricPageNavigation() {
  const { state, dispatch } = useContent();

  const goToPage = (pageId: string) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: pageId });
  };

  const nextPage = () => {
    const currentIndex = state.fabricPages.findIndex(p => p.id === state.currentPageId);
    if (currentIndex < state.fabricPages.length - 1) {
      goToPage(state.fabricPages[currentIndex + 1].id);
    }
  };

  const prevPage = () => {
    const currentIndex = state.fabricPages.findIndex(p => p.id === state.currentPageId);
    if (currentIndex > 0) {
      goToPage(state.fabricPages[currentIndex - 1].id);
    }
  };

  return { goToPage, nextPage, prevPage };
}
