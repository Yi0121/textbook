// hooks/useContentImport.ts
import { useCallback } from 'react';
import { useContent, type TextbookContent } from '../context/ContentContext';
import { useEditor } from '../context/EditorContext';
import { fetchAIImportedContent } from '../services/ai/mockLLMService';
import type { Viewport, TiptapContent } from '../types';

interface UseContentImportProps {
    setViewport: React.Dispatch<React.SetStateAction<Viewport>>;
    setShowEPUBImporter: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UseContentImportReturn {
    handleImportContent: () => Promise<void>;
    handleEPUBImport: (content: TextbookContent) => void;
}

/**
 * 處理內容匯入功能
 * - 支援 EPUB 格式匯入
 * - 支援 AI 自動匯入
 */
export function useContentImport({
    setViewport,
    setShowEPUBImporter,
}: UseContentImportProps): UseContentImportReturn {
    const { dispatch: contentDispatch } = useContent();
    const { dispatch: editorDispatch } = useEditor();

    const setIsEditMode = useCallback((value: boolean) => {
        editorDispatch({ type: 'SET_EDIT_MODE', payload: value });
    }, [editorDispatch]);

    const setCurrentTool = useCallback((tool: string) => {
        editorDispatch({ type: 'SET_CURRENT_TOOL', payload: tool });
    }, [editorDispatch]);

    const handleImportContent = useCallback(async () => {
        const useEPUB = confirm('是否要匯入 EPUB 教科書？\n\n確定 = EPUB 格式\n取消 = 一般 AI 匯入');

        if (useEPUB) {
            setShowEPUBImporter(true);
        } else {
            contentDispatch({ type: 'SET_AI_STATE', payload: 'thinking' });
            const newContent = await fetchAIImportedContent();
            contentDispatch({ type: 'SET_TEXTBOOK_CONTENT', payload: newContent as TiptapContent });
            contentDispatch({ type: 'SET_AI_STATE', payload: 'idle' });
            setIsEditMode(true);
            setCurrentTool('cursor');
        }
    }, [contentDispatch, setShowEPUBImporter, setIsEditMode, setCurrentTool]);

    const handleEPUBImport = useCallback((content: TextbookContent) => {
        // TextbookContent has pages array with x, y coordinates
        setIsEditMode(true);
        setCurrentTool('cursor');
        if (content.pages && content.pages.length > 0) {
            const firstPage = content.pages[0];
            setViewport({ x: -firstPage.x, y: -firstPage.y, scale: 1 });
        }
    }, [setViewport, setIsEditMode, setCurrentTool]);

    return {
        handleImportContent,
        handleEPUBImport,
    };
}
