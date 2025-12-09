import React, { useState } from 'react';
import { X, BookOpen, GraduationCap, Lightbulb, MessageCircle, BarChart3, ListChecks } from 'lucide-react';
import { type UserRole } from '../../config/toolConfig'; // 引入共用的型別

interface RightSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  userRole: UserRole; // 新增：接收角色
}

// === 子組件：學生專屬內容 (AI 家教與測驗) ===
const StudentContent = ({ selectedText }: { selectedText: string }) => (
  <div className="flex flex-col gap-6 animate-in slide-in-from-right duration-500">
    {/* 1. AI 重點摘要 */}
    <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
      <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold">
        <Lightbulb className="w-5 h-5" />
        AI 重點摘要
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">
        針對「{selectedText || '目前內容'}」，AI 認為這是一個關於細胞能量轉換的關鍵概念。建議你特別注意 ATP 的生成過程。
      </p>
    </div>

    {/* 2. 隨堂測驗 */}
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3 text-gray-800 font-bold">
        <ListChecks className="w-5 h-5 text-green-600" />
        自我檢測
      </div>
      <div className="space-y-3">
        <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors border border-transparent hover:border-gray-300">
          Q: 粒線體的主要功能是什麼？
        </div>
        <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors border border-transparent hover:border-gray-300">
          Q: 為什麼它被稱為細胞發電廠？
        </div>
      </div>
    </div>
    
    <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95">
       開始 AI 對話練習
    </button>
  </div>
);

// === 子組件：老師專屬內容 (備課與數據) ===
const TeacherContent = ({ selectedText }: { selectedText: string }) => (
  <div className="flex flex-col gap-6 animate-in slide-in-from-right duration-500">
    {/* 1. 教學提示 */}
    <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
      <div className="flex items-center gap-2 mb-2 text-orange-700 font-bold">
        <BookOpen className="w-5 h-5" />
        教學引導提示
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">
        講解「{selectedText || '此段落'}」時，建議搭配 <span className="font-bold text-gray-800">3D 模型</span> 進行演示。歷年學生常在此處混淆「呼吸作用」與「光合作用」的差異。
      </p>
    </div>

    {/* 2. 班級學習狀況 */}
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-3 text-gray-800 font-bold">
        <BarChart3 className="w-5 h-5 text-blue-600" />
        即時班級數據
      </div>
      <div className="grid grid-cols-2 gap-3 text-center">
         <div className="bg-blue-50 p-2 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">85%</div>
            <div className="text-xs text-blue-400">已閱讀完畢</div>
         </div>
         <div className="bg-red-50 p-2 rounded-lg">
            <div className="text-2xl font-bold text-red-600">3人</div>
            <div className="text-xs text-red-400">停留超過 5 分鐘</div>
         </div>
      </div>
    </div>

    <div className="space-y-2">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">備課筆記</div>
        <textarea 
            className="w-full h-32 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 outline-none resize-none"
            placeholder="在此輸入您的教學備註..."
            defaultValue="- 記得提問：原核生物有粒線體嗎？"
        />
    </div>
  </div>
);

// === 主組件 ===
const RightSidePanel: React.FC<RightSidePanelProps> = ({ isOpen, onClose, selectedText, userRole }) => {
  return (
    <>
      {/* 遮罩 (點擊關閉) */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* 側邊欄本體 */}
      <div className={`
        fixed top-0 right-0 h-full w-[400px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-out
        border-l border-gray-100 flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className={`p-5 border-b flex items-center justify-between ${userRole === 'teacher' ? 'bg-orange-50' : 'bg-indigo-50'}`}>
          <div className="flex items-center gap-3">
             <div className={`p-2 rounded-lg ${userRole === 'teacher' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'}`}>
                {userRole === 'teacher' ? <GraduationCap className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
             </div>
             <div>
               <h2 className={`font-bold text-lg ${userRole === 'teacher' ? 'text-orange-900' : 'text-indigo-900'}`}>
                 {userRole === 'teacher' ? '教學輔助區' : 'AI 學習助手'}
               </h2>
               <p className="text-xs text-gray-500">
                 {userRole === 'teacher' ? '備課筆記與班級數據' : '觀念解析與測驗'}
               </p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          {userRole === 'teacher' 
            ? <TeacherContent selectedText={selectedText} />
            : <StudentContent selectedText={selectedText} />
          }
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 text-center">
            <span className="text-[10px] text-gray-400">Powered by AI Education Engine</span>
        </div>
      </div>
    </>
  );
};

export default RightSidePanel;