// ========================================
// 📁 src/context/index.tsx
// 功能：統一匯出所有 Context
// ========================================
import { type ReactNode } from 'react';
import { EditorProvider } from './EditorContext';
import { ContentProvider } from './ContentContext';
import { UIProvider } from './UIContext';
import { CollaborationProvider } from './CollaborationContext';

// 匯出所有 Context
export * from './EditorContext';
export * from './ContentContext';
export * from './UIContext';
export * from './CollaborationContext';

// 組合所有 Provider
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <EditorProvider>
      <ContentProvider>
        <UIProvider>
          <CollaborationProvider>
            {children}
          </CollaborationProvider>
        </UIProvider>
      </ContentProvider>
    </EditorProvider>
  );
}