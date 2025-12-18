// components/features/dashboard/OverviewTab.tsx
import { TrendingUp } from 'lucide-react';
import {
  STATS_DATA,
  STUDENTS_DATA,
  getStatusStyle,
  getStatusLabel,
  getScoreColor,
} from '../../../mocks';

export function OverviewTab() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* 數據卡片 */}
            <div className="grid grid-cols-4 gap-4">
                {STATS_DATA.map((stat, idx) => (
                    <div key={idx} className={`${stat.bgClass} p-5 rounded-xl border ${stat.borderClass}`}>
                        <div className={`${stat.labelClass} font-medium mb-2 flex items-center gap-2 text-sm`}>
                            <stat.icon className="w-4 h-4" /> {stat.label}
                        </div>
                        <div className={`text-3xl font-bold ${stat.textClass}`}>{stat.value}</div>
                        <div className={`text-xs ${stat.textClass}/70 mt-1 flex items-center gap-1`}>
                            {idx === 0 && <TrendingUp className="w-3 h-3" />}
                            {stat.trend}
                        </div>
                    </div>
                ))}
            </div>

            {/* 學生列表 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="font-bold text-gray-800">全班學習狀況</h3>
                </div>
                <div className="overflow-auto max-h-80">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr className="text-left text-gray-600">
                                <th className="px-6 py-3 font-medium">學生姓名</th>
                                <th className="px-6 py-3 font-medium">作業進度</th>
                                <th className="px-6 py-3 font-medium">測驗成績</th>
                                <th className="px-6 py-3 font-medium">學習狀態</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {STUDENTS_DATA.map((student, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-800">{student.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{student.homework}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-bold ${getScoreColor(student.score)}`}>
                                            {student.score}分
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(student.status)}`}>
                                            {getStatusLabel(student.status)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
