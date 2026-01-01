// hooks/useSelectionActions.ts
// 統一管理選取狀態的操作，減少 App.tsx 的重複邏輯

import { useEditor } from '../../context/EditorContext';
import type { SelectionBox } from '../../types';

export function useSelectionActions() {
  const { state, dispatch } = useEditor();

  const clearSelection = () => {
    dispatch({ type: 'SET_SELECTION_BOX', payload: null });
    dispatch({ type: 'SET_SELECTION_MENU_POS', payload: null });
  };

  const updateSelectionBox = (box: SelectionBox | null) => {
    dispatch({ type: 'SET_SELECTION_BOX', payload: box });
  };

  const updateMenuPosition = (pos: { top: number; left: number } | null) => {
    dispatch({ type: 'SET_SELECTION_MENU_POS', payload: pos });
  };

  const setSelectedText = (text: string) => {
    dispatch({ type: 'SET_SELECTED_TEXT', payload: text });
  };

  return {
    // 狀態
    selectionBox: state.selectionBox,
    selectionMenuPos: state.selectionMenuPos,
    selectedText: state.selectedText,

    // 操作
    clearSelection,
    updateSelectionBox,
    updateMenuPosition,
    setSelectedText,
  };
}
