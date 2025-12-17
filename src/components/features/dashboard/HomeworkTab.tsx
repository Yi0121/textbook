// components/features/dashboard/HomeworkTab.tsx

const HOMEWORK_DATA = [
    { hw: '作業 1: 粒線體結構圖', submitted: 30, total: 30, deadline: '已截止' },
    { hw: '作業 2: ATP 生成機制', submitted: 28, total: 30, deadline: '2天後' },
    { hw: '作業 3: 細胞呼吸實驗報告', submitted: 25, total: 30, deadline: '5天後' },
];

export function HomeworkTab() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-800 mb-4">本週作業繳交明細</h3>
                <div className="space-y-3">
                    {HOMEWORK_DATA.map((item, idx) => {
                        const percentage = Math.round(item.submitted / item.total * 100);
                        return (
                            <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <div className="font-medium text-gray-800">{item.hw}</div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        繳交: {item.submitted}/{item.total} ({percentage}%)
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-500">{item.deadline}</div>
                                    <div className="mt-1 w-32 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-indigo-600 h-2 rounded-full"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
