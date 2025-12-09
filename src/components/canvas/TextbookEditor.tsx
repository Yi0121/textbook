// components/canvas/TextbookEditor.tsx
import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';
import { 
  Bold, Italic, Heading1, Heading2, List, ListOrdered, 
  Quote, Undo, Redo, Highlighter 
} from 'lucide-react';

interface TextbookEditorProps {
  isEditable: boolean;
  onTextSelected: (data: { text: string; clientRect: DOMRect }) => void;
  clearSelection: () => void;
  currentTool: string;
  initialContent?: any; // <--- 1. 確保有定義這個
}

const EditorToolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const Button = ({ onClick, isActive, icon: Icon, title }: any) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        isActive 
          ? 'bg-indigo-100 text-indigo-700' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  return (
    <div 
      onMouseDown={(e) => e.stopPropagation()} 
      className="flex items-center gap-1 p-2 mb-4 border-b border-slate-200 bg-slate-50/50 sticky top-0 z-10 backdrop-blur-sm rounded-t-lg"
    >
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} icon={Heading1} title="大標題" />
      <Button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} icon={Heading2} title="次標題" />
      <div className="w-px h-4 bg-slate-300 mx-1" />
      <Button onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Bold} title="粗體" />
      <Button onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Italic} title="斜體" />
      <Button onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} icon={Highlighter} title="螢光筆" />
      <div className="w-px h-4 bg-slate-300 mx-1" />
      <Button onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={List} title="項目符號" />
      <Button onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={ListOrdered} title="編號列表" />
      <Button onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} icon={Quote} title="引用/提問" />
      <div className="flex-1" />
      <Button onClick={() => editor.chain().focus().undo().run()} icon={Undo} title="復原" />
      <Button onClick={() => editor.chain().focus().redo().run()} icon={Redo} title="重做" />
    </div>
  );
};

const DEFAULT_CONTENT = `
  <h1>CH3. 細胞的構造與功能</h1>
  <p class="lead">細胞是生命的基本單位。在本章節中，我們將深入探討真核細胞中最重要的能量轉換中心。</p>
  <h2>3.1 細胞的能量工廠：粒線體 (Mitochondria)</h2>
  <p><strong>粒線體</strong> 是真核細胞中至關重要的胞器。它的主要功能是透過<span style="background-color: #fef9c3; color: #854d0e; padding: 0 4px; border-radius: 2px;">有氧呼吸作用</span>，將有機物中的化學能轉化為 <strong>ATP</strong>。</p>
  <blockquote><p>💡 <strong>思考問題：</strong> 為什麼肌肉細胞比皮膚細胞擁有更多的粒線體？</p></blockquote>
`;

const TextbookEditor: React.FC<TextbookEditorProps> = ({ 
  isEditable, 
  onTextSelected, 
  clearSelection,
  currentTool,
  initialContent // <--- 2. 接收外部內容
}) => {

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Typography,
    ],
    content: initialContent || DEFAULT_CONTENT,
    editable: isEditable,
    editorProps: {
      attributes: {
        class: `prose prose-lg max-w-none focus:outline-none 
          prose-headings:font-bold prose-headings:text-indigo-950 
          prose-h1:text-4xl prose-h1:mb-6 prose-h1:border-b prose-h1:pb-4 prose-h1:border-indigo-100
          prose-h2:text-2xl prose-h2:text-indigo-800 prose-h2:mt-8
          prose-h3:text-xl prose-h3:text-indigo-700
          prose-p:text-slate-700 prose-p:leading-relaxed
          prose-strong:text-indigo-900 prose-strong:font-bold
          prose-blockquote:border-l-4 prose-blockquote:border-yellow-400 prose-blockquote:bg-yellow-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
          prose-li:text-slate-700 prose-ul:list-disc prose-ol:list-decimal
          selection:bg-indigo-200 selection:text-indigo-900`.replace(/\s+/g, ' ').trim(), 
      },
    },
    onSelectionUpdate: ({ editor }) => {
      if (isEditable) return;
      const { from, to, empty } = editor.state.selection;
      if (empty) {
        clearSelection();
        return;
      }
      const text = editor.state.doc.textBetween(from, to, ' ');
      const domSelection = window.getSelection();
      if (domSelection && domSelection.rangeCount > 0 && !domSelection.isCollapsed) {
        const range = domSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (text.trim().length > 0) {
          onTextSelected({
            text: text,
            clientRect: rect
          });
        }
      }
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditable);
    }
  }, [isEditable, editor]);

  // 🔥🔥🔥 3. 關鍵修正：當外部傳入的 initialContent 改變時，強制更新編輯器內容
  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);
  // 🔥🔥🔥

  return (
    <div 
      className={`h-full w-full bg-white shadow-sm rounded-xl border transition-colors duration-300 flex flex-col
        ${isEditable ? 'border-indigo-400 ring-4 ring-indigo-50/50' : 'border-slate-200'}
      `}
    >
       {isEditable && <EditorToolbar editor={editor} />}
       
       <div 
         className="flex-1 overflow-y-auto px-12 py-8 custom-scrollbar"
         style={{ cursor: isEditable ? 'text' : 'default' }}
         onMouseDownCapture={(e) => {
            if (!isEditable && ['pen', 'highlighter', 'eraser'].includes(currentTool)) {
              e.preventDefault();
            }
         }}
       >
          <EditorContent editor={editor} />
          <div className="h-32" />
       </div>
    </div>
  );
};

export default TextbookEditor;