/**
 * LessonPrepPreviewPage - 完整視覺化課程編輯器 (三層架構版本)
 * 
 * 視圖層級：
 * 1. Stage Level View - 頂層 APOS 四階段視圖
 * 2. Activity Level View - 展開後的活動流程視圖
 * 3. Resource Binding - 右側資源綁定面板
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ReactFlow, Background, Controls, MarkerType,
    applyNodeChanges, applyEdgeChanges, useReactFlow, ReactFlowProvider,
    type Node, type Edge, type OnNodesChange, type OnEdgesChange, type Connection
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
    BookOpen, Send, ArrowLeft, Trash2, X, Search,
    Maximize, ChevronLeft, Plus,
    Bot, Video, FileText, CheckSquare, Wrench, Layers
} from 'lucide-react';
import dagre from 'dagre';

// 舊架構（向後相容）
import { MOCK_GENERATED_LESSON, AVAILABLE_AGENTS, AVAILABLE_TOOLS, APOS_STAGES } from '../types/lessonPlan';
import type { LessonNode as LessonNodeType, ActivityNode } from '../types/lessonPlan';

// 新架構範例
import { findActivityById } from '../types/mockAposLesson';
// 代數式運算課程（基於論文）
import { ALGEBRA_APOS_LESSON, findAlgebraActivityById } from '../types/algebraAposLesson';
import type { ResourceBinding } from '../types/lessonPlan';

import LessonNode from '../components/LessonNode';
import StageNode from '../components/StageNode';
import ActivityFlowNode from '../components/ActivityFlowNode';
import ResourcePickerModal from '../components/ResourcePickerModal';


// 可拖曳資源卡片組件 (新版)
function DraggableResource({ id, title, desc, color, resourceType }: {
    id: string; title: string; desc: string; source: string; color: string;
    resourceType: 'video' | 'material' | 'worksheet' | 'external';
}) {
    const colorMap: Record<string, string> = {
        red: 'border-red-200 bg-red-50 hover:bg-red-100',
        blue: 'border-blue-200 bg-blue-50 hover:bg-blue-100',
        green: 'border-green-200 bg-green-50 hover:bg-green-100',
        purple: 'border-purple-200 bg-purple-50 hover:bg-purple-100',
    };
    const iconMap: any = {
        video: Video,
        material: FileText,
        worksheet: CheckSquare,
        external: Wrench,
    };
    const Icon = iconMap[resourceType];

    return (
        <div
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('application/reactflow', 'resource');
                e.dataTransfer.setData('resourceId', id);
                e.dataTransfer.setData('resourceTitle', title);
                e.dataTransfer.setData('resourceType', resourceType);
                e.dataTransfer.effectAllowed = 'move';
            }}
            className={`
                group p-3 border rounded-xl cursor-move transition-all duration-200
                ${colorMap[color]} shadow-sm hover:shadow-md hover:-translate-y-0.5
            `}
        >
            <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                    <Icon size={16} className={`text-${color}-500`} />
                </div>
                <div>
                    <div className="font-bold text-sm text-gray-800 leading-tight mb-1">{title}</div>
                    <div className="text-xs text-gray-500">{desc}</div>
                </div>
            </div>
        </div>
    );
}

// Dagre 自動佈局 - 緊湊版
const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    // 節點尺寸 - 更緊湊
    const nodeWidth = 200;
    const nodeHeight = 120;

    dagreGraph.setGraph({
        rankdir: 'LR',      // 左到右
        nodesep: 40,        // 同層節點間距（縮小）
        ranksep: 80,        // 層級間距（縮小）
        marginx: 30,
        marginy: 30,
    });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });
    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        let yOffset = 0;

        // 舊架構：根據 branchLevel 調整位置
        // 新架構：根據 activity.type 調整（remedial 下移）
        if (node.type === 'lessonNode' && node.data.lessonNode) {
            const lessonNode = node.data.lessonNode as LessonNodeType;
            if (lessonNode.branchLevel === 'remedial') yOffset = 200;
            else if (lessonNode.branchLevel === 'advanced') yOffset = -200;
        } else if (node.type === 'activityFlowNode' && node.data.activity) {
            const activity = node.data.activity as ActivityNode;
            if (activity.type === 'remedial') yOffset = 200;
        }

        return {
            ...node,
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2 + yOffset,
            },
        };
    });

    return { nodes: layoutedNodes, edges };
};

type LeftPanelTab = 'agents' | 'video' | 'material' | 'worksheet' | 'external';

// 新增：視圖層級類型
type ViewLevel = 'stage' | 'activity';

function LessonPrepPreviewPageInner() {
    const navigate = useNavigate();
    const { fitView } = useReactFlow();

    // ===== 新架構 State =====
    // 使用代數式運算 APOS 課程（基於論文）
    const [aposLesson, setAposLesson] = useState(ALGEBRA_APOS_LESSON);

    // 視圖層級控制：'stage' = 顯示四個 APOS 階段卡片, 'activity' = 顯示某階段內的活動
    const [viewLevel, setViewLevel] = useState<ViewLevel>('stage');

    // 當前選中的 Stage（展開時使用）
    const [expandedStage, setExpandedStage] = useState<'A' | 'P' | 'O' | 'S' | null>(null);

    // 當前選中的 Activity（用於右側資源綁定面板）
    const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);

    // ===== 舊架構相容 State =====
    // 保留舊架構的 lesson 以維持現有功能
    const [lesson, setLesson] = useState(MOCK_GENERATED_LESSON);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    // ===== UI State =====
    const [activeTab, setActiveTab] = useState<LeftPanelTab>('agents');
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [headerVisible, setHeaderVisible] = useState(true);
    const [isResourcePickerOpen, setIsResourcePickerOpen] = useState(false);

    // ===== Computed Values =====
    // 安全訪問 lesson.nodes（兼容新舊架構）
    const lessonNodes = useMemo(() => lesson.nodes ?? [], [lesson.nodes]);

    // 安全訪問 aposLesson.stages
    const aposStages = useMemo(() => aposLesson.stages ?? [], [aposLesson.stages]);

    // 取得選中的 Activity（用於右側面板）
    const selectedActivity = useMemo(() => {
        if (!selectedActivityId) return null;
        return findAlgebraActivityById(aposLesson, selectedActivityId);
    }, [aposLesson, selectedActivityId]);

    // Node Types Definition - 支援三種節點類型
    const nodeTypes = useMemo(() => ({
        lessonNode: LessonNode,           // 舊架構的教學節點
        stageNode: StageNode,             // APOS 階段卡片
        activityFlowNode: ActivityFlowNode, // 新架構的活動節點
    }), []);

    // ===== 新架構：從 APOSStageNode 創建 Stage Level 節點 =====
    const createStageNodesFromApos = useCallback(() => {
        // 圓形佈局位置
        const positions = [
            { x: 200, y: 50 },   // A (左上)
            { x: 550, y: 50 },   // P (右上)
            { x: 650, y: 350 },  // O (右下)
            { x: 100, y: 350 },  // S (左下)
        ];

        return aposStages.map((stage, idx) => ({
            id: `stage-${stage.stage}`,
            type: 'stageNode',
            position: positions[idx] || { x: idx * 300, y: 100 },
            data: {
                stage: APOS_STAGES[stage.stage],
                nodeCount: stage.activities.length,
                isExpanded: expandedStage === stage.stage,
            },
        }));
    }, [aposStages, expandedStage]);

    // ===== 新架構：從 ActivityNode[] 創建 Activity Level 節點 =====
    const createActivityFlowNodes = useCallback((activities: ActivityNode[], stageId: 'A' | 'P' | 'O' | 'S') => {
        const stageColorMap: Record<'A' | 'P' | 'O' | 'S', 'red' | 'blue' | 'green' | 'purple'> = {
            A: 'red', P: 'blue', O: 'green', S: 'purple'
        };

        return activities.map((activity, idx) => ({
            id: activity.id,
            type: 'activityFlowNode',
            position: { x: 0, y: 0 },  // 會被 dagre 重新計算
            data: {
                activity,
                stageColor: stageColorMap[stageId],
                isStart: idx === 0,
                isEnd: idx === activities.length - 1 && !activity.flowControl,
            },
        }));
    }, []);

    // ===== 新架構：從 ActivityNode[] 創建 Edges（分支類型區分） =====
    const createActivityFlowEdges = useCallback((activities: ActivityNode[]): Edge[] => {
        const edges: Edge[] = [];

        activities.forEach((activity, idx) => {
            if (activity.flowControl && activity.flowControl.paths) {
                const flowType = activity.flowControl.type;

                activity.flowControl.paths.forEach((path, pathIdx) => {
                    // 根據分支類型和路徑判斷樣式
                    let edgeStyle: {
                        stroke: string;
                        strokeWidth: number;
                        strokeDasharray?: string;
                    };
                    let labelStyle: { fill: string; fontWeight: number; fontSize: number };
                    let labelBgStyle: { fill: string };
                    let markerColor: string;
                    let animated: boolean = true;

                    if (flowType === 'checkpoint') {
                        // Checkpoint 分支：通過=綠色實線，補救=橘色虛線
                        const isPass = path.label.includes('✓') || path.label.includes('學會') || path.label.includes('通過');
                        const isRemedial = path.label.includes('✗') || path.label.includes('補') || path.label.includes('回到');

                        if (isPass) {
                            edgeStyle = { stroke: '#22c55e', strokeWidth: 3 };
                            labelStyle = { fill: '#16a34a', fontWeight: 700, fontSize: 12 };
                            labelBgStyle = { fill: '#dcfce7' };
                            markerColor = '#22c55e';
                        } else if (isRemedial) {
                            edgeStyle = { stroke: '#f97316', strokeWidth: 2, strokeDasharray: '8,4' };
                            labelStyle = { fill: '#ea580c', fontWeight: 600, fontSize: 11 };
                            labelBgStyle = { fill: '#ffedd5' };
                            markerColor = '#f97316';
                            animated = false; // 補救路徑不動畫
                        } else {
                            edgeStyle = { stroke: '#6366f1', strokeWidth: 2 };
                            labelStyle = { fill: '#4f46e5', fontWeight: 600, fontSize: 11 };
                            labelBgStyle = { fill: '#e0e7ff' };
                            markerColor = '#6366f1';
                        }
                    } else if (flowType === 'multi-choice') {
                        // Multi-choice 分支：所有選項用不同顏色，最終匯流
                        const colors = ['#8b5cf6', '#3b82f6', '#06b6d4', '#10b981'];
                        const colorIdx = pathIdx % colors.length;
                        edgeStyle = { stroke: colors[colorIdx], strokeWidth: 2 };
                        labelStyle = { fill: colors[colorIdx], fontWeight: 600, fontSize: 11 };
                        labelBgStyle = { fill: '#f5f3ff' };
                        markerColor = colors[colorIdx];
                    } else if (flowType === 'differentiation') {
                        // Differentiation 分支：進階=藍色，標準=綠色，補救=橘色
                        const isAdvanced = path.label.includes('進階') || path.label.includes('advanced');
                        const isStandard = path.label.includes('標準') || path.label.includes('standard');

                        if (isAdvanced) {
                            edgeStyle = { stroke: '#3b82f6', strokeWidth: 3 };
                            labelStyle = { fill: '#2563eb', fontWeight: 700, fontSize: 12 };
                            labelBgStyle = { fill: '#dbeafe' };
                            markerColor = '#3b82f6';
                        } else if (isStandard) {
                            edgeStyle = { stroke: '#22c55e', strokeWidth: 2 };
                            labelStyle = { fill: '#16a34a', fontWeight: 600, fontSize: 11 };
                            labelBgStyle = { fill: '#dcfce7' };
                            markerColor = '#22c55e';
                        } else {
                            edgeStyle = { stroke: '#f97316', strokeWidth: 2, strokeDasharray: '6,3' };
                            labelStyle = { fill: '#ea580c', fontWeight: 600, fontSize: 11 };
                            labelBgStyle = { fill: '#ffedd5' };
                            markerColor = '#f97316';
                        }
                    } else {
                        // 預設樣式
                        edgeStyle = { stroke: '#6366f1', strokeWidth: 2 };
                        labelStyle = { fill: '#4f46e5', fontWeight: 600, fontSize: 11 };
                        labelBgStyle = { fill: '#e0e7ff' };
                        markerColor = '#6366f1';
                    }

                    edges.push({
                        id: `e-${activity.id}-${path.id}`,
                        source: activity.id,
                        target: path.nextActivityId,
                        sourceHandle: path.id,
                        animated,
                        label: path.label,
                        markerEnd: { type: MarkerType.ArrowClosed, color: markerColor },
                        style: edgeStyle,
                        labelStyle,
                        labelBgStyle,
                        labelBgPadding: [6, 4] as [number, number],
                        labelBgBorderRadius: 6,
                    });
                });
            } else if (idx < activities.length - 1) {
                // 線性連接到下一個
                edges.push({
                    id: `e-${activity.id}-${activities[idx + 1].id}`,
                    source: activity.id,
                    target: activities[idx + 1].id,
                    type: 'default',
                    markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
                    style: { strokeWidth: 2, stroke: '#94a3b8' },
                });
            }
        });

        // DEBUG: 檢查生成的 edges (可在確認正常後移除)

        return edges;
    }, []);

    // Create ReactFlow Nodes (舊架構)
    const createReactFlowNodes = useCallback((lessonNodes: LessonNodeType[]) => {
        return lessonNodes.map((node, idx) => ({
            id: node.id,
            type: 'lessonNode',
            position: { x: 0, y: 0 },
            data: {
                lessonNode: node,
                isStart: idx === 0,
                isEnd: idx === lessonNodes.length - 1 && !node.nextNodeId && !node.conditions
            },
        }));
    }, []);

    // Create Edges
    const createEdges = useCallback((lessonNodes: LessonNodeType[]): Edge[] => {
        const edges: Edge[] = [];
        lessonNodes.forEach((node, idx) => {
            const commonStyle = { strokeWidth: 2 };

            if (node.isConditional && node.conditions) {
                // Conditional Edges
                if (node.conditions.learnedPath) {
                    edges.push({
                        id: `e${node.id}-learned`,
                        source: node.id,
                        target: node.conditions.learnedPath,
                        animated: true,
                        label: '通過',
                        markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' },
                        style: { ...commonStyle, stroke: '#22c55e' },
                        labelStyle: { fill: '#22c55e', fontWeight: 700 },
                        labelBgStyle: { fill: '#f0fdf4' },
                    });
                }
                if (node.conditions.notLearnedPath) {
                    edges.push({
                        id: `e${node.id}-not-learned`,
                        source: node.id,
                        target: node.conditions.notLearnedPath,
                        animated: true,
                        label: '補強',
                        markerEnd: { type: MarkerType.ArrowClosed, color: '#f97316' },
                        style: { ...commonStyle, stroke: '#f97316', strokeDasharray: '5,5' },
                        labelStyle: { fill: '#f97316', fontWeight: 700 },
                        labelBgStyle: { fill: '#fff7ed' },
                    });
                }
                if (node.conditions.advancedPath) {
                    edges.push({
                        id: `e${node.id}-advanced`,
                        source: node.id,
                        target: node.conditions.advancedPath,
                        animated: true,
                        label: '進階',
                        markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' },
                        style: { ...commonStyle, stroke: '#a855f7' },
                        labelStyle: { fill: '#a855f7', fontWeight: 700 },
                        labelBgStyle: { fill: '#faf5ff' },
                    });
                }
            } else if (node.nextNodeId) {
                edges.push({
                    id: `e${node.id}-next`,
                    source: node.id,
                    target: node.nextNodeId,
                    type: 'default',
                    markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
                    style: { ...commonStyle, stroke: '#6366f1' },
                });
            } else if (idx < lessonNodes.length - 1) {
                edges.push({
                    id: `e${node.id}-${lessonNodes[idx + 1].id}`,
                    source: node.id,
                    target: lessonNodes[idx + 1].id,
                    type: 'default',
                    markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
                    style: { ...commonStyle, stroke: '#94a3b8' },
                });
            }
        });
        return edges;
    }, []);

    // ===== NEW: Group Nodes by Stage =====
    const groupNodesByStage = useCallback((lessonNodes: LessonNodeType[]) => {
        const nodes = lessonNodes || [];
        return {
            A: nodes.filter(n => n.stage === 'A'),
            P: nodes.filter(n => n.stage === 'P'),
            O: nodes.filter(n => n.stage === 'O'),
            S: nodes.filter(n => n.stage === 'S'),
        };
    }, []);

    // ===== NEW: Create StageNodes for Main View =====
    const createStageNodes = useCallback(() => {
        const grouped = groupNodesByStage(lesson.nodes ?? []);
        const stages: ('A' | 'P' | 'O' | 'S')[] = ['A', 'P', 'O', 'S'];

        // 圓形佈局位置（讓循環路徑更清晰）
        const positions = [
            { x: 200, y: 50 },   // A (左上)
            { x: 550, y: 50 },   // P (右上)
            { x: 650, y: 350 },  // O (右下)
            { x: 100, y: 350 },  // S (左下)
        ];

        return stages.map((stageId, idx) => ({
            id: `stage-${stageId}`,
            type: 'stageNode',
            position: positions[idx],
            data: {
                stage: APOS_STAGES[stageId],
                nodeCount: grouped[stageId].length,
                isExpanded: expandedStage === stageId,
            },
        }));
    }, [lesson.nodes, expandedStage, groupNodesByStage]);

    // ===== NEW: Create StageEdges (APOS Cycle) =====
    const createStageEdges = useCallback((): Edge[] => {
        return [
            // 1. Interiorization: A → P (Actions 內化為 Processes)
            {
                id: 'stage-A-P',
                source: 'stage-A',
                target: 'stage-P',
                label: '內化',
                animated: true,
                markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
                style: { strokeWidth: 3, stroke: '#6366f1' },
                labelStyle: { fill: '#6366f1', fontWeight: 600, fontSize: 12 },
                labelBgStyle: { fill: '#f0f4ff', padding: 4 },
            },
            // 2. Encapsulation: P → O (Processes 封裝為 Objects)
            {
                id: 'stage-P-O',
                source: 'stage-P',
                target: 'stage-O',
                label: '封裝',
                animated: true,
                markerEnd: { type: MarkerType.ArrowClosed, color: '#22c55e' },
                style: { strokeWidth: 3, stroke: '#22c55e' },
                labelStyle: { fill: '#22c55e', fontWeight: 600, fontSize: 12 },
                labelBgStyle: { fill: '#f0fdf4', padding: 4 },
            },
            // 3. De-encapsulation: O → P (Objects 解封裝回 Processes，雙向)
            {
                id: 'stage-O-P',
                source: 'stage-O',
                target: 'stage-P',
                label: '解封裝',
                animated: true,
                markerEnd: { type: MarkerType.ArrowClosed, color: '#f97316' },
                style: { strokeWidth: 2, stroke: '#f97316', strokeDasharray: '5,5' },
                labelStyle: { fill: '#f97316', fontWeight: 600, fontSize: 12 },
                labelBgStyle: { fill: '#fff7ed', padding: 4 },
            },
            // 4. Coordination: P → S (Processes 協調整合為 Schema)
            {
                id: 'stage-P-S',
                source: 'stage-P',
                target: 'stage-S',
                label: '整合',
                animated: true,
                markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' },
                style: { strokeWidth: 3, stroke: '#a855f7' },
                labelStyle: { fill: '#a855f7', fontWeight: 600, fontSize: 12 },
                labelBgStyle: { fill: '#faf5ff', padding: 4 },
            },
            // 5. Reversal/Application: S → A (Schema 回到新的 Actions，完成循環)
            {
                id: 'stage-S-A',
                source: 'stage-S',
                target: 'stage-A',
                label: '應用',
                animated: true,
                markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' },
                style: { strokeWidth: 2, stroke: '#8b5cf6', strokeDasharray: '8,4' },
                labelStyle: { fill: '#8b5cf6', fontWeight: 600, fontSize: 12 },
                labelBgStyle: { fill: '#f5f3ff', padding: 4 },
            },
        ];
    }, []);

    // Initial Layout Effect
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // 初始化佈局（只執行一次）
    useEffect(() => {
        if (isInitialized) return;

        // 初始狀態：顯示 APOS 主視圖
        const stageNodes = createStageNodes();
        const stageEdges = createStageEdges();

        setNodes(stageNodes);
        setIsInitialized(true);

        // 延遲設置 edges，確保 nodes 已經完全渲染
        setTimeout(() => {
            setEdges(stageEdges);
            fitView({ padding: 0.25, duration: 800 });
        }, 100);
    }, [isInitialized, createStageNodes, createStageEdges, fitView]);

    // 資料同步：當 lesson.nodes 變更時，只更新節點的 data（不改變位置）
    useEffect(() => {
        if (!isInitialized) return;

        setNodes(prevNodes => {
            // 檢查是否有節點被新增或刪除
            const lessonNodeIds = new Set(lessonNodes.map(n => n.id));
            const currentNodeIds = new Set(prevNodes.map(n => n.id));

            const hasAddedNodes = lessonNodes.some(n => !currentNodeIds.has(n.id));
            const hasRemovedNodes = prevNodes.some(n => !lessonNodeIds.has(n.id));

            if (hasAddedNodes || hasRemovedNodes) {
                // 節點數量變化時重新佈局
                const rfNodes = createReactFlowNodes(lessonNodes);
                const rfEdges = createEdges(lessonNodes);
                const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(rfNodes, rfEdges);
                setEdges(layoutedEdges);
                return layoutedNodes;
            }

            // 只更新現有節點的 data
            return prevNodes.map(node => {
                const lessonNode = lessonNodes.find(n => n.id === node.id);
                if (lessonNode) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            lessonNode
                        }
                    };
                }
                return node;
            });
        });

        // 同步 edges（條件分支可能變化）
        setEdges(createEdges(lessonNodes));
    }, [lessonNodes, isInitialized, createReactFlowNodes, createEdges]);

    // ===== 當 expandedStage 變更時，切換視圖層級 =====
    useEffect(() => {
        if (!isInitialized) return;

        if (expandedStage === null) {
            // 返回 Stage Level View：顯示 4 個階段節點
            // 優先使用新架構
            if (aposStages.length > 0) {
                setNodes(createStageNodesFromApos());
                setEdges(createStageEdges());
            } else {
                setNodes(createStageNodes());
                setEdges(createStageEdges());
            }
            setViewLevel('stage');
            setTimeout(() => fitView({ padding: 0.3, duration: 500 }), 100);
        } else {
            // 顯示 Activity Level View：展開階段內的活動
            setViewLevel('activity');

            // 優先使用新架構（aposStages）
            const aposStage = aposStages.find(s => s.stage === expandedStage);

            if (aposStage && aposStage.activities.length > 0) {
                // 新架構：使用 ActivityFlowNode
                const rfNodes = createActivityFlowNodes(aposStage.activities, expandedStage);
                const rfEdges = createActivityFlowEdges(aposStage.activities);
                const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(rfNodes, rfEdges);
                setNodes(layoutedNodes);
                setEdges(layoutedEdges);
            } else {
                // 舊架構相容：使用 LessonNode
                const grouped = groupNodesByStage(lessonNodes);
                const stageNodes = grouped[expandedStage];
                const rfNodes = createReactFlowNodes(stageNodes);
                const rfEdges = createEdges(stageNodes);
                const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(rfNodes, rfEdges);
                setNodes(layoutedNodes);
                setEdges(layoutedEdges);
            }
            setTimeout(() => fitView({ padding: 0.25, duration: 500 }), 100);
        }
    }, [expandedStage, isInitialized, aposStages, createStageNodesFromApos, createStageNodes, createActivityFlowNodes, createActivityFlowEdges, groupNodesByStage, lessonNodes, createReactFlowNodes, createEdges, fitView, setViewLevel]);


    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;
            if (e.key === 'h' && !e.ctrlKey && !e.metaKey) {
                setHeaderVisible(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    // Handlers
    const onNodesChange: OnNodesChange = useCallback(changes => setNodes(nds => applyNodeChanges(changes, nds)), []);
    const onEdgesChange: OnEdgesChange = useCallback(changes => setEdges(eds => applyEdgeChanges(changes, eds)), []);
    const onConnect = useCallback((connection: Connection) => {
        if (!connection.source || !connection.target) return;
        setLesson(prev => ({
            ...prev,
            nodes: (prev.nodes ?? []).map(n => n.id === connection.source ? { ...n, nextNodeId: connection.target } : n)
        }));
    }, []);

    const handleDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        const type = event.dataTransfer.getData('application/reactflow');
        const reactFlowBounds = (event.target as HTMLElement).getBoundingClientRect();

        // Calculate Position
        const position = {
            x: event.clientX - reactFlowBounds.left - 140, // Offset for center
            y: event.clientY - reactFlowBounds.top - 50,
        };

        let newNode: LessonNodeType;
        const baseNode = {
            id: `node-${Date.now()}`,
            order: lessonNodes.length + 1,
            selectedTools: [],
            // 根據當前展開的階段自動設定 stage 屬性
            stage: expandedStage || undefined,  // 如果在階段視圖內，設定對應的 stage
        };

        if (type === 'agent') {
            const agentId = event.dataTransfer.getData('agentId');
            const agent = AVAILABLE_AGENTS.find(a => a.id === agentId);
            if (!agent) return;
            newNode = { ...baseNode, title: agent.name, nodeType: 'agent', agent };
        } else if (type === 'resource') {
            const resourceTitle = event.dataTransfer.getData('resourceTitle');
            const resourceType = event.dataTransfer.getData('resourceType') as any;
            newNode = { ...baseNode, title: resourceTitle, nodeType: resourceType, agent: AVAILABLE_AGENTS[0] };
        } else return;

        // Add Node
        const updatedLessonNodes = [...lessonNodes, newNode];
        setLesson(prev => ({ ...prev, nodes: updatedLessonNodes }));

        // Optimistic UI update for node position
        const newRfNode = {
            id: newNode.id,
            type: 'lessonNode',
            position,
            data: { lessonNode: newNode, isStart: false, isEnd: true }
        };
        setNodes(nds => [...nds, newRfNode]);
    }, [lessonNodes, nodes, expandedStage]);

    // UI Components
    const selectedNode = lessonNodes.find(n => n.id === selectedNodeId);

    // Sidebar Tabs Config
    const SIDEBAR_TABS = [
        { id: 'agents', label: 'AI Agent', icon: Bot, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { id: 'video', label: '影片', icon: Video, color: 'text-red-600', bg: 'bg-red-50' },
        { id: 'material', label: '教材', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 'worksheet', label: '練習', icon: CheckSquare, color: 'text-green-600', bg: 'bg-green-50' },
        { id: 'external', label: '工具', icon: Wrench, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    // 新增活動功能
    const handleAddActivity = () => {
        if (!expandedStage) return;

        setAposLesson(prev => {
            if (!prev.stages) return prev;

            // 找到當前 Stage
            const stageIndex = prev.stages.findIndex(s => s.stage === expandedStage);
            if (stageIndex === -1) return prev;

            const currentStage = prev.stages[stageIndex];
            const newActivityId = `activity-${expandedStage}-${Date.now()}`;

            // 創建新活動節點
            const newActivity: ActivityNode = {
                id: newActivityId,
                type: 'teaching', // 預設類型
                title: '新增教學活動',
                description: '請輸入活動描述...',
                estimatedMinutes: 10,
                resources: [],
                order: currentStage.activities.length + 1,
            };

            const newStages = [...prev.stages];
            newStages[stageIndex] = {
                ...currentStage,
                activities: [...currentStage.activities, newActivity]
            };

            return {
                ...prev,
                stages: newStages
            };
        });
    };

    return (
        <div className="h-screen w-screen flex bg-gray-50 overflow-hidden relative font-sans">
            {/* Top Hover Trigger Area */}
            <div
                className="absolute top-0 left-0 right-0 h-20 z-10"
                onMouseEnter={() => setHeaderVisible(true)}
            />

            {/* Floating Glass Header */}
            <div
                className={`absolute top-4 right-4 z-20 flex items-center justify-between pointer-events-none transition-all duration-300 ${headerVisible ? 'translate-y-0' : '-translate-y-24'}`}
                style={{ left: isSidebarOpen ? '320px' : '80px' }}
            >
                <div className="flex items-center gap-4 pointer-events-auto">
                    {/* Main Title Card */}
                    <div className="bg-white/90 backdrop-blur-md shadow-sm border border-white/50 px-6 py-3 rounded-2xl flex items-center gap-4">
                        <button onClick={() => navigate('/lesson-prep')} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-indigo-600" />
                                {aposLesson.title || lesson.title}
                            </h1>
                            <p className="text-xs text-gray-500 font-medium">Draft • {viewLevel === 'stage' ? 'APOS Stages' : `${expandedStage} Stage Activities`}</p>
                        </div>
                    </div>

                    {/* Stage Navigation / Actions */}
                    {viewLevel === 'activity' && (
                        <div className="bg-white/90 backdrop-blur-md shadow-sm border border-white/50 p-2 rounded-2xl flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setExpandedStage(null);
                                    setViewLevel('stage');
                                }}
                                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 shadow-sm transition-all flex items-center gap-2"
                            >
                                <ArrowLeft size={16} />
                                返回主視圖
                            </button>

                            <div className="w-px h-6 bg-gray-200 mx-1" />

                            <div className="px-3 py-1.5 bg-gray-100 rounded-lg flex items-center gap-2 text-sm text-gray-600">
                                {expandedStage === 'A' && <><span className="text-lg">🏃</span> 行動階段</>}
                                {expandedStage === 'P' && <><span className="text-lg">⚙️</span> 過程階段</>}
                                {expandedStage === 'O' && <><span className="text-lg">📦</span> 物件階段</>}
                                {expandedStage === 'S' && <><span className="text-lg">🧠</span> 結構階段</>}
                            </div>

                            <button
                                onClick={handleAddActivity}
                                className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors flex items-center gap-1.5 text-sm font-medium"
                                title="新增活動"
                            >
                                <Plus size={18} />
                                新增活動
                            </button>
                        </div>
                    )}
                </div>

                <div className="bg-white/90 backdrop-blur-md shadow-sm border border-white/50 p-2 rounded-2xl flex items-center gap-2 pointer-events-auto">
                    <button onClick={() => fitView({ padding: 0.2 })} className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-600 transition-colors" title="Fit View">
                        <Maximize className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => {
                            // Reset Layout Logic
                            setNodes([]);
                            setEdges([]);
                            setTimeout(() => {
                                if (viewLevel === 'stage') {
                                    setExpandedStage(null);
                                } else {
                                    const currentStage = expandedStage;
                                    setExpandedStage(null);
                                    setTimeout(() => setExpandedStage(currentStage), 10);
                                }
                            }, 50);
                        }}
                        className="p-2.5 hover:bg-gray-100 rounded-xl text-gray-600 transition-colors"
                        title="Reset Layout"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="w-px h-6 bg-gray-200 mx-1" />
                    <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        發布
                    </button>
                </div>
            </div>

            {/* Left Sidebar - Icon Rail + Drawer */}
            <div className="flex h-full z-30">
                {/* Icon Rail */}
                <div className="w-14 bg-white border-r border-gray-100 flex flex-col items-center pt-20 pb-6 gap-3 z-40 shadow-sm">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 mb-4">
                        <Layers size={24} />
                    </div>
                    {SIDEBAR_TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id as any); setIsSidebarOpen(true); }}
                            className={`
                                w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 relative group
                                ${activeTab === tab.id ? `${tab.bg} ${tab.color} shadow-sm` : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}
                            `}
                        >
                            <tab.icon size={20} strokeWidth={activeTab === tab.id ? 2.5 : 2} />

                            {/* Tooltip */}
                            <div className="absolute left-12 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                                {tab.label}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Drawer Panel */}
                <div className={`${isSidebarOpen ? 'w-60 translate-x-0' : 'w-0 -translate-x-full opacity-0'} bg-white border-r border-gray-100 transition-all duration-300 flex flex-col relative pt-16`}>
                    <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="font-bold text-gray-800 text-lg">
                            {SIDEBAR_TABS.find(t => t.id === activeTab)?.label}
                        </h2>
                        <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded">
                            <ChevronLeft size={18} className="text-gray-400" />
                        </button>
                    </div>

                    <div className="p-4 border-b border-gray-50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="搜尋元件..."
                                className="w-full bg-gray-50 pl-9 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-panel">
                        {/* Agents Content */}
                        {activeTab === 'agents' && AVAILABLE_AGENTS
                            .filter(a => a.name.includes(searchQuery))
                            .map(agent => (
                                <div
                                    key={agent.id}
                                    draggable
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('application/reactflow', 'agent');
                                        e.dataTransfer.setData('agentId', agent.id);
                                    }}
                                    className="p-3 bg-white border border-indigo-100 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-300 cursor-move transition-all group"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                            <Bot size={16} />
                                        </div>
                                        <div className="font-bold text-gray-800 text-sm">{agent.name}</div>
                                    </div>
                                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{agent.description}</p>
                                </div>
                            ))
                        }

                        {/* Other Resources */}
                        {activeTab === 'video' && (
                            <>
                                <DraggableResource id="v1" title="四則運算基礎" desc="3min 動畫講解" source="YouTube" color="red" resourceType="video" />
                                <DraggableResource id="v2" title="進階應用範例" desc="生活情境題" source="Khan Academy" color="red" resourceType="video" />
                            </>
                        )}
                        {activeTab === 'material' && (
                            <>
                                <DraggableResource id="m1" title="教學簡報 PDF" desc="共 15 頁" source="Local" color="blue" resourceType="material" />
                            </>
                        )}
                        {activeTab === 'worksheet' && (
                            <>
                                <DraggableResource id="w1" title="基礎練習卷" desc="20 題選擇" source="ExamSystem" color="green" resourceType="worksheet" />
                            </>
                        )}
                        {activeTab === 'external' && (
                            <>
                                <DraggableResource id="e1" title="GeoGebra 画板" desc="互動幾何" source="GGB" color="purple" resourceType="external" />
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Canvas Area */}
            <div className="flex-1 relative h-full bg-slate-50">
                <div className="absolute inset-y-0 left-0 right-0" onDrop={handleDrop} onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onNodeClick={(_, node) => {
                            // 處理不同類型的節點點擊
                            if (node.type === 'stageNode') {
                                // Stage 節點：展開該階段
                                const stageId = node.id.replace('stage-', '') as ('A' | 'P' | 'O' | 'S');
                                setExpandedStage(stageId);
                                setSelectedActivityId(null);
                                setSelectedNodeId(null);
                            } else if (node.type === 'activityFlowNode') {
                                // Activity 節點（新架構）：顯示資源綁定面板
                                setSelectedActivityId(node.id);
                                setSelectedNodeId(null);
                            } else {
                                // 舊架構 lessonNode
                                setSelectedNodeId(node.id);
                                setSelectedActivityId(null);
                            }
                        }}
                        fitView
                        fitViewOptions={{
                            padding: 0.25,
                            includeHiddenNodes: false,
                            minZoom: 0.3,
                            maxZoom: 1.2
                        }}
                        attributionPosition="bottom-right"
                        minZoom={0.2}
                        maxZoom={1.5}
                        proOptions={{ hideAttribution: true }}
                    >
                        <Background color="#e2e8f0" gap={24} size={1} />
                        <Controls
                            position="bottom-center"
                            showInteractive={false}
                        />
                    </ReactFlow>
                </div>
            </div>

            {/* Right Logic Sidebar - Simplified */}
            {
                selectedNode && (
                    <div className="w-80 bg-white border-l border-gray-200 shadow-lg h-full z-40 overflow-y-auto absolute right-0 top-0 bottom-0">
                        {/* Header */}
                        <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="font-bold text-gray-800 flex items-center gap-2">
                                <Layers size={16} className="text-indigo-500" />
                                編輯節點
                            </h2>
                            <button onClick={() => setSelectedNodeId(null)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                                <X size={18} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* Title */}
                            <input
                                type="text"
                                value={selectedNode.title}
                                onChange={e => setLesson(prev => ({
                                    ...prev,
                                    nodes: (prev.nodes ?? []).map(n => n.id === selectedNode.id ? { ...n, title: e.target.value } : n)
                                }))}
                                className="w-full text-base font-bold text-gray-800 border-b-2 border-gray-200 focus:border-indigo-500 bg-transparent py-2 focus:outline-none"
                                placeholder="節點名稱"
                            />

                            {/* Agent - Dropdown */}
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                    <Bot size={12} /> AI Agent
                                </label>
                                <select
                                    value={selectedNode.agent.id}
                                    onChange={e => {
                                        const agent = AVAILABLE_AGENTS.find(a => a.id === e.target.value);
                                        if (agent) {
                                            setLesson(prev => ({
                                                ...prev,
                                                nodes: (prev.nodes ?? []).map(n => n.id === selectedNode.id
                                                    ? { ...n, agent, selectedTools: [] }
                                                    : n
                                                )
                                            }));
                                        }
                                    }}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                                >
                                    {AVAILABLE_AGENTS.map(agent => (
                                        <option key={agent.id} value={agent.id}>{agent.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Tools - Compact Checkboxes */}
                            {AVAILABLE_TOOLS.filter(t => selectedNode.agent.availableTools.includes(t.id)).length > 0 && (
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                        <Wrench size={12} /> 教學功能
                                    </label>
                                    <div className="space-y-1.5">
                                        {AVAILABLE_TOOLS
                                            .filter(tool => selectedNode.agent.availableTools.includes(tool.id))
                                            .map(tool => {
                                                const isSelected = selectedNode.selectedTools?.some(t => t.id === tool.id);
                                                return (
                                                    <label
                                                        key={tool.id}
                                                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-purple-50' : 'hover:bg-gray-50'}`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected || false}
                                                            onChange={() => {
                                                                const newTools = isSelected
                                                                    ? selectedNode.selectedTools.filter(t => t.id !== tool.id)
                                                                    : [...(selectedNode.selectedTools || []), tool];
                                                                setLesson(prev => ({
                                                                    ...prev,
                                                                    nodes: (prev.nodes ?? []).map(n => n.id === selectedNode.id
                                                                        ? { ...n, selectedTools: newTools }
                                                                        : n
                                                                    )
                                                                }));
                                                            }}
                                                            className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                        />
                                                        <span className="text-sm text-gray-700">{tool.name}</span>
                                                    </label>
                                                );
                                            })}
                                    </div>
                                </div>
                            )}

                            {/* Divider */}
                            <div className="border-t border-gray-100 pt-4">
                                {/* Conditional Toggle */}
                                <label className="flex items-center justify-between cursor-pointer">
                                    <span className="text-sm font-medium text-gray-700">條件分支</span>
                                    <input
                                        type="checkbox"
                                        checked={selectedNode.isConditional || false}
                                        onChange={e => setLesson(prev => ({
                                            ...prev,
                                            nodes: (prev.nodes ?? []).map(n => n.id === selectedNode.id ? {
                                                ...n,
                                                isConditional: e.target.checked,
                                                conditions: e.target.checked ? { learnedPath: '', notLearnedPath: '' } : undefined
                                            } : n)
                                        }))}
                                        className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                    />
                                </label>

                                {selectedNode.isConditional && (
                                    <div className="mt-3 space-y-3">
                                        <div>
                                            <label className="text-xs text-green-600 font-medium">✓ 通過後</label>
                                            <select
                                                className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                                value={selectedNode.conditions?.learnedPath || ''}
                                                onChange={e => setLesson(prev => ({
                                                    ...prev,
                                                    nodes: (prev.nodes ?? []).map(n => n.id === selectedNode.id ? {
                                                        ...n,
                                                        conditions: { ...n.conditions!, learnedPath: e.target.value }
                                                    } : n)
                                                }))}
                                            >
                                                <option value="">選擇節點...</option>
                                                {lessonNodes.filter(n => n.id !== selectedNode.id).map(n => (
                                                    <option key={n.id} value={n.id}>{n.title}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs text-orange-600 font-medium">✗ 補救路徑</label>
                                            <select
                                                className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                                value={selectedNode.conditions?.notLearnedPath || ''}
                                                onChange={e => setLesson(prev => ({
                                                    ...prev,
                                                    nodes: (prev.nodes ?? []).map(n => n.id === selectedNode.id ? {
                                                        ...n,
                                                        conditions: { ...n.conditions!, notLearnedPath: e.target.value }
                                                    } : n)
                                                }))}
                                            >
                                                <option value="">選擇補強...</option>
                                                {lessonNodes.filter(n => n.id !== selectedNode.id).map(n => (
                                                    <option key={n.id} value={n.id}>{n.title}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Next Node (非條件分支時) */}
                            {!selectedNode.isConditional && (
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                        → 下一節點
                                    </label>
                                    <select
                                        value={selectedNode.nextNodeId || ''}
                                        onChange={e => setLesson(prev => ({
                                            ...prev,
                                            nodes: (prev.nodes ?? []).map(n => n.id === selectedNode.id
                                                ? { ...n, nextNodeId: e.target.value || undefined }
                                                : n
                                            )
                                        }))}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                    >
                                        <option value="">自動（下一個節點）</option>
                                        {lessonNodes.filter(n => n.id !== selectedNode.id).map(n => (
                                            <option key={n.id} value={n.id}>{n.title}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Delete */}
                            <button
                                onClick={() => {
                                    setLesson(prev => ({
                                        ...prev,
                                        nodes: (prev.nodes ?? []).filter(n => n.id !== selectedNode.id)
                                    }));
                                    setSelectedNodeId(null);
                                }}
                                className="w-full py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                            >
                                <Trash2 size={14} /> 刪除節點
                            </button>
                        </div>
                    </div>
                )
            }

            {/* ===== NEW: Activity Resource Binding Sidebar ===== */}
            {
                selectedActivity && (
                    <div className="w-96 bg-white border-l border-gray-200 shadow-lg h-full z-40 overflow-y-auto absolute right-0 top-0 bottom-0">
                        {/* Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-purple-500 z-10 px-4 py-4">
                            <div className="flex items-center justify-between">
                                <h2 className="font-bold text-white flex items-center gap-2">
                                    <Layers size={18} />
                                    活動教學資源
                                </h2>
                                <button
                                    onClick={() => setSelectedActivityId(null)}
                                    className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X size={18} className="text-white" />
                                </button>
                            </div>
                            <p className="text-white/80 text-sm mt-1 truncate">{selectedActivity.title}</p>
                        </div>

                        <div className="p-4 space-y-5">
                            {/* Activity Info */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`
                                    w-10 h-10 rounded-lg flex items-center justify-center
                                    ${selectedActivity.type === 'checkpoint' ? 'bg-orange-100' :
                                            selectedActivity.type === 'remedial' ? 'bg-amber-100' :
                                                selectedActivity.type === 'practice' ? 'bg-green-100' : 'bg-blue-100'}
                                `}>
                                        {selectedActivity.type === 'intro' && '🎬'}
                                        {selectedActivity.type === 'teaching' && '📖'}
                                        {selectedActivity.type === 'practice' && '✏️'}
                                        {selectedActivity.type === 'checkpoint' && '🎯'}
                                        {selectedActivity.type === 'remedial' && '🔄'}
                                        {selectedActivity.type === 'application' && '🚀'}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{selectedActivity.title}</h3>
                                        <p className="text-xs text-gray-500">
                                            {selectedActivity.type.charAt(0).toUpperCase() + selectedActivity.type.slice(1)} •
                                            {selectedActivity.estimatedMinutes} 分鐘
                                        </p>
                                    </div>
                                </div>
                                {selectedActivity.description && (
                                    <p className="text-sm text-gray-600">{selectedActivity.description}</p>
                                )}
                            </div>

                            {/* Resources List */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <FileText size={14} />
                                    教學資源 ({selectedActivity.resources.length})
                                </h4>
                                <div className="space-y-3">
                                    {selectedActivity.resources.map((resource, idx) => (
                                        <div
                                            key={resource.id}
                                            className={`
                                            p-3 rounded-xl border-2 transition-all cursor-pointer
                                            ${resource.isDefault
                                                    ? 'border-indigo-300 bg-indigo-50/50 shadow-sm'
                                                    : 'border-gray-200 hover:border-gray-300 bg-white'
                                                }
                                        `}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`
                                                w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                                                ${resource.resourceType === 'video' ? 'bg-red-100' :
                                                        resource.resourceType === 'material' ? 'bg-blue-100' :
                                                            resource.resourceType === 'worksheet' ? 'bg-green-100' :
                                                                resource.resourceType === 'interactive' ? 'bg-purple-100' : 'bg-gray-100'}
                                            `}>
                                                    {resource.resourceType === 'video' && <Video size={16} className="text-red-600" />}
                                                    {resource.resourceType === 'material' && <FileText size={16} className="text-blue-600" />}
                                                    {resource.resourceType === 'worksheet' && <CheckSquare size={16} className="text-green-600" />}
                                                    {resource.resourceType === 'interactive' && <Wrench size={16} className="text-purple-600" />}
                                                    {resource.resourceType === 'external' && <FileText size={16} className="text-gray-600" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-gray-800 truncate">
                                                            {resource.generatedContent?.materials?.[0] || `資源 ${idx + 1}`}
                                                        </span>
                                                        {resource.isDefault && (
                                                            <span className="px-1.5 py-0.5 bg-indigo-500 text-white text-[10px] rounded font-medium shrink-0">
                                                                預設
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {resource.resourceType} • {resource.agent.name}
                                                    </p>
                                                    {resource.generatedContent?.exercises && (
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            包含 {resource.generatedContent.exercises} 道練習題
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Tools Badge */}
                                            {resource.tools && resource.tools.length > 0 && (
                                                <div className="mt-2 pt-2 border-t border-gray-100 flex flex-wrap gap-1">
                                                    {resource.tools.map(tool => (
                                                        <span
                                                            key={tool.id}
                                                            className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full"
                                                        >
                                                            {tool.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Flow Control Info */}
                            {selectedActivity.flowControl && (
                                <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                                    <h4 className="text-sm font-semibold text-orange-700 mb-2 flex items-center gap-2">
                                        <Wrench size={14} />
                                        分支控制
                                    </h4>
                                    <p className="text-xs text-orange-600 mb-2">
                                        類型：{selectedActivity.flowControl.type === 'checkpoint' ? '檢查點' :
                                            selectedActivity.flowControl.type === 'multi-choice' ? '多選一' : '差異化'}
                                    </p>
                                    {selectedActivity.flowControl.criteria && (
                                        <p className="text-xs text-gray-600">
                                            判定標準：{selectedActivity.flowControl.criteria}
                                        </p>
                                    )}
                                    <div className="mt-2 space-y-1">
                                        {selectedActivity.flowControl.paths?.map(path => (
                                            <div key={path.id} className="text-xs text-gray-600 flex items-center gap-1">
                                                <span>{path.label}</span>
                                                <span className="text-gray-400">→</span>
                                                <span className="text-indigo-600">{path.nextActivityId}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Add Resource Button */}
                            <button
                                onClick={() => setIsResourcePickerOpen(true)}
                                className="w-full py-2.5 border-2 border-dashed border-gray-300 hover:border-indigo-400 rounded-xl text-sm text-gray-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                新增教學資源
                            </button>
                        </div>
                    </div>
                )
            }

            {/* Resource Picker Modal */}
            <ResourcePickerModal
                isOpen={isResourcePickerOpen}
                onClose={() => setIsResourcePickerOpen(false)}
                onSelect={(resource) => {
                    // 添加資源到選中活動的 resources 陣列
                    if (!selectedActivityId) return;

                    setAposLesson(prev => {
                        if (!prev.stages) return prev;

                        const newStages = prev.stages.map(stage => ({
                            ...stage,
                            activities: stage.activities.map(activity => {
                                if (activity.id !== selectedActivityId) return activity;

                                // 創建新的 ResourceBinding
                                const newResource: ResourceBinding = {
                                    id: resource.id || `resource-${Date.now()}`,
                                    resourceType: resource.resourceType || 'material',
                                    agent: resource.agent!,
                                    tools: resource.tools || [],
                                    isDefault: activity.resources.length === 0, // 如果是第一個資源，設為預設
                                    generatedContent: resource.generatedContent,
                                };

                                return {
                                    ...activity,
                                    resources: [...activity.resources, newResource],
                                };
                            }),
                        }));

                        return { ...prev, stages: newStages };
                    });
                }}
                currentResources={selectedActivity?.resources ?? []}
            />
        </div >
    );
}

export default function LessonPrepPreviewPage() {
    return (
        <ReactFlowProvider>
            <LessonPrepPreviewPageInner />
        </ReactFlowProvider>
    );
}
