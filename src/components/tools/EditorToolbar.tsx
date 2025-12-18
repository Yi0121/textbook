// components/tools/EditorToolbar.tsx
import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import type { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Highlighter,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link,
  Youtube,
  ImagePlus,
  Minus,
  X,
  Download
} from 'lucide-react';
import { exportFromEditor } from '../../utils/epubExporter';

interface EditorToolbarProps {
  editor: Editor | null;
}

interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  disabled?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  isActive = false,
  icon: Icon,
  title,
  disabled = false
}) => (
  <button
    onClick={onClick}
    title={title}
    disabled={disabled}
    className={`p-1.5 rounded transition-colors ${disabled
      ? 'text-slate-300 cursor-not-allowed'
      : isActive
        ? 'bg-indigo-100 text-indigo-700'
        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`}
  >
    <Icon className="w-4 h-4" />
  </button>
);

const Divider: React.FC = () => <div className="w-px h-4 bg-slate-300 mx-1" />;

// 🔥 彈出對話框元件
interface InputDialogProps {
  isOpen: boolean;
  title: string;
  placeholder: string;
  onConfirm: (value: string) => void;
  onClose: () => void;
}

const InputDialog: React.FC<InputDialogProps> = ({
  isOpen,
  title,
  placeholder,
  onConfirm,
  onClose
}) => {
  const [value, setValue] = useState('');

  const handleConfirm = () => {
    if (value.trim()) {
      onConfirm(value.trim());
      setValue('');
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* 背景遮罩 */}
      <div
        className="fixed inset-0 bg-black/30 z-[9998]"
        onClick={onClose}
      />
      {/* 對話框 */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9999] bg-white rounded-xl shadow-2xl border border-slate-200 p-5 min-w-[380px]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          autoFocus
        />
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleConfirm}
            disabled={!value.trim()}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            確認
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};

const EditorToolbar: React.FC<EditorToolbarProps> = ({ editor }) => {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showYoutubeDialog, setShowYoutubeDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);

  // 🔥 插入連結
  const handleInsertLink = useCallback((url: string) => {
    if (!editor) return;

    // 確保 URL 有 protocol
    const href = url.startsWith('http') ? url : `https://${url}`;

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href })
      .run();
  }, [editor]);

  // 🔥 插入 YouTube 影片
  const handleInsertYoutube = useCallback((url: string) => {
    if (!editor) return;
    editor.commands.setYoutubeVideo({ src: url });
  }, [editor]);

  // 🔥 插入圖片
  const handleInsertImage = useCallback((url: string) => {
    if (!editor) return;
    editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  // 🔥 移除連結
  const handleRemoveLink = useCallback(() => {
    if (!editor) return;
    editor.chain().focus().unsetLink().run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      onMouseDown={(e) => e.stopPropagation()}
      className="flex items-center gap-1 p-2 mb-4 border-b border-slate-200 bg-slate-50/90 backdrop-blur-sm sticky top-0 z-10 rounded-t-lg relative"
    >
      {/* Headings */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        icon={Heading1}
        title="大標題"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        icon={Heading2}
        title="次標題"
      />

      <Divider />

      {/* Text Formatting */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        icon={Bold}
        title="粗體"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        icon={Italic}
        title="斜體"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        isActive={editor.isActive('highlight')}
        icon={Highlighter}
        title="螢光筆"
      />

      <Divider />

      {/* 🔥 連結 */}
      <ToolbarButton
        onClick={() => {
          if (editor.isActive('link')) {
            handleRemoveLink();
          } else {
            setShowLinkDialog(true);
          }
        }}
        isActive={editor.isActive('link')}
        icon={Link}
        title={editor.isActive('link') ? '移除連結' : '插入連結'}
      />

      {/* 🔥 YouTube 影片 */}
      <ToolbarButton
        onClick={() => setShowYoutubeDialog(true)}
        icon={Youtube}
        title="插入 YouTube 影片"
      />

      {/* 🔥 圖片 */}
      <ToolbarButton
        onClick={() => setShowImageDialog(true)}
        icon={ImagePlus}
        title="插入圖片"
      />

      {/* 🔥 水平線 */}
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        icon={Minus}
        title="插入分隔線"
      />

      <Divider />

      {/* Lists */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        icon={List}
        title="項目符號"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        icon={ListOrdered}
        title="編號列表"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive('blockquote')}
        icon={Quote}
        title="引用"
      />

      {/* Spacer */}
      <div className="flex-1" />

      {/* History */}
      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        icon={Undo}
        title="復原"
      />
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        icon={Redo}
        title="重做"
      />

      <Divider />

      {/* 🔥 匯出 EPUB */}
      <ToolbarButton
        onClick={() => {
          const html = editor.getHTML();
          exportFromEditor('教科書', '作者', html);
        }}
        icon={Download}
        title="匯出 EPUB"
      />

      {/* 🔥 彈出對話框 */}
      <InputDialog
        isOpen={showLinkDialog}
        title="插入連結"
        placeholder="輸入網址，例如: https://example.com"
        onConfirm={handleInsertLink}
        onClose={() => setShowLinkDialog(false)}
      />
      <InputDialog
        isOpen={showYoutubeDialog}
        title="插入 YouTube 影片"
        placeholder="輸入 YouTube 網址"
        onConfirm={handleInsertYoutube}
        onClose={() => setShowYoutubeDialog(false)}
      />
      <InputDialog
        isOpen={showImageDialog}
        title="插入圖片"
        placeholder="輸入圖片網址"
        onConfirm={handleInsertImage}
        onClose={() => setShowImageDialog(false)}
      />
    </div>
  );
};

export default EditorToolbar;

