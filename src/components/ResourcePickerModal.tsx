/**
 * ResourcePickerModal - 教學資源選擇器 Modal
 * 用於從可用的 AI 代理人和教學工具中選擇資源添加到活動
 */

import { useState, useMemo, useId } from 'react';
import { X, Video, FileText, CheckSquare, Wrench, Bot, Sparkles, Search, ExternalLink } from 'lucide-react';
import type { Agent, Tool, ResourceBinding } from '../types/lessonPlan';
import { AVAILABLE_AGENTS, AVAILABLE_TOOLS } from '../types/lessonPlan';

interface ResourcePickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (resource: Partial<ResourceBinding>) => void;
    currentResources: ResourceBinding[];
}

type TabType = 'agents' | 'tools';

// 資源類型對應的圖示
const resourceTypeIcons: Record<ResourceBinding['resourceType'], React.ComponentType<{ className?: string; size?: number }>> = {
    video: Video,
    material: FileText,
    worksheet: CheckSquare,
    interactive: Wrench,
    external: ExternalLink,
};

// 代理類型對應資源類型的建議
const agentToResourceType: Record<string, ResourceBinding['resourceType']> = {
    'video-tutor': 'video',
    'teaching-agent': 'material',
    'exercise-agent': 'worksheet',
    'interactive-agent': 'interactive',
};

export default function ResourcePickerModal({
    isOpen,
    onClose,
    onSelect,
    currentResources,
}: ResourcePickerModalProps) {
    const resourceIdBase = useId();
    const [activeTab, setActiveTab] = useState<TabType>('agents');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
    const [resourceType, setResourceType] = useState<ResourceBinding['resourceType']>('material');

    // 過濾已添加的代理人
    const addedAgentIds = useMemo(() =>
        new Set(currentResources.map(r => r.agent.id)),
        [currentResources]
    );

    // 過濾搜尋結果
    const filteredAgents = useMemo(() =>
        AVAILABLE_AGENTS.filter(agent =>
            !addedAgentIds.has(agent.id) &&
            (agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                agent.description.toLowerCase().includes(searchQuery.toLowerCase()))
        ),
        [searchQuery, addedAgentIds]
    );

    const filteredTools = useMemo(() =>
        AVAILABLE_TOOLS.filter(tool =>
            tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        [searchQuery]
    );

    // 處理代理人選擇
    const handleAgentSelect = (agent: Agent) => {
        setSelectedAgent(agent);
        // 自動推薦資源類型
        setResourceType(agentToResourceType[agent.id] || 'material');
    };

    // 處理工具選擇
    const handleToolToggle = (tool: Tool) => {
        setSelectedTools(prev =>
            prev.includes(tool)
                ? prev.filter(t => t.id !== tool.id)
                : [...prev, tool]
        );
    };

    // 確認添加
    const handleConfirm = () => {
        if (!selectedAgent) return;

        const newResource: Partial<ResourceBinding> = {
            id: `${resourceIdBase}-${currentResources.length}`,
            resourceType,
            agent: selectedAgent,
            tools: selectedTools,
            isDefault: currentResources.length === 0, // 如果是第一個，設為預設
            generatedContent: {
                materials: [`${selectedAgent.name} 生成的教材`],
            },
        };

        onSelect(newResource);
        handleClose();
    };

    // 重置並關閉
    const handleClose = () => {
        setSelectedAgent(null);
        setSelectedTools([]);
        setSearchQuery('');
        setActiveTab('agents');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-[500px] max-h-[80vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-4 flex items-center justify-between">
                    <h2 className="font-bold text-white text-lg flex items-center gap-2">
                        <Sparkles size={20} />
                        選擇教學資源
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-white" />
                    </button>
                </div>

                {/* Search */}
                <div className="px-5 py-3 border-b">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="搜尋代理人或工具..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all text-sm"
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-5 py-2 border-b flex gap-2">
                    <button
                        onClick={() => setActiveTab('agents')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'agents'
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-gray-500 hover:bg-gray-100'
                            }`}
                    >
                        <Bot size={14} className="inline mr-1.5" />
                        AI 代理人
                    </button>
                    <button
                        onClick={() => setActiveTab('tools')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'tools'
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'text-gray-500 hover:bg-gray-100'
                            }`}
                    >
                        <Wrench size={14} className="inline mr-1.5" />
                        教學工具
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5">
                    {activeTab === 'agents' ? (
                        <div className="space-y-3">
                            {filteredAgents.length === 0 ? (
                                <p className="text-gray-500 text-center py-8 text-sm">
                                    沒有可用的代理人，或已全部添加
                                </p>
                            ) : (
                                filteredAgents.map(agent => (
                                    <button
                                        key={agent.id}
                                        onClick={() => handleAgentSelect(agent)}
                                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selectedAgent?.id === agent.id
                                            ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2.5 rounded-lg ${selectedAgent?.id === agent.id
                                                ? 'bg-indigo-100'
                                                : 'bg-gray-100'
                                                }`}>
                                                <Bot size={20} className={
                                                    selectedAgent?.id === agent.id
                                                        ? 'text-indigo-600'
                                                        : 'text-gray-500'
                                                } />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-800">{agent.name}</h4>
                                                <p className="text-sm text-gray-500 mt-0.5">{agent.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-sm text-gray-500 mb-3">
                                選擇要搭配使用的教學工具（可選多個）
                            </p>
                            {filteredTools.map(tool => (
                                <button
                                    key={tool.id}
                                    onClick={() => handleToolToggle(tool)}
                                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${selectedTools.includes(tool)
                                        ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2.5 rounded-lg ${selectedTools.includes(tool)
                                            ? 'bg-green-100'
                                            : 'bg-gray-100'
                                            }`}>
                                            <Wrench size={20} className={
                                                selectedTools.includes(tool)
                                                    ? 'text-green-600'
                                                    : 'text-gray-500'
                                            } />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800">{tool.name}</h4>
                                            <p className="text-sm text-gray-500 mt-0.5">{tool.description}</p>
                                        </div>
                                        {selectedTools.includes(tool) && (
                                            <span className="text-green-600 text-sm font-medium">已選擇</span>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Selected Agent Summary & Resource Type */}
                {selectedAgent && (
                    <div className="px-5 py-4 border-t bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-600">已選擇代理人：</span>
                            <span className="font-medium text-indigo-600">{selectedAgent.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">資源類型：</span>
                            <div className="flex gap-2">
                                {(Object.keys(resourceTypeIcons) as ResourceBinding['resourceType'][]).map(type => {
                                    const Icon = resourceTypeIcons[type];
                                    return (
                                        <button
                                            key={type}
                                            onClick={() => setResourceType(type)}
                                            className={`p-2 rounded-lg transition-all ${resourceType === type
                                                ? 'bg-indigo-100 text-indigo-600 ring-2 ring-indigo-300'
                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                }`}
                                            title={type}
                                        >
                                            <Icon size={18} />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="px-5 py-4 border-t bg-white flex justify-end gap-3">
                    <button
                        onClick={handleClose}
                        className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedAgent}
                        className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedAgent
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        添加資源
                    </button>
                </div>
            </div>
        </div>
    );
}
