// components/features/dashboard/CollaborationTab.tsx

const GROUPS_DATA = [
    { group: '第一組', members: ['王小明', '陳小美', '林大華'], progress: 85, topic: '粒線體與能量代謝' },
    { group: '第二組', members: ['張小芳', '李志明', '黃小華'], progress: 92, topic: '細胞呼吸作用探討' },
    { group: '第三組', members: ['吳小強', '周小文', '鄭小玲'], progress: 78, topic: 'ATP合成酶機制' },
    { group: '第四組', members: ['許小雯', '蔡小明', '劉小芬'], progress: 88, topic: '有氧與無氧呼吸比較' },
];

export function CollaborationTab() {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 gap-4">
                {GROUPS_DATA.map((group, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-gray-200 p-5">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-gray-800">{group.group}</h4>
                            <span className="text-2xl font-bold text-indigo-600">{group.progress}%</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-3">{group.topic}</div>
                        <div className="flex flex-wrap gap-2">
                            {group.members.map((member, i) => (
                                <span key={i} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs">
                                    {member}
                                </span>
                            ))}
                        </div>
                        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-indigo-600 h-2 rounded-full transition-all"
                                style={{ width: `${group.progress}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
