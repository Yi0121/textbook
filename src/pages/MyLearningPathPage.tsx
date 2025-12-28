/**
 * MyLearningPathPage - 學生端學習路徑頁面（Workflow 視覺化版本）
 * 
 * 學生視角：
 * - 看得到：學習路徑流程圖、任務、進度
 * - 看不到：Agent、Tools、教學設計細節
 */

import { useState } from 'react';
import { ReactFlow, Background, Controls, MiniMap, MarkerType, Handle, Position } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { BookOpen, CheckCircle, Lock, PlayCircle, Award, TrendingUp } from 'lucide-react';
import { MOCK_GENERATED_LESSON } from '../types/lessonPlan';
import { MOCK_STUDENT_PROGRESS } from '../types/studentProgress';
import type { LessonNode } from '../types/lessonPlan';
import type { NodeProgress } from '../types/studentProgress';

export default function MyLearningPathPage() {
    // TODO: 從 API 或 localStorage 讀取
    const lesson = MOCK_GENERATED_LESSON;
    const studentProgress = MOCK_STUDENT_PROGRESS[0]; // 模擬當前學生

    const getNodeProgress = (nodeId: string): NodeProgress | undefined => {
        return studentProgress.nodeProgress.find(np => np.nodeId === nodeId);
    };

    const getNodeStatus = (node: LessonNode): 'completed' | 'current' | 'locked' => {
        const progress = getNodeProgress(node.id);
        if (!progress) return 'locked';
        if (progress.completed) return 'completed';
        if (node.id === studentProgress.currentNodeId) return 'current';
        return 'locked';
    };

    // 建立學生端的 ReactFlow nodes（簡化版，不顯示 Agent）
    const createStudentNode = (node: LessonNode, idx: number): Node => {
        const status = getNodeStatus(node);
        const progress = getNodeProgress(node.id);

        return {
            id: node.id,
            type: 'default',
            position: { x: 50 + idx * 320, y: 150 },
            data: {
                label: (
                    <div className="px-4 py-3" style={{ width: '260px' }}>
                        {/* 連接點 */}
                        <Handle
                            type="target"
                            position={Position.Left}
                            style={{ background: '#6366f1', width: 10, height: 10 }}
                        />

                        {/* 狀態圖標 */}
                        <div className="flex items-center gap-3 mb-3">
                            {status === 'completed' && (
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                            )}
                            {status === 'current' && (
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0 animate-pulse">
                                    <PlayCircle className="w-6 h-6 text-indigo-600" />
                                </div>
                            )}
                            {status === 'locked' && (
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Lock className="w-6 h-6 text-gray-400" />
                                </div>
                            )}
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 text-sm truncate">{node.title}</h3>
                            </div>
                        </div>

                        {/* 學習內容 - 不顯示 Agent/Tools */}
                        <div className="space-y-1.5 text-xs text-gray-600">
                            {node.generatedContent?.materials && (
                                <div className="flex items-center gap-1.5">
                                    <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span className="truncate">{node.generatedContent.materials[0]}</span>
                                </div>
                            )}
                            {node.generatedContent?.exercises && (
                                <div className="flex items-center gap-1.5">
                                    <Award className="w-3.5 h-3.5 flex-shrink-0" />
                                    <span>練習 {node.generatedContent.exercises} 題</span>
                                </div>
                            )}
                        </div>

                        {/* 進度資訊 */}
                        {progress && progress.score !== undefined && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                                <div className="flex items-center gap-1.5 text-xs">
                                    <TrendingUp className="w-3.5 h-3.5 text-yellow-500" />
                                    <span className="font-medium text-gray-900">{progress.score} 分</span>
                                </div>
                            </div>
                        )}

                        <Handle
                            type="source"
                            position={Position.Right}
                            style={{ background: '#6366f1', width: 10, height: 10 }}
                        />
                    </div>
                ),
            },
            style: {
                background: 'white',
                border: status === 'completed'
                    ? '2px solid #10b981'
                    : status === 'current'
                        ? '3px solid #6366f1'
                        : '2px solid #d1d5db',
                borderRadius: '12px',
                boxShadow: status === 'current' ? '0 8px 16px rgba(99, 102, 241, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                padding: 0,
                width: '260px',
                opacity: status === 'locked' ? 0.6 : 1,
            },
        };
    };

    // 建立邊線（簡化版，根據學生實際路徑）
    const createStudentEdges = (): Edge[] => {
        const edges: Edge[] = [];
        const safeNodes = lesson.nodes || [];

        safeNodes.forEach((node, idx) => {
            const progress = getNodeProgress(node.id);

            // 條件節點的路徑（根據學生實際走的路徑）
            if (node.isConditional && node.conditions && progress) {
                if (progress.pathTaken === 'learned' && node.conditions.learnedPath) {
                    edges.push({
                        id: `e${node.id}-learned`,
                        source: node.id,
                        target: node.conditions.learnedPath,
                        type: 'smoothstep',
                        animated: true,
                        markerEnd: { type: MarkerType.ArrowClosed, color: '#10b981' },
                        style: { stroke: '#10b981', strokeWidth: 2 },
                    });
                } else if (progress.pathTaken === 'remedial' && node.conditions.notLearnedPath) {
                    edges.push({
                        id: `e${node.id}-remedial`,
                        source: node.id,
                        target: node.conditions.notLearnedPath,
                        type: 'smoothstep',
                        animated: true,
                        markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' },
                        style: { stroke: '#f59e0b', strokeWidth: 2 },
                    });
                }
            } else if (node.nextNodeId) {
                // 明確指定的下一個節點
                edges.push({
                    id: `e${node.id}-next`,
                    source: node.id,
                    target: node.nextNodeId,
                    type: 'smoothstep',
                    animated: true,
                    markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
                    style: { stroke: '#6366f1', strokeWidth: 2 },
                });
            } else if (idx < safeNodes.length - 1) {
                // 順序連接
                edges.push({
                    id: `e${node.id}-${safeNodes[idx + 1].id}`,
                    source: node.id,
                    target: safeNodes[idx + 1].id,
                    type: 'smoothstep',
                    animated: true,
                    markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1' },
                    style: { stroke: '#6366f1', strokeWidth: 2 },
                });
            }
        });

        return edges;
    };

    const [nodes] = useState<Node[]>((lesson.nodes || []).map((node, idx) => createStudentNode(node, idx)));
    const [edges] = useState<Edge[]>(createStudentEdges());

    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
            {/* 頭部資訊 */}
            <div className="bg-white shadow-sm p-4 border-b">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
                        <p className="text-sm text-gray-600 mt-1">你的學習路徑</p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-indigo-600">{studentProgress.overallProgress}%</div>
                        <div className="text-xs text-gray-500">完成度</div>
                    </div>
                </div>

                {/* 進度條 */}
                <div className="max-w-7xl mx-auto mt-3">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                            style={{ width: `${studentProgress.overallProgress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* ReactFlow 學習路徑圖 */}
            <div className="flex-1">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    fitView
                    attributionPosition="bottom-right"
                    proOptions={{ hideAttribution: true }}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={false}
                    minZoom={0.5}
                    maxZoom={1.5}
                >
                    <Background />
                    <Controls />
                    <MiniMap
                        nodeColor={(node) => {
                            const lessonNode = (lesson.nodes || []).find(n => n.id === node.id);
                            if (!lessonNode) return '#d1d5db';
                            const status = getNodeStatus(lessonNode);
                            return status === 'completed' ? '#10b981' : status === 'current' ? '#6366f1' : '#d1d5db';
                        }}
                        maskColor="rgba(0, 0, 0, 0.1)"
                    />
                </ReactFlow>
            </div>

            {/* 補強提示（如果正在補強） */}
            {studentProgress.currentNodeId === 'node-2-补强' && (
                <div className="absolute bottom-6 left-6 right-6 max-w-md mx-auto">
                    <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-4 shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-orange-900">💪 加強練習中</h3>
                                <p className="text-sm text-orange-700">完成補強後可繼續學習</p>
                            </div>
                            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors whitespace-nowrap">
                                繼續練習
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
