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

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactFlow, Background, Controls, MiniMap, MarkerType, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import type { Node, Edge, OnNodesChange, OnEdgesChange } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { BookOpen, Send, ArrowLeft, Settings, Plus, Trash2, X } from 'lucide-react';
import { MOCK_GENERATED_LESSON, AVAILABLE_AGENTS, AVAILABLE_TOOLS } from '../types/lessonPlan';
import type { LessonNode } from '../types/lessonPlan';

export default function LessonPrepPreviewPage() {
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(MOCK_GENERATED_LESSON);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    // 將 lesson nodes 轉換為 ReactFlow nodes（水平排列）
    const createReactFlowNode = (node: LessonNode, idx: number): Node => ({
        id: node.id,
        type: 'default',
        position: { x: 50 + idx * 350, y: 150 }, // 水平排列
        data: {
            label: (
                <div className="px-4 py-3" style={{ width: '280px' }}>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 bg-indigo-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {node.order}
                        </div>
                        <span className="font-bold text-gray-900 text-sm truncate">{node.title}</span>
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center gap-1">
                            <Settings className="w-3 h-3 flex-shrink-0" />
                            <span className="font-medium truncate">{node.agent.nameEn}</span>
                        </div>
                        {node.selectedTools.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                                {node.selectedTools.slice(0, 3).map(tool => (
                                    <span key={tool.id} className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs whitespace-nowrap">
                                        {tool.name.length > 8 ? tool.name.slice(0, 8) + '...' : tool.name}
                                    </span>
                                ))}
                                {node.selectedTools.length > 3 && (
                                    <span className="text-xs text-gray-500">+{node.selectedTools.length - 3}</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ),
        },
        style: {
            background: 'white',
            border: selectedNodeId === node.id ? '3px solid #4f46e5' : '2px solid #6366f1',
            borderRadius: '12px',
            boxShadow: selectedNodeId === node.id ? '0 8px 16px rgba(79, 70, 229, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
            padding: 0,
            cursor: 'pointer',
            width: '280px',
        },
    });

    const [nodes, setNodes] = useState<Node[]>(lesson.nodes.map((node, idx) => createReactFlowNode(node, idx)));

    // 建立連接線
    const createEdges = (lessonNodes: LessonNode[]): Edge[] =>
        lessonNodes.slice(0, -1).map((node, idx) => ({
            id: `e${node.id}-${lessonNodes[idx + 1].id}`,
            source: node.id,
            target: lessonNodes[idx + 1].id,
            type: 'smoothstep',
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
            style: { stroke: '#6366f1', strokeWidth: 2 },
        }));

    const [edges, setEdges] = useState<Edge[]>(createEdges(lesson.nodes));

    const onNodesChange: OnNodesChange = useCallback(
        (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
        []
    );

    const onEdgesChange: OnEdgesChange = useCallback(
        (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        []
    );

    const handleNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
        setSelectedNodeId(node.id);
    }, []);

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
        setNodes(updatedNodes.map((node, idx) => createReactFlowNode(node, idx)));
        setEdges(createEdges(updatedNodes));
    };

    const handleDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const handleDrop = useCallback((event: React.DragEvent) => {
        event.preventDefault();

        const type = event.dataTransfer.getData('application/reactflow');
        if (type !== 'agent') return;

        const agentId = event.dataTransfer.getData('agentId');
        const agent = AVAILABLE_AGENTS.find(a => a.id === agentId);
        if (!agent) return;

        // 計算放置位置（相對於 ReactFlow canvas）
        const reactFlowBounds = (event.target as HTMLElement).getBoundingClientRect();
        const position = {
            x: event.clientX - reactFlowBounds.left - 140,
            y: event.clientY - reactFlowBounds.top - 50,
        };

        const newNode: LessonNode = {
            id: `node-${Date.now()}`,
            title: agent.name,
            order: lesson.nodes.length + 1,
            agent,
            selectedTools: [],
        };

        const updatedNodes = [...lesson.nodes, newNode];
        setLesson(prev => ({ ...prev, nodes: updatedNodes }));

        // 創建新節點時使用自訂位置
        const newReactFlowNode = {
            ...createReactFlowNode(newNode, updatedNodes.length - 1),
            position,
        };

        setNodes([...nodes, newReactFlowNode]);
        setEdges(createEdges(updatedNodes));
    }, [lesson.nodes, nodes, createEdges]);

    const handleDeleteNode = (nodeId: string) => {
        if (lesson.nodes.length <= 1) {
            alert('至少需要保留一個節點！');
            return;
        }

        if (confirm('確定要刪除此節點嗎？')) {
            const updatedNodes = lesson.nodes.filter(n => n.id !== nodeId).map((n, idx) => ({ ...n, order: idx + 1 }));
            setLesson(prev => ({ ...prev, nodes: updatedNodes }));
            setNodes(updatedNodes.map((node, idx) => createReactFlowNode(node, idx)));
            setEdges(createEdges(updatedNodes));
            setSelectedNodeId(null);
        }
    };

    const handleUpdateNode = (updatedNode: LessonNode) => {
        const updatedNodes = lesson.nodes.map(n => n.id === updatedNode.id ? updatedNode : n);
        setLesson(prev => ({ ...prev, nodes: updatedNodes }));
        setNodes(updatedNodes.map((node, idx) => createReactFlowNode(node, idx)));
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
                        onClick={() => navigate('/')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
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
                    <button
                        onClick={handleAddNode}
                        className="px-4 py-2 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium transition-all flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        新增節點
                    </button>
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
                {/* 左側 Agent 面板 */}
                <div className="w-72 bg-white border-r border-gray-200 overflow-y-auto">
                    <div className="p-4 space-y-4">
                        <h3 className="font-bold text-gray-900 sticky top-0 bg-white pb-2 border-b">
                            可用 Agents
                        </h3>
                        <p className="text-xs text-gray-500">拖曳到畫布以新增節點</p>

                        {AVAILABLE_AGENTS.map(agent => (
                            <div
                                key={agent.id}
                                draggable
                                onDragStart={(e) => {
                                    e.dataTransfer.setData('application/reactflow', 'agent');
                                    e.dataTransfer.setData('agentId', agent.id);
                                    e.dataTransfer.effectAllowed = 'move';
                                }}
                                className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg cursor-move hover:shadow-md transition-all hover:scale-105"
                            >
                                <div className="font-medium text-sm text-gray-900 mb-1">
                                    {agent.name}
                                </div>
                                <div className="text-xs text-indigo-600 mb-2">
                                    {agent.nameEn}
                                </div>
                                <div className="text-xs text-gray-600 line-clamp-2">
                                    {agent.description}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ReactFlow 視覺化編輯器 */}
                <div className="flex-1" onDrop={handleDrop} onDragOver={handleDragOver}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onNodeClick={handleNodeClick}
                        fitView
                        attributionPosition="bottom-right"
                        proOptions={{ hideAttribution: true }}
                        nodesDraggable={true}
                        nodesConnectable={false}
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

                {/* 編輯側邊欄 */}
                {selectedNode && (
                    <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
                        <div className="p-6 space-y-6">
                            {/* 標題 */}
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold text-gray-900">編輯節點</h2>
                                <button
                                    onClick={() => setSelectedNodeId(null)}
                                    className="p-1 hover:bg-gray-100 rounded"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            {/* 節點標題 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">節點標題</label>
                                <input
                                    type="text"
                                    value={selectedNode.title}
                                    onChange={(e) => handleUpdateNode({ ...selectedNode, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Agent 選擇 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">AI Agent</label>
                                <select
                                    value={selectedNode.agent.id}
                                    onChange={(e) => {
                                        const agent = AVAILABLE_AGENTS.find(a => a.id === e.target.value)!;
                                        handleUpdateNode({ ...selectedNode, agent, selectedTools: [] });
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    {AVAILABLE_AGENTS.map(agent => (
                                        <option key={agent.id} value={agent.id}>
                                            {agent.name} ({agent.nameEn})
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-xs text-gray-500">{selectedNode.agent.description}</p>
                            </div>

                            {/* Tools 選擇 */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">可用 Tools</label>
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {AVAILABLE_TOOLS
                                        .filter(tool => selectedNode.agent.availableTools.includes(tool.id))
                                        .map(tool => (
                                            <label
                                                key={tool.id}
                                                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedNode.selectedTools.some(t => t.id === tool.id)}
                                                    onChange={(e) => {
                                                        const newTools = e.target.checked
                                                            ? [...selectedNode.selectedTools, tool]
                                                            : selectedNode.selectedTools.filter(t => t.id !== tool.id);
                                                        handleUpdateNode({ ...selectedNode, selectedTools: newTools });
                                                    }}
                                                    className="mt-1"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-medium text-sm text-gray-900">{tool.name}</div>
                                                    <div className="text-xs text-gray-500">{tool.description}</div>
                                                </div>
                                            </label>
                                        ))}
                                </div>
                            </div>

                            {/* 刪除按鈕 */}
                            <button
                                onClick={() => handleDeleteNode(selectedNode.id)}
                                className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
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
