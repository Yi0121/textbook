/**
 * ResourcePanel - 左側資源面板
 * 
 * 從 LessonPrepPreviewPage 拆分出來的可收合資源列表組件
 */

import { useState } from 'react';
import { Search, ChevronLeft, ChevronDown } from 'lucide-react';
import { AVAILABLE_AGENTS } from '../../../agents/types';

// 可拖曳資源卡片組件
function DraggableResource({ id, title, desc, source, color, resourceType }: {
    id: string;
    title: string;
    desc: string;
    source: string;
    color: string;
    resourceType: 'video' | 'material' | 'worksheet' | 'external';
}) {
    const colorMap: Record<string, string> = {
        red: 'from-red-50 to-orange-50 border-red-200',
        blue: 'from-blue-50 to-cyan-50 border-blue-200',
        green: 'from-green-50 to-emerald-50 border-green-200',
        purple: 'from-purple-50 to-pink-50 border-purple-200',
    };
    const textColorMap: Record<string, string> = {
        red: 'text-red-600',
        blue: 'text-blue-600',
        green: 'text-green-600',
        purple: 'text-purple-600',
    };
    const iconMap: Record<string, string> = {
        video: '🎥',
        material: '📄',
        worksheet: '📝',
        external: '🔧',
    };

    return (
        <div
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData('application/reactflow', 'resource');
                e.dataTransfer.setData('resourceId', id);
                e.dataTransfer.setData('resourceTitle', title);
                e.dataTransfer.setData('resourceType', resourceType);
                e.dataTransfer.effectAllowed = 'move';
            }}
            className={`p-3 bg-gradient-to-br ${colorMap[color]} border-2 rounded-lg cursor-move hover:shadow-md transition-all hover:scale-[1.02]`}
        >
            <div className="flex items-center gap-2">
                <span>{iconMap[resourceType]}</span>
                <div className="font-medium text-sm text-gray-900">{title}</div>
            </div>
            <div className="text-xs text-gray-600 mt-1">{desc}</div>
            <div className={`text-xs ${textColorMap[color]} mt-1`}>{source}</div>
        </div>
    );
}

type LeftPanelTab = 'agents' | 'video' | 'material' | 'worksheet' | 'external';

interface ResourcePanelProps {
    isOpen: boolean;
    onToggle: () => void;
}

export default function ResourcePanel({ isOpen, onToggle }: ResourcePanelProps) {
    const [leftPanelTab, setLeftPanelTab] = useState<LeftPanelTab>('agents');
    const [searchQuery, setSearchQuery] = useState('');

    // 展開按鈕懸浮球
    if (!isOpen) {
        return (
            <button
                onClick={onToggle}
                className="absolute left-4 top-4 z-20 p-2 bg-white border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 text-gray-600 transition-all hover:scale-105"
                title="展開資源面板"
            >
                <ChevronDown className="w-5 h-5 rotate-90" />
            </button>
        );
    }

    return (
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out relative">
            {/* 收合按鈕 */}
            <button
                onClick={onToggle}
                className="absolute right-2 top-2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors z-10"
                title="收合面板"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {/* 分類 Tab */}
            <div className="p-3 border-b border-gray-200 bg-gray-50 pr-10">
                <div className="flex flex-wrap gap-1">
                    {([
                        { value: 'agents', label: '🤖 AI Agent', color: 'indigo' },
                        { value: 'video', label: '🎬 影片', color: 'red' },
                        { value: 'material', label: '📄 教材', color: 'blue' },
                        { value: 'worksheet', label: '📝 練習', color: 'green' },
                        { value: 'external', label: '🔧 工具', color: 'purple' },
                    ] as const).map(tab => (
                        <button
                            key={tab.value}
                            onClick={() => setLeftPanelTab(tab.value)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${leftPanelTab === tab.value
                                ? `bg-${tab.color}-600 text-white shadow-md`
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 搜尋列 */}
            <div className="p-3 border-b border-gray-200">
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="搜尋資源或 AI Agent..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* 內容區域 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <p className="text-xs text-gray-500 mb-3">拖曳到畫布以新增節點</p>

                {/* Agents */}
                {leftPanelTab === 'agents' && AVAILABLE_AGENTS
                    .filter(agent =>
                        !searchQuery ||
                        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        agent.description.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map(agent => (
                        <div
                            key={agent.id}
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData('application/reactflow', 'agent');
                                e.dataTransfer.setData('agentId', agent.id);
                                e.dataTransfer.effectAllowed = 'move';
                            }}
                            className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-lg cursor-move hover:shadow-md transition-all hover:scale-[1.02]"
                        >
                            <div className="font-medium text-sm text-gray-900 mb-1">{agent.name}</div>
                            <div className="text-xs text-indigo-600 mb-1">{agent.nameEn}</div>
                            <div className="text-xs text-gray-600 line-clamp-2">{agent.description}</div>
                        </div>
                    ))}

                {/* 影片資源 */}
                {leftPanelTab === 'video' && (
                    <>
                        <DraggableResource id="video-1" title="四則運算基礎概念" desc="3分鐘動畫講解" source="YouTube" color="red" resourceType="video" />
                        <DraggableResource id="video-2" title="混合運算實例解說" desc="實際案例演示" source="Khan Academy" color="red" resourceType="video" />
                        <DraggableResource id="video-3" title="運算順序口訣" desc="幫助記憶的歌曲" source="YouTube" color="red" resourceType="video" />
                    </>
                )}

                {/* 教材資源 */}
                {leftPanelTab === 'material' && (
                    <>
                        <DraggableResource id="material-1" title="四則運算教學簡報" desc="PowerPoint 15張" source="本地資源庫" color="blue" resourceType="material" />
                        <DraggableResource id="material-2" title="數學概念圖解 PDF" desc="視覺化圖解" source="本地資源庫" color="blue" resourceType="material" />
                        <DraggableResource id="material-3" title="運算規則海報" desc="可列印海報" source="本地資源庫" color="blue" resourceType="material" />
                    </>
                )}

                {/* 學習單 */}
                {leftPanelTab === 'worksheet' && (
                    <>
                        <DraggableResource id="worksheet-1" title="基礎運算練習單" desc="20題基礎練習" source="題庫系統" color="green" resourceType="worksheet" />
                        <DraggableResource id="worksheet-2" title="進階挑戰題組" desc="10題進階混合運算" source="題庫系統" color="green" resourceType="worksheet" />
                        <DraggableResource id="worksheet-3" title="生活應用題" desc="15題情境題" source="題庫系統" color="green" resourceType="worksheet" />
                    </>
                )}

                {/* 外部工具 */}
                {leftPanelTab === 'external' && (
                    <>
                        <DraggableResource id="external-1" title="GeoGebra 互動元件" desc="動態數學工具" source="GeoGebra" color="purple" resourceType="external" />
                        <DraggableResource id="external-2" title="Wolfram Alpha" desc="數學運算引擎" source="Wolfram" color="purple" resourceType="external" />
                        <DraggableResource id="external-3" title="Desmos 計算機" desc="圖形計算機" source="Desmos" color="purple" resourceType="external" />
                    </>
                )}
            </div>
        </div>
    );
}
