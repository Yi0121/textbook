// components/ui/KeyboardShortcutsHelp.tsx
import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { formatShortcut, type KeyboardShortcut } from '../../hooks/useKeyboardShortcuts';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
  shortcuts: KeyboardShortcut[];
}

const KeyboardShortcutsHelp: React.FC<KeyboardShortcutsHelpProps> = ({
  isOpen,
  onClose,
  shortcuts
}) => {
  if (!isOpen) return null;

  // 按類別分組快捷鍵
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    const category = getCategoryFromDescription(shortcut.description);
    if (!acc[category]) acc[category] = [];
    acc[category].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* 主內容 */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-200">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Keyboard className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">鍵盤快捷鍵</h2>
              <p className="text-sm text-gray-500">快速操作指南</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 快捷鍵列表 */}
        <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-6">
          {Object.entries(groupedShortcuts).map(([category, items]) => (
            <div key={category} className="mb-6 last:mb-0">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                {category}
              </h3>
              <div className="space-y-2">
                {items.map((shortcut, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm text-gray-700">{shortcut.description}</span>
                    <kbd className="px-3 py-1.5 bg-white border border-gray-200 rounded-md text-xs font-mono font-bold text-gray-600 shadow-sm">
                      {formatShortcut(shortcut)}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <p className="text-xs text-gray-500 text-center">
            按下 <kbd className="px-2 py-0.5 bg-white border border-gray-200 rounded text-xs font-mono">?</kbd> 隨時查看快捷鍵
          </p>
        </div>
      </div>
    </>
  );
};

// 根據描述文字推斷分類
function getCategoryFromDescription(description: string): string {
  if (description.includes('編輯') || description.includes('模式')) return '編輯';
  if (description.includes('工具') || description.includes('畫筆') || description.includes('選取')) return '工具';
  if (description.includes('導航') || description.includes('縮放')) return '導航';
  if (description.includes('AI') || description.includes('側邊欄')) return 'AI 功能';
  return '其他';
}

export default KeyboardShortcutsHelp;
