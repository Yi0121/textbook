/**
 * AIAssistantModal - 共用 AI 助手對話框組件
 *
 * 支援兩種模式：
 * - intervention: AI 個別化補救計畫
 * - parent-comm: 親師溝通助手
 */

import { Zap, TrendingUp, Target } from 'lucide-react';

export type AIAssistantModalMode = 'intervention' | 'parent-comm' | null;

export interface AIAssistantModalProps {
    /** 是否開啟 Modal */
    isOpen: boolean;
    /** 關閉 Modal 的回呼 */
    onClose: () => void;
    /** Modal 模式：intervention (補救計畫) 或 parent-comm (親師溝通) */
    type: AIAssistantModalMode;
    /** 學生姓名 */
    studentName: string;
}

export function AIAssistantModal({
    isOpen,
    onClose,
    type,
    studentName
}: AIAssistantModalProps) {
    if (!isOpen || !type) return null;

    const isIntervention = type === 'intervention';

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className={`p-6 border-b ${isIntervention ? 'bg-red-50 border-red-100' : 'bg-indigo-50 border-indigo-100'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${isIntervention ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                            {isIntervention ? <Zap className="w-6 h-6" /> : <TrendingUp className="w-6 h-6" />}
                        </div>
                        <div>
                            <h3 className={`text-xl font-bold ${isIntervention ? 'text-red-900' : 'text-indigo-900'}`}>
                                {isIntervention ? 'AI 個別化補救計畫' : '親師溝通助手'}
                            </h3>
                            <p className={`text-sm ${isIntervention ? 'text-red-700' : 'text-indigo-700'}`}>
                                對象：{studentName}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6">
                    {isIntervention ? (
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <h4 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <Target className="w-4 h-4 text-red-500" />
                                    診斷結果
                                </h4>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    AI 分析顯示 {studentName} 在 <span className="font-bold text-red-600">移項法則</span> 的概念理解上有 3 次重複錯誤。建議立即進行針對性補救。
                                </p>
                            </div>

                            <div>
                                <h4 className="font-bold text-gray-700 mb-3">推薦補救內容 (AI 生成)</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer bg-white">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xs">影片</div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">3分鐘搞懂移項變號</div>
                                            <div className="text-xs text-gray-500">針對性概念解說</div>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded" />
                                    </div>
                                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer bg-white">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold text-xs">練習</div>
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">移項法則 - 基礎 5 題</div>
                                            <div className="text-xs text-gray-500">預計耗時 5 分鐘</div>
                                        </div>
                                        <input type="checkbox" defaultChecked className="w-5 h-5 text-indigo-600 rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                <h4 className="font-bold text-indigo-900 mb-2">AI 撰寫草稿</h4>
                                <textarea
                                    className="w-full h-32 p-3 rounded-lg border-indigo-200 bg-white text-sm text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                                    defaultValue={`親愛的家長您好：\n\n這週我想特別表揚 ${studentName} 在課堂上的表現。雖然他在「移項法則」單元遇到了一些小挑戰，但他展現了非常棒的學習態度，主動完成了 3 次額外練習。\n\n我們已經為他準備了針對性的補救影片，若您在家有空，也可以陪他一起觀看。如有任何問題歡迎隨時聯繫！\n\n導師 敬上`}
                                />
                            </div>
                            <div className="flex gap-2 text-xs text-gray-500">
                                <span className="bg-gray-100 px-2 py-1 rounded">#學習態度佳</span>
                                <span className="bg-gray-100 px-2 py-1 rounded">#需要鼓勵</span>
                                <span className="bg-gray-100 px-2 py-1 rounded">#補救教學</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        取消
                    </button>
                    <button
                        onClick={onClose}
                        className={`px-6 py-2 text-white font-bold rounded-lg shadow-lg transition-all transform active:scale-95 ${isIntervention
                            ? 'bg-red-600 hover:bg-red-700 shadow-red-200'
                            : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                            }`}
                    >
                        {isIntervention ? '一鍵指派任務' : '發送訊息'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AIAssistantModal;
