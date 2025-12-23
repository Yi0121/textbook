import { memo } from 'react';
import { type Node, type NodeProps } from '@xyflow/react';
import { BarChart3, TrendingUp, Zap } from 'lucide-react';
import type { LearningPathNode } from '../../../../types';
import { BaseNodeWrapper } from './BaseNodeWrapper';

/**
 * 學習分析節點 - 使用 Process Analyst Agent
 * 追蹤學習歷程，產出分析報告
 */
export const LearningAnalyticsNode = memo(({ data, selected }: NodeProps<Node<LearningPathNode['data']>>) => {
    return (
        <BaseNodeWrapper
            selected={selected}
            status={data.status}
            typeLabel="學習分析"
            icon={<BarChart3 className="w-4 h-4" />}
        >
            <div className="font-medium text-emerald-900 mb-2">
                {data.label || '學習歷程分析'}
            </div>

            <div className="bg-emerald-50/50 p-2 rounded border border-emerald-100 mb-2">
                <div className="flex items-center gap-2 text-xs text-emerald-700 mb-1">
                    <TrendingUp className="w-3 h-3" />
                    <span className="font-medium">Process Analyst Agent</span>
                </div>
                <p className="text-xs text-emerald-600 leading-relaxed">
                    {data.description || '分析學習歷程，追蹤學習進度'}
                </p>
            </div>

            <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-medium">
                    歷程追蹤
                </span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-medium">
                    進度報告
                </span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-medium">
                    成效分析
                </span>
            </div>

            <div className="flex justify-end mt-2">
                <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    <Zap className="w-3 h-3" />
                    AI 驅動
                </span>
            </div>
        </BaseNodeWrapper>
    );
});

LearningAnalyticsNode.displayName = 'LearningAnalyticsNode';
