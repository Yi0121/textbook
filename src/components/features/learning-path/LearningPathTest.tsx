/**
 * LearningPathTest - 測試 LearningPathContext 的簡單組件
 *
 * 功能：
 * - 顯示 Context 狀態
 * - 測試 AI 分析功能
 * - 測試節點新增/刪除
 */

import { useState } from 'react';
import { Sparkles, Plus, BookOpen } from 'lucide-react';
import { useLearningPath } from '../../../context/LearningPathContext';
import { MOCK_STUDENT_RECORDS } from '../../../mocks/learningPathMocks';
import { analyzeStudentAndGeneratePath } from '../../../services/ai/learningPathService';

export function LearningPathTest() {
  const { state, dispatch } = useLearningPath();
  const [selectedStudent, setSelectedStudent] = useState<string>('王小明');

  // 測試 AI 分析
  const handleAIAnalyze = async () => {
    const record = MOCK_STUDENT_RECORDS[selectedStudent];
    if (!record) return;

    dispatch({ type: 'SET_GENERATING', payload: true });
    dispatch({ type: 'LOAD_LEARNING_RECORD', payload: record });

    try {
      // AI 分析
      const { nodes, edges, recommendation } = await analyzeStudentAndGeneratePath(record);

      // 建立學習路徑
      dispatch({
        type: 'CREATE_PATH',
        payload: { studentId: record.studentId, studentName: record.studentName },
      });

      // 批次新增節點
      nodes.forEach((node) => {
        dispatch({
          type: 'ADD_NODE',
          payload: { studentId: record.studentId, node },
        });
      });

      // 批次新增邊
      edges.forEach((edge) => {
        dispatch({
          type: 'ADD_EDGE',
          payload: { studentId: record.studentId, edge },
        });
      });

      // 設定 AI 推薦
      dispatch({
        type: 'SET_AI_RECOMMENDATION',
        payload: { studentId: record.studentId, recommendation },
      });

      // 設定當前學生
      dispatch({ type: 'SET_CURRENT_STUDENT', payload: record.studentId });

      // 開啟編輯器 Modal
      dispatch({ type: 'OPEN_EDITOR', payload: record.studentId });
    } finally {
      dispatch({ type: 'SET_GENERATING', payload: false });
    }
  };

  // 測試新增單一節點
  const handleAddNode = () => {
    if (!state.currentStudentId) return;

    const newNode = {
      id: `test-node-${Date.now()}`,
      type: 'chapter' as const,
      position: { x: 100, y: 100 },
      data: {
        label: '測試章節節點',
        description: '手動新增的測試節點',
        isRequired: true,
      },
    };

    dispatch({
      type: 'ADD_NODE',
      payload: { studentId: state.currentStudentId, node: newNode },
    });
  };

  // 取得當前學習路徑
  const currentPath = state.currentStudentId
    ? state.studentPaths.get(state.currentStudentId)
    : null;

  const currentRecord = state.currentStudentId
    ? state.learningRecords.get(state.currentStudentId)
    : null;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto my-8">
      {/* 標題 */}
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-8 h-8 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800">
          學習路徑系統測試
        </h2>
      </div>

      {/* 學生選擇 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          選擇學生
        </label>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
        >
          <option value="王小明">王小明</option>
          <option value="陳小美">陳小美</option>
          <option value="林大華">林大華</option>
        </select>
      </div>

      {/* 操作按鈕 */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleAIAnalyze}
          disabled={state.isGenerating}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          {state.isGenerating ? 'AI 分析中...' : 'AI 分析路徑'}
        </button>

        <button
          onClick={handleAddNode}
          disabled={!state.currentStudentId}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4" />
          新增測試節點
        </button>
      </div>

      {/* Context 狀態顯示 */}
      <div className="space-y-4">
        {/* 當前學生記錄 */}
        {currentRecord && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-bold text-blue-800 mb-2">學生學習記錄</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>學生：{currentRecord.studentName}</div>
              <div>平均分數：{currentRecord.averageScore}</div>
              <div>正確率：{((currentRecord.correctCount / currentRecord.totalQuestions) * 100).toFixed(0)}%</div>
              <div>弱點數量：{currentRecord.weakKnowledgeNodes.length}</div>
            </div>
            <div className="mt-2">
              <div className="font-semibold text-sm text-blue-700">弱點知識節點：</div>
              <ul className="list-disc list-inside text-sm text-blue-600">
                {currentRecord.weakKnowledgeNodes.map((weak) => (
                  <li key={weak.nodeId}>
                    {weak.nodeName} (錯誤率 {(weak.errorRate * 100).toFixed(0)}%)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* AI 推薦摘要 */}
        {currentPath?.aiRecommendation && (
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="font-bold text-purple-800 mb-2">AI 推薦摘要</h3>
            <p className="text-sm text-purple-700 mb-2">
              {currentPath.aiRecommendation.summary}
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>預估時間：{currentPath.aiRecommendation.estimatedDuration} 分鐘</div>
              <div>難度：{currentPath.aiRecommendation.difficulty}</div>
            </div>
          </div>
        )}

        {/* 學習路徑狀態 */}
        {currentPath && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-bold text-green-800 mb-2">學習路徑資訊</h3>
            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>節點數量：{currentPath.nodes.length}</div>
              <div>邊數量：{currentPath.edges.length}</div>
              <div>已完成：{currentPath.progress.completedNodes}</div>
              <div>完成率：{((currentPath.progress.completedNodes / currentPath.progress.totalNodes) * 100).toFixed(0)}%</div>
            </div>

            {/* 節點列表 */}
            <div>
              <h4 className="font-semibold text-sm text-green-700 mb-2">節點列表：</h4>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {currentPath.nodes.map((node) => (
                  <div
                    key={node.id}
                    className="flex items-center justify-between p-2 bg-white rounded border border-green-200 text-sm"
                  >
                    <div>
                      <span className="font-medium">{node.data.label}</span>
                      {node.data.aiGenerated && (
                        <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded">
                          AI 推薦
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{node.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 全局狀態 */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-2">全局 Context 狀態</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>學習路徑總數：{state.studentPaths.size}</div>
            <div>學習記錄總數：{state.learningRecords.size}</div>
            <div>當前學生 ID：{state.currentStudentId || '無'}</div>
            <div>編輯器狀態：{state.isEditorOpen ? '開啟' : '關閉'}</div>
            <div>AI 生成中：{state.isGenerating ? '是' : '否'}</div>
            <div>節點模板數量：{state.nodeTemplates.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
