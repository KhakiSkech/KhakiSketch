import React from 'react';
import BrochurePageLandscape from '../BrochurePageLandscape';
import { colors, borderRadius, shadows } from '../brochure-design-system';

export default function Project4PageLandscape() {
  return (
    <BrochurePageLandscape pageNumber={9} bgColor="light">
      <div className="h-full flex gap-8">
        {/* Left - Content */}
        <div className="w-3/5 h-full flex flex-col justify-center">
          <span className="font-bold text-xs tracking-wider uppercase mb-2" style={{ color: colors.brand.primary }}>
            CASE STUDY #4
          </span>
          <h2 className="text-3xl font-bold mb-3 leading-tight" style={{ color: colors.text.primary }}>
            이커머스 재고<br />통합 대시보드
          </h2>

          {/* Before/After Cards */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div
              className="p-4"
              style={{
                backgroundColor: colors.neutral.white,
                borderRadius: borderRadius.xl,
                borderLeft: `3px solid ${colors.semantic.error}`,
                boxShadow: shadows.md,
              }}
            >
              <h3 className="font-bold text-sm mb-2" style={{ color: colors.semantic.error }}>Before</h3>
              <p className="text-xs leading-relaxed" style={{ color: colors.text.secondary }}>
                스마트스토어, 쿠팡, 자사몰 <span className="font-bold">3개 창을 번갈아</span> 확인.
                품절 알림 늦어 <span className="font-bold">주문 취소</span> 빈번.
              </p>
            </div>
            <div
              className="p-4"
              style={{
                backgroundColor: colors.neutral.white,
                borderRadius: borderRadius.xl,
                borderLeft: `3px solid ${colors.semantic.success}`,
                boxShadow: shadows.md,
              }}
            >
              <h3 className="font-bold text-sm mb-2" style={{ color: colors.semantic.success }}>After</h3>
              <p className="text-xs leading-relaxed" style={{ color: colors.text.secondary }}>
                <span className="font-bold">통합 대시보드</span>에서 전 채널 재고 확인.
                재고 10개 이하 시 <span className="font-bold">슬랙 자동 알림</span>.
              </p>
            </div>
          </div>

          {/* Solution Features */}
          <div
            className="p-4 mb-5"
            style={{ backgroundColor: colors.neutral.white, borderRadius: borderRadius.xl, boxShadow: shadows.md }}
          >
            <h3 className="font-bold text-xs mb-3" style={{ color: colors.text.primary }}>주요 기능</h3>
            <ul className="text-xs leading-relaxed space-y-2" style={{ color: colors.text.secondary }}>
              <li className="flex items-start gap-2">
                <span className="mt-0.5" style={{ color: colors.brand.primary }}>•</span>
                3개 플랫폼 API 연동으로 재고 실시간 동기화
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5" style={{ color: colors.brand.primary }}>•</span>
                채널별 판매량 추이 차트 및 분석
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5" style={{ color: colors.brand.primary }}>•</span>
                월별 정산 리포트 원클릭 생성
              </li>
            </ul>
          </div>

          {/* Results */}
          <div className="flex gap-6">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 flex items-center justify-center"
                style={{ backgroundColor: colors.brand.dark, borderRadius: borderRadius.lg }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.brand.primary} strokeWidth="2">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
              </div>
              <div>
                <p className="text-[10px]" style={{ color: colors.text.muted }}>Tech Stack</p>
                <p className="text-xs font-medium" style={{ color: colors.text.primary }}>React · FastAPI · PostgreSQL</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 flex items-center justify-center"
                style={{ backgroundColor: colors.brand.primary, borderRadius: borderRadius.lg }}
              >
                <span className="text-white font-bold text-sm">95%</span>
              </div>
              <div>
                <p className="text-[10px]" style={{ color: colors.text.muted }}>Result</p>
                <p className="text-xs font-medium" style={{ color: colors.text.primary }}>품절 취소율 감소</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Dashboard Mockup */}
        <div className="w-2/5 h-full flex items-center justify-center">
          <div
            className="w-full h-[85%] overflow-hidden"
            style={{
              backgroundColor: '#1e293b',
              borderRadius: borderRadius['2xl'],
              boxShadow: shadows.xl,
            }}
          >
            {/* Mock Header */}
            <div className="h-10 flex items-center px-4 gap-2" style={{ backgroundColor: '#0f172a' }}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#eab308' }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#22c55e' }} />
              <span className="ml-4 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Stock Dashboard</span>
            </div>

            <div className="p-4 space-y-3">
              {/* Stats Row */}
              <div className="flex gap-2">
                {[
                  { label: '총 SKU', value: '247', color: '#60a5fa' },
                  { label: '품절 임박', value: '12', color: '#f87171' },
                  { label: '오늘 주문', value: '89', color: '#4ade80' },
                ].map((stat, i) => (
                  <div key={i} className="flex-1 p-3 rounded-lg" style={{ backgroundColor: '#334155' }}>
                    <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{stat.label}</p>
                    <p className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Chart Area */}
              <div className="h-20 rounded-lg relative overflow-hidden" style={{ backgroundColor: '#334155' }}>
                <svg viewBox="0 0 200 60" className="w-full h-full">
                  <defs>
                    <linearGradient id="stockGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#60a5fa', stopOpacity: 0.3 }} />
                      <stop offset="100%" style={{ stopColor: '#60a5fa', stopOpacity: 0 }} />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,40 Q30,35 60,30 T120,25 T180,20 T200,25 L200,60 L0,60 Z"
                    fill="url(#stockGrad)"
                  />
                  <path
                    d="M0,40 Q30,35 60,30 T120,25 T180,20 T200,25"
                    stroke="#60a5fa"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Channel Table */}
              <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#334155' }}>
                <div className="flex text-[9px] p-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <span className="flex-1">채널</span>
                  <span className="w-16 text-right">재고</span>
                  <span className="w-16 text-right">오늘 판매</span>
                </div>
                {[
                  { channel: '스마트스토어', stock: '1,234', sales: '+32' },
                  { channel: '쿠팡', stock: '856', sales: '+28' },
                  { channel: '자사몰', stock: '423', sales: '+29' },
                ].map((row, i) => (
                  <div key={i} className="flex text-[10px] p-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                    <span className="flex-1 text-white">{row.channel}</span>
                    <span className="w-16 text-right" style={{ color: '#60a5fa' }}>{row.stock}</span>
                    <span className="w-16 text-right" style={{ color: '#4ade80' }}>{row.sales}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrochurePageLandscape>
  );
}
