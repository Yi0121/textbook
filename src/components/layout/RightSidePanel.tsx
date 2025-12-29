// components/layout/RightSidePanel.tsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  X,
  BookOpen,
  GraduationCap,
  MessageCircle,
  UploadCloud,
  ShieldAlert,
  Bot,
  Sparkles,
} from 'lucide-react';
import { type UserRole } from '../../config/toolConfig';

// 分拆的子組件
import {
  ContextAnalysisPanel,
  ChatPanel,
  MaterialLibraryPanel,
  ReviewPanel
} from '../panels';
import TeacherAgentPanel from '../features/TeacherAgentPanel';

interface RightSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  userRole: UserRole;
  initialTab?: 'context' | 'chat' | 'agent';
}

type TabType = 'context' | 'chat' | 'upload' | 'review' | 'agent';

const RightSidePanel: React.FC<RightSidePanelProps> = ({
  isOpen,
  onClose,
  selectedText,
  userRole,
  initialTab
}) => {
  // 教師預設顯示 AI 助教，學生預設顯示內容分析
  const getDefaultTab = useCallback((): TabType => {
    if (userRole === 'teacher') return 'agent';
    return 'context';
  }, [userRole]);

  const [activeTab, setActiveTab] = useState<TabType>(() => getDefaultTab());

  // 當側邊欄打開時，根據角色設定預設分頁
  useEffect(() => {
    if (isOpen) {
      // 如果有明確指定 initialTab 就用，否則用角色預設
      const targetTab = initialTab || getDefaultTab();
      // 使用函數式更新，只有當目標分頁與當前分頁不同時才更新
      setActiveTab(prev => prev !== targetTab ? targetTab : prev);
    }
  }, [isOpen, initialTab, getDefaultTab]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-[70] shadow-2xl
          transform transition-transform duration-300 ease-out border-l border-gray-100 flex flex-col
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div
          className={`p-4 border-b flex items-center justify-between ${userRole === 'teacher' ? 'bg-orange-50' : 'bg-indigo-50'
            }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${userRole === 'teacher'
                ? 'bg-orange-100 text-orange-600'
                : 'bg-indigo-100 text-indigo-600'
                }`}
            >
              {userRole === 'teacher' ? (
                <GraduationCap className="w-6 h-6" />
              ) : (
                <Bot className="w-6 h-6" />
              )}
            </div>
            <div>
              <h2
                className={`font-bold text-lg ${userRole === 'teacher' ? 'text-orange-900' : 'text-indigo-900'
                  }`}
              >
                {userRole === 'teacher' ? '教學中控台' : 'AI 學習助手'}
              </h2>
              <p className="text-xs text-gray-500">Integrated Learning System</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-black/5 rounded-full text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-100 bg-white">
          {/* 教師模式 Tabs */}
          {userRole === 'teacher' ? (
            <>
              <button
                onClick={() => setActiveTab('agent')}
                className={`flex-1 py-3 text-xs font-bold flex flex-col items-center gap-1 border-b-2 transition-colors ${activeTab === 'agent'
                  ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
              >
                <Sparkles className="w-4 h-4" /> AI 助教
              </button>
              <button
                onClick={() => setActiveTab('context')}
                className={`flex-1 py-3 text-xs font-bold flex flex-col items-center gap-1 border-b-2 transition-colors ${activeTab === 'context'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
              >
                <BookOpen className="w-4 h-4" /> 內容分析
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-3 text-xs font-bold flex flex-col items-center gap-1 border-b-2 transition-colors ${activeTab === 'upload'
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
              >
                <UploadCloud className="w-4 h-4" /> 教材庫
              </button>
              <button
                onClick={() => setActiveTab('review')}
                className={`flex-1 py-3 text-xs font-bold flex flex-col items-center gap-1 border-b-2 transition-colors ${activeTab === 'review'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
              >
                <ShieldAlert className="w-4 h-4" /> 審查
              </button>
            </>
          ) : (
            /* 學生模式 Tabs */
            <>
              <button
                onClick={() => setActiveTab('context')}
                className={`flex-1 py-3 text-xs font-bold flex flex-col items-center gap-1 border-b-2 transition-colors ${activeTab === 'context'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
              >
                <BookOpen className="w-4 h-4" /> 內容分析
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-3 text-xs font-bold flex flex-col items-center gap-1 border-b-2 transition-colors ${activeTab === 'chat'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
              >
                <MessageCircle className="w-4 h-4" /> AI 對話
              </button>
            </>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white scrollbar-thin">
          {activeTab === 'agent' && <TeacherAgentPanel onClose={onClose} />}
          {activeTab === 'context' && (
            <ContextAnalysisPanel selectedText={selectedText} userRole={userRole} />
          )}
          {activeTab === 'chat' && <ChatPanel userRole={userRole} />}
          {activeTab === 'upload' && <MaterialLibraryPanel />}
          {activeTab === 'review' && <ReviewPanel />}
        </div>
      </div>
    </>
  );
};

export default RightSidePanel;


