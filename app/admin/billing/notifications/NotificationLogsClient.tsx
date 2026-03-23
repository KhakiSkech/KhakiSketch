'use client';

import { useState, useEffect } from 'react';
import { getNotificationLogs } from '@/lib/firestore-billing-notifications';
import { getAllBillingClients } from '@/lib/firestore-billing-clients';
import type { BillingNotificationLog, BillingClient, NotificationType } from '@/types/billing';

const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  pre_reminder: '사전안내',
  manual_transfer_guide: '이체안내',
  overdue_1st: '1차독촉',
  overdue_2nd: '2차독촉',
  overdue_severe: '미납심각',
  termination_scheduled: '해지접수',
  termination_complete: '해지완료',
  manual: '수동발송',
};

export default function NotificationLogsClient(): React.ReactElement {
  const [logs, setLogs] = useState<BillingNotificationLog[]>([]);
  const [clients, setClients] = useState<BillingClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    loadLogs();
  }, [startDate, endDate, selectedClientId, selectedType]);

  const loadClients = async () => {
    const result = await getAllBillingClients();
    if (result.success && result.data) {
      setClients(result.data);
    }
  };

  const loadLogs = async () => {
    setIsLoading(true);
    setError(null);

    const result = await getNotificationLogs({
      ...(selectedClientId && { clientId: selectedClientId }),
      ...(selectedType && { type: selectedType }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });

    if (result.success && result.data) {
      setLogs(result.data);
    } else {
      setError(result.error ?? '알림 이력을 불러오는데 실패했습니다.');
    }

    setIsLoading(false);
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setSelectedClientId('');
    setSelectedType('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-primary">알림 발송 이력</h1>
        <p className="text-brand-muted text-sm mt-1">SMS / 알림톡 발송 로그</p>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-5">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1.5">시작일</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1.5">종료일</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1.5">고객</label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
            >
              <option value="">전체 고객</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.companyName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-brand-muted mb-1.5">유형</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
            >
              <option value="">전체 유형</option>
              {(Object.entries(NOTIFICATION_TYPE_LABELS) as [NotificationType, string][]).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
        {(startDate || endDate || selectedClientId || selectedType) && (
          <div className="mt-3">
            <button
              onClick={handleReset}
              className="text-sm text-brand-muted hover:text-brand-primary transition-colors"
            >
              필터 초기화
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-brand-muted">로딩 중...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-600">{error}</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-brand-muted">알림 이력이 없습니다.</div>
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
                  <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">메시지</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-primary/5">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-brand-bg/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-brand-muted whitespace-nowrap">
                      {new Date(log.sentAt).toLocaleString('ko-KR')}
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
                    <td className="px-6 py-4 text-sm text-brand-muted max-w-xs">
                      <p className="truncate" title={log.message}>{log.message}</p>
                      {log.errorMessage && (
                        <p className="text-xs text-red-500 truncate mt-0.5" title={log.errorMessage}>
                          {log.errorMessage}
                        </p>
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
