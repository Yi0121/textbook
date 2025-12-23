/**
 * ClassAnalyticsPage - 學習分析（班級）
 * 
 * 老師端頁面：
 * - 班級整體完成率
 * - 各節點通過率圖表
 * - 學生分佈
 * - 常見問題彙整
 */

import { BarChart3, Users, TrendingUp, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock 班級分析資料
const MOCK_CLASS_DATA = {
    className: '五年級 A 班',
    courseName: '四則運算',
    totalStudents: 32,
    averageProgress: 68,
    averageScore: 75,
    nodeStats: [
        { name: '學習診斷', completion: 100, avgScore: null },
        { name: 'Part 1: 加法與減法', completion: 94, avgScore: 82 },
        { name: 'Part 2: 乘法', completion: 81, avgScore: 76 },
        { name: 'Part 3: 除法', completion: 56, avgScore: 68 },
        { name: '測驗', completion: 44, avgScore: 72 },
        { name: '小組討論', completion: 31, avgScore: null },
    ],
    students: [
        { id: '1', name: '王小明', progress: 100, score: 92, status: 'excellent' },
        { id: '2', name: '李小華', progress: 88, score: 85, status: 'good' },
        { id: '3', name: '張小美', progress: 75, score: 78, status: 'good' },
        { id: '4', name: '陳小強', progress: 50, score: 62, status: 'warning' },
        { id: '5', name: '林小芬', progress: 38, score: 55, status: 'danger' },
    ],
    commonIssues: [
        { topic: '除法餘數', count: 12, description: '學生對餘數的概念理解不足' },
        { topic: '運算順序', count: 8, description: '混合運算時先乘除後加減順序容易混淆' },
    ],
};

const getStatusColor = (status: string) => {
    switch (status) {
        case 'excellent': return 'bg-green-100 text-green-700';
        case 'good': return 'bg-blue-100 text-blue-700';
        case 'warning': return 'bg-yellow-100 text-yellow-700';
        case 'danger': return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
    }
};

export default function ClassAnalyticsPage() {
    const navigate = useNavigate();
    const data = MOCK_CLASS_DATA;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 p-6">
            <div className="max-w-6xl mx-auto">
                {/* 標題區 */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <BarChart3 className="w-7 h-7 text-emerald-600" />
                        學習分析 - 班級
                    </h1>
                    <p className="text-gray-500 mt-1">{data.className} · {data.courseName}</p>
                </div>

                {/* 統計卡片 */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-md p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{data.totalStudents}</p>
                                <p className="text-sm text-gray-500">學生人數</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{data.averageProgress}%</p>
                                <p className="text-sm text-gray-500">平均進度</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{data.averageScore}</p>
                                <p className="text-sm text-gray-500">平均分數</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{data.commonIssues.length}</p>
                                <p className="text-sm text-gray-500">待關注議題</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {/* 節點完成率 */}
                    <div className="col-span-2 bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">各節點完成率</h2>
                        <div className="space-y-4">
                            {data.nodeStats.map((node, idx) => (
                                <div key={idx} className="flex items-center gap-4">
                                    <span className="w-32 text-sm text-gray-600 truncate">{node.name}</span>
                                    <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden relative">
                                        <div
                                            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg transition-all"
                                            style={{ width: `${node.completion}%` }}
                                        />
                                        <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-700">
                                            {node.completion}%
                                        </span>
                                    </div>
                                    {node.avgScore && (
                                        <span className="w-16 text-sm text-gray-500 text-right">
                                            平均 {node.avgScore}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 常見問題 */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-500" />
                            常見問題
                        </h2>
                        <div className="space-y-4">
                            {data.commonIssues.map((issue, idx) => (
                                <div key={idx} className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-orange-800">{issue.topic}</span>
                                        <span className="text-sm text-orange-600">{issue.count} 人</span>
                                    </div>
                                    <p className="text-sm text-orange-700">{issue.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 學生列表 */}
                <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">學生進度一覽</h2>
                    <div className="space-y-2">
                        {data.students.map(student => (
                            <div
                                key={student.id}
                                onClick={() => navigate(`/analytics/student/${student.id}`)}
                                className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-gray-100"
                            >
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                                    {student.name.charAt(0)}
                                </div>
                                <span className="flex-1 font-medium text-gray-900">{student.name}</span>
                                <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full"
                                        style={{ width: `${student.progress}%` }}
                                    />
                                </div>
                                <span className="w-20 text-sm text-gray-500">{student.progress}% 完成</span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(student.status)}`}>
                                    {student.score} 分
                                </span>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
