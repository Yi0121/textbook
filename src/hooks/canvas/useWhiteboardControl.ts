// hooks/useWhiteboardControl.ts
import { useCallback } from 'react';
import { useCollaboration, useWhiteboardActions } from '../../context/CollaborationContext';

/**
 * 處理白板開關控制
 * - 開啟白板：若無白板則建立，若有則打開
 * - 關閉白板：隱藏白板視窗
 */
export function useWhiteboardControl() {
    const { state: collabState } = useCollaboration();
    const whiteboardActions = useWhiteboardActions();

    const handleOpenWhiteboard = useCallback(() => {
        // 如果沒有白板，創建一個新的
        if (collabState.whiteboards.length === 0) {
            whiteboardActions.createWhiteboard('協作白板', collabState.currentUserId);
        } else if (collabState.currentWhiteboardId === null) {
            // 如果有白板但沒打開，打開第一個
            whiteboardActions.openWhiteboard(collabState.whiteboards[0].id);
        } else {
            // 如果已經有打開的白板，重新打開
            whiteboardActions.openWhiteboard(collabState.currentWhiteboardId);
        }
    }, [collabState.whiteboards, collabState.currentWhiteboardId, collabState.currentUserId, whiteboardActions]);

    const handleCloseWhiteboard = useCallback(() => {
        whiteboardActions.closeWhiteboard();
    }, [whiteboardActions]);

    return {
        handleOpenWhiteboard,
        handleCloseWhiteboard,
        currentWhiteboardId: collabState.currentWhiteboardId,
    };
}
