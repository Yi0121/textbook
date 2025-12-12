// ========================================
// 📁 src/context/index.tsx
// 功能：統一匯出所有 Context
// ========================================
import { type ReactNode } from 'react';
import { CanvasProvider } from './CanvasContext';
import { UIProvider } from './UIContext';
import { ToolProvider } from './ToolContext';

export * from './CanvasContext';
export * from './UIContext';
export * from './ToolContext';

// 組合所有 Provider
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToolProvider>
      <UIProvider>
        <CanvasProvider>
          {children}
        </CanvasProvider>
      </UIProvider>
    </ToolProvider>
  );
}