'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
    content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <div className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-brand-primary prose-a:text-brand-secondary prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-img:shadow-lg prose-pre:bg-gray-900 prose-pre:text-gray-50 prose-pre:rounded-xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
    );
}
