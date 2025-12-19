/**
 * LearningPathTab - AI 學習路徑分析與編輯
 *
 * 功能：
 * - 學生列表與 AI 分析觸發
 * - WorkflowEditor 整合顯示
 * - 學習記錄統計面板
 */

import { GitBranch } from 'lucide-react';

export function LearningPathTab() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-md">
        <GitBranch className="w-20 h-20 text-gray-300 mx-auto mb-6" />
        <h3 className="text-2xl font-bold text-gray-700 mb-3">
          AI 學習路徑編排系統
        </h3>
        <p className="text-gray-500 mb-6">
          此功能可讓教師針對學生的學習狀況，使用 AI 分析推薦個性化學習路徑，
          並透過視覺化流程圖編輯器進行調整。
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
          <h4 className="font-bold text-blue-800 mb-2">功能規劃</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 學生學習記錄分析</li>
            <li>• AI 智慧推薦學習路徑</li>
            <li>• 視覺化流程圖編輯器</li>
            <li>• 多種學習節點類型（章節、練習、影片、AI 輔導等）</li>
            <li>• 學習進度追蹤</li>
          </ul>
        </div>
        <p className="text-gray-400 text-sm mt-6">
          此區域預留給教師自訂內容與功能擴展
        </p>
      </div>
    </div>
  );
}
