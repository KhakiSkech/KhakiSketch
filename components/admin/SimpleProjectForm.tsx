'use client';

import { logger } from '@/lib/logger';
import { useState, useCallback, useEffect, useRef, DragEvent, ChangeEvent } from 'react';
import Toast from '@/components/ui/Toast';
import { useRouter } from 'next/navigation';
import type { SimpleProjectFormData, ProjectCategory, ProjectStatus, ThumbnailPattern } from '@/types/admin';
import { saveProject } from '@/lib/firestore-projects';
import { uploadImage } from '@/lib/storage';
import { optimizeImage } from '@/lib/image-optimizer';
import dynamic from 'next/dynamic';
const WysiwygEditor = dynamic(() => import('./WysiwygEditor'), { ssr: false });
import ProjectCard from '@/components/ui/ProjectCard';
import { Pattern1, Pattern2, Pattern3 } from '@/components/ui/Patterns';

interface SimpleProjectFormProps {
  initialData?: Partial<SimpleProjectFormData>;
  isEdit?: boolean;
}

const EMPTY_FORM: SimpleProjectFormData = {
  title: '',
  description: '',
  category: 'MVP',
  thumbnail: { pattern: 'Pattern1' },
  content: '',
  images: [],
  featured: false,
  status: 'SAMPLE',
  period: '',
  teamSize: '',
};

const CATEGORIES: { value: ProjectCategory; label: string }[] = [
  { value: 'MVP', label: 'MVP' },
  { value: 'AUTOMATION', label: '업무 자동화' },
  { value: 'TRADING', label: '트레이딩' },
  { value: 'PROTOTYPE', label: '프로토타입' },
];

const STATUSES: { value: ProjectStatus; label: string }[] = [
  { value: 'PUBLISHED', label: '게시됨' },
  { value: 'SAMPLE', label: '샘플' },
  { value: 'PROTOTYPE', label: '프로토타입' },
  { value: 'INTERNAL', label: '내부용' },
];

const PATTERNS: { value: ThumbnailPattern; label: string; Component: React.ElementType }[] = [
  { value: 'Pattern1', label: '파도', Component: Pattern1 },
  { value: 'Pattern2', label: '기하학', Component: Pattern2 },
  { value: 'Pattern3', label: '차트', Component: Pattern3 },
];

const patternMap: Record<string, React.ElementType> = {
  Pattern1,
  Pattern2,
  Pattern3,
};

const getAutoSaveKey = (id?: string) => `project-form-${id || 'new'}`;

export default function SimpleProjectForm({
  initialData,
  isEdit = false,
}: SimpleProjectFormProps): React.ReactElement {
  const router = useRouter();
  const [formData, setFormData] = useState<SimpleProjectFormData>(() => {
    // 수정 모드: Firestore 데이터 우선 사용 (localStorage 자동저장이 덮어쓰는 문제 방지)
    if (isEdit && initialData) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(getAutoSaveKey(initialData.id));
      }
      return { ...EMPTY_FORM, ...initialData };
    }
    // 새 글 모드: localStorage 자동저장 복원
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(getAutoSaveKey(initialData?.id));
      if (saved) {
        try {
          return { ...EMPTY_FORM, ...JSON.parse(saved) };
        } catch {
          // ignore
        }
      }
    }
    return { ...EMPTY_FORM, ...initialData };
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (formData.title || formData.description || formData.content) {
        localStorage.setItem(getAutoSaveKey(formData.id), JSON.stringify(formData));
        setLastSaved(new Date());
      }
    }, 30000);

    return () => clearInterval(timer);
  }, [formData]);

  useEffect(() => {
    const hasUnsavedChanges =
      formData.title !== (initialData?.title ?? EMPTY_FORM.title) ||
      formData.description !== (initialData?.description ?? EMPTY_FORM.description) ||
      formData.content !== (initialData?.content ?? EMPTY_FORM.content);

    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [formData, initialData]);

  const updateField = useCallback(
    <K extends keyof SimpleProjectFormData>(field: K, value: SimpleProjectFormData[K]): void => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await saveProject({ ...formData, contentFormat: 'html' });
      if (result.success) {
        localStorage.removeItem(getAutoSaveKey(formData.id));
        router.push('/admin/portfolio');
      } else {
        setError(result.error || '저장에 실패했습니다.');
      }
    } catch {
      setError('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPattern = formData.thumbnail.pattern || 'Pattern1';
  const PatternComponent = patternMap[selectedPattern] || Pattern1;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* 왼쪽: 폼 (2/3) */}
      <form onSubmit={handleSubmit} className="flex-1 lg:w-2/3 space-y-8">
        {lastSaved && (
          <div className="flex items-center gap-2 text-xs text-brand-muted">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {lastSaved.toLocaleTimeString()}에 자동 저장됨
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* 기본 정보 */}
        <section className="bg-white/80 rounded-2xl p-6 border border-brand-primary/10">
          <h2 className="text-lg font-bold text-brand-primary mb-6">기본 정보</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-brand-text mb-2">제목 *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                required
                placeholder="프로젝트 제목을 입력하세요"
                className="w-full px-4 py-3 rounded-xl border border-brand-primary/10 focus:outline-none focus:border-brand-secondary bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text mb-2">설명 *</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                required
                placeholder="프로젝트를 간단히 설명해주세요"
                className="w-full px-4 py-3 rounded-xl border border-brand-primary/10 focus:outline-none focus:border-brand-secondary bg-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-brand-text mb-2">카테고리 *</label>
                <select
                  value={formData.category}
                  onChange={(e) => updateField('category', e.target.value as ProjectCategory)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-primary/10 focus:outline-none focus:border-brand-secondary bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text mb-2">상태</label>
                <select
                  value={formData.status}
                  onChange={(e) => updateField('status', e.target.value as ProjectStatus)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-primary/10 focus:outline-none focus:border-brand-secondary bg-white"
                >
                  {STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text mb-2">기간</label>
                <input
                  type="text"
                  value={formData.period || ''}
                  onChange={(e) => updateField('period', e.target.value)}
                  placeholder="예: 3개월, 2024.01 - 2024.06"
                  className="w-full px-4 py-3 rounded-xl border border-brand-primary/10 focus:outline-none focus:border-brand-secondary bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text mb-2">팀 규모</label>
                <input
                  type="text"
                  value={formData.teamSize || ''}
                  onChange={(e) => updateField('teamSize', e.target.value)}
                  placeholder="예: 2명, 3명 (BE 2, FE 1)"
                  className="w-full px-4 py-3 rounded-xl border border-brand-primary/10 focus:outline-none focus:border-brand-secondary bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => updateField('featured', e.target.checked)}
                className="w-5 h-5 rounded border-brand-primary/20 text-brand-secondary focus:ring-brand-secondary"
              />
              <label htmlFor="featured" className="text-sm font-medium text-brand-text cursor-pointer">
                Featured 프로젝트로 설정 (메인 페이지에 노출)
              </label>
            </div>
          </div>
        </section>

        <ThumbnailUploadSection
          thumbnailUrl={formData.thumbnail.imageUrl}
          onUpload={(url) => setFormData((prev) => ({ ...prev, thumbnail: { imageUrl: url } }))}
          onClear={() => setFormData((prev) => ({ ...prev, thumbnail: { pattern: selectedPattern } }))}
        />

        {/* 상세 내용 */}
        <section className="bg-white/80 rounded-2xl p-6 border border-brand-primary/10">
          <h2 className="text-lg font-bold text-brand-primary mb-6">상세 내용</h2>
          <WysiwygEditor
            initialContent={formData.content}
            onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
            imageCategory="portfolio"
          />
        </section>

        <div className="flex items-center justify-between pt-6">
          <button
            type="button"
            onClick={() => router.push('/admin/portfolio')}
            className="px-6 py-3 text-brand-muted hover:text-brand-text font-medium transition-colors"
          >
            취소
          </button>

          <div className="flex items-center gap-4">
            {lastSaved && (
              <span className="text-sm text-brand-muted">
                {lastSaved.toLocaleTimeString()} 자동 저장
              </span>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-brand-primary text-white rounded-xl font-medium hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? '저장 중...' : isEdit ? '수정하기' : '등록하기'}
            </button>
          </div>
        </div>
      </form>

      {/* 오른쪽: 실시간 미리보기 (1/3, sticky) */}
      <aside className="hidden lg:block lg:w-1/3">
        <div className="sticky top-6 space-y-6">
          {/* 카드 미리보기 */}
          <div>
            <h3 className="text-sm font-bold text-brand-primary mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              카드 미리보기
            </h3>
            <div className="pointer-events-none">
              <ProjectCard
                pattern={PatternComponent}
                imageUrl={formData.thumbnail.imageUrl}
                title={formData.title || '프로젝트 제목'}
                description={formData.description || '프로젝트 설명이 여기에 표시됩니다'}
                tag={formData.category}
                enable3DTilt={false}
              />
            </div>
          </div>

          {/* 패턴 선택 (썸네일 이미지가 없을 때만) */}
          {!formData.thumbnail.imageUrl && (
            <div className="bg-white/80 rounded-2xl p-4 border border-brand-primary/10">
              <h3 className="text-sm font-bold text-brand-primary mb-3">배경 패턴</h3>
              <div className="grid grid-cols-3 gap-2">
                {PATTERNS.map(({ value, label, Component }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        thumbnail: { pattern: value },
                      }))
                    }
                    className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                      selectedPattern === value
                        ? 'border-brand-secondary ring-2 ring-brand-secondary/30'
                        : 'border-brand-primary/10 hover:border-brand-secondary/50'
                    }`}
                  >
                    <Component />
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-medium text-white bg-black/50 px-1.5 py-0.5 rounded">
                      {label}
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-brand-muted mt-2">
                썸네일 이미지를 업로드하면 패턴 대신 이미지가 표시됩니다.
              </p>
            </div>
          )}

          {/* 상태 요약 */}
          <div className="bg-white/80 rounded-2xl p-4 border border-brand-primary/10">
            <h3 className="text-sm font-bold text-brand-primary mb-3">작성 현황</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-brand-muted">제목</span>
                <span className={formData.title ? 'text-green-600' : 'text-red-400'}>
                  {formData.title ? '입력됨' : '미입력'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-muted">설명</span>
                <span className={formData.description ? 'text-green-600' : 'text-red-400'}>
                  {formData.description ? '입력됨' : '미입력'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-muted">썸네일</span>
                <span className={formData.thumbnail.imageUrl ? 'text-green-600' : 'text-brand-muted'}>
                  {formData.thumbnail.imageUrl ? '업로드됨' : '패턴 사용'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-muted">본문</span>
                <span className={formData.content && formData.content !== '<p></p>' ? 'text-green-600' : 'text-red-400'}>
                  {formData.content && formData.content !== '<p></p>' ? '작성됨' : '미작성'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-brand-muted">상태</span>
                <span className="text-brand-text font-medium">
                  {STATUSES.find((s) => s.value === formData.status)?.label}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

// Thumbnail Upload Component
interface ThumbnailUploadSectionProps {
  thumbnailUrl?: string;
  onUpload: (url: string) => void;
  onClear: () => void;
}

function ThumbnailUploadSection({ thumbnailUrl, onUpload, onClear }: ThumbnailUploadSectionProps): React.ReactElement {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
    e.target.value = '';
  };

  const handleFileUpload = async (file: File): Promise<void> => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      const optimizedFile = await optimizeImage(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.85,
        format: 'webp',
      });

      const url = await uploadImage(optimizedFile, 'portfolio');

      clearInterval(progressInterval);
      setUploadProgress(100);

      onUpload(url);
    } catch (error) {
      logger.error('Upload failed:', error);
      setToast({ message: '이미지 업로드에 실패했습니다.', type: 'error' });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  if (thumbnailUrl) {
    return (
      <section className="bg-white/80 rounded-2xl p-6 border border-brand-primary/10">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-brand-primary">썸네일</h2>
          <button
            type="button"
            onClick={onClear}
            className="text-sm text-red-500 hover:text-red-600 font-medium"
          >
            삭제
          </button>
        </div>
        <div className="relative aspect-video rounded-xl overflow-hidden border border-brand-primary/10">
          <img
            src={thumbnailUrl}
            alt="Thumbnail"
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white/80 rounded-2xl p-6 border border-brand-primary/10">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <h2 className="text-lg font-bold text-brand-primary mb-4">썸네일</h2>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-brand-secondary bg-brand-secondary/5'
            : 'border-brand-primary/20 hover:border-brand-secondary/50 hover:bg-brand-bg'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {isUploading ? (
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full border-3 border-brand-primary/20 border-t-brand-secondary animate-spin" />
            <p className="text-sm text-brand-muted">업로드 중... {uploadProgress}%</p>
            <div className="w-full h-2 bg-brand-primary/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-secondary transition-all duration-200"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <>
            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
              isDragging ? 'bg-brand-secondary/10' : 'bg-brand-primary/5'
            }`}>
              <svg
                className={`w-8 h-8 ${isDragging ? 'text-brand-secondary' : 'text-brand-muted'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <p className="text-brand-text mb-1">
              이미지를 드래그하거나 <span className="text-brand-secondary font-medium">클릭</span>하여 선택하세요
            </p>
            <p className="text-xs text-brand-muted">PNG, JPG, WebP 지원 (최대 10MB)</p>
          </>
        )}
      </div>
    </section>
  );
}
