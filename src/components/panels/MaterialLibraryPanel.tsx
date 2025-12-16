// components/panels/MaterialLibraryPanel.tsx
import React, { useState } from 'react';
import { UploadCloud, FileText, Trash2 } from 'lucide-react';

const MaterialLibraryPanel: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFiles((prev) => [...prev, e.target.files![0].name]);
    }
  };

  const handleDelete = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 h-full flex flex-col animate-in slide-in-from-right duration-300">
      <div className="border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50/50 flex flex-col items-center justify-center py-10 mb-6 hover:bg-indigo-50 transition-colors cursor-pointer relative">
        <input
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleUpload}
        />
        <UploadCloud className="w-12 h-12 text-indigo-400 mb-2" />
        <span className="text-sm font-bold text-indigo-700">上傳補充教材 (RAG)</span>
        <span className="text-xs text-indigo-400 mt-1">PDF, PPT, DOCX</span>
      </div>

      <div className="flex-1">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          知識庫列表
        </h4>
        <div className="space-y-2">
          {uploadedFiles.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">尚無上傳的教材</p>
          ) : (
            uploadedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <FileText className="w-4 h-4 text-orange-500 shrink-0" />
                  <span className="text-sm text-gray-700 truncate">{file}</span>
                </div>
                <Trash2
                  className="w-4 h-4 text-gray-300 hover:text-red-500 cursor-pointer"
                  onClick={() => handleDelete(idx)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialLibraryPanel;
