/**
 * EditorToolbar - 課程編輯器頂部工具列
 * 
 * 從 LessonPrepPreviewPage 拆分出來的組件
 */

import { ArrowLeft, BookOpen, Plus, Settings, Maximize, Send } from 'lucide-react';

interface EditorToolbarProps {
    title: string;
    nodeCount: number;
    difficulty: 'basic' | 'intermediate' | 'advanced';
    onBack: () => void;
    onAddNode: () => void;
    onAutoLayout: () => void;
    onFitView: () => void;
    onPublish: () => void;
}

export default function EditorToolbar({
    title,
    nodeCount,
    difficulty,
    onBack,
    onAddNode,
    onAutoLayout,
    onFitView,
    onPublish,
}: EditorToolbarProps) {
    const difficultyLabel = {
        basic: '基礎',
        intermediate: '中階',
        advanced: '進階',
    };

    return (
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="返回備課工作台"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-indigo-600" />
                        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {nodeCount} 個節點 • {difficultyLabel[difficulty]}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={onAddNode}
                    className="px-4 py-2 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    新增節點
                </button>
                <button
                    onClick={onAutoLayout}
                    className="px-4 py-2 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-all flex items-center gap-2"
                    title="自動排列整齊"
                >
                    <Settings className="w-4 h-4" />
                    自動排列
                </button>
                <button
                    onClick={onFitView}
                    className="px-4 py-2 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-all flex items-center gap-2"
                    title="縮放至全覽"
                >
                    <Maximize className="w-4 h-4" />
                    全覽
                </button>
                <button
                    onClick={onPublish}
                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg"
                >
                    <Send className="w-4 h-4" />
                    發布課程
                </button>
            </div>
        </div>
    );
}
