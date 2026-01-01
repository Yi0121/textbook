import { memo } from 'react';
import { type Node, type NodeProps } from '@xyflow/react';
import { RefreshCw, Gauge, Zap } from 'lucide-react';
import type { LearningPathNode } from '../../../../types';
import { BaseNodeWrapper } from './BaseNodeWrapper';

/**
 * 自適應練習節點 - 使用 Content Generator Agent
 * 根據學生程度自動調整練習難度
 */
export const AdaptiveExerciseNode = memo(({ data, selected }: NodeProps<Node<LearningPathNode['data']>>) => {
    const difficulty = data.content?.difficulty || 'medium';

    const getDifficultyColor = () => {
        switch (difficulty) {
            case 'easy': return 'bg-green-100 text-green-700';
            case 'hard': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    const getDifficultyLabel = () => {
        switch (difficulty) {
            case 'easy': return '基礎';
            case 'hard': return '進階';
            default: return '中等';
        }
    };

    return (
        <BaseNodeWrapper
            selected={selected}
            status={data.status}
            typeLabel="自適應練習"
            icon={<RefreshCw className="w-4 h-4" />}
        >
            <div className="font-medium text-orange-900 mb-2">
                {data.label || '智慧練習題'}
            </div>

            <div className="bg-orange-50/50 p-2 rounded border border-orange-100 mb-2">
                <div className="flex items-center gap-2 text-xs text-orange-700 mb-1">
                    <Gauge className="w-3 h-3" />
                    <span className="font-medium">Content Generator Agent</span>
                </div>
                <p className="text-xs text-orange-600 leading-relaxed">
                    {data.description || '根據學習表現自動調整題目難度'}
                </p>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getDifficultyColor()}`}>
                        難度：{getDifficultyLabel()}
                    </span>
                    <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-[10px] font-medium">
                        {data.content?.questionIds?.length || 5} 題
                    </span>
                </div>
            </div>

            <div className="flex justify-end mt-2">
                <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-orange-400 tracking-wider">
                    <Zap className="w-3 h-3" />
                    AI 驅動
                </span>
            </div>
        </BaseNodeWrapper>
    );
});

AdaptiveExerciseNode.displayName = 'AdaptiveExerciseNode';
