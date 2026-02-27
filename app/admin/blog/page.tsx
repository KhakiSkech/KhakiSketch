'use client';

import { logger } from '@/lib/logger';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllArticles, deleteArticle } from '@/lib/firestore-articles';
import { articles as staticArticles } from '@/data/articles';
import type { FirestoreArticle } from '@/types/admin';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

export default function BlogAdminPage(): React.ReactElement {
  const [articles, setArticles] = useState<FirestoreArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<FirestoreArticle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dataSource, setDataSource] = useState<'firestore' | 'static'>('static');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const firestoreArticles = await getAllArticles();
      if (firestoreArticles.length > 0) {
        setArticles(firestoreArticles);
        setDataSource('firestore');
      } else {
        setArticles(staticArticles);
        setDataSource('static');
      }
    } catch {
      setArticles(staticArticles);
      setDataSource('static');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const result = await deleteArticle(deleteTarget.slug);
      if (result.success) {
        setArticles((prev) => prev.filter((a) => a.slug !== deleteTarget.slug));
      }
    } catch {
      logger.error('삭제 실패');
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const getCategoryLabel = (category: string): string => {
    const labels: Record<string, string> = {
      GUIDE: '가이드',
      INSIGHT: '인사이트',
      CASE_STUDY: '케이스 스터디',
      NEWS: '뉴스',
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      GUIDE: 'bg-blue-100 text-blue-700',
      INSIGHT: 'bg-purple-100 text-purple-700',
      CASE_STUDY: 'bg-green-100 text-green-700',
      NEWS: 'bg-orange-100 text-orange-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-brand-primary/10 rounded-lg w-48" />
          <div className="h-10 bg-brand-primary/10 rounded-full w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/60 rounded-xl h-24 border border-brand-primary/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">Blog</h1>
          <p className="text-brand-muted text-sm mt-1">
            {articles.length}개의 글
            {dataSource === 'static' && (
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                정적 데이터
              </span>
            )}
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="px-5 py-2.5 bg-brand-primary text-white rounded-full text-sm font-medium hover:bg-brand-primary/90 transition-all duration-300 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 글 작성
        </Link>
      </div>

      {/* Article List */}
      <div className="space-y-4">
        {articles.map((article) => (
          <div
            key={article.slug}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-brand-primary/10 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-brand-primary">{article.title}</h3>
                  {article.featured && (
                    <span className="px-2 py-0.5 bg-brand-secondary/20 text-brand-secondary text-xs rounded-full">
                      Featured
                    </span>
                  )}
                  <span className={`px-2 py-0.5 text-xs rounded-full ${getCategoryColor(article.category)}`}>
                    {getCategoryLabel(article.category)}
                  </span>
                </div>
                <p className="text-brand-muted text-sm mb-3 line-clamp-2">{article.description}</p>
                <div className="flex items-center gap-4 text-xs text-brand-muted">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {article.publishedAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {article.readingTime}
                  </span>
                  {article.tags && article.tags.length > 0 && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                      {article.tags.slice(0, 3).join(', ')}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Link
                  href={`/blog/${article.slug}`}
                  target="_blank"
                  className="p-2 hover:bg-brand-primary/5 rounded-lg transition-colors"
                  title="사이트에서 보기"
                >
                  <svg className="w-5 h-5 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </Link>
                <Link
                  href={`/admin/blog/${article.slug}`}
                  className="p-2 hover:bg-brand-primary/5 rounded-lg transition-colors"
                  title="수정"
                >
                  <svg className="w-5 h-5 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </Link>
                <button
                  onClick={() => setDeleteTarget(article)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="삭제"
                >
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}

        {articles.length === 0 && (
          <div className="text-center py-16 bg-white/80 rounded-2xl border border-brand-primary/10">
            <div className="w-20 h-20 bg-brand-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2"
                />
              </svg>
            </div>
            <p className="text-brand-muted mb-4">아직 작성된 글이 없습니다</p>
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-full text-sm font-medium hover:bg-brand-primary/90 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              첫 글 작성하기
            </Link>
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.title}
        isLoading={isDeleting}
      />
    </div>
  );
}
