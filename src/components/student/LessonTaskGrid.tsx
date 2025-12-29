import { Play, BookOpen, CheckCircle, Zap, RefreshCw } from 'lucide-react';
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
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-purple-100" />
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="url(#progressGradient)" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000 ease-out" />
                <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a855f7" />
                        <stop offset="100%" stopColor="#d8b4fe" />
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

    const mainPathNodes = nodes.filter(n => n.branchLevel !== 'remedial' && n.branchLevel !== 'advanced').sort((a, b) => a.order - b.order);
    const remedialNodes = nodes.filter(n => n.branchLevel === 'remedial');

    const totalTasks = mainPathNodes.length;
    const completedTasks = mainPathNodes.filter(n => completedNodeIds.includes(n.id)).length;
    const progressPercentage = Math.round((completedTasks / totalTasks) * 100);
    const nextTask = mainPathNodes.find(n => !completedNodeIds.includes(n.id)) || mainPathNodes[mainPathNodes.length - 1];

    return (
        <div className="h-full flex flex-col">
            {/* ====== Header Dashboard ====== */}
            <div className="flex-shrink-0 px-8 mb-8 pointer-events-none z-20 absolute top-4 right-8">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-3 border border-purple-200 flex items-center gap-4 shadow-xl pointer-events-auto">
                    <CircularProgressRing percentage={progressPercentage} size={50} />
                    <div className="flex flex-col text-sm mr-2">
                        <div className="text-purple-900 font-bold">學習進度</div>
                        <div className="text-xs text-purple-600 font-medium">{completedTasks} / {totalTasks} 完成</div>
                    </div>
                    <button
                        onClick={() => nextTask && onNodeSelect(nextTask.id)}
                        className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl px-4 py-2 shadow-lg hover:shadow-purple-500/20 transition-all flex items-center gap-2 text-sm font-bold"
                    >
                        <Zap className="w-4 h-4 fill-current" />
                        繼續
                    </button>
                </div>
            </div>

            {/* ====== Horizontal Learning Path ====== */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden flex items-center px-12 pb-12 custom-scrollbar">
                <div className="flex items-center gap-0 min-w-max pt-20">

                    {/* Start Marker */}
                    <div className="flex flex-col items-center mr-4 group">
                        <div className="w-12 h-12 rounded-full bg-white border-2 border-green-500 text-green-500 flex items-center justify-center font-bold shadow-lg shadow-green-200 group-hover:scale-110 transition-transform">
                            🚀
                        </div>
                        <span className="text-xs text-green-600 mt-3 font-bold tracking-wider uppercase">Start</span>
                    </div>

                    {mainPathNodes.map((node) => {
                        const isCompleted = completedNodeIds.includes(node.id);
                        const isCurrent = !isCompleted && node.id === nextTask?.id;
                        const isCheckpoint = node.isConditional;

                        const linkedRemedial = isCheckpoint
                            ? remedialNodes.find(r => r.id === node.conditions?.notLearnedPath)
                            : null;

                        return (
                            <div key={node.id} className="flex items-center">
                                {/* Connector Line */}
                                <div className="w-16 h-1 relative flex items-center">
                                    <div className={`absolute w-full h-0.5 ${isCompleted ? 'bg-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-slate-300'}`} />
                                    {isCurrent && (
                                        <div className="absolute w-full h-0.5 bg-purple-500/50 animate-pulse" />
                                    )}
                                </div>

                                {/* Node Column */}
                                <div className="relative group/node">

                                    {/* Advanced Branch (ABOVE card) */}
                                    {isCheckpoint && node.conditions?.advancedPath && (
                                        <div className="absolute bottom-[calc(100%+2.5rem)] left-1/2 -translate-x-1/2 flex flex-col items-center z-0">
                                            <svg className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-8 h-10 overflow-visible pointer-events-none">
                                                <path d="M 0 10 Q 0 -10 0 -40" fill="none" stroke="#a855f7" strokeWidth="2" strokeDasharray="4 2" className="opacity-50" />
                                            </svg>

                                            {(() => {
                                                const advancedNode = nodes.find(n => n.id === node.conditions?.advancedPath);
                                                if (!advancedNode) return null;
                                                return (
                                                    <button
                                                        onClick={() => onNodeSelect(advancedNode.id)}
                                                        className="w-40 p-3 rounded-2xl border border-purple-200 bg-white/80 hover:bg-white backdrop-blur-md transition-all text-left group/adv hover:-translate-y-1 shadow-md hover:shadow-lg"
                                                    >
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="p-1 rounded bg-purple-100 text-purple-600">
                                                                <Zap className="w-3 h-3" />
                                                            </div>
                                                            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Advanced</span>
                                                        </div>
                                                        <h4 className="font-bold text-xs text-slate-800 line-clamp-2">
                                                            {getCleanTitle(advancedNode.title)}
                                                        </h4>
                                                    </button>
                                                )
                                            })()}
                                        </div>
                                    )}

                                    {/* Main Node Card (Hide if Multi-Choice) */}
                                    {!node.multiBranchOptions && (
                                        <button
                                            onClick={() => onNodeSelect(node.id)}
                                            className={`
                                            w-48 p-5 rounded-3xl border transition-all duration-300 text-left relative z-10 flex flex-col gap-3
                                            ${isCompleted
                                                    ? 'bg-green-50/80 border-green-200 hover:border-green-300'
                                                    : isCurrent
                                                        ? 'bg-white border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.15)] scale-110'
                                                        : 'bg-white/80 border-slate-200 hover:border-purple-300 hover:bg-white'
                                                }
                                            backdrop-blur-md shadow-card hover:shadow-card-hover
                                        `}
                                        >
                                            {/* Status Badge */}
                                            <div className="flex items-center justify-between">
                                                <div className={`
                                                w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                                                ${isCompleted ? 'bg-green-100 text-green-600 ring-1 ring-green-200'
                                                        : isCurrent ? 'bg-purple-600 text-white shadow-lg shadow-purple-200'
                                                            : 'bg-slate-100 text-slate-400 ring-1 ring-slate-200'}
                                            `}>
                                                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : node.order}
                                                </div>

                                                {/* Type Icon */}
                                                <div className={`p-1.5 rounded-lg ${isCurrent ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>
                                                    {node.nodeType === 'video' ? <Play className="w-3.5 h-3.5" /> :
                                                        node.nodeType === 'worksheet' ? <BookOpen className="w-3.5 h-3.5" /> :
                                                            <RefreshCw className="w-3.5 h-3.5" />}
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div>
                                                <h3 className={`font-bold text-sm leading-snug line-clamp-2 ${isCurrent ? 'text-slate-900' : 'text-slate-700'}`}>
                                                    {getCleanTitle(node.title)}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-2">
                                                    {isCheckpoint && (
                                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200 flex items-center gap-1">
                                                            <Zap className="w-3 h-3 fill-yellow-700" /> 檢測點
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Active Glow */}
                                            {isCurrent && (
                                                <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/20 pointer-events-none" />
                                            )}
                                        </button>
                                    )}

                                    {/* AI Prediction Tag */}
                                    {isCurrent && !node.multiBranchOptions && (
                                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap">
                                            <div className="bg-purple-600 text-white text-[10px] px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce">
                                                <Zap className="w-3 h-3 fill-current" />
                                                AI 推薦路徑
                                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-4 border-transparent border-t-purple-600"></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* === Multi-Choice Selection UI (Teacher's Differentiation) === */}
                                    {node.multiBranchOptions ? (
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
                                                    onClick={() => onNodeSelect(node.id)} // For now, clicking any selects the node (or handled deeper)
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
                                    ) : null}

                                    {/* Remedial Branch (below card) */}
                                    {isCheckpoint && linkedRemedial && (
                                        <div className="absolute top-[calc(100%+2.5rem)] left-1/2 -translate-x-1/2 flex flex-col items-center z-0">
                                            {/* Dashed Line from Checkpoint down to Remedial */}
                                            <svg className="absolute -top-10 left-1/2 -translate-x-1/2 w-8 h-10 overflow-visible pointer-events-none">
                                                <path d="M 0 -10 Q 0 10 0 40" fill="none" stroke="#fb923c" strokeWidth="2" strokeDasharray="4 2" className="opacity-50" />
                                            </svg>

                                            {/* Remedial Return Arrow (Visual Decoration) */}
                                            <svg className="absolute top-1/2 -right-24 w-20 h-24 overflow-visible pointer-events-none opacity-40">
                                                <path
                                                    d="M -10 0 Q 30 0 30 -40 T 0 -80"
                                                    fill="none"
                                                    stroke="#fb923c"
                                                    strokeWidth="2"
                                                    strokeDasharray="4 4"
                                                    markerEnd="url(#arrowhead-orange)"
                                                />
                                                <defs>
                                                    <marker id="arrowhead-orange" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                                                        <polygon points="0 0, 10 3.5, 0 7" fill="#fb923c" />
                                                    </marker>
                                                </defs>
                                                <text x="35" y="-30" fontSize="10" fill="#fb923c" fontWeight="bold">RETRY</text>
                                            </svg>

                                            <button
                                                onClick={() => onNodeSelect(linkedRemedial.id)}
                                                className="w-40 p-3 rounded-2xl border border-orange-200 bg-white/80 hover:bg-white backdrop-blur-md transition-all text-left group/rem hover:translate-y-1 shadow-md hover:shadow-lg relative z-10"
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="p-1 rounded bg-orange-100 text-orange-600">
                                                        <RefreshCw className="w-3 h-3" />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">Remedial</span>
                                                </div>
                                                <h4 className="font-bold text-xs text-slate-800 line-clamp-2">
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
                    <div className="flex flex-col items-center ml-8 group">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white flex items-center justify-center font-bold shadow-lg shadow-orange-500/40 group-hover:scale-110 transition-transform">
                            <span className="text-2xl">🏁</span>
                        </div>
                        <span className="text-xs text-orange-600/70 mt-3 font-medium tracking-wider uppercase">Finish</span>
                    </div>
                </div>
            </div>

            {/* Scroll Hint */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-slate-400 text-xs tracking-widest uppercase animate-pulse pointer-events-none font-bold">
                Scroll to Explore
            </div>
        </div>
    );
}
