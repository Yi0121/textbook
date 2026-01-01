import { memo } from 'react';
import { type Node, type NodeProps } from '@xyflow/react';
import { Video, PlayCircle, Clock } from 'lucide-react';
import type { LearningPathNode } from '../../../../types';
import { BaseNodeWrapper } from './BaseNodeWrapper';

export const VideoNode = memo(({ data, selected }: NodeProps<Node<LearningPathNode['data']>>) => {
    const duration = data.content?.videoDuration || 10; // default 10 mins

    return (
        <BaseNodeWrapper
            selected={selected}
            status={data.status}
            typeLabel="Video"
            icon={<Video className="w-4 h-4" />}
        >
            <div className="font-medium text-gray-900 mb-2 line-clamp-2">
                {data.label}
            </div>

            <div className="relative group cursor-pointer mb-2 overflow-hidden rounded-md bg-gray-100 border border-gray-200 aspect-video flex items-center justify-center">
                {data.content?.videoUrl ? (
                    // In a real app, this might be a thumbnail or iframe
                    <div className="text-xs text-gray-400">Video Preview</div>
                ) : (
                    <div className="text-gray-300">
                        <Video className="w-8 h-8" />
                    </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="w-8 h-8 text-white drop-shadow-md" />
                </div>
            </div>

            <div className="flex items-center text-xs text-gray-500 gap-1">
                <Clock className="w-3 h-3" />
                <span>{duration} min</span>
            </div>
        </BaseNodeWrapper>
    );
});

VideoNode.displayName = 'VideoNode';
