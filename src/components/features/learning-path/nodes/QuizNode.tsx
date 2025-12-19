import { memo } from 'react';
import { type Node, type NodeProps } from '@xyflow/react';
import { Trophy, Target } from 'lucide-react';
import type { LearningPathNode } from '../../../../types';
import { BaseNodeWrapper } from './BaseNodeWrapper';

export const QuizNode = memo(({ data, selected }: NodeProps<Node<LearningPathNode['data']>>) => {
    const threshold = data.completionCriteria?.threshold ?? 80;

    return (
        <BaseNodeWrapper
            selected={selected}
            status={data.status}
            typeLabel="Quiz"
            icon={<Trophy className="w-4 h-4" />}
        // Override default header style for Quiz to make it stand out
        // 這裡如果 BaseNodeWrapper 支援自訂 headerClass 可以傳入，目前先用預設
        >
            <div className="mb-2">
                <h4 className="font-bold text-gray-900 text-base">{data.label}</h4>
                <p className="text-xs text-gray-500">{data.description || "章節總結測驗"}</p>
            </div>

            <div className="flex items-center gap-2 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-100 p-2 rounded-md">
                <Target className="w-3.5 h-3.5" />
                <span>目標分數: {threshold} 分</span>
            </div>

            {data.status === 'completed' && (
                <div className="mt-2 text-center text-xs text-green-600 font-bold">
                    🎉 已通過測驗
                </div>
            )}
        </BaseNodeWrapper>
    );
});

QuizNode.displayName = 'QuizNode';
