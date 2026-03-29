'use client';

import { logger } from '@/lib/logger';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllProjects, deleteProject } from '@/lib/firestore-projects';
import type { FirestoreProject } from '@/types/admin';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import Toast from '@/components/ui/Toast';
import ProjectCard from '@/components/ui/ProjectCard';
import { Pattern1, Pattern2, Pattern3 } from '@/components/ui/Patterns';
import { getProjectTechString } from '@/lib/utils';

export default function PortfolioAdminPage(): React.ReactElement {
  const [projects, setProjects] = useState<FirestoreProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<FirestoreProject | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [dataSource, setDataSource] = useState<'firestore' | 'static'>('static');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const firestoreProjects = await getAllProjects();
      setProjects(firestoreProjects);
      setDataSource(firestoreProjects.length > 0 ? 'firestore' : 'static');
    } catch {
      setProjects([]);
      setDataSource('static');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const result = await deleteProject(deleteTarget.id);
      if (result.success) {
        setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        setToast({ message: '프로젝트가 삭제되었습니다.', type: 'success' });
      } else {
        setToast({ message: result.error || '삭제에 실패했습니다.', type: 'error' });
      }
    } catch {
      setToast({ message: '삭제 중 오류가 발생했습니다.', type: 'error' });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const getTechString = (project: FirestoreProject): string => {
    return getProjectTechString(project.tech);
  };

  const getTagLabel = (project: FirestoreProject): string => {
    if (project.tag) return project.tag;
    const labels: Record<string, string> = {
      MVP: 'MVP',
      AUTOMATION: 'Automation',
      TRADING: 'Trading',
      PROTOTYPE: 'Prototype',
    };
    return labels[project.category] || project.category;
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 bg-brand-primary/10 rounded-lg w-48 animate-pulse" />
            <div className="h-4 bg-brand-primary/5 rounded mt-2 w-32 animate-pulse" />
          </div>
          <div className="h-10 bg-brand-primary/10 rounded-full w-32 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[400px] bg-white/60 rounded-2xl border border-brand-primary/5 animate-pulse" />
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
          <h1 className="text-2xl font-bold text-brand-primary">Portfolio</h1>
          <p className="text-brand-muted text-sm mt-1">
            {projects.length}개의 프로젝트
            {dataSource === 'static' && (
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                정적 데이터
              </span>
            )}
          </p>
        </div>
        <Link
          href="/admin/portfolio/new"
          className="px-5 py-2.5 bg-brand-primary text-white rounded-full text-sm font-medium hover:bg-brand-primary/90 transition-all duration-300 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 프로젝트
        </Link>
      </div>

      {/* Project Cards Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => {
            const PatternComponent =
              project.thumbnail.pattern === 'Pattern2'
                ? Pattern2
                : project.thumbnail.pattern === 'Pattern3'
                  ? Pattern3
                  : Pattern1;

            return (
              <div key={project.id} className="relative group">
                {/* Admin Actions Overlay */}
                <div className="absolute top-3 right-3 z-20 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Link
                    href={`/admin/portfolio/${project.id}`}
                    className="p-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-md hover:bg-brand-primary hover:text-white transition-colors"
                    title="수정"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => setDeleteTarget(project)}
                    className="p-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-md hover:bg-red-500 hover:text-white transition-colors"
                    title="삭제"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 left-3 z-20">
                  <span className={`px-2 py-1 text-xs font-bold rounded-lg ${
                    project.status === 'PUBLISHED'
                      ? 'bg-green-100 text-green-700'
                      : project.status === 'SAMPLE'
                        ? 'bg-blue-100 text-blue-700'
                        : project.status === 'PROTOTYPE'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                  }`}>
                    {project.status}
                  </span>
                  {project.featured && (
                    <span className="ml-1 px-2 py-1 bg-brand-secondary/20 text-brand-secondary text-xs font-bold rounded-lg">
                      Featured
                    </span>
                  )}
                </div>

                {/* Project Card - Link to public view */}
                <div className="h-full">
                  <ProjectCard
                    pattern={PatternComponent}
                    imageUrl={project.thumbnail.imageUrl}
                    title={project.title}
                    description={project.description}
                    tag={getTagLabel(project)}
                    tech={getTechString(project)}
                    href={`/portfolio/${project.id}`}
                    enable3DTilt={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white/80 rounded-2xl border border-brand-primary/10">
          <div className="w-20 h-20 bg-brand-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <p className="text-brand-muted mb-4">아직 프로젝트가 없습니다</p>
          <Link
            href="/admin/portfolio/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white rounded-full text-sm font-medium hover:bg-brand-primary/90 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            첫 프로젝트 추가하기
          </Link>
        </div>
      )}

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.title}
        isLoading={isDeleting}
      />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
