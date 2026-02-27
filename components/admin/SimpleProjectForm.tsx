'use client';

import { logger } from '@/lib/logger';
import { useState, useCallback, useEffect, useRef, DragEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { SimpleProjectFormData, ProjectCategory, ProjectStatus } from '@/types/admin';
import { saveProject } from '@/lib/firestore-projects';
import { uploadImage } from '@/lib/storage';
import { optimizeImage, formatFileSize } from '@/lib/image-optimizer';
import ImagePicker from './ImagePicker';

interface SimpleProjectFormProps {
  initialData?: Partial<SimpleProjectFormData>;
  isEdit?: boolean;
}

const EMPTY_FORM: SimpleProjectFormData = {
  title: '',
  description: '',
  category: 'MVP',
  thumbnail: {},
  content: '',
  images: [],
  featured: false,
  status: 'SAMPLE',
  tag: '',
  period: '',
  teamSize: '',
  overview: '',
  tech: { frontend: [], backend: [], database: [], other: [] },
  links: undefined,
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

const getAutoSaveKey = (id?: string) => `project-form-${id || 'new'}`;

export default function SimpleProjectForm({
  initialData,
  isEdit = false,
}: SimpleProjectFormProps): React.ReactElement {
  const router = useRouter();
  const [formData, setFormData] = useState<SimpleProjectFormData>(() => {
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
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [imagePickerTarget, setImagePickerTarget] = useState<'thumbnail' | number>('thumbnail');
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
      const result = await saveProject(formData as any);
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

  const openImagePicker = (target: 'thumbnail' | number): void => {
    setImagePickerTarget(target);
    setShowImagePicker(true);
  };

  const handleImageSelect = (url: string): void => {
    if (imagePickerTarget === 'thumbnail') {
      setFormData((prev) => ({
        ...prev,
        thumbnail: { ...prev.thumbnail, imageUrl: url },
      }));
    } else {
      const newImages = [...formData.images];
      newImages[imagePickerTarget] = { ...newImages[imagePickerTarget], url };
      setFormData((prev) => ({ ...prev, images: newImages }));
    }
    setShowImagePicker(false);
  };

  const addImage = (): void => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { url: '', caption: '' }],
    }));
  };

  const removeImage = (index: number): void => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const updateImageCaption = (index: number, caption: string): void => {
    const newImages = [...formData.images];
    newImages[index] = { ...newImages[index], caption };
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
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

        {/* 프로젝트 정보 섹션 */}
        <section className="bg-white/80 rounded-2xl p-6 border border-brand-primary/10">
          <h2 className="text-lg font-bold text-brand-primary mb-6">프로젝트 정보</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-brand-text mb-2">태그 (Industry)</label>
                <input
                  type="text"
                  value={formData.tag || ''}
                  onChange={(e) => updateField('tag', e.target.value)}
                  placeholder="예: Fintech, Edutech"
                  className="w-full px-4 py-3 rounded-xl border border-brand-primary/10 focus:outline-none focus:border-brand-secondary bg-white"
                />
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

            <div>
              <label className="block text-sm font-medium text-brand-text mb-2">프로젝트 개요</label>
              <textarea
                value={formData.overview || ''}
                onChange={(e) => updateField('overview', e.target.value)}
                placeholder="프로젝트에 대한 간단한 개요를 작성해주세요. 상세 페이지 상단에 표시됩니다."
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-brand-primary/10 focus:outline-none focus:border-brand-secondary bg-white"
              />
            </div>
          </div>
        </section>

        {/* 기술 스택 섹션 */}
        <section className="bg-white/80 rounded-2xl p-6 border border-brand-primary/10">
          <h2 className="text-lg font-bold text-brand-primary mb-6">기술 스택</h2>
          <p className="text-sm text-brand-muted mb-4">쉼표(,)로 구분하여 입력해주세요.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-brand-text mb-2">Frontend</label>
              <input
                type="text"
                value={(formData.tech?.frontend || []).join(', ')}
                onChange={(e) => updateField('tech', {
                  ...formData.tech,
                  frontend: e.target.value ? e.target.value.split(',').map(s => s.trim()).filter(Boolean) : [],
                })}
                placeholder="React, TypeScript, Tailwind CSS"
                className="w-full px-4 py-3 rounded-xl border border-brand-primary/10 focus:outline-none focus:border-brand-secondary bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text mb-2">Backend</label>
              <input
                type="text"
                value={(formData.tech?.backend || []).join(', ')}
                onChange={(e) => updateField('tech', {
                  ...formData.tech,
                  backend: e.target.value ? e.target.value.split(',').map(s => s.trim()).filter(Boolean) : [],
                })}
                placeholder="Node.js, FastAPI, Firebase"
                className="w-full px-4 py-3 rounded-xl border border-brand-primary/10 focus:outline-none focus:border-brand-secondary bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text mb-2">Database</label>
              <input
                type="text"
                value={(formData.tech?.database || []).join(', ')}
                onChange={(e) => updateField('tech', {
                  ...formData.tech,
                  database: e.target.value ? e.target.value.split(',').map(s => s.trim()).filter(Boolean) : [],
                })}
                placeholder="PostgreSQL, Redis, Firestore"
                className="w-full px-4 py-3 rounded-xl border border-brand-primary/10 focus:outline-none focus:border-brand-secondary bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text mb-2">기타 (Infra/Tools)</label>
              <input
                type="text"
                value={(formData.tech?.other || []).join(', ')}
                onChange={(e) => updateField('tech', {
                  ...formData.tech,
                  other: e.target.value ? e.target.value.split(',').map(s => s.trim()).filter(Boolean) : [],
                })}
                placeholder="Docker, AWS, Vercel"
                className="w-full px-4 py-3 rounded-xl border border-brand-primary/10 focus:outline-none focus:border-brand-secondary bg-white"
              />
            </div>
          </div>
        </section>

        {/* 프로젝트 링크 섹션 */}
        <section className="bg-white/80 rounded-2xl p-6 border border-brand-primary/10">
          <h2 className="text-lg font-bold text-brand-primary mb-6">프로젝트 링크</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-brand-text mb-2">라이브 사이트 URL</label>
              <input
                type="url"
                value={formData.links?.live || ''}
                onChange={(e) => updateField('links', {
                  ...formData.links,
                  live: e.target.value || undefined,
                })}
                placeholder="https://example.com"
                className="w-full px-4 py-3 rounded-xl border border-brand-primary/10 focus:outline-none focus:border-brand-secondary bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text mb-2">GitHub URL</label>
              <input
                type="url"
                value={formData.links?.github || ''}
                onChange={(e) => updateField('links', {
                  ...formData.links,
                  github: e.target.value || undefined,
                })}
                placeholder="https://github.com/username/repo"
                className="w-full px-4 py-3 rounded-xl border border-brand-primary/10 focus:outline-none focus:border-brand-secondary bg-white"
              />
            </div>
          </div>
        </section>

        <ThumbnailUploadSection
          thumbnailUrl={formData.thumbnail.imageUrl}
          onUpload={(url) => setFormData((prev) => ({ ...prev, thumbnail: { imageUrl: url } }))}
          onClear={() => setFormData((prev) => ({ ...prev, thumbnail: {} }))}
        />

        <section className="bg-white/80 rounded-2xl p-6 border border-brand-primary/10">
          <h2 className="text-lg font-bold text-brand-primary mb-6">상세 내용</h2>

          <div className="space-y-4">
            <p className="text-sm text-brand-muted">
              프로젝트 개요, 도전과제, 해결 방안, 결과 등을 자유롭게 작성해주세요.
              마크다운 문법을 지원합니다.
            </p>
            
            <textarea
              value={formData.content}
              onChange={(e) => updateField('content', e.target.value)}
              placeholder={`# 프로젝트 개요\n\n프로젝트에 대해 설명해주세요...\n\n## 도전과제\n\n## 해결 방안\n\n## 결과\n\n## 기술 스택\n\nReact, Node.js, Firebase`}
              rows={20}
              className="w-full px-4 py-3 rounded-xl border border-brand-primary/10 focus:outline-none focus:border-brand-secondary bg-white font-mono text-sm"
            />
          </div>
        </section>

        <section className="bg-white/80 rounded-2xl p-6 border border-brand-primary/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-brand-primary">갤러리 이미지</h2>
            <button
              type="button"
              onClick={addImage}
              className="px-4 py-2 bg-brand-secondary text-white rounded-xl text-sm font-medium hover:bg-brand-secondary/90 transition-colors"
            >
              + 이미지 추가
            </button>
          </div>

          {formData.images.length === 0 ? (
            <div className="text-center py-8 text-brand-muted">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">아직 등록된 이미지가 없습니다.</p>
              <p className="text-xs mt-1">+ 이미지 추가 버튼을 클릭하여 프로젝트 이미지를 추가하세요.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.images.map((image, index) => (
                <div key={index} className="flex gap-4 items-start p-4 border border-brand-primary/10 rounded-xl">
                  <button
                    type="button"
                    onClick={() => openImagePicker(index)}
                    className="flex-shrink-0 w-24 h-24 border-2 border-dashed border-brand-primary/20 rounded-lg overflow-hidden hover:border-brand-secondary/50 transition-colors"
                  >
                    {image.url ? (
                      <img src={image.url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-brand-muted">
                        <span className="text-xs">선택</span>
                      </div>
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <input
                      type="text"
                      value={image.caption || ''}
                      onChange={(e) => updateImageCaption(index, e.target.value)}
                      placeholder="이미지 설명 (선택사항)"
                      className="w-full px-3 py-2 rounded-lg border border-brand-primary/10 focus:outline-none focus:border-brand-secondary text-sm"
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
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
                {lastSaved ? lastSaved.toLocaleTimeString() : ''} 자동 저장
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

      {showImagePicker && (
        <ImagePicker
          onSelect={handleImageSelect}
          onClose={() => setShowImagePicker(false)}
          isOpen={showImagePicker}
        />
      )}
    </>
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
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      // Optimize image before upload
      const optimizedFile = await optimizeImage(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.85,
        format: 'webp',
      });

      // Upload to Firebase Storage
      const url = await uploadImage(optimizedFile, 'portfolio');

      clearInterval(progressInterval);
      setUploadProgress(100);

      onUpload(url);
    } catch (error) {
      logger.error('Upload failed:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  if (thumbnailUrl) {
    return (
      <section className="bg-white/80 rounded-2xl p-6 border border-brand-primary/10">
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
