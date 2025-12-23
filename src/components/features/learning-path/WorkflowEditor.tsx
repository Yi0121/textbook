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
import { Trash2, RotateCcw, Undo2, Redo2, Save, GitBranch } from 'lucide-react';
import { ChapterNode } from './nodes/ChapterNode';
import { ExerciseNode } from './nodes/ExerciseNode';
import { QuizNode } from './nodes/QuizNode';
import { AITutorNode } from './nodes/AITutorNode';
import { VideoNode } from './nodes/VideoNode';
import { CollaborationNode } from './nodes/CollaborationNode';
// Agent 節點
import { AIDiagnosisNode } from './nodes/AIDiagnosisNode';
import { AdaptiveExerciseNode } from './nodes/AdaptiveExerciseNode';
import { LearningAnalyticsNode } from './nodes/LearningAnalyticsNode';
import { AIGroupingNode } from './nodes/AIGroupingNode';

import { useLearningPathStore } from '../../../stores';
import { generateLessonPrepWorkflow } from '../../../services/ai/learningPathService';
import { getLayoutedElements } from '../../../utils/layout';
import { savePath } from '../../../utils/learningPathStorage';
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
  // Agent 節點
  ai_diagnosis: AIDiagnosisNode,
  adaptive_exercise: AdaptiveExerciseNode,
  learning_analytics: LearningAnalyticsNode,
  ai_grouping: AIGroupingNode,
};

// 註冊自定義邊類型
const edgeTypes = {
  optional: OptionalEdge,
  conditional: ConditionalEdge,
};

// 內部組件：封裝 React Flow 邏輯以便使用 useReactFlow hook
const FlowEditorInternal = () => {
  // Zustand Store
  const {
    currentStudentId,
    studentPaths,
    isGenerating,
    addNode,
    updateNode,
    deleteNode,
    addEdge: storeAddEdge,
    updateNodePosition,
    setGenerating,
  } = useLearningPathStore();

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
    if (!currentStudentId) return;

    // 1. 更新 React Flow Local State
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data: { ...node.data, ...updates } };
        }
        return node;
      })
    );

    // 2. 同步回 Store
    updateNode(currentStudentId, nodeId, { data: updates as any });
  };

  // 刪除節點 [NEW]
  const handleDeleteNode = (nodeId: string) => {
    if (!currentStudentId) return;

    // 0. 先記錄歷史
    saveToHistory();

    // 1. 更新 UI
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));

    // 2. 同步 Store
    deleteNode(currentStudentId, nodeId);
  };

  // 使用 Ref 追蹤當前學生 ID
  const currentStudentIdRef = useRef<string | null>(null);

  // 取得當前學生的學習路徑
  const currentPath = currentStudentId
    ? studentPaths.get(currentStudentId)
    : null;

  // React Flow 內部狀態
  const [nodes, setNodes] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // ==================== Undo/Redo 歷史記錄 ====================
  interface HistoryEntry {
    nodes: Node[];
    edges: Edge[];
  }

  const historyRef = useRef<HistoryEntry[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const isUndoRedoRef = useRef<boolean>(false);

  // 儲存當前狀態到歷史記錄
  const saveToHistory = useCallback(() => {
    if (isUndoRedoRef.current) return;

    // 如果在歷史中間進行了新操作，刪除後面的記錄
    if (historyIndexRef.current < historyRef.current.length - 1) {
      historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    }

    historyRef.current.push({
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    });

    // 限制歷史記錄大小（最多 30 步）
    if (historyRef.current.length > 30) {
      historyRef.current.shift();
    } else {
      historyIndexRef.current++;
    }
    console.log(`📝 歷史記錄 (${historyIndexRef.current + 1}/${historyRef.current.length})`);
  }, [nodes, edges]);

  // 復原 (Undo)
  const handleUndo = useCallback(() => {
    if (historyIndexRef.current <= 0) {
      console.log('無法復原：已到最早記錄');
      return;
    }

    isUndoRedoRef.current = true;
    historyIndexRef.current--;

    const entry = historyRef.current[historyIndexRef.current];
    // 使用展開運算符創建新陣列，確保 React Flow 偵測到變化
    setNodes([...entry.nodes]);
    setEdges([...entry.edges]);

    console.log(`✓ 復原成功 (${historyIndexRef.current + 1}/${historyRef.current.length})`);

    setTimeout(() => {
      isUndoRedoRef.current = false;
    }, 100);
  }, [setNodes, setEdges]);

  // 重做 (Redo)
  const handleRedo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) {
      console.log('無法重做：已到最新記錄');
      return;
    }

    isUndoRedoRef.current = true;
    historyIndexRef.current++;

    const entry = historyRef.current[historyIndexRef.current];
    // 使用展開運算符創建新陣列，確保 React Flow 偵測到變化
    setNodes([...entry.nodes]);
    setEdges([...entry.edges]);

    console.log(`✓ 重做成功 (${historyIndexRef.current + 1}/${historyRef.current.length})`);

    setTimeout(() => {
      isUndoRedoRef.current = false;
    }, 100);
  }, [setNodes, setEdges]);

  // ==================== 鍵盤快捷鍵 ====================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 檢查是否在輸入框內，若是則不處理快捷鍵
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlOrMeta = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl+Z / Cmd+Z → Undo
      if (ctrlOrMeta && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Ctrl+Y / Cmd+Y 或 Ctrl+Shift+Z → Redo
      if (ctrlOrMeta && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Ctrl+S / Cmd+S → Save
      if (ctrlOrMeta && e.key === 's') {
        e.preventDefault();
        if (currentPath) {
          savePath(currentPath);
          console.log('✓ 快捷鍵儲存成功 (Ctrl+S)');
        }
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, currentPath]);

  // ==================== 自動儲存 (Debounce) ====================
  const autoSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastAutoSavedRef = useRef<string>('');

  useEffect(() => {
    if (!currentPath || nodes.length === 0) return;

    // 計算當前狀態的 hash（簡化版：使用 JSON 字串）
    const currentStateHash = JSON.stringify({ nodes, edges });

    // 若狀態沒變，不觸發自動儲存
    if (currentStateHash === lastAutoSavedRef.current) return;

    // 清除之前的 timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // 設定 2 秒 debounce
    autoSaveTimeoutRef.current = setTimeout(() => {
      savePath(currentPath);
      lastAutoSavedRef.current = currentStateHash;
      console.log('💾 自動儲存完成');
    }, 2000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [nodes, edges, currentPath]);

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
    if (currentStudentId !== currentStudentIdRef.current) {
      setNodes(currentPath.nodes);
      setEdges(currentPath.edges);
      currentStudentIdRef.current = currentStudentId;
      lastSyncedRef.current = currentPath.lastModified;
      setTimeout(() => reactFlowInstance.fitView({ padding: 0.2 }), 100);
      return;
    }

    // 2. 外部更新（如 AI 生成）導致的變更：同步回 Local State
    // 若 Context 的最後修改時間比我們上次同步的時間新，則更新
    // 但如果正在進行 Undo/Redo，則跳過同步
    if (currentPath.lastModified > lastSyncedRef.current && !isUndoRedoRef.current) {
      setNodes(currentPath.nodes);
      setEdges(currentPath.edges);
      lastSyncedRef.current = currentPath.lastModified;
    }
  }, [currentPath, currentStudentId, setNodes, setEdges, reactFlowInstance]);

  // ==================== 事件處理 ====================

  const onNodesChangeHandler = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  // 拖曳開始時先儲存狀態
  const onNodeDragStart = useCallback(
    () => {
      saveToHistory(); // 拖曳前先記錄
    },
    [saveToHistory]
  );

  // 拖曳結束同步位置
  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (!currentStudentId) return;
      updateNodePosition(currentStudentId, node.id, node.position);
    },
    [currentStudentId, updateNodePosition]
  );

  // 連接建立
  const onConnect = useCallback(
    (connection: Connection) => {
      if (!currentStudentId) return;
      saveToHistory(); // 連接前先記錄
      setEdges((eds) => addEdge(connection, eds));
      storeAddEdge(currentStudentId, {
        id: `e${connection.source}-${connection.target}`,
        source: connection.source!,
        target: connection.target!,
        type: 'default',
      });
    },
    [setEdges, currentStudentId, saveToHistory, storeAddEdge]
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
      if (!type || !currentStudentId) return;

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

      // 2. 同步 Store
      addNode(currentStudentId, newNode as any);
    },
    [reactFlowInstance, setNodes, addNode, currentStudentId]
  );

  // ==================== 備課流程 ====================

  const handleLessonPrepWorkflow = async () => {
    if (!currentStudentId) return;

    saveToHistory();
    setGenerating(true);

    try {
      const { nodes: newNodes, edges: newEdges } = await generateLessonPrepWorkflow();

      // 清空現有節點
      const path = studentPaths.get(currentStudentId);
      if (path) {
        path.nodes.forEach(node => {
          deleteNode(currentStudentId, node.id);
        });
      }

      // 新增節點
      newNodes.forEach(n => {
        addNode(currentStudentId, n as any);
      });
      newEdges.forEach(e => storeAddEdge(currentStudentId, e as any));

      // 更新 Local State
      setNodes(newNodes as any);
      setEdges(newEdges as any);

      setTimeout(() => saveToHistory(), 200);
    } catch (error) {
      console.error("Lesson Prep Workflow Error:", error);
      alert(`備課流程生成失敗: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setGenerating(false);
    }
  };

  // ==================== Render ====================

  return (
    <div className="flex h-full w-full">

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
              onNodeDragStart={onNodeDragStart}
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
              <Controls position="bottom-left" />
              <MiniMap
                nodeColor={(node) => node.data.status === 'completed' ? '#10b981' : '#e5e7eb'}
                maskColor="rgba(0, 0, 0, 0.1)"
              />

              {/* 頂部工具列 - 水平排版 */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <div className="bg-white px-3 py-2 rounded-lg shadow-md border border-gray-200 flex items-center gap-2">
                  <button
                    onClick={handleLessonPrepWorkflow}
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-purple-600 rounded hover:bg-purple-700 transition-colors disabled:opacity-50"
                  >
                    <GitBranch className="w-4 h-4" />
                    {isGenerating ? '生成中...' : '備課流程'}
                  </button>

                  <div className="w-px h-6 bg-gray-200" />

                  <button
                    onClick={() => {
                      const { nodes: lNodes, edges: lEdges } = getLayoutedElements(nodes, edges);
                      setNodes(lNodes);
                      setEdges(lEdges);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                    title="自動排版"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <div className="w-px h-6 bg-gray-200" />

                  <button
                    onClick={() => handleUndo()}
                    className="flex items-center gap-1 px-2 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                    title="復原 (Ctrl+Z)"
                  >
                    <Undo2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRedo()}
                    className="flex items-center gap-1 px-2 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                    title="重做 (Ctrl+Y)"
                  >
                    <Redo2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (currentPath) {
                        savePath(currentPath);
                        alert('已儲存到瀏覽器 LocalStorage！');
                      }
                    }}
                    className="flex items-center gap-1 px-2 py-1.5 text-sm font-medium text-green-600 bg-white border border-gray-200 rounded hover:bg-green-50 transition-colors"
                    title="儲存 (Ctrl+S)"
                  >
                    <Save className="w-4 h-4" />
                  </button>

                  <div className="w-px h-6 bg-gray-200" />

                  <button
                    onClick={() => {
                      if (!currentStudentId) return;
                      setNodes([]);
                      setEdges([]);
                      const path = studentPaths.get(currentStudentId);
                      if (path) {
                        path.nodes.forEach(node => {
                          deleteNode(currentStudentId, node.id);
                        });
                      }
                      lastSyncedRef.current = Date.now();
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-red-600 bg-white border border-gray-200 rounded hover:bg-red-50 transition-colors"
                    title="清空畫布"
                  >
                    <Trash2 className="w-4 h-4" />
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
