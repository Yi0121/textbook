/**
 * MyConversationsPage - 我的對話紀錄
 * 
 * 學生端頁面：
 * - 與 AI 的所有對話歷史
 * - 可依課程/日期篩選
 */

import { MessageSquare, Calendar, BookOpen, ChevronRight, Search } from 'lucide-react';
import { useState } from 'react';

// Mock 對話紀錄
const MOCK_CONVERSATIONS = [
    {
        id: '1',
        course: '四則運算',
        date: '2024-12-23',
        messages: [
            { role: 'user', content: '除法有餘數怎麼辦？' },
            { role: 'ai', content: '很好的問題！當除法除不盡時會有餘數。比如 17 ÷ 5 = 3...2，表示商是 3，餘數是 2...' },
        ],
        summary: '討論了除法餘數的概念',
    },
    {
        id: '2',
        course: '四則運算',
        date: '2024-12-22',
        messages: [
            { role: 'user', content: '先乘除後加減是什麼意思？' },
            { role: 'ai', content: '這是運算順序的規則！在混合運算中，要先做乘法和除法，再做加法和減法。例如 2 + 3 × 4 = 2 + 12 = 14...' },
        ],
        summary: '學習運算順序的規則',
    },
    {
        id: '3',
        course: '分數',
        date: '2024-12-20',
        messages: [
            { role: 'user', content: '分數怎麼相加？' },
            { role: 'ai', content: '分數相加要先通分，讓分母變成一樣的。比如 1/2 + 1/3，要先把它們變成 3/6 + 2/6 = 5/6...' },
        ],
        summary: '學習分數加法的技巧',
    },
];

export default function MyConversationsPage() {
    const [selectedCourse, setSelectedCourse] = useState('全部');
    const [searchQuery, setSearchQuery] = useState('');

    const courses = ['全部', ...new Set(MOCK_CONVERSATIONS.map(c => c.course))];

    const filteredConversations = MOCK_CONVERSATIONS.filter(conv => {
        const matchCourse = selectedCourse === '全部' || conv.course === selectedCourse;
        const matchSearch = searchQuery === '' ||
            conv.summary.includes(searchQuery) ||
            conv.messages.some(m => m.content.includes(searchQuery));
        return matchCourse && matchSearch;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
            <div className="max-w-4xl mx-auto">
                {/* 標題區 */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <MessageSquare className="w-7 h-7 text-purple-600" />
                        我的對話紀錄
                    </h1>
                    <p className="text-gray-500 mt-1">查看您與 AI 的所有對話歷史</p>
                </div>

                {/* 篩選區 */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex gap-4 items-center">
                    {/* 搜尋 */}
                    <div className="flex-1 relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="搜尋對話內容..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    {/* 課程篩選 */}
                    <div className="flex gap-2">
                        {courses.map(course => (
                            <button
                                key={course}
                                onClick={() => setSelectedCourse(course)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCourse === course
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {course}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 對話列表 */}
                <div className="space-y-4">
                    {filteredConversations.map(conv => (
                        <div
                            key={conv.id}
                            className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                        <BookOpen className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">{conv.course}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {conv.date}
                                        </p>
                                    </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                            </div>

                            <p className="text-gray-600 text-sm mb-3">{conv.summary}</p>

                            {/* 對話預覽 */}
                            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                                {conv.messages.slice(0, 2).map((msg, idx) => (
                                    <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? '' : ''}`}>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${msg.role === 'user'
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-purple-100 text-purple-700'
                                            }`}>
                                            {msg.role === 'user' ? '你' : 'AI'}
                                        </span>
                                        <p className="text-sm text-gray-600 line-clamp-1 flex-1">{msg.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredConversations.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>沒有找到符合條件的對話</p>
                    </div>
                )}
            </div>
        </div>
    );
}
