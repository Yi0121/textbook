/**
 * TeacherStudentOverviewPage - 教師端查看個別學生詳情
 * 
 * 增強版功能：
 * - 闘關式學習路徑視覺化
 * - 成就徽章展示
 * - 學習時間軸
 * - 詳細節點數據
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Award, CheckCircle, Lock, TrendingUp, Zap, Star, Target, BookOpen } from 'lucide-react';
import { MOCK_DIFFERENTIATED_LESSON, MOCK_DIFFERENTIATED_STUDENT_PROGRESS } from '../mocks';
import type { LessonNode } from '../types/lessonPlan';
import { getNodeProgress } from '../utils/progressHelpers';


// 闘關式學習路徑組件（教師視角）
function QuestPathView({
    nodes,
    studentProgress,
    currentNodeId
}: {
    nodes: LessonNode[];
    studentProgress: typeof MOCK_DIFFERENTIATED_STUDENT_PROGRESS[0]['nodeProgress'];
    currentNodeId: string;
}) {
    const getProgress = (nodeId: string) => getNodeProgress(studentProgress, nodeId);

    // 找出學生實際選擇的 step2 選項（三選一）
    const completedStep2Ids = ['step2-video', 'step2-game', 'step2-reading'].filter(id =>
        studentProgress.some(np => np.nodeId === id)
    );
    const selectedStep2Id = completedStep2Ids.length > 0 ? completedStep2Ids[0] : 'step2-video';

    return (
        <div className="relative overflow-x-auto pb-4">
            <div className="flex items-center gap-2 min-w-max px-4 py-6">
                {nodes.filter(n => !n.branchLevel || n.branchLevel !== 'remedial').filter(n => !n.id.startsWith('step2-') || n.id === selectedStep2Id).map((node, idx, arr) => {
                    const progress = getProgress(node.id);
                    const isCompleted = progress?.completed;
                    const isCurrent = node.id === currentNodeId;
                    const isLocked = !isCompleted && !isCurrent;
                    const isLast = idx === arr.length - 1;

                    return (
                        <div key={node.id} className="flex items-center">
                            {/* 節點 */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`relative w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all ${isCompleted ? 'bg-green-500 border-green-600 shadow-lg shadow-green-200' :
                                        isCurrent ? 'bg-blue-500 border-blue-600 animate-pulse shadow-lg shadow-blue-200' :
                                            'bg-gray-200 border-gray-300'
                                        }`}
                                >
                                    {isCompleted && <CheckCircle className="w-8 h-8 text-white" />}
                                    {isCurrent && <Zap className="w-8 h-8 text-white" />}
                                    {isLocked && <Lock className="w-6 h-6 text-gray-400" />}

                                    {/* 分數徽章 */}
                                    {progress?.score !== undefined && (
                                        <div className="absolute -top-2 -right-2 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold text-yellow-900 border-2 border-white shadow">
                                            {progress.score}
                                        </div>
                                    )}

                                    {/* 檢查點標記 */}
                                    {node.isConditional && (
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                                            ✓
                                        </div>
                                    )}
                                </div>

                                {/* 節點名稱 */}
                                <div className="mt-3 text-center max-w-[100px]">
                                    <div className={`text-xs font-medium ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>
                                        {node.title}
                                    </div>
                                    {progress?.pathTaken && (
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${progress.pathTaken === 'learned' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {progress.pathTaken === 'learned' ? '學會' : '補強'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* 連接線 */}
                            {!isLast && (
                                <div className={`w-12 h-1 mx-1 rounded transition-all ${isCompleted ? 'bg-green-400' : 'bg-gray-200'
                                    }`} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}


// 成就徽章組件
function AchievementBadges({ student, lesson }: {
    student: typeof MOCK_DIFFERENTIATED_STUDENT_PROGRESS[0];
    lesson: typeof MOCK_DIFFERENTIATED_LESSON;
}) {
    const completedCount = student.nodeProgress.filter(np => np.completed).length;
    const avgScore = student.nodeProgress.filter(np => np.score !== undefined).length > 0
        ? Math.round(student.nodeProgress.filter(np => np.score !== undefined).reduce((sum, np) => sum + (np.score || 0), 0) / student.nodeProgress.filter(np => np.score !== undefined).length)
        : 0;
    const totalTime = Math.floor(student.nodeProgress.reduce((sum, np) => sum + (np.timeSpent || 0), 0) / 60);

    const badges = [
        {
            icon: <Target className="w-6 h-6" />,
            label: '完成度',
            value: `${student.overallProgress}%`,
            color: student.overallProgress >= 80 ? 'from-green-400 to-emerald-500' : 'from-blue-400 to-indigo-500',
            earned: true
        },
        {
            icon: <CheckCircle className="w-6 h-6" />,
            label: '已完成節點',
            value: `${completedCount}/${(lesson.nodes || []).filter(n => !n.branchLevel || n.branchLevel !== 'remedial').length}`,
            color: 'from-purple-400 to-pink-500',
            earned: completedCount > 0
        },
        {
            icon: <Award className="w-6 h-6" />,
            label: '平均分數',
            value: avgScore ? `${avgScore}分` : '-',
            color: avgScore >= 80 ? 'from-yellow-400 to-orange-500' : 'from-gray-400 to-gray-500',
            earned: avgScore >= 60
        },
        {
            icon: <Clock className="w-6 h-6" />,
            label: '學習時間',
            value: `${totalTime}分鐘`,
            color: 'from-cyan-400 to-blue-500',
            earned: totalTime >= 5
        },
        {
            icon: <Star className="w-6 h-6" />,
            label: '努力獎章',
            value: student.nodeProgress.some(np => np.retryCount && np.retryCount > 0) ? '獲得' : '未獲得',
            color: 'from-amber-400 to-yellow-500',
            earned: student.nodeProgress.some(np => np.retryCount && np.retryCount > 0)
        },
    ];

    return (
        <div className="grid grid-cols-5 gap-3">
            {badges.map((badge, i) => (
                <div
                    key={i}
                    className={`text-center p-4 rounded-xl ${badge.earned ? `bg-gradient-to-br ${badge.color} text-white shadow-lg` : 'bg-gray-100 text-gray-400'}`}
                >
                    <div className={`mx-auto mb-2 ${badge.earned ? 'opacity-100' : 'opacity-40'}`}>
                        {badge.icon}
                    </div>
                    <div className="text-lg font-bold">{badge.value}</div>
                    <div className={`text-xs ${badge.earned ? 'opacity-90' : 'opacity-60'}`}>{badge.label}</div>
                </div>
            ))}
        </div>
    );
}

// AI 助手 Modal
function AIAssistantModal({
    isOpen,
    onClose,
    type,
    studentName
}: {
    isOpen: boolean;
    onClose: () => void;
    type: 'intervention' | 'parent-comm' | null;
    studentName: string
}) {
    if (!isOpen || !type) return null;

    const isIntervention = type === 'intervention';

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className={`p-6 border-b ${isIntervention ? 'bg-red-50 border-red-100' : 'bg-indigo-50 border-indigo-100'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isIntervention ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                            {isIntervention ? <Zap className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                        </div>
                        <div>
                            <h3 className={`text-xl font-bold ${isIntervention ? 'text-red-900' : 'text-indigo-900'}`}>
                                {isIntervention ? 'AI 個別化補救計畫' : '親師溝通助手'}
                            </h3>
                            <p className={`text-sm ${isIntervention ? 'text-red-700' : 'text-indigo-700'}`}>
                                對象：{studentName}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    {isIntervention ? (
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-red-500" />
                                    診斷結果
                                </h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    AI 分析顯示 {studentName} 在 <span className="font-bold text-red-600">移項法則</span> 的概念理解上有 3 次重複錯誤。建議立即進行針對性補救。
                                </p>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-700 mb-3">推薦補救內容 (AI 生成)</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer bg-white">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xs">影片</div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">3分鐘搞懂移項變號</div>
                                            <div className="text-xs text-gray-500">針對性概念解說</div>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded" />
                                    </div>
                                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer bg-white">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold text-xs">練習</div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">移項法則 - 基礎 5 題</div>
                                            <div className="text-xs text-gray-500">預計耗時 5 分鐘</div>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                <h4 className="font-bold text-indigo-900 mb-2">AI 撰寫草稿</h4>
                                <textarea
                                    className="w-full h-32 p-3 rounded-lg border-indigo-200 bg-white text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    defaultValue={`親愛的家長您好：\n\n這週我想特別表揚 ${studentName} 在課堂上的表現。雖然他在「移項法則」單元遇到了一些小挑戰，但他展現了非常棒的學習態度，主動完成了 3 次額外練習。\n\n我們已經為他準備了針對性的補救影片，若您在家有空，也可以陪他一起觀看。如有任何問題歡迎隨時聯繫！\n\n導師 敬上`}
                                />
                            </div>
                            <div className="flex gap-2 text-xs text-gray-500">
                                <span className="bg-gray-100 px-2 py-1 rounded">#學習態度佳</span>
                                <span className="bg-gray-100 px-2 py-1 rounded">#需要鼓勵</span>
                                <span className="bg-gray-100 px-2 py-1 rounded">#補救教學</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        取消
                    </button>
                    <button
                        onClick={onClose}
                        className={`px-6 py-2 text-white font-bold rounded-lg shadow-lg transition-all transform active:scale-95 ${isIntervention
                            ? 'bg-red-600 hover:bg-red-700 shadow-red-200'
                            : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                            }`}
                    >
                        {isIntervention ? '一鍵指派任務' : '發送訊息'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function TeacherStudentOverviewPage() {
    const { lessonId, studentId } = useParams<{ lessonId: string; studentId: string }>();
    const navigate = useNavigate();

    // Modal State
    const [activeModal, setActiveModal] = useState<'intervention' | 'parent-comm' | null>(null);

    const lesson = MOCK_DIFFERENTIATED_LESSON;
    const student = MOCK_DIFFERENTIATED_STUDENT_PROGRESS.find(s => s.studentId === studentId);

    if (!student) {
        return <div className="p-6 text-center text-gray-500">學生資料未找到</div>;
    }

    return (

        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
            <div className="max-w-6xl mx-auto">
                {/* 頭部 */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
                    <button
                        onClick={() => navigate(`/teacher/lesson-progress/${lessonId}`)}
                        className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        返回班級總覽
                    </button>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            {/* 大頭貼帶進度環 */}
                            <div className="relative">
                                <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                                    <circle r="16" cx="18" cy="18" fill="transparent" stroke="#e5e7eb" strokeWidth="3" />
                                    <circle
                                        r="16"
                                        cx="18"
                                        cy="18"
                                        fill="transparent"
                                        stroke={student.overallProgress >= 80 ? '#22c55e' : student.overallProgress >= 50 ? '#3b82f6' : '#f97316'}
                                        strokeWidth="3"
                                        strokeDasharray={`${student.overallProgress} ${100 - student.overallProgress}`}
                                        className="transition-all duration-700"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <span className="text-xl font-bold text-white">{student.studentName.charAt(0)}</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{student.studentName}</h1>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <BookOpen className="w-4 h-4" />
                                    <span>{lesson.title}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                {student.overallProgress}%
                            </div>
                            <div className="text-sm text-gray-500">整體完成度</div>
                        </div>
                    </div>
                </div>

                {/* AI 助手行動區塊 (NEW) */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <button
                        onClick={() => setActiveModal('intervention')}
                        className="bg-white p-5 rounded-2xl shadow-md border border-red-100 hover:border-red-300 hover:shadow-lg transition-all flex items-center gap-4 group"
                    >
                        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Zap className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-gray-900 text-lg group-hover:text-red-600 transition-colors">AI 補救計畫</h3>
                            <p className="text-sm text-gray-500">針對弱點單元自動生成練習</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setActiveModal('parent-comm')}
                        className="bg-white p-5 rounded-2xl shadow-md border border-indigo-100 hover:border-indigo-300 hover:shadow-lg transition-all flex items-center gap-4 group"
                    >
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <TrendingUp className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">親師溝通助手</h3>
                            <p className="text-sm text-gray-500">AI 撰寫學習狀況通知單</p>
                        </div>
                    </button>
                </div>

                <AIAssistantModal
                    isOpen={!!activeModal}
                    onClose={() => setActiveModal(null)}
                    type={activeModal}
                    studentName={student.studentName}
                />

                {/* 成就徽章 */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        學習成就
                    </h2>
                    <AchievementBadges student={student} lesson={lesson} />
                </div>

                {/* 闘關式學習路徑 */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        學習路徑進度
                    </h2>
                    <QuestPathView
                        nodes={lesson.nodes || []}
                        studentProgress={student.nodeProgress}
                        currentNodeId={student.currentNodeId}
                    />
                </div>

                {/* 查看更多詳情按鈕 */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <button
                        onClick={() => navigate(`/teacher/student-detail/${lessonId}/${studentId}`)}
                        className="w-full p-8 flex items-center justify-between hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Target className="w-7 h-7 text-white" />
                            </div>
                            <div className="text-left">
                                <h2 className="text-xl font-bold text-gray-900 mb-1">查看完整學習分析</h2>
                                <p className="text-sm text-gray-500">查看任務完成度、概念精熟度、解題效率等詳細數據</p>
                            </div>
                        </div>
                        <ArrowLeft className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-2 transition-all rotate-180" />
                    </button>
                </div>
            </div>
        </div>
    );
}
