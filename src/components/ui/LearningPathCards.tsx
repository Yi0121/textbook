/**
 * LearningPathCards - 卡片式學習路徑組件
 * 
 * 類似 Storyboard 的卡片佈局，每個節點都是獨立的卡片
 */

import { BookOpen, Award, Clock, CheckCircle, Lock, Circle, Play } from 'lucide-react';

export interface PathNode {
    id: string;
    title: string;
    status: 'completed' | 'current' | 'locked';
    score?: number;
    timeSpent?: number;
    materials?: string[];
    exercises?: number;
    isCheckpoint?: boolean;
    retryCount?: number;
}

interface LearningPathCardsProps {
    nodes: PathNode[];
    onNodeAction?: (nodeId: string, action: 'continue' | 'review') => void;
    className?: string;
}

export default function LearningPathCards({ nodes, onNodeAction, className = '' }: LearningPathCardsProps) {
    const getStatusStyles = (status: PathNode['status']) => {
        switch (status) {
            case 'completed':
                return {
                    border: 'border-green-200',
                    bg: 'bg-green-50/50',
                    badge: 'bg-green-100 text-green-700',
                    icon: <CheckCircle className="w-5 h-5 text-green-600" />
                };
            case 'current':
                return {
                    border: 'border-indigo-300',
                    bg: 'bg-indigo-50/50',
                    badge: 'bg-indigo-100 text-indigo-700',
                    icon: <Circle className="w-5 h-5 text-indigo-600 fill-indigo-600" />
                };
            case 'locked':
                return {
                    border: 'border-gray-200',
                    bg: 'bg-gray-50',
                    badge: 'bg-gray-100 text-gray-500',
                    icon: <Lock className="w-5 h-5 text-gray-400" />
                };
        }
    };

    const formatTime = (seconds?: number) => {
        if (!seconds) return null;
        const mins = Math.floor(seconds / 60);
        return `${mins} 分鐘`;
    };

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
            {nodes.map((node) => {
                const styles = getStatusStyles(node.status);
                const isInteractive = node.status !== 'locked';

                return (
                    <div
                        key={node.id}
                        className={`
                            relative rounded-xl border-2 ${styles.border} ${styles.bg}
                            transition-all duration-200
                            ${isInteractive ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : 'opacity-75'}
                        `}
                    >
                        {/* 卡片頭部 */}
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        {styles.icon}
                                        <h3 className={`font-bold ${node.status === 'locked' ? 'text-gray-500' : 'text-gray-900'}`}>
                                            {node.title}
                                        </h3>
                                    </div>

                                    {/* 狀態標籤 */}
                                    <div className="flex items-center gap-2">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${styles.badge}`}>
                                            {node.status === 'completed' && '已完成'}
                                            {node.status === 'current' && '進行中'}
                                            {node.status === 'locked' && '未解鎖'}
                                        </span>
                                        {node.isCheckpoint && (
                                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-orange-100 text-orange-700">
                                                檢查點
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* 分數徽章 */}
                                {node.score !== undefined && node.status === 'completed' && (
                                    <div className="flex flex-col items-center bg-white rounded-lg px-3 py-2 shadow-sm">
                                        <div className="text-lg font-bold text-green-600">{node.score}</div>
                                        <div className="text-xs text-gray-500">分</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 卡片內容 */}
                        <div className="p-4 space-y-3">
                            {/* 學習內容 */}
                            {node.materials && node.materials.length > 0 && (
                                <div className="flex items-start gap-2 text-sm">
                                    <BookOpen className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <div className="text-gray-600 font-medium mb-1">教材</div>
                                        <div className="text-gray-700">{node.materials.join(', ')}</div>
                                    </div>
                                </div>
                            )}

                            {/* 練習題 */}
                            {node.exercises !== undefined && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Award className="w-4 h-4 text-yellow-600" />
                                    <span className="text-gray-600 font-medium">練習題：</span>
                                    <span className="text-gray-700 font-semibold">{node.exercises} 題</span>
                                </div>
                            )}

                            {/* 學習時間和重試次數 */}
                            {node.status !== 'locked' && (
                                <div className="flex items-center gap-4 text-sm pt-2 border-t border-gray-200">
                                    {node.timeSpent !== undefined && (
                                        <div className="flex items-center gap-1 text-gray-600">
                                            <Clock className="w-4 h-4" />
                                            <span>{formatTime(node.timeSpent)}</span>
                                        </div>
                                    )}
                                    {node.retryCount !== undefined && node.retryCount > 0 && (
                                        <div className="text-xs text-purple-600 font-medium">
                                            重試 {node.retryCount} 次
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* 卡片底部操作 */}
                        <div className="px-4 pb-4">
                            {node.status === 'current' && (
                                <button
                                    onClick={() => onNodeAction?.(node.id, 'continue')}
                                    className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2"
                                >
                                    <Play className="w-4 h-4" />
                                    繼續學習
                                </button>
                            )}
                            {node.status === 'completed' && (
                                <button
                                    onClick={() => onNodeAction?.(node.id, 'review')}
                                    className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    複習
                                </button>
                            )}
                            {node.status === 'locked' && (
                                <div className="w-full px-4 py-2.5 bg-gray-100 text-gray-500 rounded-lg font-medium text-center flex items-center justify-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    完成前面的關卡以解鎖
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
