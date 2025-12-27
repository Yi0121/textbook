import { memo } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { APOSStage } from '../types/lessonPlan';

// StageNode 的資料結構
type StageNodeData = {
    stage: APOSStage;
    nodeCount: number;
    isExpanded: boolean;
} & Record<string, unknown>;

type CustomStageNode = Node<StageNodeData, 'stageNode'>;

/**
 * StageNode - 顯示 APOS 四大階段的主視圖卡片
 * 點擊後可展開該階段的詳細節點
 */
const StageNode = ({ data, selected }: NodeProps<CustomStageNode>) => {
    const { stage, nodeCount, isExpanded } = data;

    // 根據階段設定顏色
    const getColorClasses = () => {
        switch (stage.id) {
            case 'A':
                return {
                    gradient: 'from-red-400 to-pink-500',
                    border: 'border-red-300',
                    borderSelected: 'border-red-600 ring-4 ring-red-200',
                    bg: 'bg-red-50',
                    iconBg: 'bg-red-100',
                    textColor: 'text-red-700',
                };
            case 'P':
                return {
                    gradient: 'from-blue-400 to-cyan-500',
                    border: 'border-blue-300',
                    borderSelected: 'border-blue-600 ring-4 ring-blue-200',
                    bg: 'bg-blue-50',
                    iconBg: 'bg-blue-100',
                    textColor: 'text-blue-700',
                };
            case 'O':
                return {
                    gradient: 'from-green-400 to-emerald-500',
                    border: 'border-green-300',
                    borderSelected: 'border-green-600 ring-4 ring-green-200',
                    bg: 'bg-green-50',
                    iconBg: 'bg-green-100',
                    textColor: 'text-green-700',
                };
            case 'S':
                return {
                    gradient: 'from-purple-400 to-fuchsia-500',
                    border: 'border-purple-300',
                    borderSelected: 'border-purple-600 ring-4 ring-purple-200',
                    bg: 'bg-purple-50',
                    iconBg: 'bg-purple-100',
                    textColor: 'text-purple-700',
                };
        }
    };

    const colors = getColorClasses();

    return (
        <div className="relative group">
            {/* Input Handle - 所有階段都需要 */}
            <Handle
                type="target"
                position={Position.Left}
                className="!w-4 !h-4 !bg-gray-400 border-2 border-white transition-colors group-hover:!bg-indigo-500"
            />

            {/* Main Card */}
            <div
                className={`
                    w-[240px] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ease-out
                    border-3 ${selected || isExpanded ? colors.borderSelected : colors.border}
                    ${selected || isExpanded ? 'shadow-2xl scale-105' : 'hover:shadow-xl hover:-translate-y-1'}
                    cursor-pointer
                `}
            >
                {/* Header Gradient Strip */}
                <div className={`h-2 w-full bg-gradient-to-r ${colors.gradient}`} />

                {/* Content */}
                <div className={`${colors.bg} p-5`}>
                    {/* Icon + Title */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`
                            w-14 h-14 rounded-xl flex items-center justify-center text-3xl
                            ${colors.iconBg} shadow-sm
                        `}>
                            {stage.icon}
                        </div>
                        <div className="flex-1">
                            <h3 className={`font-bold text-lg ${colors.textColor}`}>
                                {stage.nameZh}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {stage.name}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                        {stage.description}
                    </p>

                    {/* Node Count Badge */}
                    <div className="flex items-center justify-between">
                        <div className={`
                            px-3 py-1.5 rounded-lg ${colors.iconBg} 
                            flex items-center gap-2
                        `}>
                            <svg className={`w-4 h-4 ${colors.textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className={`text-sm font-semibold ${colors.textColor}`}>
                                {nodeCount} 個節點
                            </span>
                        </div>

                        {/* Expand Indicator */}
                        <div className={`
                            w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center
                            transition-transform ${isExpanded ? 'rotate-45' : 'group-hover:scale-110'}
                        `}>
                            <svg className={`w-5 h-5 ${colors.textColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                    </div>

                    {/* 互動提示文字 */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center flex items-center justify-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                            </svg>
                            點擊查看詳細教學流程
                        </p>
                    </div>
                </div>
            </div>

            {/* Hover Tooltip - 顯示階段目標 */}
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                <div className={`
                    ${colors.bg} border-2 ${colors.border} rounded-xl px-4 py-2 shadow-lg whitespace-nowrap
                `}>
                    <p className={`text-xs font-medium ${colors.textColor}`}>
                        展開查看 {nodeCount} 個教學節點
                    </p>
                </div>
            </div>

            {/* Output Handle - 所有階段都需要 */}
            <Handle
                type="source"
                position={Position.Right}
                className="!w-4 !h-4 !bg-gray-400 border-2 border-white transition-colors group-hover:!bg-indigo-500"
            />
        </div>
    );
};

// 自定義比較函數
const areEqual = (prevProps: NodeProps<CustomStageNode>, nextProps: NodeProps<CustomStageNode>) => {
    return (
        prevProps.selected === nextProps.selected &&
        prevProps.data.stage.id === nextProps.data.stage.id &&
        prevProps.data.nodeCount === nextProps.data.nodeCount &&
        prevProps.data.isExpanded === nextProps.data.isExpanded
    );
};

export default memo(StageNode, areEqual);
