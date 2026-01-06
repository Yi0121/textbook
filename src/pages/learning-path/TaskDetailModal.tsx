/**
 * TaskDetailModal - 任務詳情彈窗
 * 
 * 顯示學習任務的詳細資訊和操作按鈕
 */

import { X, Play, BookOpen, Award, CheckCircle, RotateCw } from 'lucide-react';
import type { TaskDetailModalProps } from './types';
import { cleanTitle } from './types';

export function TaskDetailModal({
    node,
    nodeProgress,
    onClose,
    onNavigate
}: TaskDetailModalProps) {
    const isCompleted = nodeProgress?.completed || false;

    // Gradient based on node type
    const getGradient = () => {
        if (node.nodeType === 'video') return 'from-rose-500 to-orange-500';
        if (node.nodeType === 'worksheet') return 'from-emerald-500 to-teal-500';
        return 'from-indigo-600 to-purple-600';
    };

    return (
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-lg w-full">
            {/* Gradient Header */}
            <div className={`bg-gradient-to-br ${getGradient()} p-8 text-white relative`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mt-8" />
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-start gap-4 relative z-10">
                    <div className="bg-white/20 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-inner">
                        {node.nodeType === 'video' && <Play className="w-8 h-8 text-white" />}
                        {node.nodeType === 'worksheet' && <BookOpen className="w-8 h-8 text-white" />}
                        {(!node.nodeType || (node.nodeType !== 'video' && node.nodeType !== 'worksheet')) && <Award className="w-8 h-8 text-white" />}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1 opacity-90">
                            <span className="text-sm font-bold bg-white/20 px-2 py-0.5 rounded text-white border border-white/20">
                                Task {node.order}
                            </span>
                            <span className="text-sm font-medium tracking-wide flex items-center gap-1">
                                {node.nodeType === 'video' ? 'Video Concept' : node.nodeType === 'worksheet' ? 'Exercise' : 'Interactive'}
                                {isCompleted && <CheckCircle className="w-4 h-4 text-green-300" />}
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold leading-tight">{cleanTitle(node.title)}</h2>
                        {node.generatedContent?.materials && (
                            <p className="mt-2 text-indigo-100 text-sm line-clamp-1">{node.generatedContent.materials[0]}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Content */}
            <div className="p-8">
                {/* Materials Section */}
                {node.generatedContent?.materials && (
                    <div className="mb-8">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Learning Materials</h3>
                        <ul className="space-y-3">
                            {node.generatedContent.materials.map((m, i) => (
                                <li key={i} className="flex items-start gap-3 text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 group hover:border-indigo-100 transition-colors">
                                    <div className="mt-0.5 bg-indigo-100 text-indigo-600 p-1 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <BookOpen className="w-4 h-4" />
                                    </div>
                                    <span className="leading-relaxed">{m}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Action Button */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={() => onNavigate(`/lesson/${node.id}`)}
                        className={`
              px-8 py-3 rounded-xl font-bold text-lg flex items-center gap-3 shadow-lg hover:-translate-y-1 transition-all duration-300
              ${isCompleted
                                ? 'bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300'
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-200'}
            `}
                    >
                        {isCompleted ? (
                            <>
                                <RotateCw className="w-5 h-5" />
                                Review Lesson
                            </>
                        ) : (
                            <>
                                <Play className="w-5 h-5 fill-current" />
                                Start Learning
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
