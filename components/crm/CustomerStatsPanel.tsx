'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCustomerStats } from '@/lib/firestore-quotes';
import type { CustomerStats } from '@/types/admin';

interface CustomerStatsPanelProps {
  email: string;
}

export default function CustomerStatsPanel({ email }: CustomerStatsPanelProps): React.ReactElement {
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [email]);

  const loadStats = async () => {
    setIsLoading(true);
    const result = await getCustomerStats(email);
    if (result.success && result.data) {
      setStats(result.data);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-24 bg-brand-bg rounded-xl" />
        <div className="h-32 bg-brand-bg rounded-xl" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-brand-muted">
        <p>고객 통계를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const formatAmount = (amount: number) => {
    if (amount >= 100000000) {
      return (amount / 100000000).toFixed(1) + '억원';
    } else if (amount >= 10000000) {
      return (amount / 10000000).toFixed(0) + '천만원';
    } else if (amount >= 1000000) {
      return (amount / 1000000).toFixed(0) + '백만원';
    }
    return amount.toLocaleString('ko-KR') + '원';
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 p-4 rounded-xl">
          <p className="text-2xl font-bold text-blue-700">{stats.totalLeads}</p>
          <p className="text-xs text-blue-600">총 견적 수</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl">
          <p className="text-2xl font-bold text-green-700">{stats.totalContracts}</p>
          <p className="text-xs text-green-600">계약 완료</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-xl">
          <p className="text-2xl font-bold text-purple-700">{stats.successRate}%</p>
          <p className="text-xs text-purple-600">성공률</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-xl">
          <p className="text-2xl font-bold text-orange-700">{formatAmount(stats.totalContractAmount)}</p>
          <p className="text-xs text-orange-600">총 계약금액</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-xl border border-brand-primary/10 p-4">
        <h4 className="font-medium text-brand-primary mb-3">고객 이력</h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-brand-muted">최초 문의</span>
            <span>{new Date(stats.firstContactDate).toLocaleDateString('ko-KR')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-muted">최근 활동</span>
            <span>{new Date(stats.lastContactDate).toLocaleDateString('ko-KR')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brand-muted">총 견적 발송</span>
            <span>{stats.totalQuotes}회</span>
          </div>
        </div>      </div>

      {/* Related Leads */}
      {stats.leadIds.length > 0 && (
        <div className="bg-white rounded-xl border border-brand-primary/10 p-4">
          <h4 className="font-medium text-brand-primary mb-3">관련 견적 ({stats.leadIds.length})</h4>
          <div className="space-y-2">
            {stats.leadIds.slice(0, 5).map((leadId) => (
              <Link
                key={leadId}
                href={`/admin/quotes/${leadId}`}
                className="block p-3 bg-brand-bg rounded-lg hover:bg-brand-primary/5 transition-colors text-sm"
              >
                견적 #{leadId.slice(0, 8)}...
                <svg className="w-4 h-4 inline-block ml-1 text-brand-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
            {stats.leadIds.length > 5 && (
              <p className="text-sm text-brand-muted text-center">+{stats.leadIds.length - 5}개 더보기</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
