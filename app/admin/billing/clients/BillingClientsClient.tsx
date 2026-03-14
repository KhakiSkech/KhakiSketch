'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAllBillingClients } from '@/lib/firestore-billing-clients';
import type { BillingClient } from '@/types/billing';

type StatusFilter = 'all' | 'active' | 'inactive';

export default function BillingClientsClient(): React.ReactElement {
  const router = useRouter();
  const [clients, setClients] = useState<BillingClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  useEffect(() => {
    loadClients();
  }, [statusFilter]);

  const loadClients = async () => {
    setIsLoading(true);
    setError(null);

    const result = await getAllBillingClients(
      statusFilter !== 'all' ? { status: statusFilter } : undefined
    );

    if (result.success && result.data) {
      setClients(result.data);
    } else {
      setError(result.error ?? '고객 목록을 불러오는데 실패했습니다.');
    }

    setIsLoading(false);
  };

  const filteredClients = clients.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.companyName.toLowerCase().includes(q) ||
      c.contactName.toLowerCase().includes(q) ||
      c.phone.includes(q)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">고객 관리</h1>
          <p className="text-brand-muted text-sm mt-1">과금 고객 목록</p>
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="회사명, 담당자, 연락처 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 bg-white/80 border border-brand-primary/10 rounded-xl text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
        />
        <div className="flex gap-2">
          {(['all', 'active', 'inactive'] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-brand-primary text-white'
                  : 'bg-white/80 text-brand-text hover:bg-brand-primary/10'
              }`}
            >
              {s === 'all' ? '전체' : s === 'active' ? '활성' : '비활성'}
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
        ) : filteredClients.length === 0 ? (
          <div className="p-12 text-center text-brand-muted">
            {search ? '검색 결과가 없습니다.' : '등록된 고객이 없습니다.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-brand-bg border-b border-brand-primary/10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">회사명</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">담당자</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">연락처</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">상태</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">CMS</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">등록일</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-primary/5">
                {filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    onClick={() => router.push(`/admin/billing/clients/${client.id}`)}
                    className="hover:bg-brand-bg/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-brand-text">{client.companyName}</div>
                      {client.businessRegNo && (
                        <div className="text-xs text-brand-muted">{client.businessRegNo}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-brand-text">{client.contactName}</td>
                    <td className="px-6 py-4 text-brand-muted">{client.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        client.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {client.status === 'active' ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        client.paypleBillingKey
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {client.paypleBillingKey ? '등록됨' : '미등록'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-muted">
                      {new Date(client.createdAt).toLocaleDateString('ko-KR')}
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
