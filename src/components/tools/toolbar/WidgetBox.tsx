// components/tools/toolbar/WidgetBox.tsx
import { X } from 'lucide-react';
import type { ToolConfig } from '../../../config/toolConfig';

interface WidgetBoxProps {
  widgetTools: ToolConfig[];
  onToolClick: (tool: ToolConfig) => void;
  onClose: () => void;
}

export function WidgetBox({ widgetTools, onToolClick, onClose }: WidgetBoxProps) {
  return (
    <div
      className="absolute bottom-20 right-0 bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/20 w-64 animate-in slide-in-from-bottom-2 ring-1 ring-black/5 z-10"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
          課堂工具
        </h4>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {widgetTools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolClick(tool)}
            className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 text-gray-600 gap-2 transition-colors border border-transparent hover:border-indigo-100"
          >
            <tool.icon className="w-6 h-6" />
            <span className="text-[10px] font-medium">{tool.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
