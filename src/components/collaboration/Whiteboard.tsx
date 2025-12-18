// components/collaboration/Whiteboard.tsx
import React, { useRef, useState } from 'react';
import { X, Trash2, Users, Download, UserCheck, Clock } from 'lucide-react';
import { useCollaboration, useCurrentWhiteboard, useWhiteboardActions } from '../../context/CollaborationContext';
import { useEditor } from '../../context/EditorContext';
import { WhiteboardToolbar } from './WhiteboardToolbar';
import { WhiteboardCanvas, WhiteboardCanvasRef } from './WhiteboardCanvas';
import { StudentStagePanel, StudentStageRecord } from './StudentStagePanel';
import { StudentNameInput } from './StudentNameInput';

interface WhiteboardProps {
  onClose: () => void;
}

const Whiteboard: React.FC<WhiteboardProps> = ({ onClose }) => {
  const { state } = useCollaboration();
  const currentWhiteboard = useCurrentWhiteboard();
  const { addStroke, clearWhiteboard } = useWhiteboardActions();
  const { state: editorState, dispatch: editorDispatch } = useEditor();

  const canvasRef = useRef<WhiteboardCanvasRef>(null);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentSize, setCurrentSize] = useState(3);

  // 學生上台模式狀態
  const [studentStageRecords, setStudentStageRecords] = useState<StudentStageRecord[]>([]);
  const [showRecords, setShowRecords] = useState(false);

  // 學生身份輸入
  const [studentName, setStudentName] = useState(() => {
    return localStorage.getItem('studentName') || '';
  });
  const [showNameInput, setShowNameInput] = useState(false);

  const handleStrokeComplete = (stroke: any) => {
    if (!currentWhiteboard) return;

    const strokeWithAuthor = {
      ...stroke,
      author: state.currentUserId,
      authorRole: editorState.userRole,
    };

    addStroke(currentWhiteboard.id, strokeWithAuthor);

    // 如果是學生上台模式，記錄筆跡
    if (editorState.isStudentStage && editorState.userRole === 'student') {
      const currentStudentName = studentName || state.currentUserId;

      setStudentStageRecords(prev => {
        const existing = prev.find(r => r.studentName === currentStudentName);
        if (existing) {
          return prev.map(r =>
            r.studentName === currentStudentName
              ? { ...r, strokes: [...r.strokes, strokeWithAuthor] }
              : r
          );
        }
        return [...prev, {
          studentName: currentStudentName,
          timestamp: Date.now(),
          strokes: [strokeWithAuthor],
        }];
      });
    }
  };

  const handleClear = () => {
    if (currentWhiteboard && confirm('確定要清空白板嗎？')) {
      clearWhiteboard(currentWhiteboard.id);
    }
  };

  const handleDownload = () => {
    const dataURL = canvasRef.current?.toDataURL();
    if (!dataURL) return;

    const link = document.createElement('a');
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  };

  if (!currentWhiteboard) {
    return null;
  }

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* 白板主體 */}
      <div className="fixed inset-8 z-[151] flex flex-col bg-white dark:bg-gray-900 rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-300">
        {/* 標題列 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Users className="w-6 h-6" />
              <h2 className="text-xl font-bold">{currentWhiteboard.title}</h2>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {currentWhiteboard.participants.length} 位參與者
            </span>
            {editorState.isStudentStage && (
              <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                <UserCheck className="w-3 h-3" />
                學生上台模式
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* 學生端: 顯示姓名輸入按鈕 */}
            {editorState.userRole === 'student' && editorState.isStudentStage && (
              <button
                onClick={() => setShowNameInput(!showNameInput)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium text-sm bg-purple-100 text-purple-700 hover:bg-purple-200"
                title="設定姓名"
              >
                <UserCheck className="w-4 h-4" />
                {studentName || '設定姓名'}
              </button>
            )}

            {/* 老師端: 顯示控制按鈕 */}
            {editorState.userRole === 'teacher' && (
              <>
                <button
                  onClick={() => setShowRecords(!showRecords)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium text-sm ${
                    showRecords
                      ? 'bg-amber-100 text-amber-700'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                  title="查看共筆紀錄"
                >
                  <Clock className="w-4 h-4" />
                  共筆紀錄 {studentStageRecords.length > 0 && `(${studentStageRecords.length})`}
                </button>
                <button
                  onClick={() => editorDispatch({ type: 'TOGGLE_STUDENT_STAGE' })}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors font-medium text-sm ${
                    editorState.isStudentStage
                      ? 'bg-amber-100 text-amber-700'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}
                  title="切換學生上台模式"
                >
                  <UserCheck className="w-4 h-4" />
                  {editorState.isStudentStage ? '結束上台' : '學生上台'}
                </button>
              </>
            )}
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title="下載白板"
            >
              <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={handleClear}
              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="清空白板"
            >
              <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* 工具列 */}
        <WhiteboardToolbar
          currentColor={currentColor}
          currentSize={currentSize}
          onColorChange={setCurrentColor}
          onSizeChange={setCurrentSize}
        />

        {/* 畫布與紀錄面板 */}
        <div className="flex-1 flex gap-4 p-4 overflow-hidden">
          {/* 畫布 */}
          <div className={`${showRecords ? 'flex-1' : 'w-full'} transition-all`}>
            <WhiteboardCanvas
              ref={canvasRef}
              strokes={currentWhiteboard.strokes}
              currentColor={currentColor}
              currentSize={currentSize}
              isStudentStage={editorState.isStudentStage}
              onStrokeComplete={handleStrokeComplete}
            />
          </div>

          {/* 共筆紀錄側欄 */}
          {showRecords && (
            <StudentStagePanel
              records={studentStageRecords}
              isStudentStage={editorState.isStudentStage}
            />
          )}
        </div>

        {/* 學生姓名輸入彈窗 */}
        {showNameInput && editorState.userRole === 'student' && (
          <StudentNameInput
            studentName={studentName}
            onNameChange={setStudentName}
            onConfirm={() => setShowNameInput(false)}
            onCancel={() => setShowNameInput(false)}
          />
        )}

        {/* 提示文字 */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <p>
              💡 按住滑鼠左鍵拖曳即可繪圖，所有參與者都能看到您的繪製內容
            </p>
            {editorState.isStudentStage && (
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium">
                <div className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </div>
                <span className="text-xs">
                  {editorState.userRole === 'student'
                    ? `作答中 - ${studentName || '未設定姓名'}`
                    : '學生上台模式啟用中'
                  }
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Whiteboard;
