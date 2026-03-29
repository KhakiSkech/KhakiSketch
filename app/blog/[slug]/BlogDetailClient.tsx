'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ArticleCard from '@/components/ui/ArticleCard';
const ContentRenderer = dynamic(() => import('@/components/ui/ContentRenderer'), { ssr: false });
import { useArticle } from '@/hooks/useArticles';
import { getRelatedArticles } from '@/lib/firestore-articles';
import type { FirestoreArticle } from '@/types/admin';

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

interface BlogDetailClientProps {
  slug: string;
}

export default function BlogDetailClient({ slug }: BlogDetailClientProps) {
  // URL에서 실제 slug를 읽어옴 (정적 빌드 폴백 페이지에서도 올바른 slug 사용)
  const pathname = usePathname();
  const urlSlug = pathname?.split('/').pop() || slug;
  const decodedSlug = decodeURIComponent(urlSlug);
  const { article, isLoading, error } = useArticle(decodedSlug);
  const [relatedArticles, setRelatedArticles] = React.useState<FirestoreArticle[]>([]);

  React.useEffect(() => {
    if (article) {
      getRelatedArticles(article.category, article.slug, 2).then(setRelatedArticles);
    }
  }, [article]);

  if (isLoading) {
    return (
      <div className="w-full bg-brand-bg min-h-screen pt-24 pb-20 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="h-8 bg-brand-primary/10 rounded-lg w-48 mb-8 animate-pulse" />
          <div className="space-y-4">
            <div className="h-6 bg-brand-primary/5 rounded-lg w-32 animate-pulse" />
            <div className="h-12 bg-brand-primary/10 rounded-lg w-3/4 animate-pulse" />
            <div className="h-6 bg-brand-primary/5 rounded-lg w-full animate-pulse" />
            <div className="h-64 bg-white/60 rounded-xl mt-8 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="w-full bg-brand-bg min-h-screen pt-32 pb-20 px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-brand-primary mb-4">글을 찾을 수 없습니다</h1>
          <p className="text-brand-muted text-lg mb-8">요청하신 글이 존재하지 않습니다.</p>
          <Link href="/blog" className="text-brand-primary font-bold hover:underline">
            블로그로 돌아가기 →
          </Link>
        </div>
      </div>
    );
  }

  const colorConfig = categoryColors[article.category] || categoryColors.INSIGHT;

  return (
    <div className="w-full bg-brand-bg min-h-screen">
      {/* Header */}
      <section className="w-full pt-24 pb-12 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Back Link */}
          <ScrollReveal>
            <Link
              href="/blog"
              className="back-link inline-flex items-center gap-2 text-brand-primary font-medium hover:gap-3 transition-all mb-8"
            >
              <span>←</span>
              <span>블로그로 돌아가기</span>
            </Link>
          </ScrollReveal>

          {/* Meta */}
          <ScrollReveal delay={100}>
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${colorConfig.bg} ${colorConfig.text}`}>
                {categoryLabels[article.category] || article.category}
              </span>
              <span className="text-brand-muted">{article.publishedAt}</span>
              <span className="text-brand-muted">{article.readingTime} 읽기</span>
            </div>
          </ScrollReveal>

          {/* Title */}
          <ScrollReveal delay={150}>
            <h1 className="font-bold text-3xl lg:text-4xl text-brand-primary leading-tight mb-6">
              {article.title}
            </h1>
          </ScrollReveal>

          {/* Description */}
          <ScrollReveal delay={200}>
            <p className="text-xl text-brand-muted leading-relaxed mb-8">
              {article.description}
            </p>
          </ScrollReveal>

          {/* Tags */}
          <ScrollReveal delay={250}>
            <div className="flex flex-wrap gap-2 pb-8 border-b border-gray-200">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Content */}
      <section className="w-full py-12 px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal delay={300}>
            <article className="prose prose-lg max-w-none prose-headings:text-brand-primary prose-headings:font-bold prose-p:text-brand-text prose-p:leading-relaxed prose-a:text-brand-secondary prose-a:no-underline hover:prose-a:underline prose-strong:text-brand-primary prose-li:text-brand-text prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-brand-primary prose-pre:bg-gray-900 prose-pre:text-gray-100">
              <ContentRenderer content={article.content} contentFormat={article.contentFormat} />
            </article>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-16 px-6 lg:px-8 bg-white/50">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal delay={350}>
            <div className="bg-brand-primary rounded-3xl p-8 lg:p-12 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                이 글이 도움이 되셨나요?
              </h3>
              <p className="text-white/80 mb-8">
                프로젝트 상담이 필요하시면 언제든 연락해주세요.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-brand-primary font-bold text-lg hover:bg-brand-bg transition-colors"
              >
                무료 상담 신청하기
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="w-full py-16 px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <ScrollReveal delay={400}>
              <h2 className="font-bold text-2xl text-brand-primary mb-8">관련 글</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedArticles.map((related, idx) => (
                <ScrollReveal key={related.slug} delay={450 + idx * 50}>
                  <ArticleCard
                    slug={related.slug}
                    title={related.title}
                    description={related.description}
                    category={related.category}
                    publishedAt={related.publishedAt}
                    readingTime={related.readingTime}
                    tags={related.tags}
                  />
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
