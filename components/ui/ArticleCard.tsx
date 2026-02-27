'use client';

import React from 'react';
import Link from 'next/link';

interface ArticleCardProps {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
  readingTime: string;
  tags: string[];
  featured?: boolean;
  coverImage?: string;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  INSIGHT: { bg: 'bg-purple-100', text: 'text-purple-700' },
  GUIDE: { bg: 'bg-blue-100', text: 'text-blue-700' },
  CASE_STUDY: { bg: 'bg-green-100', text: 'text-green-700' },
  NEWS: { bg: 'bg-orange-100', text: 'text-orange-700' },
};

const categoryLabels: Record<string, string> = {
  INSIGHT: '인사이트',
  GUIDE: '가이드',
  CASE_STUDY: '케이스 스터디',
  NEWS: '뉴스',
};

export default function ArticleCard({
  slug,
  title,
  description,
  category,
  publishedAt,
  readingTime,
  tags,
  featured,
  coverImage,
}: ArticleCardProps) {
  const colorConfig = categoryColors[category] || categoryColors.INSIGHT;

  return (
    <Link href={`/blog/${slug}`} className="block group">
      <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        {/* Cover Image */}
        {coverImage && (
          <div className="h-[180px] w-full overflow-hidden bg-gray-100">
            <img
              src={coverImage}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        )}

        {/* Header with Category */}
        <div className="p-6 pb-0 flex items-center justify-between">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${colorConfig.bg} ${colorConfig.text}`}>
            {categoryLabels[category] || category}
          </span>
          {featured && (
            <span className="px-2 py-1 bg-brand-secondary/10 text-brand-secondary rounded text-xs font-medium">
              Featured
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col gap-3">
          <h3 className="font-bold text-brand-primary text-xl leading-snug group-hover:text-brand-secondary transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-brand-muted text-sm leading-relaxed line-clamp-2 flex-1">
            {description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-brand-muted">
          <span>{publishedAt}</span>
          <span>{readingTime} 읽기</span>
        </div>
      </article>
    </Link>
  );
}
