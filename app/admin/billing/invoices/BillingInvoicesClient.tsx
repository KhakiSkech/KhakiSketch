'use client';

import { useState, useEffect } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirebaseAuth } from '@/lib/firebase';
import { getAllInvoices } from '@/lib/firestore-billing-invoices';
import type { BillingInvoice, InvoiceStatus } from '@/types/billing';

type StatusFilter = 'all' | InvoiceStatus;

const STATUS_BADGE: Record<InvoiceStatus, { label: string; color: string }> = {
  pending: { label: '대기', color: 'bg-yellow-100 text-yellow-700' },
  paid: { label: '완료', color: 'bg-green-100 text-green-700' },
  overdue: { label: '미납', color: 'bg-orange-100 text-orange-700' },
  failed: { label: '실패', color: 'bg-red-100 text-red-700' },
  waived: { label: '면제', color: 'bg-gray-100 text-gray-500' },
};

function getRecentYearMonths(count: number): string[] {
  const months: string[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    months.push(`${y}-${m}`);
  }
  return months;
}

export default function BillingInvoicesClient(): React.ReactElement {
  const yearMonths = getRecentYearMonths(12);
  const [selectedYearMonth, setSelectedYearMonth] = useState<string>(yearMonths[0]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadInvoices();
  }, [selectedYearMonth, statusFilter]);

  const loadInvoices = async () => {
    setIsLoading(true);
    setError(null);

    const result = await getAllInvoices({
      yearMonth: selectedYearMonth,
      ...(statusFilter !== 'all' && { status: statusFilter }),
    });

    if (result.success && result.data) {
      setInvoices(result.data);
    } else {
      setError(result.error ?? '청구서 목록을 불러오는데 실패했습니다.');
    }

    setIsLoading(false);
  };

  const handleConfirmPayment = async (invoice: BillingInvoice) => {
    if (!confirm('입금을 확인하시겠습니까?')) return;
    setActionLoading(`confirm-${invoice.id}`);
    try {
      const functions = getFunctions(getFirebaseAuth().app, 'asia-northeast3');
      const confirmPayment = httpsCallable(functions, 'confirmPayment');
      await confirmPayment({ clientId: invoice.clientId, invoiceId: invoice.id });
      await loadInvoices();
    } catch {
      alert('입금 확인 처리에 실패했습니다.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleWaiveInvoice = async (invoice: BillingInvoice) => {
    if (!confirm('이 청구를 면제 처리하시겠습니까?')) return;
    setActionLoading(`waive-${invoice.id}`);
    try {
      const functions = getFunctions(getFirebaseAuth().app, 'asia-northeast3');
      const waiveInvoice = httpsCallable(functions, 'waiveInvoice');
      await waiveInvoice({ clientId: invoice.clientId, invoiceId: invoice.id });
      await loadInvoices();
    } catch {
      alert('면제 처리에 실패했습니다.');
    } finally {
      setActionLoading(null);
    }
  };

  const statusOptions: StatusFilter[] = ['all', 'pending', 'paid', 'overdue', 'failed', 'waived'];
  const statusLabels: Record<StatusFilter, string> = {
    all: '전체',
    pending: '대기',
    paid: '완료',
    overdue: '미납',
    failed: '실패',
    waived: '면제',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-primary">청구/수금</h1>
        <p className="text-brand-muted text-sm mt-1">월별 청구서 목록</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={selectedYearMonth}
          onChange={(e) => setSelectedYearMonth(e.target.value)}
          className="px-4 py-2.5 bg-white/80 border border-brand-primary/10 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
        >
          {yearMonths.map((ym) => (
            <option key={ym} value={ym}>{ym}</option>
          ))}
        </select>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-brand-primary text-white'
                  : 'bg-white/80 text-brand-text hover:bg-brand-primary/10'
              }`}
            >
              {statusLabels[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-brand-muted">로딩 중...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-600">{error}</div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center text-brand-muted">청구서가 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-bg border-b border-brand-primary/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">고객명</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">프로젝트</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">금액</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">상태</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">미납일수</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-brand-muted uppercase">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-primary/5">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-brand-bg/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-brand-text">{invoice.clientId}</td>
                    <td className="px-6 py-4 text-brand-text">{invoice.projectName}</td>
                    <td className="px-6 py-4 font-medium text-brand-text">
                      ₩{invoice.totalAmount.toLocaleString('ko-KR')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[invoice.status].color}`}>
                        {STATUS_BADGE[invoice.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-muted">
                      {invoice.daysOverdue > 0 ? `D+${invoice.daysOverdue}` : '—'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {(invoice.status === 'pending' || invoice.status === 'overdue' || invoice.status === 'failed') && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleConfirmPayment(invoice)}
                            disabled={actionLoading === `confirm-${invoice.id}`}
                            className="px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {actionLoading === `confirm-${invoice.id}` ? '...' : '입금확인'}
                          </button>
                          <button
                            onClick={() => handleWaiveInvoice(invoice)}
                            disabled={actionLoading === `waive-${invoice.id}`}
                            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {actionLoading === `waive-${invoice.id}` ? '...' : '면제'}
                          </button>
                        </div>
                      )}
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
