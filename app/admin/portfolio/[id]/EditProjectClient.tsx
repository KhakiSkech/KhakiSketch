'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SimpleProjectForm from '@/components/admin/SimpleProjectForm';
import { getProjectById } from '@/lib/firestore-projects';
import { getProjectById as getStaticProjectById } from '@/data/projects';
import type { SimpleProjectFormData, FirestoreProject } from '@/types/admin';

interface EditProjectClientProps {
  id: string;
}

// Convert FirestoreProject to SimpleProjectFormData
const convertToSimpleFormData = (project: FirestoreProject): SimpleProjectFormData => {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    category: project.category,
    thumbnail: project.thumbnail,
    content: project.content || project.markdownContent || '',
    images: project.images || [],
    featured: project.featured || false,
    status: project.status,
    tag: project.tag || '',
    period: project.period || '',
    teamSize: project.teamSize || '',
    overview: project.overview || '',
    tech: project.tech || { frontend: [], backend: [], database: [], other: [] },
    challenge: project.challenge,
    solution: project.solution,
    result: project.result,
    links: project.links,
  };
};

export default function EditProjectClient({ id }: EditProjectClientProps): React.ReactElement {
  const router = useRouter();
  const decodedId = decodeURIComponent(id);
  const [project, setProject] = useState<SimpleProjectFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProject();
  }, [decodedId]);

  const loadProject = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Try Firestore first
      const firestoreProject = await getProjectById(decodedId);
      if (firestoreProject) {
        setProject(convertToSimpleFormData(firestoreProject));
        setIsLoading(false);
        return;
      }

      // Fallback to static data
      const staticProject = getStaticProjectById(decodedId);
      if (staticProject) {
        setProject(convertToSimpleFormData(staticProject));
        setIsLoading(false);
        return;
      }

      setError('프로젝트를 찾을 수 없습니다.');
    } catch {
      setError('프로젝트를 불러오는 데 실패했습니다.');
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

  if (error || !project) {
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
        <p className="text-brand-muted mb-4">{error || '프로젝트를 찾을 수 없습니다.'}</p>
        <button
          onClick={() => router.push('/admin/portfolio')}
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
          href="/admin/portfolio"
          className="p-2 hover:bg-brand-primary/5 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">프로젝트 수정</h1>
          <p className="text-brand-muted text-sm mt-1">{project.title}</p>
        </div>
      </div>

      {/* Form */}
      <SimpleProjectForm initialData={project} isEdit />
    </div>
  );
}
