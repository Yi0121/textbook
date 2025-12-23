/**
 * LessonPrepPage - 備課頁面
 * 
 * 整合學習路徑編輯器作為備課工作台
 */

import { useEffect } from 'react';
import { Edit3, BookOpen, GitBranch } from 'lucide-react';
import { WorkflowEditor } from '../components/features/learning-path/WorkflowEditor';
import { useLearningPath } from '../context/LearningPathContext';

// 全班共用的路徑 ID
const CLASS_PATH_ID = 'class-default';

export default function LessonPrepPage() {
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
        <div className="h-full bg-gray-50 dark:bg-gray-900 flex flex-col">
            {/* 頁面標題 */}
            <div className="px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <Edit3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                            📝 備課工作台
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            設計與編排課程學習路徑
                        </p>
                    </div>
                </div>
            </div>

            {/* 工作台區域 */}
            <div className="flex-1 p-6 overflow-hidden">
                <div className="h-full">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 h-full flex flex-col overflow-hidden">
                        {/* 頂部資訊列 */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                                    <GitBranch className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-800 dark:text-white">AI 學習路徑編輯器</h2>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        設計全班共用的學習流程，之後可個別指派給學生
                                    </p>
                                </div>
                            </div>

                            {/* 路徑統計 */}
                            {currentPath && (
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                        <BookOpen className="w-4 h-4" />
                                        <span>{currentPath.nodes.length} 個節點</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                        <span>{currentPath.edges.length} 條連線</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 編輯器區域 */}
                        <div className="flex-1 min-h-0 overflow-hidden">
                            <WorkflowEditor />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
