/**
 * QuizzesTabClass - 全班測驗紀錄 Tab
 */

import { BarChart3, AlertTriangle } from 'lucide-react';
import type { MOCK_CLASS_ANALYTICS } from '../../../mocks/analyticsData';

interface Props {
    data: typeof MOCK_CLASS_ANALYTICS;
}

export function QuizzesTabClass({ data }: Props) {
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
