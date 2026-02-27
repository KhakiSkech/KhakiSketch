'use client';

import { logger } from '@/lib/logger';
import { useState, useEffect } from 'react';
import { getStats, saveStats } from '@/lib/firestore-site-settings';
import type { SiteStats } from '@/types/admin';

export default function StatsEditor(): React.ReactElement {
  const [stats, setStats] = useState<SiteStats>({
    completedProjects: 0,
    customerSatisfaction: 0,
    avgDeliveryTime: 0,
    repeatOrderRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async (): Promise<void> => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (error) {
      logger.error('Stats 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (): Promise<void> => {
    setIsSaving(true);
    setMessage(null);

    try {
      const result = await saveStats(stats);
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

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-brand-primary/5 rounded-xl" />
          ))}
        </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-brand-text mb-2">
            완료 프로젝트 수
          </label>
          <input
            type="number"
            value={stats.completedProjects}
            onChange={(e) =>
              setStats((prev) => ({ ...prev, completedProjects: parseInt(e.target.value) || 0 }))
            }
            className="w-full px-4 py-3 rounded-xl border border-brand-primary/10 focus:outline-none focus:border-brand-secondary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-text mb-2">
            고객 만족도 (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={stats.customerSatisfaction}
            onChange={(e) =>
              setStats((prev) => ({
                ...prev,
                customerSatisfaction: parseInt(e.target.value) || 0,
              }))
            }
            className="w-full px-4 py-3 rounded-xl border border-brand-primary/10 focus:outline-none focus:border-brand-secondary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-text mb-2">
            평균 납기일 (일)
          </label>
          <input
            type="number"
            value={stats.avgDeliveryTime}
            onChange={(e) =>
              setStats((prev) => ({ ...prev, avgDeliveryTime: parseInt(e.target.value) || 0 }))
            }
            className="w-full px-4 py-3 rounded-xl border border-brand-primary/10 focus:outline-none focus:border-brand-secondary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-text mb-2">
            재주문율 (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={stats.repeatOrderRate}
            onChange={(e) =>
              setStats((prev) => ({ ...prev, repeatOrderRate: parseInt(e.target.value) || 0 }))
            }
            className="w-full px-4 py-3 rounded-xl border border-brand-primary/10 focus:outline-none focus:border-brand-secondary"
          />
        </div>
      </div>

      <div className="flex justify-end">
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
