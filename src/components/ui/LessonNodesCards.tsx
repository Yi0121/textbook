/**
 * LessonNodesCards - Storyboard 風格的學習路徑編輯器
 * 
 * 類似圖片中的 Storyboard，卡片可以自由排列
 */

import { BookOpen, Award, Edit, Trash2, Plus, Video, FileText, Pen, Wrench, AlertCircle, ChevronRight } from 'lucide-react';
import type { LessonNode } from '../../types/lessonPlan';

interface LessonNodesCardsProps {
    nodes: LessonNode[];
    selectedNodeId: string | null;
    onNodeClick: (nodeId: string) => void;
    onNodeDelete: (nodeId: string) => void;
    onAddNode?: () => void;
    className?: string;
}

export default function LessonNodesCards({
    nodes,
    selectedNodeId,
    onNodeClick,
    onNodeDelete,
    onAddNode,
    className = ''
}: LessonNodesCardsProps) {
    const getNodeTypeConfig = (node: LessonNode) => {
        const configs = {
            agent: {
                icon: '🤖',
                label: 'AI 助教',
                color: 'indigo'
            },
            video: {
                icon: '🎥',
                label: '影片',
                color: 'red'
            },
            material: {
                icon: '📄',
                label: '教材',
                color: 'blue'
            },
            worksheet: {
                icon: '📝',
                label: '練習',
                color: 'green'
            },
            external: {
                icon: '🔧',
                label: '工具',
                color: 'purple'
            },
        };

        const type = node.nodeType || 'agent';
        return configs[type] || configs.agent;
    };

    // 將節點分組為行（模擬 Storyboard 的自由佈局）
    const organizeNodesInRows = () => {
        const rows: LessonNode[][] = [];
        let currentRow: LessonNode[] = [];
        let rowNodeCount = 0;

        nodes.forEach((node) => {
            // 主流程節點
            if (!node.branchLevel || node.branchLevel === 'standard') {
                if (rowNodeCount >= 3) {
                    rows.push([...currentRow]);
                    currentRow = [];
                    rowNodeCount = 0;
                }
                currentRow.push(node);
                rowNodeCount++;
            }
        });

        if (currentRow.length > 0) {
            rows.push(currentRow);
        }

        // 補強和進階路徑另起一行
        const remedialNodes = nodes.filter(n => n.branchLevel === 'remedial');
        if (remedialNodes.length > 0) {
            rows.push(remedialNodes);
        }

        const advancedNodes = nodes.filter(n => n.branchLevel === 'advanced');
        if (advancedNodes.length > 0) {
            rows.push(advancedNodes);
        }

        return rows;
    };

    const rows = organizeNodesInRows();

    // 渲染單個卡片
    const renderCard = (node: LessonNode, globalIndex: number) => {
        const config = getNodeTypeConfig(node);
        const isSelected = selectedNodeId === node.id;
        const isConditional = node.isConditional;

        return (
            <div
                key={node.id}
                onClick={() => onNodeClick(node.id)}
                className={`
                    relative bg-white rounded-lg border shadow-sm
                    transition-all duration-200 cursor-pointer
                    w-full
                    ${isSelected
                        ? 'ring-2 ring-indigo-500 shadow-lg scale-[1.02]'
                        : 'border-gray-200 hover:shadow-md hover:border-gray-300'
                    }
                `}
            >
                {/* 卡片頭部 - 緊湊設計 */}
                <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-sm">{config.icon}</span>
                        <span className="text-xs text-gray-500 font-medium">{globalIndex + 1}.</span>
                        <h3 className="font-semibold text-gray-900 text-sm truncate flex-1">
                            {node.title}
                        </h3>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onNodeDelete(node.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="刪除"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* 卡片內容區 */}
                <div className="px-3 py-3 space-y-2">
                    {/* Agent 資訊 */}
                    {node.agent && (
                        <div className="bg-gray-50 rounded-md p-2">
                            <div className="text-[10px] text-gray-500 uppercase font-medium mb-0.5">Agent</div>
                            <div className="font-semibold text-gray-900 text-xs">{node.agent.name}</div>
                        </div>
                    )}

                    {/* 內容摘要 */}
                    {node.generatedContent && (
                        <div className="space-y-1.5 text-xs">
                            {node.generatedContent.materials && node.generatedContent.materials.length > 0 && (
                                <div className="flex items-start gap-1.5">
                                    <FileText className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-gray-700 text-[11px] line-clamp-2">
                                            {node.generatedContent.materials[0]}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {node.generatedContent.exercises && (
                                <div className="flex items-center gap-1.5 text-[11px]">
                                    <Award className="w-3.5 h-3.5 text-amber-500" />
                                    <span className="text-gray-600">{node.generatedContent.exercises} 題練習</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 工具 */}
                    {node.selectedTools && node.selectedTools.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {node.selectedTools.slice(0, 2).map((tool, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px] font-medium">
                                    {tool.name}
                                </span>
                            ))}
                            {node.selectedTools.length > 2 && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px]">
                                    +{node.selectedTools.length - 2}
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* 卡片底部 - 操作列 */}
                <div className="px-3 py-2 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        {/* 標籤 */}
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${config.color === 'indigo' ? 'bg-indigo-100 text-indigo-700' :
                                config.color === 'red' ? 'bg-red-100 text-red-700' :
                                    config.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                                        config.color === 'green' ? 'bg-green-100 text-green-700' :
                                            'bg-purple-100 text-purple-700'
                            }`}>
                            {config.label}
                        </span>

                        {isConditional && (
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-orange-100 text-orange-700">
                                檢查點
                            </span>
                        )}

                        {node.branchLevel && node.branchLevel !== 'standard' && (
                            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${node.branchLevel === 'advanced'
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-orange-100 text-orange-700'
                                }`}>
                                {node.branchLevel === 'advanced' ? '進階' : '補強'}
                            </span>
                        )}
                    </div>

                    {isSelected && (
                        <div className="flex items-center gap-1 text-indigo-600 text-[10px] font-medium">
                            <Edit className="w-3 h-3" />
                            <span>編輯中</span>
                        </div>
                    )}
                </div>

                {/* 分支指示器 */}
                {isConditional && node.conditions && (
                    <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                        {node.conditions.learnedPath && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full shadow-sm flex items-center justify-center" title="學會路徑">
                                <ChevronRight className="w-3 h-3 text-white" />
                            </div>
                        )}
                        {node.conditions.notLearnedPath && (
                            <div className="w-4 h-4 bg-orange-500 rounded-full shadow-sm flex items-center justify-center" title="補強路徑">
                                <ChevronRight className="w-3 h-3 text-white" />
                            </div>
                        )}
                        {node.conditions.advancedPath && (
                            <div className="w-4 h-4 bg-purple-500 rounded-full shadow-sm flex items-center justify-center" title="進階路徑">
                                <ChevronRight className="w-3 h-3 text-white" />
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className={`p-8 ${className}`}>
            {/* Storyboard 風格網格佈局 */}
            <div className="space-y-6">
                {rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {row.map((node) => renderCard(node, nodes.indexOf(node)))}
                    </div>
                ))}

                {/* 新增節點卡片 */}
                {onAddNode && (
                    <div className="flex justify-center pt-4">
                        <button
                            onClick={onAddNode}
                            className="w-full md:w-64 h-32 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-white hover:border-indigo-400 hover:shadow-md transition-all flex flex-col items-center justify-center group"
                        >
                            <Plus className="w-8 h-8 text-gray-400 group-hover:text-indigo-600 mb-2 transition-colors" />
                            <div className="text-sm font-medium text-gray-600 group-hover:text-indigo-600 transition-colors">新增節點</div>
                            <div className="text-xs text-gray-400 mt-1">或從左側拖曳資源</div>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
