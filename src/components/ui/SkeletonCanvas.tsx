// components/ui/SkeletonCanvas.tsx
import React from 'react';

const SkeletonCanvas: React.FC = () => {
  return (
    <div className="h-full w-full flex justify-center py-20 bg-slate-100 dark:bg-gray-800 transition-colors">
      <div className="relative bg-white dark:bg-gray-900 shadow-2xl ring-1 ring-black/5 rounded-2xl animate-pulse" style={{ width: 1000, minHeight: 1400 }}>

        {/* 模擬刊頭 */}
        <div className="p-12 border-b-2 border-gray-100 dark:border-gray-800">
          <div className="flex gap-2 mb-3">
            <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-8 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded ml-auto"></div>
        </div>

        {/* 模擬內容區 */}
        <div className="p-12 space-y-6">
          {/* 標題 */}
          <div className="h-10 w-5/6 bg-gray-300 dark:bg-gray-600 rounded"></div>

          {/* 段落 1 */}
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-4/5 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>

          {/* 子標題 */}
          <div className="h-8 w-3/4 bg-gray-300 dark:bg-gray-600 rounded mt-8"></div>

          {/* 段落 2 */}
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>

          {/* 模擬圖片 */}
          <div className="h-64 w-full bg-gray-200 dark:bg-gray-700 rounded-lg mt-6"></div>

          {/* 段落 3 */}
          <div className="space-y-3 mt-6">
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>

        {/* 載入指示器 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">載入教材中...</p>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCanvas;
