/**
 * ResourceSelector - 備課資源選擇器
 * 
 * 讓老師選擇不同來源的教學資源：
 * - 影片資源
 * - 教材
 * - 學習單
 * - 外部工具（預留未來 MCP 整合）
 */

import { useState } from 'react';
import { Youtube, FileText, ClipboardList, ExternalLink, Check } from 'lucide-react';

export interface Resource {
    id: string;
    type: 'video' | 'material' | 'worksheet' | 'external';
    title: string;
    description: string;
    source?: string;
    url?: string;
}

interface ResourceSelectorProps {
    onResourcesSelected?: (resources: Resource[]) => void;
    className?: string;
}

const MOCK_RESOURCES: Resource[] = [
    // 影片資源
    {
        id: 'video-1',
        type: 'video',
        title: '四則運算基礎概念',
        description: '3分鐘動畫講解加減乘除的運算順序',
        source: 'YouTube',
        url: 'https://youtube.com/example1',
    },
    {
        id: 'video-2',
        type: 'video',
        title: '混合運算實例解說',
        description: '實際案例演示如何解決混合運算問題',
        source: 'Khan Academy',
        url: 'https://khanacademy.org/example',
    },

    // 教材資源
    {
        id: 'material-1',
        type: 'material',
        title: '四則運算教學簡報',
        description: 'PowerPoint 簡報，含 15 張投影片',
        source: '本地資源庫',
    },
    {
        id: 'material-2',
        type: 'material',
        title: '數學概念圖解 PDF',
        description: '視覺化圖解四則運算流程',
        source: '本地資源庫',
    },

    // 學習單
    {
        id: 'worksheet-1',
        type: 'worksheet',
        title: '基礎運算練習單',
        description: '20 題基礎練習，適合課堂使用',
        source: '題庫系統',
    },
    {
        id: 'worksheet-2',
        type: 'worksheet',
        title: '進階挑戰題組',
        description: '10 題進階混合運算，含詳解',
        source: '題庫系統',
    },

    // 外部工具
    {
        id: 'external-1',
        type: 'external',
        title: 'GeoGebra 互動元件',
        description: '動態數學工具，可視化運算過程',
        source: 'GeoGebra',
        url: 'https://geogebra.org',
    },
    {
        id: 'external-2',
        type: 'external',
        title: 'Wolfram Alpha 運算工具',
        description: '強大的數學運算引擎',
        source: 'Wolfram',
        url: 'https://wolframalpha.com',
    },
];

export default function ResourceSelector({ onResourcesSelected, className = '' }: ResourceSelectorProps) {
    const [selectedTab, setSelectedTab] = useState<'all' | 'video' | 'material' | 'worksheet' | 'external'>('all');
    const [selectedResources, setSelectedResources] = useState<string[]>([]);

    const getTypeIcon = (type: Resource['type']) => {
        switch (type) {
            case 'video':
                return <Youtube className="w-5 h-5" />;
            case 'material':
                return <FileText className="w-5 h-5" />;
            case 'worksheet':
                return <ClipboardList className="w-5 h-5" />;
            case 'external':
                return <ExternalLink className="w-5 h-5" />;
        }
    };

    const getTypeColor = (type: Resource['type']) => {
        switch (type) {
            case 'video':
                return 'bg-red-100 text-red-700 border-red-200';
            case 'material':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'worksheet':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'external':
                return 'bg-purple-100 text-purple-700 border-purple-200';
        }
    };

    const getTypeLabel = (type: Resource['type']) => {
        switch (type) {
            case 'video':
                return '影片';
            case 'material':
                return '教材';
            case 'worksheet':
                return '學習單';
            case 'external':
                return '外部工具';
        }
    };

    const toggleResource = (resourceId: string) => {
        setSelectedResources(prev => {
            const newSelection = prev.includes(resourceId)
                ? prev.filter(id => id !== resourceId)
                : [...prev, resourceId];

            // 觸發回調
            const selectedResourceObjects = MOCK_RESOURCES.filter(r => newSelection.includes(r.id));
            onResourcesSelected?.(selectedResourceObjects);

            return newSelection;
        });
    };

    const filteredResources = selectedTab === 'all'
        ? MOCK_RESOURCES
        : MOCK_RESOURCES.filter(r => r.type === selectedTab);

    return (
        <div className={`${className}`}>
            {/* 分類標籤 */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {([
                    { value: 'all', label: '全部', icon: '📚' },
                    { value: 'video', label: '影片', icon: '🎬' },
                    { value: 'material', label: '教材', icon: '📄' },
                    { value: 'worksheet', label: '學習單', icon: '📝' },
                    { value: 'external', label: '外部工具', icon: '🔧' },
                ] as const).map(tab => (
                    <button
                        key={tab.value}
                        onClick={() => setSelectedTab(tab.value)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${selectedTab === tab.value
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* 已選擇的資源數量 */}
            {selectedResources.length > 0 && (
                <div className="mb-4 px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center justify-between">
                    <span className="text-indigo-900 font-medium">
                        已選擇 {selectedResources.length} 個資源
                    </span>
                    <button
                        onClick={() => setSelectedResources([])}
                        className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                        清除全部
                    </button>
                </div>
            )}

            {/* 資源列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredResources.map(resource => {
                    const isSelected = selectedResources.includes(resource.id);

                    return (
                        <button
                            key={resource.id}
                            onClick={() => toggleResource(resource.id)}
                            className={`p-4 rounded-xl border-2 text-left transition-all ${isSelected
                                    ? 'border-indigo-500 bg-indigo-50 shadow-md'
                                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                {/* 圖示 */}
                                <div className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ${getTypeColor(resource.type)}`}>
                                    {getTypeIcon(resource.type)}
                                </div>

                                {/* 內容 */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <h3 className="font-bold text-gray-900 text-sm">{resource.title}</h3>
                                        {isSelected && (
                                            <div className="flex-shrink-0 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{resource.description}</p>

                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(resource.type)}`}>
                                            {getTypeLabel(resource.type)}
                                        </span>
                                        {resource.source && (
                                            <span className="text-xs text-gray-500">• {resource.source}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* 空狀態 */}
            {filteredResources.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-lg mb-2">😕 目前沒有找到資源</p>
                    <p className="text-sm">請嘗試切換到其他分類</p>
                </div>
            )}
        </div>
    );
}
