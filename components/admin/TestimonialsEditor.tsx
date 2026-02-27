'use client';

import { logger } from '@/lib/logger';
import { useState, useEffect } from 'react';
import {
  getTestimonials,
  saveTestimonials,
  generateTestimonialId,
} from '@/lib/firestore-site-settings';
import type { SiteTestimonials, TestimonialItem } from '@/types/admin';

export default function TestimonialsEditor(): React.ReactElement {
  const [testimonials, setTestimonials] = useState<SiteTestimonials>({ items: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async (): Promise<void> => {
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error) {
      logger.error('Testimonials 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (): Promise<void> => {
    setIsSaving(true);
    setMessage(null);

    try {
      const result = await saveTestimonials(testimonials);
      if (result.success) {
        setMessage({ type: 'success', text: '저장되었습니다.' });
      } else {
        setMessage({ type: 'error', text: result.error || '저장에 실패했습니다.' });
      }
    } catch {
      setMessage({ type: 'error', text: '저장 중 오류가 발생했습니다.' });
    } finally {
      setIsSaving(false);
    }
  };

  const addItem = (): void => {
    const newItem: TestimonialItem = {
      id: generateTestimonialId(),
      content: '',
      author: '',
      role: '',
      company: '',
      projectType: '',
      rating: 5,
      order: testimonials.items.length + 1,
    };
    setTestimonials((prev) => ({ items: [...prev.items, newItem] }));
  };

  const updateItem = (
    id: string,
    field: keyof TestimonialItem,
    value: string | number
  ): void => {
    setTestimonials((prev) => ({
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const removeItem = (id: string): void => {
    setTestimonials((prev) => ({
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const moveItem = (index: number, direction: 'up' | 'down'): void => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= testimonials.items.length) return;

    const newItems = [...testimonials.items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];

    newItems.forEach((item, i) => {
      item.order = i + 1;
    });

    setTestimonials({ items: newItems });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-48 bg-brand-primary/5 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`p-4 rounded-xl ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-600 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        {testimonials.items.map((item, index) => (
          <div key={item.id} className="p-4 bg-brand-bg rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className="p-1 hover:bg-brand-primary/5 rounded disabled:opacity-30"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === testimonials.items.length - 1}
                  className="p-1 hover:bg-brand-primary/5 rounded disabled:opacity-30"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>

              <span className="text-sm text-brand-muted">#{index + 1}</span>

              <div className="flex-1" />

              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">후기 내용</label>
                <textarea
                  value={item.content}
                  onChange={(e) => updateItem(item.id, 'content', e.target.value)}
                  placeholder="고객 후기 내용을 입력하세요"
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-brand-primary/10 focus:outline-none focus:border-brand-secondary resize-none"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-sm font-medium text-brand-text mb-1">이름</label>
                  <input
                    type="text"
                    value={item.author}
                    onChange={(e) => updateItem(item.id, 'author', e.target.value)}
                    placeholder="김대표"
                    className="w-full px-3 py-2 rounded-lg border border-brand-primary/10 focus:outline-none focus:border-brand-secondary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-text mb-1">직책</label>
                  <input
                    type="text"
                    value={item.role}
                    onChange={(e) => updateItem(item.id, 'role', e.target.value)}
                    placeholder="대표"
                    className="w-full px-3 py-2 rounded-lg border border-brand-primary/10 focus:outline-none focus:border-brand-secondary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-text mb-1">회사</label>
                  <input
                    type="text"
                    value={item.company || ''}
                    onChange={(e) => updateItem(item.id, 'company', e.target.value)}
                    placeholder="스타트업 (선택)"
                    className="w-full px-3 py-2 rounded-lg border border-brand-primary/10 focus:outline-none focus:border-brand-secondary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-text mb-1">
                    프로젝트 유형
                  </label>
                  <input
                    type="text"
                    value={item.projectType}
                    onChange={(e) => updateItem(item.id, 'projectType', e.target.value)}
                    placeholder="MVP 개발"
                    className="w-full px-3 py-2 rounded-lg border border-brand-primary/10 focus:outline-none focus:border-brand-secondary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">평점</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => updateItem(item.id, 'rating', star)}
                      className="p-1"
                    >
                      <svg
                        className={`w-6 h-6 ${
                          (item.rating || 0) >= star
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={addItem}
          className="px-4 py-2 text-sm bg-brand-primary/5 rounded-full hover:bg-brand-primary/10 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          후기 추가
        </button>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-3 bg-brand-primary text-white rounded-xl font-medium hover:bg-brand-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {isSaving && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          저장
        </button>
      </div>
    </div>
  );
}
