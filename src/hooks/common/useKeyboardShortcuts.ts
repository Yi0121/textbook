// hooks/useKeyboardShortcuts.ts
import { useEffect, useCallback } from 'react';
import { type UserRole } from '../../config/toolConfig';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean; // Cmd on Mac
  description: string;
  action: () => void;
  role?: UserRole; // 權限控制
}

interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
  userRole?: UserRole;
}

/**
 * 鍵盤快捷鍵 Hook
 *
 * @example
 * useKeyboardShortcuts({
 *   shortcuts: [
 *     { key: 'e', ctrl: true, description: '切換編輯模式', action: () => setEditMode(!editMode) }
 *   ]
 * })
 */
export function useKeyboardShortcuts({
  shortcuts,
  enabled = true,
  userRole = 'all'
}: UseKeyboardShortcutsOptions) {

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // 如果在輸入框中，不觸發快捷鍵
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      return;
    }

    for (const shortcut of shortcuts) {
      // 權限檢查
      if (shortcut.role && shortcut.role !== 'all' && shortcut.role !== userRole) {
        continue;
      }

      const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
      const ctrlMatch = shortcut.ctrl ? (event.ctrlKey || event.metaKey) : !event.ctrlKey && !event.metaKey;
      const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
      const altMatch = shortcut.alt ? event.altKey : !event.altKey;

      if (keyMatch && ctrlMatch && shiftMatch && altMatch) {
        event.preventDefault();
        shortcut.action();
        break;
      }
    }
  }, [shortcuts, userRole]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled, handleKeyDown]);
}

/**
 * 格式化快捷鍵顯示文字
 * @example formatShortcut({ key: 'e', ctrl: true }) => "Ctrl+E" or "⌘E"
 */
export function formatShortcut(shortcut: Omit<KeyboardShortcut, 'action' | 'description'>): string {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const parts: string[] = [];

  if (shortcut.ctrl || shortcut.meta) {
    parts.push(isMac ? '⌘' : 'Ctrl');
  }
  if (shortcut.shift) {
    parts.push(isMac ? '⇧' : 'Shift');
  }
  if (shortcut.alt) {
    parts.push(isMac ? '⌥' : 'Alt');
  }
  parts.push(shortcut.key.toUpperCase());

  return parts.join(isMac ? '' : '+');
}
