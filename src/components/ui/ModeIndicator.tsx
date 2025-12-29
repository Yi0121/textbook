// components/ui/ModeIndicator.tsx
import React from 'react';
import {
    MousePointer2,
    Edit3,
    Pen,
    Highlighter,
    Eraser,
    Move,
    Pointer,
    Type
} from 'lucide-react';

interface ModeIndicatorProps {
    isEditMode: boolean;
    currentTool: string;
    isSpacePressed?: boolean;
    userRole: 'teacher' | 'student' | 'all';
}

const toolConfig: Record<string, { icon: React.ComponentType<any>; label: string; color: string }> = {
    cursor: { icon: MousePointer2, label: '游標', color: 'bg-slate-500' },
    pen: { icon: Pen, label: '畫筆', color: 'bg-blue-500' },
    highlighter: { icon: Highlighter, label: '螢光筆', color: 'bg-yellow-500' },
    eraser: { icon: Eraser, label: '橡皮擦', color: 'bg-pink-500' },
    text: { icon: Type, label: '文字', color: 'bg-purple-500' },
    laser: { icon: Pointer, label: '雷射筆', color: 'bg-red-500' },
};

/**
 * 模式指示器 - 顯示當前的操作模式
 */
const ModeIndicator: React.FC<ModeIndicatorProps> = ({
    isEditMode,
    currentTool,
    isSpacePressed = false,
}) => {
    // 決定當前模式
    const getCurrentMode = () => {
        if (isSpacePressed) {
            return { icon: Move, label: '拖曳畫布', color: 'bg-emerald-500', hint: '放開空白鍵結束' };
        }
        if (isEditMode) {
            return { icon: Edit3, label: '編輯模式', color: 'bg-indigo-500', hint: '點擊文字開始編輯' };
        }

        const tool = toolConfig[currentTool];
        if (tool) {
            return { ...tool, hint: getToolHint(currentTool) };
        }

        return { icon: MousePointer2, label: '閱讀模式', color: 'bg-slate-500', hint: '按空白鍵拖曳畫布' };
    };

    const getToolHint = (tool: string) => {
        switch (tool) {
            case 'pen': return '拖曳繪製線條';
            case 'highlighter': return '拖曳繪製螢光';
            case 'eraser': return '拖曳擦除筆跡';
            case 'text': return '點擊新增文字';
            case 'laser': return '移動顯示雷射';
            default: return '按空白鍵拖曳畫布';
        }
    };

    const mode = getCurrentMode();
    const Icon = mode.icon;

    return (
        <div className="fixed bottom-4 left-4 z-40 pointer-events-none">
            <div className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-md
                ${mode.color} text-white text-xs
                transition-all duration-200 ease-out
                opacity-80 hover:opacity-100
            `}>
                <Icon className="w-3.5 h-3.5" />
                <span className="font-medium">{mode.label}</span>
                <span className="opacity-60 hidden sm:inline">• {mode.hint}</span>
            </div>
        </div>
    );
};

export default ModeIndicator;
