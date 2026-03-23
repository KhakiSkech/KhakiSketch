'use client';

import { logger } from '@/lib/logger';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirebaseAuth } from '@/lib/firebase';
import { getAllLeads, getLeadStats } from '@/lib/firestore-quotes';
import { QuoteLead, LeadStats } from '@/types/admin';

// ---- GA4 타입 ----
interface DailyRow {
  date: string;
  sessions: number;
}

interface TopPage {
  pagePath: string;
  views: number;
}

interface TrafficSource {
  source: string;
  medium: string;
  sessions: number;
}

interface AnalyticsData {
  activeUsers: number;
  weeklyDaily: DailyRow[];
  topPages: TopPage[];
  trafficSources: TrafficSource[];
  cachedAt: number;
  error?: string;
}

// 차트 컴포넌트 (간단한 SVG 기반)
const BarChart = ({ data, maxValue, color = 'bg-brand-primary' }: { data: number[]; maxValue: number; color?: string }) => (
  <div className="flex items-end gap-2 h-32">
    {data.map((value, index) => (
      <div key={index} className="flex-1 flex flex-col items-center gap-1">
        <div
          className={`w-full ${color} rounded-t transition-all duration-500`}
          style={{ height: `${(value / maxValue) * 100}%`, minHeight: value > 0 ? '4px' : '0' }}
        />
        <span className="text-xs text-brand-muted">{value}</span>
      </div>
    ))}
  </div>
);

const PieChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = 0;

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {data.map((item, index) => {
            if (item.value === 0) return null;
            const angle = (item.value / total) * 360;
            const startAngle = currentAngle;
            currentAngle += angle;
            const endAngle = currentAngle;

            const x1 = 50 + 40 * Math.cos((Math.PI * startAngle) / 180);
            const y1 = 50 + 40 * Math.sin((Math.PI * startAngle) / 180);
            const x2 = 50 + 40 * Math.cos((Math.PI * endAngle) / 180);
            const y2 = 50 + 40 * Math.sin((Math.PI * endAngle) / 180);

            const largeArcFlag = angle > 180 ? 1 : 0;

            return (
              <path
                key={index}
                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                fill={item.color}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-brand-primary">{total}</span>
        </div>
      </div>
      <div className="flex-1 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-brand-text">{item.label}</span>
            </div>
            <span className="text-sm font-medium text-brand-text">
              {item.value} ({((item.value / total) * 100).toFixed(1)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const FunnelChart = ({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className="w-24 text-sm text-brand-muted text-right">{item.label}</div>
          <div className="flex-1">
            <div
              className="h-8 rounded-lg flex items-center px-3 transition-all duration-500"
              style={{
                width: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color,
                minWidth: item.value > 0 ? '40px' : '0'
              }}
            >
              <span className="text-sm font-medium text-white">{item.value}</span>
            </div>
          </div>
          {index > 0 && (
            <div className="w-20 text-xs text-brand-muted">
              {data[index - 1].value > 0 
                ? `${((item.value / data[index - 1].value) * 100).toFixed(1)}%` 
                : '0%'}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default function AnalyticsPage(): React.ReactElement {
  const [leads, setLeads] = useState<QuoteLead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  // GA4 state
  const [ga4Data, setGa4Data] = useState<AnalyticsData | null>(null);
  const [ga4Loading, setGa4Loading] = useState(true);

  useEffect(() => {
    loadAnalytics();
    loadGa4();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const [leadsResult, statsResult] = await Promise.all([
        getAllLeads(),
        getLeadStats(),
      ]);

      if (leadsResult.success && leadsResult.data) {
        // 날짜 필터링
        const now = new Date();
        const filteredLeads = leadsResult.data.filter(lead => {
          if (dateRange === 'all') return true;
          const leadDate = new Date(lead.createdAt);
          const diffDays = (now.getTime() - leadDate.getTime()) / (1000 * 60 * 60 * 24);
          if (dateRange === '7d') return diffDays <= 7;
          if (dateRange === '30d') return diffDays <= 30;
          if (dateRange === '90d') return diffDays <= 90;
          return true;
        });
        setLeads(filteredLeads);
      }

      if (statsResult.success && statsResult.data) {
        setStats(statsResult.data);
      }
    } catch (error) {
      logger.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadGa4 = async () => {
    setGa4Loading(true);
    try {
      const functions = getFunctions(getFirebaseAuth().app, 'asia-northeast3');
      const getAnalyticsData = httpsCallable<void, AnalyticsData>(functions, 'getAnalyticsData');
      const result = await getAnalyticsData();
      setGa4Data(result.data);
    } catch (error) {
      logger.error('Error loading GA4 data:', error);
      setGa4Data(null);
    } finally {
      setGa4Loading(false);
    }
  };

  // 월별 데이터 계산
  const getMonthlyData = () => {
    const months: { [key: string]: number } = {};
    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    
    // 최근 6개월 초기화
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      months[`${d.getFullYear()}-${d.getMonth()}`] = 0;
    }

    leads.forEach(lead => {
      const date = new Date(lead.createdAt);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (months.hasOwnProperty(key)) {
        months[key]++;
      }
    });

    return Object.entries(months).map(([key, value]) => {
      const [year, month] = key.split('-').map(Number);
      return {
        label: monthNames[month],
        value,
      };
    });
  };

  // 상태별 데이터
  const statusData = stats ? [
    { label: '접수', value: stats.byStatus.NEW, color: '#3B82F6' },
    { label: '연락완료', value: stats.byStatus.CONTACTED, color: '#EAB308' },
    { label: '견적완료', value: stats.byStatus.QUOTED, color: '#A855F7' },
    { label: '협상중', value: stats.byStatus.NEGOTIATING, color: '#F97316' },
    { label: '계약완료', value: stats.byStatus.WON, color: '#22C55E' },
    { label: '계약실패', value: stats.byStatus.LOST, color: '#EF4444' },
    { label: '보류', value: stats.byStatus.HOLD, color: '#6B7280' },
  ].filter(item => item.value > 0) : [];

  // 우선순위 데이터
  const priorityData = stats ? [
    { label: '긴급', value: stats.byPriority.URGENT, color: '#EF4444' },
    { label: '높음', value: stats.byPriority.HIGH, color: '#F97316' },
    { label: '보통', value: stats.byPriority.MEDIUM, color: '#3B82F6' },
    { label: '낮음', value: stats.byPriority.LOW, color: '#6B7280' },
  ].filter(item => item.value > 0) : [];

  // 유입 채널 데이터
  const sourceData = stats ? [
    { label: '🌐 직접', value: stats.bySource.WEBSITE, color: '#3B82F6' },
    { label: '🔗 추천', value: stats.bySource.REFERRAL, color: '#8B5CF6' },
    { label: '🎯 광고', value: stats.bySource.ADS, color: '#F97316' },
    { label: '📩 직접유입', value: stats.bySource.DIRECT, color: '#22C55E' },
    { label: '기타', value: stats.bySource.ETC, color: '#6B7280' },
  ].filter(item => item.value > 0) : [];

  // 퍼널 데이터
  const funnelData = stats ? [
    { label: '접수', value: stats.byStatus.NEW, color: '#3B82F6' },
    { label: '연락완료', value: stats.byStatus.CONTACTED, color: '#EAB308' },
    { label: '견적완료', value: stats.byStatus.QUOTED, color: '#A855F7' },
    { label: '계약완료', value: stats.byStatus.WON, color: '#22C55E' },
  ] : [];

  // 전환율 계산
  const conversionRate = stats && stats.total > 0
    ? ((stats.byStatus.WON / stats.total) * 100).toFixed(1)
    : '0.0';

  const monthlyData = getMonthlyData();
  const maxMonthlyValue = Math.max(...monthlyData.map(d => d.value), 1);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-10 h-10 border-3 border-brand-primary border-t-transparent rounded-full" />
          <p className="text-brand-muted">분석 데이터 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-primary">분석 대시보드</h1>
          <p className="text-brand-muted mt-1">견적 및 CRM 데이터 분석</p>
        </div>
        <div className="flex items-center gap-2">
          {(['7d', '30d', '90d', 'all'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                dateRange === range
                  ? 'bg-brand-primary text-white'
                  : 'bg-white/80 text-brand-text hover:bg-brand-primary/10'
              }`}
            >
              {range === '7d' ? '7일' : range === '30d' ? '30일' : range === '90d' ? '90일' : '전체'}
            </button>
          ))}
        </div>
      </div>

      {/* ---- 사이트 트래픽 (GA4) ---- */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-brand-primary">사이트 트래픽</h2>
          <p className="text-brand-muted mt-1">Google Analytics 4 실시간 데이터</p>
        </div>

        {ga4Loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-brand-primary/10 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
                <div className="h-8 bg-gray-200 rounded w-16" />
              </div>
            ))}
          </div>
        ) : ga4Data?.error && !ga4Data.activeUsers && ga4Data.topPages.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-yellow-800">
            GA4 데이터를 불러올 수 없습니다. 서비스 계정을 설정해주세요.
          </div>
        ) : (
          <>
            {/* 요약 카드 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-brand-primary/10">
                <p className="text-sm text-brand-muted mb-1">오늘 활성 사용자</p>
                <p className="text-3xl font-bold text-brand-primary">{ga4Data?.activeUsers ?? 0}</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-brand-primary/10">
                <p className="text-sm text-brand-muted mb-1">이번 주 세션 합계</p>
                <p className="text-3xl font-bold text-brand-secondary">
                  {ga4Data?.weeklyDaily.reduce((acc, r) => acc + r.sessions, 0) ?? 0}
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-brand-primary/10">
                <p className="text-sm text-brand-muted mb-1">인기 페이지 1위</p>
                <p className="text-lg font-bold text-purple-600 truncate">
                  {ga4Data?.topPages[0]?.pagePath ?? '-'}
                </p>
              </div>
            </div>

            {/* 인기 페이지 TOP 5 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6">
              <h3 className="text-lg font-bold text-brand-primary mb-4">인기 페이지 TOP 5</h3>
              {ga4Data && ga4Data.topPages.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-brand-muted border-b border-brand-primary/10">
                      <th className="text-left pb-2 font-medium">페이지 경로</th>
                      <th className="text-right pb-2 font-medium">조회수</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ga4Data.topPages.map((page, idx) => (
                      <tr key={idx} className="border-b border-brand-primary/5 last:border-0">
                        <td className="py-2 text-brand-text truncate max-w-xs">{page.pagePath}</td>
                        <td className="py-2 text-right font-medium text-brand-primary">{page.views.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-brand-muted text-center py-4">데이터가 없습니다.</p>
              )}
            </div>

            {/* 유입 경로 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6">
              <h3 className="text-lg font-bold text-brand-primary mb-4">유입 경로 (최근 7일)</h3>
              {ga4Data && ga4Data.trafficSources.length > 0 ? (
                <div className="space-y-3">
                  {(() => {
                    const totalSessions = ga4Data.trafficSources.reduce((sum, s) => sum + s.sessions, 0);
                    const maxSessions = Math.max(...ga4Data.trafficSources.map(s => s.sessions), 1);
                    return ga4Data.trafficSources.slice(0, 8).map((src, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-32 text-sm text-brand-muted text-right truncate">
                          {src.source === '(direct)' ? 'Direct' : src.source}
                          {src.medium && src.medium !== '(none)' && (
                            <span className="text-brand-muted/60"> / {src.medium}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div
                            className="h-7 rounded-lg bg-brand-primary/80 flex items-center px-3 transition-all duration-500"
                            style={{ width: `${(src.sessions / maxSessions) * 100}%`, minWidth: src.sessions > 0 ? '40px' : '0' }}
                          >
                            <span className="text-xs font-medium text-white">{src.sessions}</span>
                          </div>
                        </div>
                        <div className="w-14 text-xs text-brand-muted text-right">
                          {totalSessions > 0 ? `${((src.sessions / totalSessions) * 100).toFixed(1)}%` : '0%'}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              ) : (
                <p className="text-brand-muted text-center py-4">데이터가 없습니다.</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* ---- CRM 분석 ---- */}
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-brand-primary/10">
          <p className="text-sm text-brand-muted mb-1">총 견적</p>
          <p className="text-3xl font-bold text-brand-primary">{stats?.total || 0}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-brand-primary/10">
          <p className="text-sm text-brand-muted mb-1">이번 달</p>
          <p className="text-3xl font-bold text-brand-secondary">{stats?.thisMonth || 0}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-brand-primary/10">
          <p className="text-sm text-brand-muted mb-1">계약완료</p>
          <p className="text-3xl font-bold text-green-600">{stats?.byStatus.WON || 0}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-brand-primary/10">
          <p className="text-sm text-brand-muted mb-1">전환율</p>
          <p className="text-3xl font-bold text-purple-600">{conversionRate}%</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6">
          <h2 className="text-lg font-bold text-brand-primary mb-6">월별 견적 추이</h2>
          <BarChart 
            data={monthlyData.map(d => d.value)} 
            maxValue={maxMonthlyValue}
            color="bg-brand-primary"
          />
          <div className="flex justify-between mt-2 px-1">
            {monthlyData.map((d, i) => (
              <span key={i} className="text-xs text-brand-muted">{d.label}</span>
            ))}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6">
          <h2 className="text-lg font-bold text-brand-primary mb-6">상태별 분포</h2>
          {statusData.length > 0 ? (
            <PieChart data={statusData} />
          ) : (
            <p className="text-center text-brand-muted py-8">데이터가 없습니다.</p>
          )}
        </div>

        {/* Funnel */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6">
          <h2 className="text-lg font-bold text-brand-primary mb-6">영업 퍼널</h2>
          {funnelData.some(d => d.value > 0) ? (
            <FunnelChart data={funnelData} />
          ) : (
            <p className="text-center text-brand-muted py-8">데이터가 없습니다.</p>
          )}
          <div className="mt-4 pt-4 border-t border-brand-primary/10">
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">총 전환율 (접수 → 계약)</span>
              <span className="font-bold text-brand-primary">{conversionRate}%</span>
            </div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6">
          <h2 className="text-lg font-bold text-brand-primary mb-6">우선순위 분포</h2>
          {priorityData.length > 0 ? (
            <PieChart data={priorityData} />
          ) : (
            <p className="text-center text-brand-muted py-8">데이터가 없습니다.</p>
          )}
        </div>

        {/* Source / Channel Distribution */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-brand-primary mb-6">유입 채널</h2>
          {sourceData.length > 0 ? (
            <PieChart data={sourceData} />
          ) : (
            <p className="text-center text-brand-muted py-8">데이터가 없습니다.</p>
          )}
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-brand-primary/10 p-6">
        <h2 className="text-lg font-bold text-brand-primary mb-6">상세 통계</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-3">
            <p className="text-sm font-medium text-brand-text">상태별</p>
            <div className="space-y-2">
              {stats && Object.entries(stats.byStatus).map(([status, count]) => (
                <div key={status} className="flex justify-between text-sm">
                  <span className="text-brand-muted">{status}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-brand-text">우선순위별</p>
            <div className="space-y-2">
              {stats && Object.entries(stats.byPriority).map(([priority, count]) => (
                <div key={priority} className="flex justify-between text-sm">
                  <span className="text-brand-muted">{priority}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-brand-text">유입 채널별</p>
            <div className="space-y-2">
              {stats && Object.entries(stats.bySource).map(([source, count]) => (
                <div key={source} className="flex justify-between text-sm">
                  <span className="text-brand-muted">{source}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 sm:col-span-2">
            <p className="text-sm font-medium text-brand-text">주요 지표</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-brand-bg rounded-xl">
                <p className="text-xs text-brand-muted">미처리 견적</p>
                <p className="text-2xl font-bold text-brand-primary">
                  {(stats?.byStatus.NEW || 0) + (stats?.byStatus.CONTACTED || 0)}
                </p>
              </div>
              <div className="p-4 bg-brand-bg rounded-xl">
                <p className="text-xs text-brand-muted">진행중</p>
                <p className="text-2xl font-bold text-brand-secondary">
                  {(stats?.byStatus.QUOTED || 0) + (stats?.byStatus.NEGOTIATING || 0)}
                </p>
              </div>
              <div className="p-4 bg-brand-bg rounded-xl">
                <p className="text-xs text-brand-muted">성공률</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats && (stats.byStatus.WON + stats.byStatus.LOST) > 0
                    ? `${((stats.byStatus.WON / (stats.byStatus.WON + stats.byStatus.LOST)) * 100).toFixed(1)}%`
                    : '0.0%'}
                </p>
              </div>
              <div className="p-4 bg-brand-bg rounded-xl">
                <p className="text-xs text-brand-muted">보류</p>
                <p className="text-2xl font-bold text-gray-600">{stats?.byStatus.HOLD || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/quotes"
          className="px-6 py-3 bg-brand-primary text-white rounded-xl font-medium hover:bg-brand-primary/90 transition-colors"
        >
          견적 관리로 이동
        </Link>
        <Link
          href="/admin"
          className="px-6 py-3 bg-white/80 text-brand-text rounded-xl font-medium hover:bg-brand-primary/10 transition-colors border border-brand-primary/10"
        >
          대시보드로 돌아가기
        </Link>
      </div>
    </div>
  );
}
