// components/features/EPUBImporter.tsx
import React, { useState, useRef } from 'react';
import { X, Upload, BookOpen, Loader, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import { parseEPUB, convertEPUBToTextbookContent, type EPUBMetadata } from '../../utils/epubParser';
import type { TextbookContent } from '../../context/ContentContext';

interface EPUBImporterProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (content: TextbookContent) => void;
}

type ImportStatus = 'idle' | 'uploading' | 'parsing' | 'success' | 'error';

const EPUBImporter: React.FC<EPUBImporterProps> = ({ isOpen, onClose, onImport }) => {
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [metadata, setMetadata] = useState<EPUBMetadata | null>(null);
  const [parsedContent, setParsedContent] = useState<TextbookContent | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 處理檔案選擇
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 驗證檔案類型
    if (!file.name.endsWith('.epub') && file.type !== 'application/epub+zip') {
      setStatus('error');
      setErrorMessage('請選擇有效的 EPUB 檔案（.epub）');
      return;
    }

    setStatus('uploading');
    setErrorMessage('');

    try {
      // 解析 EPUB
      setStatus('parsing');
      const { metadata: epubMetadata, chapters } = await parseEPUB(file);

      setMetadata(epubMetadata);

      // 轉換為 TextbookContent 格式
      const content = convertEPUBToTextbookContent(epubMetadata, chapters);
      setParsedContent(content);

      setStatus('success');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : '解析失敗，請檢查檔案格式');
      console.error('EPUB 匯入錯誤:', error);
    }
  };

  // 確認匯入
  const handleConfirmImport = () => {
    if (parsedContent) {
      onImport(parsedContent);
      handleReset();
      onClose();
    }
  };

  // 重置狀態
  const handleReset = () => {
    setStatus('idle');
    setErrorMessage('');
    setMetadata(null);
    setParsedContent(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 關閉並重置
  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80]"
        onClick={handleClose}
      />

      {/* 主彈窗 */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[90] w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">EPUB 教科書匯入</h2>
              <p className="text-sm text-indigo-100">上傳 EPUB 檔案並自動轉換為互動式教材</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* 上傳區域 */}
          {status === 'idle' && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-indigo-300 rounded-xl p-12 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/50 transition-all group"
              >
                <Upload className="w-16 h-16 mx-auto text-indigo-400 group-hover:text-indigo-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-800 mb-2">點擊選擇 EPUB 檔案</h3>
                <p className="text-sm text-gray-500">支援標準 EPUB 2.0 / 3.0 格式</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".epub,application/epub+zip"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  功能說明
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>✓ 自動解析 EPUB 章節結構</li>
                  <li>✓ 轉換為可標註的互動式頁面</li>
                  <li>✓ 支援 AI 分析與問答功能</li>
                  <li>✓ 保留原始文字與圖片內容</li>
                </ul>
              </div>
            </div>
          )}

          {/* 上傳中 */}
          {status === 'uploading' && (
            <div className="text-center py-12">
              <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin mb-4" />
              <p className="text-gray-700 font-medium">正在上傳檔案...</p>
            </div>
          )}

          {/* 解析中 */}
          {status === 'parsing' && (
            <div className="text-center py-12">
              <Loader className="w-12 h-12 mx-auto text-indigo-600 animate-spin mb-4" />
              <p className="text-gray-700 font-medium mb-2">正在解析 EPUB 內容...</p>
              <p className="text-sm text-gray-500">這可能需要幾秒鐘時間</p>
            </div>
          )}

          {/* 成功 */}
          {status === 'success' && metadata && parsedContent && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h4 className="font-bold text-green-900 mb-1">解析成功！</h4>
                  <p className="text-sm text-green-700">已成功解析 EPUB 檔案，請確認資訊後匯入</p>
                </div>
              </div>

              {/* 書籍資訊 */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-bold text-gray-900">書籍資訊</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">標題：</span>
                    <span className="font-medium text-gray-800 ml-2">{metadata.title}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">作者：</span>
                    <span className="font-medium text-gray-800 ml-2">{metadata.author}</span>
                  </div>
                  {metadata.publisher && (
                    <div>
                      <span className="text-gray-500">出版社：</span>
                      <span className="font-medium text-gray-800 ml-2">{metadata.publisher}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">頁數：</span>
                    <span className="font-medium text-gray-800 ml-2">{parsedContent.pages.length} 頁</span>
                  </div>
                </div>
                {metadata.description && (
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-gray-500 text-sm">簡介：</span>
                    <p className="text-sm text-gray-700 mt-1">{metadata.description}</p>
                  </div>
                )}
              </div>

              {/* 預覽章節列表 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-bold text-gray-900 mb-3">章節預覽</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {parsedContent.pages.slice(0, 10).map((page: any, idx: number) => (
                    <div
                      key={page.id}
                      className="bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 text-sm">{page.title}</p>
                      </div>
                    </div>
                  ))}
                  {parsedContent.pages.length > 10 && (
                    <p className="text-sm text-gray-500 text-center py-2">
                      還有 {parsedContent.pages.length - 10} 個章節...
                    </p>
                  )}
                </div>
              </div>

              {/* 操作按鈕 */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  重新上傳
                </button>
                <button
                  onClick={handleConfirmImport}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  確認匯入
                </button>
              </div>
            </div>
          )}

          {/* 錯誤 */}
          {status === 'error' && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <h4 className="font-bold text-red-900 mb-1">匯入失敗</h4>
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                重試
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EPUBImporter;
