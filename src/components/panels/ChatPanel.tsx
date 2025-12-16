// components/panels/ChatPanel.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Paperclip, Send } from 'lucide-react';
import { type UserRole } from '../../config/toolConfig';
import MarkdownMessage from '../ui/MarkdownMessage';

interface ChatPanelProps {
  userRole: UserRole;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ userRole }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    {
      role: 'ai',
      text: userRole === 'teacher' ? '老師您好，我是您的 AI 助教。' : '嗨！我是你的 AI 學習夥伴。'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自動捲動對話
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((p) => [...p, { role: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      // 模擬 AI 回應，包含 Markdown 格式
      const aiResponse =
        userRole === 'teacher'
          ? `好的！針對這個問題，我為您整理了以下教學重點：\n\n**重點摘要：**\n- 粒線體是細胞的能量工廠\n- 透過\`有氧呼吸\`產生 ATP\n\n建議您可以搭配 [3D 模型](https://example.com) 展示給學生看。`
          : `收到！讓我為你解釋：\n\n**粒線體** (Mitochondria) 的主要功能包括：\n\n1. **產生 ATP** - 細胞的能量貨幣\n2. **有氧呼吸** - 分解葡萄糖產生能量\n3. **調節細胞代謝**\n\n\`\`\`\n葡萄糖 + O₂ → ATP + CO₂ + H₂O\n\`\`\`\n\n需要更多說明嗎？`;
      setMessages((p) => [...p, { role: 'ai', text: aiResponse }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user'
                  ? 'bg-gray-200'
                  : userRole === 'teacher'
                    ? 'bg-orange-100 text-orange-600'
                    : 'bg-indigo-100 text-indigo-600'
              }`}
            >
              {msg.role === 'user' ? (
                <User className="w-4 h-4 text-gray-500" />
              ) : (
                <Bot className="w-4 h-4" />
              )}
            </div>
            <MarkdownMessage
              content={msg.text}
              role={msg.role}
              userRole={userRole === 'all' ? 'student' : userRole}
            />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area (Sticky Bottom) */}
      <div className="p-3 bg-white border-t border-gray-200 mt-auto">
        <div className="flex gap-2 items-center bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          {userRole === 'teacher' && (
            <button className="text-gray-400 hover:text-indigo-600">
              <Paperclip className="w-4 h-4" />
            </button>
          )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={userRole === 'teacher' ? '輸入指令...' : '問問題...'}
            className="flex-1 bg-transparent border-none outline-none text-sm min-w-0"
          />
          <button
            onClick={handleSend}
            className={`p-2 rounded-lg transition-all ${
              input.trim() ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
