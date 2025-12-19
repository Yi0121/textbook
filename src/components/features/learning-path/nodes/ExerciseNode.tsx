import { memo } from 'react';
import { type Node, type NodeProps } from '@xyflow/react';
import { PenTool, CheckCircle2 } from 'lucide-react';
import type { LearningPathNode } from '../../../../types';
import { BaseNodeWrapper } from './BaseNodeWrapper';

export const ExerciseNode = memo(({ data, selected }: NodeProps<Node<LearningPathNode['data']>>) => {
    const passingScore = data.content?.passingScore ?? 60;

    return (
        <BaseNodeWrapper
            selected={selected}
            status={data.status}
            typeLabel="Exercise"
            icon={<PenTool className="w-4 h-4" />}
        >
            <div className="font-medium text-gray-900 mb-2">
                {data.label}
            </div>

            <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 p-1.5 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    <span>及格標準: {passingScore} 分</span>
                </div>

                {data.content?.questionIds && (
                    <div className="text-xs text-gray-500 pl-1">
                        包含 {data.content.questionIds.length} 題測驗
                    </div>
                )}
            </div>

            {data.aiGenerated && (
                <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    ✨ AI 推薦練習
                </div>
            )}
        </BaseNodeWrapper>
    );
});

ExerciseNode.displayName = 'ExerciseNode';
