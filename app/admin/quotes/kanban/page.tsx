'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllLeads, updateLeadStatus } from '@/lib/firestore-quotes';
import { useAuth } from '@/hooks/useAuth';
import type { QuoteLead, LeadStatus } from '@/types/admin';

const COLUMNS: { id: LeadStatus; title: string; color: string; bgColor: string }[] = [
  { id: 'NEW', title: '접수', color: 'border-blue-400', bgColor: 'bg-blue-50' },
  { id: 'CONTACTED', title: '연락완료', color: 'border-yellow-400', bgColor: 'bg-yellow-50' },
  { id: 'QUOTED', title: '견적완료', color: 'border-purple-400', bgColor: 'bg-purple-50' },
  { id: 'NEGOTIATING', title: '협상중', color: 'border-orange-400', bgColor: 'bg-orange-50' },
  { id: 'WON', title: '계약완료', color: 'border-green-400', bgColor: 'bg-green-50' },
  { id: 'LOST', title: '계약실패', color: 'border-red-400', bgColor: 'bg-red-50' },
  { id: 'HOLD', title: '보류', color: 'border-gray-400', bgColor: 'bg-gray-50' },
];

export default function KanbanBoardPage(): React.ReactElement {
  const { user } = useAuth();
  const [leads, setLeads] = useState<QuoteLead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [draggedLead, setDraggedLead] = useState<QuoteLead | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<LeadStatus | null>(null);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    setIsLoading(true);
    const result = await getAllLeads();
    if (result.success && result.data) {
      setLeads(result.data);
    }
    setIsLoading(false);
  };

  const handleDragStart = (lead: QuoteLead) => {
    setDraggedLead(lead);
  };

  const handleDragOver = (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    setDragOverColumn(status);
  };

  const handleDrop = async (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedLead || draggedLead.status === status || !user?.email) return;

    const result = await updateLeadStatus(draggedLead.id, status, user.email);
    if (result.success) {
      setLeads((prev) =>
        prev.map((l) => (l.id === draggedLead.id ? { ...l, status } : l))
      );
    }
    setDraggedLead(null);
  };

  const getLeadsByStatus = (status: LeadStatus) => {
    return leads.filter((l) => l.status === status);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-10 h-10 border-3 border-brand-primary border-t-transparent rounded-full" />
          <p className="text-brand-muted">칸반 보드 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-brand-primary/10">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/quotes"
            className="p-2 hover:bg-brand-bg rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-brand-primary">견적 파이프라인</h1>
            <p className="text-sm text-brand-muted">드래그하여 상태 변경</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-brand-muted">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span>계약완료: {getLeadsByStatus('WON').length}</span>
          </div>
          <Link
            href="/admin/quotes"
            className="px-4 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary/90"
          >
            리스트 보기
          </Link>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex h-full gap-4 p-6 min-w-max">
          {COLUMNS.map((column) => {
            const columnLeads = getLeadsByStatus(column.id);
            const isDragOver = dragOverColumn === column.id;

            return (
              <div
                key={column.id}
                className={`w-80 flex-shrink-0 flex flex-col rounded-2xl border-2 transition-colors ${
                  isDragOver ? column.color : 'border-transparent'
                }`}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {/* Column Header */}
                <div className={`${column.bgColor} px-4 py-3 rounded-t-2xl`}>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-brand-primary">{column.title}</span>
                    <span className="px-2 py-1 bg-white rounded-full text-xs font-medium text-brand-muted">
                      {columnLeads.length}
                    </span>
                  </div>
                </div>

                {/* Column Content */}
                <div className="flex-1 bg-brand-bg/50 p-3 rounded-b-2xl overflow-y-auto">
                  <div className="space-y-3">
                    {columnLeads.map((lead) => (
                      <Link
                        key={lead.id}
                        href={`/admin/quotes/${lead.id}`}
                        draggable
                        onDragStart={() => handleDragStart(lead)}
                        className="block p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all cursor-move border border-transparent hover:border-brand-secondary/30"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-medium text-brand-text line-clamp-1">
                            {lead.projectName || lead.projectType}
                          </h3>
                          {lead.priority === 'URGENT' && (
                            <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded">
                              긴급
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-brand-muted mb-3 line-clamp-2">
                          {lead.customerName} · {lead.company || '개인'}
                        </p>

                        <div className="flex items-center justify-between text-xs">
                          <span className="text-brand-muted">{formatDate(lead.createdAt)}</span>
                          <span className="font-medium text-brand-secondary">{lead.budget}</span>
                        </div>
                      </Link>
                    ))}

                    {columnLeads.length === 0 && (
                      <div className="text-center py-8 text-brand-muted text-sm">
                        리드가 없습니다
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
