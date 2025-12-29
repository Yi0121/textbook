import { motion } from 'framer-motion';
import { Lock, Star, CheckCircle, Activity, Box, Globe, Play, HelpCircle } from 'lucide-react';
import type { LessonNode } from '../../types/lessonPlan';
import { useMemo } from 'react';

interface AdventureNodeProps {
    node: LessonNode;
    status: 'locked' | 'current' | 'completed' | 'upcoming';
    onClick: () => void;
    x: number;
    y: number;
    delay?: number;
}

export default function AdventureNode({ node, status, onClick, x, y, delay = 0 }: AdventureNodeProps) {

    // 根據節點類型決定外觀
    const design = useMemo(() => {
        const stage = node.stage || 'A';
        switch (stage) {
            case 'A': // Action - 探索
                return {
                    color: 'from-emerald-500 to-teal-600',
                    shadow: 'shadow-teal-200/50',
                    ring: 'ring-teal-200',
                    icon: Play, // Action: Doing/Moving
                    label: '操作'
                };
            case 'P': // Process - 挑戰
                return {
                    color: 'from-amber-500 to-orange-600',
                    shadow: 'shadow-orange-200/50',
                    ring: 'ring-orange-200',
                    icon: Activity, // Process: Flow/Activity
                    label: '過程'
                };
            case 'O': // Object - 奪寶
                return {
                    color: 'from-blue-500 to-indigo-600',
                    shadow: 'shadow-blue-200/50',
                    ring: 'ring-blue-200',
                    icon: Box, // Object: Encapsulated
                    label: '物件'
                };
            case 'S': // Schema - 開拓
                return {
                    color: 'from-violet-500 to-purple-600',
                    shadow: 'shadow-purple-200/50',
                    ring: 'ring-purple-200',
                    icon: Globe, // Schema: Big Picture
                    label: '基模'
                };
            default:
                return {
                    color: 'from-gray-400 to-gray-500',
                    shadow: 'shadow-gray-200/50',
                    ring: 'ring-gray-200',
                    icon: HelpCircle,
                    label: '未知'
                };
        }
    }, [node.stage]);

    const isLocked = status === 'locked' || status === 'upcoming';
    const isCurrent = status === 'current';
    const isCompleted = status === 'completed';

    // Dynamic Icon Component
    const IconComponent = design.icon;

    return (
        <div
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            style={{ left: `${x}%`, top: `${y}%` }}
        >
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay }}
                whileHover={!isLocked ? { scale: 1.05, y: -2 } : {}}
                onClick={onClick}
                className={`
                    relative w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center
                    transition-all duration-300
                    ${isLocked
                        ? 'bg-slate-100 border-2 border-slate-200'
                        : `bg-gradient-to-br ${design.color} shadow-lg ${design.shadow}`
                    }
                    ${isCurrent ? `ring-4 ${design.ring} ring-offset-2` : ''}
                `}
            >
                {/* 浮島底座效果 */}
                {!isLocked && (
                    <div className="absolute top-full w-full h-4 bg-black/10 rounded-full blur-sm transform translate-y-1" />
                )}

                {/* 狀態圖示 */}
                <div className="relative z-10 flex flex-col items-center">
                    {isLocked ? (
                        <Lock className="w-8 h-8 text-slate-300" />
                    ) : (
                        <>
                            <IconComponent className="w-8 h-8 text-white filter drop-shadow-sm mb-1" />
                            {isCompleted && (
                                <div className="absolute -top-3 -right-3 bg-white text-emerald-500 p-1 rounded-full shadow-sm border border-emerald-100">
                                    <CheckCircle size={16} className="text-emerald-500" />
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* 當前關卡指示標 */}
                {isCurrent && (
                    <motion.div
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: -20, opacity: 1 }}
                        transition={{ repeat: Infinity, repeatType: 'reverse', duration: 1 }}
                        className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-white text-indigo-600 text-xs font-bold rounded-full shadow-lg whitespace-nowrap"
                    >
                        目前進度
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white" />
                    </motion.div>
                )}
            </motion.button>

            {/* 標籤 */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: delay + 0.2 }}
                className={`
                    mt-4 text-center absolute left-1/2 -translate-x-1/2 w-40 pointer-events-none
                    ${isCurrent ? 'scale-110' : ''}
                `}
            >
                <div className={`
                    bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl shadow-sm border border-gray-100
                    inline-flex items-center gap-1
                `}>
                    <span className={`text-xs font-bold ${isLocked ? 'text-gray-400' : 'text-gray-800'}`}>
                        {node.title}
                    </span>
                    {isCompleted && (
                        <div className="flex text-yellow-500">
                            {[1, 2, 3].map(i => <Star key={i} size={8} fill="currentColor" />)}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
