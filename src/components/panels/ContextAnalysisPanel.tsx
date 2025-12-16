// components/panels/ContextAnalysisPanel.tsx
import React from 'react';
import { BookOpen, Lightbulb, BarChart3, ListChecks } from 'lucide-react';
import { type UserRole } from '../../config/toolConfig';

interface ContextAnalysisPanelProps {
  selectedText: string;
  userRole: UserRole;
}

const ContextAnalysisPanel: React.FC<ContextAnalysisPanelProps> = ({
  selectedText,
  userRole
}) => {
  return (
    <div className="flex flex-col gap-6 p-4 animate-in slide-in-from-right duration-300">
      {userRole === 'student' ? (
        // 學生版 Context
        <>
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
            <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold">
              <Lightbulb className="w-5 h-5" /> AI 重點摘要
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {selectedText
                ? `針對「${selectedText}」...AI 認為這是一個關於細胞能量轉換的關鍵概念。`
                : '請先在畫布上選取文字，AI 將為您生成摘要。'}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-gray-800 font-bold">
              <ListChecks className="w-5 h-5 text-green-600" /> 自我檢測
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                Q: 粒線體的主要功能？
              </div>
            </div>
          </div>
        </>
      ) : (
        // 老師版 Context
        <>
          <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
            <div className="flex items-center gap-2 mb-2 text-orange-700 font-bold">
              <BookOpen className="w-5 h-5" /> 教學引導提示
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {selectedText
                ? `針對「${selectedText}」...歷年學生常在此處混淆呼吸作用與光合作用。`
                : '請選取文字以獲取備課建議。'}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-gray-800 font-bold">
              <BarChart3 className="w-5 h-5 text-blue-600" /> 即時班級數據
            </div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-blue-50 p-2 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">85%</div>
                <div className="text-xs text-blue-400">已讀完</div>
              </div>
              <div className="bg-red-50 p-2 rounded-lg">
                <div className="text-2xl font-bold text-red-600">3人</div>
                <div className="text-xs text-red-400">卡關中</div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ContextAnalysisPanel;
