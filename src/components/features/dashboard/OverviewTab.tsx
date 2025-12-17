// components/features/dashboard/OverviewTab.tsx
import { CheckCircle, ClipboardCheck, Users, BookOpen, TrendingUp } from 'lucide-react';

// 模擬數據
const STATS_DATA = [
    { label: '平均答對率', value: '87%', trend: '較上週 +5%', bgClass: 'bg-emerald-50', borderClass: 'border-emerald-100', textClass: 'text-emerald-600', labelClass: 'text-emerald-800', icon: CheckCircle },
    { label: '作業繳交率', value: '93%', trend: '28/30 已繳交', bgClass: 'bg-blue-50', borderClass: 'border-blue-100', textClass: 'text-blue-600', labelClass: 'text-blue-800', icon: ClipboardCheck },
    { label: '活躍學生', value: '26', trend: '本週上線人數', bgClass: 'bg-purple-50', borderClass: 'border-purple-100', textClass: 'text-purple-600', labelClass: 'text-purple-800', icon: Users },
    { label: '平均學習時長', value: '42m', trend: '每日平均', bgClass: 'bg-orange-50', borderClass: 'border-orange-100', textClass: 'text-orange-600', labelClass: 'text-orange-800', icon: BookOpen },
];

const STUDENTS_DATA = [
    { name: '王小明', homework: '5/5', score: 92, status: 'good' },
    { name: '陳小美', homework: '5/5', score: 88, status: 'good' },
    { name: '林大華', homework: '4/5', score: 76, status: 'warning' },
    { name: '張小芳', homework: '3/5', score: 65, status: 'need-help' },
    { name: '李志明', homework: '5/5', score: 95, status: 'good' },
];

const getStatusStyle = (status: string) => {
    switch (status) {
        case 'good': return 'bg-green-100 text-green-700';
        case 'warning': return 'bg-orange-100 text-orange-700';
        default: return 'bg-red-100 text-red-700';
    }
};

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'good': return '良好';
        case 'warning': return '注意';
        default: return '需協助';
    }
};

const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
};

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
