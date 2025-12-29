import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
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

    // 根據節點類型決定外觀 (Sky Islands Theme)
    const design = useMemo(() => {
        const stage = node.stage || 'A';
        switch (stage) {
            case 'A': // Action - 起始之島
                return {
                    bgGradient: 'from-emerald-400 to-teal-600',
                    islandColor: '#10b981', // emerald-500
                    shadowColor: 'rgba(16, 185, 129, 0.4)',
                    icon: '🏝️',
                    label: '探索'
                };
            case 'P': // Process - 試煉空域
                return {
                    bgGradient: 'from-amber-400 to-orange-600',
                    islandColor: '#f59e0b', // amber-500
                    shadowColor: 'rgba(245, 158, 11, 0.4)',
                    icon: '⚡',
                    label: '挑戰'
                };
            case 'O': // Object - 寶藏浮島
                return {
                    bgGradient: 'from-blue-400 to-indigo-600',
                    islandColor: '#3b82f6', // blue-500
                    shadowColor: 'rgba(59, 130, 246, 0.4)',
                    icon: '💎',
                    label: '奪寶'
                };
            case 'S': // Schema - 天空之城
                return {
                    bgGradient: 'from-violet-400 to-purple-600',
                    islandColor: '#8b5cf6', // violet-500
                    shadowColor: 'rgba(139, 92, 246, 0.4)',
                    icon: '🏰',
                    label: '榮耀'
                };
            default:
                return {
                    bgGradient: 'from-slate-400 to-slate-600',
                    islandColor: '#94a3b8',
                    shadowColor: 'rgba(148, 163, 184, 0.4)',
                    icon: '☁️',
                    label: '未知'
                };
        }
    }, [node.stage]);

    const isLocked = status === 'locked' || status === 'upcoming';
    const isCurrent = status === 'current';
    const isCompleted = status === 'completed';

    // 隨機生成有機形狀 (Organic Blob Shape)
    const borderRadius = useMemo(() => {
        const seeds = [
            '60% 40% 30% 70% / 60% 30% 70% 40%',
            '30% 70% 70% 30% / 30% 30% 70% 70%',
            '50% 50% 20% 80% / 25% 80% 20% 75%',
            '70% 30% 30% 70% / 60% 40% 60% 40%',
        ];
        // 簡單雜湊
        const idx = (x * y + node.title.length) % seeds.length;
        return seeds[Math.floor(idx)];
    }, [x, y, node.title]);

    return (
        <div
            className="absolute z-10 w-0 h-0 flex justify-center items-center"
            style={{ left: `${x}%`, top: `${y}%` }}
        >
            <div className="relative w-[120px] h-[120px] flex justify-center items-center">
                {/* 浮動動畫容器 */}
                <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: delay * 0.2 // 錯開動畫
                    }}
                    className="relative flex flex-col items-center justify-center cursor-pointer group"
                    onClick={onClick}
                >
                    {/* 島嶼本體 */}
                    <div
                        className={`
                            relative w-20 h-20 md:w-24 md:h-24 transition-all duration-300
                            flex items-center justify-center
                            ${isLocked
                                ? 'bg-slate-200 grayscale opacity-80'
                                : `bg-gradient-to-br ${design.bgGradient} shadow-lg`
                            }
                            ${isCurrent ? 'scale-110 drop-shadow-[0_10px_10px_rgba(255,255,255,0.5)]' : 'group-hover:scale-105'}
                        `}
                        style={{
                            borderRadius: borderRadius,
                            boxShadow: isCurrent ? `0 0 20px ${design.shadowColor}` : `0 10px 15px -3px ${design.shadowColor}`,
                        }}
                    >
                        {/* 鎖定遮罩 / 紋理 */}
                        {isLocked && (
                            <div className="absolute inset-0 bg-black/10" style={{ borderRadius: borderRadius }} />
                        )}

                        {/* 島嶼上的內容 (Icon) */}
                        <div className="text-4xl drop-shadow-md transform transition-transform group-hover:-translate-y-1">
                            {isLocked ? '🔒' : design.icon}
                        </div>

                        {/* 完成標記 (插旗) */}
                        {isCompleted && (
                            <div className="absolute -top-2 -right-2 text-2xl drop-shadow filter animate-bounce">
                                🚩
                            </div>
                        )}
                    </div>

                    {/* 倒影/陰影 (Shadow underneath) */}
                    <div
                        className="absolute -bottom-4 w-16 h-4 bg-black/20 blur-md rounded-full"
                        style={{ opacity: isCurrent ? 0.4 : 0.2, transform: 'scale(1, 0.5)' }}
                    />

                    {/* 當前任務指示標 (Hero Marker) */}
                    {isCurrent && (
                        <motion.div
                            initial={{ opacity: 0, y: -40 }}
                            animate={{ opacity: 1, y: -50 }}
                            transition={{ duration: 0.5 }}
                            className="absolute z-20"
                        >
                            <div className="bg-white/90 text-indigo-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg border border-indigo-100 whitespace-nowrap">
                                📍 當前位置
                            </div>
                            <div className="w-0.5 h-6 bg-white/50 absolute left-1/2 top-full -translate-x-1/2" />
                        </motion.div>
                    )}

                    {/* 標題標籤 (懸浮顯示 或 Current 顯示) */}
                    <motion.div
                        className={`
                            absolute top-full mt-2
                            transition-all duration-300
                            ${isLocked ? 'opacity-60 grayscale' : 'opacity-100'}
                        `}
                    >
                        <div className={`
                            px-3 py-1.5 rounded-lg text-center backdrop-blur-md border outline-4
                            ${isCurrent
                                ? 'bg-white/90 border-indigo-200 shadow-lg scale-110'
                                : 'bg-white/60 border-white/50 shadow-sm'
                            }
                        `}>
                            <div className="text-xs font-bold text-slate-800 whitespace-nowrap">
                                {node.title}
                            </div>
                            {/* 星星評分 (Mock) */}
                            {isCompleted && (
                                <div className="flex justify-center gap-0.5 mt-0.5">
                                    <Star size={8} className="text-yellow-400 fill-yellow-400" />
                                    <Star size={8} className="text-yellow-400 fill-yellow-400" />
                                    <Star size={8} className="text-yellow-400 fill-yellow-400" />
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
