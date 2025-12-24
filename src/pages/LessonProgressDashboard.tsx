/**
 * LessonProgressDashboard - 教師端課程進度監控（班級總覽）
 * 
 * 增強版功能：
 * - 視覺化進度分布圖
 * - 學生進度熱力圖
 * - 條件分支圓餅圖視覺化
 * - 節點完成率視覺化
 */

import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, TrendingUp, CheckCircle, AlertTriangle, ArrowRight, Clock, Award, Target } from 'lucide-react';
import { MOCK_GENERATED_LESSON } from '../types/lessonPlan';
import { MOCK_STUDENT_PROGRESS } from '../types/studentProgress';

// 進度分布柱狀圖組件
function ProgressDistributionChart({ students }: { students: typeof MOCK_STUDENT_PROGRESS }) {
    const ranges = [
        { min: 0, max: 25, label: '0-25%', color: 'bg-red-400' },
        { min: 25, max: 50, label: '25-50%', color: 'bg-orange-400' },
        { min: 50, max: 75, label: '50-75%', color: 'bg-blue-400' },
        { min: 75, max: 100, label: '75-100%', color: 'bg-green-400' },
    ];

    const distribution = ranges.map(range => ({
        ...range,
        count: students.filter(s => s.overallProgress >= range.min && s.overallProgress < (range.max === 100 ? 101 : range.max)).length
    }));

    const maxCount = Math.max(...distribution.map(d => d.count), 1);

    return (
        <div className="flex items-end justify-around h-40 gap-4">
            {distribution.map((bar, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1">
                    <div className="text-sm font-bold text-gray-900 mb-1">{bar.count}</div>
                    <div
                        className={`w-full ${bar.color} rounded-t-lg transition-all duration-500`}
                        style={{ height: `${(bar.count / maxCount) * 100}%`, minHeight: bar.count > 0 ? '20px' : '4px' }}
                    />
                    <div className="text-xs text-gray-600 mt-2 text-center">{bar.label}</div>
                </div>
            ))}
        </div>
    );
}

// 圓餅圖組件
function PieChart({ data }: { data: { label: string; value: number; color: string }[] }) {
    const total = data.reduce((sum, d) => sum + d.value, 0);
    let cumulativePercent = 0;

    const segments = data.map(d => {
        const percent = total > 0 ? (d.value / total) * 100 : 0;
        const startAngle = cumulativePercent * 3.6;
        cumulativePercent += percent;
        return { ...d, percent, startAngle };
    });

    return (
        <div className="flex items-center gap-6">
            {/* SVG Pie */}
            <div className="relative w-32 h-32">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    {segments.map((seg, i) => {
                        const offset = segments.slice(0, i).reduce((sum, s) => sum + s.percent, 0);
                        return (
                            <circle
                                key={i}
                                r="16"
                                cx="18"
                                cy="18"
                                fill="transparent"
                                stroke={seg.color}
                                strokeWidth="6"
                                strokeDasharray={`${seg.percent} ${100 - seg.percent}`}
                                strokeDashoffset={-offset}
                                className="transition-all duration-700"
                            />
                        );
                    })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">{total}</span>
                </div>
            </div>
            {/* Legend */}
            <div className="flex-1 space-y-2">
                {data.map((d, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-sm text-gray-700">{d.label}</span>
                        <span className="text-sm font-bold text-gray-900 ml-auto">{d.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// 節點進度視覺化組件
function NodeProgressVisual({ nodes, students }: { nodes: typeof MOCK_GENERATED_LESSON.nodes; students: typeof MOCK_STUDENT_PROGRESS }) {
    const getCompletionRate = (nodeId: string) => {
        const completed = students.filter(s =>
            s.nodeProgress.find(np => np.nodeId === nodeId && np.completed)
        ).length;
        return Math.round((completed / students.length) * 100);
    };

    return (
        <div className="flex items-center justify-between gap-2 overflow-x-auto py-4">
            {nodes.filter(n => !n.id.includes('补强')).map((node, idx, arr) => {
                const rate = getCompletionRate(node.id);
                const isLast = idx === arr.length - 1;

                return (
                    <div key={node.id} className="flex items-center">
                        <div className="relative flex flex-col items-center">
                            {/* 圓形進度 */}
                            <div className="relative w-16 h-16">
                                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                    <circle r="16" cx="18" cy="18" fill="transparent" stroke="#e5e7eb" strokeWidth="3" />
                                    <circle
                                        r="16"
                                        cx="18"
                                        cy="18"
                                        fill="transparent"
                                        stroke={rate >= 80 ? '#22c55e' : rate >= 50 ? '#3b82f6' : '#f97316'}
                                        strokeWidth="3"
                                        strokeDasharray={`${rate} ${100 - rate}`}
                                        className="transition-all duration-700"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-sm font-bold">{rate}%</span>
                                </div>
                            </div>
                            {/* 節點名稱 */}
                            <div className="mt-2 text-center max-w-[80px]">
                                <div className="text-xs text-gray-600 line-clamp-2">{node.title}</div>
                                {node.isConditional && (
                                    <span className="text-[10px] px-1 py-0.5 bg-orange-100 text-orange-700 rounded">檢查</span>
                                )}
                            </div>
                        </div>
                        {/* 連接線 */}
                        {!isLast && (
                            <div className="w-8 h-0.5 bg-gray-300 mx-1" />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default function LessonProgressDashboard() {
    const navigate = useNavigate();
    const lesson = MOCK_GENERATED_LESSON;
    const students = MOCK_STUDENT_PROGRESS;

    // 計算條件分支統計
    const getConditionalStats = (nodeId: string) => {
        const learnedCount = students.filter(s =>
            s.nodeProgress.find(np => np.nodeId === nodeId && np.pathTaken === 'learned')
        ).length;
        const remedialCount = students.filter(s =>
            s.nodeProgress.find(np => np.nodeId === nodeId && np.pathTaken === 'remedial')
        ).length;
        const pendingCount = students.length - learnedCount - remedialCount;

        return { learnedCount, remedialCount, pendingCount };
    };

    const conditionalNode = lesson.nodes.find(n => n.isConditional);
    const avgProgress = Math.round(students.reduce((sum, s) => sum + s.overallProgress, 0) / students.length);
    const completedCount = students.filter(s => s.overallProgress === 100).length;
    const needAttentionCount = students.filter(s => s.overallProgress < 50).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* 頭部 */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
                                    <p className="text-gray-500 text-sm">班級學習進度監控</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-indigo-600">{students.length}</div>
                                <div className="text-xs text-gray-500">學生人數</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600">{avgProgress}%</div>
                                <div className="text-xs text-gray-500">平均進度</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 統計卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white shadow-lg">
                        <div className="flex items-center gap-3">
                            <Award className="w-8 h-8 opacity-80" />
                            <div>
                                <div className="text-3xl font-bold">{completedCount}</div>
                                <div className="text-sm opacity-90">全部完成</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-5 text-white shadow-lg">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-8 h-8 opacity-80" />
                            <div>
                                <div className="text-3xl font-bold">{students.filter(s => s.overallProgress >= 50 && s.overallProgress < 100).length}</div>
                                <div className="text-sm opacity-90">進行中</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-5 text-white shadow-lg">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-8 h-8 opacity-80" />
                            <div>
                                <div className="text-3xl font-bold">{needAttentionCount}</div>
                                <div className="text-sm opacity-90">需要關注</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-5 text-white shadow-lg">
                        <div className="flex items-center gap-3">
                            <Clock className="w-8 h-8 opacity-80" />
                            <div>
                                <div className="text-3xl font-bold">{lesson.nodes.length}</div>
                                <div className="text-sm opacity-90">學習節點</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 視覺化區塊 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* 進度分布圖 */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Target className="w-5 h-5 text-indigo-600" />
                            進度分布
                        </h2>
                        <ProgressDistributionChart students={students} />
                    </div>

                    {/* 條件分支分析 */}
                    {conditionalNode && (
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                檢查點分析：{conditionalNode.title}
                            </h2>
                            {(() => {
                                const stats = getConditionalStats(conditionalNode.id);
                                return (
                                    <PieChart data={[
                                        { label: '通過（學會）', value: stats.learnedCount, color: '#22c55e' },
                                        { label: '補強路徑', value: stats.remedialCount, color: '#f97316' },
                                        { label: '尚未完成', value: stats.pendingCount, color: '#9ca3af' },
                                    ]} />
                                );
                            })()}
                        </div>
                    )}
                </div>

                {/* 節點進度視覺化 */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        學習路徑節點完成率
                    </h2>
                    <NodeProgressVisual nodes={lesson.nodes} students={students} />
                </div>

                {/* 學生列表 */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Users className="w-5 h-5 text-purple-600" />
                            學生進度列表
                        </h2>
                        <div className="flex gap-2">
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full">✓ 完成 {completedCount}</span>
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">! 關注 {needAttentionCount}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {students.map((student) => (
                            <button
                                key={student.studentId}
                                onClick={() => navigate(`/teacher/student-progress/${lesson.id}/${student.studentId}`)}
                                className="flex items-center gap-4 p-4 border-2 border-gray-100 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all text-left group bg-gray-50 hover:bg-white"
                            >
                                {/* Avatar with progress ring */}
                                <div className="relative">
                                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
                                        <span className="text-lg font-bold text-white">
                                            {student.studentName.charAt(0)}
                                        </span>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-gray-100">
                                        <span className={`text-xs font-bold ${student.overallProgress >= 80 ? 'text-green-600' :
                                                student.overallProgress >= 50 ? 'text-blue-600' : 'text-orange-600'
                                            }`}>
                                            {student.overallProgress}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-gray-900">{student.studentName}</div>
                                    <div className="text-sm text-gray-500 truncate">
                                        目前：{lesson.nodes.find(n => n.id === student.currentNodeId)?.title}
                                    </div>
                                    {/* Mini progress bar */}
                                    <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all ${student.overallProgress >= 80 ? 'bg-green-500' :
                                                    student.overallProgress >= 50 ? 'bg-blue-500' : 'bg-orange-500'
                                                }`}
                                            style={{ width: `${student.overallProgress}%` }}
                                        />
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
