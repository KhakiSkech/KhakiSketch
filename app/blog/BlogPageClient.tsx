'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ArticleCard from '@/components/ui/ArticleCard';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { useArticles } from '@/hooks/useArticles';
import { ArticleCategory } from '@/types/admin';

const CATEGORIES: { id: ArticleCategory | 'ALL'; label: string }[] = [
  { id: 'ALL', label: '전체' },
  { id: 'INSIGHT', label: '인사이트' },
  { id: 'GUIDE', label: '가이드' },
  { id: 'CASE_STUDY', label: '케이스 스터디' },
  { id: 'NEWS', label: '뉴스' },
];

export default function BlogPageClient() {
  const { articles, isLoading } = useArticles();
  const [activeCategory, setActiveCategory] = useState<ArticleCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchCategory = activeCategory === 'ALL' || article.category === activeCategory;
      const term = searchQuery.toLowerCase();
      const matchSearch =
        article.title.toLowerCase().includes(term) ||
        article.description.toLowerCase().includes(term) ||
        article.tags?.some((t) => t.toLowerCase().includes(term));

      return matchCategory && matchSearch;
    });
  }, [articles, activeCategory, searchQuery]);

  const featuredArticles = filteredArticles.filter((article) => article.featured);
  const regularArticles = filteredArticles.filter((article) => !article.featured);

  if (isLoading) {
    return (
      <div className="w-full bg-brand-bg min-h-screen pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 mb-12">
            <div className="h-12 bg-brand-primary/10 rounded-lg w-32 animate-pulse" />
            <div className="h-6 bg-brand-primary/5 rounded-lg w-64 animate-pulse" />
          </div>
          <div className="w-full h-16 bg-white rounded-2xl animate-pulse mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-white/60 rounded-2xl border border-brand-primary/5 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-brand-bg min-h-screen pt-32 pb-20 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <ScrollReveal>
          <div className="flex flex-col gap-4 mb-12">
            <span className="text-brand-secondary font-bold text-sm tracking-[0.2em] uppercase">
              Blog
            </span>
            <h1 className="font-bold text-4xl lg:text-5xl text-brand-primary tracking-tight">
              인사이트 & 가이드
            </h1>
            <p className="text-xl text-brand-muted font-medium max-w-2xl">
              MVP 개발, 업무 자동화, 트레이딩 시스템 구축에 대한 실무 경험과 인사이트를 공유합니다.
            </p>
          </div>
        </ScrollReveal>

        {/* Filter & Search */}
        <ScrollReveal delay={100} className="w-full sticky top-24 z-30 mb-12">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-brand-primary/5 shadow-sm">
            {/* Category Tabs */}
            <div role="group" aria-label="카테고리 필터" className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${activeCategory === cat.id
                      ? 'bg-brand-primary text-white shadow-md'
                      : 'bg-transparent text-brand-muted hover:bg-gray-100'
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-72">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                aria-label="블로그 검색"
                placeholder="제목, 태그로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-brand-primary/50 text-sm font-medium transition-colors"
              />
            </div>
          </div>
        </ScrollReveal>

        {/* Empty State */}
        {filteredArticles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-bold text-gray-400">조건에 맞는 글이 없습니다.</p>
          </div>
        ) : (
          <>
            {/* Featured Articles */}
            {featuredArticles.length > 0 && activeCategory === 'ALL' && !searchQuery && (
              <section className="mb-16">
                <ScrollReveal delay={150}>
                  <h2 className="font-bold text-2xl text-brand-primary mb-8">Featured</h2>
                </ScrollReveal>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {featuredArticles.map((article, idx) => (
                    <ScrollReveal key={article.slug} delay={200 + idx * 50}>
                      <ArticleCard
                        slug={article.slug}
                        title={article.title}
                        description={article.description}
                        category={article.category}
                        publishedAt={article.publishedAt}
                        readingTime={article.readingTime}
                        tags={article.tags}
                        featured={article.featured}
                      />
                    </ScrollReveal>
                  ))}
                </div>
              </section>
            )}

            {/* All Articles */}
            <section>
              <ScrollReveal delay={250}>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-bold text-2xl text-brand-primary">
                    {activeCategory === 'ALL' ? 'All Posts' : CATEGORIES.find(c => c.id === activeCategory)?.label}
                  </h2>
                  <span className="text-sm text-brand-muted font-medium">
                    {filteredArticles.length}개의 글
                  </span>
                </div>
              </ScrollReveal>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(activeCategory === 'ALL' && !searchQuery ? regularArticles : filteredArticles).map((article, idx) => (
                  <ScrollReveal key={article.slug} delay={300 + idx * 50}>
                    <ArticleCard
                      slug={article.slug}
                      title={article.title}
                      description={article.description}
                      category={article.category}
                      publishedAt={article.publishedAt}
                      readingTime={article.readingTime}
                      tags={article.tags}
                      featured={article.featured}
                    />
                  </ScrollReveal>
                ))}
              </div>
            </section>
          </>
        )}

        {/* CTA */}
        <ScrollReveal delay={400}>
          <div className="mt-20 bg-white p-12 rounded-3xl border border-gray-100 shadow-lg text-center">
            <h3 className="text-2xl font-bold text-brand-primary mb-4">
              더 궁금한 점이 있으신가요?
            </h3>
            <p className="text-brand-muted mb-8">
              개발 관련 문의나 프로젝트 상담을 원하시면 연락해주세요.
            </p>
            <Link
              href="/quote"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-brand-primary text-white font-bold text-lg hover:bg-brand-primary/90 transition-colors shadow-lg"
            >
              프로젝트 문의하기
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
