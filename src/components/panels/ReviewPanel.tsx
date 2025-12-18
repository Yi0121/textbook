// components/panels/ReviewPanel.tsx
import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { MOCK_STUDENT_LOGS } from '../../mocks';

const ReviewPanel: React.FC = () => {
  return (
    <div className="animate-in slide-in-from-right duration-300">
      <div className="p-3 bg-yellow-50 border-b border-yellow-100 flex items-center gap-2 text-xs text-yellow-800 mb-2">
        <ShieldAlert className="w-4 h-4" /> 檢測到潛在違規提問
      </div>
      <div className="divide-y divide-gray-100">
        {MOCK_STUDENT_LOGS.map((log) => (
          <div
            key={log.id}
            className={`p-4 hover:bg-gray-50 ${log.status === 'flagged' ? 'bg-red-50/30' : ''}`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="font-bold text-sm text-gray-800">{log.student}</span>
              {log.status === 'flagged' ? (
                <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                  需審查
                </span>
              ) : (
                <span className="text-[10px] text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                  正常
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-2">{log.query}</p>
            {log.status === 'flagged' && (
              <div className="flex gap-2">
                <button className="flex-1 bg-white border border-gray-300 text-xs py-1 rounded">
                  忽略
                </button>
                <button className="flex-1 bg-red-600 text-white text-xs py-1 rounded">
                  介入
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewPanel;
