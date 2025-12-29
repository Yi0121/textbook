/**
 * StudentDetailProgressPage - 教師端查看個別學生詳情
 * 
 * 增強版功能：
 * - 闘關式學習路徑視覺化
 * - 成就徽章展示
 * - 學習時間軸
 * - 詳細節點數據
 */

import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Award, CheckCircle, Lock, TrendingUp, Zap, Star, Target, BookOpen } from 'lucide-react';
import { MOCK_DIFFERENTIATED_LESSON, type LessonNode } from '../types/lessonPlan';
import { MOCK_DIFFERENTIATED_STUDENT_PROGRESS } from '../types/studentProgress';
import { getNodeProgress, formatTimeMMSS } from '../utils/progressHelpers';

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

    return (
        <div className="relative overflow-x-auto pb-4">
            <div className="flex items-center gap-2 min-w-max px-4 py-6">
                {nodes.filter(n => !n.branchLevel || n.branchLevel !== 'remedial').filter(n => !n.id.startsWith('step2-') || n.id === 'step2-video').map((node, idx, arr) => {
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

export default function StudentDetailProgressPage() {
    const { lessonId, studentId } = useParams<{ lessonId: string; studentId: string }>();
    const navigate = useNavigate();

    const lesson = MOCK_DIFFERENTIATED_LESSON;
    const student = MOCK_DIFFERENTIATED_STUDENT_PROGRESS.find(s => s.studentId === studentId);

    if (!student) {
        return <div className="p-6 text-center text-gray-500">學生資料未找到</div>;
    }



    const formatDate = (date?: Date) => {
        if (!date) return '-';
        return new Date(date).toLocaleString('zh-TW', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

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

                {/* 節點詳細列表 */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-purple-600" />
                        節點詳情
                    </h2>

                    <div className="space-y-3">
                        {(lesson.nodes || []).map((node) => {
                            const progress = student.nodeProgress.find(np => np.nodeId === node.id);
                            const isCompleted = progress?.completed;
                            const isCurrent = node.id === student.currentNodeId;

                            return (
                                <div
                                    key={node.id}
                                    className={`flex items-center gap-4 p-4 rounded-xl border-2 ${isCompleted ? 'border-green-200 bg-green-50' :
                                        isCurrent ? 'border-blue-300 bg-blue-50' :
                                            'border-gray-100 bg-gray-50'
                                        }`}
                                >
                                    {/* 狀態圖標 */}
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-green-500 text-white' :
                                        isCurrent ? 'bg-blue-500 text-white' :
                                            'bg-gray-200 text-gray-400'
                                        }`}>
                                        {isCompleted ? <CheckCircle className="w-5 h-5" /> :
                                            isCurrent ? <Zap className="w-5 h-5" /> :
                                                <Lock className="w-4 h-4" />}
                                    </div>

                                    {/* 節點資訊 */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900">{node.title}</span>
                                            {node.isConditional && (
                                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">檢查點</span>
                                            )}
                                        </div>
                                        {progress && (
                                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                                {progress.score !== undefined && (
                                                    <span className="flex items-center gap-1">
                                                        <Award className="w-3 h-3 text-yellow-500" />
                                                        {progress.score}分
                                                    </span>
                                                )}
                                                {progress.timeSpent && (
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3 text-blue-500" />
                                                        {formatTimeMMSS(progress.timeSpent)}
                                                    </span>
                                                )}
                                                {progress.retryCount !== undefined && progress.retryCount > 0 && (
                                                    <span className="flex items-center gap-1">
                                                        <TrendingUp className="w-3 h-3 text-purple-500" />
                                                        {progress.retryCount}次重試
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* 右側資訊 */}
                                    <div className="text-right flex-shrink-0">
                                        {progress?.pathTaken && (
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${progress.pathTaken === 'learned' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                {progress.pathTaken === 'learned' ? '✓ 學會' : '↻ 補強'}
                                            </span>
                                        )}
                                        {progress?.completedAt && (
                                            <div className="text-xs text-gray-400 mt-1">{formatDate(progress.completedAt)}</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
