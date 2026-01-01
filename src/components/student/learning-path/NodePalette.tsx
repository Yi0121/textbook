import React from 'react';
import { BookOpen, PenTool, Video, Sparkles, Users, ClipboardCheck, Brain, RefreshCw, BarChart3, Users2, GraduationCap, Calculator, Palette, Link } from 'lucide-react';
import type { LearningNodeType } from '../../../types';

const NODE_TYPES: { type: LearningNodeType; label: string; icon: React.ReactNode }[] = [
    { type: 'chapter', label: '章節閱讀', icon: <BookOpen className="w-5 h-5" /> },
    { type: 'exercise', label: '練習題', icon: <PenTool className="w-5 h-5" /> },
    { type: 'video', label: '教學影片', icon: <Video className="w-5 h-5" /> },
    { type: 'ai_tutor', label: 'AI 家教', icon: <Sparkles className="w-5 h-5" /> },
    { type: 'collaboration', label: '小組討論', icon: <Users className="w-5 h-5" /> },
    { type: 'quiz', label: '測驗', icon: <ClipboardCheck className="w-5 h-5" /> },
];

// Agent 節點類型
const AGENT_NODE_TYPES: { type: LearningNodeType; label: string; icon: React.ReactNode; agent: string }[] = [
    { type: 'ai_diagnosis', label: 'AI 診斷', icon: <Brain className="w-5 h-5" />, agent: 'SRL Analyst' },
    { type: 'adaptive_exercise', label: '自適應練習', icon: <RefreshCw className="w-5 h-5" />, agent: 'Content Generator' },
    { type: 'learning_analytics', label: '學習分析', icon: <BarChart3 className="w-5 h-5" />, agent: 'Process Analyst' },
    { type: 'ai_grouping', label: 'AI 分組', icon: <Users2 className="w-5 h-5" />, agent: 'Grouping Agent' },
];

// 外部資源工具
const EXTERNAL_TOOLS = [
    { type: 'video', label: '因材網', icon: <GraduationCap className="w-5 h-5" />, source: 'adl' },
    { type: 'video', label: '均一教育', icon: <BookOpen className="w-5 h-5" />, source: 'junyi' },
    { type: 'video', label: 'GeoGebra', icon: <Calculator className="w-5 h-5" />, source: 'geogebra' },
    { type: 'video', label: 'Canva', icon: <Palette className="w-5 h-5" />, source: 'canva' },
    { type: 'video', label: 'YouTube', icon: <Video className="w-5 h-5" />, source: 'youtube' },
];

export const NodePalette = () => {
    const onDragStart = (event: React.DragEvent, nodeType: LearningNodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="bg-white border-r border-gray-200 w-64 flex flex-col h-full shadow-sm z-20">
            <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-800">元件庫</h3>
                <p className="text-xs text-gray-500 mt-1">拖曳元件至畫布以新增</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* 基本節點 */}
                <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">基本元件</h4>
                    <div className="space-y-2">
                        {NODE_TYPES.map((item) => (
                            <div
                                key={item.type}
                                onDragStart={(event) => onDragStart(event, item.type)}
                                draggable
                                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white cursor-grab hover:border-indigo-500 hover:shadow-md transition-all active:cursor-grabbing"
                            >
                                <div className="text-gray-500">{item.icon}</div>
                                <span className="text-sm font-medium text-gray-700">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Agent 節點 */}
                <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-purple-600 uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI Agent 元件
                    </h4>
                    <div className="space-y-2">
                        {AGENT_NODE_TYPES.map((item) => (
                            <div
                                key={item.type}
                                onDragStart={(event) => onDragStart(event, item.type)}
                                draggable
                                className="flex items-center gap-3 p-3 rounded-lg border border-purple-200 bg-purple-50/50 cursor-grab hover:border-purple-500 hover:shadow-md transition-all active:cursor-grabbing"
                            >
                                <div className="text-purple-600">{item.icon}</div>
                                <div className="flex-1">
                                    <span className="text-sm font-medium text-purple-900">{item.label}</span>
                                    <p className="text-[10px] text-purple-500">{item.agent}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 外部資源 */}
                <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-blue-600 uppercase tracking-wider flex items-center gap-1">
                        <Link className="w-3 h-3" />
                        外部資源
                    </h4>
                    <div className="space-y-2">
                        {EXTERNAL_TOOLS.map((item) => (
                            <div
                                key={item.label}
                                onDragStart={(event) => onDragStart(event, item.type as LearningNodeType)}
                                draggable
                                className="flex items-center gap-3 p-3 rounded-lg border border-blue-200 bg-blue-50/50 cursor-grab hover:border-blue-500 hover:shadow-md transition-all active:cursor-grabbing"
                            >
                                <div className="text-blue-600">{item.icon}</div>
                                <span className="text-sm font-medium text-blue-900">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
