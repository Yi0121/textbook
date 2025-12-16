// context/index.ts
// Context Providers
export { EditorProvider, useEditor } from './EditorContext';
export { ContentProvider, useContent, useCurrentChapter, useCurrentChapterContent, useChapterNavigation } from './ContentContext';
export { UIProvider, useUI } from './UIContext';
export { CollaborationProvider, useCollaboration, useCurrentWhiteboard, useWhiteboardActions } from './CollaborationContext';
export { AppProviders } from './IndexContext';

// Types (re-export for convenience)
export type { EditorState, EditorAction } from './EditorContext';
export type { ContentState, ContentAction } from './ContentContext';
export type { CollaborationState, CollaborationAction, WhiteboardData } from './CollaborationContext';
