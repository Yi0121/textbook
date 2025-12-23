/**
 * MyLearningPathPage - 我的學習路徑
 * 
 * 學生端頁面：
 * - 顯示指派的學習路徑
 * - 節點完成狀態
 * - 開始/繼續學習按鈕
 */

import { BookOpen, CheckCircle, Circle, Clock, Play, ArrowRight } from 'lucide-react';

// Mock 學習路徑資料
const MOCK_LEARNING_PATH = {
    courseName: '四則運算',
    totalNodes: 8,
    completedNodes: 3,
    estimatedTime: 45,
    nodes: [
        { id: '1', label: '學習診斷', status: 'completed', type: 'diagnosis' },
        { id: '2', label: 'Part 1: 加法與減法', status: 'completed', type: 'chapter' },
        { id: '3', label: 'Part 2: 乘法', status: 'completed', type: 'chapter' },
        { id: '4', label: 'Part 3: 除法', status: 'in_progress', type: 'chapter' },
        { id: '5', label: '測驗', status: 'pending', type: 'quiz' },
        { id: '6', label: '小組討論', status: 'pending', type: 'collaboration' },
        { id: '7', label: '綜合練習', status: 'pending', type: 'exercise' },
        { id: '8', label: '學習總結', status: 'pending', type: 'summary' },
    ],
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'completed':
            return <CheckCircle className="w-5 h-5 text-green-500" />;
        case 'in_progress':
            return <Play className="w-5 h-5 text-blue-500" />;
        default:
            return <Circle className="w-5 h-5 text-gray-300" />;
    }
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'completed':
            return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">已完成</span>;
        case 'in_progress':
            return <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">進行中</span>;
        default:
            return <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">未開始</span>;
    }
};

export default function MyLearningPathPage() {
    const path = MOCK_LEARNING_PATH;
    const progress = Math.round((path.completedNodes / path.totalNodes) * 100);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-4xl mx-auto">
                {/* 標題區 */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                <BookOpen className="w-7 h-7 text-indigo-600" />
                                {path.courseName}
                            </h1>
                            <p className="text-gray-500 mt-1">老師為您規劃的個人化學習路徑</p>
                        </div>
                        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-md">
                            <Play className="w-5 h-5" />
                            繼續學習
                        </button>
                    </div>

                    {/* 進度條 */}
                    <div className="mt-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">學習進度</span>
                            <span className="font-medium text-indigo-600">{progress}%</span>
                        </div>
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                            <span>{path.completedNodes} / {path.totalNodes} 節點完成</span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                預估還需 {path.estimatedTime - Math.round(path.estimatedTime * progress / 100)} 分鐘
                            </span>
                        </div>
                    </div>
                </div>

                {/* 學習路徑節點列表 */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">學習路徑</h2>
                    <div className="space-y-3">
                        {path.nodes.map((node, index) => (
                            <div
                                key={node.id}
                                className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${node.status === 'in_progress'
                                    ? 'border-blue-300 bg-blue-50'
                                    : node.status === 'completed'
                                        ? 'border-green-200 bg-green-50/50'
                                        : 'border-gray-200 bg-gray-50/50'
                                    }`}
                            >
                                {/* 節點序號與連接線 */}
                                <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${node.status === 'completed'
                                        ? 'bg-green-500 text-white'
                                        : node.status === 'in_progress'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-500'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    {index < path.nodes.length - 1 && (
                                        <div className={`w-0.5 h-6 ${node.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'
                                            }`} />
                                    )}
                                </div>

                                {/* 節點內容 */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900">{node.label}</span>
                                        {getStatusBadge(node.status)}
                                    </div>
                                </div>

                                {/* 狀態圖示 */}
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(node.status)}
                                    {node.status === 'in_progress' && (
                                        <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                                            繼續 <ArrowRight className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
