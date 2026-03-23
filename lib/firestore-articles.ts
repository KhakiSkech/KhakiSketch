// Firestore Articles Service

import { logger } from './logger';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { getFirebaseFirestore } from './firebase';
import type { FirestoreArticle, ArticleFormData } from '@/types/admin';
import { MOCK_ARTICLES } from './mock-articles';
import { withTimeout, generateSlug } from './utils';

const ARTICLES_COLLECTION = 'articles';

/**
 * 모든 글 조회
 */
export async function getAllArticles(): Promise<FirestoreArticle[]> {
  try {
    const db = getFirebaseFirestore();
    const articlesRef = collection(db, ARTICLES_COLLECTION);
    const q = query(articlesRef, orderBy('publishedAt', 'desc'));
    const snapshot = await withTimeout(getDocs(q), 5000);

    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      slug: doc.id,
    })) as FirestoreArticle[];
  } catch (error) {
    logger.warn('글 목록 조회 실패 (Fallback 사용):', error);
    return MOCK_ARTICLES;
  }
}

/**
 * Featured 글만 조회
 */
export async function getFeaturedArticles(): Promise<FirestoreArticle[]> {
  try {
    const db = getFirebaseFirestore();
    const articlesRef = collection(db, ARTICLES_COLLECTION);
    const q = query(
      articlesRef,
      where('featured', '==', true),
      orderBy('publishedAt', 'desc')
    );
    const snapshot = await withTimeout(getDocs(q), 5000);

    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      slug: doc.id,
    })) as FirestoreArticle[];
  } catch (error) {
    logger.warn('Featured 글 조회 실패 (Fallback 사용):', error);
    return MOCK_ARTICLES.filter(a => a.featured);
  }
}

/**
 * 단일 글 조회
 */
export async function getArticleBySlug(slug: string): Promise<FirestoreArticle | null> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, ARTICLES_COLLECTION, slug);
    const docSnap = await withTimeout(getDoc(docRef), 5000);

    if (docSnap.exists()) {
      return {
        ...docSnap.data(),
        slug: docSnap.id,
      } as FirestoreArticle;
    }
    return null;
  } catch (error) {
    logger.warn('글 조회 실패 (Fallback 사용):', error);
    return MOCK_ARTICLES.find(a => a.slug === slug) || null;
  }
}

/**
 * 글 생성/수정
 */
export async function saveArticle(
  data: ArticleFormData
): Promise<{ success: boolean; slug?: string; error?: string }> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, ARTICLES_COLLECTION, data.slug);
    const now = new Date().toISOString();
    let createdAt = now;

    try {
      const existingDoc = await withTimeout(getDoc(docRef), 3000);
      if (existingDoc.exists()) {
        const docData = existingDoc.data();
        if (docData && docData.createdAt) {
          createdAt = docData.createdAt;
        }
      }
    } catch (e) {
      // ignore timeout/error, assume new
    }

    const articleData: FirestoreArticle = {
      ...data,
      createdAt: createdAt,
      updatedAt: now,
    };

    const isExisting = createdAt !== now;
    if (isExisting) {
      const updateData: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(articleData)) {
        if (value !== undefined) {
          updateData[key] = value;
        }
      }
      updateData.updatedAt = now;
      await updateDoc(docRef, updateData);
    } else {
      await setDoc(docRef, articleData);
    }

    return { success: true, slug: data.slug };
  } catch (error) {
    logger.error('글 저장 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '저장에 실패했습니다.',
    };
  }
}

/**
 * 글 삭제
 */
export async function deleteArticle(
  slug: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, ARTICLES_COLLECTION, slug);
    await deleteDoc(docRef);

    return { success: true };
  } catch (error) {
    logger.error('글 삭제 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '삭제에 실패했습니다.',
    };
  }
}

/**
 * 읽는 시간 계산
 */
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const plainText = content.replace(/<[^>]*>/g, '').trim();
  const words = plainText.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  return `${minutes}분`;
}
