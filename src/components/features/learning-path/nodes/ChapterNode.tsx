/**
 * ChapterNode - 章節閱讀節點
 *
 * 功能：
 * - 顯示章節標題與描述
 * - 顯示完成狀態
 * - 顯示 AI 推薦標記
 * - 支援拖曳連接
 */

import { Handle, Position, type NodeProps } from '@xyflow/react';
import { BookOpen, CheckCircle, Sparkles } from 'lucide-react';

export function ChapterNode({ data, selected }: NodeProps) {
  const nodeData = data as any;
  const isCompleted = nodeData.status === 'completed';
  const isInProgress = nodeData.status === 'in_progress';
  const aiGenerated = nodeData.aiGenerated;

  return (
    <div
      className={`
        bg-white rounded-lg border-2 p-4 min-w-[220px] max-w-[280px] shadow-md
        transition-all duration-200
        ${selected ? 'border-indigo-500 shadow-lg ring-2 ring-indigo-200' : 'border-gray-300'}
        ${isCompleted ? 'bg-green-50 border-green-500' : ''}
        ${isInProgress ? 'bg-blue-50 border-blue-500' : ''}
      `}
    >
      {/* 連接點 - 頂部 (輸入) */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-indigo-500 border-2 border-white"
      />

      {/* 圖示與狀態 */}
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-5 h-5 text-indigo-600 flex-shrink-0" />
        {isCompleted && <CheckCircle className="w-4 h-4 text-green-600" />}
        {aiGenerated && <Sparkles className="w-4 h-4 text-purple-600" />}
      </div>

      {/* 標題 */}
      <div className="font-bold text-gray-800 mb-1 line-clamp-2">
        {nodeData.label}
      </div>

      {/* 描述 */}
      {nodeData.description && (
        <div className="text-sm text-gray-600 mb-2 line-clamp-2">
          {nodeData.description}
        </div>
      )}

      {/* 章節標題 */}
      {nodeData.content?.chapterTitle && (
        <div className="text-xs text-gray-500 mt-2 px-2 py-1 bg-gray-100 rounded">
          章節：{nodeData.content.chapterTitle}
        </div>
      )}

      {/* AI 推薦標記 */}
      {aiGenerated && (
        <div className="mt-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium">
          AI 推薦
        </div>
      )}

      {/* 必修標記 */}
      {nodeData.isRequired && (
        <div className="mt-1 text-xs text-red-600 font-medium">
          必修
        </div>
      )}

      {/* 連接點 - 底部 (輸出) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-indigo-500 border-2 border-white"
      />
    </div>
  );
}
