import { Play, BookOpen, CheckCircle, Zap, RefreshCw, ArrowRight } from 'lucide-react';
import type { LessonNode } from '../../types/lessonPlan';

interface LessonTaskGridProps {
    nodes: LessonNode[];
    onNodeSelect: (nodeId: string) => void;
    completedNodeIds: string[];
}

// Clean up APOS titles
const getCleanTitle = (title: string) => {
    return title
        .replace(/(Action|Process|Object|Schema)\s*[:：]?\s*/gi, '')
        .replace(/📋 |🔢 |🧪 |⚙️ |✏️ |📦 |🔧 |🧠 |🌍 |📝 |✓ |🖐️ |🎬 |🏹 |🌊 |🔄 |🧩 |🏆 /g, '')
        .trim();
};

// === Circular Progress Ring ===
const CircularProgressRing = ({ percentage, size = 60 }: { percentage: number; size?: number }) => {
    const strokeWidth = 5;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-slate-100" />
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="url(#progressGradient)" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-slate-700">{percentage}%</span>
            </div>
        </div>
    );
};

// === Main Component ===
export default function LessonTaskGrid({
    nodes,
    onNodeSelect,
    completedNodeIds,
}: LessonTaskGridProps) {

    const mainPathNodes = nodes.filter(n => n.branchLevel !== 'remedial').sort((a, b) => a.order - b.order);
    const remedialNodes = nodes.filter(n => n.branchLevel === 'remedial');

    const totalTasks = mainPathNodes.length;
    const completedTasks = mainPathNodes.filter(n => completedNodeIds.includes(n.id)).length;
    const progressPercentage = Math.round((completedTasks / totalTasks) * 100);
    const nextTask = mainPathNodes.find(n => !completedNodeIds.includes(n.id)) || mainPathNodes[mainPathNodes.length - 1];

    return (
        <div className="pb-8 space-y-6">

            {/* ====== Header Dashboard ====== */}
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-lg p-4 border border-slate-100 flex items-center gap-4">
                    <CircularProgressRing percentage={progressPercentage} size={60} />
                    <div className="flex-1 flex gap-4 text-sm">
                        <div><span className="text-xl font-bold text-indigo-600">{completedTasks}</span> <span className="text-slate-500">已完成</span></div>
                        <div><span className="text-xl font-bold text-slate-600">{totalTasks - completedTasks}</span> <span className="text-slate-500">剩餘</span></div>
                    </div>
                    <button
                        onClick={() => onNodeSelect(nextTask.id)}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl px-4 py-2 shadow-md hover:shadow-lg transition-all flex items-center gap-2 text-sm font-bold"
                    >
                        <Zap className="w-4 h-4" />
                        繼續學習
                    </button>
                </div>
            </div>

            {/* ====== Horizontal Learning Path ====== */}
            <div className="overflow-x-auto pb-4">
                <div className="flex items-start gap-0 px-8 min-w-max">

                    {/* Start Marker */}
                    <div className="flex flex-col items-center mr-2">
                        <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold shadow-lg">
                            🚀
                        </div>
                        <span className="text-xs text-slate-500 mt-1">開始</span>
                    </div>

                    {mainPathNodes.map((node) => {
                        const isCompleted = completedNodeIds.includes(node.id);
                        const isCurrent = !isCompleted && node.id === nextTask?.id;
                        const isCheckpoint = node.isConditional;

                        const linkedRemedial = isCheckpoint
                            ? remedialNodes.find(r => r.id === node.conditions?.notLearnedPath)
                            : null;

                        return (
                            <div key={node.id} className="flex items-start">
                                {/* Simple Arrow Connector */}
                                <div className="flex flex-col justify-center h-40 px-2 mt-2">
                                    <div className="relative w-12 flex items-center justify-center">
                                        {/* Line */}
                                        <div className={`absolute w-full h-0.5 ${isCompleted || isCurrent ? 'bg-green-300' : 'bg-slate-200'}`} />

                                        {/* Icon */}
                                        <div className={`
                                            relative z-10 p-1 bg-white border-2 rounded-full 
                                            ${isCompleted ? 'border-green-500 text-green-500'
                                                : isCurrent ? 'border-indigo-500 text-indigo-500'
                                                    : 'border-slate-200 text-slate-300'}
                                         `}>
                                            <ArrowRight className="w-4 h-4" strokeWidth={3} />
                                        </div>
                                    </div>
                                </div>

                                {/* Node Column */}
                                <div className="flex flex-col items-center">
                                    {/* Main Node Card */}
                                    <button
                                        onClick={() => onNodeSelect(node.id)}
                                        className={`
                                            w-40 p-4 rounded-xl border transition-all duration-300 text-left group relative z-10
                                            ${isCompleted
                                                ? 'bg-green-50 border-green-200 hover:shadow-md'
                                                : isCurrent
                                                    ? 'bg-white border-indigo-400 shadow-xl ring-2 ring-indigo-100 scale-105'
                                                    : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-lg'
                                            }
                                        `}
                                    >
                                        {/* Checkpoint Badge */}
                                        {isCheckpoint && (
                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow whitespace-nowrap z-20">
                                                🧪 檢測點
                                            </div>
                                        )}

                                        {/* Step Number */}
                                        <div className={`
                                            w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 mx-auto
                                            ${isCompleted ? 'bg-green-500 text-white'
                                                : isCurrent ? 'bg-indigo-600 text-white'
                                                    : 'bg-slate-100 text-slate-500'}
                                        `}>
                                            {isCompleted ? <CheckCircle className="w-4 h-4" /> : node.order}
                                        </div>

                                        {/* Title */}
                                        <h3 className={`font-bold text-sm leading-tight text-center line-clamp-2 ${isCompleted ? 'text-green-700' : 'text-slate-800'}`}>
                                            {getCleanTitle(node.title)}
                                        </h3>

                                        {/* Type */}
                                        <div className="text-[10px] text-slate-400 text-center mt-1 flex items-center justify-center gap-1">
                                            {node.nodeType === 'video' && <><Play className="w-3 h-3" /> 影片</>}
                                            {node.nodeType === 'worksheet' && <><BookOpen className="w-3 h-3" /> 練習</>}
                                            {node.nodeType !== 'video' && node.nodeType !== 'worksheet' && '互動'}
                                        </div>
                                    </button>

                                    {/* Remedial Branch (Visual Flow) - ALWAYS VISIBLE */}
                                    {isCheckpoint && linkedRemedial && (
                                        <div className="relative mt-8 group/branch">
                                            {/* Connecting Curves */}
                                            <svg className="absolute -top-8 left-1/2 -translate-x-1/2 w-8 h-8 overflow-visible pointer-events-none" style={{ zIndex: 0 }}>
                                                {/* Downwards Checkpoint -> Remedial */}
                                                <path
                                                    d="M 0 -5 Q 0 15 0 35"
                                                    fill="none"
                                                    stroke="#fdba74"
                                                    strokeWidth="2"
                                                    strokeDasharray="4 2"
                                                />
                                                <circle cx="0" cy="35" r="3" fill="#fb923c" />
                                            </svg>

                                            <button
                                                onClick={() => onNodeSelect(linkedRemedial.id)}
                                                className="w-36 p-3 rounded-xl border-2 border-dashed border-orange-300 bg-orange-50/50 hover:bg-orange-100 transition-all text-left shadow-sm hover:shadow-md relative z-10"
                                            >
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-100 text-orange-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-200 whitespace-nowrap">
                                                    補救分支
                                                </div>
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-orange-600 mb-1 mt-1">
                                                    <RefreshCw className="w-3 h-3" /> 推薦路徑
                                                </div>
                                                <h4 className="font-bold text-xs text-orange-900 line-clamp-2">
                                                    {getCleanTitle(linkedRemedial.title)}
                                                </h4>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {/* End Marker */}
                    <div className="flex flex-col items-center ml-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white flex items-center justify-center font-bold shadow-lg">
                            🏁
                        </div>
                        <span className="text-xs text-slate-500 mt-1">完成</span>
                    </div>
                </div>
            </div>

            {/* Scroll Hint */}
            <div className="text-center text-xs text-slate-400">
                ← 左右滑動查看完整路徑 →
            </div>
        </div>
    );
}
