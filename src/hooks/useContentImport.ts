// hooks/useContentImport.ts
import { useCallback } from 'react';
import { useContent, type TextbookContent } from '../context/ContentContext';
import { useEditor } from '../context/EditorContext';
import { fetchAIImportedContent } from '../services/ai/mockLLMService';
import { convertToFabricPages } from '../utils/epubParser';
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
 * - 支援 EPUB 格式匯入（使用 Fabric.js 頁面系統）
 * - 支援 AI 自動匯入
 */
export function useContentImport({
    setViewport,
    setShowEPUBImporter,
}: UseContentImportProps): UseContentImportReturn {
    const { state: contentState, dispatch: contentDispatch } = useContent();
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

    /**
     * 處理 EPUB 匯入
     * 使用 APPEND_EPUB action 將內容追加到無限畫布（不覆蓋現有內容）
     */
    const handleEPUBImport = useCallback((content: TextbookContent) => {
        console.log('📖 正在匯入 EPUB 內容:', content);

        // 將 TextbookContent 轉換為 Fabric.js 頁面格式
        const { source, pages } = convertToFabricPages(content, contentState.fabricPages);

        // 使用 APPEND_EPUB action 追加頁面（不覆蓋）
        contentDispatch({
            type: 'APPEND_EPUB',
            payload: {
                source,
                pages,
            },
        });

        console.log(`✅ EPUB 匯入完成：${source.metadata.title}，${pages.length} 個 Fabric 頁面`);
        console.log(`📍 放置位置: x=${source.basePosition.x}, y=${source.basePosition.y}`);

        // 設定編輯模式與工具
        setIsEditMode(true);
        setCurrentTool('cursor');

        // 將視口移動到新 EPUB 的位置
        setViewport({
            x: -source.basePosition.x + 100,
            y: -source.basePosition.y + 100,
            scale: 0.5, // 縮小視圖以便看到多個頁面
        });
    }, [contentState.fabricPages, contentDispatch, setViewport, setIsEditMode, setCurrentTool]);

    return {
        handleImportContent,
        handleEPUBImport,
    };
}

