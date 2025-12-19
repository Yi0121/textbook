import React from 'react';
import { BookOpen, PenTool, Video, Sparkles, Users, ClipboardCheck } from 'lucide-react';
import type { LearningNodeType } from '../../../types';

const NODE_TYPES: { type: LearningNodeType; label: string; icon: React.ReactNode }[] = [
    { type: 'chapter', label: '章節閱讀', icon: <BookOpen className="w-5 h-5" /> },
    { type: 'exercise', label: '練習題', icon: <PenTool className="w-5 h-5" /> },
    { type: 'video', label: '教學影片', icon: <Video className="w-5 h-5" /> },
    { type: 'ai_tutor', label: 'AI 家教', icon: <Sparkles className="w-5 h-5" /> },
    { type: 'collaboration', label: '小組討論', icon: <Users className="w-5 h-5" /> },
    { type: 'quiz', label: '測驗', icon: <ClipboardCheck className="w-5 h-5" /> },
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

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {NODE_TYPES.map((item) => (
                    <div
                        key={item.type}
                        onDragStart={(event) => onDragStart(event, item.type)}
                        draggable
                        className={`
              flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white 
              cursor-grab hover:border-indigo-500 hover:shadow-md transition-all
              active:cursor-grabbing
            `}
                    >
                        <div className="text-gray-500 group-hover:text-indigo-600">
                            {item.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
