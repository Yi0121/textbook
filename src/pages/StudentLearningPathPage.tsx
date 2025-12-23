/**
 * StudentLearningPathPage - 學生學習路徑頁面
 * 
 * 學生視角：
 * - 看得到：任務、學習內容、進度
 * - 看不到：Agent、Tools、教學設計細節
 */

// import { useParams } from 'react-router-dom';
import { BookOpen, CheckCircle, Lock, PlayCircle, Clock, Award } from 'lucide-react';
import { MOCK_GENERATED_LESSON } from '../types/lessonPlan';
import { MOCK_STUDENT_PROGRESS } from '../types/studentProgress';
import type { LessonNode } from '../types/lessonPlan';
import type { NodeProgress } from '../types/studentProgress';

export default function StudentLearningPathPage() {
    // TODO: 將來從 URL 讀取 lessonId
    // const { lessonId } = useParams<{ lessonId: string }>();

    // TODO: 從 API 或 localStorage 讀取，這裡用 mock data
    const lesson = MOCK_GENERATED_LESSON;
    const studentProgress = MOCK_STUDENT_PROGRESS[0]; // 模擬當前學生是張小明

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

    const formatTime = (seconds?: number) => {
        if (!seconds) return '-';
        const mins = Math.floor(seconds / 60);
        return `${mins} 分鐘`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* 頭部 */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
                            <p className="text-gray-600">你的學習進度：{studentProgress.overallProgress}%</p>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold text-indigo-600">{studentProgress.overallProgress}%</div>
                            <div className="text-sm text-gray-500">整體完成度</div>
                        </div>
                    </div>

                    {/* 進度條 */}
                    <div className="mt-4 h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                            style={{ width: `${studentProgress.overallProgress}%` }}
                        />
                    </div>
                </div>

                {/* 學習路徑卡片 */}
                <div className="space-y-4">
                    {lesson.nodes
                        .filter(node => !node.id.includes('补强')) // 隱藏補強節點（學生不需要先看到）
                        .map((node) => {
                            const status = getNodeStatus(node);
                            const progress = getNodeProgress(node.id);
                            const isCheckpoint = node.isConditional;

                            return (
                                <div
                                    key={node.id}
                                    className={`bg-white rounded-xl shadow-md p-6 border-2 transition-all ${status === 'completed'
                                        ? 'border-green-300 opacity-90'
                                        : status === 'current'
                                            ? 'border-indigo-500 shadow-lg scale-[1.02]'
                                            : 'border-gray-200 opacity-60'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* 狀態圖標 */}
                                        <div className="flex-shrink-0">
                                            {status === 'completed' && (
                                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                                    <CheckCircle className="w-7 h-7 text-green-600" />
                                                </div>
                                            )}
                                            {status === 'current' && (
                                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center animate-pulse">
                                                    <PlayCircle className="w-7 h-7 text-indigo-600" />
                                                </div>
                                            )}
                                            {status === 'locked' && (
                                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <Lock className="w-7 h-7 text-gray-400" />
                                                </div>
                                            )}
                                        </div>

                                        {/* 內容 */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h2 className="text-xl font-bold text-gray-900">{node.title}</h2>
                                                {isCheckpoint && (
                                                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                                                        檢查點
                                                    </span>
                                                )}
                                            </div>

                                            {/* 學習內容 - 不顯示 Agent/Tools */}
                                            {node.generatedContent && (
                                                <div className="space-y-2 mb-3">
                                                    {node.generatedContent.materials && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <BookOpen className="w-4 h-4" />
                                                            <span>{node.generatedContent.materials.join(', ')}</span>
                                                        </div>
                                                    )}
                                                    {node.generatedContent.exercises && (
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Award className="w-4 h-4" />
                                                            <span>練習題 {node.generatedContent.exercises} 題</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* 進度資訊 */}
                                            {progress && (
                                                <div className="flex items-center gap-4 text-sm">
                                                    {progress.score !== undefined && (
                                                        <div className="flex items-center gap-1">
                                                            <Award className="w-4 h-4 text-yellow-500" />
                                                            <span className="font-medium">{progress.score} 分</span>
                                                        </div>
                                                    )}
                                                    {progress.timeSpent && (
                                                        <div className="flex items-center gap-1 text-gray-500">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{formatTime(progress.timeSpent)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* 行動按鈕 */}
                                            {status === 'current' && (
                                                <button className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                                                    繼續學習
                                                </button>
                                            )}
                                            {status === 'completed' && (
                                                <button className="mt-4 px-6 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                                                    複習
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </div>

                {/* 補強提示（如果學生正在補強路徑上）*/}
                {studentProgress.currentNodeId === 'node-2-补强' && (
                    <div className="mt-6 bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-orange-900 mb-2">💪 加強練習</h3>
                                <p className="text-orange-700 mb-3">
                                    別擔心！我們準備了額外的練習來幫助你更好地理解這個概念。
                                </p>
                                <div className="bg-white rounded-lg p-4 border border-orange-200">
                                    <h4 className="font-medium text-gray-900 mb-2">基礎運算補強</h4>
                                    <p className="text-sm text-gray-600 mb-3">
                                        互動式引導對話 • 5 題練習 • 概念重建
                                    </p>
                                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors">
                                        開始補強練習
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
