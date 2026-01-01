import { ArrowLeft, BookOpen, Plus, Maximize, Trash2, Send } from 'lucide-react';

interface EditorToolbarProps {
    title: string;
    headerVisible: boolean;
    isSidebarOpen: boolean;
    viewLevel: 'stage' | 'activity';
    expandedStage: 'A' | 'P' | 'O' | 'S' | null;
    onNavigateBack: () => void;
    onReturnToStageView: () => void;
    onAddActivity: () => void;
    onFitView: () => void;
    onResetLayout: () => void;
}

export function EditorToolbar({
    title,
    headerVisible,
    isSidebarOpen,
    viewLevel,
    expandedStage,
    onNavigateBack,
    onReturnToStageView,
    onAddActivity,
    onFitView,
    onResetLayout
}: EditorToolbarProps) {
    return (
        <div
            className={`absolute top-4 right-4 z-20 flex items-center justify-between pointer-events-none transition-all duration-300 ${headerVisible ? 'translate-y-0' : '-translate-y-24'}`}
            style={{ left: isSidebarOpen ? '320px' : '80px' }}
        >
            <div className="flex items-center pointer-events-auto">
                {/* Unified Title Card - seamless design */}
                <div className="bg-white/90 backdrop-blur-md shadow-sm border border-gray-200 pl-2 pr-6 py-2 rounded-2xl flex items-center gap-2">
                    <button
                        onClick={onNavigateBack}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors group text-gray-500 hover:text-gray-900"
                        title="Back"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div>
                        <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-indigo-600" />
                            {title}
                        </h1>
                        <p className="text-xs text-gray-500 font-medium tracking-wide">
                            {viewLevel === 'stage' ? 'Draft • APOS Stages' : `Draft • ${expandedStage} Stage Activities`}
                        </p>
                    </div>
                </div>

                {/* Stage Navigation / Actions */}
                {viewLevel === 'activity' && (
                    <div className="bg-white/90 backdrop-blur-md shadow-sm border border-white/50 p-2 rounded-2xl flex items-center gap-2">
                        <button
                            onClick={onReturnToStageView}
                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 shadow-sm transition-all flex items-center gap-2"
                        >
                            <ArrowLeft size={16} />
                            返回主視圖
                        </button>

                        <div className="w-px h-6 bg-gray-200 mx-1" />

                        <div className="px-3 py-1.5 bg-gray-100 rounded-lg flex items-center gap-2 text-sm text-gray-600">
                            {expandedStage === 'A' && <><span className="text-lg">🏃</span> 行動階段</>}
                            {expandedStage === 'P' && <><span className="text-lg">⚙️</span> 過程階段</>}
                            {expandedStage === 'O' && <><span className="text-lg">📦</span> 物件階段</>}
                            {expandedStage === 'S' && <><span className="text-lg">🧠</span> 結構階段</>}
                        </div>

                        <button
                            onClick={onAddActivity}
                            className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors flex items-center gap-1.5 text-sm font-medium"
                            title="新增活動"
                        >
                            <Plus size={18} />
                            新增活動
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white/90 backdrop-blur-md shadow-sm border border-white/50 p-2 rounded-2xl flex items-center gap-2 pointer-events-auto">
                <button onClick={onFitView} className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-600 transition-colors" title="Fit View">
                    <Maximize className="w-5 h-5" />
                </button>
                <button
                    onClick={onResetLayout}
                    className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-600 transition-colors"
                    title="Reset Layout"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
                <div className="w-px h-6 bg-gray-200 mx-1" />
                <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    發布
                </button>
            </div>
        </div>
    );
}
