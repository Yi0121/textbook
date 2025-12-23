/**
 * StudentAnalyticsPage - 個別學生學習分析
 * 
 * 功能：
 * - 學生基本資訊卡片
 * - Tab: 對話紀錄/操作紀錄/測驗紀錄
 * - 操作紀錄包含 GeoGebra 使用數據
 */

import { useState } from 'react';
import {
    ArrowLeft, BookOpen, MousePointer, Calculator,
    Clock, Target, TrendingUp, AlertTriangle
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { MOCK_STUDENTS } from '../mocks/analyticsData';

// Tab 類型
type AnalyticsTab = 'conversations' | 'operations' | 'quizzes';

export default function StudentAnalyticsPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState<AnalyticsTab>('conversations');

    // 根據 ID 取得學生資料
    const student = MOCK_STUDENTS.find(s => s.id === id) || MOCK_STUDENTS[0];

    // Tab 配置
    const tabs = [
        { id: 'conversations' as const, label: '💬 對話紀錄' },
        { id: 'operations' as const, label: '🖱️ 操作紀錄' },
        { id: 'quizzes' as const, label: '📝 測驗紀錄' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-5xl mx-auto">
                {/* 返回按鈕 */}
                <button
                    onClick={() => navigate('/analytics/class')}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    返回班級分析
                </button>

                {/* 學生資訊卡 */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                            {student.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
                            <p className="text-gray-500">{student.class}</p>
                        </div>
                        <div className="flex gap-6">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-indigo-600">{student.overallProgress}%</p>
                                <p className="text-sm text-gray-500">完成進度</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-green-600">{student.overallScore}</p>
                                <p className="text-sm text-gray-500">平均分數</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-orange-600">{student.totalLearningTime}</p>
                                <p className="text-sm text-gray-500">學習時間(分)</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab 切換 */}
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

                    {/* Tab 內容 */}
                    <div className="p-6">
                        {activeTab === 'conversations' && <ConversationsTab student={student} />}
                        {activeTab === 'operations' && <OperationsTab student={student} />}
                        {activeTab === 'quizzes' && <QuizzesTab student={student} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==================== Tab 內容元件 ====================

function ConversationsTab({ student }: { student: typeof MOCK_STUDENTS[0] }) {
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

                    {/* 對話內容 */}
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

                    {/* AI 分析 */}
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

function OperationsTab({ student }: { student: typeof MOCK_STUDENTS[0] }) {
    const ops = student.operations;

    return (
        <div className="space-y-6">
            {/* 統計概覽 */}
            <div className="grid grid-cols-4 gap-4">
                <StatBox
                    icon={<Clock className="w-5 h-5 text-indigo-600" />}
                    value={ops.totalTime}
                    label="總學習時間(分)"
                    bgColor="bg-indigo-50"
                />
                <StatBox
                    icon={<Target className="w-5 h-5 text-green-600" />}
                    value={ops.sessionCount}
                    label="學習次數"
                    bgColor="bg-green-50"
                />
                <StatBox
                    icon={<TrendingUp className="w-5 h-5 text-purple-600" />}
                    value={ops.avgSessionDuration}
                    label="平均時長(分)"
                    bgColor="bg-purple-50"
                />
                <StatBox
                    icon={<Target className="w-5 h-5 text-orange-600" />}
                    value={ops.focusScore}
                    label="專注度"
                    bgColor="bg-orange-50"
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* 學習活動趨勢 */}
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

                {/* GeoGebra 操作統計 */}
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

            {/* 功能使用記錄 */}
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

function QuizzesTab({ student }: { student: typeof MOCK_STUDENTS[0] }) {
    const quiz = student.quizzes;

    return (
        <div className="space-y-6">
            {/* 知識點掌握度 */}
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

            {/* 弱點提示 */}
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

            {/* 測驗紀錄 */}
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
