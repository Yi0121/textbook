/**
 * useLessonEditor
 * 
 * TanStack Query hooks for lesson editor with local editing support
 * Pattern: Repository initialization → Local editing → Mutation save
 */

import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getLessonRepository } from '../../services/repositories';
import type { LessonPlan, LessonNode } from '../../types/lessonPlan';
import { lessonKeys } from './useLessonData';

// ==================== Types ====================

export interface LessonEditorState {
    lesson: LessonPlan | null;
    isLoading: boolean;
    isInitialized: boolean;
    isDirty: boolean;
    isSaving: boolean;
}

export interface LessonEditorActions {
    setLesson: (lesson: LessonPlan) => void;
    updateLesson: (updates: Partial<LessonPlan>) => void;
    updateNode: (nodeId: string, updates: Partial<LessonNode>) => void;
    addNode: (node: LessonNode) => void;
    deleteNode: (nodeId: string) => void;
    save: () => Promise<void>;
    reset: () => void;
}

// ==================== Hook ====================

/**
 * 課程編輯器 Hook
 * 
 * @param lessonId - 課程 ID
 * @returns { state, actions }
 */
export function useLessonEditor(lessonId: string): {
    state: LessonEditorState;
    actions: LessonEditorActions;
} {
    const repository = getLessonRepository();
    const queryClient = useQueryClient();

    // 從 Repository 取得初始資料
    const { data: initialLesson, isLoading } = useQuery({
        queryKey: lessonKeys.detail(lessonId),
        queryFn: () => repository.getLessonById(lessonId),
        enabled: !!lessonId,
    });

    // 本地編輯 state
    const [lesson, setLessonState] = useState<LessonPlan | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    // 初始化本地 state (僅第一次)
    useEffect(() => {
        if (initialLesson && !isInitialized) {
            setLessonState(initialLesson);
            setIsInitialized(true);
        }
    }, [initialLesson, isInitialized]);

    // Save mutation (placeholder for API)
    const saveMutation = useMutation({
        mutationFn: async (lessonToSave: LessonPlan) => {
            // TODO: 實作 API 儲存
            // await repository.saveLesson(lessonToSave);
            console.log('[useLessonEditor] Saving lesson:', lessonToSave.id);
            await new Promise(resolve => setTimeout(resolve, 500));
            return lessonToSave;
        },
        onSuccess: (savedLesson) => {
            setIsDirty(false);
            // 更新 query cache
            queryClient.setQueryData(lessonKeys.detail(lessonId), savedLesson);
        },
    });

    // ==================== Actions ====================

    const setLesson = useCallback((newLesson: LessonPlan) => {
        setLessonState(newLesson);
        setIsDirty(true);
        if (!isInitialized) setIsInitialized(true);
    }, [isInitialized]);

    const updateLesson = useCallback((updates: Partial<LessonPlan>) => {
        setLessonState(prev => prev ? { ...prev, ...updates } : null);
        setIsDirty(true);
    }, []);

    const updateNode = useCallback((nodeId: string, updates: Partial<LessonNode>) => {
        setLessonState(prev => {
            if (!prev) return null;
            return {
                ...prev,
                nodes: (prev.nodes ?? []).map(n =>
                    n.id === nodeId ? { ...n, ...updates } : n
                ),
            };
        });
        setIsDirty(true);
    }, []);

    const addNode = useCallback((node: LessonNode) => {
        setLessonState(prev => {
            if (!prev) return null;
            return {
                ...prev,
                nodes: [...(prev.nodes ?? []), node],
            };
        });
        setIsDirty(true);
    }, []);

    const deleteNode = useCallback((nodeId: string) => {
        setLessonState(prev => {
            if (!prev) return null;
            return {
                ...prev,
                nodes: (prev.nodes ?? []).filter(n => n.id !== nodeId),
            };
        });
        setIsDirty(true);
    }, []);

    const save = useCallback(async () => {
        if (lesson) {
            await saveMutation.mutateAsync(lesson);
        }
    }, [lesson, saveMutation]);

    const reset = useCallback(() => {
        if (initialLesson) {
            setLessonState(initialLesson);
            setIsDirty(false);
        }
    }, [initialLesson]);

    return {
        state: {
            lesson,
            isLoading,
            isInitialized,
            isDirty,
            isSaving: saveMutation.isPending,
        },
        actions: {
            setLesson,
            updateLesson,
            updateNode,
            addNode,
            deleteNode,
            save,
            reset,
        },
    };
}

// ==================== Fallback Hook ====================

/**
 * 用於無 lessonId 時的 fallback (新建課程)
 */
export function useNewLessonEditor(defaultLesson: LessonPlan): {
    state: LessonEditorState;
    actions: LessonEditorActions;
} {
    const [lesson, setLessonState] = useState<LessonPlan>(defaultLesson);
    const [isDirty, setIsDirty] = useState(false);

    const setLesson = useCallback((newLesson: LessonPlan) => {
        setLessonState(newLesson);
        setIsDirty(true);
    }, []);

    const updateLesson = useCallback((updates: Partial<LessonPlan>) => {
        setLessonState(prev => ({ ...prev, ...updates }));
        setIsDirty(true);
    }, []);

    const updateNode = useCallback((nodeId: string, updates: Partial<LessonNode>) => {
        setLessonState(prev => ({
            ...prev,
            nodes: (prev.nodes ?? []).map(n =>
                n.id === nodeId ? { ...n, ...updates } : n
            ),
        }));
        setIsDirty(true);
    }, []);

    const addNode = useCallback((node: LessonNode) => {
        setLessonState(prev => ({
            ...prev,
            nodes: [...(prev.nodes ?? []), node],
        }));
        setIsDirty(true);
    }, []);

    const deleteNode = useCallback((nodeId: string) => {
        setLessonState(prev => ({
            ...prev,
            nodes: (prev.nodes ?? []).filter(n => n.id !== nodeId),
        }));
        setIsDirty(true);
    }, []);

    const save = useCallback(async () => {
        console.log('[useNewLessonEditor] Save not implemented for new lessons');
    }, []);

    const reset = useCallback(() => {
        setLessonState(defaultLesson);
        setIsDirty(false);
    }, [defaultLesson]);

    return {
        state: {
            lesson,
            isLoading: false,
            isInitialized: true,
            isDirty,
            isSaving: false,
        },
        actions: {
            setLesson,
            updateLesson,
            updateNode,
            addNode,
            deleteNode,
            save,
            reset,
        },
    };
}
