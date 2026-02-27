'use client';

import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = '마크다운 형식으로 작성하세요...',
  minHeight = '400px',
}: MarkdownEditorProps): React.ReactElement {
  const [isPreview, setIsPreview] = useState(false);

  const insertMarkdown = useCallback(
    (prefix: string, suffix: string = '') => {
      const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      const newText =
        value.substring(0, start) + prefix + selectedText + suffix + value.substring(end);

      onChange(newText);

      // 커서 위치 조정
      setTimeout(() => {
        textarea.focus();
        const newPos = start + prefix.length + selectedText.length;
        textarea.setSelectionRange(newPos, newPos);
      }, 0);
    },
    [value, onChange]
  );

  const toolbarButtons = [
    { icon: 'B', label: 'Bold', action: () => insertMarkdown('**', '**') },
    { icon: 'I', label: 'Italic', action: () => insertMarkdown('*', '*') },
    { icon: 'H1', label: 'Heading 1', action: () => insertMarkdown('\n## ', '\n') },
    { icon: 'H2', label: 'Heading 2', action: () => insertMarkdown('\n### ', '\n') },
    { icon: '—', label: 'List', action: () => insertMarkdown('\n- ', '') },
    { icon: '1.', label: 'Numbered List', action: () => insertMarkdown('\n1. ', '') },
    { icon: '"', label: 'Quote', action: () => insertMarkdown('\n> ', '\n') },
    { icon: '<>', label: 'Code', action: () => insertMarkdown('`', '`') },
    {
      icon: '```',
      label: 'Code Block',
      action: () => insertMarkdown('\n```\n', '\n```\n'),
    },
    { icon: '🔗', label: 'Link', action: () => insertMarkdown('[', '](url)') },
    { icon: '🖼️', label: 'Image', action: () => insertMarkdown('![alt text](', ')') },
  ];

  return (
    <div className="border border-brand-primary/10 rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-brand-primary/10 bg-gray-50 flex-wrap">
        {toolbarButtons.map((btn) => (
          <button
            key={btn.label}
            type="button"
            onClick={btn.action}
            title={btn.label}
            className="px-3 py-1.5 text-sm font-medium text-brand-text hover:bg-brand-primary/10 rounded transition-colors"
          >
            {btn.icon}
          </button>
        ))}
        <div className="flex-1" />
        <div className="flex rounded-lg overflow-hidden border border-brand-primary/10">
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${!isPreview
                ? 'bg-brand-primary text-white'
                : 'bg-white text-brand-text hover:bg-brand-primary/5'
              }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${isPreview
                ? 'bg-brand-primary text-white'
                : 'bg-white text-brand-text hover:bg-brand-primary/5'
              }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Editor / Preview */}
      {isPreview ? (
        <div
          className="p-6 prose prose-stone max-w-none prose-headings:font-bold prose-headings:text-brand-primary prose-a:text-brand-secondary prose-img:rounded-xl"
          style={{ minHeight }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{value || '(내용이 없습니다)'}</ReactMarkdown>
        </div>
      ) : (
        <textarea
          id="markdown-editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-6 resize-none focus:outline-none font-mono text-sm leading-relaxed"
          style={{ minHeight }}
        />
      )}
    </div>
  );
}
