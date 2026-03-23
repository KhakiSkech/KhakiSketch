'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirebaseAuth } from '@/lib/firebase';
import {
  getBillingClientById,
  updateBillingClient,
  getClientProjects,
  createProject,
  updateProject,
} from '@/lib/firestore-billing-clients';
import { getClientInvoices } from '@/lib/firestore-billing-invoices';
import type {
  BillingClient,
  BillingProject,
  BillingInvoice,
  InvoiceStatus,
} from '@/types/billing';
import Toast from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';

type Tab = 'info' | 'projects' | 'invoices';

const SERVICE_ITEMS = [
  { value: 'hosting', label: '호스팅' },
  { value: 'ssl', label: 'SSL' },
  { value: 'alimtalk', label: '알림톡' },
  { value: 'maintenance', label: '운영관리' },
];

const STATUS_BADGE: Record<InvoiceStatus, { label: string; color: string }> = {
  pending: { label: '대기', color: 'bg-yellow-100 text-yellow-700' },
  paid: { label: '완료', color: 'bg-green-100 text-green-700' },
  overdue: { label: '미납', color: 'bg-orange-100 text-orange-700' },
  failed: { label: '실패', color: 'bg-red-100 text-red-700' },
  waived: { label: '면제', color: 'bg-gray-100 text-gray-500' },
};

const PROJECT_STATUS_BADGE: Record<string, { label: string; color: string }> = {
  active: { label: '활성', color: 'bg-green-100 text-green-700' },
  terminating: { label: '해지예정', color: 'bg-orange-100 text-orange-700' },
  terminated: { label: '해지완료', color: 'bg-gray-100 text-gray-500' },
};

interface ProjectFormData {
  name: string;
  siteUrl: string;
  monthlyFee: string;
  billingDay: string;
  serviceItems: string[];
  contractStart: string;
}

const INITIAL_PROJECT_FORM: ProjectFormData = {
  name: '',
  siteUrl: '',
  monthlyFee: '',
  billingDay: '25',
  serviceItems: [],
  contractStart: '',
};

interface BillingClientDetailClientProps {
  id: string;
}

export default function BillingClientDetailClient({ id }: BillingClientDetailClientProps): React.ReactElement {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('info');
  const [client, setClient] = useState<BillingClient | null>(null);
  const [projects, setProjects] = useState<BillingProject[]>([]);
  const [invoices, setInvoices] = useState<BillingInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit info state
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editForm, setEditForm] = useState<Partial<BillingClient>>({});
  const [isSavingInfo, setIsSavingInfo] = useState(false);

  // Project modal state
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectForm, setProjectForm] = useState<ProjectFormData>(INITIAL_PROJECT_FORM);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [projectFormError, setProjectFormError] = useState<string | null>(null);

  // Action loading
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Message modal state
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [messageResult, setMessageResult] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Toast & confirm state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    const [clientResult, projectsResult, invoicesResult] = await Promise.all([
      getBillingClientById(id),
      getClientProjects(id),
      getClientInvoices(id),
    ]);

    if (clientResult.success && clientResult.data) {
      setClient(clientResult.data);
      setEditForm(clientResult.data);
    } else {
      setError(clientResult.error ?? '고객 정보를 불러오는데 실패했습니다.');
    }

    if (projectsResult.success && projectsResult.data) {
      setProjects(projectsResult.data);
    }

    if (invoicesResult.success && invoicesResult.data) {
      setInvoices(invoicesResult.data);
    }

    setIsLoading(false);
  };

  const handleSaveInfo = async () => {
    if (!client) return;
    setIsSavingInfo(true);

    const result = await updateBillingClient(id, editForm);
    if (result.success) {
      setIsEditingInfo(false);
      await loadData();
    } else {
      setToast({ message: result.error ?? '저장에 실패했습니다.', type: 'error' });
    }

    setIsSavingInfo(false);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectForm.name.trim()) {
      setProjectFormError('프로젝트명을 입력해주세요.');
      return;
    }
    if (!projectForm.monthlyFee || isNaN(Number(projectForm.monthlyFee))) {
      setProjectFormError('월정액을 입력해주세요.');
      return;
    }
    if (!projectForm.billingDay || Number(projectForm.billingDay) < 1 || Number(projectForm.billingDay) > 28) {
      setProjectFormError('결제일을 1~28 사이로 입력해주세요.');
      return;
    }
    if (!projectForm.contractStart) {
      setProjectFormError('계약 시작일을 입력해주세요.');
      return;
    }

    setIsSavingProject(true);
    setProjectFormError(null);

    const result = await createProject(id, {
      name: projectForm.name,
      siteUrl: projectForm.siteUrl,
      monthlyFee: Number(projectForm.monthlyFee),
      billingDay: Number(projectForm.billingDay),
      serviceItems: projectForm.serviceItems,
      status: 'active',
      terminationDate: null,
      terminationReason: null,
      contractStart: projectForm.contractStart,
      contractEnd: null,
      memo: '',
    });

    if (result.success) {
      setShowProjectModal(false);
      setProjectForm(INITIAL_PROJECT_FORM);
      await loadData();
    } else {
      setProjectFormError(result.error ?? '프로젝트 생성에 실패했습니다.');
    }

    setIsSavingProject(false);
  };

  const handleTerminateProject = async (projectId: string, projectName: string) => {
    const terminationDate = prompt(`'${projectName}' 해지 예정일을 입력하세요 (YYYY-MM-DD):`);
    if (!terminationDate) return;

    const result = await updateProject(id, projectId, {
      status: 'terminating',
      terminationDate,
    });

    if (result.success) {
      await loadData();
    } else {
      setToast({ message: result.error ?? '해지 처리에 실패했습니다.', type: 'error' });
    }
  };

  const handleConfirmPayment = (invoiceId: string) => {
    setConfirmState({
      isOpen: true,
      title: '입금 확인',
      message: '입금을 확인하시겠습니까?',
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        setActionLoading(`confirm-${invoiceId}`);
        try {
          const functions = getFunctions(getFirebaseAuth().app, 'asia-northeast3');
          const confirmPayment = httpsCallable(functions, 'confirmPayment');
          await confirmPayment({ clientId: id, invoiceId });
          await loadData();
        } catch {
          setToast({ message: '입금 확인 처리에 실패했습니다.', type: 'error' });
        } finally {
          setActionLoading(null);
        }
      },
    });
  };

  const handleWaiveInvoice = (invoiceId: string) => {
    setConfirmState({
      isOpen: true,
      title: '면제 처리',
      message: '이 청구를 면제 처리하시겠습니까?',
      onConfirm: async () => {
        setConfirmState((prev) => ({ ...prev, isOpen: false }));
        setActionLoading(`waive-${invoiceId}`);
        try {
          const functions = getFunctions(getFirebaseAuth().app, 'asia-northeast3');
          const waiveInvoice = httpsCallable(functions, 'waiveInvoice');
          await waiveInvoice({ clientId: id, invoiceId });
          await loadData();
        } catch {
          setToast({ message: '면제 처리에 실패했습니다.', type: 'error' });
        } finally {
          setActionLoading(null);
        }
      },
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    setIsSendingMessage(true);
    setMessageResult(null);

    try {
      const functions = getFunctions(getFirebaseAuth().app, 'asia-northeast3');
      const sendManualNotice = httpsCallable(functions, 'sendManualNotice');
      await sendManualNotice({ clientId: id, message: messageText.trim() });
      setMessageResult({ type: 'success', text: '메시지가 성공적으로 발송되었습니다.' });
      setMessageText('');
    } catch (err) {
      setMessageResult({ type: 'error', text: '메시지 발송에 실패했습니다.' });
    } finally {
      setIsSendingMessage(false);
    }
  };

  const toggleServiceItem = (value: string) => {
    setProjectForm((prev) => ({
      ...prev,
      serviceItems: prev.serviceItems.includes(value)
        ? prev.serviceItems.filter((s) => s !== value)
        : [...prev.serviceItems, value],
    }));
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

  if (error || !client) {
    return (
      <div className="min-h-64 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error ?? '고객을 찾을 수 없습니다.'}</p>
          <button
            onClick={() => router.push('/admin/billing/clients')}
            className="px-4 py-2 bg-brand-primary text-white rounded-xl text-sm font-medium hover:bg-brand-primary/90 transition-colors"
          >
            목록으로
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 토스트 알림 */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* 확인 모달 */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmState.onConfirm}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel="확인"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/admin/billing/clients"
            className="text-sm text-brand-muted hover:text-brand-primary transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            고객 목록으로
          </Link>
          <h1 className="text-2xl font-bold text-brand-primary mt-2">{client.companyName}</h1>
          <p className="text-brand-muted text-sm">{client.contactName} · {client.phone}</p>
        </div>
        <div className="flex items-center gap-3 self-start">
          <button
            onClick={() => { setShowMessageModal(true); setMessageResult(null); }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-xl text-sm font-medium hover:bg-brand-primary/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            메시지 보내기
          </button>
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
            client.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}>
            {client.status === 'active' ? '활성' : '비활성'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-1 w-fit">
        {(['info', 'projects', 'invoices'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-brand-primary text-white'
                : 'text-brand-muted hover:text-brand-text'
            }`}
          >
            {tab === 'info' ? '기본정보' : tab === 'projects' ? '프로젝트' : '결제이력'}
          </button>
        ))}
      </div>

      {/* Tab: 기본정보 */}
      {activeTab === 'info' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-brand-primary">고객 정보</h2>
            <div className="flex gap-2">
              {!isEditingInfo ? (
                <button
                  onClick={() => setIsEditingInfo(true)}
                  className="px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-xl text-sm font-medium hover:bg-brand-primary/20 transition-colors"
                >
                  편집
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveInfo}
                    disabled={isSavingInfo}
                    className="px-4 py-2 bg-brand-secondary text-white rounded-xl text-sm font-medium hover:bg-brand-secondary/90 disabled:opacity-50 transition-colors"
                  >
                    {isSavingInfo ? '저장 중...' : '저장'}
                  </button>
                  <button
                    onClick={() => { setIsEditingInfo(false); setEditForm(client); }}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    취소
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { label: '회사명', field: 'companyName' as const },
              { label: '담당자명', field: 'contactName' as const },
              { label: '전화번호', field: 'phone' as const },
              { label: '이메일', field: 'email' as const },
              { label: '세금계산서 이메일', field: 'taxEmail' as const },
              { label: '사업자등록번호', field: 'businessRegNo' as const },
              { label: '업태', field: 'companyType' as const },
              { label: '종목', field: 'companyCategory' as const },
            ].map(({ label, field }) => (
              <div key={field}>
                <p className="text-sm text-brand-muted mb-1">{label}</p>
                {isEditingInfo ? (
                  <input
                    type="text"
                    value={(editForm[field] as string) ?? ''}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, [field]: e.target.value }))}
                    className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
                  />
                ) : (
                  <p className="font-medium text-brand-text">{client[field] || '—'}</p>
                )}
              </div>
            ))}
          </div>

          <div>
            <p className="text-sm text-brand-muted mb-1">메모</p>
            {isEditingInfo ? (
              <textarea
                value={editForm.memo ?? ''}
                onChange={(e) => setEditForm((prev) => ({ ...prev, memo: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary resize-none"
              />
            ) : (
              <p className="text-brand-text">{client.memo || '—'}</p>
            )}
          </div>

          {isEditingInfo && (
            <div>
              <p className="text-sm text-brand-muted mb-1">상태</p>
              <select
                value={editForm.status ?? 'active'}
                onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value as 'active' | 'inactive' }))}
                className="px-3 py-2 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30"
              >
                <option value="active">활성</option>
                <option value="inactive">비활성</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Tab: 프로젝트 */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-brand-primary">프로젝트 목록</h2>
            <button
              onClick={() => setShowProjectModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-secondary text-white rounded-xl text-sm font-medium hover:bg-brand-secondary/90 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              프로젝트 추가
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-12 text-center text-brand-muted">
              등록된 프로젝트가 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project.id} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-brand-text">{project.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PROJECT_STATUS_BADGE[project.status]?.color ?? 'bg-gray-100 text-gray-500'}`}>
                          {PROJECT_STATUS_BADGE[project.status]?.label ?? project.status}
                        </span>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-3 text-sm">
                        {project.siteUrl && (
                          <div>
                            <span className="text-brand-muted">사이트: </span>
                            <a href={project.siteUrl} target="_blank" rel="noopener noreferrer" className="text-brand-secondary hover:underline">
                              {project.siteUrl}
                            </a>
                          </div>
                        )}
                        <div>
                          <span className="text-brand-muted">월정액: </span>
                          <span className="font-medium text-brand-text">₩{project.monthlyFee.toLocaleString('ko-KR')}</span>
                        </div>
                        <div>
                          <span className="text-brand-muted">결제일: </span>
                          <span className="text-brand-text">매월 {project.billingDay}일</span>
                        </div>
                        <div>
                          <span className="text-brand-muted">계약시작: </span>
                          <span className="text-brand-text">{project.contractStart ? new Date(project.contractStart).toLocaleDateString('ko-KR') : '—'}</span>
                        </div>
                        {project.serviceItems.length > 0 && (
                          <div className="sm:col-span-2">
                            <span className="text-brand-muted">서비스: </span>
                            <span className="text-brand-text">{project.serviceItems.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {project.status === 'active' && (
                      <button
                        onClick={() => handleTerminateProject(project.id, project.name)}
                        className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      >
                        해지
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: 결제이력 */}
      {activeTab === 'invoices' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-brand-primary/10">
            <h2 className="text-lg font-bold text-brand-primary">결제 이력</h2>
          </div>
          {invoices.length === 0 ? (
            <div className="p-12 text-center text-brand-muted">결제 이력이 없습니다.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-brand-bg border-b border-brand-primary/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">청구월</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">프로젝트</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">금액</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">상태</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-brand-muted uppercase">결제일</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-brand-muted uppercase">액션</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-primary/5">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-brand-bg/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-brand-text">{invoice.yearMonth}</td>
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
                        {invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString('ko-KR') : '—'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {(invoice.status === 'pending' || invoice.status === 'overdue' || invoice.status === 'failed') && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleConfirmPayment(invoice.id)}
                              disabled={actionLoading === `confirm-${invoice.id}`}
                              className="px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {actionLoading === `confirm-${invoice.id}` ? '...' : '입금확인'}
                            </button>
                            <button
                              onClick={() => handleWaiveInvoice(invoice.id)}
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
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-brand-primary">메시지 보내기</h3>
                <p className="text-sm text-brand-muted mt-0.5">{client.companyName}</p>
              </div>
              <button
                onClick={() => { setShowMessageModal(false); setMessageText(''); setMessageResult(null); }}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSendMessage} className="p-6 space-y-4">
              {messageResult && (
                <div className={`px-4 py-3 rounded-xl text-sm ${
                  messageResult.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-700'
                    : 'bg-red-50 border border-red-200 text-red-600'
                }`}>
                  {messageResult.text}
                </div>
              )}
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
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSendingMessage || !messageText.trim()}
                  className="flex-1 px-4 py-2.5 bg-brand-secondary text-white rounded-xl text-sm font-medium hover:bg-brand-secondary/90 disabled:opacity-50 transition-colors"
                >
                  {isSendingMessage ? '발송 중...' : '발송'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowMessageModal(false); setMessageText(''); setMessageResult(null); }}
                  className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  닫기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Add Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-brand-primary">프로젝트 추가</h3>
              <button
                onClick={() => { setShowProjectModal(false); setProjectForm(INITIAL_PROJECT_FORM); setProjectFormError(null); }}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              {projectFormError && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  {projectFormError}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1.5">
                  프로젝트명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1.5">사이트 URL</label>
                <input
                  type="url"
                  value={projectForm.siteUrl}
                  onChange={(e) => setProjectForm((p) => ({ ...p, siteUrl: e.target.value }))}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-text mb-1.5">
                    월정액 (원) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={projectForm.monthlyFee}
                    onChange={(e) => setProjectForm((p) => ({ ...p, monthlyFee: e.target.value }))}
                    placeholder="100000"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-text mb-1.5">
                    결제일 (1-28) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="28"
                    value={projectForm.billingDay}
                    onChange={(e) => setProjectForm((p) => ({ ...p, billingDay: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-text mb-1.5">
                  계약 시작일 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={projectForm.contractStart}
                  onChange={(e) => setProjectForm((p) => ({ ...p, contractStart: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-brand-text focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-text mb-2">서비스 항목</label>
                <div className="flex flex-wrap gap-2">
                  {SERVICE_ITEMS.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => toggleServiceItem(item.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        projectForm.serviceItems.includes(item.value)
                          ? 'bg-brand-secondary text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSavingProject}
                  className="flex-1 px-4 py-2.5 bg-brand-secondary text-white rounded-xl text-sm font-medium hover:bg-brand-secondary/90 disabled:opacity-50 transition-colors"
                >
                  {isSavingProject ? '저장 중...' : '프로젝트 추가'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowProjectModal(false); setProjectForm(INITIAL_PROJECT_FORM); setProjectFormError(null); }}
                  className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
