'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { getLeadById, updateLead, updateLeadStatus, addLeadNote } from '@/lib/firestore-quotes';
import { QuoteLead, LeadStatus, LeadPriority } from '@/types/admin';
import TodoList from '@/components/crm/TodoList';
import QuoteEmailPanel from '@/components/crm/QuoteEmailPanel';
import CustomerStatsPanel from '@/components/crm/CustomerStatsPanel';

const STATUS_LABELS: Record<LeadStatus, { label: string; color: string; bgColor: string; description: string }> = {
  NEW: { 
    label: '접수', 
    color: 'text-blue-700', 
    bgColor: 'bg-blue-100',
    description: '새로운 견적이 접수되었습니다.'
  },
  CONTACTED: { 
    label: '연락완료', 
    color: 'text-yellow-700', 
    bgColor: 'bg-yellow-100',
    description: '고객에게 연락을 완료했습니다.'
  },
  QUOTED: { 
    label: '견적완료', 
    color: 'text-purple-700', 
    bgColor: 'bg-purple-100',
    description: '견적서를 발송했습니다.'
  },
  NEGOTIATING: { 
    label: '협상중', 
    color: 'text-orange-700', 
    bgColor: 'bg-orange-100',
    description: '가격/조건 협상 중입니다.'
  },
  WON: { 
    label: '계약완료', 
    color: 'text-green-700', 
    bgColor: 'bg-green-100',
    description: '계약이 성공적으로 완료되었습니다.'
  },
  LOST: { 
    label: '계약실패', 
    color: 'text-red-700', 
    bgColor: 'bg-red-100',
    description: '계약이 실패했습니다.'
  },
  HOLD: { 
    label: '보류', 
    color: 'text-gray-700', 
    bgColor: 'bg-gray-100',
    description: '일시적으로 보류되었습니다.'
  },
};

const PRIORITY_OPTIONS: { value: LeadPriority; label: string; color: string }[] = [
  { value: 'LOW', label: '낮음', color: 'bg-gray-100 text-gray-700' },
  { value: 'MEDIUM', label: '보통', color: 'bg-blue-100 text-blue-700' },
  { value: 'HIGH', label: '높음', color: 'bg-orange-100 text-orange-700' },
  { value: 'URGENT', label: '긴급', color: 'bg-red-100 text-red-700' },
];

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  NOTE: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  EMAIL: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  CALL: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  MEETING: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  QUOTE_SENT: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  STATUS_CHANGE: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  FOLLOWUP: (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

interface QuoteDetailClientProps {
  id: string;
}

export default function QuoteDetailClient({ id }: QuoteDetailClientProps): React.ReactElement {
  const router = useRouter();
  const { user } = useAuth();
  const [lead, setLead] = useState<QuoteLead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [noteContent, setNoteContent] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const loadLead = async () => {
    setIsLoading(true);
    const result = await getLeadById(id);
    if (result.success && result.data) {
      setLead(result.data);
    } else {
      alert('리드를 찾을 수 없습니다.');
      router.push('/admin/quotes');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchLead = async () => {
      setIsLoading(true);
      const result = await getLeadById(id);
      if (result.success && result.data) {
        setLead(result.data);
      } else {
        alert('리드를 찾을 수 없습니다.');
        router.push('/admin/quotes');
      }
      setIsLoading(false);
    };
    fetchLead();
  }, [id, router]);

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!lead || !user?.email) return;

    const result = await updateLeadStatus(lead.id, newStatus, user.email);
    if (result.success) {
      loadLead();
    } else {
      alert(result.error || '상태 변경에 실패했습니다.');
    }
  };

  const handlePriorityChange = async (newPriority: LeadPriority) => {
    if (!lead) return;

    const result = await updateLead(lead.id, { priority: newPriority });
    if (result.success) {
      loadLead();
    } else {
      alert(result.error || '우선순위 변경에 실패했습니다.');
    }
  };

  const handleAddNote = async () => {
    if (!lead || !user?.email || !noteContent.trim()) return;

    setIsSubmittingNote(true);
    const result = await addLeadNote(lead.id, noteContent, user.email);
    if (result.success) {
      setNoteContent('');
      loadLead();
    } else {
      alert(result.error || '노트 추가에 실패했습니다.');
    }
    setIsSubmittingNote(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-10 h-10 border-3 border-brand-primary border-t-transparent rounded-full" />
          <p className="text-brand-muted">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-brand-muted">리드를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/admin/quotes"
            className="text-sm text-brand-muted hover:text-brand-primary transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            견적 목록으로
          </Link>
          <h1 className="text-2xl font-bold text-brand-primary mt-2">
            견적 #{lead.id.slice(0, 8)}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${STATUS_LABELS[lead.status].bgColor} ${STATUS_LABELS[lead.status].color}`}>
            {STATUS_LABELS[lead.status].label}
          </span>
        </div>
      </div>

      {/* Status Pipeline */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6">
        <h2 className="text-sm font-bold text-brand-muted mb-4 uppercase tracking-wide">진행 상태</h2>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(STATUS_LABELS) as LeadStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                lead.status === status
                  ? `${STATUS_LABELS[status].bgColor} ${STATUS_LABELS[status].color} ring-2 ring-offset-2 ring-brand-primary/20`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {STATUS_LABELS[status].label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm text-brand-muted">
          {STATUS_LABELS[lead.status].description}
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Customer & Project Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6">
            <h2 className="text-lg font-bold text-brand-primary mb-4">고객 정보</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-brand-muted">이름</p>
                <p className="font-medium text-brand-text">{lead.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-brand-muted">회사/소속</p>
                <p className="font-medium text-brand-text">{lead.company || '미입력'}</p>
              </div>
              <div>
                <p className="text-sm text-brand-muted">이메일</p>
                <a href={`mailto:${lead.email}`} className="font-medium text-brand-secondary hover:underline">
                  {lead.email}
                </a>
              </div>
              <div>
                <p className="text-sm text-brand-muted">연락처</p>
                <a href={`tel:${lead.phone}`} className="font-medium text-brand-secondary hover:underline">
                  {lead.phone}
                </a>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-brand-muted">선호 연락 방식</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {lead.preferredContact.map((contact: string) => (
                    <span key={contact} className="px-2 py-1 bg-brand-bg rounded text-sm">
                      {contact === 'email' ? '이메일' : contact === 'phone' ? '전화' : '카카오톡'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Project Info */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6">
            <h2 className="text-lg font-bold text-brand-primary mb-4">프로젝트 정보</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-brand-muted">프로젝트 유형</p>
                <p className="font-medium text-brand-text">{lead.projectType}</p>
              </div>
              {lead.projectTypeOther && (
                <div>
                  <p className="text-sm text-brand-muted">기타 유형</p>
                  <p className="font-medium text-brand-text">{lead.projectTypeOther}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-brand-muted">프로젝트명</p>
                <p className="font-medium text-brand-text">{lead.projectName || '미입력'}</p>
              </div>
              <div>
                <p className="text-sm text-brand-muted">프로젝트 요약</p>
                <p className="font-medium text-brand-text">{lead.projectSummary}</p>
              </div>
              <div>
                <p className="text-sm text-brand-muted">상세 설명</p>
                <p className="text-brand-text whitespace-pre-wrap">{lead.projectDescription}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-brand-muted">프로젝트 목표</p>
                  <p className="font-medium text-brand-text">{lead.projectGoal}</p>
                </div>
                <div>
                  <p className="text-sm text-brand-muted">정부지원사업</p>
                  <p className="font-medium text-brand-text">{lead.isGovernmentFunded ? '예' : '아니오'}</p>
                </div>
              </div>
              {lead.projectTags.length > 0 && (
                <div>
                  <p className="text-sm text-brand-muted">키워드/태그</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {lead.projectTags.map((tag: string) => (
                      <span key={tag} className="px-2 py-1 bg-brand-bg rounded text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Technical Requirements */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6">
            <h2 className="text-lg font-bold text-brand-primary mb-4">기술 요구사항</h2>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-brand-muted">플랫폼</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {lead.platforms.map((platform: string) => (
                      <span key={platform} className="px-2 py-1 bg-brand-bg rounded text-sm">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-brand-muted">현재 단계</p>
                  <p className="font-medium text-brand-text">{lead.currentStage}</p>
                </div>
              </div>
              {lead.techStack.length > 0 && (
                <div>
                  <p className="text-sm text-brand-muted">선호 기술스택</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {lead.techStack.map((tech: string) => (
                      <span key={tech} className="px-2 py-1 bg-brand-bg rounded text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {lead.features.length > 0 && (
                <div>
                  <p className="text-sm text-brand-muted">필요 기능</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {lead.features.map((feature: string) => (
                      <span key={feature} className="px-2 py-1 bg-brand-bg rounded text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Budget & Timeline */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6">
            <h2 className="text-lg font-bold text-brand-primary mb-4">예산 및 일정</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-brand-muted">예산 범위</p>
                <p className="font-medium text-brand-text text-lg">{lead.budget}</p>
              </div>
              <div>
                <p className="text-sm text-brand-muted">희망 일정</p>
                <p className="font-medium text-brand-text text-lg">{lead.timeline}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Timeline & Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6">
            <h2 className="text-lg font-bold text-brand-primary mb-4">우선순위</h2>
            <div className="space-y-2">
              {PRIORITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handlePriorityChange(option.value)}
                  className={`w-full px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${
                    lead.priority === option.value
                      ? `${option.color} ring-2 ring-offset-2 ring-brand-primary/20`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Todo List */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6">
            <h2 className="text-lg font-bold text-brand-primary mb-4">할 일</h2>
            {user?.email && <TodoList leadId={lead.id} userEmail={user.email} />}
          </div>

          {/* Quote Email Panel */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6">
            <h2 className="text-lg font-bold text-brand-primary mb-4">견적서</h2>
            {user?.email && <QuoteEmailPanel lead={lead} userEmail={user.email} />}
          </div>

          {/* Customer Stats Panel */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6">
            <h2 className="text-lg font-bold text-brand-primary mb-4">고객 통계</h2>
            <CustomerStatsPanel email={lead.email} />
          </div>

          {/* Timeline */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6">
            <h2 className="text-lg font-bold text-brand-primary mb-4">타임라인</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {lead.activities.slice().reverse().map((activity: any) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-brand-bg rounded-full flex items-center justify-center text-brand-muted">
                    {ACTIVITY_ICONS[activity.type] || ACTIVITY_ICONS.NOTE}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-brand-text">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-brand-muted">
                      <span>{activity.createdBy}</span>
                      <span>•</span>
                      <span>{new Date(activity.createdAt).toLocaleString('ko-KR')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Note */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6">
            <h2 className="text-lg font-bold text-brand-primary mb-4">노트 추가</h2>
            <div className="space-y-3">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="노트를 입력하세요..."
                rows={3}
                className="w-full px-4 py-3 bg-brand-bg border border-brand-primary/10 rounded-xl text-brand-text placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-secondary/30 focus:border-brand-secondary resize-none"
              />
              <button
                onClick={handleAddNote}
                disabled={!noteContent.trim() || isSubmittingNote}
                className="w-full px-4 py-3 bg-brand-primary text-white rounded-xl font-medium hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmittingNote ? '추가 중...' : '노트 추가'}
              </button>
            </div>
          </div>

          {/* Notes List */}
          {lead.notes.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6">
              <h2 className="text-lg font-bold text-brand-primary mb-4">노트</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {lead.notes.slice().reverse().map((note: any) => (
                  <div key={note.id} className="p-3 bg-brand-bg rounded-xl">
                    <p className="text-sm text-brand-text">{note.content}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-brand-muted">
                      <span>{note.createdBy}</span>
                      <span>•</span>
                      <span>{new Date(note.createdAt).toLocaleString('ko-KR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
