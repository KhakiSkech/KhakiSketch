import React from 'react';
import BrochurePageLandscape from '../BrochurePageLandscape';
import { colors, borderRadius, shadows } from '../brochure-design-system';

export default function ProblemPageLandscape() {
  const problems = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.semantic.error} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="12" y1="9" x2="12.01" y2="9" />
        </svg>
      ),
      title: '기획서 없으면 개발 불가',
      desc: '고객이 직접 모든 것을 결정해야 함'
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.semantic.error} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
      title: '비즈니스 로직 이해 없이 코드 작성',
      desc: '요구사항만 받아서 그대로 구현'
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.semantic.error} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      ),
      title: '유지보수 고려 없는 일회성 코드',
      desc: '납품 후 수정이 거의 불가능'
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.semantic.error} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="18" y1="8" x2="23" y2="13" />
          <line x1="23" y1="8" x2="18" y2="13" />
        </svg>
      ),
      title: '개발자와 직접 소통 불가',
      desc: '매니저를 통한 전달 과정에서 왜곡'
    },
  ];

  return (
    <BrochurePageLandscape pageNumber={2} bgColor="light">
      <div className="h-full flex">
        {/* Left Section */}
        <div className="w-2/5 h-full flex flex-col justify-center pr-10">
          <span
            className="font-bold text-xs tracking-wider uppercase mb-3"
            style={{ color: colors.brand.primary }}
          >
            The Problem
          </span>
          <h2
            className="text-3xl font-bold leading-tight mb-5"
            style={{ color: colors.text.primary }}
          >
            왜 많은 프로젝트가<br />실패할까요?
          </h2>

          {/* Quote Cards - 따옴표 제거, CSS 스타일 적용 */}
          <div className="space-y-3 mb-6">
            <div
              className="px-4 py-3"
              style={{
                backgroundColor: 'rgba(255,255,255,0.6)',
                borderLeft: `4px solid ${colors.semantic.error}4D`,
                borderRadius: `0 ${borderRadius.lg} ${borderRadius.lg} 0`,
              }}
            >
              <p className="text-sm" style={{ color: colors.text.secondary }}>
                <span className="font-bold" style={{ color: colors.semantic.error }}>디자인만 예쁘고</span> 작동은 안 해요.
              </p>
            </div>
            <div
              className="px-4 py-3"
              style={{
                backgroundColor: 'rgba(255,255,255,0.6)',
                borderLeft: `4px solid ${colors.semantic.error}4D`,
                borderRadius: `0 ${borderRadius.lg} ${borderRadius.lg} 0`,
              }}
            >
              <p className="text-sm" style={{ color: colors.text.secondary }}>
                <span className="font-bold" style={{ color: colors.semantic.error }}>개발자와 소통</span>이 너무 힘들어요.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.brand.dark }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.brand.primary} strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: colors.text.secondary }}>
              대부분의 외주 실패는<br />
              <strong style={{ color: colors.brand.primary }}>비즈니스 이해도 부족</strong>에서 시작됩니다.
            </p>
          </div>
        </div>

        {/* Right Section - Problem Cards */}
        <div className="w-3/5 h-full flex items-center">
          <div className="grid grid-cols-2 gap-4 w-full">
            {problems.map((problem, index) => (
              <div
                key={index}
                className="p-5"
                style={{
                  backgroundColor: colors.neutral.white,
                  borderRadius: borderRadius['2xl'],
                  boxShadow: shadows.lg,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: colors.semantic.errorLight,
                      borderRadius: borderRadius.xl,
                    }}
                  >
                    {problem.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm mb-2" style={{ color: colors.text.primary }}>{problem.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: colors.text.secondary }}>{problem.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrochurePageLandscape>
  );
}
