'use client';

import Link from 'next/link';
import SimpleProjectForm from '@/components/admin/SimpleProjectForm';

export default function NewProjectPage(): React.ReactElement {
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
          <h1 className="text-2xl font-bold text-brand-primary">새 프로젝트</h1>
          <p className="text-brand-muted text-sm mt-1">포트폴리오에 새 프로젝트를 추가합니다</p>
        </div>
      </div>

      {/* Form */}
      <SimpleProjectForm />
    </div>
  );
}
