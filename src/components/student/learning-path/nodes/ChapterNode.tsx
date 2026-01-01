import { memo } from 'react';
import { type Node, type NodeProps } from '@xyflow/react';
import { BookOpen } from 'lucide-react';
import type { LearningPathNode } from '../../../../types';
import { BaseNodeWrapper } from './BaseNodeWrapper';

// 使用 Node<LearningPathNode['data']> 確保與 React Flow Node 介面相容
export const ChapterNode = memo(({ data, selected }: NodeProps<Node<LearningPathNode['data']>>) => {
  return (
    <BaseNodeWrapper
      selected={selected}
      status={data.status}
      typeLabel="Chapter"
      icon={<BookOpen className="w-4 h-4" />}
    >
      <div className="font-medium text-gray-900 mb-1">
        {data.label}
      </div>

      {data.content?.chapterTitle && (
        <div className="text-sm text-gray-500 mb-2 line-clamp-2">
          {data.content.chapterTitle}
        </div>
      )}

      {data.aiGenerated && (
        <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
          ✨ AI 推薦
        </div>
      )}
    </BaseNodeWrapper>
  );
});

ChapterNode.displayName = 'ChapterNode';
