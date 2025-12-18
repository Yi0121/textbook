// components/collaboration/StudentNameInput.tsx
import React from 'react';

interface StudentNameInputProps {
  studentName: string;
  onNameChange: (name: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const StudentNameInput: React.FC<StudentNameInputProps> = ({
  studentName,
  onNameChange,
  onConfirm,
  onCancel,
}) => {
  const handleConfirm = () => {
    if (studentName.trim()) {
      localStorage.setItem('studentName', studentName.trim());
      onConfirm();
    }
  };

  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl max-w-md mx-4 animate-in zoom-in-95 duration-200">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">
          請輸入您的姓名
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          這將用於記錄您的作答過程，方便老師識別
        </p>
        <input
          type="text"
          value={studentName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="例如: 王小明"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
          autoFocus
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            確定
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentNameInput;
