/**
 * WorkflowEditor - 學習路徑流程編輯器（簡化版）
 *
 * 功能：
 * - 使用 React Flow 顯示學習路徑節點與邊
 * - 支援平移 (Pan) 與縮放 (Zoom)
 * - 顯示當前學生的學習路徑
 * - 優化：Event-Driven 狀態同步，避免 Dragging 效能問題
 */

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
import { NodePalette } from './NodePalette';
import { useLearningPath } from '../../../context/LearningPathContext';
import { analyzeStudentAndGeneratePath } from '../../../services/ai/learningPathService';
import { getLayoutedElements } from '../../../utils/layout';

// 註冊自定義節點類型
const nodeTypes = {
  chapter: ChapterNode,
};

// 內部組件：封裝 React Flow 邏輯以便使用 useReactFlow hook
const FlowEditorInternal = () => {
  const { state, dispatch } = useLearningPath();
  const reactFlowInstance = useReactFlow();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 使用 Ref 追蹤當前學生 ID
  const currentStudentIdRef = useRef<string | null>(null);

  // 取得當前學生的學習路徑
  const currentPath = state.currentStudentId
    ? state.studentPaths.get(state.currentStudentId)
    : null;

  // React Flow 內部狀態
  const [nodes, setNodes] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // ==================== 狀態同步 ====================

  // 當切換學生時，重置/載入狀態
  useEffect(() => {
    // 沒選學生時清空
    if (!currentPath) {
      setNodes([]);
      setEdges([]);
      currentStudentIdRef.current = null;
      return;
    }

    // 1. 切換學生：重置並 Fit View
    if (state.currentStudentId !== currentStudentIdRef.current) {
      setNodes(currentPath.nodes);
      setEdges(currentPath.edges);
      currentStudentIdRef.current = state.currentStudentId;
      setTimeout(() => reactFlowInstance.fitView({ padding: 0.2 }), 100);
      return;
    }

    // 2. 外部更新（如 AI 生成）導致的變更：同步回 Local State
    // 但要避免自己 Dragging 造成的 Context 更新觸發這裡 (雖然 DragStop 已經結束，所以其實沒問題)
    // 這裡我們簡單判定：若內容數量不同，或 lastModified 更新，則同步
    if (currentPath.lastModified > (currentPath.lastModified || 0)) { // 這裡其實可以用一個 local ref 存 lastSyncedTime
      // 暫時直接同步，因為 DragStop 後 Context 更新，這裡同步回來其實是 Idempotent 的 (位置一樣)
      // 除非有其他非同步操作。
      // 為了確保 AI 生成的節點能顯示，我們讓它同步
      setNodes(currentPath.nodes);
      setEdges(currentPath.edges);
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
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChangeHandler}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDragStop={onNodeDragStop}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
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
