import { useEffect } from 'react';
import { BookOpen, GitBranch } from 'lucide-react';
import { WorkflowEditor } from '../../student/learning-path/WorkflowEditor';
import { useLearningPath } from '../../../context/LearningPathContext';

// 全班共用的路徑 ID
const CLASS_PATH_ID = 'class-default';

export function LearningPathTab() {
  const { state, dispatch } = useLearningPath();

  // 初始化：確保有全班共用的路徑
  useEffect(() => {
    // 設定當前路徑為全班共用
    if (state.currentStudentId !== CLASS_PATH_ID) {
      dispatch({ type: 'SET_CURRENT_STUDENT', payload: CLASS_PATH_ID });
    }

    // 若無路徑則建立
    if (!state.studentPaths.has(CLASS_PATH_ID)) {
      dispatch({
        type: 'CREATE_PATH',
        payload: { studentId: CLASS_PATH_ID, studentName: '全班學習路徑' }
      });
    }
  }, [dispatch, state.currentStudentId, state.studentPaths]);

  const currentPath = state.studentPaths.get(CLASS_PATH_ID);

  return (
    <div className="flex h-full bg-white overflow-hidden">
      {/* 全螢幕編輯器 */}
      <div className="flex-1 relative flex flex-col bg-white">
        {/* 頂部資訊列 */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <GitBranch className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">AI 學習路徑編輯器</h2>
              <p className="text-xs text-gray-500">
                設計全班共用的學習流程，之後可個別指派給學生
              </p>
            </div>
          </div>

          {/* 路徑統計 */}
          {currentPath && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5 text-gray-600">
                <BookOpen className="w-4 h-4" />
                <span>{currentPath.nodes.length} 個節點</span>
              </div>
              <div className="flex items-center gap-1.5 text-gray-600">
                <span>{currentPath.edges.length} 條連線</span>
              </div>
            </div>
          )}
        </div>

        {/* 編輯器區域 - 確保填滿剩餘空間 */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <WorkflowEditor />
        </div>
      </div>
    </div>
  );
}
