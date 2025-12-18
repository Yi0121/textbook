// components/collaboration/StudentStagePanel.tsx
import React from 'react';
import { Clock, Users, RotateCcw, Download } from 'lucide-react';

export interface StudentStageRecord {
  studentName: string;
  timestamp: number;
  strokes: any[];
}

interface StudentStagePanelProps {
  records: StudentStageRecord[];
  isStudentStage: boolean;
}

export const StudentStagePanel: React.FC<StudentStagePanelProps> = ({
  records,
  isStudentStage,
}) => {
  const handleReplay = (record: StudentStageRecord) => {
    alert(`🎬 重播 ${record.studentName} 的作答過程\n\n筆跡數: ${record.strokes.length}\n時間: ${new Date(record.timestamp).toLocaleString()}`);
  };

  const handleExport = (record: StudentStageRecord) => {
    const exportData = {
      studentName: record.studentName,
      timestamp: record.timestamp,
      date: new Date(record.timestamp).toLocaleString('zh-TW'),
      strokesCount: record.strokes.length,
      strokes: record.strokes,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `白板作答_${record.studentName}_${new Date(record.timestamp).toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-80 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 overflow-y-auto animate-in slide-in-from-right duration-300">
      <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-indigo-600" />
        學生共筆紀錄
      </h3>

      {/* 說明文字 */}
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          💡 學生上台模式啟用時，系統會自動記錄學生的繪圖過程，方便老師事後檢閱。
        </p>
      </div>

      {records.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isStudentStage
              ? '等待學生開始作答...'
              : '尚無學生上台紀錄\n請先開啟「學生上台」模式'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {record.studentName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-gray-800 dark:text-gray-200">
                      {record.studentName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(record.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-indigo-600">
                    {record.strokes.length} 筆
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  className="flex-1 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center justify-center gap-1"
                  onClick={() => handleReplay(record)}
                >
                  <RotateCcw className="w-3 h-3" />
                  重播
                </button>
                <button
                  className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-1"
                  onClick={() => handleExport(record)}
                >
                  <Download className="w-3 h-3" />
                  匯出
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentStagePanel;
