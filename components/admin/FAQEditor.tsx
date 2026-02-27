'use client';

import { logger } from '@/lib/logger';
import { useState, useEffect } from 'react';
import { getFAQ, saveFAQ, generateFAQId } from '@/lib/firestore-site-settings';
import type { SiteFAQ, FAQItem, FAQCategory } from '@/types/admin';

const FAQ_CATEGORIES: { value: FAQCategory; label: string }[] = [
  { value: 'GENERAL', label: '일반' },
  { value: 'PROCESS', label: '프로세스' },
  { value: 'PRICING', label: '가격' },
  { value: 'TECH', label: '기술' },
  { value: 'SUPPORT', label: '지원' },
];

export default function FAQEditor(): React.ReactElement {
  const [faq, setFaq] = useState<SiteFAQ>({ items: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadFAQ();
  }, []);

  const loadFAQ = async (): Promise<void> => {
    try {
      const data = await getFAQ();
      setFaq(data);
    } catch (error) {
      logger.error('FAQ 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (): Promise<void> => {
    setIsSaving(true);
    setMessage(null);

    try {
      const result = await saveFAQ(faq);
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
    const newItem: FAQItem = {
      id: generateFAQId(),
      category: 'GENERAL',
      question: '',
      answer: '',
      order: faq.items.length + 1,
    };
    setFaq((prev) => ({ items: [...prev.items, newItem] }));
  };

  const updateItem = (id: string, field: keyof FAQItem, value: string | number): void => {
    setFaq((prev) => ({
      items: prev.items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const removeItem = (id: string): void => {
    setFaq((prev) => ({
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const moveItem = (index: number, direction: 'up' | 'down'): void => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= faq.items.length) return;

    const newItems = [...faq.items];
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];

    // Update order values
    newItems.forEach((item, i) => {
      item.order = i + 1;
    });

    setFaq({ items: newItems });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-brand-primary/5 rounded-xl" />
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
        {faq.items.map((item, index) => (
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === faq.items.length - 1}
                  className="p-1 hover:bg-brand-primary/5 rounded disabled:opacity-30"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              <select
                value={item.category}
                onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                className="px-3 py-2 rounded-lg border border-brand-primary/10 text-sm focus:outline-none focus:border-brand-secondary"
              >
                {FAQ_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>

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
                <label className="block text-sm font-medium text-brand-text mb-1">질문</label>
                <input
                  type="text"
                  value={item.question}
                  onChange={(e) => updateItem(item.id, 'question', e.target.value)}
                  placeholder="자주 묻는 질문을 입력하세요"
                  className="w-full px-4 py-2 rounded-lg border border-brand-primary/10 focus:outline-none focus:border-brand-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">답변</label>
                <textarea
                  value={item.answer}
                  onChange={(e) => updateItem(item.id, 'answer', e.target.value)}
                  placeholder="답변을 입력하세요"
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-brand-primary/10 focus:outline-none focus:border-brand-secondary resize-none"
                />
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
          FAQ 추가
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
