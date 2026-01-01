// components/canvas/TextbookEditor.tsx
import { useEffect } from 'react';

// 1. UI Component 引入
// 如果您的環境提示 BubbleMenu 在 '@tiptap/react/menus'，請保留該路徑；
// 若是一般環境，通常直接從 '@tiptap/react' 引入即可。
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';

// 2. Logic Extension 引入 (務必安裝 @tiptap/extension-bubble-menu)
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import Youtube from '@tiptap/extension-youtube';
import Image from '@tiptap/extension-image';

import { Table } from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'

// Icons
import { Bold, Italic, Sparkles, Highlighter } from 'lucide-react';

// 分拆的工具欄組件
import EditorToolbar from '../tools/EditorToolbar';

// Types
import type { TiptapContent, FileMeta } from '../../types';

// 定義 Props，包含新增的檔案資訊 (fileMeta)
interface TextbookEditorProps {
  isEditable: boolean;
  onTextSelected: (data: { text: string; clientRect: DOMRect }) => void;
  clearSelection: () => void;
  currentTool: string;
  initialContent?: TiptapContent | string;
  fileMeta?: FileMeta;
}

// 預設內容
const DEFAULT_CONTENT = `
  <img src="/images/math_problem_full.jpg" style="width: 100%; border-radius: 0px;" />
`;

const TextbookEditor: React.FC<TextbookEditorProps> = ({
  isEditable,
  onTextSelected,
  clearSelection,
  currentTool,
  initialContent,
  // 🔥 設定預設檔案資訊，確保沒傳入時也有顯示
  fileMeta = {
    title: "4. 面積",
    version: "V1.0 (113學年度)",
    lastModified: "2024-12-10",
    tags: ["教師版", "國小數學"]
  }
}) => {

  const editor = useEditor({
    extensions: [
      StarterKit,
      Table.configure({
        resizable: true,
      }),
      TableCell,
      TableHeader,
      TableRow,
      Highlight,
      Typography,
      // 🔥 連結擴展
      // Link.configure({
      //   openOnClick: false,
      //   autolink: true,
      //   linkOnPaste: true,
      //   HTMLAttributes: {
      //     class: 'text-indigo-600 underline hover:text-indigo-800 cursor-pointer',
      //     target: '_blank',
      //     rel: 'noopener noreferrer',
      //   },
      // }),
      // 🔥 YouTube 影片擴展
      Youtube.configure({
        width: 640,
        height: 360,
        nocookie: true, // 使用隱私模式
        HTMLAttributes: {
          class: 'rounded-lg shadow-lg my-4 mx-auto',
        },
      }),
      // 🔥 圖片擴展
      Image.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: 'rounded-lg shadow-md my-4 max-w-full',
        },
      }),
      BubbleMenuExtension, // 🔥 務必註冊這個 Extension
    ],
    content: initialContent || DEFAULT_CONTENT,
    editable: isEditable,
    editorProps: {
      // Tailwind Typography 設定
      attributes: {
        class: `prose prose-lg max-w-none focus:outline-none 
          prose-headings:font-bold prose-headings:text-indigo-950 
          prose-h1:text-4xl prose-h1:mb-6 prose-h1:border-b prose-h1:pb-4 prose-h1:border-indigo-100
          prose-h2:text-2xl prose-h2:text-indigo-800 prose-h2:mt-8
          prose-p:text-slate-700 prose-p:leading-relaxed
          prose-strong:text-indigo-900 prose-strong:font-bold
          prose-blockquote:border-l-4 prose-blockquote:border-yellow-400 prose-blockquote:bg-yellow-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
          selection:bg-indigo-200 selection:text-indigo-900`.replace(/\s+/g, ' ').trim(),
      },
    },
    onSelectionUpdate: ({ editor }) => {
      // 處理閱讀模式下的外部選取 (例如觸發查單字)
      if (!isEditable) {
        const { from, to, empty } = editor.state.selection;
        if (empty) {
          clearSelection();
          return;
        }
        const text = editor.state.doc.textBetween(from, to, ' ');
        const domSelection = window.getSelection();

        if (domSelection && domSelection.rangeCount > 0 && !domSelection.isCollapsed && text.trim().length > 0) {
          const range = domSelection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          onTextSelected({ text, clientRect: rect });
        }
      }
    },
  });

  // 監聽模式切換
  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditable);
    }
  }, [isEditable, editor]);

  // 監聽外部內容更新 (例如 AI 匯入後)
  useEffect(() => {
    if (editor && initialContent) {
      // 簡單的內容比對防止 Loop
      if (editor.getHTML() !== initialContent) {
        editor.commands.setContent(initialContent);
      }
    }
  }, [initialContent, editor]);

  return (
    <div
      className={`h-full w-full flex flex-col transition-colors duration-500
        ${isEditable ? 'bg-slate-200/50' : 'bg-transparent'} 
      `}
    >
      {/* 1. 編輯模式顯示頂部工具列 */}
      {isEditable && (
        <div className="sticky top-0 z-50 px-4 py-2 bg-slate-200/50 backdrop-blur-sm flex justify-center transition-all duration-300">
          <div className="shadow-lg rounded-lg overflow-hidden">
            <EditorToolbar editor={editor} />
          </div>
        </div>
      )}

      <div
        className="flex-1 overflow-y-auto custom-scrollbar py-12"
        style={{ cursor: isEditable ? 'text' : 'default' }}
        // 防止在閱讀模式下，畫筆操作被文字選取干擾
        onMouseDownCapture={(e) => {
          if (!isEditable && ['pen', 'highlighter', 'eraser'].includes(currentTool)) {
            e.preventDefault();
          }
        }}
      >
        {/* 2. Bubble Menu: 懸浮選單 (編輯模式專用) */}
        {editor && (
          <BubbleMenu
            editor={editor}
            className="flex overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl z-50"
          >
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 hover:bg-slate-100 ${editor.isActive('bold') ? 'text-indigo-600' : 'text-slate-600'}`}
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 hover:bg-slate-100 ${editor.isActive('italic') ? 'text-indigo-600' : 'text-slate-600'}`}
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={`p-2 hover:bg-slate-100 ${editor.isActive('highlight') ? 'text-yellow-600' : 'text-slate-600'}`}
            >
              <Highlighter className="w-4 h-4" />
            </button>

            <div className="w-px bg-slate-200 my-1"></div>

            {/* AI 功能入口 */}
            <button
              onClick={() => alert("✨ AI 正在重新編寫這段文字... (Demo)")}
              className="flex items-center gap-1 p-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Rewrite</span>
            </button>
          </BubbleMenu>
        )}

        {/* 3. 擬真紙張容器 (主要內容區) */}
        <div className={`
                mx-auto bg-white transition-all duration-500 ease-in-out flex flex-col relative
                ${isEditable
            ? 'w-[800px] min-h-[1100px] shadow-2xl ring-1 ring-black/5 rounded-sm px-12 py-12 transform translate-y-2' // 編輯模式：浮起、強調
            : 'w-[800px] min-h-[1100px] shadow-sm ring-1 ring-black/5 rounded-sm px-12 py-12'   // 閱讀模式：平面、安靜
          }
            `}>
          {/* Header removed as requested */}
          <div className="mb-4" />

          {/* Custom Unit Header - Rendered outside Tiptap to guarantee styles */}
          <div className="mb-8 pb-4 border-b-4 border-red-200 flex items-end gap-4 select-none">
            <span className="text-7xl font-black text-pink-600 leading-[0.8]">4</span>
            <h1 className="text-4xl font-bold text-gray-800 m-0 leading-none">面積</h1>
          </div>

          {/* 編輯器核心 */}
          <EditorContent editor={editor} />

          {/* 裝飾用的頁碼 */}
          <div className="w-full mt-auto pt-16 flex justify-center text-xs text-slate-300 font-mono border-t border-slate-50">
            — {fileMeta.title} • Page 1 —
          </div>
        </div>

        {/* 底部緩衝區 */}
        <div className="h-32" />
      </div>
    </div>
  );
};

export default TextbookEditor;