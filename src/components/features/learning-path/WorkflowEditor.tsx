/**
 * WorkflowEditor - 學習路徑流程編輯器（簡化版）
 *
 * 功能：
 * - 使用 React Flow 顯示學習路徑節點與邊
 * - 支援平移 (Pan) 與縮放 (Zoom)
 * - 顯示當前學生的學習路徑
 * - 優化：Event-Driven 狀態同步，避免 Dragging 效能問題
 */

import { NodeDetailModal } from './NodeDetailModal';
import type { LearningPathNode } from '../../../types';

import React, { useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  addEdge,
  type Connection,
  type Node,
  type Edge,
  type NodeChange,
  applyNodeChanges,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Sparkles, Trash2, RotateCcw } from 'lucide-react';
import { ChapterNode } from './nodes/ChapterNode';
import { ExerciseNode } from './nodes/ExerciseNode';
import { QuizNode } from './nodes/QuizNode';
import { AITutorNode } from './nodes/AITutorNode';
import { VideoNode } from './nodes/VideoNode';
import { CollaborationNode } from './nodes/CollaborationNode';
import { NodePalette } from './NodePalette';
import { useLearningPath } from '../../../context/LearningPathContext';
import { analyzeStudentAndGeneratePath } from '../../../services/ai/learningPathService';
import { getLayoutedElements } from '../../../utils/layout';

import { OptionalEdge } from './edges/OptionalEdge';
import { ConditionalEdge } from './edges/ConditionalEdge';

// 註冊自定義節點類型
const nodeTypes = {
  chapter: ChapterNode,
  exercise: ExerciseNode,
  quiz: QuizNode,
  ai_tutor: AITutorNode,
  video: VideoNode,
  collaboration: CollaborationNode,
};

// 註冊自定義邊類型
const edgeTypes = {
  optional: OptionalEdge,
  conditional: ConditionalEdge,
};

// 內部組件：封裝 React Flow 邏輯以便使用 useReactFlow hook
const FlowEditorInternal = () => {
  const { state, dispatch } = useLearningPath();
  const reactFlowInstance = useReactFlow();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 編輯 Modal 狀態 [NEW]
  const [selectedNode, setSelectedNode] = React.useState<LearningPathNode | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // 點擊節點開啟編輯 [NEW]
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node as unknown as LearningPathNode);
    setIsModalOpen(true);
  }, []);

  // 儲存節點變更 [NEW]
  const handleSaveNode = (nodeId: string, updates: Partial<LearningPathNode['data']>) => {
    if (!state.currentStudentId) return;

    // 1. 更新 React Flow Local State
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...updates } };
        }
        return node;
      })
    );

    // 2. 同步回 Context
    dispatch({
      type: 'UPDATE_NODE',
      payload: {
        studentId: state.currentStudentId,
        nodeId,
        changes: { data: updates as any }
      }
    });
  };

  // 刪除節點 [NEW]
  const handleDeleteNode = (nodeId: string) => {
    if (!state.currentStudentId) return;

    // 1. 更新 UI
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));

    // 2. 同步 Context
    dispatch({
      type: 'DELETE_NODE',
      payload: { studentId: state.currentStudentId, nodeId }
    });
  };

  // 使用 Ref 追蹤當前學生 ID
  const currentStudentIdRef = useRef<string | null>(null);

  // 取得當前學生的學習路徑
  const currentPath = state.currentStudentId
    ? state.studentPaths.get(state.currentStudentId)
    : null;

  // React Flow 內部狀態
  const [nodes, setNodes] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // 追蹤最後一次同步的時間戳，避免重複更新
  const lastSyncedRef = useRef<number>(0);

  // 當切換學生時，重置/載入狀態
  useEffect(() => {
    // 沒選學生時清空
    if (!currentPath) {
      setNodes([]);
      setEdges([]);
      currentStudentIdRef.current = null;
      lastSyncedRef.current = 0;
      return;
    }

    // 1. 切換學生：重置並 Fit View
    if (state.currentStudentId !== currentStudentIdRef.current) {
      setNodes(currentPath.nodes);
      setEdges(currentPath.edges);
      currentStudentIdRef.current = state.currentStudentId;
      lastSyncedRef.current = currentPath.lastModified;
      setTimeout(() => reactFlowInstance.fitView({ padding: 0.2 }), 100);
      return;
    }

    // 2. 外部更新（如 AI 生成）導致的變更：同步回 Local State
    // 若 Context 的最後修改時間比我們上次同步的時間新，則更新
    if (currentPath.lastModified > lastSyncedRef.current) {
      setNodes(currentPath.nodes);
      setEdges(currentPath.edges);
      lastSyncedRef.current = currentPath.lastModified;
    }
  }, [currentPath, state.currentStudentId, setNodes, setEdges, reactFlowInstance]);

  // ==================== 事件處理 ====================

  const onNodesChangeHandler = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  // 拖曳結束同步位置
  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (!state.currentStudentId) return;
      dispatch({
        type: 'UPDATE_NODE_POSITION',
        payload: { studentId: state.currentStudentId, nodeId: node.id, position: node.position },
      });
    },
    [dispatch, state.currentStudentId]
  );

  // 連接建立
  const onConnect = useCallback(
    (connection: Connection) => {
      if (!state.currentStudentId) return;
      setEdges((eds) => addEdge(connection, eds));
      dispatch({
        type: 'ADD_EDGE',
        payload: {
          studentId: state.currentStudentId,
          edge: {
            id: `e${connection.source}-${connection.target}`,
            source: connection.source,
            target: connection.target,
            type: 'default',
          },
        },
      });
    },
    [setEdges, dispatch, state.currentStudentId]
  );

  // ==================== Drag & Drop 新增節點 ====================

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !state.currentStudentId) return;

      // 計算放置座標
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type, // 這裡要對應 nodeTypes 的 key，目前只有 chapter
        position,
        data: { label: `New ${type}`, status: 'pending' }, // 預設資料
      };

      // 1. 更新 UI
      setNodes((nds) => nds.concat(newNode));

      // 2. 同步 Context
      dispatch({
        type: 'ADD_NODE',
        payload: {
          studentId: state.currentStudentId,
          node: newNode as any, // 轉型適配
        },
      });
    },
    [reactFlowInstance, setNodes, dispatch, state.currentStudentId]
  );

  // ==================== AI 功能 ====================

  const handleManualAI = async () => {
    if (!state.currentStudentId) return;

    // 假裝取得記錄（真實情況應從 Context 或 API 獲取）
    const dummyRecord = state.learningRecords.get(state.currentStudentId);
    if (!dummyRecord) {
      alert("請先選擇有記錄的學生");
      return;
    }

    dispatch({ type: 'SET_GENERATING', payload: true });
    try {
      const { nodes: newNodes, edges: newEdges } = await analyzeStudentAndGeneratePath(dummyRecord);

      // 1. 先計算 Layout (確保寫入 Context 的是有座標的)
      // 注意：這裡我們需要載入目前的節點一起排版，還是只排新的？
      // 策略：將新節點加入現有節點後，做全域排版
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        [...nodes, ...newNodes],
        [...edges, ...newEdges]
      );

      // 2. 將排版後的結果「取代」或是「更新」回 Context
      // 因為我們做了全域排版，所以所有節點位置都可能變動
      // 這邊我們需要一個 Batch Update 或者逐一更新
      // 簡單作法：先加入新節點，再更新所有節點位置 (較多 Action)
      // 優化作法：直接更新 Local State (讓使用者看到)，然後非同步寫入 Context (保存)

      // 這裡採用：寫入 Context 為主，讓 useEffect 同步回來 (維持單一數據源原則)
      // 但因為我們改變了舊節點位置，需要發送 UPDATE_NODE_POSITION * N + ADD_NODE * M
      // 為了簡化，我們發送 ADD_NODE 給新的，並期待 Context 接受帶有座標的 Node

      // 找出哪些是新節點 (在新排版結果中，ID 存在於 newNodes 的)
      const newNodesSet = new Set(newNodes.map(n => n.id));

      // 分兩步：
      // A. 新增節點 (帶有排版後的座標)
      layoutedNodes.filter(n => newNodesSet.has(n.id)).forEach(n => {
        dispatch({ type: 'ADD_NODE', payload: { studentId: state.currentStudentId!, node: n as any } });
      });
      newEdges.forEach(e => dispatch({ type: 'ADD_EDGE', payload: { studentId: state.currentStudentId!, edge: e } }));

      // B. 更新舊節點位置 (如果有變動)
      layoutedNodes.filter(n => !newNodesSet.has(n.id)).forEach(n => {
        dispatch({
          type: 'UPDATE_NODE_POSITION',
          payload: { studentId: state.currentStudentId!, nodeId: n.id, position: n.position }
        });
      });
      // C. 立即更新 Local State 以確保 UI 即時反應 (不用等 Context Round-trip)
      setNodes(layoutedNodes);
      setEdges(newEdges); // 注意：這裡 edges 應該是用包含了新舊的 edges 還是? 
      // analyzeStudentAndGeneratePath 回傳的是完整的 newEdges 嗎? 
      // 不，是 "新的 edge"。
      // 我們應該使用 layoutedEdges (如果包含全部) 或 [...edges, ...newEdges]

      // 因為 getLayoutedElements 剛才傳入的是 [...nodes, ...newNodes] 和 [...edges, ...newEdges]
      // 所以 layoutedEdges 應該包含全部邊
      setEdges(layoutedEdges);

    } catch (error) {
      console.error("AI Generation Error:", error);
      alert(`AI 生成失敗: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      dispatch({ type: 'SET_GENERATING', payload: false });
    }
  };

  // ==================== Render ====================

  return (
    <div className="flex h-full w-full">
      {/* 左側元件庫 */}
      <NodePalette />

      {/* 右側畫布 */}
      <div className="flex-1 relative h-full bg-gray-50" ref={wrapperRef}>
        {currentPath ? (
          <>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChangeHandler}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeDragStop={onNodeDragStop}
              onNodeClick={onNodeClick} // [NEW]
              onDragOver={onDragOver}
              onDrop={onDrop}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              minZoom={0.2}
              maxZoom={2}
            >
              <Background color="#e5e7eb" gap={16} />
              <Controls />
              <MiniMap
                nodeColor={(node) => node.data.status === 'completed' ? '#10b981' : '#e5e7eb'}
                maskColor="rgba(0, 0, 0, 0.1)"
              />

              {/* 工具列 */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <div className="bg-white p-2 rounded-lg shadow-md border border-gray-200 flex flex-col gap-1">
                  <span className="text-xs font-bold text-gray-500 px-2">ACTIONS</span>

                  <button
                    onClick={handleManualAI}
                    disabled={state.isGenerating}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 transition-colors disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    {state.isGenerating ? '生成中...' : 'AI 推薦路徑'}
                  </button>

                  <button
                    onClick={() => {
                      const { nodes: lNodes, edges: lEdges } = getLayoutedElements(nodes, edges);
                      setNodes(lNodes);
                      setEdges(lEdges);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    自動排版
                  </button>

                  <div className="h-px bg-gray-200 my-1" />

                  <button
                    onClick={() => {
                      setNodes([]);
                      setEdges([]);
                      // 同步清除 Context 邏輯待補
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-transparent rounded hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    清空畫布
                  </button>
                </div>
              </div>
            </ReactFlow>

            {/* 節點編輯 Modal [NEW] */}
            <NodeDetailModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              node={selectedNode}
              onSave={handleSaveNode}
              onDelete={handleDeleteNode}
            />
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-400">請先選擇學生以開始編輯</p>
          </div>
        )}
      </div>
    </div>
  );
};

// 匯出主要組件，包裹 Provider
export function WorkflowEditor() {
  return (
    <ReactFlowProvider>
      <FlowEditorInternal />
    </ReactFlowProvider>
  );
}
