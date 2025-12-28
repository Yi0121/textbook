/**
 * ActivityFlowNode - 新架構的教學活動節點組件
 * 用於 Activity Level View 中顯示單個教學活動
 */

import { memo } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { Video, FileText, CheckSquare, Wrench, PlayCircle, BookOpen, AlertCircle, RotateCcw, Sparkles, GitBranch } from 'lucide-react';
import type { ActivityNode as ActivityNodeType } from '../types/lessonPlan';

// ActivityFlowNode 的資料結構
type ActivityFlowNodeData = {
    activity: ActivityNodeType;
    stageColor: 'red' | 'blue' | 'green' | 'purple';
    isStart?: boolean;
    isEnd?: boolean;
} & Record<string, unknown>;

type CustomActivityFlowNode = Node<ActivityFlowNodeData, 'activityFlowNode'>;

/**
 * 依據活動類型取得對應圖示
 */
const getActivityIcon = (type: ActivityNodeType['type']) => {
    switch (type) {
        case 'intro': return PlayCircle;
        case 'teaching': return BookOpen;
        case 'practice': return CheckSquare;
        case 'checkpoint': return AlertCircle;
        case 'remedial': return RotateCcw;
        case 'application': return Sparkles;
        default: return FileText;
    }
};

/**
 * 依據活動類型取得樣式
 */
const getActivityStyles = (type: ActivityNodeType['type'], _stageColor: string) => {
    const baseStyles: Record<ActivityNodeType['type'], { bg: string; border: string; accent: string; iconBg: string }> = {
        intro: { bg: 'bg-purple-50', border: 'border-purple-200', accent: 'text-purple-600', iconBg: 'bg-purple-100' },
        teaching: { bg: 'bg-blue-50', border: 'border-blue-200', accent: 'text-blue-600', iconBg: 'bg-blue-100' },
        practice: { bg: 'bg-green-50', border: 'border-green-200', accent: 'text-green-600', iconBg: 'bg-green-100' },
        checkpoint: { bg: 'bg-orange-50', border: 'border-orange-300', accent: 'text-orange-600', iconBg: 'bg-orange-100' },
        remedial: { bg: 'bg-amber-50', border: 'border-amber-200', accent: 'text-amber-600', iconBg: 'bg-amber-100' },
        application: { bg: 'bg-indigo-50', border: 'border-indigo-200', accent: 'text-indigo-600', iconBg: 'bg-indigo-100' },
    };
    return baseStyles[type] || { bg: 'bg-gray-50', border: 'border-gray-200', accent: 'text-gray-600', iconBg: 'bg-gray-100' };
};

/**
 * 取得資源類型圖示
 */
const getResourceIcon = (resourceType: string) => {
    switch (resourceType) {
        case 'video': return Video;
        case 'material': return FileText;
        case 'worksheet': return CheckSquare;
        case 'interactive': return Wrench;
        default: return FileText;
    }
};

const ActivityFlowNode = ({ data, selected }: NodeProps<CustomActivityFlowNode>) => {
    const { activity, stageColor, isStart, isEnd } = data;
    const styles = getActivityStyles(activity.type, stageColor);
    const Icon = getActivityIcon(activity.type);
    const hasFlowControl = !!activity.flowControl;
    const defaultResource = activity.resources.find(r => r.isDefault) || activity.resources[0];

    return (
        <div className="relative group">
            {/* Input Handle */}
            {!isStart && (
                <Handle
                    type="target"
                    position={Position.Left}
                    className="!w-3 !h-3 !bg-gray-400 border-2 border-white transition-colors group-hover:!bg-indigo-500"
                />
            )}

            {/* Main Card */}
            <div
                className={`
                    w-[220px] rounded-xl overflow-hidden shadow-md transition-all duration-200
                    border-2 ${selected ? 'border-indigo-500 ring-3 ring-indigo-200 shadow-lg' : styles.border}
                    ${selected ? 'scale-105' : 'hover:shadow-lg hover:-translate-y-0.5'}
                    cursor-pointer bg-white
                `}
            >
                {/* Top Color Bar */}
                <div className={`h-1.5 w-full ${styles.iconBg}`} />

                {/* Content */}
                <div className="p-3">
                    {/* Header: Icon + Title */}
                    <div className="flex items-start gap-2.5 mb-2">
                        <div className={`
                            w-9 h-9 rounded-lg flex items-center justify-center shrink-0
                            ${styles.iconBg} shadow-sm
                        `}>
                            <Icon className={`w-5 h-5 ${styles.accent}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-sm text-gray-800 leading-tight truncate">
                                {activity.title}
                            </h4>
                            <p className={`text-xs ${styles.accent} mt-0.5`}>
                                {activity.estimatedMinutes}分鐘
                            </p>
                        </div>
                    </div>

                    {/* Resource Preview */}
                    {defaultResource && (
                        <div className={`
                            p-2 rounded-lg ${styles.bg} flex items-center gap-2 mb-2
                        `}>
                            {(() => {
                                const ResIcon = getResourceIcon(defaultResource.resourceType);
                                return <ResIcon className={`w-3.5 h-3.5 ${styles.accent} shrink-0`} />;
                            })()}
                            <span className="text-xs text-gray-600 truncate">
                                {defaultResource.generatedContent?.materials?.[0] || '教學資源'}
                            </span>
                            {activity.resources.length > 1 && (
                                <span className={`text-xs ${styles.accent} shrink-0`}>
                                    +{activity.resources.length - 1}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Flow Control Indicator */}
                    {hasFlowControl && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <GitBranch className="w-3.5 h-3.5" />
                            <span>
                                {activity.flowControl!.type === 'checkpoint' && '檢查點分支'}
                                {activity.flowControl!.type === 'multi-choice' && '多選一'}
                                {activity.flowControl!.type === 'differentiation' && '差異化'}
                            </span>
                            <span className="text-gray-400">
                                ({activity.flowControl!.paths?.length || 0} 路徑)
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Output Handle(s) */}
            {!isEnd && (
                hasFlowControl && activity.flowControl?.paths && activity.flowControl.paths.length > 0 ? (
                    // 有分支控制：為每個 path 創建帶 id 的 Handle
                    <>
                        {activity.flowControl.paths.map((path, idx) => (
                            <Handle
                                key={path.id}
                                type="source"
                                position={Position.Right}
                                id={path.id}
                                style={{
                                    top: activity.flowControl!.paths!.length > 1
                                        ? `${30 + idx * 25}%`
                                        : '50%'
                                }}
                                className="!w-3 !h-3 !bg-gray-400 border-2 border-white transition-colors group-hover:!bg-indigo-500"
                            />
                        ))}
                    </>
                ) : (
                    // 無分支控制：單一預設 Handle
                    <Handle
                        type="source"
                        position={Position.Right}
                        className="!w-3 !h-3 !bg-gray-400 border-2 border-white transition-colors group-hover:!bg-indigo-500"
                    />
                )
            )}
        </div>
    );
};

// 自定義比較函數
const areEqual = (
    prevProps: NodeProps<CustomActivityFlowNode>,
    nextProps: NodeProps<CustomActivityFlowNode>
) => {
    return (
        prevProps.selected === nextProps.selected &&
        prevProps.data.activity.id === nextProps.data.activity.id &&
        prevProps.data.activity.title === nextProps.data.activity.title &&
        prevProps.data.activity.resources.length === nextProps.data.activity.resources.length
    );
};

export default memo(ActivityFlowNode, areEqual);
