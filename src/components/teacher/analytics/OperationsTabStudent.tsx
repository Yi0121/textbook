/**
 * OperationsTabStudent - 個人操作紀錄 Tab
 */

import { Clock, Target, TrendingUp, MousePointer, Calculator } from 'lucide-react';
import { StatBox } from './StatCard';
import type { MOCK_STUDENTS } from '../../../mocks/analyticsData';

interface Props {
    student: typeof MOCK_STUDENTS[0];
}

export function OperationsTabStudent({ student }: Props) {
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
