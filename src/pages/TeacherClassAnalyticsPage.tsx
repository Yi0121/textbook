/**
 * ClassAnalyticsPage - 教師學習分析儀表板
 * 
 * 功能：
 * - 全班/個人切換（下拉選單）
 * - 統計卡片（全班視圖）
 * - AI 綜合分析（全班視圖）
 * - Tab: 對話/操作/測驗
 * - 學生列表（全班視圖）
 */

import { useState } from 'react';
import {
    BarChart3, Users, TrendingUp, CheckCircle, Clock,
    Sparkles, ChevronDown, BookOpen, ArrowRight, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useClassAnalytics, useAllStudentsAnalytics } from '../hooks';
import {
    StatCard,
    ConversationsTabClass,
    OperationsTabClass,
    QuizzesTabClass,
    ConversationsTabStudent,
    OperationsTabStudent,
    QuizzesTabStudent,
} from '../components/teacher/analytics';

// Tab 類型
type AnalyticsTab = 'conversations' | 'operations' | 'quizzes' | 'lessons';

export default function ClassAnalyticsPage() {
    const [activeTab, setActiveTab] = useState<AnalyticsTab>('lessons');
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    // 使用 TanStack Query hooks 取得資料
    const { data: classData, isLoading: classLoading } = useClassAnalytics();
    const { data: students = [], isLoading: studentsLoading } = useAllStudentsAnalytics();

    const isLoading = classLoading || studentsLoading;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!classData) {
        return <div className="p-6 text-center text-gray-500">資料載入失敗</div>;
    }

    const data = classData;
    const isClassView = !selectedStudentId;
    const selectedStudent = selectedStudentId ? students.find(s => s.id === selectedStudentId) : null;

    // Tab 配置
    const tabs = [
        { id: 'lessons' as const, label: '📚 課程單元' },
        { id: 'conversations' as const, label: '💬 對話紀錄' },
        { id: 'operations' as const, label: '🖱️ 操作紀錄' },
        { id: 'quizzes' as const, label: '📝 測驗紀錄' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto">

                {/* ==================== 標題與切換 ==================== */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <BarChart3 className="w-7 h-7 text-indigo-600" />
                            學習分析
                        </h1>
                        <p className="text-gray-500 mt-1">{data.className} · {data.courseName}</p>
                    </div>

                    {/* 全班/個人切換 */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSelectedStudentId(null)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${isClassView
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            🏫 全班
                        </button>

                        {/* 學生下拉選單 */}
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${selectedStudent
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                    }`}
                            >
                                👤 {selectedStudent ? selectedStudent.name : '選擇學生'}
                                <ChevronDown className="w-4 h-4" />
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
                                    {students.map(student => (
                                        <button
                                            key={student.id}
                                            onClick={() => {
                                                setSelectedStudentId(student.id);
                                                setShowDropdown(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 ${selectedStudentId === student.id ? 'bg-indigo-50 text-indigo-700' : ''
                                                }`}
                                        >
                                            <span className={`w-2 h-2 rounded-full ${student.status === 'excellent' ? 'bg-green-500' :
                                                student.status === 'good' ? 'bg-blue-500' :
                                                    student.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                                                }`} />
                                            {student.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ==================== 個人視圖：學生資訊卡 ==================== */}
                {!isClassView && selectedStudent && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                {selectedStudent.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h2>
                                <p className="text-gray-500">{selectedStudent.class}</p>
                            </div>
                            <div className="flex gap-6">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-indigo-600">{selectedStudent.overallProgress}%</p>
                                    <p className="text-sm text-gray-500">完成進度</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-green-600">{selectedStudent.overallScore}</p>
                                    <p className="text-sm text-gray-500">平均分數</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-orange-600">{selectedStudent.totalLearningTime}</p>
                                    <p className="text-sm text-gray-500">學習時間(分)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================== 全班視圖：統計卡片 ==================== */}
                {isClassView && (
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <StatCard
                            icon={<Users className="w-5 h-5 text-blue-600" />}
                            iconBg="bg-blue-100"
                            value={data.totalStudents}
                            label="學生人數"
                        />
                        <StatCard
                            icon={<TrendingUp className="w-5 h-5 text-green-600" />}
                            iconBg="bg-green-100"
                            value={`${data.averageProgress}%`}
                            label="平均進度"
                        />
                        <StatCard
                            icon={<CheckCircle className="w-5 h-5 text-purple-600" />}
                            iconBg="bg-purple-100"
                            value={data.averageScore}
                            label="平均分數"
                        />
                        <StatCard
                            icon={<Clock className="w-5 h-5 text-orange-600" />}
                            iconBg="bg-orange-100"
                            value={`${data.averageLearningTime} 分`}
                            label="學習時間"
                        />
                    </div>
                )}

                {/* ==================== 全班視圖：AI 綜合分析 ==================== */}
                {isClassView && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-purple-500" />
                            AI 綜合分析
                        </h2>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                                <h3 className="font-medium text-indigo-900 mb-2">學習狀態總結</h3>
                                <p className="text-sm text-indigo-700 mb-3">
                                    班級整體表現良好，{data.quizStats.passRate}% 學生達到及格標準。
                                    平均學習時間為 {data.averageLearningTime} 分鐘，顯示學生投入度高。
                                </p>
                                <div className="flex items-center gap-2 text-xs text-indigo-600">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    整體狀況良好
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border border-orange-100">
                                <h3 className="font-medium text-orange-900 mb-2">待關注學生</h3>
                                <div className="space-y-2">
                                    {data.students.filter(s => s.status === 'danger' || s.status === 'warning').slice(0, 3).map(student => (
                                        <div key={student.id} className="flex items-center justify-between text-sm">
                                            <span className="text-orange-700">{student.name}</span>
                                            <span className={`px-2 py-0.5 rounded text-xs ${student.status === 'danger' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {student.overallScore} 分
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
                                <h3 className="font-medium text-green-900 mb-2">教學建議</h3>
                                <ul className="space-y-1.5 text-sm text-green-700">
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-500">•</span>
                                        加強{data.quizStats.classWeakPoints[0]?.point}概念練習
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-500">•</span>
                                        AI 使用率達 {data.conversationStats.aiUsageRate}%，持續鼓勵
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-500">•</span>
                                        關注低分群學生個別輔導
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* ==================== Tab 切換 ==================== */}
                <div className="bg-white rounded-xl shadow-sm mb-6">
                    <div className="flex border-b border-gray-200">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-medium transition-all ${activeTab === tab.id
                                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab 內容區域 */}
                    <div className="p-6">
                        {isClassView ? (
                            // 全班視圖
                            <>
                                {activeTab === 'lessons' && (
                                    <div className="space-y-4">
                                        {[
                                            { id: 'lesson-apos-001', title: '二元一次方程式 (APOS)', progress: 72, studentCount: 28, lastActive: '10 分鐘前', status: 'active' },
                                            { id: 'lesson-math-001', title: '四則運算 (基礎)', progress: 100, studentCount: 30, lastActive: '2023-11-15', status: 'completed' },
                                            { id: 'lesson-geo-001', title: '平面幾何導論', progress: 0, studentCount: 28, lastActive: '草稿', status: 'draft' },
                                        ].map(lesson => (
                                            <div
                                                key={lesson.id}
                                                onClick={() => navigate(`/teacher/lesson-progress/${lesson.id}`)}
                                                className="bg-gray-50 hover:bg-white border border-gray-200 hover:border-indigo-300 rounded-xl p-5 cursor-pointer transition-all shadow-sm hover:shadow-md group"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`p-2.5 rounded-lg ${lesson.status === 'active' ? 'bg-indigo-100 text-indigo-600' : lesson.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                                                            <BookOpen className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors flex items-center gap-2">
                                                                {lesson.title}
                                                                {lesson.status === 'active' && <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">進行中</span>}
                                                                {lesson.status === 'completed' && <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">已結案</span>}
                                                                {lesson.status === 'draft' && <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full">草稿</span>}
                                                            </h3>
                                                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                                <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {lesson.studentCount} 人</span>
                                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lesson.lastActive}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${lesson.status === 'completed' ? 'bg-green-500' : 'bg-indigo-500'}`}
                                                            style={{ width: `${lesson.progress}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-700 min-w-[3rem] text-right">{lesson.progress}%</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {activeTab === 'conversations' && <ConversationsTabClass data={data} />}
                                {activeTab === 'operations' && <OperationsTabClass data={data} />}
                                {activeTab === 'quizzes' && <QuizzesTabClass data={data} />}
                            </>
                        ) : selectedStudent ? (
                            // 個人視圖
                            <>
                                {activeTab === 'conversations' && <ConversationsTabStudent student={selectedStudent} />}
                                {activeTab === 'operations' && <OperationsTabStudent student={selectedStudent} />}
                                {activeTab === 'quizzes' && <QuizzesTabStudent student={selectedStudent} />}
                            </>
                        ) : null}
                    </div>
                </div>

            </div>
        </div>
    );
}
