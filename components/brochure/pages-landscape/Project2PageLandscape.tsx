import React from 'react';
import BrochurePageLandscape from '../BrochurePageLandscape';
import { colors, borderRadius, shadows } from '../brochure-design-system';

export default function Project2PageLandscape() {
  return (
    <BrochurePageLandscape pageNumber={7} bgColor="white">
      <div className="h-full flex gap-8">
        {/* Left - Project Details with Before/After */}
        <div className="w-3/5 h-full flex flex-col justify-center">
          <span className="font-bold text-xs tracking-wider uppercase mb-2" style={{ color: colors.brand.primary }}>
            CASE STUDY #2
          </span>
          <h2 className="text-3xl font-bold mb-3 leading-tight" style={{ color: colors.text.primary }}>
            현장 자재<br />관리 시스템
          </h2>

          {/* Before/After Cards */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div
              className="p-4"
              style={{
                backgroundColor: colors.neutral.offWhite,
                borderRadius: borderRadius.xl,
                borderLeft: `3px solid ${colors.semantic.error}`,
              }}
            >
              <h3 className="font-bold text-sm mb-2" style={{ color: colors.semantic.error }}>Before</h3>
              <p className="text-xs leading-relaxed" style={{ color: colors.text.secondary }}>
                현장 담당자가 바뀔 때마다 <span className="font-bold">엑셀 파일이 꼬임</span>.
                발주 누락, 재고 파악 불가 — <span className="font-bold">반복되는 문제</span>.
              </p>
            </div>
            <div
              className="p-4"
              style={{
                backgroundColor: colors.neutral.offWhite,
                borderRadius: borderRadius.xl,
                borderLeft: `3px solid ${colors.semantic.success}`,
              }}
            >
              <h3 className="font-bold text-sm mb-2" style={{ color: colors.semantic.success }}>After</h3>
              <p className="text-xs leading-relaxed" style={{ color: colors.text.secondary }}>
                <span className="font-bold">모바일에서 바로 입력</span>, 발주서 자동 생성.
                <span className="font-bold">누가 담당해도</span> 동일한 프로세스.
              </p>
            </div>
          </div>

          {/* Solution Features */}
          <div
            className="p-4 mb-5"
            style={{ backgroundColor: colors.neutral.offWhite, borderRadius: borderRadius.xl }}
          >
            <h3 className="font-bold text-xs mb-3" style={{ color: colors.text.primary }}>주요 기능</h3>
            <ul className="text-xs leading-relaxed space-y-2" style={{ color: colors.text.secondary }}>
              <li className="flex items-start gap-2">
                <span className="mt-0.5" style={{ color: colors.brand.primary }}>•</span>
                자재 카탈로그 및 단가 DB화
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5" style={{ color: colors.brand.primary }}>•</span>
                발주서 자동 생성 및 이메일 발송
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5" style={{ color: colors.brand.primary }}>•</span>
                모바일 대응으로 현장에서 바로 입력
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
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18M9 21V9" />
                </svg>
              </div>
              <div>
                <p className="text-[10px]" style={{ color: colors.text.muted }}>Tech Stack</p>
                <p className="text-xs font-medium" style={{ color: colors.text.primary }}>Next.js · Supabase · Tailwind</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 flex items-center justify-center"
                style={{ backgroundColor: colors.brand.primary, borderRadius: borderRadius.lg }}
              >
                <span className="text-white font-bold text-sm">40%</span>
              </div>
              <div>
                <p className="text-[10px]" style={{ color: colors.text.muted }}>Result</p>
                <p className="text-xs font-medium" style={{ color: colors.text.primary }}>발주 업무 시간 단축</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right - ERP Mockup */}
        <div className="w-2/5 h-full flex items-center justify-center">
          <div
            className="w-full h-[85%] overflow-hidden"
            style={{
              backgroundColor: '#f8fafc',
              boxShadow: shadows.xl,
              border: `1px solid ${colors.neutral.gray200}`,
              borderRadius: borderRadius['2xl'],
            }}
          >
            {/* Mock App Header */}
            <div className="h-12 flex items-center justify-between px-4" style={{ backgroundColor: colors.brand.dark }}>
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 flex items-center justify-center"
                  style={{ backgroundColor: colors.brand.primary, borderRadius: borderRadius.md }}
                >
                  <span className="text-white text-xs font-bold">G</span>
                </div>
                <span className="text-white text-sm font-medium">GreenStock ERP</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
              </div>
            </div>

            {/* Mock Sidebar + Content */}
            <div className="flex h-[calc(100%-48px)]">
              {/* Sidebar */}
              <div className="w-14 py-3 flex flex-col items-center gap-2" style={{ backgroundColor: colors.neutral.gray100 }}>
                {[true, false, false, false].map((active, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 flex items-center justify-center"
                    style={{
                      backgroundColor: active ? colors.brand.primary : 'transparent',
                      borderRadius: borderRadius.lg,
                    }}
                  >
                    <div
                      className="w-4 h-4"
                      style={{
                        backgroundColor: active ? 'white' : colors.neutral.gray400,
                        borderRadius: borderRadius.md,
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 p-3 space-y-2">
                {/* Stats */}
                <div className="flex gap-2">
                  {[
                    { label: '총 자재', value: '1,247', bg: '#dbeafe' },
                    { label: '발주대기', value: '23', bg: '#fef3c7' },
                    { label: '재고부족', value: '5', bg: '#fee2e2' },
                  ].map((stat, i) => (
                    <div key={i} className="flex-1 p-2" style={{ backgroundColor: stat.bg, borderRadius: borderRadius.lg }}>
                      <p className="text-[7px]" style={{ color: colors.neutral.gray500 }}>{stat.label}</p>
                      <p className="text-sm font-bold" style={{ color: colors.text.primary }}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Table */}
                <div style={{ backgroundColor: colors.neutral.white, border: `1px solid ${colors.neutral.gray200}`, borderRadius: borderRadius.lg }} className="overflow-hidden">
                  <div className="flex text-[7px] p-2 font-medium" style={{ backgroundColor: colors.neutral.gray100, color: colors.neutral.gray500 }}>
                    <span className="flex-1">자재명</span>
                    <span className="w-12 text-right">재고</span>
                    <span className="w-12 text-right">상태</span>
                  </div>
                  {[
                    { name: '방부목 데크재', stock: '450', status: '정상', color: colors.semantic.success },
                    { name: '조경석 (대)', stock: '12', status: '부족', color: colors.semantic.error },
                    { name: '잔디 블록', stock: '890', status: '정상', color: colors.semantic.success },
                    { name: '펜스 포스트', stock: '35', status: '주의', color: colors.semantic.warning },
                  ].map((item, i) => (
                    <div key={i} className="flex text-[8px] p-2 border-t" style={{ borderColor: colors.neutral.gray100 }}>
                      <span className="flex-1" style={{ color: colors.text.primary }}>{item.name}</span>
                      <span className="w-12 text-right" style={{ color: colors.neutral.gray500 }}>{item.stock}</span>
                      <span className="w-12 text-right">
                        <span className="px-1.5 py-0.5 text-[6px] text-white" style={{ backgroundColor: item.color, borderRadius: borderRadius.sm }}>
                          {item.status}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <div className="flex justify-end">
                  <div
                    className="px-3 py-1.5 text-[8px] text-white font-medium"
                    style={{ backgroundColor: colors.brand.primary, borderRadius: borderRadius.lg }}
                  >
                    + 새 발주서 작성
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrochurePageLandscape>
  );
}
