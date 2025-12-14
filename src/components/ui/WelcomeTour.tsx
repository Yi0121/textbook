// components/ui/WelcomeTour.tsx
import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Check, Sparkles, PenTool, MessageCircle, BookOpen } from 'lucide-react';
import { type UserRole } from '../../config/toolConfig';

interface WelcomeTourProps {
  userRole: UserRole;
  onComplete: () => void;
  onSkip: () => void;
}

interface TourStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  position?: { top?: string; left?: string; right?: string; bottom?: string };
  highlightSelector?: string; // CSS selector for highlighting
}

const WelcomeTour: React.FC<WelcomeTourProps> = ({ userRole, onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);

  // 定義不同角色的引導步驟
  const tourSteps: TourStep[] = userRole === 'teacher'
    ? [
        {
          title: '歡迎來到 AI EduBoard！',
          description: '這是專為教師設計的智慧教學平台。讓我帶您快速了解主要功能。',
          icon: <Sparkles className="w-12 h-12 text-indigo-600" />
        },
        {
          title: 'AI 匯入教材',
          description: '點擊「AI 匯入」按鈕，快速匯入並智慧排版您的教學內容。AI 會自動分析並優化教材結構。',
          icon: <BookOpen className="w-12 h-12 text-blue-600" />,
          position: { top: '100px', left: '50%' }
        },
        {
          title: '編輯模式',
          description: '使用「編輯」按鈕切換到編輯模式，可以直接修改教材內容、調整格式、插入表格等。',
          icon: <PenTool className="w-12 h-12 text-green-600" />
        },
        {
          title: '繪圖工具',
          description: '底部工具列提供畫筆、螢光筆、橡皮擦等工具，可以在教材上自由標記和註解。按下快捷鍵 P 選擇畫筆。',
          icon: <PenTool className="w-12 h-12 text-purple-600" />,
          position: { bottom: '100px', left: '50%' }
        },
        {
          title: 'AI 助教功能',
          description: '點擊右上角打開 AI 中控台，可以生成測驗題、備課建議，並監控學生學習狀態。',
          icon: <MessageCircle className="w-12 h-12 text-orange-600" />,
          position: { top: '80px', right: '420px' }
        },
        {
          title: '開始使用！',
          description: '您已經準備好了！按下 ? 鍵隨時查看所有快捷鍵。祝您教學愉快！',
          icon: <Check className="w-12 h-12 text-green-600" />
        }
      ]
    : [
        {
          title: '歡迎來到 AI EduBoard！',
          description: '這是您的 AI 學習夥伴。讓我幫您快速上手吧！',
          icon: <Sparkles className="w-12 h-12 text-purple-600" />
        },
        {
          title: '閱讀教材',
          description: '中央白色區域是您的電子教科書。可以用滑鼠滾輪縮放，或按住空白鍵拖曳移動。',
          icon: <BookOpen className="w-12 h-12 text-blue-600" />
        },
        {
          title: '選取文字提問',
          description: '選取任何不懂的文字，會出現 AI 浮動選單，可以請 AI 解釋概念或生成心智圖。',
          icon: <MessageCircle className="w-12 h-12 text-indigo-600" />
        },
        {
          title: '畫筆工具',
          description: '使用底部工具列的畫筆和螢光筆，可以在教材上做筆記。按 P 鍵快速切換到畫筆。',
          icon: <PenTool className="w-12 h-12 text-pink-600" />,
          position: { bottom: '100px', left: '50%' }
        },
        {
          title: 'AI 學習助手',
          description: '點擊右上角開啟 AI 對話，隨時提問！AI 會用 Markdown 格式回答，包含程式碼、表格等。',
          icon: <Sparkles className="w-12 h-12 text-purple-600" />,
          position: { top: '80px', right: '60px' }
        },
        {
          title: '開始學習吧！',
          description: '一切就緒！記得按 ? 鍵查看所有快捷鍵。祝您學習愉快！',
          icon: <Check className="w-12 h-12 text-green-600" />
        }
      ];

  const isLastStep = currentStep === tourSteps.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentStepData = tourSteps[currentStep];

  return (
    <>
      {/* 背景遮罩 */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] animate-in fade-in duration-300" />

      {/* 主要引導卡片 */}
      <div
        className="fixed z-[201] animate-in zoom-in-95 fade-in duration-300"
        style={{
          top: currentStepData.position?.top || '50%',
          left: currentStepData.position?.left || '50%',
          right: currentStepData.position?.right,
          bottom: currentStepData.position?.bottom,
          transform: (!currentStepData.position?.right && !currentStepData.position?.bottom)
            ? 'translate(-50%, -50%)'
            : undefined
        }}
      >
        <div className="bg-white rounded-2xl shadow-2xl w-[500px] max-w-[90vw] overflow-hidden">
          {/* Header */}
          <div className={`p-6 ${userRole === 'teacher' ? 'bg-gradient-to-r from-orange-50 to-yellow-50' : 'bg-gradient-to-r from-indigo-50 to-purple-50'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${userRole === 'teacher' ? 'bg-orange-100' : 'bg-indigo-100'}`}>
                  {currentStepData.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{currentStepData.title}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    步驟 {currentStep + 1} / {tourSteps.length}
                  </p>
                </div>
              </div>
              <button
                onClick={onSkip}
                className="p-2 hover:bg-black/5 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                title="跳過引導"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 進度條 */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${userRole === 'teacher' ? 'bg-orange-500' : 'bg-indigo-500'}`}
                style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* 內容 */}
          <div className="p-6">
            <p className="text-gray-700 text-lg leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex items-center justify-between gap-4">
            <button
              onClick={onSkip}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
            >
              跳過引導
            </button>

            <div className="flex gap-2">
              {!isFirstStep && (
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg flex items-center gap-2 transition-colors font-medium"
                >
                  <ChevronLeft className="w-4 h-4" />
                  上一步
                </button>
              )}
              <button
                onClick={handleNext}
                className={`px-6 py-2 rounded-lg flex items-center gap-2 transition-all font-medium shadow-md hover:shadow-lg ${
                  userRole === 'teacher'
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
                } text-white`}
              >
                {isLastStep ? (
                  <>
                    <Check className="w-4 h-4" />
                    開始使用
                  </>
                ) : (
                  <>
                    下一步
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomeTour;
