// Firestore Projects Service
// Used by both server and client components

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
import type { FirestoreProject, ProjectFormData } from '@/types/admin';
import { MOCK_PROJECTS } from './mock-projects';
import { withTimeout, generateSlug } from './utils';

const PROJECTS_COLLECTION = 'projects';

/**
 * 모든 프로젝트 조회
 */
export async function getAllProjects(): Promise<FirestoreProject[]> {
  // Firebase 환경변수가 없으면 Mock 데이터 반환 (빌드 시점 안전성)
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    logger.warn('Firebase 환경변수 없음 - Mock 데이터 사용');
    return MOCK_PROJECTS;
  }

  try {
    const db = getFirebaseFirestore();
    const projectsRef = collection(db, PROJECTS_COLLECTION);
    const q = query(projectsRef, orderBy('createdAt', 'desc'));
    const snapshot = await withTimeout(getDocs(q), 5000); // 5s timeout

    return snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as FirestoreProject[];
  } catch (error) {
    logger.warn('프로젝트 목록 조회 실패:', error);
    return MOCK_PROJECTS;
  }
}

/**
 * Featured 프로젝트만 조회
 * 복합 인덱스 없으면 전체 조회 후 클라이언트 필터링으로 폴백
 */
export async function getFeaturedProjects(): Promise<FirestoreProject[]> {
  try {
    const db = getFirebaseFirestore();
    const projectsRef = collection(db, PROJECTS_COLLECTION);
    try {
      // 복합 인덱스가 있으면 서버 사이드 필터링
      const q = query(
        projectsRef,
        where('featured', '==', true),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await withTimeout(getDocs(q), 5000);
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as FirestoreProject[];
    } catch {
      // 복합 인덱스 없으면 전체 조회 후 클라이언트 필터링
      logger.warn('Featured 복합 쿼리 실패 - 클라이언트 필터링으로 폴백');
      const allProjects = await getAllProjects();
      return allProjects.filter((p) => p.featured);
    }
  } catch (error) {
    logger.warn('Featured 프로젝트 조회 실패:', error);
    return [];
  }
}

/**
 * 단일 프로젝트 조회
 */
export async function getProjectById(id: string): Promise<FirestoreProject | null> {
  // Firebase 환경변수가 없으면 Mock 데이터에서 검색
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || !process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    return MOCK_PROJECTS.find(p => p.id === id) || null;
  }

  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, PROJECTS_COLLECTION, id);
    const docSnap = await withTimeout(getDoc(docRef), 5000);

    if (docSnap.exists()) {
      return {
        ...docSnap.data(),
        id: docSnap.id,
      } as FirestoreProject;
    }
    return null;
  } catch (error) {
    logger.warn('프로젝트 조회 실패:', error);
    return null;
  }
}

/**
 * 프로젝트 생성/수정
 */
export async function saveProject(
  data: ProjectFormData
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const db = getFirebaseFirestore();
    const projectId = data.id || generateSlug(data.title, 50);
    const docRef = doc(db, PROJECTS_COLLECTION, projectId);

    const now = new Date().toISOString();
    let createdAt = now;

    try {
      const existingDoc = await withTimeout(getDoc(docRef), 3000);
      if (existingDoc.exists()) {
        const existingData = existingDoc.data();
        if (existingData && existingData.createdAt) {
          createdAt = existingData.createdAt;
        }
      }
    } catch (e) {
      // Ignore timeout/error on check, assume new
    }

    const projectData: FirestoreProject = {
      ...data,
      id: projectId,
      createdAt: createdAt,
      updatedAt: now,
    };

    const isExisting = createdAt !== now;
    if (isExisting) {
      // 기존 프로젝트: 폼에서 보내지 않는 레거시 필드 보존
      const updateData: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(projectData)) {
        if (value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0)) {
          updateData[key] = value;
        }
      }
      updateData.updatedAt = now;
      await updateDoc(docRef, updateData);
    } else {
      await setDoc(docRef, projectData);
    }

    return { success: true, id: projectId };
  } catch (error) {
    logger.error('프로젝트 저장 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '저장에 실패했습니다.',
    };
  }
}

/**
 * 프로젝트 삭제
 */
export async function deleteProject(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const db = getFirebaseFirestore();
    const docRef = doc(db, PROJECTS_COLLECTION, id);
    await deleteDoc(docRef);

    return { success: true };
  } catch (error) {
    logger.error('프로젝트 삭제 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '삭제에 실패했습니다.',
    };
  }
}
