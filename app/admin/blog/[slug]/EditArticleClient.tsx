'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import ArticleForm from '@/components/admin/ArticleForm';
import { getArticleBySlug } from '@/lib/firestore-articles';
import { getArticleBySlug as getStaticArticleBySlug } from '@/data/articles';
import type { ArticleFormData } from '@/types/admin';

interface EditArticleClientProps {
  slug: string;
}

export default function EditArticleClient({ slug }: EditArticleClientProps): React.ReactElement {
  const router = useRouter();
  // URL에서 실제 slug를 읽어옴 (폴백 페이지에서도 올바른 slug 사용)
  const pathname = usePathname();
  const urlSlug = pathname?.split('/').filter(Boolean).at(-1) || slug;
  const decodedSlug = decodeURIComponent(urlSlug);
  const [article, setArticle] = useState<ArticleFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadArticle();
  }, [decodedSlug]);

  const loadArticle = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Try Firestore first
      const firestoreArticle = await getArticleBySlug(decodedSlug);
      if (firestoreArticle) {
        setArticle(firestoreArticle);
        setIsLoading(false);
        return;
      }

      // Fallback to static data
      const staticArticle = getStaticArticleBySlug(decodedSlug);
      if (staticArticle) {
        setArticle(staticArticle);
        setIsLoading(false);
        return;
      }

      setError('글을 찾을 수 없습니다.');
    } catch {
      setError('글을 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-brand-primary/10 rounded-lg" />
          <div>
            <div className="h-8 bg-brand-primary/10 rounded-lg w-48" />
            <div className="h-4 bg-brand-primary/5 rounded mt-2 w-32" />
          </div>
        </div>
        <div className="bg-white/60 rounded-2xl h-96 border border-brand-primary/5" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="text-center py-16 bg-white/80 rounded-2xl border border-brand-primary/10">
        <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <p className="text-brand-muted mb-4">{error || '글을 찾을 수 없습니다.'}</p>
        <button
          onClick={() => router.push('/admin/blog')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-full text-sm font-medium hover:bg-brand-primary/90 transition-all"
        >
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/blog"
          className="p-2 hover:bg-brand-primary/5 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">글 수정</h1>
          <p className="text-brand-muted text-sm mt-1">{article.title}</p>
        </div>
      </div>

      {/* Form */}
      <ArticleForm initialData={article} isEdit />
    </div>
  );
}
