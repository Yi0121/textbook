/**
 * NodeEditSidebar - 右側節點編輯側邊欄
 * 
 * 從 LessonPrepPreviewPage 拆分出來的組件
 * 提供節點編輯功能：標題、Agent、教學功能、條件分支、下一節點設定
 */

import { useState } from 'react';
import { X, Eye, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';
import { AVAILABLE_AGENTS, AVAILABLE_TOOLS } from '../../../types/lessonPlan';
import type { LessonNode } from '../../../types/lessonPlan';

interface NodeEditSidebarProps {
    node: LessonNode;
    allNodes: LessonNode[];
    onUpdate: (node: LessonNode) => void;
    onDelete: (nodeId: string) => void;
    onClose: () => void;
}

export default function NodeEditSidebar({
    node,
    allNodes,
    onUpdate,
    onDelete,
    onClose,
}: NodeEditSidebarProps) {
    // Accordion 狀態
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        agent: true,
        tools: false,
        condition: false,
        navigation: false,
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    return (
        <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4 space-y-3">
                {/* 標題與預覽 */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900">編輯節點</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => alert('預覽功能即將上線！將跳轉至學生學習體驗預覽。')}
                            className="p-2 bg-indigo-100 text-indigo-600 hover:bg-indigo-200 rounded-lg transition-colors"
                            title="預覽學生體驗"
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* 節點標題 */}
                <div className="bg-gray-50 rounded-xl p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        📝 節點名稱
                    </label>
                    <input
                        type="text"
                        value={node.title}
                        onChange={(e) => onUpdate({ ...node, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                    />
                </div>

                {/* Accordion: AI 助教 */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                        onClick={() => toggleSection('agent')}
                        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 transition-colors"
                    >
                        <span className="font-medium text-gray-900">🤖 AI Agent</span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                                {node.agent.name}
                            </span>
                            {expandedSections.agent ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                        </div>
                    </button>
                    {expandedSections.agent && (
                        <div className="p-4 space-y-2 border-t border-gray-100 animate-fadeIn">
                            {AVAILABLE_AGENTS.map(agent => {
                                const isSelected = node.agent.id === agent.id;
                                return (
                                    <div
                                        key={agent.id}
                                        onClick={() => onUpdate({ ...node, agent, selectedTools: [] })}
                                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                                            ? 'border-indigo-500 bg-indigo-50 shadow-md'
                                            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {isSelected && <span className="text-indigo-600">✓</span>}
                                            <span className="font-medium text-sm text-gray-900">{agent.name}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Accordion: 教學功能 */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                        onClick={() => toggleSection('tools')}
                        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors"
                    >
                        <span className="font-medium text-gray-900">⚙️ 教學功能</span>
                        <div className="flex items-center gap-2">
                            {node.selectedTools.length > 0 && (
                                <span className="text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                                    已選 {node.selectedTools.length} 項
                                </span>
                            )}
                            {expandedSections.tools ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                        </div>
                    </button>
                    {expandedSections.tools && (
                        <div className="p-4 space-y-2 border-t border-gray-100 animate-fadeIn">
                            {AVAILABLE_TOOLS
                                .filter(tool => node.agent.availableTools.includes(tool.id))
                                .map(tool => {
                                    const isSelected = node.selectedTools.some(t => t.id === tool.id);
                                    return (
                                        <div
                                            key={tool.id}
                                            onClick={() => {
                                                const newTools = isSelected
                                                    ? node.selectedTools.filter(t => t.id !== tool.id)
                                                    : [...node.selectedTools, tool];
                                                onUpdate({ ...node, selectedTools: newTools });
                                            }}
                                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                                                ? 'border-purple-500 bg-purple-50'
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-sm text-gray-900">{tool.name}</span>
                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${isSelected ? 'bg-purple-500 border-purple-500' : 'border-gray-300'
                                                    }`}>
                                                    {isSelected && <span className="text-white text-xs">✓</span>}
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{tool.description}</p>
                                        </div>
                                    );
                                })}
                            {AVAILABLE_TOOLS.filter(tool => node.agent.availableTools.includes(tool.id)).length === 0 && (
                                <div className="text-center py-4 text-sm text-gray-400">
                                    此 AI Agent 無額外功能可選
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Accordion: 條件分支 */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                        onClick={() => toggleSection('condition')}
                        className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100 transition-colors"
                    >
                        <span className="font-medium text-gray-900">🎯 條件分支</span>
                        <div className="flex items-center gap-2">
                            {node.isConditional && (
                                <span className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                                    檢查點
                                </span>
                            )}
                            {expandedSections.condition ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                        </div>
                    </button>
                    {expandedSections.condition && (
                        <div className="p-4 space-y-3 border-t border-gray-100 animate-fadeIn">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">設為學習檢查點</label>
                                <input
                                    type="checkbox"
                                    checked={node.isConditional || false}
                                    onChange={(e) => onUpdate({
                                        ...node,
                                        isConditional: e.target.checked,
                                        conditions: e.target.checked ? {
                                            learnedPath: '',
                                            notLearnedPath: '',
                                            assessmentCriteria: '完成度 ≥ 80%'
                                        } : undefined
                                    })}
                                    className="w-5 h-5 text-indigo-600 rounded"
                                />
                            </div>

                            {node.isConditional && (
                                <div className="space-y-3 bg-orange-50 p-3 rounded-lg">
                                    <p className="text-xs text-orange-700">
                                        根據學生學習成果，系統將自動選擇不同的學習路徑
                                    </p>

                                    {/* 學會路徑 */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            ✓ 學會後進入
                                        </label>
                                        <select
                                            value={node.conditions?.learnedPath || ''}
                                            onChange={(e) => onUpdate({
                                                ...node,
                                                conditions: {
                                                    ...node.conditions!,
                                                    learnedPath: e.target.value
                                                }
                                            })}
                                            className="w-full px-2 py-1.5 text-sm border border-green-300 rounded bg-white"
                                        >
                                            <option value="">選擇下一個節點</option>
                                            {allNodes
                                                .filter(n => n.id !== node.id)
                                                .map(n => (
                                                    <option key={n.id} value={n.id}>
                                                        {n.title}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>

                                    {/* 未學會路徑 */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            ✗ 未學會則進行
                                        </label>
                                        <select
                                            value={node.conditions?.notLearnedPath || ''}
                                            onChange={(e) => onUpdate({
                                                ...node,
                                                conditions: {
                                                    ...node.conditions!,
                                                    notLearnedPath: e.target.value
                                                }
                                            })}
                                            className="w-full px-2 py-1.5 text-sm border border-red-300 rounded bg-white"
                                        >
                                            <option value="">選擇補強節點</option>
                                            {allNodes
                                                .filter(n => n.id !== node.id)
                                                .map(n => (
                                                    <option key={n.id} value={n.id}>
                                                        {n.title}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>

                                    {/* 評估標準 */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            評估標準
                                        </label>
                                        <input
                                            type="text"
                                            value={node.conditions?.assessmentCriteria || ''}
                                            onChange={(e) => onUpdate({
                                                ...node,
                                                conditions: {
                                                    ...node.conditions!,
                                                    assessmentCriteria: e.target.value
                                                }
                                            })}
                                            placeholder="例：完成度 ≥ 80%"
                                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Accordion: 下一個節點 */}
                {!node.isConditional && (
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                            onClick={() => toggleSection('navigation')}
                            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 transition-colors"
                        >
                            <span className="font-medium text-gray-900">🔗 下一個節點</span>
                            <div className="flex items-center gap-2">
                                {node.nextNodeId && (
                                    <span className="text-xs text-cyan-600 bg-cyan-100 px-2 py-0.5 rounded-full">
                                        已設定
                                    </span>
                                )}
                                {expandedSections.navigation ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                            </div>
                        </button>
                        {expandedSections.navigation && (
                            <div className="p-4 space-y-3 border-t border-gray-100">
                                <select
                                    value={node.nextNodeId || ''}
                                    onChange={(e) => onUpdate({
                                        ...node,
                                        nextNodeId: e.target.value || undefined
                                    })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">自動（順序下一個）</option>
                                    {allNodes
                                        .filter(n => n.id !== node.id)
                                        .map(n => (
                                            <option key={n.id} value={n.id}>
                                                {n.title}
                                            </option>
                                        ))}
                                </select>
                                <p className="text-xs text-gray-500">
                                    可自由指定下一個節點，不受順序限制
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* 刪除按鈕 */}
                <button
                    onClick={() => onDelete(node.id)}
                    className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mt-4"
                >
                    <Trash2 className="w-4 h-4" />
                    刪除此節點
                </button>
            </div>
        </div>
    );
}
