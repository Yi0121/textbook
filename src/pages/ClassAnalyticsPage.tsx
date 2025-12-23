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
    Sparkles, Flame, Target, AlertTriangle,
    ChevronDown, BookOpen, MousePointer, Calculator
} from 'lucide-react';
import { MOCK_CLASS_ANALYTICS, MOCK_STUDENTS } from '../mocks/analyticsData';

// Tab 類型
type AnalyticsTab = 'conversations' | 'operations' | 'quizzes';

export default function ClassAnalyticsPage() {
    const [activeTab, setActiveTab] = useState<AnalyticsTab>('conversations');
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const data = MOCK_CLASS_ANALYTICS;
    const isClassView = !selectedStudentId;
    const selectedStudent = selectedStudentId ? MOCK_STUDENTS.find(s => s.id === selectedStudentId) : null;

    // Tab 配置
    const tabs = [
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
                                    {MOCK_STUDENTS.map(student => (
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

// ==================== 全班 Tab 內容元件 ====================

function ConversationsTabClass({ data }: { data: typeof MOCK_CLASS_ANALYTICS }) {
    return (
        <div className="grid grid-cols-2 gap-6">
            <div>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    熱門問題
                </h3>
                <div className="space-y-3">
                    {data.conversationStats.hotTopics.map((topic, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                            <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                                {idx + 1}
                            </span>
                            <span className="flex-1 text-gray-700">{topic.topic}</span>
                            <span className="text-sm text-gray-500">{topic.count} 次</span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-bold text-gray-900 mb-4">AI 對話統計</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-indigo-50 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-indigo-600">{data.conversationStats.totalConversations}</p>
                        <p className="text-sm text-indigo-700 mt-1">總對話次數</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                        <p className="text-3xl font-bold text-green-600">{data.conversationStats.averagePerStudent.toFixed(1)}</p>
                        <p className="text-sm text-green-700 mt-1">平均每人</p>
                    </div>
                    <div className="col-span-2 bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-purple-700">AI 使用率</span>
                            <span className="font-bold text-purple-600">{data.conversationStats.aiUsageRate}%</span>
                        </div>
                        <div className="h-2 bg-purple-200 rounded-full">
                            <div
                                className="h-full bg-purple-500 rounded-full"
                                style={{ width: `${data.conversationStats.aiUsageRate}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function OperationsTabClass({ data }: { data: typeof MOCK_CLASS_ANALYTICS }) {
    return (
        <div className="grid grid-cols-2 gap-6">
            <div>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    功能使用排行
                </h3>
                <div className="space-y-3">
                    {data.operationStats.popularFeatures.map((feature, idx) => (
                        <div key={idx}>
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-gray-700">{feature.feature}</span>
                                <span className="text-sm text-gray-500">{feature.usage}%</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"
                                    style={{ width: `${feature.usage}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-500" />
                    熱門學習時段
                </h3>
                <div className="grid grid-cols-7 gap-2 mb-4">
                    {data.operationStats.activityHeatmap.map((item, idx) => (
                        <div key={idx} className="text-center">
                            <div
                                className="w-full h-12 rounded-lg flex items-center justify-center text-xs font-medium"
                                style={{
                                    backgroundColor: `rgba(99, 102, 241, ${item.count / 50})`,
                                    color: item.count > 25 ? 'white' : 'rgb(99, 102, 241)'
                                }}
                            >
                                {item.count}
                            </div>
                            <span className="text-xs text-gray-500 mt-1 block">{item.day}</span>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                        <p className="text-xl font-bold text-green-600">{data.operationStats.avgSessionDuration} 分</p>
                        <p className="text-xs text-green-700">平均每次時長</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <p className="text-xl font-bold text-blue-600">{data.operationStats.avgFocusScore}</p>
                        <p className="text-xs text-blue-700">平均專注度</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function QuizzesTabClass({ data }: { data: typeof MOCK_CLASS_ANALYTICS }) {
    return (
        <div className="grid grid-cols-2 gap-6">
            <div>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-500" />
                    分數分佈
                </h3>
                <div className="space-y-3">
                    {data.quizStats.scoreDistribution.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                            <span className="w-16 text-sm text-gray-600">{item.range}</span>
                            <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex items-center justify-end pr-2"
                                    style={{ width: `${(item.count / data.totalStudents) * 100 * 3}%` }}
                                >
                                    <span className="text-xs text-white font-medium">{item.count}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    班級弱點
                </h3>
                <div className="space-y-3">
                    {data.quizStats.classWeakPoints.map((point, idx) => (
                        <div key={idx} className="bg-orange-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-orange-800">{point.point}</span>
                                <span className="text-sm text-orange-600">{Math.round(point.errorRate * 100)}% 錯誤率</span>
                            </div>
                            <div className="h-2 bg-orange-200 rounded-full">
                                <div
                                    className="h-full bg-orange-500 rounded-full"
                                    style={{ width: `${point.errorRate * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-green-600">{data.quizStats.passRate}%</p>
                    <p className="text-sm text-green-700">班級及格率</p>
                </div>
            </div>
        </div>
    );
}

// ==================== 個人 Tab 內容元件 ====================

function ConversationsTabStudent({ student }: { student: typeof MOCK_STUDENTS[0] }) {
    if (student.conversations.length === 0) {
        return <div className="text-center text-gray-500 py-8">暫無對話紀錄</div>;
    }

    return (
        <div className="space-y-4">
            {student.conversations.map(conv => (
                <div key={conv.id} className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-gray-900">{conv.topic}</span>
                        </div>
                        <span className="text-sm text-gray-500">{conv.date}</span>
                    </div>

                    <div className="space-y-3 mb-4">
                        {conv.messages.map((msg, msgIdx) => (
                            <div key={msgIdx} className={`flex ${msg.role === 'student' ? 'justify-end' : ''}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'student'
                                    ? 'bg-indigo-100 text-indigo-900'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    <p className="text-sm">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                        <h4 className="text-sm font-medium text-purple-800 mb-2">🤖 AI 分析</h4>
                        <div className="grid grid-cols-2 gap-4 mb-2">
                            <div>
                                <span className="text-xs text-purple-600">理解程度</span>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-purple-200 rounded-full">
                                        <div
                                            className="h-full bg-purple-500 rounded-full"
                                            style={{ width: `${conv.aiAnalysis.understanding}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-purple-700">
                                        {conv.aiAnalysis.understanding}%
                                    </span>
                                </div>
                            </div>
                            <div>
                                <span className="text-xs text-purple-600">參與度</span>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-purple-200 rounded-full">
                                        <div
                                            className="h-full bg-purple-500 rounded-full"
                                            style={{ width: `${conv.aiAnalysis.engagement}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-purple-700">
                                        {conv.aiAnalysis.engagement}%
                                    </span>
                                </div>
                            </div>
                        </div>
                        <p className="text-sm text-purple-700">{conv.aiAnalysis.keyInsight}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function OperationsTabStudent({ student }: { student: typeof MOCK_STUDENTS[0] }) {
    const ops = student.operations;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
                <StatBox icon={<Clock className="w-5 h-5 text-indigo-600" />} value={ops.totalTime} label="總學習時間(分)" bgColor="bg-indigo-50" />
                <StatBox icon={<Target className="w-5 h-5 text-green-600" />} value={ops.sessionCount} label="學習次數" bgColor="bg-green-50" />
                <StatBox icon={<TrendingUp className="w-5 h-5 text-purple-600" />} value={ops.avgSessionDuration} label="平均時長(分)" bgColor="bg-purple-50" />
                <StatBox icon={<Target className="w-5 h-5 text-orange-600" />} value={ops.focusScore} label="專注度" bgColor="bg-orange-50" />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4">學習活動趨勢</h3>
                    <div className="flex items-end gap-2 h-32">
                        {ops.dailyActivity.map((day, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center">
                                <div
                                    className="w-full bg-gradient-to-t from-indigo-500 to-purple-400 rounded-t"
                                    style={{ height: `${(day.minutes / 35) * 100}%`, minHeight: 4 }}
                                />
                                <span className="text-xs text-gray-500 mt-1">{day.date}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-blue-500" />
                        GeoGebra 操作
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">使用次數</span>
                            <span className="font-bold text-blue-600">12 次</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">總操作時間</span>
                            <span className="font-bold text-green-600">45 分鐘</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">繪製圖形</span>
                            <span className="font-bold text-purple-600">8 個</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">互動測試</span>
                            <span className="font-bold text-orange-600">15 次</span>
                        </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">熟練度</div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-blue-100 rounded-full">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }} />
                            </div>
                            <span className="text-sm font-medium text-blue-600">75%</span>
                        </div>
                    </div>
                </div>
            </div>

            {ops.actions.length > 0 && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <MousePointer className="w-5 h-5 text-indigo-500" />
                        功能使用記錄
                    </h3>
                    <div className="space-y-2">
                        {ops.actions.map((action, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <span className="text-sm font-medium text-gray-900">{action.action}</span>
                                    <span className="text-sm text-gray-500 ml-2">· {action.target}</span>
                                </div>
                                <span className="text-sm font-medium text-indigo-600">{action.count} 次</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function QuizzesTabStudent({ student }: { student: typeof MOCK_STUDENTS[0] }) {
    const quiz = student.quizzes;

    return (
        <div className="space-y-6">
            {quiz.knowledgeMastery.length > 0 && (
                <div>
                    <h3 className="font-bold text-gray-900 mb-4">知識點掌握度</h3>
                    <div className="grid grid-cols-5 gap-4">
                        {quiz.knowledgeMastery.map(kp => (
                            <div key={kp.id} className="text-center">
                                <div
                                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-lg font-bold"
                                    style={{
                                        backgroundColor: kp.mastery >= 80 ? '#dcfce7' : kp.mastery >= 60 ? '#fef9c3' : '#fee2e2',
                                        color: kp.mastery >= 80 ? '#16a34a' : kp.mastery >= 60 ? '#ca8a04' : '#dc2626'
                                    }}
                                >
                                    {kp.mastery}%
                                </div>
                                <p className="mt-2 text-sm text-gray-700">{kp.name}</p>
                                <p className="text-xs text-gray-500">{kp.attempts} 次練習</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {quiz.weakPoints.length > 0 && (
                <div>
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        需加強項目
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {quiz.weakPoints.map((wp, idx) => (
                            <div key={idx} className="bg-orange-50 border border-orange-200 rounded-lg px-4 py-2">
                                <span className="font-medium text-orange-800">{wp.point}</span>
                                <span className="ml-2 text-sm text-orange-600">
                                    ({Math.round(wp.errorRate * 100)}% 錯誤，{wp.count} 次)
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {quiz.attempts.length > 0 && (
                <div>
                    <h3 className="font-bold text-gray-900 mb-4">測驗紀錄</h3>
                    <div className="space-y-2">
                        {quiz.attempts.map(attempt => (
                            <div key={attempt.id} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${attempt.score >= 80 ? 'bg-green-100 text-green-600' :
                                    attempt.score >= 60 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                                    }`}>
                                    {attempt.score}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{attempt.quizName}</p>
                                    <p className="text-sm text-gray-500">
                                        {attempt.date} · {attempt.correctCount}/{attempt.totalQuestions} 正確 · {attempt.timeSpent} 分鐘
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ==================== 子元件 ====================

function StatCard({ icon, iconBg, value, label }: {
    icon: React.ReactNode;
    iconBg: string;
    value: string | number;
    label: string
}) {
    return (
        <div className="bg-white rounded-xl shadow-md p-5">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    <p className="text-sm text-gray-500">{label}</p>
                </div>
            </div>
        </div>
    );
}

function StatBox({ icon, value, label, bgColor }: {
    icon: React.ReactNode;
    value: number;
    label: string;
    bgColor: string;
}) {
    return (
        <div className={`${bgColor} rounded-lg p-4 text-center`}>
            <div className="flex justify-center mb-2">{icon}</div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-600">{label}</p>
        </div>
    );
}


