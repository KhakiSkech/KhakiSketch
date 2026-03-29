'use client';

import { logger } from '@/lib/logger';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllProjects } from '@/lib/firestore-projects';
import { getAllArticles } from '@/lib/firestore-articles';
import { getAllLeads } from '@/lib/firestore-quotes';
import TodayTodos from '@/components/crm/TodayTodos';
import { FirestoreProject, FirestoreArticle, QuoteLead, LeadStatus } from '@/types/admin';

const STATUS_LABELS: Record<LeadStatus, { label: string; color: string }> = {
  NEW: { label: '접수', color: 'bg-blue-100 text-blue-700' },
  CONTACTED: { label: '연락완료', color: 'bg-yellow-100 text-yellow-700' },
  QUOTED: { label: '견적완료', color: 'bg-purple-100 text-purple-700' },
  NEGOTIATING: { label: '협상중', color: 'bg-orange-100 text-orange-700' },
  WON: { label: '계약완료', color: 'bg-green-100 text-green-700' },
  LOST: { label: '계약실패', color: 'bg-red-100 text-red-700' },
  HOLD: { label: '보류', color: 'bg-gray-100 text-gray-600' },
};

interface DashboardStats {
  projects: number;
  articles: number;
  leads: number;
  newLeads: number;
}

export default function AdminDashboardPage(): React.ReactElement {
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    articles: 0,
    leads: 0,
    newLeads: 0,
  });
  const [leadStats, setLeadStats] = useState<{ byStatus: Record<LeadStatus, number> } | null>(null);
  const [recentLeads, setRecentLeads] = useState<QuoteLead[]>([]);
  const [recentProjects, setRecentProjects] = useState<FirestoreProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [projectsRes, articlesRes, leadsRes] = await Promise.all([
        getAllProjects(),
        getAllArticles(),
        getAllLeads(),
      ]);

      const leads = leadsRes.success && leadsRes.data ? leadsRes.data : [];
      const byStatus: Record<LeadStatus, number> = {
        NEW: 0, CONTACTED: 0, QUOTED: 0, NEGOTIATING: 0, WON: 0, LOST: 0, HOLD: 0,
      };
      leads.forEach((lead) => { byStatus[lead.status]++; });

      setStats({
        projects: projectsRes.length,
        articles: articlesRes.length,
        leads: leads.length,
        newLeads: byStatus.NEW,
      });

      setRecentLeads(leads.slice(0, 5));
      setLeadStats({ byStatus });

      setRecentProjects(projectsRes.slice(0, 5));
    } catch (error) {
      logger.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate conversion rate
  const conversionRate = stats.leads > 0 
    ? Math.round((leadStats?.byStatus?.WON || 0) / stats.leads * 100) 
    : 0;

  const menuItems = [
    {
      title: '포트폴리오',
      count: stats.projects,
      href: '/admin/portfolio',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'bg-blue-500',
    },
    {
      title: '블로그',
      count: stats.articles,
      href: '/admin/blog',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" />
        </svg>
      ),
      color: 'bg-green-500',
    },
    {
      title: '견적/CRM',
      count: stats.leads,
      href: '/admin/quotes',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      color: 'bg-purple-500',
      badge: stats.newLeads > 0 ? `${stats.newLeads} NEW` : undefined,
    },
    {
      title: '전환율',
      count: `${conversionRate}%`,
      href: '/admin/quotes',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'bg-orange-500',
      subtitle: '견적 → 계약',
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-10 h-10 border-3 border-brand-primary border-t-transparent rounded-full" />
          <p className="text-brand-muted">대시보드 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-brand-primary">관리자 대시보드</h1>
        <p className="text-brand-muted mt-1">KhakiSketch 관리자 패널에 오신 것을 환영합니다</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-brand-primary/10 hover:border-brand-secondary/30 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className={`${item.color} text-white p-3 rounded-xl`}>{item.icon}</div>
              {item.badge && (
                <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-brand-primary">{item.count}</p>
              <p className="text-sm text-brand-muted">{item.subtitle || item.title}</p>
            </div>
            <div className="mt-4 flex items-center text-sm text-brand-secondary group-hover:translate-x-1 transition-transform">
              관리하기
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Quotes */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 overflow-hidden">
          <div className="p-6 border-b border-brand-primary/10 flex items-center justify-between">
            <h2 className="text-lg font-bold text-brand-primary">최근 견적</h2>
            <Link
              href="/admin/quotes"
              className="text-sm text-brand-secondary hover:text-brand-primary transition-colors"
            >
              전체 보기
            </Link>
          </div>
          <div className="divide-y divide-brand-primary/5">
            {recentLeads.length === 0 ? (
              <div className="p-6 text-center text-brand-muted">최근 견적이 없습니다.</div>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="p-4 hover:bg-brand-bg/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-brand-text">{lead.customerName}</p>
                      <p className="text-sm text-brand-muted">{lead.projectName || lead.projectType}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_LABELS[lead.status].color}`}>
                        {STATUS_LABELS[lead.status].label}
                      </span>
                      <p className="text-xs text-brand-muted mt-1">
                        {new Date(lead.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 overflow-hidden">
          <div className="p-6 border-b border-brand-primary/10 flex items-center justify-between">
            <h2 className="text-lg font-bold text-brand-primary">최근 프로젝트</h2>
            <Link
              href="/admin/portfolio"
              className="text-sm text-brand-secondary hover:text-brand-primary transition-colors"
            >
              전체 보기
            </Link>
          </div>
          <div className="divide-y divide-brand-primary/5">
            {recentProjects.length === 0 ? (
              <div className="p-6 text-center text-brand-muted">최근 프로젝트가 없습니다.</div>
            ) : (
              recentProjects.map((project) => (
                <div key={project.id} className="p-4 hover:bg-brand-bg/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-brand-text">{project.title}</p>
                      <p className="text-sm text-brand-muted">{project.category}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          project.status === 'PUBLISHED'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Today's Todos */}
      <TodayTodos />

      {/* Quick Actions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6">
        <h2 className="text-lg font-bold text-brand-primary mb-4">빠른 작업</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/portfolio/new"
            className="px-4 py-2 bg-brand-primary text-white rounded-xl text-sm font-medium hover:bg-brand-primary/90 transition-colors"
          >
            + 새 프로젝트
          </Link>
          <Link
            href="/admin/blog/new"
            className="px-4 py-2 bg-brand-secondary text-white rounded-xl text-sm font-medium hover:bg-brand-secondary/90 transition-colors"
          >
            + 새 게시글
          </Link>
          <Link
            href="/admin/site-settings"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            사이트 설정
          </Link>
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            사이트 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
