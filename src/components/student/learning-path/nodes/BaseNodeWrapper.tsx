import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { CheckCircle, Circle, AlertCircle, Clock } from 'lucide-react';
import type { NodeStatus } from '../../../../types/learning-path';

interface BaseNodeWrapperProps {
    selected?: boolean;
    status?: NodeStatus;
    typeLabel: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
    showSourceHandle?: boolean;
    showTargetHandle?: boolean;
}

const StatusIcon = ({ status }: { status?: NodeStatus }) => {
    switch (status) {
        case 'completed':
            return <CheckCircle className="w-4 h-4 text-green-500" />;
        case 'in_progress':
            return <Clock className="w-4 h-4 text-blue-500" />;
        case 'failed':
            return <AlertCircle className="w-4 h-4 text-red-500" />;
        default:
            return <Circle className="w-4 h-4 text-gray-300" />;
    }
};

/**
 * 通用節點外殼
 * 處理：選取狀態、連接點 (Handles)、狀態燈號、標題列
 */
export const BaseNodeWrapper = memo(({
    selected,
    status = 'pending',
    typeLabel,
    icon,
    children,
    showSourceHandle = true,
    showTargetHandle = true,
}: BaseNodeWrapperProps) => {
    // 狀態對應的邊框顏色
    const getBorderColor = () => {
        if (selected) return 'border-blue-500 ring-2 ring-blue-200';
        switch (status) {
            case 'completed': return 'border-green-500';
            case 'in_progress': return 'border-blue-500';
            case 'failed': return 'border-red-500';
            default: return 'border-gray-200 hover:border-gray-300';
        }
    };

    // 進行中狀態加入呼吸燈動畫
    const isInProgress = status === 'in_progress';

    return (
        <div className={`
      w-[250px] bg-white rounded-lg shadow-sm border-2 transition-all duration-200
      ${getBorderColor()}
      ${isInProgress && !selected ? 'animate-breathe' : ''}
    `}>
            {/* Input Handle - 左側 */}
            {showTargetHandle && (
                <Handle
                    type="target"
                    position={Position.Left}
                    className="w-4 h-4 !bg-indigo-400 hover:!bg-indigo-500 !border-2 !border-white"
                />
            )}

            {/* Node Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 bg-gray-50 rounded-t-lg">
                <div className="flex items-center gap-2">
                    {icon && <span className="text-gray-500">{icon}</span>}
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {typeLabel}
                    </span>
                </div>
                <StatusIcon status={status} />
            </div>

            {/* Node Content */}
            <div className="p-3">
                {children}
            </div>

            {/* Output Handle - 右側 */}
            {showSourceHandle && (
                <Handle
                    type="source"
                    position={Position.Right}
                    className="w-4 h-4 !bg-indigo-400 hover:!bg-indigo-500 !border-2 !border-white"
                />
            )}
        </div>
    );
});

BaseNodeWrapper.displayName = 'BaseNodeWrapper';
