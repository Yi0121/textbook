/**
 * WorkflowEditor - 學習路徑流程編輯器（簡化版）
 *
 * 功能：
 * - 使用 React Flow 顯示學習路徑節點與邊
 * - 支援平移 (Pan) 與縮放 (Zoom)
 * - 顯示當前學生的學習路徑
 */

import React, { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ChapterNode } from './nodes/ChapterNode';
import { useLearningPath } from '../../../context/LearningPathContext';

// 註冊自定義節點類型
const nodeTypes = {
  chapter: ChapterNode,
  // 未來將新增其他節點類型：
  // exercise: ExerciseNode,
  // video: VideoNode,
  // ai_tutor: AITutorNode,
  // quiz: QuizNode,
  // collaboration: CollaborationNode,
};

export function WorkflowEditor() {
  const { state } = useLearningPath();

  // 取得當前學生的學習路徑
  const currentPath = state.currentStudentId
    ? state.studentPaths.get(state.currentStudentId)
    : null;

  // 將 LearningPathNode 轉換為 React Flow Node 格式
  const initialNodes: Node[] = currentPath?.nodes || [];
  const initialEdges: Edge[] = currentPath?.edges || [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // 當使用者連接兩個節點時觸發
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  // 同步 Context 變化到 React Flow
  React.useEffect(() => {
    if (currentPath) {
      setNodes(currentPath.nodes);
      setEdges(currentPath.edges);
    }
  }, [currentPath, setNodes, setEdges]);

  return (
    <div className="w-full h-full bg-gray-50">
      {currentPath ? (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.2}
          maxZoom={2}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          {/* 背景網格 */}
          <Background color="#e5e7eb" gap={16} />

          {/* 控制面板（縮放、適應畫面） */}
          <Controls />

          {/* 小地圖 */}
          <MiniMap
            nodeColor={(node) => {
              switch (node.data.status) {
                case 'completed':
                  return '#10b981'; // green
                case 'in_progress':
                  return '#3b82f6'; // blue
                default:
                  return '#e5e7eb'; // gray
              }
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
          />

          {/* 頂部資訊欄 */}
          <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded-lg shadow-md border border-gray-200">
            <div className="text-sm font-medium text-gray-700">
              學生：{currentPath.studentName}
            </div>
            <div className="text-xs text-gray-500">
              節點：{currentPath.nodes.length} | 完成：{currentPath.progress.completedNodes}
            </div>
          </div>
        </ReactFlow>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-gray-500 text-lg mb-2">尚未選擇學生</p>
            <p className="text-gray-400 text-sm">
              請先在「學習路徑測試」區域點擊「AI 分析路徑」按鈕
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
