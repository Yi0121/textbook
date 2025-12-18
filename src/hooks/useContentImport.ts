// hooks/useContentImport.ts
import { useCallback } from 'react';
import { useContent, type TextbookContent } from '../context/ContentContext';
import { useEditor } from '../context/EditorContext';
import { fetchAIImportedContent } from '../services/ai/mockLLMService';
import type { Viewport, TiptapContent, EPUBMetadata, EPUBChapter } from '../types';

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

    /**
     * 處理 EPUB 匯入
     * TextbookContent 有 pages 陣列，需要轉換為 EPUBChapter 格式
     */
    const handleEPUBImport = useCallback((content: TextbookContent) => {
        console.log('📖 正在匯入 EPUB 內容:', content);

        // 將 TextbookContent pages 轉換為 EPUBChapter 格式
        const chapters: EPUBChapter[] = content.pages.map((page, index) => ({
            id: page.id,
            title: page.title,
            content: page.content, // HTML 字串
            order: index,
        }));

        // 建立 metadata
        const metadata: EPUBMetadata = {
            title: content.title,
            author: content.author,
        };

        // 使用 IMPORT_EPUB action 將資料設定到 ContentContext
        contentDispatch({
            type: 'IMPORT_EPUB',
            payload: {
                metadata,
                chapters,
            },
        });

        console.log(`✅ EPUB 匯入完成：${metadata.title}，${chapters.length} 個章節`);

        // 設定編輯模式與工具
        setIsEditMode(true);
        setCurrentTool('cursor');

        // 重置視口位置
        setViewport({ x: 0, y: 0, scale: 1 });
    }, [contentDispatch, setViewport, setIsEditMode, setCurrentTool]);

    return {
        handleImportContent,
        handleEPUBImport,
    };
}

