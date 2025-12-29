import { Play, BookOpen, CheckCircle, Zap, RefreshCw, XCircle } from 'lucide-react';
import type { LessonNode } from '../../types/lessonPlan';

interface LessonNodeCardProps {
    node: LessonNode;
    isCompleted: boolean;
    isCurrent: boolean;
    isFailed?: boolean; // 檢測點未通過
    onSelect: (nodeId: string) => void;
}

// Clean up APOS titles
const getCleanTitle = (title: string) => {
    return title
        .replace(/(Action|Process|Object|Schema)\s*[:：]?\s*/gi, '')
        .replace(/📋 |🔢 |🧪 |⚙️ |✏️ |📦 |🔧 |🧠 |🌍 |📝 |✓ |🖐️ |🎬 |🏹 |🌊 |🔄 |🧩 |🏆 /g, '')
        .trim();
};

export default function LessonNodeCard({
    node,
    isCompleted,
    isCurrent,
    isFailed = false,
    onSelect
}: LessonNodeCardProps) {
    const isCheckpoint = node.isConditional;

    // === Multi-Choice Variant ===
    if (node.multiBranchOptions) {
        return (
            <div className="flex flex-col gap-3 min-w-[200px]">
                <div className="text-center mb-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200">
                        <Zap className="w-3 h-3 fill-indigo-700" />
                        AI 推薦：選擇適合你的學習方式
                    </div>
                </div>

                {node.multiBranchOptions.map((option, idx) => (
                    <button
                        key={option.id}
                        onClick={() => onSelect(node.id)}
                        className={`
                            w-56 p-4 rounded-2xl border text-left transition-all relative group overflow-hidden
                            ${idx === 0 ? 'bg-white border-purple-300 hover:border-purple-500 hover:shadow-purple-200 shadow-md' :
                                idx === 1 ? 'bg-white/90 border-slate-200 hover:border-blue-400 hover:bg-slate-50' :
                                    'bg-white/90 border-slate-200 hover:border-green-400 hover:bg-slate-50'}
                        `}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className={`text-[10px] font-bold uppercase tracking-wider ${idx === 0 ? 'text-purple-600' : idx === 1 ? 'text-blue-600' : 'text-green-600'
                                }`}>
                                Option {String.fromCharCode(65 + idx)}
                            </span>
                            {idx === 0 && <Zap className="w-3 h-3 text-purple-600 fill-purple-600" />}
                        </div>
                        <h3 className="font-bold text-slate-800 text-sm">
                            {getCleanTitle(option.label)}
                        </h3>
                        {/* Hover effect gradient */}
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity ${idx === 0 ? 'bg-purple-600' : idx === 1 ? 'bg-blue-600' : 'bg-green-600'
                            }`} />
                    </button>
                ))}
            </div>
        );
    }

    // === Standard Card Variant ===
    return (
        <div className="relative group/node">

            {/* AI Recommendation Badge - Shows on the next recommended task */}
            {isCurrent && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap z-20">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-pulse">
                        <Zap className="w-3 h-3 fill-current" />
                        🤖 AI 推薦
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-4 border-transparent border-t-indigo-600"></div>
                    </div>
                </div>
            )}

            <button
                onClick={() => onSelect(node.id)}
                className={`
                w-52 h-36 p-4 rounded-3xl border-2 transition-all duration-300 text-left relative z-10 flex flex-col justify-between
                ${isCompleted
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50/80 border-green-300 hover:border-green-400'
                        : isFailed
                            ? 'bg-gradient-to-br from-orange-50 to-red-50/80 border-orange-400 hover:border-orange-500'
                            : isCurrent
                                ? 'bg-white border-purple-500 border-[3px] animate-pulse-glow'
                                : 'bg-white/80 border-slate-200 hover:border-purple-300 hover:bg-white'
                    }
                backdrop-blur-md shadow-lg hover:shadow-xl
            `}
            >
                {/* Completion Badge Overlay */}
                {isCompleted && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1.5 shadow-lg shadow-green-200 z-20">
                        <CheckCircle className="w-4 h-4" />
                    </div>
                )}

                {/* Failed Badge Overlay */}
                {isFailed && !isCompleted && (
                    <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full p-1.5 shadow-lg shadow-orange-200 z-20">
                        <XCircle className="w-4 h-4" />
                    </div>
                )}

                {/* Status Badge */}
                <div className="flex items-center justify-between">
                    <div className={`
                    w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold
                    ${isCompleted ? 'bg-green-100 text-green-600 ring-2 ring-green-200'
                            : isCurrent ? 'bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-lg shadow-purple-200'
                                : 'bg-slate-100 text-slate-400 ring-1 ring-slate-200'}
                `}>
                        {isCompleted ? <CheckCircle className="w-4 h-4" /> : node.order}
                    </div>

                    {/* Type Icon */}
                    <div className={`p-1.5 rounded-lg ${isCurrent ? 'bg-purple-100 text-purple-600' : isCompleted ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                        {node.nodeType === 'video' ? <Play className="w-3.5 h-3.5" /> :
                            node.nodeType === 'worksheet' ? <BookOpen className="w-3.5 h-3.5" /> :
                                <RefreshCw className="w-3.5 h-3.5" />}
                    </div>
                </div>

                {/* Content */}
                <div>
                    <h3 className={`font-bold text-sm leading-snug line-clamp-2 ${isCurrent ? 'text-slate-900' : isCompleted ? 'text-green-800' : 'text-slate-700'}`}>
                        {getCleanTitle(node.title)}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {isCheckpoint && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200 flex items-center gap-1">
                                <Zap className="w-3 h-3 fill-yellow-700" /> 檢測點
                            </span>
                        )}
                        {isCompleted && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                                ✓ 已完成
                            </span>
                        )}
                        {isFailed && !isCompleted && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                                ❌ 未通過
                            </span>
                        )}
                    </div>
                </div>

                {/* Active Glow Ring */}
                {isCurrent && (
                    <div className="absolute inset-0 rounded-3xl ring-2 ring-purple-400/50 pointer-events-none" />
                )}
            </button>
        </div>
    );
}
