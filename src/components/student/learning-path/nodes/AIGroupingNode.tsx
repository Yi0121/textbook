import { memo } from 'react';
import { type Node, type NodeProps } from '@xyflow/react';
import { Users2, Shuffle, Zap } from 'lucide-react';
import type { LearningPathNode } from '../../../../types';
import { BaseNodeWrapper } from './BaseNodeWrapper';

/**
 * AI 分組節點 - 使用 Grouping Agent
 * 智慧分組，依據能力或學習風格進行分組
 */
export const AIGroupingNode = memo(({ data, selected }: NodeProps<Node<LearningPathNode['data']>>) => {
    const strategy = data.content?.groupingStrategy || 'mixed';

    const getStrategyLabel = () => {
        switch (strategy) {
            case 'ability': return '能力分組';
            case 'random': return '隨機分組';
            default: return '混合分組';
        }
    };

    const getStrategyColor = () => {
        switch (strategy) {
            case 'ability': return 'bg-blue-100 text-blue-700';
            case 'random': return 'bg-gray-100 text-gray-700';
            default: return 'bg-cyan-100 text-cyan-700';
        }
    };

    return (
        <BaseNodeWrapper
            selected={selected}
            status={data.status}
            typeLabel="AI 分組"
            icon={<Users2 className="w-4 h-4" />}
        >
            <div className="font-medium text-cyan-900 mb-2">
                {data.label || '智慧分組'}
            </div>

            <div className="bg-cyan-50/50 p-2 rounded border border-cyan-100 mb-2">
                <div className="flex items-center gap-2 text-xs text-cyan-700 mb-1">
                    <Shuffle className="w-3 h-3" />
                    <span className="font-medium">Grouping Agent</span>
                </div>
                <p className="text-xs text-cyan-600 leading-relaxed">
                    {data.description || '根據學習數據智慧分組'}
                </p>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${getStrategyColor()}`}>
                        {getStrategyLabel()}
                    </span>
                    <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded text-[10px] font-medium">
                        {data.content?.groupSize || 4} 人/組
                    </span>
                </div>
            </div>

            <div className="flex justify-end mt-2">
                <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                    <Zap className="w-3 h-3" />
                    AI 驅動
                </span>
            </div>
        </BaseNodeWrapper>
    );
});

AIGroupingNode.displayName = 'AIGroupingNode';
