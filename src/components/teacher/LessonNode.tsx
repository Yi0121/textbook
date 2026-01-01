import { memo } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import {
    Bot,
    PlayCircle
} from 'lucide-react';
import type { LessonNode as LessonNodeType } from '../../types/lessonPlan';

// 定義組件需要的資料結構
type LessonNodeData = {
    lessonNode: LessonNodeType;
    isStart?: boolean;
    isEnd?: boolean;
} & Record<string, unknown>;

// 使用 ReactFlow 的 Node 泛型來定義 Props
// 這樣可以確保符合 NodeTypes 的預期
type CustomNode = Node<LessonNodeData, 'lessonNode'>;

import { getNodeStyleConfig } from '../../utils/nodeStyles';

const LessonNode = ({ data, selected }: NodeProps<CustomNode>) => {
    // 解構資料
    const { lessonNode, isStart, isEnd } = data;
    const { title, branchLevel } = lessonNode;

    const config = getNodeStyleConfig(lessonNode);
    const Icon = config.icon;

    return (
        <div className="relative group">
            {/* Input Handle - 優化版：更大、更明顯、有 hover 效果 */}
            <Handle
                type="target"
                position={Position.Left}
                className="!w-4 !h-4 !bg-indigo-400 border-2 border-white transition-all duration-200 group-hover:!bg-indigo-600 hover:!scale-150 hover:!border-indigo-200 shadow-sm cursor-crosshair"
                style={{ left: -8 }}
            />

            {/* Main Card - 緊湊版 */}
            <div
                className={`
                    w-[180px] rounded-xl overflow-hidden shadow-sm transition-all duration-200 ease-in-out
                    border-2 ${selected ? config.borderSelected : config.border}
                    ${selected ? 'shadow-lg scale-[1.02]' : 'hover:shadow-md hover:-translate-y-0.5'}
                    bg-white
                `}
            >
                {/* Header Strip */}
                <div className={`h-1 w-full bg-gradient-to-r ${config.headerGradient}`} />

                {/* Content Body */}
                <div className="p-2">
                    {/* Top Labels */}
                    <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-[9px] font-bold px-1 py-0.5 rounded text-white bg-gradient-to-r ${config.headerGradient} opacity-90`}>
                            {config.label}
                        </span>

                        {/* Branch Level Indicators */}
                        {branchLevel === 'remedial' && (
                            <span className="text-[9px] font-bold px-1 py-0.5 rounded text-white bg-orange-500 shadow-sm">
                                補強
                            </span>
                        )}
                        {branchLevel === 'advanced' && (
                            <span className="text-[9px] font-bold px-1 py-0.5 rounded text-white bg-purple-500 shadow-sm">
                                進階
                            </span>
                        )}
                    </div>

                    {/* Main Info */}
                    <div className="flex items-start gap-2">
                        <div className={`
                            w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                            ${config.iconBg} ${config.iconColor}
                        `}>
                            <Icon size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-gray-800 text-xs leading-tight line-clamp-2">
                                {title}
                            </h3>
                            {lessonNode.agent && (
                                <div className="text-[9px] text-gray-500 flex items-center gap-1 mt-0.5">
                                    <Bot size={9} />
                                    <span className="truncate">{lessonNode.agent.name}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Preview - 只顯示一行 */}
                    {lessonNode.generatedContent?.materials && lessonNode.generatedContent.materials.length > 0 && (
                        <div className="mt-1.5 pt-1.5 border-t border-gray-100">
                            <span className="text-[9px] px-1 py-0.5 bg-gray-100 text-gray-600 rounded truncate block">
                                {lessonNode.generatedContent.materials[0]}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Start/End Indicators (Floating) */}
            {isStart && (
                <div className="absolute -top-3 -left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10 flex items-center gap-1">
                    <PlayCircle size={10} /> 開始
                </div>
            )}
            {isEnd && (
                <div className="absolute -top-3 -right-2 bg-gray-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10 flex items-center gap-1">
                    結束 <div className="w-2 h-2 bg-white rounded-[1px]" />
                </div>
            )}

            {/* Output Handle - 優化版：更大、更明顯、有hover 效果 */}
            <Handle
                type="source"
                position={Position.Right}
                className="!w-4 !h-4 !bg-indigo-400 border-2 border-white transition-all duration-200 group-hover:!bg-indigo-600 hover:!scale-150 hover:!border-indigo-200 shadow-sm cursor-crosshair"
                style={{ right: -8 }}
            />
        </div>
    );
};

// 自定義比較函數：確保 lessonNode 資料變更時能重新渲染
const areEqual = (prevProps: NodeProps<CustomNode>, nextProps: NodeProps<CustomNode>) => {
    const prevNode = prevProps.data.lessonNode;
    const nextNode = nextProps.data.lessonNode;

    // 比較關鍵欄位
    return (
        prevProps.selected === nextProps.selected &&
        prevNode.id === nextNode.id &&
        prevNode.title === nextNode.title &&
        prevNode.agent?.id === nextNode.agent?.id &&
        prevNode.isConditional === nextNode.isConditional &&
        prevNode.nodeType === nextNode.nodeType &&
        prevNode.selectedTools?.length === nextNode.selectedTools?.length
    );
};

export default memo(LessonNode, areEqual);
