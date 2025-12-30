import { Layers, X, Bot, Wrench, Video, FileText, CheckSquare, Plus, Trash2 } from 'lucide-react';
import type { LessonNode, ActivityNode, ResourceBinding } from '../../types/lessonPlan';
import { AVAILABLE_AGENTS } from '../../types/agents';
import { AVAILABLE_TOOLS } from '../../types/tools';
import ResourcePickerModal from '../../components/ResourcePickerModal';
import { useState } from 'react';

// Props Interface
interface NodePropertyPanelProps {
    selectedNode: LessonNode | null;
    selectedActivity: ActivityNode | null;
    selectedActivityId: string | null;
    lessonNodes: LessonNode[];
    onClose: () => void;

    // Updates
    onUpdateNode: (nodeId: string, updates: Partial<LessonNode>) => void;
    onDeleteNode: (nodeId: string) => void;
    onAddResourceToActivity: (activityId: string, resource: ResourceBinding) => void;
}

export function NodePropertyPanel({
    selectedNode,
    selectedActivity,
    selectedActivityId,
    lessonNodes,
    onClose,
    onUpdateNode,
    onDeleteNode,
    onAddResourceToActivity
}: NodePropertyPanelProps) {
    const [isResourcePickerOpen, setIsResourcePickerOpen] = useState(false);

    // If nothing selected, render nothing
    if (!selectedNode && !selectedActivity) return null;

    return (
        <>
            {/* Legacy Node Editor */}
            {selectedNode && (
                <div className="w-80 bg-white border-l border-gray-200 shadow-lg h-full z-40 overflow-y-auto absolute right-0 top-0 bottom-0">
                    <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="font-bold text-gray-800 flex items-center gap-2">
                            <Layers size={16} className="text-indigo-500" />
                            編輯節點
                        </h2>
                        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg">
                            <X size={18} className="text-gray-400" />
                        </button>
                    </div>

                    <div className="p-4 space-y-4">
                        <input
                            type="text"
                            value={selectedNode.title}
                            onChange={e => onUpdateNode(selectedNode.id, { title: e.target.value })}
                            className="w-full text-base font-bold text-gray-800 border-b-2 border-gray-200 focus:border-indigo-500 bg-transparent py-2 focus:outline-none"
                            placeholder="節點名稱"
                        />

                        {/* Agent Selection */}
                        <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                <Bot size={12} /> AI Agent
                            </label>
                            <select
                                value={selectedNode.agent.id}
                                onChange={e => {
                                    const agent = AVAILABLE_AGENTS.find(a => a.id === e.target.value);
                                    if (agent) {
                                        onUpdateNode(selectedNode.id, { agent, selectedTools: [] });
                                    }
                                }}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                            >
                                {AVAILABLE_AGENTS.map(agent => (
                                    <option key={agent.id} value={agent.id}>{agent.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Tools Selection */}
                        {AVAILABLE_TOOLS.filter(t => selectedNode.agent.availableTools.includes(t.id)).length > 0 && (
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                    <Wrench size={12} /> 教學功能
                                </label>
                                <div className="space-y-1.5">
                                    {AVAILABLE_TOOLS
                                        .filter(tool => selectedNode.agent.availableTools.includes(tool.id))
                                        .map(tool => {
                                            const isSelected = selectedNode.selectedTools?.some(t => t.id === tool.id);
                                            return (
                                                <label
                                                    key={tool.id}
                                                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-purple-50' : 'hover:bg-gray-50'}`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected || false}
                                                        onChange={() => {
                                                            const newTools = isSelected
                                                                ? selectedNode.selectedTools?.filter(t => t.id !== tool.id)
                                                                : [...(selectedNode.selectedTools || []), tool];
                                                            onUpdateNode(selectedNode.id, { selectedTools: newTools });
                                                        }}
                                                        className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                                    />
                                                    <span className="text-sm text-gray-700">{tool.name}</span>
                                                </label>
                                            );
                                        })}
                                </div>
                            </div>
                        )}

                        {/* Divider & Conditional Logic */}
                        <div className="border-t border-gray-100 pt-4">
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-sm font-medium text-gray-700">條件分支</span>
                                <input
                                    type="checkbox"
                                    checked={selectedNode.isConditional || false}
                                    onChange={e => onUpdateNode(selectedNode.id, {
                                        isConditional: e.target.checked,
                                        conditions: e.target.checked ? { learnedPath: '', notLearnedPath: '' } : undefined
                                    })}
                                    className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                />
                            </label>

                            {selectedNode.isConditional && (
                                <div className="mt-3 space-y-3">
                                    <div>
                                        <label className="text-xs text-green-600 font-medium">✓ 通過後</label>
                                        <select
                                            className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                            value={selectedNode.conditions?.learnedPath || ''}
                                            onChange={e => onUpdateNode(selectedNode.id, {
                                                conditions: { ...selectedNode.conditions!, learnedPath: e.target.value }
                                            })}
                                        >
                                            <option value="">選擇節點...</option>
                                            {lessonNodes.filter(n => n.id !== selectedNode.id).map(n => (
                                                <option key={n.id} value={n.id}>{n.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs text-orange-600 font-medium">✗ 補救路徑</label>
                                        <select
                                            className="w-full mt-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                            value={selectedNode.conditions?.notLearnedPath || ''}
                                            onChange={e => onUpdateNode(selectedNode.id, {
                                                conditions: { ...selectedNode.conditions!, notLearnedPath: e.target.value }
                                            })}
                                        >
                                            <option value="">選擇補強...</option>
                                            {lessonNodes.filter(n => n.id !== selectedNode.id).map(n => (
                                                <option key={n.id} value={n.id}>{n.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Next Node Selector */}
                        {!selectedNode.isConditional && (
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                    → 下一節點
                                </label>
                                <select
                                    value={selectedNode.nextNodeId || ''}
                                    onChange={e => onUpdateNode(selectedNode.id, { nextNodeId: e.target.value || undefined })}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                >
                                    <option value="">自動（下一個節點）</option>
                                    {lessonNodes.filter(n => n.id !== selectedNode.id).map(n => (
                                        <option key={n.id} value={n.id}>{n.title}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <button
                            onClick={() => onDeleteNode(selectedNode.id)}
                            className="w-full py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                        >
                            <Trash2 size={14} /> 刪除節點
                        </button>
                    </div>
                </div>
            )}

            {/* Activity Resource Binding Sidebar */}
            {selectedActivity && (
                <div className="w-96 bg-white border-l border-gray-200 shadow-lg h-full z-40 overflow-y-auto absolute right-0 top-0 bottom-0">
                    <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-purple-500 z-10 px-4 py-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-white flex items-center gap-2">
                                <Layers size={18} />
                                活動教學資源
                            </h2>
                            <button
                                onClick={onClose}
                                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X size={18} className="text-white" />
                            </button>
                        </div>
                        <p className="text-white/80 text-sm mt-1 truncate">{selectedActivity.title}</p>
                    </div>
                    <div className="p-4 space-y-5">
                        {/* Activity Info */}
                        <div className="bg-gray-50 rounded-xl p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`
                                w-10 h-10 rounded-lg flex items-center justify-center
                                ${selectedActivity.type === 'checkpoint' ? 'bg-orange-100' :
                                        selectedActivity.type === 'remedial' ? 'bg-amber-100' :
                                            selectedActivity.type === 'practice' ? 'bg-green-100' : 'bg-blue-100'}
                            `}>
                                    {selectedActivity.type === 'intro' && '🎬'}
                                    {selectedActivity.type === 'teaching' && '📖'}
                                    {selectedActivity.type === 'practice' && '✏️'}
                                    {selectedActivity.type === 'checkpoint' && '🎯'}
                                    {selectedActivity.type === 'remedial' && '🔄'}
                                    {selectedActivity.type === 'application' && '🚀'}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">{selectedActivity.title}</h3>
                                    <p className="text-xs text-gray-500">
                                        {selectedActivity.type.charAt(0).toUpperCase() + selectedActivity.type.slice(1)} •
                                        {selectedActivity.estimatedMinutes} 分鐘
                                    </p>
                                </div>
                            </div>
                            {selectedActivity.description && (
                                <p className="text-sm text-gray-600">{selectedActivity.description}</p>
                            )}
                        </div>

                        {/* Resources List */}
                        <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                <FileText size={14} />
                                教學資源 ({selectedActivity.resources.length})
                            </h4>
                            <div className="space-y-3">
                                {selectedActivity.resources.map((resource, idx) => (
                                    <div
                                        key={resource.id}
                                        className={`
                                        p-3 rounded-xl border-2 transition-all cursor-pointer
                                        ${resource.isDefault
                                                ? 'border-indigo-300 bg-indigo-50/50 shadow-sm'
                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                            }
                                    `}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`
                                            w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                                            ${resource.resourceType === 'video' ? 'bg-red-100' :
                                                    resource.resourceType === 'material' ? 'bg-blue-100' :
                                                        resource.resourceType === 'worksheet' ? 'bg-green-100' :
                                                            resource.resourceType === 'interactive' ? 'bg-purple-100' : 'bg-gray-100'}
                                        `}>
                                                {resource.resourceType === 'video' && <Video size={16} className="text-red-600" />}
                                                {resource.resourceType === 'material' && <FileText size={16} className="text-blue-600" />}
                                                {resource.resourceType === 'worksheet' && <CheckSquare size={16} className="text-green-600" />}
                                                {resource.resourceType === 'interactive' && <Wrench size={16} className="text-purple-600" />}
                                                {resource.resourceType === 'external' && <FileText size={16} className="text-gray-600" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium text-gray-800 truncate">
                                                        {resource.generatedContent?.materials?.[0] || `資源 ${idx + 1}`}
                                                    </span>
                                                    {resource.isDefault && (
                                                        <span className="px-1.5 py-0.5 bg-indigo-500 text-white text-[10px] rounded font-medium shrink-0">
                                                            預設
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {resource.resourceType} • {resource.agent.name}
                                                </p>
                                                {resource.generatedContent?.exercises && (
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        包含 {resource.generatedContent.exercises} 道練習題
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Tools Badge */}
                                        {resource.tools && resource.tools.length > 0 && (
                                            <div className="mt-2 pt-2 border-t border-gray-100 flex flex-wrap gap-1">
                                                {resource.tools.map(tool => (
                                                    <span
                                                        key={tool.id}
                                                        className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full"
                                                    >
                                                        {tool.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Add Resource Button */}
                        <button
                            onClick={() => setIsResourcePickerOpen(true)}
                            className="w-full py-2.5 border-2 border-dashed border-gray-300 hover:border-indigo-400 rounded-xl text-sm text-gray-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            新增教學資源
                        </button>
                    </div>

                    <ResourcePickerModal
                        isOpen={isResourcePickerOpen}
                        onClose={() => setIsResourcePickerOpen(false)}
                        onSelect={(resource) => {
                            if (selectedActivityId) {
                                // Create generic resource binding
                                const newResource: ResourceBinding = {
                                    id: resource.id || `resource-${Date.now()}`,
                                    resourceType: resource.resourceType || 'material',
                                    agent: resource.agent!,
                                    tools: resource.tools || [],
                                    isDefault: selectedActivity.resources.length === 0,
                                    generatedContent: resource.generatedContent,
                                };
                                onAddResourceToActivity(selectedActivityId, newResource);
                            }
                        }}
                        currentResources={selectedActivity?.resources ?? []}
                    />
                </div>
            )}
        </>
    );
}
