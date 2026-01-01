import { memo } from 'react';
import { type Node, type NodeProps } from '@xyflow/react';
import { Sparkles, MessageSquare } from 'lucide-react';
import type { LearningPathNode } from '../../../../types';
import { BaseNodeWrapper } from './BaseNodeWrapper';

export const AITutorNode = memo(({ data, selected }: NodeProps<Node<LearningPathNode['data']>>) => {

    return (
        <BaseNodeWrapper
            selected={selected}
            status={data.status}
            typeLabel="AI Tutor"
            icon={<Sparkles className="w-4 h-4" />}
        >
            <div className="font-medium text-indigo-900 mb-1">
                {data.label}
            </div>

            <div className="bg-indigo-50/50 p-2 rounded border border-indigo-100 mb-2">
                <div className="flex items-start gap-1.5 text-xs text-indigo-700 italic">
                    <MessageSquare className="w-3 h-3 mt-0.5 shrink-0" />
                    <span className="line-clamp-3 leading-relaxed">
                        {data.content?.aiPrompt || "AI 導師隨時為您解答疑問..."}
                    </span>
                </div>
            </div>

            <div className="flex justify-end">
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    Optional
                </span>
            </div>
        </BaseNodeWrapper>
    );
});

AITutorNode.displayName = 'AITutorNode';
