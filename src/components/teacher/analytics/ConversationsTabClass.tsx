/**
 * ConversationsTabClass - 全班對話紀錄 Tab
 */

import { Flame } from 'lucide-react';
import type { MOCK_CLASS_ANALYTICS } from '../../../mocks/analyticsData';

interface Props {
    data: typeof MOCK_CLASS_ANALYTICS;
}

export function ConversationsTabClass({ data }: Props) {
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
