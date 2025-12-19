import { useState, useCallback } from 'react';
import { Users, BookOpen, AlertCircle } from 'lucide-react';
import { WorkflowEditor } from '../learning-path/WorkflowEditor';
import { useLearningPath } from '../../../context/LearningPathContext';
import { MOCK_STUDENT_RECORDS } from '../../../mocks/learningPathMocks';
import type { StudentLearningRecord } from '../../../types';

export function LearningPathTab() {
  // 取得 Context
  const { state, dispatch } = useLearningPath();
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(state.currentStudentId);

  /**
   * 處理學生選擇
   * 1. 設定當前學生 ID
   * 2. 載入學習記錄 (供 AI 分析用)
   * 3. 若無路徑則建立空路徑
   */
  const handleStudentSelect = useCallback((studentId: string) => {
    // 透過姓名找 Mock 資料 (目前 Mock key 是姓名)
    // 實際專案應使用 ID map
    const record = Object.values(MOCK_STUDENT_RECORDS).find(r => r.studentId === studentId);

    if (!record) {
      console.error('找不到學生記錄', studentId);
      return;
    }

    setSelectedStudentId(studentId);

    // 1. 載入記錄
    dispatch({ type: 'LOAD_LEARNING_RECORD', payload: record });

    // 2. 設定當前學生
    dispatch({ type: 'SET_CURRENT_STUDENT', payload: studentId });

    // 3. 檢查是否有路徑，若無則建立
    if (!state.studentPaths.has(studentId)) {
      dispatch({
        type: 'CREATE_PATH',
        payload: { studentId: record.studentId, studentName: record.studentName }
      });
    }
  }, [dispatch, state.studentPaths]);

  const students = Object.values(MOCK_STUDENT_RECORDS);

  return (
    <div className="flex h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* 左側：學生列表 */}
      <div className="w-64 border-r border-gray-200 flex flex-col bg-gray-50">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            學生名單
          </h3>
          <p className="text-xs text-gray-500 mt-1">選擇學生以檢視學習路徑</p>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {students.map((student) => {
            const isActive = selectedStudentId === student.studentId;
            const path = state.studentPaths.get(student.studentId);
            const hasNodes = path && path.nodes.length > 0;

            return (
              <button
                key={student.studentId}
                onClick={() => handleStudentSelect(student.studentId)}
                className={`
                  w-full text-left p-3 rounded-lg border transition-all
                  hover:bg-indigo-50 hover:border-indigo-200
                  ${isActive
                    ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-200 shadow-sm'
                    : 'bg-white border-transparent border-b-gray-100'}
                `}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-medium ${isActive ? 'text-indigo-900' : 'text-gray-700'}`}>
                    {student.studentName}
                  </span>
                  {hasNodes && (
                    <span className="flex h-2 w-2 rounded-full bg-green-500" title="已有路徑" />
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                    {student.averageScore}分
                  </span>
                  {student.weakKnowledgeNodes.length > 0 && (
                    <span className="flex items-center text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                      <AlertCircle className="w-3 h-3 mr-0.5" />
                      {student.weakKnowledgeNodes.length} 項弱點
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 右側：編輯器 */}
      <div className="flex-1 relative flex flex-col bg-white">
        {selectedStudentId ? (
          <WorkflowEditor />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-50">
            <BookOpen className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">請從左側選擇一位學生</p>
            <p className="text-sm">查看或編輯其專屬學習路徑</p>
          </div>
        )}
      </div>
    </div>
  );
}
