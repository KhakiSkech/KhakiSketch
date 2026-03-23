'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { ArticleFormData, ArticleCategory } from '@/types/admin';
import { saveArticle, calculateReadingTime } from '@/lib/firestore-articles';
import { generateSlug } from '@/lib/utils';
import WysiwygEditor from './WysiwygEditor';
import ImagePicker from './ImagePicker';

interface ArticleFormProps {
  initialData?: Partial<ArticleFormData>;
  isEdit?: boolean;
}

const EMPTY_FORM: ArticleFormData = {
  slug: '',
  title: '',
  description: '',
  category: 'GUIDE',
  publishedAt: new Date().toISOString().split('T')[0],
  readingTime: '5분',
  tags: [],
  featured: false,
  coverImage: '',
  content: '',
};

const CATEGORIES: { value: ArticleCategory; label: string }[] = [
  { value: 'GUIDE', label: '가이드' },
  { value: 'INSIGHT', label: '인사이트' },
  { value: 'CASE_STUDY', label: '케이스 스터디' },
  { value: 'NEWS', label: '뉴스' },
];

export default function ArticleForm({
  initialData,
  isEdit = false,
}: ArticleFormProps): React.ReactElement {
  const router = useRouter();
  const [formData, setFormData] = useState<ArticleFormData>({
    ...EMPTY_FORM,
    ...initialData,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || '');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const hasUnsavedChanges =
      formData.title !== (initialData?.title ?? EMPTY_FORM.title) ||
      formData.content !== (initialData?.content ?? EMPTY_FORM.content);

    const handler = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [formData, initialData]);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const readingTime = calculateReadingTime(formData.content);
      const slug = formData.slug || generateSlug(formData.title);

      const result = await saveArticle({
        ...formData,
        slug,
        tags,
        readingTime,
        contentFormat: 'html',
      });

      if (result.success) {
        router.push('/admin/blog');
      } else {
        setError(result.error || '저장에 실패했습니다.');
      }
    } catch {
      setError('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = <K extends keyof ArticleFormData>(
    field: K,
    value: ArticleFormData[K]
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
            {error}
          </div>
        )}

        {/* 기본 정보 */}
        <section className="bg-white/80 rounded-2xl p-6 border border-brand-primary/10">
          <h2 className="text-lg font-bold text-brand-primary mb-6">기본 정보</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-text mb-2">제목 *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField('title', e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-brand-primary/10 focus:outline-none focus:border-brand-secondary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-brand-text mb-2">설명 *</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                required
                placeholder="글에 대한 간단한 설명"
                className="w-full px-4 py-3 rounded-xl border border-brand-primary/10 focus:outline-none focus:border-brand-secondary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text mb-2">카테고리</label>
              <select
                value={formData.category}
                onChange={(e) => updateField('category', e.target.value as ArticleCategory)}
                className="w-full px-4 py-3 rounded-xl border border-brand-primary/10 focus:outline-none focus:border-brand-secondary"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text mb-2">
                태그 (쉼표로 구분)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="MVP, 스타트업, 개발전략"
                className="w-full px-4 py-3 rounded-xl border border-brand-primary/10 focus:outline-none focus:border-brand-secondary"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => updateField('featured', e.target.checked)}
                className="w-5 h-5 rounded border-brand-primary/20"
              />
              <label htmlFor="featured" className="text-sm font-medium text-brand-text">
                Featured 글로 설정
              </label>
            </div>

            {/* 고급 설정 토글 */}
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={() => setShowAdvanced((v) => !v)}
                className="flex items-center gap-2 text-sm text-brand-muted hover:text-brand-text transition-colors"
              >
                <svg
                  className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                고급 설정
              </button>

              {showAdvanced && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-brand-text mb-2">발행일</label>
                    <input
                      type="date"
                      value={formData.publishedAt}
                      onChange={(e) => updateField('publishedAt', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-brand-primary/10 focus:outline-none focus:border-brand-secondary"
                    />
                  </div>

                  {isEdit && (
                    <div>
                      <label className="block text-sm font-medium text-brand-text mb-2">Slug</label>
                      <input
                        type="text"
                        value={formData.slug}
                        disabled
                        className="w-full px-4 py-3 rounded-xl border border-brand-primary/10 bg-brand-bg text-brand-muted"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Cover Image */}
        <section className="bg-white/80 rounded-2xl p-6 border border-brand-primary/10">
          <h2 className="text-lg font-bold text-brand-primary mb-6">커버 이미지</h2>

          <div className="flex gap-3">
            <input
              type="text"
              value={formData.coverImage || ''}
              onChange={(e) => updateField('coverImage', e.target.value)}
              placeholder="이미지 URL"
              className="flex-1 px-4 py-3 rounded-xl border border-brand-primary/10 focus:outline-none focus:border-brand-secondary"
            />
            <button
              type="button"
              onClick={() => setShowImagePicker(true)}
              className="px-6 py-3 bg-brand-primary/5 rounded-xl hover:bg-brand-primary/10 transition-colors"
            >
              선택
            </button>
          </div>

          {formData.coverImage && (
            <div className="mt-4">
              <img
                src={formData.coverImage}
                alt="Cover preview"
                className="max-h-48 rounded-xl object-cover"
              />
            </div>
          )}
        </section>

        {/* Content */}
        <section className="bg-white/80 rounded-2xl p-6 border border-brand-primary/10">
          <h2 className="text-lg font-bold text-brand-primary mb-6">본문</h2>
          <WysiwygEditor
            initialContent={formData.content}
            onChange={(html) => setFormData({ ...formData, content: html })}
            imageCategory="blog"
          />
        </section>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.push('/admin/blog')}
            className="flex-1 py-4 bg-brand-primary/5 text-brand-text rounded-xl font-medium hover:bg-brand-primary/10 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-4 bg-brand-primary text-white rounded-xl font-medium hover:bg-brand-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting && (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {isEdit ? '수정 완료' : '글 발행'}
          </button>
        </div>
      </form>

      <ImagePicker
        isOpen={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        onSelect={(url) => updateField('coverImage', url)}
        category="blog"
      />
    </>
  );
}
