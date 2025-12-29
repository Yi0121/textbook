import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from '@xyflow/react';

export const ConditionalEdge = ({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
}: EdgeProps) => {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetPosition,
        targetX,
        targetY,
    });

    const label = (data?.label as string) || (data?.condition ? `${(data.condition as any).operator} ${(data.condition as any).value}` : '');

    return (
        <>
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    ...style,
                    stroke: '#f59e0b', // Amber color for conditions
                    strokeWidth: 2,
                }}
            />

            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        fontSize: 12,
                        pointerEvents: 'all',
                    }}
                    className="nodrag nopan bg-amber-50 px-2 py-1 rounded border border-amber-200 text-amber-700 shadow-sm font-medium"
                >
                    {label || '?'}
                </div>
            </EdgeLabelRenderer>

        </>
    );
};
