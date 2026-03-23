'use client';

import DOMPurify from 'dompurify';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ContentRendererProps {
  content: string;
  contentFormat?: 'html' | 'markdown';
  className?: string;
}

export default function ContentRenderer({
  content,
  contentFormat,
  className = '',
}: ContentRendererProps) {
  if (!content) return null;

  const format = contentFormat ?? detectFormat(content);

  if (format === 'html') {
    const clean = DOMPurify.sanitize(content, {
      ADD_TAGS: ['iframe'],
      ADD_ATTR: ['target', 'rel', 'allow', 'allowfullscreen', 'frameborder'],
    });

    return (
      <div
        className={`prose prose-invert max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    );
  }

  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-brand-primary mt-8 mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-brand-primary mt-6 mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-white mt-4 mb-2">{children}</h3>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-brand-secondary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt ?? ''}
              className="rounded-2xl shadow-lg my-4 max-w-full"
              loading="lazy"
            />
          ),
          code: ({ children, className: codeClassName }) => {
            const isBlock = codeClassName?.startsWith('language-');
            if (isBlock) {
              return (
                <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 overflow-x-auto my-4">
                  <code className={codeClassName}>{children}</code>
                </pre>
              );
            }
            return (
              <code className="bg-gray-800 text-gray-200 px-1.5 py-0.5 rounded text-sm">
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function detectFormat(content: string): 'html' | 'markdown' {
  const trimmed = content.trimStart();
  return /<[a-z][\s\S]*>/i.test(trimmed.slice(0, 200)) ? 'html' : 'markdown';
}
