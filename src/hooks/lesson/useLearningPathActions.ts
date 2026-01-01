/**
 * useLearningPathActions Hook
 * 
 * 提供學習路徑操作的便捷方法，包括：
 * - 節點/邊的 CRUD 操作
 * - 自動儲存到 LocalStorage
 * - Undo/Redo 歷史記錄
 */

import { useCallback, useRef, useEffect } from 'react';
import { useLearningPath } from '../../context/LearningPathContext';
import { savePath, loadPath, loadAllPaths } from '../../utils/learningPathStorage';
import type { LearningPathNode, LearningPathEdge } from '../../types';

// 歷史記錄項目
interface HistoryEntry {
    nodes: LearningPathNode[];
    edges: LearningPathEdge[];
    timestamp: number;
}

// 最大歷史記錄數量
const MAX_HISTORY_SIZE = 50;

export function useLearningPathActions() {
    const { state, dispatch } = useLearningPath();

    // 歷史記錄（用於 Undo/Redo）
    const historyRef = useRef<HistoryEntry[]>([]);
    const historyIndexRef = useRef<number>(-1);
    const isUndoRedoRef = useRef<boolean>(false);

    // 自動儲存 Debounce Timer
    const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

    // 取得當前路徑
    const currentPath = state.currentStudentId
        ? state.studentPaths.get(state.currentStudentId)
        : null;

    // ==================== 歷史記錄管理 ====================

    /**
     * 儲存當前狀態到歷史記錄
     */
    const saveToHistory = useCallback(() => {
        if (!currentPath || isUndoRedoRef.current) return;

        const entry: HistoryEntry = {
            nodes: JSON.parse(JSON.stringify(currentPath.nodes)),
            edges: JSON.parse(JSON.stringify(currentPath.edges)),
            timestamp: Date.now(),
        };

        // 如果在歷史中間進行了新操作，刪除後面的記錄
        if (historyIndexRef.current < historyRef.current.length - 1) {
            historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
        }

        historyRef.current.push(entry);

        // 限制歷史記錄大小
        if (historyRef.current.length > MAX_HISTORY_SIZE) {
            historyRef.current.shift();
        } else {
            historyIndexRef.current++;
        }
    }, [currentPath]);

    /**
     * 復原 (Undo)
     */
    const undo = useCallback(() => {
        if (!state.currentStudentId || historyIndexRef.current <= 0) {
            console.log('無法復原：已到最早記錄');
            return false;
        }

        isUndoRedoRef.current = true;
        historyIndexRef.current--;

        const entry = historyRef.current[historyIndexRef.current];

        // 清空當前節點和邊，然後重新載入
        const path = state.studentPaths.get(state.currentStudentId);
        if (path) {
            // 刪除現有節點
            path.nodes.forEach(node => {
                dispatch({
                    type: 'DELETE_NODE',
                    payload: { studentId: state.currentStudentId!, nodeId: node.id }
                });
            });

            // 添加歷史記錄中的節點
            entry.nodes.forEach(node => {
                dispatch({
                    type: 'ADD_NODE',
                    payload: { studentId: state.currentStudentId!, node }
                });
            });

            // 添加歷史記錄中的邊
            entry.edges.forEach(edge => {
                dispatch({
                    type: 'ADD_EDGE',
                    payload: { studentId: state.currentStudentId!, edge }
                });
            });
        }

        setTimeout(() => {
            isUndoRedoRef.current = false;
        }, 100);

        console.log(`✓ 復原成功 (${historyIndexRef.current + 1}/${historyRef.current.length})`);
        return true;
    }, [state.currentStudentId, state.studentPaths, dispatch]);

    /**
     * 重做 (Redo)
     */
    const redo = useCallback(() => {
        if (!state.currentStudentId || historyIndexRef.current >= historyRef.current.length - 1) {
            console.log('無法重做：已到最新記錄');
            return false;
        }

        isUndoRedoRef.current = true;
        historyIndexRef.current++;

        const entry = historyRef.current[historyIndexRef.current];

        // 同 undo 邏輯
        const path = state.studentPaths.get(state.currentStudentId);
        if (path) {
            path.nodes.forEach(node => {
                dispatch({
                    type: 'DELETE_NODE',
                    payload: { studentId: state.currentStudentId!, nodeId: node.id }
                });
            });

            entry.nodes.forEach(node => {
                dispatch({
                    type: 'ADD_NODE',
                    payload: { studentId: state.currentStudentId!, node }
                });
            });

            entry.edges.forEach(edge => {
                dispatch({
                    type: 'ADD_EDGE',
                    payload: { studentId: state.currentStudentId!, edge }
                });
            });
        }

        setTimeout(() => {
            isUndoRedoRef.current = false;
        }, 100);

        console.log(`✓ 重做成功 (${historyIndexRef.current + 1}/${historyRef.current.length})`);
        return true;
    }, [state.currentStudentId, state.studentPaths, dispatch]);

    /**
     * 檢查是否可以復原/重做
     */
    const canUndo = historyIndexRef.current > 0;
    const canRedo = historyIndexRef.current < historyRef.current.length - 1;

    // ==================== 自動儲存 ====================

    /**
     * 手動儲存
     */
    const save = useCallback(() => {
        if (!currentPath) return;
        savePath(currentPath);
    }, [currentPath]);

    /**
     * 請求自動儲存（帶 Debounce）
     */
    const requestAutoSave = useCallback(() => {
        if (autoSaveTimerRef.current) {
            clearTimeout(autoSaveTimerRef.current);
        }

        autoSaveTimerRef.current = setTimeout(() => {
            if (currentPath) {
                savePath(currentPath);
                console.log('✓ 自動儲存完成');
            }
        }, 2000); // 2 秒延遲
    }, [currentPath]);

    /**
     * 載入已儲存的路徑
     */
    const loadSavedPath = useCallback((studentId: string) => {
        const savedPath = loadPath(studentId);
        if (savedPath) {
            // 設定當前學生
            dispatch({ type: 'SET_CURRENT_STUDENT', payload: studentId });

            // 建立路徑
            dispatch({
                type: 'CREATE_PATH',
                payload: { studentId: savedPath.studentId, studentName: savedPath.studentName }
            });

            // 載入節點和邊
            savedPath.nodes.forEach(node => {
                dispatch({
                    type: 'ADD_NODE',
                    payload: { studentId, node }
                });
            });

            savedPath.edges.forEach(edge => {
                dispatch({
                    type: 'ADD_EDGE',
                    payload: { studentId, edge }
                });
            });

            console.log(`✓ 已載入儲存的路徑: ${savedPath.studentName}`);
            return true;
        }
        return false;
    }, [dispatch]);

    /**
     * 載入所有已儲存的路徑
     */
    const loadAllSavedPaths = useCallback(() => {
        const paths = loadAllPaths();
        paths.forEach((path, studentId) => {
            dispatch({
                type: 'CREATE_PATH',
                payload: { studentId: path.studentId, studentName: path.studentName }
            });

            path.nodes.forEach(node => {
                dispatch({
                    type: 'ADD_NODE',
                    payload: { studentId, node }
                });
            });

            path.edges.forEach(edge => {
                dispatch({
                    type: 'ADD_EDGE',
                    payload: { studentId, edge }
                });
            });
        });

        return paths.size;
    }, [dispatch]);

    // ==================== 節點操作（帶歷史記錄） ====================

    /**
     * 添加節點（帶歷史記錄）
     */
    const addNode = useCallback((node: LearningPathNode) => {
        if (!state.currentStudentId) return;

        saveToHistory();
        dispatch({
            type: 'ADD_NODE',
            payload: { studentId: state.currentStudentId, node }
        });
        requestAutoSave();
    }, [state.currentStudentId, dispatch, saveToHistory, requestAutoSave]);

    /**
     * 更新節點（帶歷史記錄）
     */
    const updateNode = useCallback((nodeId: string, changes: Partial<LearningPathNode>) => {
        if (!state.currentStudentId) return;

        saveToHistory();
        dispatch({
            type: 'UPDATE_NODE',
            payload: { studentId: state.currentStudentId, nodeId, changes }
        });
        requestAutoSave();
    }, [state.currentStudentId, dispatch, saveToHistory, requestAutoSave]);

    /**
     * 刪除節點（帶歷史記錄）
     */
    const deleteNode = useCallback((nodeId: string) => {
        if (!state.currentStudentId) return;

        saveToHistory();
        dispatch({
            type: 'DELETE_NODE',
            payload: { studentId: state.currentStudentId, nodeId }
        });
        requestAutoSave();
    }, [state.currentStudentId, dispatch, saveToHistory, requestAutoSave]);

    /**
     * 添加邊（帶歷史記錄）
     */
    const addEdge = useCallback((edge: LearningPathEdge) => {
        if (!state.currentStudentId) return;

        saveToHistory();
        dispatch({
            type: 'ADD_EDGE',
            payload: { studentId: state.currentStudentId, edge }
        });
        requestAutoSave();
    }, [state.currentStudentId, dispatch, saveToHistory, requestAutoSave]);

    /**
     * 刪除邊（帶歷史記錄）
     */
    const deleteEdge = useCallback((edgeId: string) => {
        if (!state.currentStudentId) return;

        saveToHistory();
        dispatch({
            type: 'DELETE_EDGE',
            payload: { studentId: state.currentStudentId, edgeId }
        });
        requestAutoSave();
    }, [state.currentStudentId, dispatch, saveToHistory, requestAutoSave]);

    // ==================== 清理 ====================

    useEffect(() => {
        return () => {
            if (autoSaveTimerRef.current) {
                clearTimeout(autoSaveTimerRef.current);
            }
        };
    }, []);

    // ==================== 初始化歷史記錄 ====================

    useEffect(() => {
        if (currentPath && historyRef.current.length === 0) {
            // 初始化第一個歷史記錄
            historyRef.current = [{
                nodes: JSON.parse(JSON.stringify(currentPath.nodes)),
                edges: JSON.parse(JSON.stringify(currentPath.edges)),
                timestamp: Date.now(),
            }];
            historyIndexRef.current = 0;
        }
    }, [currentPath]);

    return {
        // 狀態
        currentPath,
        currentStudentId: state.currentStudentId,
        isGenerating: state.isGenerating,

        // Undo/Redo
        undo,
        redo,
        canUndo,
        canRedo,
        historyLength: historyRef.current.length,
        historyIndex: historyIndexRef.current,

        // 儲存
        save,
        requestAutoSave,
        loadSavedPath,
        loadAllSavedPaths,

        // 節點操作
        addNode,
        updateNode,
        deleteNode,
        addEdge,
        deleteEdge,
    };
}
