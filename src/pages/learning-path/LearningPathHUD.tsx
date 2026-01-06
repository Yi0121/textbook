/**
 * LearningPathHUD - 學習路徑頂部 HUD
 * 
 * 顯示課程標題、進度、下一步按鈕
 */

import { BookOpen } from 'lucide-react';
import CircularProgress from '../../components/ui/CircularProgress';
import type { LearningPathHUDProps } from './types';

export function LearningPathHUD({
    lesson,
    studentProgress,
    visibleNodes,
    onNextTask
}: LearningPathHUDProps) {
    const totalTasks = lesson.nodes?.filter(n => n.branchLevel !== 'remedial').length || 0;
    const completedTasks = studentProgress.nodeProgress.filter(
        np => np.completed && visibleNodes.some(n => n.id === np.nodeId)
    ).length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Find next task
    const mainNodes = lesson.nodes?.filter(
        n => n.branchLevel !== 'remedial' && n.branchLevel !== 'advanced'
    ).sort((a, b) => a.order - b.order) || [];
    const nextTask = mainNodes.find(
        n => !studentProgress.nodeProgress.find(p => p.nodeId === n.id)?.completed
    );

    return (
        <div className="flex-shrink-0 absolute top-4 left-8 right-8 z-20">
            <div className="bg-white/85 backdrop-blur-xl rounded-2xl px-6 py-3 border border-purple-200/50 flex items-center justify-between shadow-xl">
                {/* Left: Title + Subtitle */}
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600">
                            {lesson.title}
                        </h1>
                        <p className="text-xs text-slate-500">
                            第一單元 · 共 {totalTasks} 個學習任務
                        </p>
                    </div>
                </div>

                {/* Right: Progress HUD */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 border-r border-purple-200/50 pr-4">
                        <CircularProgress progress={progressPercentage} size="sm" />
                        <div className="flex flex-col text-sm">
                            <div className="text-purple-900 font-bold text-xs">學習進度</div>
                            <div className="text-xs text-purple-600 font-medium">{completedTasks} / {totalTasks} 完成</div>
                        </div>
                    </div>
                    <button
                        onClick={() => nextTask && onNextTask()}
                        className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white rounded-xl px-5 py-2.5 shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2 text-sm font-bold"
                    >
                        繼續學習
                    </button>
                </div>
            </div>
        </div>
    );
}
