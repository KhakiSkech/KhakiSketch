'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getBillingDashboardSummary, getOverdueInvoices } from '@/lib/firestore-billing-invoices';
import { getNotificationLogs } from '@/lib/firestore-billing-notifications';
import type { BillingDashboardSummary, BillingInvoice, BillingNotificationLog } from '@/types/billing';

const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  pre_reminder: '사전안내',
  billing_success: '출금완료',
  billing_failed: '출금실패',
  overdue_1st: '1차독촉',
  overdue_2nd: '2차독촉',
  overdue_severe: '미납심각',
  termination_scheduled: '해지접수',
  termination_complete: '해지완료',
  manual: '수동발송',
};

function getOverdueColor(daysOverdue: number): string {
  if (daysOverdue >= 7) return 'text-red-600 bg-red-50';
  if (daysOverdue >= 4) return 'text-orange-600 bg-orange-50';
  return 'text-yellow-600 bg-yellow-50';
}

function getCurrentYearMonth(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

export default function BillingDashboardClient(): React.ReactElement {
  const [summary, setSummary] = useState<BillingDashboardSummary | null>(null);
  const [overdueInvoices, setOverdueInvoices] = useState<BillingInvoice[]>([]);
  const [recentLogs, setRecentLogs] = useState<BillingNotificationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    const yearMonth = getCurrentYearMonth();
    const [summaryResult, overdueResult, logsResult] = await Promise.all([
      getBillingDashboardSummary(yearMonth),
      getOverdueInvoices(),
      getNotificationLogs({ limit: 10 }),
    ]);

    if (summaryResult.success && summaryResult.data) {
      setSummary(summaryResult.data);
    } else {
      setError(summaryResult.error ?? '데이터를 불러오는데 실패했습니다.');
    }

    if (overdueResult.success && overdueResult.data) {
      setOverdueInvoices(overdueResult.data);
    }

    if (logsResult.success && logsResult.data) {
      setRecentLogs(logsResult.data);
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-64 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-10 h-10 border-3 border-brand-primary border-t-transparent rounded-full" />
          <p className="text-brand-muted">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-64 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-brand-primary text-white rounded-xl text-sm font-medium hover:bg-brand-primary/90 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">과금 대시보드</h1>
          <p className="text-brand-muted text-sm mt-1">{getCurrentYearMonth()} 수금 현황</p>
        </div>
        <Link
          href="/admin/billing/clients/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-brand-secondary text-white rounded-xl text-sm font-medium hover:bg-brand-secondary/90 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 고객 등록
        </Link>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-brand-primary/10">
            <p className="text-sm text-brand-muted mb-1">전체 고객</p>
            <p className="text-3xl font-bold text-brand-primary">{summary.totalClients}</p>
            <p className="text-xs text-brand-muted mt-1">곳</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-brand-primary/10">
            <p className="text-sm text-brand-muted mb-1">이번달 수금</p>
            <p className="text-3xl font-bold text-green-600">{summary.paidCount}</p>
            <p className="text-xs text-brand-muted mt-1">건 완료</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-brand-primary/10">
            <p className="text-sm text-brand-muted mb-1">미납</p>
            <p className={`text-3xl font-bold ${summary.overdueCount > 0 ? 'text-red-600' : 'text-brand-primary'}`}>
              {summary.overdueCount}
            </p>
            <p className="text-xs text-brand-muted mt-1">건</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-brand-primary/10">
            <p className="text-sm text-brand-muted mb-1">이번달 MRR</p>
            <p className="text-2xl font-bold text-brand-secondary">
              ₩{summary.monthlyRevenue.toLocaleString('ko-KR')}
            </p>
          </div>
        </div>
      )}

      {/* Overdue Invoices Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-primary/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-primary">미납 현황</h2>
          <Link
            href="/admin/billing/invoices"
            className="text-sm text-brand-secondary hover:underline"
          >
            전체 보기
          </Link>
        </div>
        {overdueInvoices.length === 0 ? (
          <div className="p-12 text-center text-brand-muted">미납 청구서가 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-bg border-b border-brand-primary/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">고객명</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">프로젝트</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">청구월</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">금액</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">미납일수</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-primary/5">
                {overdueInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-brand-bg/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/billing/clients/${invoice.clientId}`}
                        className="font-medium text-brand-secondary hover:underline"
                      >
                        {invoice.clientId}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-brand-text">{invoice.projectName}</td>
                    <td className="px-6 py-4 text-brand-muted">{invoice.yearMonth}</td>
                    <td className="px-6 py-4 font-medium text-brand-text">
                      ₩{invoice.totalAmount.toLocaleString('ko-KR')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOverdueColor(invoice.daysOverdue)}`}>
                        D+{invoice.daysOverdue}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        invoice.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {invoice.status === 'failed' ? '출금실패' : '미납'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Notification Logs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-primary/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-primary">최근 알림 발송</h2>
          <Link
            href="/admin/billing/notifications"
            className="text-sm text-brand-secondary hover:underline"
          >
            전체 보기
          </Link>
        </div>
        {recentLogs.length === 0 ? (
          <div className="p-12 text-center text-brand-muted">알림 발송 이력이 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-bg border-b border-brand-primary/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">일시</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">고객명</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">유형</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">채널</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-primary/5">
                {recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-brand-bg/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-brand-muted">
                      {new Date(log.sentAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-6 py-4 font-medium text-brand-text">{log.clientName}</td>
                    <td className="px-6 py-4 text-sm text-brand-text">
                      {NOTIFICATION_TYPE_LABELS[log.type] ?? log.type}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {log.channel === 'alimtalk' ? '알림톡' : 'SMS'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        log.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {log.status === 'sent' ? '성공' : '실패'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
