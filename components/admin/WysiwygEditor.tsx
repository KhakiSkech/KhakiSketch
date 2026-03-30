'use client';

import { useMemo, useRef, useState } from 'react';
import {
  EditorRoot,
  EditorContent,
  EditorBubble,
  EditorBubbleItem,
  EditorCommand,
  EditorCommandList,
  EditorCommandItem,
  EditorCommandEmpty,
  useEditor,
  type JSONContent,
  handleImageDrop,
  handleImagePaste,
  createImageUpload,
  createSuggestionItems,
  handleCommandNavigation,
  renderItems,
  StarterKit,
  TiptapImage,
  TiptapLink,
  TiptapUnderline,
  Placeholder,
  HorizontalRule,
  TaskItem,
  TaskList,
  Command,
} from 'novel';
import { uploadImage } from '@/lib/storage';
import type { ImageCategory } from '@/lib/storage';

interface WysiwygEditorProps {
  initialContent?: JSONContent | string;
  onChange: (html: string) => void;
  placeholder?: string;
  imageCategory?: ImageCategory;
  /** 에디터 인스턴스를 식별하는 안정 key (slug, id 등). 이 값이 바뀔 때만 에디터가 재마운트됨 */
  editorId?: string;
}

// ===== 고정 툴바 =====

function EditorToolbar({ imageCategory }: { imageCategory: ImageCategory }) {
  const { editor } = useEditor();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file, imageCategory);
      editor.chain().focus().setImage({ src: url }).run();
    } catch {
      // 업로드 실패
    }
    e.target.value = '';
  };

  const ToolButton = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`px-2 py-1.5 rounded text-sm transition-colors ${
        active
          ? 'bg-brand-primary text-white'
          : 'text-brand-text hover:bg-brand-primary/10'
      }`}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-6 bg-brand-primary/15 mx-1" />;

  return (
    <div className="flex items-center gap-0.5 px-3 py-2 border-b border-brand-primary/10 bg-brand-bg/50 rounded-t-xl flex-wrap">
      {/* 텍스트 포맷 */}
      <ToolButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')}
        title="굵게 (Ctrl+B)"
      >
        <strong>B</strong>
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')}
        title="기울임 (Ctrl+I)"
      >
        <em>I</em>
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        active={editor.isActive('underline')}
        title="밑줄 (Ctrl+U)"
      >
        <u>U</u>
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive('strike')}
        title="취소선"
      >
        <s>S</s>
      </ToolButton>

      <Divider />

      {/* 제목 */}
      <ToolButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive('heading', { level: 1 })}
        title="제목 1"
      >
        <span className="font-bold">H1</span>
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })}
        title="제목 2"
      >
        <span className="font-bold">H2</span>
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })}
        title="제목 3"
      >
        <span className="font-bold text-xs">H3</span>
      </ToolButton>

      <Divider />

      {/* 목록 */}
      <ToolButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')}
        title="글머리 기호"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          <circle cx="2" cy="6" r="1" fill="currentColor" />
          <circle cx="2" cy="12" r="1" fill="currentColor" />
          <circle cx="2" cy="18" r="1" fill="currentColor" />
        </svg>
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')}
        title="번호 목록"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13" />
          <text x="1" y="8" fontSize="7" fill="currentColor" fontWeight="bold">1</text>
          <text x="1" y="14" fontSize="7" fill="currentColor" fontWeight="bold">2</text>
          <text x="1" y="20" fontSize="7" fill="currentColor" fontWeight="bold">3</text>
        </svg>
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        active={editor.isActive('taskList')}
        title="체크리스트"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="3" strokeWidth={2} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
        </svg>
      </ToolButton>

      <Divider />

      {/* 블록 */}
      <ToolButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')}
        title="인용문"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
        </svg>
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        active={editor.isActive('codeBlock')}
        title="코드 블록"
      >
        <span className="font-mono text-xs">&lt;/&gt;</span>
      </ToolButton>
      <ToolButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="구분선"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeWidth={2} d="M3 12h18" />
        </svg>
      </ToolButton>

      <Divider />

      {/* 이미지 */}
      <ToolButton
        onClick={() => fileInputRef.current?.click()}
        title="이미지 업로드"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
          <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15l-5-5L5 21" />
        </svg>
      </ToolButton>
      <ToolButton
        onClick={() => {
          const url = window.prompt('링크 URL을 입력하세요');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        active={editor.isActive('link')}
        title="링크"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </ToolButton>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}

// ===== 슬래시 명령 아이템 =====

const suggestionItems = createSuggestionItems([
  {
    title: '제목 1',
    description: '큰 제목',
    searchTerms: ['h1', 'heading', '제목'],
    icon: <span className="text-lg font-bold">H1</span>,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
    },
  },
  {
    title: '제목 2',
    description: '중간 제목',
    searchTerms: ['h2', 'heading', '제목'],
    icon: <span className="text-lg font-bold">H2</span>,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
    },
  },
  {
    title: '제목 3',
    description: '작은 제목',
    searchTerms: ['h3', 'heading', '제목'],
    icon: <span className="text-lg font-bold">H3</span>,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
    },
  },
  {
    title: '글머리 기호',
    description: '목록 만들기',
    searchTerms: ['bullet', 'list', '목록'],
    icon: <span className="text-lg">-</span>,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: '번호 목록',
    description: '번호 매기기',
    searchTerms: ['numbered', 'list', '번호'],
    icon: <span className="text-lg">1.</span>,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: '체크리스트',
    description: '할 일 목록',
    searchTerms: ['todo', 'task', 'check', '체크'],
    icon: <span className="text-lg">✓</span>,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: '인용문',
    description: '인용 블록',
    searchTerms: ['quote', 'blockquote', '인용'],
    icon: <span className="text-lg">&ldquo;</span>,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    title: '코드 블록',
    description: '코드 작성',
    searchTerms: ['code', 'codeblock', '코드'],
    icon: <span className="text-lg font-mono">&lt;/&gt;</span>,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
  },
  {
    title: '구분선',
    description: '수평 구분선',
    searchTerms: ['hr', 'divider', '구분'],
    icon: <span className="text-lg">—</span>,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
  {
    title: '이미지',
    description: '이미지 업로드',
    searchTerms: ['image', 'photo', '이미지', '사진'],
    icon: <span className="text-lg">🖼</span>,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        if (input.files?.length) {
          const file = input.files[0];
          try {
            const url = await uploadImage(file, 'blog');
            editor.chain().focus().setImage({ src: url }).run();
          } catch {
            // ignore
          }
        }
      };
      input.click();
    },
  },
]);

// ===== 메인 에디터 =====

export default function WysiwygEditor({
  initialContent,
  onChange,
  placeholder = '글을 작성하세요. 서식은 상단 툴바를 사용하거나, / 를 입력하여 블록을 추가할 수 있습니다.',
  imageCategory = 'blog',
  editorId,
}: WysiwygEditorProps) {
  const uploadFn = useMemo(
    () =>
      createImageUpload({
        onUpload: (file: File) => uploadImage(file, imageCategory),
        validateFn: (file: File) => {
          if (!file.type.startsWith('image/')) return false;
          if (file.size > 10 * 1024 * 1024) return false;
          return true;
        },
      }),
    [imageCategory]
  );

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        horizontalRule: false,
        codeBlock: false,
      }),
      TiptapImage.configure({
        allowBase64: false,
        HTMLAttributes: { class: 'rounded-xl shadow-lg max-w-full my-4' },
      }),
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-brand-secondary underline' },
      }),
      TiptapUnderline,
      HorizontalRule,
      TaskList,
      TaskItem.configure({ nested: true }),
      Command.configure({
        suggestion: {
          items: () => suggestionItems,
          render: renderItems,
        },
      }),
      Placeholder.configure({ placeholder }),
    ],
    [placeholder]
  );

  // initialContent를 최초 마운트 시에만 캡처 (이후 변경 무시)
  const [capturedContent] = useState(() => initialContent);

  // JSONContent인 경우만 initialContent로 전달
  const jsonInitial = useMemo(() => {
    if (!capturedContent || typeof capturedContent === 'string') return undefined;
    return capturedContent;
  }, [capturedContent]);

  // HTML 문자열인 경우 content prop으로 전달
  const htmlContent = typeof capturedContent === 'string' && capturedContent ? capturedContent : undefined;

  // 안정 key: editorId(slug/id) 기반. editorId가 바뀔 때만 에디터 재마운트
  const editorKey = editorId || 'editor';

  return (
    <EditorRoot key={editorKey}>
      {/* 고정 툴바 */}
      <EditorToolbar imageCategory={imageCategory} />

      <EditorContent
        initialContent={jsonInitial}
        {...(htmlContent ? { content: htmlContent } : {})}
        extensions={extensions}
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event),
          },
          handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
          handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
          attributes: {
            class:
              'prose max-w-none min-h-[400px] p-4 focus:outline-none [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-brand-primary [&_h1]:mt-6 [&_h1]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-brand-primary [&_h2]:mt-5 [&_h2]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:text-brand-text [&_p]:leading-relaxed [&_li]:text-brand-text [&_blockquote]:border-l-4 [&_blockquote]:border-brand-secondary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-brand-muted [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:rounded-xl [&_pre]:p-4 [&_code]:bg-gray-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_hr]:my-6 [&_hr]:border-brand-primary/20',
          },
        }}
        onUpdate={({ editor }) => {
          onChange(editor.getHTML());
        }}
        className="rounded-b-xl border border-t-0 border-brand-primary/10 bg-white"
      >
        {/* 버블 메뉴 — 텍스트 선택 시 (툴바와 별도로 유지) */}
        <EditorBubble className="flex items-center gap-1 rounded-lg border border-brand-primary/20 bg-white p-1 shadow-xl">
          <EditorBubbleItem onSelect={(editor) => editor.chain().focus().toggleBold().run()}>
            <button type="button" className="rounded px-2 py-1 text-sm text-brand-primary hover:bg-brand-primary/10">
              <strong>B</strong>
            </button>
          </EditorBubbleItem>
          <EditorBubbleItem onSelect={(editor) => editor.chain().focus().toggleItalic().run()}>
            <button type="button" className="rounded px-2 py-1 text-sm text-brand-primary hover:bg-brand-primary/10">
              <em>I</em>
            </button>
          </EditorBubbleItem>
          <EditorBubbleItem onSelect={(editor) => editor.chain().focus().toggleUnderline().run()}>
            <button type="button" className="rounded px-2 py-1 text-sm text-brand-primary hover:bg-brand-primary/10">
              <u>U</u>
            </button>
          </EditorBubbleItem>
          <EditorBubbleItem onSelect={(editor) => editor.chain().focus().toggleStrike().run()}>
            <button type="button" className="rounded px-2 py-1 text-sm text-brand-primary hover:bg-brand-primary/10">
              <s>S</s>
            </button>
          </EditorBubbleItem>
        </EditorBubble>

        {/* 슬래시 명령 (보조 수단) */}
        <EditorCommand className="z-50 w-72 rounded-lg border border-brand-primary/20 bg-white p-2 shadow-xl transition-all">
          <EditorCommandEmpty className="px-2 py-1 text-sm text-brand-muted">
            결과 없음
          </EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                key={item.title}
                value={item.title}
                onCommand={(val) => item.command?.(val)}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-brand-text hover:bg-brand-primary/5 cursor-pointer aria-selected:bg-brand-primary/10"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-md border border-brand-primary/10 bg-brand-bg">
                  {item.icon}
                </span>
                <div>
                  <p className="font-medium text-brand-primary">{item.title}</p>
                  <p className="text-xs text-brand-muted">{item.description}</p>
                </div>
              </EditorCommandItem>
            ))}
          </EditorCommandList>
        </EditorCommand>
      </EditorContent>
    </EditorRoot>
  );
}
