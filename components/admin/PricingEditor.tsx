'use client';

import { logger } from '@/lib/logger';
import { useState, useEffect } from 'react';
import { getPricing, savePricing, generatePricingId } from '@/lib/firestore-site-settings';
import type { SitePricing, PricingPlan, PricingFeature } from '@/types/admin';

export default function PricingEditor(): React.ReactElement {
  const [pricing, setPricing] = useState<SitePricing>({ plans: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadPricing();
  }, []);

  const loadPricing = async (): Promise<void> => {
    try {
      const data = await getPricing();
      setPricing(data);
    } catch (error) {
      logger.error('Pricing 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (): Promise<void> => {
    setIsSaving(true);
    setMessage(null);

    try {
      const result = await savePricing(pricing);
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

  const addPlan = (): void => {
    const newPlan: PricingPlan = {
      id: generatePricingId(),
      name: '',
      description: '',
      price: '',
      priceNote: '',
      features: [{ text: '', included: true }],
      highlighted: false,
      ctaText: '문의하기',
      order: pricing.plans.length + 1,
    };
    setPricing((prev) => ({ plans: [...prev.plans, newPlan] }));
  };

  const updatePlan = (
    id: string,
    field: keyof PricingPlan,
    value: string | boolean | number | PricingFeature[]
  ): void => {
    setPricing((prev) => ({
      plans: prev.plans.map((plan) =>
        plan.id === id ? { ...plan, [field]: value } : plan
      ),
    }));
  };

  const removePlan = (id: string): void => {
    setPricing((prev) => ({
      plans: prev.plans.filter((plan) => plan.id !== id),
    }));
  };

  const addFeature = (planId: string): void => {
    setPricing((prev) => ({
      plans: prev.plans.map((plan) =>
        plan.id === planId
          ? { ...plan, features: [...plan.features, { text: '', included: true }] }
          : plan
      ),
    }));
  };

  const updateFeature = (
    planId: string,
    featureIndex: number,
    field: keyof PricingFeature,
    value: string | boolean
  ): void => {
    setPricing((prev) => ({
      plans: prev.plans.map((plan) =>
        plan.id === planId
          ? {
              ...plan,
              features: plan.features.map((f, i) =>
                i === featureIndex ? { ...f, [field]: value } : f
              ),
            }
          : plan
      ),
    }));
  };

  const removeFeature = (planId: string, featureIndex: number): void => {
    setPricing((prev) => ({
      plans: prev.plans.map((plan) =>
        plan.id === planId
          ? { ...plan, features: plan.features.filter((_, i) => i !== featureIndex) }
          : plan
      ),
    }));
  };

  const movePlan = (index: number, direction: 'up' | 'down'): void => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= pricing.plans.length) return;

    const newPlans = [...pricing.plans];
    [newPlans[index], newPlans[newIndex]] = [newPlans[newIndex], newPlans[index]];

    newPlans.forEach((plan, i) => {
      plan.order = i + 1;
    });

    setPricing({ plans: newPlans });
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-brand-primary/5 rounded-xl" />
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
        {pricing.plans.map((plan, index) => (
          <div
            key={plan.id}
            className={`p-4 rounded-xl ${
              plan.highlighted
                ? 'bg-brand-primary/5 border-2 border-brand-primary/20'
                : 'bg-brand-bg'
            }`}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => movePlan(index, 'up')}
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
                  onClick={() => movePlan(index, 'down')}
                  disabled={index === pricing.plans.length - 1}
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

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={plan.highlighted}
                  onChange={(e) => updatePlan(plan.id, 'highlighted', e.target.checked)}
                  className="w-4 h-4 rounded border-brand-primary/20"
                />
                강조 표시
              </label>

              <div className="flex-1" />

              <button
                type="button"
                onClick={() => removePlan(plan.id)}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">플랜 이름</label>
                <input
                  type="text"
                  value={plan.name}
                  onChange={(e) => updatePlan(plan.id, 'name', e.target.value)}
                  placeholder="MVP 개발"
                  className="w-full px-3 py-2 rounded-lg border border-brand-primary/10 focus:outline-none focus:border-brand-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">설명</label>
                <input
                  type="text"
                  value={plan.description}
                  onChange={(e) => updatePlan(plan.id, 'description', e.target.value)}
                  placeholder="스타트업 초기 제품"
                  className="w-full px-3 py-2 rounded-lg border border-brand-primary/10 focus:outline-none focus:border-brand-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">가격</label>
                <input
                  type="text"
                  value={plan.price}
                  onChange={(e) => updatePlan(plan.id, 'price', e.target.value)}
                  placeholder="500~1,500만원"
                  className="w-full px-3 py-2 rounded-lg border border-brand-primary/10 focus:outline-none focus:border-brand-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">가격 참고</label>
                <input
                  type="text"
                  value={plan.priceNote || ''}
                  onChange={(e) => updatePlan(plan.id, 'priceNote', e.target.value)}
                  placeholder="규모에 따라 상이"
                  className="w-full px-3 py-2 rounded-lg border border-brand-primary/10 focus:outline-none focus:border-brand-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-text mb-1">
                  버튼 텍스트
                </label>
                <input
                  type="text"
                  value={plan.ctaText}
                  onChange={(e) => updatePlan(plan.id, 'ctaText', e.target.value)}
                  placeholder="견적 받기"
                  className="w-full px-3 py-2 rounded-lg border border-brand-primary/10 focus:outline-none focus:border-brand-secondary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text mb-2">
                기능 목록
              </label>
              <div className="space-y-2">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        updateFeature(plan.id, featureIndex, 'included', !feature.included)
                      }
                      className={`p-1 rounded ${
                        feature.included
                          ? 'text-green-600 bg-green-50'
                          : 'text-gray-400 bg-gray-50'
                      }`}
                    >
                      {feature.included ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </button>
                    <input
                      type="text"
                      value={feature.text}
                      onChange={(e) =>
                        updateFeature(plan.id, featureIndex, 'text', e.target.value)
                      }
                      placeholder="기능 내용"
                      className="flex-1 px-3 py-2 rounded-lg border border-brand-primary/10 focus:outline-none focus:border-brand-secondary"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(plan.id, featureIndex)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addFeature(plan.id)}
                className="mt-2 px-3 py-1.5 text-sm bg-brand-primary/5 rounded-lg hover:bg-brand-primary/10 transition-colors"
              >
                + 기능 추가
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={addPlan}
          className="px-4 py-2 text-sm bg-brand-primary/5 rounded-full hover:bg-brand-primary/10 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          플랜 추가
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
