import { useMemo } from 'react';
import { ReactFlow, Controls, Position, MarkerType, Handle, type NodeProps } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import type { LessonNode } from '../../types/lessonPlan';
import LessonNodeCard from './LessonNodeCard';
import PathMarkerNode from './PathMarkerNode';
import { Sparkles } from 'lucide-react';

// === Custom Node Wrapper ===
const CustomStudentNode = ({ data }: NodeProps) => {
    return (
        <div className="relative">
            {/* Input Handle (Left) */}
            <Handle type="target" position={Position.Left} className="!w-1 !h-1 !opacity-0" />

            <LessonNodeCard
                node={data.node as LessonNode}
                isCompleted={data.isCompleted as boolean}
                isCurrent={data.isCurrent as boolean}
                isFailed={data.isFailed as boolean}
                onSelect={data.onSelect as (id: string) => void}
            />

            {/* Output Handle (Right - Main Path) */}
            <Handle type="source" position={Position.Right} id="right" className="!w-1 !h-1 !opacity-0" />

            {/* Output Handle (Bottom - Remedial) */}
            <Handle type="source" position={Position.Bottom} id="bottom" className="!w-1 !h-1 !opacity-0" />

            {/* Output Handle (Top - Advanced) */}
            <Handle type="source" position={Position.Top} id="top" className="!w-1 !h-1 !opacity-0" />
        </div>
    );
};

// === AI Recommendation Label Node ===
const AIRecommendationLabel = () => (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-xs font-bold whitespace-nowrap">
        <Sparkles className="w-4 h-4" />
        🤖 AI 推薦學習路徑
    </div>
);

const nodeTypes = {
    studentNode: CustomStudentNode,
    markerNode: PathMarkerNode,
    aiLabel: AIRecommendationLabel,
};

interface StudentPathCanvasProps {
    nodes: LessonNode[];
    completedNodeIds: string[];
    failedNodeIds?: string[]; // 失敗的檢測點 ID
    currentNodeId?: string; // AI 推薦的下一個任務
    onNodeSelect: (nodeId: string) => void;
}

export default function StudentPathCanvas({ nodes, completedNodeIds, failedNodeIds = [], currentNodeId, onNodeSelect }: StudentPathCanvasProps) {
    const mainPathNodes = nodes.filter(n => n.branchLevel !== 'remedial' && n.branchLevel !== 'advanced').sort((a, b) => a.order - b.order);
    const remedialNodes = nodes.filter(n => n.branchLevel === 'remedial');
    const advancedNodes = nodes.filter(n => n.branchLevel === 'advanced');

    // AI 推薦的任務：優先使用傳入的 currentNodeId，否則找第一個未完成的主路徑節點
    const aiRecommendedId = currentNodeId || (mainPathNodes.find(n => !completedNodeIds.includes(n.id))?.id) || null;

    // === Layout Calculation ===
    const { initialNodes, initialEdges } = useMemo(() => {
        const flowNodes = [];
        const flowEdges = [];
        let xPos = 0;
        const X_GAP = 350;
        const Y_GAP = 250;

        // 1. Main Path
        mainPathNodes.forEach((node, index) => {
            const isCompleted = completedNodeIds.includes(node.id);
            const isCurrent = !isCompleted && node.id === aiRecommendedId;
            const isFailed = failedNodeIds.includes(node.id);

            flowNodes.push({
                id: node.id,
                type: 'studentNode',
                position: { x: xPos, y: 0 },
                data: { node, isCompleted, isCurrent, isFailed, onSelect: onNodeSelect },
            });

            // Edge to next main node
            if (index < mainPathNodes.length - 1) {
                const nextNode = mainPathNodes[index + 1];
                flowEdges.push({
                    id: `e-${node.id}-${nextNode.id}`,
                    source: node.id,
                    target: nextNode.id,
                    sourceHandle: 'right',
                    type: 'smoothstep',
                    animated: isCurrent,
                    style: { stroke: isCompleted ? '#22c55e' : '#cbd5e1', strokeWidth: 2 },
                    markerEnd: { type: MarkerType.ArrowClosed, color: isCompleted ? '#22c55e' : '#cbd5e1' },
                });
            }

            // 2. Connect Remedial Nodes (Checkpoints)
            if (node.isConditional && node.conditions?.notLearnedPath) {
                const remedialId = node.conditions.notLearnedPath;
                const remedialNode = remedialNodes.find(r => r.id === remedialId);

                if (remedialNode) {
                    const isRemedialCompleted = completedNodeIds.includes(remedialNode.id);
                    const isRemedialCurrent = remedialNode.id === aiRecommendedId;

                    // Place Remedial Node BELOW
                    flowNodes.push({
                        id: remedialNode.id,
                        type: 'studentNode',
                        position: { x: xPos, y: Y_GAP },
                        data: { node: remedialNode, isCompleted: isRemedialCompleted, isCurrent: isRemedialCurrent, onSelect: onNodeSelect },
                    });

                    // Edge Checkpoint -> Remedial (Positive messaging)
                    flowEdges.push({
                        id: `e-${node.id}-${remedialNode.id}`,
                        source: node.id,
                        target: remedialNode.id,
                        sourceHandle: 'bottom',
                        type: 'smoothstep',
                        label: '💪 額外練習',
                        labelStyle: { fill: '#0891b2', fontWeight: 600, fontSize: 10 },
                        labelBgStyle: { fill: '#ecfeff', rx: 4 },
                        style: { stroke: '#22d3ee', strokeWidth: 2, strokeDasharray: '6,4' },
                        markerEnd: { type: MarkerType.ArrowClosed, color: '#22d3ee' },
                    });

                    // Edge Remedial -> Return (GO BACK)
                    const returnTargetId = remedialNode.nextNodeId || node.id;
                    flowEdges.push({
                        id: `e-${remedialNode.id}-${returnTargetId}-return`,
                        source: remedialNode.id,
                        target: returnTargetId,
                        sourceHandle: 'right',
                        targetHandle: 'bottom',
                        type: 'smoothstep',
                        label: '返回',
                        labelStyle: { fill: '#0891b2', fontWeight: 600, fontSize: 10 },
                        labelBgStyle: { fill: '#ecfeff', rx: 4 },
                        style: { stroke: '#22d3ee', strokeWidth: 2, strokeDasharray: '6,4' },
                        markerEnd: { type: MarkerType.ArrowClosed, color: '#22d3ee' },
                    });
                }
            }

            // 3. Connect Advanced Nodes
            if (node.isConditional && node.conditions?.advancedPath) {
                const advancedId = node.conditions.advancedPath;
                const advancedNode = advancedNodes.find(a => a.id === advancedId);

                if (advancedNode) {
                    // Place Advanced Node ABOVE
                    flowNodes.push({
                        id: advancedNode.id,
                        type: 'studentNode',
                        position: { x: xPos, y: -Y_GAP },
                        data: { node: advancedNode, isCompleted: false, isCurrent: false, onSelect: onNodeSelect },
                    });

                    // Edge Checkpoint -> Advanced
                    flowEdges.push({
                        id: `e-${node.id}-${advancedNode.id}`,
                        source: node.id,
                        target: advancedNode.id,
                        sourceHandle: 'top',
                        type: 'smoothstep',
                        label: '⭐ 進階',
                        labelStyle: { fill: '#a855f7', fontWeight: 600, fontSize: 10 },
                        labelBgStyle: { fill: '#f3e8ff', rx: 4 },
                        style: { stroke: '#a855f7', strokeWidth: 2, strokeDasharray: '6,4' },
                        markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' },
                    });

                    // Edge Advanced -> Next Main
                    if (index < mainPathNodes.length - 1) {
                        const nextMain = mainPathNodes[index + 1];
                        flowEdges.push({
                            id: `e-${advancedNode.id}-${nextMain.id}-return`,
                            source: advancedNode.id,
                            target: nextMain.id,
                            sourceHandle: 'right',
                            targetHandle: 'top',
                            type: 'smoothstep',
                            style: { stroke: '#a855f7', strokeWidth: 2, strokeDasharray: '6,4' },
                            markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' },
                        });
                    }
                }
            }

            xPos += X_GAP;
        });

        // Start Node (Decorative) - Same Y level as main path
        flowNodes.unshift({
            id: 'start-node',
            type: 'markerNode',
            data: { type: 'start' },
            position: { x: -80, y: 60 },
        });

        // Edge Start -> First Node
        if (mainPathNodes.length > 0) {
            flowEdges.unshift({
                id: 'e-start-first',
                source: 'start-node',
                target: mainPathNodes[0].id,
                type: 'smoothstep',
                style: { stroke: '#cbd5e1', strokeWidth: 2 },
                markerEnd: { type: MarkerType.ArrowClosed, color: '#cbd5e1' },
            });
        }

        // Finish Node (Decorative)
        if (mainPathNodes.length > 0) {
            const lastNode = mainPathNodes[mainPathNodes.length - 1];
            flowNodes.push({
                id: 'finish-node',
                type: 'markerNode',
                data: { type: 'finish' },
                position: { x: xPos + 30, y: 55 },
            });
            // Edge Last Node -> Finish
            flowEdges.push({
                id: `e-${lastNode.id}-finish`,
                source: lastNode.id,
                target: 'finish-node',
                sourceHandle: 'right',
                type: 'smoothstep',
                style: { stroke: '#cbd5e1', strokeWidth: 2 },
                markerEnd: { type: MarkerType.ArrowClosed, color: '#cbd5e1' },
            });
        }

        return { initialNodes: flowNodes, initialEdges: flowEdges };

    }, [nodes, completedNodeIds, failedNodeIds, aiRecommendedId, onNodeSelect, mainPathNodes, remedialNodes, advancedNodes]);

    const viewport = { x: 100, y: 300, zoom: 0.85 }; // Initial Viewport

    return (
        <div className="flex-1 w-full h-full bg-transparent">
            <ReactFlow
                nodes={initialNodes}
                edges={initialEdges}
                nodeTypes={nodeTypes}
                defaultViewport={viewport}
                minZoom={0.2}
                maxZoom={1.5}
                attributionPosition="bottom-right"
                proOptions={{ hideAttribution: true }}
            >
                {/* <Background color="#94a3b8" gap={40} size={1} variant={BackgroundVariant.Dots} className="opacity-20" /> */}
                <Controls showInteractive={false} className="!bg-white/80 !backdrop-blur-md !border-0 !shadow-lg !text-purple-600" />
            </ReactFlow>
        </div>
    );
}
