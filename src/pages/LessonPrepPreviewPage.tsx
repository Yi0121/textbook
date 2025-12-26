/**
 * LessonPrepPreviewPage - 完整視覺化課程編輯器
 * 
 * 功能：
 * 1. ReactFlow 視覺化顯示
 * 2. 點擊節點編輯（側邊欄）
 * 3. 新增節點
 * 4. 刪除節點
 * 5. 選擇 Agent 與 Tools
 * 6. 發布課程
 */

import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactFlow, Background, Controls, MiniMap, MarkerType, applyNodeChanges, applyEdgeChanges, Handle, Position, useReactFlow, ReactFlowProvider } from '@xyflow/react';
import type { Node, Edge, OnNodesChange, OnEdgesChange, Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { BookOpen, Send, ArrowLeft, Settings, Plus, Trash2, X, Search, Maximize, Eye, ChevronDown, ChevronUp, LayoutGrid, Network } from 'lucide-react';
import LessonNodesCards from '../components/ui/LessonNodesCards';
import { MOCK_DIFFERENTIATED_LESSON, AVAILABLE_AGENTS, AVAILABLE_TOOLS } from '../types/lessonPlan';
import type { LessonNode } from '../types/lessonPlan';
import dagre from 'dagre';

// 可拖曳資源卡片組件
function DraggableResource({ id, title, desc, source, color, resourceType }: {
    id: string;
    title: string;
    desc: string;
    source: string;
    color: string;
    resourceType: 'video' | 'material' | 'worksheet' | 'external';
}) {
    const colorMap: Record<string, string> = {
        red: 'from-red-50 to-orange-50 border-red-200',
        blue: 'from-blue-50 to-cyan-50 border-blue-200',
        green: 'from-green-50 to-emerald-50 border-green-200',
        purple: 'from-purple-50 to-pink-50 border-purple-200',
    };
    const textColorMap: Record<string, string> = {
        red: 'text-red-600',
        blue: 'text-blue-600',
        green: 'text-green-600',
        purple: 'text-purple-600',
    };
    const iconMap: Record<string, string> = {
        video: '🎥',
        material: '📄',
        worksheet: '📝',
        external: '🔧',
    };

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
            className={`p-3 bg-gradient-to-br ${colorMap[color]} border-2 rounded-lg cursor-move hover:shadow-md transition-all hover:scale-[1.02]`}
        >
            <div className="flex items-center gap-2">
                <span>{iconMap[resourceType]}</span>
                <div className="font-medium text-sm text-gray-900">{title}</div>
            </div>
            <div className="text-xs text-gray-600 mt-1">{desc}</div>
            <div className={`text-xs ${textColorMap[color]} mt-1`}>{source}</div>
        </div>
    );
}

type LeftPanelTab = 'agents' | 'video' | 'material' | 'worksheet' | 'external';

// Dagre 自動佈局演算法
const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    const nodeWidth = 180;   // 再縮小
    const nodeHeight = 100;  // 再縮小

    // 設定圖形佈局參數
    dagreGraph.setGraph({
        rankdir: 'LR',      // 從左到右排列
        nodesep: 30,        // 同層節點垂直間距（再縮小）
        ranksep: 120,       // 不同層水平間距（再縮小）
        edgesep: 15,        // 邊的間距（再縮小）
        marginx: 15,
        marginy: 15,
    });

    // 加入所有節點到 dagre 圖
    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    // 加入所有邊到 dagre 圖
    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    // 執行佈局計算
    dagre.layout(dagreGraph);

    // 應用計算結果到節點位置
    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const lessonNode = node.data.lessonNode as LessonNode;

        let yOffset = 0;

        // 補強路徑往下偏移
        if (lessonNode.branchLevel === 'remedial') {
            yOffset = 70;  // 再縮小偏移量
        }
        // 進階路徑往上偏移
        else if (lessonNode.branchLevel === 'advanced') {
            yOffset = -70;  // 再縮小偏移量
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

function LessonPrepPreviewPageInner() {
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(MOCK_DIFFERENTIATED_LESSON);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
    const [leftPanelTab, setLeftPanelTab] = useState<LeftPanelTab>('agents');
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'flow' | 'cards'>('cards'); // 默認使用卡片視圖
    const { fitView } = useReactFlow();

    // 自動調整視野以顯示所有節點
    useEffect(() => {
        const timer = setTimeout(() => {
            fitView({ padding: 0.2, duration: 800 });
        }, 100); // 稍微延遲確保節點已渲染
        return () => clearTimeout(timer);
    }, [lesson.nodes, fitView]);

    // Accordion 狀態 - 右側編輯面板折疊
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        agent: true,
        tools: false,
        condition: false,
        navigation: false,
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // 將 lesson nodes 轉換為 ReactFlow nodes（水平排列）
    const createReactFlowNode = (node: LessonNode, _idx: number): Node => {
        // 根據節點類型設定顏色和圖標
        const nodeTypeConfig: Record<string, { bg: string; icon: string; label: string; border: string; borderSelected: string }> = {
            agent: { bg: 'bg-indigo-500', icon: '🤖', label: 'AI', border: '#6366f1', borderSelected: '#4f46e5' },
            video: { bg: 'bg-red-500', icon: '🎥', label: '影片', border: '#ef4444', borderSelected: '#dc2626' },
            material: { bg: 'bg-blue-500', icon: '📄', label: '教材', border: '#3b82f6', borderSelected: '#2563eb' },
            worksheet: { bg: 'bg-green-500', icon: '📝', label: '練習', border: '#22c55e', borderSelected: '#16a34a' },
            external: { bg: 'bg-purple-500', icon: '🔧', label: '工具', border: '#a855f7', borderSelected: '#9333ea' },
        };

        const config = nodeTypeConfig[node.nodeType || 'agent'] || nodeTypeConfig.agent;
        const isAgent = !node.nodeType || node.nodeType === 'agent';
        const isSelected = selectedNodeId === node.id;

        // 計算邊框顏色
        const borderColor = node.isConditional
            ? (isSelected ? '#f97316' : '#fb923c')
            : (isSelected ? config.borderSelected : config.border);

        // 計算陰影顏色
        const shadowColor = node.isConditional
            ? 'rgba(249, 115, 22, 0.3)'
            : node.nodeType === 'video' ? 'rgba(239, 68, 68, 0.3)'
                : node.nodeType === 'material' ? 'rgba(59, 130, 246, 0.3)'
                    : node.nodeType === 'worksheet' ? 'rgba(34, 197, 94, 0.3)'
                        : node.nodeType === 'external' ? 'rgba(168, 85, 247, 0.3)'
                            : 'rgba(79, 70, 229, 0.3)';

        return {
            id: node.id,
            type: 'default',
            position: { x: 0, y: 0 }, // 初始位置，稍後由 dagre 計算
            data: {
                lessonNode: node, // 儲存 lessonNode 供佈局函數使用
                label: (
                    <div className="relative" style={{ width: '170px' }}>
                        {/* 左側連接點（入口） */}
                        <Handle
                            type="target"
                            position={Position.Left}
                            style={{ background: borderColor, width: 10, height: 10, left: -5 }}
                        />

                        {/* Card 卡片設計 - 極簡版 */}
                        <div className={`rounded overflow-hidden shadow transition-all ${isSelected ? 'ring-2' : ''
                            }`}
                            style={{
                                background: 'white',
                                boxShadow: isSelected ? `0 4px 8px ${shadowColor}` : '0 1px 4px rgba(0, 0, 0, 0.08)',
                                ...(isSelected && { ringColor: borderColor })
                            }}>

                            {/* Card Header - 彩色頂部條 */}
                            <div className={`h-1 ${node.isConditional ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                                node.nodeType === 'video' ? 'bg-gradient-to-r from-red-400 to-pink-500' :
                                    node.nodeType === 'material' ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                                        node.nodeType === 'worksheet' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                                            node.nodeType === 'external' ? 'bg-gradient-to-r from-purple-400 to-pink-500' :
                                                'bg-gradient-to-r from-indigo-500 to-purple-600'
                                }`} />

                            {/* Card Body - 極度精簡 */}
                            <div className="p-2">
                                {/* 分支標籤 */}
                                {node.branchLevel && node.branchLevel !== 'standard' && (
                                    <div className={`absolute -top-1.5 left-2 px-1.5 py-0.5 rounded-full text-[8px] font-bold text-white shadow ${node.branchLevel === 'advanced' ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-gradient-to-r from-orange-500 to-red-500'
                                        }`}>
                                        {node.branchLevel === 'advanced' ? '進階' : '補強'}
                                    </div>
                                )}

                                {/* Icon + Title - 精簡版 */}
                                <div className="flex items-start gap-1.5 mb-1">
                                    <div className={`w-6 h-6 ${node.isConditional ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                                        node.nodeType === 'video' ? 'bg-gradient-to-br from-red-400 to-pink-500' :
                                            node.nodeType === 'material' ? 'bg-gradient-to-br from-blue-400 to-cyan-500' :
                                                node.nodeType === 'worksheet' ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                                                    node.nodeType === 'external' ? 'bg-gradient-to-br from-purple-400 to-pink-500' :
                                                        'bg-gradient-to-br from-indigo-500 to-purple-600'
                                        } text-white rounded flex items-center justify-center text-xs font-bold shadow flex-shrink-0`}>
                                        {node.isConditional ? '?' : config.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 text-[11px] leading-tight">{node.title}</h3>
                                    </div>
                                </div>

                                {/* Content Info - 只顯示教材 */}
                                {node.generatedContent?.materials && (
                                    <div className="text-[9px] text-gray-600 bg-gray-50 rounded px-1.5 py-1 truncate">
                                        📚 {node.generatedContent.materials[0]}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 右側連接點（出口） */}
                        <Handle
                            type="source"
                            position={Position.Right}
                            style={{ background: borderColor, width: 10, height: 10, right: -5 }}
                        />
                    </div>
                ),
            },
            style: {
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                width: '170px',
            },
        };
    };

    // 建立連接線（支援條件分支）
    const createEdges = (lessonNodes: LessonNode[]): Edge[] => {
        const edges: Edge[] = [];

        lessonNodes.forEach((node, idx) => {
            if (node.isConditional && node.conditions) {
                // 條件節點：多條路徑分流
                const isMultiChoice = node.conditions.branchType === 'multi-choice';

                // 1. 標準路徑 (Learned / Choice A)
                if (node.conditions.learnedPath) {
                    edges.push({
                        id: `e${node.id}-learned`,
                        source: node.id,
                        target: node.conditions.learnedPath,
                        type: 'default',
                        animated: true,
                        label: isMultiChoice ? '影片' : '➜ 學會',
                        markerEnd: { type: MarkerType.ArrowClosed, color: '#3b82f6' },
                        style: { stroke: '#3b82f6', strokeWidth: 2 },
                        labelStyle: { fill: '#3b82f6', fontWeight: 600, fontSize: 12 },
                        labelBgStyle: { fill: '#dbeafe' },
                    });
                }

                // 2. 補救路徑 (Not Learned / Choice B) - 強化視覺效果
                if (node.conditions.notLearnedPath) {
                    edges.push({
                        id: `e${node.id}-not-learned`,
                        source: node.id,
                        target: node.conditions.notLearnedPath,
                        type: 'default',
                        animated: true,
                        label: isMultiChoice ? '遊戲' : '➜ 待加強',
                        markerEnd: { type: MarkerType.ArrowClosed, color: '#ea580c' }, // Deep Orange
                        style: { stroke: '#ea580c', strokeWidth: isMultiChoice ? 2 : 3 }, // 多選時使用正常粗細
                        labelStyle: { fill: '#ea580c', fontWeight: isMultiChoice ? 600 : 700, fontSize: isMultiChoice ? 12 : 13 },
                        labelBgStyle: { fill: '#ffedd5', stroke: isMultiChoice ? 'transparent' : '#ea580c', strokeWidth: isMultiChoice ? 0 : 1 },
                    });
                }

                // 3. 進階路徑 (Advanced / Choice C)
                if (node.conditions.advancedPath) {
                    edges.push({
                        id: `e${node.id}-advanced`,
                        source: node.id,
                        target: node.conditions.advancedPath,
                        type: 'default',
                        animated: true,
                        label: isMultiChoice ? '閱讀' : '🚀 推薦進階',
                        markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' }, // Purple
                        style: { stroke: '#a855f7', strokeWidth: isMultiChoice ? 2 : 3 },
                        labelStyle: { fill: '#a855f7', fontWeight: 600, fontSize: 12 },
                        labelBgStyle: { fill: '#f3e8ff' },
                    });
                }
            } else if (node.nextNodeId) {
                // 明確指定下一個節點（例：補強節點返回主流程）
                edges.push({
                    id: `e${node.id}-next`,
                    source: node.id,
                    target: node.nextNodeId,
                    type: 'default',
                    animated: true,
                    label: '繼續',
                    markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' },
                    style: { stroke: '#8b5cf6', strokeWidth: 2 },
                    labelStyle: { fill: '#8b5cf6', fontWeight: 600, fontSize: 12 },
                    labelBgStyle: { fill: '#ede9fe' },
                });
            } else if (idx < lessonNodes.length - 1) {
                // 普通節點：順序連接到下一個
                edges.push({
                    id: `e${node.id}-${lessonNodes[idx + 1].id}`,
                    source: node.id,
                    target: lessonNodes[idx + 1].id,
                    type: 'default',
                    animated: true,
                    markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
                    style: { stroke: '#6366f1', strokeWidth: 2 },
                });
            }
        });

        return edges;
    };

    // 初始化節點和邊，並使用自動佈局
    const initialNodes = lesson.nodes.map((node, idx) => createReactFlowNode(node, idx));
    const initialEdges = createEdges(lesson.nodes);
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges);

    const [nodes, setNodes] = useState<Node[]>(layoutedNodes);
    const [edges, setEdges] = useState<Edge[]>(layoutedEdges);

    const onNodesChange: OnNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback((connection: Connection) => {
        if (!connection.source || !connection.target) return;

        // 更新 lesson 中的節點連接
        const updatedNodes = lesson.nodes.map(node => {
            if (node.id === connection.source) {
                return { ...node, nextNodeId: connection.target };
            }
            return node;
        });

        setLesson(prev => ({ ...prev, nodes: updatedNodes }));
        const newNodes = updatedNodes.map((node, idx) => createReactFlowNode(node, idx));
        const newEdges = createEdges(updatedNodes);
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(newNodes, newEdges);
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
    }, [lesson.nodes, createEdges]);

    const handleNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
        setSelectedNodeId(node.id);
    }, []);

    // 刪除連線
    const handleEdgeClick = useCallback((_event: React.MouseEvent, edge: Edge) => {
        if (window.confirm('確定要刪除這條連線嗎？')) {
            // 更新 lesson 中的節點連接
            const updatedNodes = lesson.nodes.map(node => {
                if (node.id === edge.source) {
                    return { ...node, nextNodeId: undefined };
                }
                // 清除條件分支的連接
                if (node.conditions) {
                    const newConditions = { ...node.conditions };
                    if (newConditions.learnedPath === edge.target) {
                        newConditions.learnedPath = '';
                    }
                    if (newConditions.notLearnedPath === edge.target) {
                        newConditions.notLearnedPath = '';
                    }
                    return { ...node, conditions: newConditions };
                }
                return node;
            });

            setLesson(prev => ({ ...prev, nodes: updatedNodes }));
            setEdges(edges => edges.filter(e => e.id !== edge.id));
        }
    }, [lesson.nodes]);

    const handleAddNode = () => {
        const newNode: LessonNode = {
            id: `node-${Date.now()}`,
            title: '新節點',
            order: lesson.nodes.length + 1,
            agent: AVAILABLE_AGENTS[0],
            selectedTools: [],
        };

        const updatedNodes = [...lesson.nodes, newNode];
        setLesson(prev => ({ ...prev, nodes: updatedNodes }));
        const newNodes = updatedNodes.map((node, idx) => createReactFlowNode(node, idx));
        const newEdges = createEdges(updatedNodes);
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(newNodes, newEdges);
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
    };

    const handleDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const handleDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();

        const type = event.dataTransfer.getData('application/reactflow');

        // 計算放置位置（相對於 ReactFlow canvas）
        const reactFlowBounds = (event.target as HTMLElement).getBoundingClientRect();
        const position = {
            x: event.clientX - reactFlowBounds.left - 140,
            y: event.clientY - reactFlowBounds.top - 50,
        };

        let newNode: LessonNode;

        if (type === 'agent') {
            const agentId = event.dataTransfer.getData('agentId');
            const agent = AVAILABLE_AGENTS.find(a => a.id === agentId);
            if (!agent) return;

            newNode = {
                id: `node-${Date.now()}`,
                title: agent.name,
                order: lesson.nodes.length + 1,
                nodeType: 'agent',
                agent,
                selectedTools: [],
            };
        } else if (type === 'resource') {
            const resourceTitle = event.dataTransfer.getData('resourceTitle');
            const resourceType = event.dataTransfer.getData('resourceType') as 'video' | 'material' | 'worksheet' | 'external';
            if (!resourceTitle) return;

            // 資源使用預設 Agent（第一個）
            newNode = {
                id: `node-${Date.now()}`,
                title: resourceTitle,
                order: lesson.nodes.length + 1,
                nodeType: resourceType,
                agent: AVAILABLE_AGENTS[0],
                selectedTools: [],
            };
        } else {
            return;
        }

        const updatedNodes = [...lesson.nodes, newNode];
        setLesson(prev => ({ ...prev, nodes: updatedNodes }));

        // 創建新節點時使用自訂位置
        const newReactFlowNode = {
            ...createReactFlowNode(newNode, updatedNodes.length - 1),
            position,
        };

        setNodes([...nodes, newReactFlowNode]);
        // 不自動連線，讓用戶自己決定順序
        // setEdges(createEdges(updatedNodes));
    }, [lesson.nodes, nodes]);

    const handleDeleteNode = (nodeId: string) => {
        if (lesson.nodes.length <= 1) {
            alert('至少需要保留一個節點！');
            return;
        }

        if (confirm('確定要刪除此節點嗎？')) {
            const updatedNodes = lesson.nodes.filter(n => n.id !== nodeId).map((n, idx) => ({ ...n, order: idx + 1 }));
            setLesson(prev => ({ ...prev, nodes: updatedNodes }));
            const newNodes = updatedNodes.map((node, idx) => createReactFlowNode(node, idx));
            const newEdges = createEdges(updatedNodes);
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(newNodes, newEdges);
            setNodes(layoutedNodes);
            setEdges(layoutedEdges);
            setSelectedNodeId(null);
        }
    };

    const handleUpdateNode = (updatedNode: LessonNode) => {
        const updatedNodes = lesson.nodes.map(n => n.id === updatedNode.id ? updatedNode : n);
        setLesson(prev => ({ ...prev, nodes: updatedNodes }));
        const newNodes = updatedNodes.map((node, idx) => createReactFlowNode(node, idx));
        const newEdges = createEdges(updatedNodes);
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(newNodes, newEdges);
        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
    };

    const handlePublish = () => {
        if (confirm(`確定要發布課程「${lesson.title}」給學生嗎？`)) {
            localStorage.setItem('publishedLesson', JSON.stringify({
                ...lesson,
                status: 'published',
                publishedAt: new Date(),
            }));
            alert('課程已發布！學生現在可以看到學習任務。');
            navigate('/');
        }
    };

    const selectedNode = lesson.nodes.find(n => n.id === selectedNodeId);

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* 頂部工具列 */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/lesson-prep')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="返回備課工作台"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-indigo-600" />
                            <h1 className="text-xl font-bold text-gray-900">{lesson.title}</h1>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">
                            {lesson.nodes.length} 個節點 • {lesson.difficulty === 'basic' ? '基礎' : lesson.difficulty === 'intermediate' ? '中階' : '進階'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* 視圖切換 */}
                    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('cards')}
                            className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${viewMode === 'cards'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                            title="卡片視圖"
                        >
                            <LayoutGrid className="w-4 h-4" />
                            卡片
                        </button>
                        <button
                            onClick={() => setViewMode('flow')}
                            className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${viewMode === 'flow'
                                ? 'bg-white text-indigo-600 shadow-sm'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                            title="流程圖視圖"
                        >
                            <Network className="w-4 h-4" />
                            流程圖
                        </button>
                    </div>

                    <button
                        onClick={handleAddNode}
                        className="px-4 py-2 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        新增節點
                    </button>
                    {viewMode === 'flow' && (
                        <>
                            <button
                                onClick={() => {
                                    const newNodes = lesson.nodes.map((node, idx) => createReactFlowNode(node, idx));
                                    const newEdges = createEdges(lesson.nodes);
                                    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(newNodes, newEdges);
                                    setNodes(layoutedNodes);
                                    setEdges(layoutedEdges);
                                    setTimeout(() => fitView({ padding: 0.2, duration: 500 }), 100);
                                }}
                                className="px-4 py-2 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-all flex items-center gap-2"
                                title="自動排列整齊"
                            >
                                <Settings className="w-4 h-4" />
                                自動排列
                            </button>
                            <button
                                onClick={() => fitView({ padding: 0.2, duration: 500 })}
                                className="px-4 py-2 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-all flex items-center gap-2"
                                title="縮放至全覽"
                            >
                                <Maximize className="w-4 h-4" />
                                全覽
                            </button>
                        </>
                    )}
                    <button
                        onClick={handlePublish}
                        className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg"
                    >
                        <Send className="w-4 h-4" />
                        發布課程
                    </button>
                </div>
            </div>

            {/* ReactFlow + 側邊欄 */}
            <div className="flex-1 flex relative">
                {/* 左側資源面板 - 分類 Tab */}
                <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                    {/* 分類 Tab */}
                    <div className="p-3 border-b border-gray-200 bg-gray-50">
                        <div className="flex flex-wrap gap-1">
                            {([
                                { value: 'agents', label: '🤖 AI Agent', color: 'indigo' },
                                { value: 'video', label: '🎬 影片', color: 'red' },
                                { value: 'material', label: '📄 教材', color: 'blue' },
                                { value: 'worksheet', label: '📝 練習', color: 'green' },
                                { value: 'external', label: '🔧 工具', color: 'purple' },
                            ] as const).map(tab => (
                                <button
                                    key={tab.value}
                                    onClick={() => setLeftPanelTab(tab.value)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${leftPanelTab === tab.value
                                        ? `bg-${tab.color}-600 text-white shadow-md`
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 搜尋列 */}
                    <div className="p-3 border-b border-gray-200">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="搜尋資源或 AI Agent..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* 內容區域 */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        <p className="text-xs text-gray-500 mb-3">拖曳到畫布以新增節點</p>

                        {/* Agents */}
                        {leftPanelTab === 'agents' && AVAILABLE_AGENTS
                            .filter(agent =>
                                !searchQuery ||
                                agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                agent.description.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                            .map(agent => (
                                <div
                                    key={agent.id}
                                    draggable
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData('application/reactflow', 'agent');
                                        e.dataTransfer.setData('agentId', agent.id);
                                        e.dataTransfer.effectAllowed = 'move';
                                    }}
                                    className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg cursor-move hover:shadow-md transition-all hover:scale-[1.02]"
                                >
                                    <div className="font-medium text-sm text-gray-900 mb-1">{agent.name}</div>
                                    <div className="text-xs text-indigo-600 mb-1">{agent.nameEn}</div>
                                    <div className="text-xs text-gray-600 line-clamp-2">{agent.description}</div>
                                </div>
                            ))}

                        {/* 影片資源 */}
                        {leftPanelTab === 'video' && (
                            <>
                                <DraggableResource id="video-1" title="四則運算基礎概念" desc="3分鐘動畫講解" source="YouTube" color="red" resourceType="video" />
                                <DraggableResource id="video-2" title="混合運算實例解說" desc="實際案例演示" source="Khan Academy" color="red" resourceType="video" />
                                <DraggableResource id="video-3" title="運算順序口訣" desc="幫助記憶的歌曲" source="YouTube" color="red" resourceType="video" />
                            </>
                        )}

                        {/* 教材資源 */}
                        {leftPanelTab === 'material' && (
                            <>
                                <DraggableResource id="material-1" title="四則運算教學簡報" desc="PowerPoint 15張" source="本地資源庫" color="blue" resourceType="material" />
                                <DraggableResource id="material-2" title="數學概念圖解 PDF" desc="視覺化圖解" source="本地資源庫" color="blue" resourceType="material" />
                                <DraggableResource id="material-3" title="運算規則海報" desc="可列印海報" source="本地資源庫" color="blue" resourceType="material" />
                            </>
                        )}

                        {/* 學習單 */}
                        {leftPanelTab === 'worksheet' && (
                            <>
                                <DraggableResource id="worksheet-1" title="基礎運算練習單" desc="20題基礎練習" source="題庫系統" color="green" resourceType="worksheet" />
                                <DraggableResource id="worksheet-2" title="進階挑戰題組" desc="10題進階混合運算" source="題庫系統" color="green" resourceType="worksheet" />
                                <DraggableResource id="worksheet-3" title="生活應用題" desc="15題情境題" source="題庫系統" color="green" resourceType="worksheet" />
                            </>
                        )}

                        {/* 外部工具 */}
                        {leftPanelTab === 'external' && (
                            <>
                                <DraggableResource id="external-1" title="GeoGebra 互動元件" desc="動態數學工具" source="GeoGebra" color="purple" resourceType="external" />
                                <DraggableResource id="external-2" title="Wolfram Alpha" desc="數學運算引擎" source="Wolfram" color="purple" resourceType="external" />
                                <DraggableResource id="external-3" title="Desmos 計算機" desc="圖形計算機" source="Desmos" color="purple" resourceType="external" />
                            </>
                        )}
                    </div>
                </div>

                {/* 主編輯區域 - 根據視圖模式切換 */}
                <div className="flex-1 overflow-auto">
                    {viewMode === 'cards' ? (
                        /* 卡片視圖 */
                        <LessonNodesCards
                            nodes={lesson.nodes}
                            selectedNodeId={selectedNodeId}
                            onNodeClick={(nodeId) => setSelectedNodeId(nodeId)}
                            onNodeDelete={handleDeleteNode}
                            onAddNode={handleAddNode}
                            className="bg-gray-50"
                        />
                    ) : (
                        /* ReactFlow 流程圖視圖 */
                        <div className="h-full" onDrop={handleDrop} onDragOver={handleDragOver}>
                            <ReactFlow
                                nodes={nodes}
                                edges={edges}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onNodeClick={handleNodeClick}
                                onEdgeClick={handleEdgeClick}
                                onConnect={onConnect}
                                fitView
                                attributionPosition="bottom-right"
                                proOptions={{ hideAttribution: true }}
                                nodesDraggable={true}
                                nodesConnectable={true}
                                elementsSelectable={true}
                                minZoom={0.5}
                                maxZoom={1.5}
                            >
                                <Background />
                                <Controls />
                                <MiniMap
                                    nodeColor="#6366f1"
                                    maskColor="rgba(0, 0, 0, 0.1)"
                                    style={{ background: 'white' }}
                                />
                            </ReactFlow>
                        </div>
                    )}
                </div>

                {/* 編輯側邊欄 */}
                {selectedNode && (
                    <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
                        <div className="p-4 space-y-3">
                            {/* 標題與預覽 */}
                            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                                <h2 className="text-lg font-bold text-gray-900">編輯節點</h2>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => alert('預覽功能即將上線！將跳轉至學生學習體驗預覽。')}
                                        className="p-2 bg-indigo-100 text-indigo-600 hover:bg-indigo-200 rounded-lg transition-colors"
                                        title="預覽學生體驗"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setSelectedNodeId(null)}
                                        className="p-2 hover:bg-gray-100 rounded-lg"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                            </div>

                            {/* 節點標題 - 永遠展開 */}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    📝 節點名稱
                                </label>
                                <input
                                    type="text"
                                    value={selectedNode.title}
                                    onChange={(e) => handleUpdateNode({ ...selectedNode, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                                />
                            </div>

                            {/* Accordion: AI 助教 */}
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => toggleSection('agent')}
                                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-colors"
                                >
                                    <span className="font-medium text-gray-900">🤖 AI Agent</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                                            {selectedNode.agent.name}
                                        </span>
                                        {expandedSections.agent ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                                    </div>
                                </button>
                                {expandedSections.agent && (
                                    <div className="p-4 space-y-2 border-t border-gray-100 animate-fadeIn">
                                        {AVAILABLE_AGENTS.map(agent => {
                                            const isSelected = selectedNode.agent.id === agent.id;
                                            return (
                                                <div
                                                    key={agent.id}
                                                    onClick={() => handleUpdateNode({ ...selectedNode, agent, selectedTools: [] })}
                                                    className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                                                        ? 'border-indigo-500 bg-indigo-50 shadow-md'
                                                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {isSelected && <span className="text-indigo-600">✓</span>}
                                                        <span className="font-medium text-sm text-gray-900">{agent.name}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Accordion: 教學功能 */}
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => toggleSection('tools')}
                                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors"
                                >
                                    <span className="font-medium text-gray-900">⚙️ 教學功能</span>
                                    <div className="flex items-center gap-2">
                                        {selectedNode.selectedTools.length > 0 && (
                                            <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                                                已選 {selectedNode.selectedTools.length} 項
                                            </span>
                                        )}
                                        {expandedSections.tools ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                                    </div>
                                </button>
                                {expandedSections.tools && (
                                    <div className="p-4 space-y-2 border-t border-gray-100 animate-fadeIn">
                                        {AVAILABLE_TOOLS
                                            .filter(tool => selectedNode.agent.availableTools.includes(tool.id))
                                            .map(tool => {
                                                const isSelected = selectedNode.selectedTools.some(t => t.id === tool.id);
                                                return (
                                                    <div
                                                        key={tool.id}
                                                        onClick={() => {
                                                            const newTools = isSelected
                                                                ? selectedNode.selectedTools.filter(t => t.id !== tool.id)
                                                                : [...selectedNode.selectedTools, tool];
                                                            handleUpdateNode({ ...selectedNode, selectedTools: newTools });
                                                        }}
                                                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                                                            ? 'border-purple-500 bg-purple-50'
                                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium text-sm text-gray-900">{tool.name}</span>
                                                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isSelected ? 'bg-purple-500 border-purple-500' : 'border-gray-300'
                                                                }`}>
                                                                {isSelected && <span className="text-white text-xs">✓</span>}
                                                            </div>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-1">{tool.description}</p>
                                                    </div>
                                                );
                                            })}
                                        {AVAILABLE_TOOLS.filter(tool => selectedNode.agent.availableTools.includes(tool.id)).length === 0 && (
                                            <div className="text-center py-4 text-sm text-gray-400">
                                                此 AI Agent 無額外功能可選
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Accordion: 條件分支 */}
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => toggleSection('condition')}
                                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100 transition-colors"
                                >
                                    <span className="font-medium text-gray-900">🎯 條件分支</span>
                                    <div className="flex items-center gap-2">
                                        {selectedNode.isConditional && (
                                            <span className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                                                檢查點
                                            </span>
                                        )}
                                        {expandedSections.condition ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                                    </div>
                                </button>
                                {expandedSections.condition && (
                                    <div className="p-4 space-y-3 border-t border-gray-100 animate-fadeIn">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-medium text-gray-700">設為學習檢查點</label>
                                            <input
                                                type="checkbox"
                                                checked={selectedNode.isConditional || false}
                                                onChange={(e) => handleUpdateNode({
                                                    ...selectedNode,
                                                    isConditional: e.target.checked,
                                                    conditions: e.target.checked ? {
                                                        learnedPath: '',
                                                        notLearnedPath: '',
                                                        assessmentCriteria: '完成度 ≥ 80%'
                                                    } : undefined
                                                })}
                                                className="w-5 h-5 text-indigo-600 rounded"
                                            />
                                        </div>

                                        {selectedNode.isConditional && (
                                            <div className="space-y-3 bg-orange-50 p-3 rounded-lg">
                                                <p className="text-xs text-orange-700">
                                                    根據學生學習成果，系統將自動選擇不同的學習路徑
                                                </p>

                                                {/* 學會路徑 */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        ✓ 學會後進入
                                                    </label>
                                                    <select
                                                        value={selectedNode.conditions?.learnedPath || ''}
                                                        onChange={(e) => handleUpdateNode({
                                                            ...selectedNode,
                                                            conditions: {
                                                                ...selectedNode.conditions!,
                                                                learnedPath: e.target.value
                                                            }
                                                        })}
                                                        className="w-full px-2 py-1.5 text-sm border border-green-300 rounded bg-white"
                                                    >
                                                        <option value="">選擇下一個節點</option>
                                                        {lesson.nodes
                                                            .filter(n => n.id !== selectedNode.id)
                                                            .map(node => (
                                                                <option key={node.id} value={node.id}>
                                                                    {node.title}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>

                                                {/* 未學會路徑 */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        ✗ 未學會則進行
                                                    </label>
                                                    <select
                                                        value={selectedNode.conditions?.notLearnedPath || ''}
                                                        onChange={(e) => handleUpdateNode({
                                                            ...selectedNode,
                                                            conditions: {
                                                                ...selectedNode.conditions!,
                                                                notLearnedPath: e.target.value
                                                            }
                                                        })}
                                                        className="w-full px-2 py-1.5 text-sm border border-red-300 rounded bg-white"
                                                    >
                                                        <option value="">選擇補強節點</option>
                                                        {lesson.nodes
                                                            .filter(n => n.id !== selectedNode.id)
                                                            .map(node => (
                                                                <option key={node.id} value={node.id}>
                                                                    {node.title}
                                                                </option>
                                                            ))}
                                                    </select>
                                                </div>

                                                {/* 評估標準 */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                                        評估標準
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={selectedNode.conditions?.assessmentCriteria || ''}
                                                        onChange={(e) => handleUpdateNode({
                                                            ...selectedNode,
                                                            conditions: {
                                                                ...selectedNode.conditions!,
                                                                assessmentCriteria: e.target.value
                                                            }
                                                        })}
                                                        placeholder="例：完成度 ≥ 80%"
                                                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Accordion: 下一個節點 */}
                            {!selectedNode.isConditional && (
                                <div className="border border-gray-200 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => toggleSection('navigation')}
                                        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 transition-colors"
                                    >
                                        <span className="font-medium text-gray-900">🔗 下一個節點</span>
                                        <div className="flex items-center gap-2">
                                            {selectedNode.nextNodeId && (
                                                <span className="text-xs text-cyan-600 bg-cyan-100 px-2 py-0.5 rounded-full">
                                                    已設定
                                                </span>
                                            )}
                                            {expandedSections.navigation ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                                        </div>
                                    </button>
                                    {expandedSections.navigation && (
                                        <div className="p-4 space-y-3 border-t border-gray-100">
                                            <select
                                                value={selectedNode.nextNodeId || ''}
                                                onChange={(e) => handleUpdateNode({
                                                    ...selectedNode,
                                                    nextNodeId: e.target.value || undefined
                                                })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                            >
                                                <option value="">自動（順序下一個）</option>
                                                {lesson.nodes
                                                    .filter(n => n.id !== selectedNode.id)
                                                    .map(node => (
                                                        <option key={node.id} value={node.id}>
                                                            {node.title}
                                                        </option>
                                                    ))}
                                            </select>
                                            <p className="text-xs text-gray-500">
                                                可自由指定下一個節點，不受順序限制
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 刪除按鈕 */}
                            <button
                                onClick={() => handleDeleteNode(selectedNode.id)}
                                className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mt-4"
                            >
                                <Trash2 className="w-4 h-4" />
                                刪除此節點
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// 包裹在 ReactFlowProvider 中以啟用 useReactFlow
export default function LessonPrepPreviewPage() {
    return (
        <ReactFlowProvider>
            <LessonPrepPreviewPageInner />
        </ReactFlowProvider>
    );
}
