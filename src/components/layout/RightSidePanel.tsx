import React, { useState, useRef, useEffect } from 'react';
import { 
  X, BookOpen, GraduationCap, Lightbulb, MessageCircle, 
  BarChart3, ListChecks, UploadCloud, ShieldAlert, Send, 
  Paperclip, Bot, User, FileText, CheckCircle, Trash2, History
} from 'lucide-react';
import { type UserRole } from '../../config/toolConfig';

interface RightSidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedText: string;
  userRole: UserRole;
  initialTab?: 'context' | 'chat'; // 新增：決定打開時預設顯示哪一頁
}

// 模擬資料
const MOCK_STUDENT_LOGS = [
  { id: 1, student: '王小明', query: '粒線體是什麼？', status: 'safe', time: '10:05' },
  { id: 2, student: '陳小美', query: '幫我寫這題作業的答案', status: 'flagged', time: '10:12' },
  { id: 3, student: '林大華', query: 'ATP 的全名是？', status: 'safe', time: '10:15' },
];

const RightSidePanel: React.FC<RightSidePanelProps> = ({ 
  isOpen, onClose, selectedText, userRole, initialTab = 'context' 
}) => {
  // 分頁狀態: context(分析), chat(對話), upload(教材), review(審查)
  const [activeTab, setActiveTab] = useState<'context' | 'chat' | 'upload' | 'review'>('context');
  
  // Chat 狀態
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([
    { role: 'ai', text: userRole === 'teacher' ? '老師您好，我是您的 AI 助教。' : '嗨！我是你的 AI 學習夥伴。' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Upload 狀態
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  // 當側邊欄打開時，重置或設定預設分頁
  useEffect(() => {
    if (isOpen) {
        setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // 自動捲動對話
  useEffect(() => {
    if (activeTab === 'chat') {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeTab]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(p => [...p, { role: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(p => [...p, { role: 'ai', text: '收到，這是一個很好的問題！讓我們來看看教材...' }]);
    }, 1000);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFiles(prev => [...prev, e.target.files![0].name]);
    }
  };

  // --- Render Functions ---

  // 1. Context Tab: 原本的教材分析內容
  const renderContextTab = () => (
    <div className="flex flex-col gap-6 animate-in slide-in-from-right duration-300">
        {userRole === 'student' ? (
            /* 學生版 Context */
            <>
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                    <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold">
                        <Lightbulb className="w-5 h-5" /> AI 重點摘要
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {selectedText ? `針對「${selectedText}」...` : '請先在畫布上選取文字，AI 將為您生成摘要。'}
                        {selectedText && 'AI 認為這是一個關於細胞能量轉換的關鍵概念。'}
                    </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 text-gray-800 font-bold">
                        <ListChecks className="w-5 h-5 text-green-600" /> 自我檢測
                    </div>
                    <div className="space-y-2">
                        <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Q: 粒線體的主要功能？</div>
                    </div>
                </div>
            </>
        ) : (
            /* 老師版 Context */
            <>
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                    <div className="flex items-center gap-2 mb-2 text-orange-700 font-bold">
                        <BookOpen className="w-5 h-5" /> 教學引導提示
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {selectedText ? `針對「${selectedText}」...` : '請選取文字以獲取備課建議。'}
                        {selectedText && '歷年學生常在此處混淆呼吸作用與光合作用。'}
                    </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 text-gray-800 font-bold">
                        <BarChart3 className="w-5 h-5 text-blue-600" /> 即時班級數據
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="bg-blue-50 p-2 rounded-lg"><div className="text-2xl font-bold text-blue-600">85%</div><div className="text-xs text-blue-400">已讀完</div></div>
                        <div className="bg-red-50 p-2 rounded-lg"><div className="text-2xl font-bold text-red-600">3人</div><div className="text-xs text-red-400">卡關中</div></div>
                    </div>
                </div>
            </>
        )}
    </div>
  );

  // 2. Chat Tab: 對話視窗
  const renderChatTab = () => (
    <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-gray-200' : (userRole === 'teacher' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600')}`}>
                        {msg.role === 'user' ? <User className="w-4 h-4 text-gray-500" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`p-3 rounded-2xl max-w-[85%] text-sm leading-relaxed ${msg.role === 'user' ? 'bg-gray-800 text-white rounded-tr-none' : 'bg-gray-100 text-gray-700 rounded-tl-none'}`}>
                        {msg.text}
                    </div>
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>
        {/* Input Area (Sticky Bottom) */}
        <div className="p-3 bg-white border-t border-gray-200 mt-auto">
            <div className="flex gap-2 items-center bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                {userRole === 'teacher' && <button className="text-gray-400 hover:text-indigo-600"><Paperclip className="w-4 h-4" /></button>}
                <input 
                    type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={userRole === 'teacher' ? "輸入指令..." : "問問題..."}
                    className="flex-1 bg-transparent border-none outline-none text-sm min-w-0"
                />
                <button onClick={handleSend} className={`p-2 rounded-lg transition-all ${input.trim() ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
  );

  // 3. Upload Tab (Teacher Only)
  const renderUploadTab = () => (
    <div className="p-4 h-full flex flex-col animate-in slide-in-from-right duration-300">
        <div className="border-2 border-dashed border-indigo-200 rounded-xl bg-indigo-50/50 flex flex-col items-center justify-center py-10 mb-6 hover:bg-indigo-50 transition-colors cursor-pointer relative">
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUpload} />
            <UploadCloud className="w-12 h-12 text-indigo-400 mb-2" />
            <span className="text-sm font-bold text-indigo-700">上傳補充教材 (RAG)</span>
            <span className="text-xs text-indigo-400 mt-1">PDF, PPT, DOCX</span>
        </div>
        <div className="flex-1">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">知識庫列表</h4>
            <div className="space-y-2">
                {uploadedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="w-4 h-4 text-orange-500 shrink-0" />
                            <span className="text-sm text-gray-700 truncate">{file}</span>
                        </div>
                        <Trash2 className="w-4 h-4 text-gray-300 hover:text-red-500 cursor-pointer" onClick={() => setUploadedFiles(p => p.filter((_, i) => i !== idx))} />
                    </div>
                ))}
            </div>
        </div>
    </div>
  );

  // 4. Review Tab (Teacher Only)
  const renderReviewTab = () => (
    <div className="p-0 animate-in slide-in-from-right duration-300">
        <div className="p-3 bg-yellow-50 border-b border-yellow-100 flex items-center gap-2 text-xs text-yellow-800 mb-2">
            <ShieldAlert className="w-4 h-4" /> 檢測到潛在違規提問
        </div>
        <div className="divide-y divide-gray-100">
            {MOCK_STUDENT_LOGS.map((log) => (
                <div key={log.id} className={`p-4 hover:bg-gray-50 ${log.status === 'flagged' ? 'bg-red-50/30' : ''}`}>
                    <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-sm text-gray-800">{log.student}</span>
                        {log.status === 'flagged' 
                            ? <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">需審查</span>
                            : <span className="text-[10px] text-green-600 bg-green-100 px-2 py-0.5 rounded-full">正常</span>
                        }
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{log.query}</p>
                    {log.status === 'flagged' && (
                        <div className="flex gap-2">
                            <button className="flex-1 bg-white border border-gray-300 text-xs py-1 rounded">忽略</button>
                            <button className="flex-1 bg-red-600 text-white text-xs py-1 rounded">介入</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
  );

  return (
    <>
      <div className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      
      <div className={`
        fixed top-0 right-0 h-full w-[400px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-out border-l border-gray-100 flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${userRole === 'teacher' ? 'bg-orange-50' : 'bg-indigo-50'}`}>
          <div className="flex items-center gap-3">
             <div className={`p-2 rounded-lg ${userRole === 'teacher' ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'}`}>
                {userRole === 'teacher' ? <GraduationCap className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
             </div>
             <div>
               <h2 className={`font-bold text-lg ${userRole === 'teacher' ? 'text-orange-900' : 'text-indigo-900'}`}>
                 {userRole === 'teacher' ? '教學中控台' : 'AI 學習助手'}
               </h2>
               <p className="text-xs text-gray-500">Integrated Learning System</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        {/* Tabs Navigation (Sticky Top) */}
        <div className="flex border-b border-gray-100 bg-white">
            <button onClick={() => setActiveTab('context')} className={`flex-1 py-3 text-xs font-bold flex flex-col items-center gap-1 border-b-2 transition-colors ${activeTab === 'context' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                <BookOpen className="w-4 h-4" /> 內容分析
            </button>
            <button onClick={() => setActiveTab('chat')} className={`flex-1 py-3 text-xs font-bold flex flex-col items-center gap-1 border-b-2 transition-colors ${activeTab === 'chat' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                <MessageCircle className="w-4 h-4" /> AI 對話
            </button>
            
            {/* 老師專用 Tabs */}
            {userRole === 'teacher' && (
                <>
                    <button onClick={() => setActiveTab('upload')} className={`flex-1 py-3 text-xs font-bold flex flex-col items-center gap-1 border-b-2 transition-colors ${activeTab === 'upload' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                        <UploadCloud className="w-4 h-4" /> 教材庫
                    </button>
                    <button onClick={() => setActiveTab('review')} className={`flex-1 py-3 text-xs font-bold flex flex-col items-center gap-1 border-b-2 transition-colors ${activeTab === 'review' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                        <ShieldAlert className="w-4 h-4" /> 審查
                    </button>
                </>
            )}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-white scrollbar-thin">
            {activeTab === 'context' && renderContextTab()}
            {activeTab === 'chat' && renderChatTab()}
            {activeTab === 'upload' && renderUploadTab()}
            {activeTab === 'review' && renderReviewTab()}
        </div>
      </div>
    </>
  );
};

export default RightSidePanel;