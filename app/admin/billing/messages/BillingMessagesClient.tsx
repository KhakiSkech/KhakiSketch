'use client';

import { useState, useEffect } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirebaseAuth } from '@/lib/firebase';
import { getAllBillingClients } from '@/lib/firestore-billing-clients';
import { getNotificationLogs } from '@/lib/firestore-billing-notifications';
import type { BillingClient, BillingNotificationLog, NotificationType } from '@/types/billing';

interface MessageTemplate {
  id: NotificationType;
  title: string;
  description: string;
  sampleMessage: string;
}

const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: 'pre_reminder',
    title: '사전 안내',
    description: '결제일 전 이체 안내 메시지',
    sampleMessage: '[KhakiSketch] 안녕하세요. {회사명} 담당자님, {청구월} 월정액 {금액}원 결제가 {결제일}일에 예정되어 있습니다. 감사합니다.',
  },
  {
    id: 'manual_transfer_guide',
    title: '이체 안내',
    description: '수동 이체 계좌 안내 메시지',
    sampleMessage: '[KhakiSketch] 담당자님, {청구월} 월정액 {금액}원을 아래 계좌로 입금해 주세요.\n입금계좌: {은행명} {계좌번호} ({예금주})',
  },
  {
    id: 'overdue_1st',
    title: '1차 독촉',
    description: '미납 발생 후 1차 독촉 메시지',
    sampleMessage: '[KhakiSketch] {회사명} 담당자님, {청구월} 월정액 {금액}원이 미납 상태입니다. 빠른 입금 부탁드립니다.',
  },
  {
    id: 'overdue_2nd',
    title: '2차 독촉',
    description: '미납 지속 시 2차 독촉 메시지',
    sampleMessage: '[KhakiSketch] {회사명} 담당자님, {청구월} 미납금 {금액}원이 아직 미결제 상태입니다. 서비스 중단 전 입금을 요청드립니다.',
  },
  {
    id: 'overdue_severe',
    title: '미납 심각',
    description: '장기 미납 시 서비스 중단 경고 메시지',
    sampleMessage: '[KhakiSketch] {회사명} 담당자님, 장기 미납으로 인해 서비스 중단이 예정되어 있습니다. 즉시 입금하지 않으시면 서비스가 중단됩니다.',
  },
  {
    id: 'termination_scheduled',
    title: '해지 예정',
    description: '서비스 해지 예정 안내 메시지',
    sampleMessage: '[KhakiSketch] {회사명} 담당자님, 요청하신 {서비스명} 서비스가 {해지일}에 해지될 예정입니다. 문의사항은 연락주세요.',
  },
  {
    id: 'termination_complete',
    title: '해지 완료',
    description: '서비스 해지 완료 안내 메시지',
    sampleMessage: '[KhakiSketch] {회사명} 담당자님, {서비스명} 서비스가 정상적으로 해지 처리되었습니다. 이용해 주셔서 감사합니다.',
  },
];

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

export default function BillingMessagesClient(): React.ReactElement {
  const [clients, setClients] = useState<BillingClient[]>([]);
  const [logs, setLogs] = useState<BillingNotificationLog[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [isLoadingLogs, setIsLoadingLogs] = useState(true);

  const [selectedClientId, setSelectedClientId] = useState('');
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [expandedTemplate, setExpandedTemplate] = useState<NotificationType | null>(null);

  useEffect(() => {
    loadClients();
    loadLogs();
  }, []);

  const loadClients = async () => {
    setIsLoadingClients(true);
    const result = await getAllBillingClients();
    if (result.success && result.data) {
      setClients(result.data);
    }
    setIsLoadingClients(false);
  };

  const loadLogs = async () => {
    setIsLoadingLogs(true);
    const result = await getNotificationLogs({ type: 'manual' });
    if (result.success && result.data) {
      setLogs(result.data);
    }
    setIsLoadingLogs(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || !messageText.trim()) return;

    setIsSending(true);
    setSendResult(null);

    try {
      const functions = getFunctions(getFirebaseAuth().app, 'asia-northeast3');
      const sendManualNotice = httpsCallable(functions, 'sendManualNotice');
      await sendManualNotice({ clientId: selectedClientId, message: messageText.trim() });
      setSendResult({ type: 'success', message: '메시지가 성공적으로 발송되었습니다.' });
      setSelectedClientId('');
      setMessageText('');
      await loadLogs();
    } catch (err) {
      setSendResult({ type: 'error', message: '메시지 발송에 실패했습니다.' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-primary">메시지 관리</h1>
        <p className="text-brand-muted text-sm mt-1">메시지 템플릿 확인 및 수동 발송</p>
      </div>

      {/* Message Templates */}
      <div>
        <h2 className="text-lg font-bold text-brand-primary mb-4">메시지 템플릿</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MESSAGE_TEMPLATES.map((template) => (
            <div
              key={template.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-brand-text">{template.title}</h3>
                  <p className="text-xs text-brand-muted mt-0.5">{template.description}</p>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-brand-primary/10 text-brand-primary flex-shrink-0">
                  {NOTIFICATION_TYPE_LABELS[template.id]}
                </span>
              </div>
              <button
                onClick={() =>
                  setExpandedTemplate(expandedTemplate === template.id ? null : template.id)
                }
                className="text-xs text-brand-secondary hover:text-brand-secondary/80 transition-colors"
              >
                {expandedTemplate === template.id ? '샘플 숨기기' : '샘플 보기'}
              </button>
              {expandedTemplate === template.id && (
                <div className="p-3 bg-brand-bg rounded-xl text-xs text-brand-text whitespace-pre-wrap">
                  {template.sampleMessage}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Manual Send */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6">
        <h2 className="text-lg font-bold text-brand-primary mb-5">수동 발송</h2>
        <form onSubmit={handleSend} className="space-y-4">
          {sendResult && (
            <div
              className={`px-4 py-3 rounded-xl text-sm ${
                sendResult.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-600'
              }`}
            >
              {sendResult.message}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1.5">
              고객 선택 <span className="text-red-500">*</span>
            </label>
            {isLoadingClients ? (
              <div className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-muted text-sm">
                고객 로딩 중...
              </div>
            ) : (
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                required
                className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
              >
                <option value="">고객을 선택하세요</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName} ({c.contactName})
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-text mb-1.5">
              메시지 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              required
              rows={4}
              placeholder="발송할 메시지를 입력하세요..."
              className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={isSending || !selectedClientId || !messageText.trim()}
            className="px-6 py-2.5 bg-brand-secondary text-white rounded-xl text-sm font-medium hover:bg-brand-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSending ? '발송 중...' : '발송'}
          </button>
        </form>
      </div>

      {/* Send History */}
      <div>
        <h2 className="text-lg font-bold text-brand-primary mb-4">수동 발송 이력</h2>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 overflow-hidden">
          {isLoadingLogs ? (
            <div className="p-12 text-center text-brand-muted">로딩 중...</div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-brand-muted">수동 발송 이력이 없습니다.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-brand-bg border-b border-brand-primary/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">일시</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">고객명</th>
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
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {log.channel === 'alimtalk' ? '알림톡' : 'SMS'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            log.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {log.status === 'sent' ? '성공' : '실패'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-brand-muted max-w-xs">
                        <p className="truncate" title={log.message}>
                          {log.message}
                        </p>
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
    </div>
  );
}
