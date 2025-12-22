// ========================================
// 📁 src/context/index.tsx
// 功能：統一匯出所有 Context
// ========================================
import { type ReactNode } from 'react';
import { EditorProvider } from './EditorContext';
import { ContentProvider } from './ContentContext';
import { UIProvider } from './UIContext';
import { CollaborationProvider } from './CollaborationContext';
import { LearningPathProvider } from './LearningPathContext';
import { AgentProvider } from './AgentContext';

// 匯出所有 Context
export * from './EditorContext';
export * from './ContentContext';
export * from './UIContext';
export * from './CollaborationContext';
export * from './LearningPathContext';
export * from './AgentContext';

// 組合所有 Provider
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AgentProvider>
      <EditorProvider>
        <ContentProvider>
          <UIProvider>
            <CollaborationProvider>
              <LearningPathProvider>
                {children}
              </LearningPathProvider>
            </CollaborationProvider>
          </UIProvider>
        </ContentProvider>
      </EditorProvider>
    </AgentProvider>
  );
}
