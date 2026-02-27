import React from 'react';
import BrochurePageLandscape from '../BrochurePageLandscape';
import { colors, borderRadius, shadows } from '../brochure-design-system';

export default function Project1PageLandscape() {
  return (
    <BrochurePageLandscape pageNumber={6} bgColor="light">
      <div className="h-full flex gap-8">
        {/* Left - Dashboard Mockup */}
        <div className="w-2/5 h-full flex items-center justify-center">
          <div
            className="w-full h-[85%] overflow-hidden relative"
            style={{
              backgroundColor: '#1a1f2e',
              boxShadow: shadows.xl,
              borderRadius: borderRadius['2xl'],
            }}
          >
            {/* Mock Dashboard Header */}
            <div className="h-10 flex items-center px-4 gap-2" style={{ backgroundColor: '#252b3d' }}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff5f57' }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#febc2e' }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#28c840' }} />
              <span className="ml-4 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Performance Dashboard
              </span>
            </div>

            {/* Mock Dashboard Content */}
            <div className="p-4 space-y-3">
              {/* Stats Row */}
              <div className="flex gap-2">
                {[
                  { label: 'Total P&L', value: '+23.4%', color: '#4ade80' },
                  { label: 'MDD', value: '-8.2%', color: '#f87171' },
                  { label: 'Win Rate', value: '67%', color: '#60a5fa' },
                ].map((stat, i) => (
                  <div key={i} className="flex-1 p-2 rounded-lg" style={{ backgroundColor: '#252b3d' }}>
                    <p className="text-[8px]" style={{ color: 'rgba(255,255,255,0.4)' }}>{stat.label}</p>
                    <p className="text-sm font-bold" style={{ color: stat.color }}>{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Chart Area */}
              <div className="h-20 rounded-lg relative overflow-hidden" style={{ backgroundColor: '#252b3d' }}>
                <svg viewBox="0 0 200 60" className="w-full h-full">
                  <defs>
                    <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#4ade80', stopOpacity: 0.3 }} />
                      <stop offset="100%" style={{ stopColor: '#4ade80', stopOpacity: 0 }} />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,45 Q20,40 40,35 T80,25 T120,30 T160,15 T200,20 L200,60 L0,60 Z"
                    fill="url(#chartGrad)"
                  />
                  <path
                    d="M0,45 Q20,40 40,35 T80,25 T120,30 T160,15 T200,20"
                    stroke="#4ade80"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Table Mock */}
              <div className="rounded-lg overflow-hidden" style={{ backgroundColor: '#252b3d' }}>
                <div className="flex text-[8px] p-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  <span className="flex-1">Strategy</span>
                  <span className="w-16 text-right">Return</span>
                  <span className="w-16 text-right">Status</span>
                </div>
                {['Momentum', 'Mean Rev', 'Grid Bot'].map((name, i) => (
                  <div key={i} className="flex text-[9px] p-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <span className="flex-1 text-white">{name}</span>
                    <span className="w-16 text-right" style={{ color: '#4ade80' }}>+{12 + i * 5}%</span>
                    <span className="w-16 text-right">
                      <span className="px-1 py-0.5 rounded text-[7px]" style={{ backgroundColor: '#4ade80', color: '#1a1f2e' }}>
                        Active
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right - Content with Before/After */}
        <div className="w-3/5 h-full flex flex-col justify-center">
          <span className="font-bold text-xs tracking-wider uppercase mb-2" style={{ color: colors.brand.primary }}>
            CASE STUDY #1
          </span>
          <h2 className="text-3xl font-bold mb-3 leading-tight" style={{ color: colors.text.primary }}>
            내부 투자 성과<br />분석 대시보드
          </h2>

          {/* Before/After Cards */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div
              className="p-4"
              style={{
                backgroundColor: colors.neutral.white,
                boxShadow: shadows.md,
                borderRadius: borderRadius.xl,
                borderLeft: `3px solid ${colors.semantic.error}`,
              }}
            >
              <h3 className="font-bold text-sm mb-2" style={{ color: colors.semantic.error }}>Before</h3>
              <p className="text-xs leading-relaxed" style={{ color: colors.text.secondary }}>
                매주 금요일 <span className="font-bold">5개 엑셀 파일</span>을 수동으로 취합.
                리포팅에만 <span className="font-bold">반나절</span> 소요.
              </p>
            </div>
            <div
              className="p-4"
              style={{
                backgroundColor: colors.neutral.white,
                boxShadow: shadows.md,
                borderRadius: borderRadius.xl,
                borderLeft: `3px solid ${colors.semantic.success}`,
              }}
            >
              <h3 className="font-bold text-sm mb-2" style={{ color: colors.semantic.success }}>After</h3>
              <p className="text-xs leading-relaxed" style={{ color: colors.text.secondary }}>
                <span className="font-bold">클릭 3번</span>이면 주간 리포트 완성.
                전략별 성과를 <span className="font-bold">실시간</span>으로 확인.
              </p>
            </div>
          </div>

          {/* Results */}
          <div className="flex gap-6">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 flex items-center justify-center"
                style={{ backgroundColor: colors.brand.dark, borderRadius: borderRadius.lg }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.brand.primary} strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <p className="text-[10px]" style={{ color: colors.text.muted }}>Tech Stack</p>
                <p className="text-xs font-medium" style={{ color: colors.text.primary }}>FastAPI · PostgreSQL · React</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 flex items-center justify-center"
                style={{ backgroundColor: colors.brand.primary, borderRadius: borderRadius.lg }}
              >
                <span className="text-white font-bold text-sm">80%</span>
              </div>
              <div>
                <p className="text-[10px]" style={{ color: colors.text.muted }}>Result</p>
                <p className="text-xs font-medium" style={{ color: colors.text.primary }}>리포팅 시간 단축</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrochurePageLandscape>
  );
}
