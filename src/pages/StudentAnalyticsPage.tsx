/**
 * StudentAnalyticsPage - 學習分析（個別學生）
 * 
 * 老師端頁面：
 * - 個別學生進度
 * - AI 對話紀錄
 * - 教學建議分析
 */

import { MessageSquare, Lightbulb, ArrowLeft, BookOpen } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

// Mock 學生分析資料
const MOCK_STUDENT_DATA = {
    id: '1',
    name: '王小明',
    class: '五年級 A 班',
    progress: 100,
    score: 92,
    timeSpent: 45,
    conversations: [
        {
            date: '2024-12-23',
            topic: '除法餘數',
            messages: [
                { role: 'student', content: '老師，17除以5等於多少？' },
                { role: 'ai', content: '17 ÷ 5 = 3 餘 2。商是3，餘數是2，表示 3 × 5 + 2 = 17...' },
                { role: 'student', content: '所以餘數就是剩下的嗎？' },
                { role: 'ai', content: '沒錯！餘數就是除不盡剩下來的部分。讓我用糖果分組來解釋...' },
            ],
            aiAnalysis: {
                understanding: 85,
                engagement: 90,
                keyInsight: '學生能夠主動提問，顯示良好的學習態度',
            },
        },
        {
            date: '2024-12-22',
            topic: '運算順序',
            messages: [
                { role: 'student', content: '2 + 3 × 4 等於多少？' },
                { role: 'ai', content: '記住先乘除後加減！先算 3 × 4 = 12，再算 2 + 12 = 14...' },
            ],
            aiAnalysis: {
                understanding: 78,
                engagement: 85,
                keyInsight: '需要加強運算順序的練習',
            },
        },
    ],
    teachingSuggestions: [
        {
            type: 'strength',
            title: '學習態度積極',
            description: '學生主動提問，且能持續追問直到理解概念',
        },
        {
            type: 'improvement',
            title: '運算順序需加強',
            description: '在混合運算時偶爾會忘記先乘除後加減，建議多做練習題',
        },
        {
            type: 'suggestion',
            title: '推薦補充教材',
            description: '可提供更多生活化的應用題，有助於概念理解',
        },
    ],
};

export default function StudentAnalyticsPage() {
    const navigate = useNavigate();
    const { id: _id } = useParams(); // 實際應用會根據 id 取得資料
    const student = MOCK_STUDENT_DATA;

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
                                <p className="text-3xl font-bold text-indigo-600">{student.progress}%</p>
                                <p className="text-sm text-gray-500">完成進度</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-green-600">{student.score}</p>
                                <p className="text-sm text-gray-500">平均分數</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-orange-600">{student.timeSpent}</p>
                                <p className="text-sm text-gray-500">學習時間(分)</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                    {/* 對話紀錄 */}
                    <div className="col-span-2 space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-indigo-600" />
                            AI 對話紀錄
                        </h2>
                        {student.conversations.map((conv, idx) => (
                            <div key={idx} className="bg-white rounded-xl shadow-md p-5">
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

                    {/* 教學建議 */}
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                            <Lightbulb className="w-5 h-5 text-yellow-500" />
                            教學建議
                        </h2>
                        <div className="space-y-4">
                            {student.teachingSuggestions.map((suggestion, idx) => (
                                <div
                                    key={idx}
                                    className={`bg-white rounded-xl shadow-md p-4 border-l-4 ${suggestion.type === 'strength'
                                        ? 'border-green-500'
                                        : suggestion.type === 'improvement'
                                            ? 'border-orange-500'
                                            : 'border-blue-500'
                                        }`}
                                >
                                    <h3 className={`font-medium mb-1 ${suggestion.type === 'strength'
                                        ? 'text-green-700'
                                        : suggestion.type === 'improvement'
                                            ? 'text-orange-700'
                                            : 'text-blue-700'
                                        }`}>
                                        {suggestion.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">{suggestion.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
