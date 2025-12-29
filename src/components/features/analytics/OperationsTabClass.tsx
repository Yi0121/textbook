/**
 * OperationsTabClass - 全班操作紀錄 Tab
 */

import { Target, Clock } from 'lucide-react';
import type { MOCK_CLASS_ANALYTICS } from '../../../mocks/analyticsData';

interface Props {
    data: typeof MOCK_CLASS_ANALYTICS;
}

export function OperationsTabClass({ data }: Props) {
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
