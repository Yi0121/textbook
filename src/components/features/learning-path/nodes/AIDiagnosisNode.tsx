import { memo } from 'react';
import { type Node, type NodeProps } from '@xyflow/react';
import { Brain, Activity, Zap } from 'lucide-react';
import type { LearningPathNode } from '../../../../types';
import { BaseNodeWrapper } from './BaseNodeWrapper';

/**
 * AI 診斷節點 - 使用 SRL Analyst Agent
 * 分析學生學習狀態，產生個人化建議
 */
export const AIDiagnosisNode = memo(({ data, selected }: NodeProps<Node<LearningPathNode['data']>>) => {
    return (
        <BaseNodeWrapper
            selected={selected}
            status={data.status}
            typeLabel="AI 診斷"
            icon={<Brain className="w-4 h-4" />}
        >
            <div className="font-medium text-purple-900 mb-2">
                {data.label || '學習狀態診斷'}
            </div>

            <div className="bg-purple-50/50 p-2 rounded border border-purple-100 mb-2">
                <div className="flex items-center gap-2 text-xs text-purple-700 mb-1">
                    <Activity className="w-3 h-3" />
                    <span className="font-medium">SRL Analyst Agent</span>
                </div>
                <p className="text-xs text-purple-600 leading-relaxed">
                    {data.description || '分析學習狀態，識別待加強概念'}
                </p>
            </div>

            <div className="flex flex-wrap gap-1">
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-medium">
                    自主學習分析
                </span>
                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-medium">
                    弱點識別
                </span>
            </div>

            <div className="flex justify-end mt-2">
                <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-purple-400 tracking-wider">
                    <Zap className="w-3 h-3" />
                    AI 驅動
                </span>
            </div>
        </BaseNodeWrapper>
    );
});

AIDiagnosisNode.displayName = 'AIDiagnosisNode';
