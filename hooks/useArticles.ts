'use client';

import { logger } from '@/lib/logger';
import { useState, useEffect } from 'react';
import { getAllArticles, getArticleBySlug } from '@/lib/firestore-articles';
import { articles as staticArticles, getArticleBySlug as getStaticArticleBySlug } from '@/data/articles';
import type { FirestoreArticle as Article } from '@/types/admin';

interface UseArticlesReturn {
  articles: Article[];
  isLoading: boolean;
  error: string | null;
  dataSource: 'firestore' | 'static';
}

interface UseArticleReturn {
  article: Article | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * 모든 글을 가져오는 훅
 * Firestore 실패 시 정적 데이터로 fallback
 */
export function useArticles(): UseArticlesReturn {
  const [articles, setArticles] = useState<Article[]>(staticArticles);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'firestore' | 'static'>('static');

  useEffect(() => {
    const loadArticles = async (): Promise<void> => {
      try {
        const firestoreArticles = await getAllArticles();
        if (firestoreArticles.length > 0) {
          setArticles(firestoreArticles);
          setDataSource('firestore');
        } else {
          setArticles(staticArticles);
          setDataSource('static');
        }
      } catch (err) {
        logger.warn('Firestore 글 로드 실패, 정적 데이터 사용:', err);
        setArticles(staticArticles);
        setDataSource('static');
        setError('Firestore 연결 실패');
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);

  return { articles, isLoading, error, dataSource };
}

/**
 * 단일 글을 가져오는 훅
 */
export function useArticle(slug: string): UseArticleReturn {
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async (): Promise<void> => {
      try {
        // Firestore 먼저 시도
        const firestoreArticle = await getArticleBySlug(slug);
        if (firestoreArticle) {
          setArticle(firestoreArticle);
        } else {
          // 정적 데이터에서 찾기
          const staticArticle = getStaticArticleBySlug(slug);
          if (staticArticle) {
            setArticle(staticArticle);
          } else {
            setError('글을 찾을 수 없습니다');
          }
        }
      } catch (err) {
        logger.warn('글 로드 실패:', err);
        // 정적 데이터 fallback
        const staticArticle = getStaticArticleBySlug(slug);
        if (staticArticle) {
          setArticle(staticArticle);
        } else {
          setError('글을 찾을 수 없습니다');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      loadArticle();
    }
  }, [slug]);

  return { article, isLoading, error };
}
