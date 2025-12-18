// components/features/ChapterNavigator.tsx
import React from 'react';
import { BookOpen, ChevronLeft, ChevronRight, List, X } from 'lucide-react';
import { useContent, useChapterNavigation } from '../../context/ContentContext';

interface ChapterNavigatorProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * 章節導航器 - 側邊欄顯示所有章節，點擊可切換
 */
const ChapterNavigator: React.FC<ChapterNavigatorProps> = ({ isOpen, onClose }) => {
    const { state } = useContent();
    const { goToChapter, nextChapter, prevChapter } = useChapterNavigation();

    const { epubMetadata, epubChapters, currentChapterId } = state;

    // 如果沒有 EPUB 內容，不顯示
    if (!epubMetadata || epubChapters.length === 0) {
        return null;
    }

    const currentIndex = epubChapters.findIndex(ch => ch.id === currentChapterId);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < epubChapters.length - 1;

    return (
        <>
            {/* 側邊欄 */}
            <div
                className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-[100] transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5" />
                            <h2 className="font-bold">章節目錄</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    {epubMetadata && (
                        <div className="mt-2 text-sm text-indigo-100">
                            <p className="font-medium">{epubMetadata.title}</p>
                            <p className="text-xs opacity-80">{epubMetadata.author}</p>
                        </div>
                    )}
                </div>

                {/* 章節列表 */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                    {epubChapters.map((chapter, index) => (
                        <button
                            key={chapter.id}
                            onClick={() => goToChapter(chapter.id)}
                            className={`w-full text-left p-3 rounded-lg transition-all flex items-center gap-3 ${chapter.id === currentChapterId
                                ? 'bg-indigo-100 text-indigo-900 border-l-4 border-indigo-600'
                                : 'hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-700 dark:text-slate-300'
                                }`}
                        >
                            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${chapter.id === currentChapterId
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-200 dark:bg-gray-700 text-slate-600 dark:text-slate-400'
                                }`}>
                                {index + 1}
                            </span>
                            <span className="flex-1 text-sm font-medium truncate">
                                {chapter.title}
                            </span>
                        </button>
                    ))}
                </div>

                {/* 底部導航 */}
                <div className="absolute bottom-0 left-0 right-0 bg-slate-50 dark:bg-gray-800 border-t border-slate-200 dark:border-gray-700 p-4">
                    <div className="flex items-center justify-between">
                        <button
                            onClick={prevChapter}
                            disabled={!hasPrev}
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${hasPrev
                                ? 'text-indigo-600 hover:bg-indigo-50'
                                : 'text-slate-300 cursor-not-allowed'
                                }`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            上一章
                        </button>

                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            {currentIndex + 1} / {epubChapters.length}
                        </span>

                        <button
                            onClick={nextChapter}
                            disabled={!hasNext}
                            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${hasNext
                                ? 'text-indigo-600 hover:bg-indigo-50'
                                : 'text-slate-300 cursor-not-allowed'
                                }`}
                        >
                            下一章
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 背景遮罩 */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-[99] transition-opacity"
                    onClick={onClose}
                />
            )}
        </>
    );
};

/**
 * 浮動翻頁按鈕 - 左右兩側顯示上一章/下一章
 */
export const PageNavigationButtons: React.FC = () => {
    const { state } = useContent();
    const { nextChapter, prevChapter } = useChapterNavigation();

    // 如果沒有 EPUB 內容，不顯示
    if (!state.epubMetadata || state.epubChapters.length === 0) {
        return null;
    }

    const currentIndex = state.epubChapters.findIndex(ch => ch.id === state.currentChapterId);
    const hasPrev = currentIndex > 0;
    const hasNext = currentIndex < state.epubChapters.length - 1;
    const currentChapter = state.epubChapters[currentIndex];

    return (
        <>
            {/* 上一章按鈕 - 左側 */}
            <button
                onClick={prevChapter}
                disabled={!hasPrev}
                className={`fixed left-4 top-1/2 -translate-y-1/2 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-full p-3 transition-all border border-slate-200 dark:border-gray-700 group ${hasPrev
                    ? 'hover:bg-indigo-50 dark:hover:bg-gray-700 hover:scale-110 cursor-pointer'
                    : 'opacity-40 cursor-not-allowed'
                    }`}
                title={hasPrev ? `上一章：${state.epubChapters[currentIndex - 1]?.title}` : '已經是第一章'}
            >
                <ChevronLeft className={`w-6 h-6 ${hasPrev ? 'text-indigo-600' : 'text-slate-400'}`} />
                {hasPrev && (
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap max-w-[200px] truncate">
                        ← {state.epubChapters[currentIndex - 1]?.title}
                    </div>
                )}
            </button>

            {/* 下一章按鈕 - 右側 */}
            <button
                onClick={nextChapter}
                disabled={!hasNext}
                className={`fixed right-4 top-1/2 -translate-y-1/2 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-full p-3 transition-all border border-slate-200 dark:border-gray-700 group ${hasNext
                    ? 'hover:bg-indigo-50 dark:hover:bg-gray-700 hover:scale-110 cursor-pointer'
                    : 'opacity-40 cursor-not-allowed'
                    }`}
                title={hasNext ? `下一章：${state.epubChapters[currentIndex + 1]?.title}` : '已經是最後一章'}
            >
                <ChevronRight className={`w-6 h-6 ${hasNext ? 'text-indigo-600' : 'text-slate-400'}`} />
                {hasNext && (
                    <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap max-w-[200px] truncate">
                        {state.epubChapters[currentIndex + 1]?.title} →
                    </div>
                )}
            </button>

            {/* 底部進度指示器 */}
            <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-lg rounded-full px-4 py-2 border border-slate-200 dark:border-gray-700 flex items-center gap-3">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {currentIndex + 1} / {state.epubChapters.length}
                </span>
                <div className="w-24 h-1.5 bg-slate-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300"
                        style={{ width: `${((currentIndex + 1) / state.epubChapters.length) * 100}%` }}
                    />
                </div>
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium max-w-[150px] truncate">
                    {currentChapter?.title}
                </span>
            </div>
        </>
    );
};

/**
 * 章節導航觸發按鈕 - 浮動在章節進度指示器上
 */
export const ChapterNavigatorTrigger: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    const { state } = useContent();

    // 如果沒有 EPUB 內容，不顯示
    if (!state.epubMetadata || state.epubChapters.length === 0) {
        return null;
    }

    return (
        <button
            onClick={onClick}
            className="fixed bottom-20 left-1/2 ml-[140px] -translate-y-0 z-50 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg rounded-full p-2 transition-all hover:scale-110 border-2 border-white"
            title="開啟章節目錄"
        >
            <List className="w-4 h-4" />
        </button>
    );
};

export default ChapterNavigator;
