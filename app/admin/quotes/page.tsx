'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getAllLeads, getLeadStats, deleteLead, updateLeadStatus } from '@/lib/firestore-quotes';
import { QuoteLead, LeadStatus, LeadPriority, LeadStats } from '@/types/admin';
import Toast from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';

const STATUS_LABELS: Record<LeadStatus, { label: string; color: string }> = {
  NEW: { label: '접수', color: 'bg-blue-100 text-blue-700' },
  CONTACTED: { label: '연락완료', color: 'bg-yellow-100 text-yellow-700' },
  QUOTED: { label: '견적완료', color: 'bg-purple-100 text-purple-700' },
  NEGOTIATING: { label: '협상중', color: 'bg-orange-100 text-orange-700' },
  WON: { label: '계약완료', color: 'bg-green-100 text-green-700' },
  LOST: { label: '계약실패', color: 'bg-red-100 text-red-700' },
  HOLD: { label: '보류', color: 'bg-gray-100 text-gray-600' },
};

const PRIORITY_LABELS: Record<LeadPriority, { label: string; color: string }> = {
  LOW: { label: '낮음', color: 'bg-gray-100 text-gray-600' },
  MEDIUM: { label: '보통', color: 'bg-blue-100 text-blue-700' },
  HIGH: { label: '높음', color: 'bg-orange-100 text-orange-700' },
  URGENT: { label: '긴급', color: 'bg-red-100 text-red-700' },
};

function getSourceBadge(lead: QuoteLead): string {
  const src = lead.utmSource?.toLowerCase() ?? '';
  const medium = lead.utmMedium?.toLowerCase() ?? '';
  if (medium === 'cpc' || medium === 'paid') return '🎯 광고';
  if (src.includes('google')) return '🔍 구글';
  if (src.includes('instagram') || src.includes('facebook') || src.includes('meta')) return '📱 SNS';
  if (src.includes('naver')) return '🔗 네이버';
  if (src) return `🔗 ${lead.utmSource}`;
  return '🌐 직접';
}

export default function QuotesAdminPage(): React.ReactElement {
  const { user } = useAuth();
  const [leads, setLeads] = useState<QuoteLead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<LeadStatus | 'ALL'>('ALL');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  useEffect(() => {
    loadData();
  }, [filterStatus]);

  const loadData = async () => {
    setIsLoading(true);
    const [leadsResult, statsResult] = await Promise.all([
      getAllLeads(filterStatus === 'ALL' ? undefined : { status: filterStatus }),
      getLeadStats(),
    ]);

    if (leadsResult.success && leadsResult.data) {
      setLeads(leadsResult.data);
    }

    if (statsResult.success && statsResult.data) {
      setStats(statsResult.data);
    }

    setIsLoading(false);
  };

  const handleDelete = (id: string, customerName: string) => {
    setConfirmState({
      isOpen: true,
      title: '견적 삭제',
      message: `'${customerName}' 님의 견적을 삭제하시겠습니까?`,
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        const result = await deleteLead(id);
        if (result.success) {
          setLeads((prev) => prev.filter((l) => l.id !== id));
        } else {
          setToast({ message: result.error || '삭제에 실패했습니다.', type: 'error' });
        }
      },
    });
  };

  const handleStatusChange = async (id: string, newStatus: LeadStatus) => {
    if (!user?.email) return;

    const result = await updateLeadStatus(id, newStatus, user.email);
    if (result.success) {
      loadData();
    } else {
      setToast({ message: result.error || '상태 변경에 실패했습니다.', type: 'error' });
    }
  };

  return (
    <div className="space-y-8">
      {/* 토스트 알림 */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* 확인 모달 */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel="삭제"
        confirmClassName="bg-red-600 hover:bg-red-700"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">견적 관리</h1>
          <p className="text-brand-muted text-sm mt-1">견적 요청 및 CRM 관리</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/quotes/kanban"
            className="px-4 py-2 bg-brand-secondary/10 text-brand-secondary rounded-xl text-sm font-medium hover:bg-brand-secondary/20 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
            칸반 보드
          </Link>
          <Link
            href="/admin"
            className="px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-xl text-sm font-medium hover:bg-brand-primary/20 transition-colors"
          >
            대시보드로
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-brand-primary/10">
            <p className="text-sm text-brand-muted mb-1">총 견적</p>
            <p className="text-3xl font-bold text-brand-primary">{stats.total}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-brand-primary/10">
            <p className="text-sm text-brand-muted mb-1">이번 달</p>
            <p className="text-3xl font-bold text-brand-secondary">{stats.thisMonth}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-brand-primary/10">
            <p className="text-sm text-brand-muted mb-1">신규</p>
            <p className="text-3xl font-bold text-blue-600">{stats.byStatus.NEW}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-brand-primary/10">
            <p className="text-sm text-brand-muted mb-1">계약완료</p>
            <p className="text-3xl font-bold text-green-600">{stats.byStatus.WON}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(['ALL', 'NEW', 'CONTACTED', 'QUOTED', 'NEGOTIATING', 'WON', 'LOST', 'HOLD'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filterStatus === status
                ? 'bg-brand-primary text-white'
                : 'bg-white/80 text-brand-text hover:bg-brand-primary/10'
            }`}
          >
            {status === 'ALL' ? '전체' : STATUS_LABELS[status].label}
          </button>
        ))}
      </div>

      {/* Leads Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-brand-muted">로딩 중...</div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-brand-muted">견적이 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-bg border-b border-brand-primary/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">고객</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">프로젝트</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">예산/일정</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">유입 경로</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">상태</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">우선순위</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">접수일</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-brand-muted uppercase">액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-primary/5">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-brand-bg/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-brand-text">{lead.customerName}</div>
                      <div className="text-sm text-brand-muted">{lead.email}</div>
                      <div className="text-xs text-brand-muted">{lead.company || '개인'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-brand-text">{lead.projectName || lead.projectType}</div>
                      <div className="text-sm text-brand-muted truncate max-w-xs">
                        {lead.projectSummary}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-brand-text">{lead.budget}</div>
                      <div className="text-xs text-brand-muted">{lead.timeline}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-brand-text whitespace-nowrap">
                        {getSourceBadge(lead)}
                      </span>
                      {lead.utmCampaign && (
                        <div className="text-xs text-brand-muted truncate max-w-[120px]">{lead.utmCampaign}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border-0 cursor-pointer ${STATUS_LABELS[lead.status].color}`}
                      >
                        {Object.entries(STATUS_LABELS).map(([key, { label }]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${PRIORITY_LABELS[lead.priority].color}`}>
                        {PRIORITY_LABELS[lead.priority].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-muted">
                      {new Date(lead.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/quotes/${lead.id}`}
                          className="px-3 py-1.5 text-sm text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                        >
                          상세
                        </Link>
                        <button
                          onClick={() => handleDelete(lead.id, lead.customerName)}
                          className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          삭제
                        </button>
                      </div>
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
