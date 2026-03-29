'use client';

import { logger } from '@/lib/logger';
import { useState, useEffect } from 'react';
import { getAllProjects, getFeaturedProjects, getProjectById } from '@/lib/firestore-projects';
import type { FirestoreProject as Project } from '@/types/admin';

interface UseProjectsReturn {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  dataSource: 'firestore' | 'static';
}

interface UseProjectReturn {
  project: Project | null;
  isLoading: boolean;
  error: string | null;
}

interface UseFeaturedProjectsReturn {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
}

/**
 * 모든 프로젝트를 가져오는 훅
 * Firestore 실패 시 정적 데이터로 fallback
 */
export function useProjects(): UseProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'firestore' | 'static'>('firestore');

  useEffect(() => {
    const loadProjects = async (): Promise<void> => {
      try {
        const firestoreProjects = await getAllProjects();
        setProjects(firestoreProjects);
        setDataSource('firestore');
      } catch (err) {
        logger.warn('Firestore 프로젝트 로드 실패:', err);
        setProjects([]);
        setError('Firestore 연결 실패');
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  return { projects, isLoading, error, dataSource };
}

/**
 * Featured 프로젝트만 가져오는 훅
 * Featured 프로젝트가 없으면 전체 프로젝트를 최대 6개까지 표시
 */
export function useFeaturedProjects(): UseFeaturedProjectsReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async (): Promise<void> => {
      try {
        const firestoreProjects = await getFeaturedProjects();
        setProjects(firestoreProjects.length > 0 ? firestoreProjects : []);
      } catch (err) {
        logger.warn('Featured 프로젝트 로드 실패:', err);
        setProjects([]);
        setError('Firestore 연결 실패');
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  return { projects, isLoading, error };
}

/**
 * 단일 프로젝트를 가져오는 훅
 */
export function useProject(id: string): UseProjectReturn {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async (): Promise<void> => {
      try {
        const firestoreProject = await getProjectById(id);
        if (firestoreProject) {
          setProject(firestoreProject);
        } else {
          setError('프로젝트를 찾을 수 없습니다');
        }
      } catch (err) {
        logger.warn('프로젝트 로드 실패:', err);
        setError('프로젝트를 찾을 수 없습니다');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadProject();
    }
  }, [id]);

  return { project, isLoading, error };
}
