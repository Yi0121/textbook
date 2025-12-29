/**
 * ConversationsTabStudent - 個人對話紀錄 Tab
 */

import { BookOpen } from 'lucide-react';
import type { MOCK_STUDENTS } from '../../../mocks/analyticsData';

interface Props {
    student: typeof MOCK_STUDENTS[0];
}

export function ConversationsTabStudent({ student }: Props) {
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
