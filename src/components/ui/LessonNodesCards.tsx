/**
 * LessonNodesCards - 增強型流程圖式卡片佈局
 * 
 * 使用 Dagre 自動佈局 + 完整的縮放、導覽、連線功能
 */

import { useEffect, useRef, useState } from 'react';
import { Award, Edit, Trash2, Plus, FileText, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';
import type { LessonNode } from '../../types/lessonPlan';
import dagre from 'dagre';

interface LessonNodesCardsProps {
    nodes: LessonNode[];
    selectedNodeId: string | null;
    onNodeClick: (nodeId: string) => void;
    onNodeDelete: (nodeId: string) => void;
    onAddNode?: () => void;
    className?: string;
}

interface CardPosition {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export default function LessonNodesCards({
    nodes,
    selectedNodeId,
    onNodeClick,
    onNodeDelete,
    onAddNode,
    className = ''
}: LessonNodesCardsProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const [cardPositions, setCardPositions] = useState<Map<string, CardPosition>>(new Map());
    const [scale, setScale] = useState(1);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [showMiniMap, setShowMiniMap] = useState(true);

    const getNodeTypeConfig = (node: LessonNode) => {
        const configs = {
            agent: { icon: '🤖', label: 'AI 助教', color: 'indigo', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' },
            video: { icon: '🎥', label: '影片', color: 'red', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
            material: { icon: '📄', label: '教材', color: 'blue', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
            worksheet: { icon: '📝', label: '練習', color: 'green', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
            external: { icon: '🔧', label: '工具', color: 'purple', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
        };
        const type = node.nodeType || 'agent';
        return configs[type] || configs.agent;
    };

    // 使用 Dagre 計算卡片位置
    useEffect(() => {
        const calculateLayout = () => {
            const dagreGraph = new dagre.graphlib.Graph();
            dagreGraph.setDefaultEdgeLabel(() => ({}));

            const cardWidth = 280;
            const cardHeight = 200;

            dagreGraph.setGraph({
                rankdir: 'LR',
                nodesep: 60,
                ranksep: 180,
                edgesep: 40,
                marginx: 40,
                marginy: 40,
            });

            nodes.forEach((node) => {
                dagreGraph.setNode(node.id, { width: cardWidth, height: cardHeight });
            });

            nodes.forEach((node, idx) => {
                if (node.isConditional && node.conditions) {
                    if (node.conditions.learnedPath) {
                        dagreGraph.setEdge(node.id, node.conditions.learnedPath);
                    }
                    if (node.conditions.notLearnedPath) {
                        dagreGraph.setEdge(node.id, node.conditions.notLearnedPath);
                    }
                    if (node.conditions.advancedPath) {
                        dagreGraph.setEdge(node.id, node.conditions.advancedPath);
                    }
                } else if (node.nextNodeId) {
                    dagreGraph.setEdge(node.id, node.nextNodeId);
                } else if (idx < nodes.length - 1 && (!node.branchLevel || node.branchLevel === 'standard')) {
                    const nextNode = nodes[idx + 1];
                    if (!nextNode.branchLevel || nextNode.branchLevel === 'standard') {
                        dagreGraph.setEdge(node.id, nextNode.id);
                    }
                }
            });

            dagre.layout(dagreGraph);

            const newPositions = new Map<string, CardPosition>();
            nodes.forEach((node) => {
                const nodeWithPosition = dagreGraph.node(node.id);
                let yOffset = 0;

                if (node.branchLevel === 'remedial') {
                    yOffset = 120;
                } else if (node.branchLevel === 'advanced') {
                    yOffset = -120;
                }

                newPositions.set(node.id, {
                    id: node.id,
                    x: nodeWithPosition.x - cardWidth / 2,
                    y: nodeWithPosition.y - cardHeight / 2 + yOffset,
                    width: cardWidth,
                    height: cardHeight,
                });
            });

            setCardPositions(newPositions);
        };

        calculateLayout();
    }, [nodes]);

    // 縮放控制
    const handleZoomIn = () => {
        setScale(prev => Math.min(prev + 0.2, 2));
    };

    const handleZoomOut = () => {
        setScale(prev => Math.max(prev - 0.2, 0.3));
    };

    const handleResetView = () => {
        setScale(1);
        setTranslate({ x: 0, y: 0 });
    };

    const handleFitView = () => {
        if (cardPositions.size === 0 || !containerRef.current) return;

        const positions = Array.from(cardPositions.values());
        const minX = Math.min(...positions.map(p => p.x));
        const maxX = Math.max(...positions.map(p => p.x + p.width));
        const minY = Math.min(...positions.map(p => p.y));
        const maxY = Math.max(...positions.map(p => p.y + p.height));

        const contentWidth = maxX - minX;
        const contentHeight = maxY - minY;

        const containerRect = containerRef.current.getBoundingClientRect();
        const scaleX = (containerRect.width - 100) / contentWidth;
        const scaleY = (containerRect.height - 100) / contentHeight;
        const newScale = Math.min(scaleX, scaleY, 1);

        setScale(newScale);
        setTranslate({
            x: (containerRect.width - contentWidth * newScale) / 2 - minX * newScale,
            y: (containerRect.height - contentHeight * newScale) / 2 - minY * newScale
        });
    };

    // 拖曳平移
    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.target === canvasRef.current || (e.target as HTMLElement).closest('.canvas-background')) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - translate.x, y: e.clientY - translate.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setTranslate({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // 滾輪縮放
    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = -e.deltaY * 0.001;
            setScale(prev => Math.max(0.3, Math.min(2, prev + delta)));
        }
    };

    // 渲染連接線
    const renderConnections = () => {
        const connections: React.ReactElement[] = [];

        nodes.forEach((node, index) => {
            const fromPos = cardPositions.get(node.id);
            if (!fromPos) return;

            const fromX = fromPos.x + fromPos.width;
            const fromY = fromPos.y + fromPos.height / 2;

            // 標準連接
            if (!node.isConditional && (!node.branchLevel || node.branchLevel === 'standard')) {
                const nextNode = nodes[index + 1];
                if (nextNode && (!nextNode.branchLevel || nextNode.branchLevel === 'standard')) {
                    const toPos = cardPositions.get(nextNode.id);
                    if (toPos) {
                        const toX = toPos.x;
                        const toY = toPos.y + toPos.height / 2;
                        connections.push(
                            <g key={`${node.id}-next`}>
                                <path
                                    d={`M ${fromX} ${fromY} C ${fromX + 60} ${fromY}, ${toX - 60} ${toY}, ${toX} ${toY}`}
                                    stroke="#6366f1"
                                    strokeWidth="3"
                                    fill="none"
                                    markerEnd="url(#arrowhead-blue)"
                                />
                            </g>
                        );
                    }
                }
            }

            // 條件分支
            if (node.isConditional && node.conditions) {
                if (node.conditions.learnedPath) {
                    const toPos = cardPositions.get(node.conditions.learnedPath);
                    if (toPos) {
                        const toX = toPos.x;
                        const toY = toPos.y + toPos.height / 2;
                        connections.push(
                            <g key={`${node.id}-learned`}>
                                <path
                                    d={`M ${fromX} ${fromY} C ${fromX + 80} ${fromY}, ${toX - 80} ${toY}, ${toX} ${toY}`}
                                    stroke="#3b82f6"
                                    strokeWidth="3"
                                    fill="none"
                                    markerEnd="url(#arrowhead-blue)"
                                />
                                <text
                                    x={(fromX + toX) / 2}
                                    y={(fromY + toY) / 2 - 10}
                                    fill="#3b82f6"
                                    fontSize="12"
                                    fontWeight="600"
                                    textAnchor="middle"
                                    className="pointer-events-none"
                                >
                                    ✓ 學會
                                </text>
                            </g>
                        );
                    }
                }

                if (node.conditions.notLearnedPath) {
                    const toPos = cardPositions.get(node.conditions.notLearnedPath);
                    if (toPos) {
                        const toX = toPos.x;
                        const toY = toPos.y + toPos.height / 2;
                        connections.push(
                            <g key={`${node.id}-remedial`}>
                                <path
                                    d={`M ${fromX} ${fromY} C ${fromX + 80} ${fromY}, ${toX - 80} ${toY}, ${toX} ${toY}`}
                                    stroke="#ea580c"
                                    strokeWidth="3"
                                    fill="none"
                                    markerEnd="url(#arrowhead-orange)"
                                />
                                <text
                                    x={(fromX + toX) / 2}
                                    y={(fromY + toY) / 2 - 10}
                                    fill="#ea580c"
                                    fontSize="12"
                                    fontWeight="600"
                                    textAnchor="middle"
                                    className="pointer-events-none"
                                >
                                    🔄 補強
                                </text>
                            </g>
                        );
                    }
                }

                if (node.conditions.advancedPath) {
                    const toPos = cardPositions.get(node.conditions.advancedPath);
                    if (toPos) {
                        const toX = toPos.x;
                        const toY = toPos.y + toPos.height / 2;
                        connections.push(
                            <g key={`${node.id}-advanced`}>
                                <path
                                    d={`M ${fromX} ${fromY} C ${fromX + 80} ${fromY}, ${toX - 80} ${toY}, ${toX} ${toY}`}
                                    stroke="#a855f7"
                                    strokeWidth="3"
                                    fill="none"
                                    markerEnd="url(#arrowhead-purple)"
                                />
                                <text
                                    x={(fromX + toX) / 2}
                                    y={(fromY + toY) / 2 + 25}
                                    fill="#a855f7"
                                    fontSize="12"
                                    fontWeight="600"
                                    textAnchor="middle"
                                    className="pointer-events-none"
                                >
                                    🚀 進階
                                </text>
                            </g>
                        );
                    }
                }
            }

            // 補強返回
            if (node.nextNodeId && node.branchLevel === 'remedial') {
                const toPos = cardPositions.get(node.nextNodeId);
                if (toPos) {
                    const toX = toPos.x;
                    const toY = toPos.y + toPos.height / 2;
                    connections.push(
                        <g key={`${node.id}-return`}>
                            <path
                                d={`M ${fromX} ${fromY} C ${fromX + 80} ${fromY}, ${toX - 80} ${toY}, ${toX} ${toY}`}
                                stroke="#8b5cf6"
                                strokeWidth="2"
                                strokeDasharray="8 4"
                                fill="none"
                                markerEnd="url(#arrowhead-purple)"
                            />
                        </g>
                    );
                }
            }
        });

        return connections;
    };

    // 渲染 MiniMap
    const renderMiniMap = () => {
        if (!showMiniMap || cardPositions.size === 0) return null;

        const positions = Array.from(cardPositions.values());
        const minX = Math.min(...positions.map(p => p.x));
        const maxX = Math.max(...positions.map(p => p.x + p.width));
        const minY = Math.min(...positions.map(p => p.y));
        const maxY = Math.max(...positions.map(p => p.y + p.height));

        const contentWidth = maxX - minX;
        const contentHeight = maxY - minY;

        const miniMapWidth = 200;
        const miniMapHeight = 150;
        const miniScale = Math.min(miniMapWidth / contentWidth, miniMapHeight / contentHeight);

        return (
            <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border-2 border-gray-200 p-2 z-20">
                <svg width={miniMapWidth} height={miniMapHeight} className="border border-gray-100 rounded">
                    <rect width={miniMapWidth} height={miniMapHeight} fill="#f9fafb" />
                    {nodes.map(node => {
                        const pos = cardPositions.get(node.id);
                        if (!pos) return null;
                        return (
                            <rect
                                key={node.id}
                                x={(pos.x - minX) * miniScale}
                                y={(pos.y - minY) * miniScale}
                                width={pos.width * miniScale}
                                height={pos.height * miniScale}
                                fill={selectedNodeId === node.id ? '#6366f1' : '#e5e7eb'}
                                stroke="#9ca3af"
                                strokeWidth="1"
                                rx="2"
                            />
                        );
                    })}
                </svg>
            </div>
        );
    };

    // 渲染單個卡片
    const renderCard = (node: LessonNode, globalIndex: number) => {
        const config = getNodeTypeConfig(node);
        const isSelected = selectedNodeId === node.id;
        const pos = cardPositions.get(node.id);
        if (!pos) return null;

        const isFirstNode = globalIndex === 0;
        const isLastNode = globalIndex === nodes.length - 1 && !node.isConditional && !node.nextNodeId;

        return (
            <div
                key={node.id}
                ref={(el) => {
                    if (el) cardRefs.current.set(node.id, el);
                    else cardRefs.current.delete(node.id);
                }}
                onClick={() => onNodeClick(node.id)}
                className={`
                    absolute bg-white rounded-xl border-2 shadow-lg
                    transition-all duration-200 cursor-pointer
                    ${isSelected
                        ? 'ring-4 ring-indigo-300 shadow-2xl scale-105 border-indigo-500 z-10'
                        : 'border-gray-200 hover:shadow-xl hover:border-indigo-300'
                    }
                `}
                style={{
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    width: `${pos.width}px`,
                    minHeight: `${pos.height}px`,
                }}
            >
                {isFirstNode && (
                    <div className="absolute -top-3 left-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg bg-gradient-to-r from-green-500 to-emerald-600">
                        ▶ 開始
                    </div>
                )}
                {isLastNode && (
                    <div className="absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg bg-gradient-to-r from-gray-600 to-gray-700">
                        ■ 結束
                    </div>
                )}

                <div className={`px-4 py-3 border-b border-gray-200 ${config.bgColor}`}>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-2xl">{config.icon}</span>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-gray-400">#{globalIndex + 1}</span>
                                <h3 className="font-bold text-gray-900 text-base truncate flex-1">
                                    {node.title}
                                </h3>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${config.color === 'indigo' ? 'bg-indigo-100 text-indigo-700' :
                                        config.color === 'red' ? 'bg-red-100 text-red-700' :
                                            config.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                                                config.color === 'green' ? 'bg-green-100 text-green-700' :
                                                    'bg-purple-100 text-purple-700'
                                    }`}>
                                    {config.label}
                                </span>
                                {node.isConditional && (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-orange-100 text-orange-700">
                                        🔀 檢查點
                                    </span>
                                )}
                                {node.branchLevel && node.branchLevel !== 'standard' && (
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${node.branchLevel === 'advanced'
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'bg-orange-100 text-orange-700'
                                        }`}>
                                        {node.branchLevel === 'advanced' ? '🚀 進階' : '🔄 補強'}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onNodeDelete(node.id);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="刪除"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="px-4 py-3 space-y-2">
                    {node.agent && (
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-2.5 border border-indigo-100">
                            <div className="text-[9px] text-indigo-600 uppercase font-bold mb-0.5">AI Agent</div>
                            <div className="font-bold text-gray-900 text-sm">{node.agent.name}</div>
                        </div>
                    )}

                    {node.generatedContent && (
                        <div className="space-y-1.5 text-xs">
                            {node.generatedContent.materials && node.generatedContent.materials.length > 0 && (
                                <div className="flex items-start gap-1.5">
                                    <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0 text-gray-700 text-[11px] line-clamp-2">
                                        {node.generatedContent.materials[0]}
                                    </div>
                                </div>
                            )}
                            {node.generatedContent.exercises && (
                                <div className="flex items-center gap-1.5">
                                    <Award className="w-3.5 h-3.5 text-amber-500" />
                                    <span className="text-gray-600 text-[11px]">{node.generatedContent.exercises} 題</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {isSelected && (
                    <div className="px-4 py-2 bg-indigo-50 border-t border-indigo-100 flex items-center gap-1 text-indigo-600 text-xs font-bold">
                        <Edit className="w-3.5 h-3.5" />
                        <span>編輯中</span>
                    </div>
                )}
            </div>
        );
    };

    const containerHeight = Math.max(800, ...Array.from(cardPositions.values()).map(pos => pos.y + pos.height + 80));
    const containerWidth = Math.max(1200, ...Array.from(cardPositions.values()).map(pos => pos.x + pos.width + 80));

    useEffect(() => {
        if (cardPositions.size > 0) {
            handleFitView();
        }
    }, [cardPositions]);

    return (
        <div className={`relative ${className}`}>
            <div
                ref={containerRef}
                className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
                style={{ height: `calc(100vh - 120px)` }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
            >
                {/* 控制面板 */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                    <button
                        onClick={handleZoomIn}
                        className="p-2.5 bg-white border-2 border-gray-200 rounded-lg shadow-md hover:bg-gray-50 hover:border-indigo-300 transition-all"
                        title="放大"
                    >
                        <ZoomIn className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                        onClick={handleZoomOut}
                        className="p-2.5 bg-white border-2 border-gray-200 rounded-lg shadow-md hover:bg-gray-50 hover:border-indigo-300 transition-all"
                        title="縮小"
                    >
                        <ZoomOut className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                        onClick={handleFitView}
                        className="p-2.5 bg-white border-2 border-gray-200 rounded-lg shadow-md hover:bg-gray-50 hover:border-indigo-300 transition-all"
                        title="適應畫面"
                    >
                        <Maximize2 className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                        onClick={handleResetView}
                        className="p-2.5 bg-white border-2 border-gray-200 rounded-lg shadow-md hover:bg-gray-50 hover:border-indigo-300 transition-all"
                        title="重置視圖"
                    >
                        <Minimize2 className="w-5 h-5 text-gray-700" />
                    </button>
                    <button
                        onClick={() => setShowMiniMap(!showMiniMap)}
                        className={`p-2.5 border-2 rounded-lg shadow-md transition-all ${showMiniMap
                                ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                        title="導覽地圖"
                    >
                        🗺️
                    </button>
                </div>

                {/* 縮放比例顯示 */}
                <div className="absolute top-4 left-4 bg-white px-3 py-1.5 rounded-lg shadow-md border-2 border-gray-200 text-xs font-bold text-gray-700 z-20">
                    {Math.round(scale * 100)}%
                </div>

                {/* Canvas */}
                <div
                    ref={canvasRef}
                    className="canvas-background absolute"
                    style={{
                        width: `${containerWidth}px`,
                        height: `${containerHeight}px`,
                        transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                        transformOrigin: '0 0',
                        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                        cursor: isDragging ? 'grabbing' : 'grab',
                    }}
                >
                    {/* SVG 連接線層 */}
                    <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
                        <defs>
                            <marker id="arrowhead-blue" markerWidth="12" markerHeight="12" refX="10" refY="4" orient="auto">
                                <polygon points="0 0, 12 4, 0 8" fill="#3b82f6" />
                            </marker>
                            <marker id="arrowhead-orange" markerWidth="12" markerHeight="12" refX="10" refY="4" orient="auto">
                                <polygon points="0 0, 12 4, 0 8" fill="#ea580c" />
                            </marker>
                            <marker id="arrowhead-purple" markerWidth="12" markerHeight="12" refX="10" refY="4" orient="auto">
                                <polygon points="0 0, 12 4, 0 8" fill="#a855f7" />
                            </marker>
                        </defs>
                        {renderConnections()}
                    </svg>

                    {/* 卡片層 */}
                    <div className="relative" style={{ zIndex: 2 }}>
                        {nodes.map((node, idx) => renderCard(node, idx))}
                    </div>
                </div>

                {/* MiniMap */}
                {renderMiniMap()}
            </div>
        </div>
    );
}
