// components/ui/MarkdownMessage.tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownMessageProps {
  content: string;
  role: 'user' | 'ai';
  userRole?: 'teacher' | 'student';
}

const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content, role }) => {
  return (
    <div
      className={`
        p-3 rounded-2xl text-sm leading-relaxed
        ${role === 'user'
          ? 'bg-gray-800 text-white rounded-tr-none max-w-[85%]'
          : 'bg-gray-100 text-gray-700 rounded-tl-none max-w-[85%]'
        }
        prose prose-sm max-w-none
        ${role === 'ai' ? 'prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900' : 'prose-headings:text-white prose-p:text-white prose-strong:text-white'}
        prose-code:text-sm prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
        ${role === 'ai' ? 'prose-code:bg-indigo-100 prose-code:text-indigo-700' : 'prose-code:bg-white/20 prose-code:text-white'}
        prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-3 prose-pre:rounded-lg prose-pre:overflow-x-auto
        prose-a:text-indigo-500 prose-a:no-underline hover:prose-a:underline
        prose-ul:my-2 prose-ol:my-2 prose-li:my-1
        prose-table:text-sm prose-th:bg-gray-100 prose-th:p-2 prose-td:p-2 prose-td:border prose-th:border
      `}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 自定義渲染規則
          code: (props) => {
            const { className, children } = props;
            const isInline = !className || !className.startsWith('language-');
            return !isInline ? (
              <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto">
                <code className={className}>
                  {children}
                </code>
              </pre>
            ) : (
              <code className={`${role === 'ai' ? 'bg-indigo-100 text-indigo-700' : 'bg-white/20 text-white'} px-1.5 py-0.5 rounded text-sm font-mono`}>
                {children}
              </code>
            );
          },
          a: ({ children, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 hover:underline"
            >
              {children}
            </a>
          ),
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse" {...props}>
                {children}
              </table>
            </div>
          ),
          th: ({ children, ...props }) => (
            <th className="bg-gray-100 border border-gray-300 p-2 text-left font-bold" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="border border-gray-300 p-2" {...props}>
              {children}
            </td>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownMessage;
