import React from 'react';
import BrochurePageLandscape from '../BrochurePageLandscape';
import { colors, borderRadius, shadows } from '../brochure-design-system';

export default function Project3PageLandscape() {
  return (
    <BrochurePageLandscape pageNumber={8} bgColor="white">
      <div className="h-full flex gap-8">
        {/* Left - App Mockup */}
        <div className="w-2/5 h-full flex items-center justify-center">
          <div
            className="w-full h-[85%] overflow-hidden"
            style={{
              backgroundColor: '#f8fafc',
              border: `1px solid ${colors.neutral.gray200}`,
              borderRadius: borderRadius['2xl'],
              boxShadow: shadows.xl,
            }}
          >
            {/* Mock Header */}
            <div
              className="h-12 flex items-center justify-between px-4"
              style={{ backgroundColor: colors.brand.primary }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 flex items-center justify-center"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: borderRadius.md }}
                >
                  <span className="text-white text-xs font-bold">N</span>
                </div>
                <span className="text-white text-sm font-medium">NailBook</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-white/20" />
            </div>

            {/* Calendar Content */}
            <div className="p-4">
              {/* Week Header */}
              <div className="flex gap-2 mb-3">
                {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
                  <div
                    key={i}
                    className="flex-1 text-center text-[10px] font-medium py-1"
                    style={{ color: i === 0 ? colors.semantic.error : colors.text.secondary }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              <div className="space-y-2">
                {[
                  { time: '10:00', name: '김OO', service: '젤네일 풀세트', color: colors.brand.primary },
                  { time: '11:30', name: '이OO', service: '손톱케어', color: colors.brand.medium },
                  { time: '14:00', name: '박OO', service: '네일아트', color: colors.brand.primary },
                  { time: '15:30', name: '최OO', service: '패디큐어', color: colors.brand.medium },
                  { time: '17:00', name: '빈 시간', service: '예약 가능', color: colors.neutral.gray300 },
                ].map((slot, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 text-xs"
                    style={{
                      backgroundColor: slot.color === colors.neutral.gray300 ? 'transparent' : `${slot.color}15`,
                      borderLeft: `3px solid ${slot.color}`,
                      borderRadius: borderRadius.md,
                    }}
                  >
                    <span className="font-medium w-12" style={{ color: colors.text.primary }}>{slot.time}</span>
                    <span style={{ color: colors.text.secondary }}>{slot.name}</span>
                    <span className="ml-auto" style={{ color: colors.text.muted }}>{slot.service}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right - Content */}
        <div className="w-3/5 h-full flex flex-col justify-center">
          <span className="font-bold text-xs tracking-wider uppercase mb-2" style={{ color: colors.brand.primary }}>
            CASE STUDY #3
          </span>
          <h2 className="text-3xl font-bold mb-3 leading-tight" style={{ color: colors.text.primary }}>
            네일샵 예약<br />관리 시스템
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
                <span className="font-bold">카톡으로 예약</span>을 받다 보니 더블부킹 발생.
                시술별 소요 시간이 달라 <span className="font-bold">수기로 시간표 관리</span>.
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
                <span className="font-bold">실시간 예약 캘린더</span>로 빈 시간만 노출.
                예약 알림 <span className="font-bold">카톡 자동 발송</span>.
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
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <p className="text-[10px]" style={{ color: colors.text.muted }}>Tech Stack</p>
                <p className="text-xs font-medium" style={{ color: colors.text.primary }}>Next.js · Supabase · 카카오 API</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 flex items-center justify-center"
                style={{ backgroundColor: colors.brand.primary, borderRadius: borderRadius.lg }}
              >
                <span className="text-white font-bold text-sm">0건</span>
              </div>
              <div>
                <p className="text-[10px]" style={{ color: colors.text.muted }}>Result</p>
                <p className="text-xs font-medium" style={{ color: colors.text.primary }}>더블부킹 제로</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrochurePageLandscape>
  );
}
