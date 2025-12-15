// components/collaboration/Whiteboard.tsx
import React, { useRef, useState, useEffect } from 'react';
import { X, Trash2, Users, Download, UserCheck, Clock, RotateCcw } from 'lucide-react';
import { useCollaboration, useCurrentWhiteboard, useWhiteboardActions } from '../../context/CollaborationContext';
import { useEditor } from '../../context/EditorContext';

interface WhiteboardProps {
  onClose: () => void;
}

const Whiteboard: React.FC<WhiteboardProps> = ({ onClose }) => {
  const { state } = useCollaboration();
  const currentWhiteboard = useCurrentWhiteboard();
  const { addStroke, clearWhiteboard } = useWhiteboardActions();
  const { state: editorState, dispatch: editorDispatch } = useEditor();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentSize, setCurrentSize] = useState(3);

  // 學生上台模式狀態
  const [studentStageRecords, setStudentStageRecords] = useState<Array<{
    studentName: string;
    timestamp: number;
    strokes: any[];
  }>>([]);
  const [showRecords, setShowRecords] = useState(false);

  // 學生身份輸入 (用於學生端)
  const [studentName, setStudentName] = useState(() => {
    // 從 localStorage 讀取學生姓名 (如果之前輸入過)
    return localStorage.getItem('studentName') || '';
  });
  const [showNameInput, setShowNameInput] = useState(false);

  // 初始化畫布
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 設定畫布大小
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // 繪製現有筆觸
    if (currentWhiteboard) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      currentWhiteboard.strokes.forEach((stroke: any) => {
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // 如果是學生上台模式且有作者資訊，可以用不同透明度區分
        if (editorState.isStudentStage && stroke.author) {
          ctx.globalAlpha = stroke.authorRole === 'teacher' ? 0.4 : 1.0;
        }

        ctx.beginPath();
        stroke.points.forEach((point: { x: number; y: number }, index: number) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();

        // 重置透明度
        ctx.globalAlpha = 1.0;
      });
    }
  }, [currentWhiteboard?.strokes, editorState.isStudentStage]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);

    // 開始新筆觸
    newStroke.current = {
      color: currentColor,
      size: currentSize,
      points: [{ x, y }],
      timestamp: Date.now(),
      author: state.currentUserId,
    };
  };

  const newStroke = useRef<any>(null);

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();

    // 記錄點
    if (newStroke.current) {
      newStroke.current.points.push({ x, y });
    }
  };

  const stopDrawing = () => {
    if (isDrawing && newStroke.current && currentWhiteboard) {
      // 將作者資訊加入筆跡
      const strokeWithAuthor = {
        ...newStroke.current,
        author: state.currentUserId,
        authorRole: editorState.userRole
      };

      addStroke(currentWhiteboard.id, strokeWithAuthor);

      // 如果是學生上台模式，記錄筆跡到紀錄中
      if (editorState.isStudentStage && editorState.userRole === 'student') {
        // 優先使用學生輸入的姓名,否則使用 userId
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
            strokes: [strokeWithAuthor]
          }];
        });
      }

      newStroke.current = null;
    }
    setIsDrawing(false);
  };

  const handleClear = () => {
    if (currentWhiteboard && confirm('確定要清空白板嗎？')) {
      clearWhiteboard(currentWhiteboard.id);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `whiteboard-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  if (!currentWhiteboard) {
    return null;
  }

  const colors = ['#000000', '#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7'];

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
        <div className="flex items-center gap-4 px-6 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">顏色：</span>
          <div className="flex gap-2">
            {colors.map(color => (
              <button
                key={color}
                onClick={() => setCurrentColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  currentColor === color ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2" />

          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">粗細：</span>
          <input
            type="range"
            min="1"
            max="20"
            value={currentSize}
            onChange={(e) => setCurrentSize(Number(e.target.value))}
            className="w-32"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">{currentSize}px</span>
        </div>

        {/* 畫布與紀錄面板 */}
        <div className="flex-1 flex gap-4 p-4 overflow-hidden">
          {/* 畫布 */}
          <div className={`${showRecords ? 'flex-1' : 'w-full'} transition-all`}>
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="w-full h-full bg-white dark:bg-gray-950 rounded-lg shadow-inner cursor-crosshair"
              style={{ touchAction: 'none' }}
            />
          </div>

          {/* 共筆紀錄側欄 */}
          {showRecords && (
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

              {studentStageRecords.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {editorState.isStudentStage
                      ? '等待學生開始作答...'
                      : '尚無學生上台紀錄\n請先開啟「學生上台」模式'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {studentStageRecords.map((record, idx) => (
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
                          onClick={() => {
                            // 實作重播功能
                            alert(`🎬 重播 ${record.studentName} 的作答過程\n\n筆跡數: ${record.strokes.length}\n時間: ${new Date(record.timestamp).toLocaleString()}`);
                          }}
                        >
                          <RotateCcw className="w-3 h-3" />
                          重播
                        </button>
                        <button
                          className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-1"
                          onClick={() => {
                            // 匯出功能 - 生成 JSON 格式的作答紀錄
                            const exportData = {
                              studentName: record.studentName,
                              timestamp: record.timestamp,
                              date: new Date(record.timestamp).toLocaleString('zh-TW'),
                              strokesCount: record.strokes.length,
                              strokes: record.strokes
                            };

                            // 建立下載連結
                            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `白板作答_${record.studentName}_${new Date(record.timestamp).toISOString().slice(0, 10)}.json`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(url);
                          }}
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
          )}
        </div>

        {/* 學生姓名輸入彈窗 */}
        {showNameInput && editorState.userRole === 'student' && (
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
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="例如: 王小明"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-gray-200"
                autoFocus
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowNameInput(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    if (studentName.trim()) {
                      localStorage.setItem('studentName', studentName.trim());
                      setShowNameInput(false);
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  確定
                </button>
              </div>
            </div>
          </div>
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
