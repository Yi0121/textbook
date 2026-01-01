import { memo } from 'react';
import { type Node, type NodeProps } from '@xyflow/react';
import { Users, MessagesSquare } from 'lucide-react';
import type { LearningPathNode } from '../../../../types';
import { BaseNodeWrapper } from './BaseNodeWrapper';

export const CollaborationNode = memo(({ data, selected }: NodeProps<Node<LearningPathNode['data']>>) => {
    const groupSize = data.content?.groupSize || 4;

    return (
        <BaseNodeWrapper
            selected={selected}
            status={data.status}
            typeLabel="Group Work"
            icon={<Users className="w-4 h-4" />}
        >
            <div className="font-medium text-gray-900 mb-1">
                {data.label}
            </div>

            <div className="bg-orange-50 p-2 rounded border border-orange-100 text-xs text-orange-800 mb-2">
                <div className="flex gap-1.5 mb-1">
                    <MessagesSquare className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span className="line-clamp-2 font-medium">
                        {data.content?.discussionTopic || "小組討論活動"}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex -space-x-1.5 overflow-hidden">
                    {[...Array(Math.min(3, groupSize))].map((_, i) => (
                        <div key={i} className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500">
                            {String.fromCharCode(65 + i)}
                        </div>
                    ))}
                    {groupSize > 3 && (
                        <div className="inline-block h-5 w-5 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-500">
                            +{groupSize - 3}
                        </div>
                    )}
                </div>
                <span>{groupSize} 人/組</span>
            </div>
        </BaseNodeWrapper>
    );
});

CollaborationNode.displayName = 'CollaborationNode';
