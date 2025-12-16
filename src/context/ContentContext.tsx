// context/ContentContext.tsx
import React, { createContext, useContext, useReducer, type ReactNode } from 'react';

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
  // 教科書內容
  textbookContent: any; // Tiptap 的 JSON 格式

  // EPUB 相關
  epubMetadata: {
    title: string;
    author: string;
    publisher: string;
    isbn?: string;
    version: string;
    lastModified: string;
    tags: string[];
  } | null;

  epubChapters: Array<{
    id: string;
    title: string;
    content: any; // Tiptap JSON
    order: number;
  }>;

  currentChapterId: string | null;

  // AI 狀態
  aiState: 'idle' | 'thinking' | 'processing' | 'done';

  // 載入狀態
  isLoading: boolean;
  loadingMessage: string;
}

// ==================== Actions ====================
export type ContentAction =
  | { type: 'SET_TEXTBOOK_CONTENT'; payload: any }
  | { type: 'SET_EPUB_METADATA'; payload: ContentState['epubMetadata'] }
  | { type: 'SET_EPUB_CHAPTERS'; payload: ContentState['epubChapters'] }
  | { type: 'ADD_EPUB_CHAPTER'; payload: ContentState['epubChapters'][0] }
  | { type: 'UPDATE_CHAPTER_CONTENT'; payload: { chapterId: string; content: any } }
  | { type: 'SET_CURRENT_CHAPTER'; payload: string }
  | { type: 'SET_AI_STATE'; payload: ContentState['aiState'] }
  | { type: 'SET_LOADING'; payload: { isLoading: boolean; message?: string } }
  | { type: 'IMPORT_EPUB'; payload: { metadata: ContentState['epubMetadata']; chapters: ContentState['epubChapters'] } };

// ==================== Initial State ====================
export const initialContentState: ContentState = {
  textbookContent: undefined,
  epubMetadata: null,
  epubChapters: [],
  currentChapterId: null,
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
        // 注意：不再設置 textbookContent，改用 useCurrentChapterContent() 衍生
      };

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
