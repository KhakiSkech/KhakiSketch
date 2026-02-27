import React from 'react';
import BrochurePageLandscape from '../BrochurePageLandscape';
import { colors, borderRadius, shadows } from '../brochure-design-system';

export default function DifferencePageLandscape() {
  const differences = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.brand.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      ),
      title: 'Discovery 세션으로 기획부터 참여',
      desc: '모호한 아이디어를 구체화하고, 핵심 기능과 예산/일정을 함께 확정합니다.'
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.brand.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: 'User Flow 기반의 탄탄한 설계',
      desc: '기능이 아닌 사용자 흐름 중심으로 설계하여, 실제로 쓰이는 제품을 만듭니다.'
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.brand.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      title: '확장성을 고려한 모듈형 개발',
      desc: '유지보수가 쉽고, 다른 개발자가 이어받을 수 있는 구조로 개발합니다.'
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.brand.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M8 10h.01" />
          <path d="M12 10h.01" />
          <path d="M16 10h.01" />
        </svg>
      ),
      title: '컴공 전공 대표 개발자와 직접 소통',
      desc: '중간 단계 없이, 기술적 판단이 가능한 담당자와 직접 협의합니다.'
    },
  ];

  return (
    <BrochurePageLandscape pageNumber={3} bgColor="white">
      <div className="h-full flex">
        {/* Left Section */}
        <div className="w-2/5 h-full flex flex-col justify-center pr-10">
          <span
            className="font-bold text-xs tracking-wider uppercase mb-3"
            style={{ color: colors.brand.primary }}
          >
            Our Difference
          </span>
          <h2
            className="text-3xl font-bold leading-tight mb-5"
            style={{ color: colors.text.primary }}
          >
            우리와 일하면<br />무엇이 다른가
          </h2>

          {/* Value Proposition - 따옴표 제거, CSS 스타일 적용 */}
          <div
            className="p-5 mb-5"
            style={{
              backgroundColor: colors.brand.dark,
              borderRadius: borderRadius['2xl'],
            }}
          >
            <p className="text-sm leading-relaxed" style={{ color: colors.text.inverseSecondary }}>
              비즈니스 파트너처럼<br />
              <span className="font-bold" style={{ color: colors.brand.primary }}>함께 고민합니다.</span>
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <div
              className="flex-1 text-center p-3"
              style={{
                backgroundColor: colors.neutral.offWhite,
                borderRadius: borderRadius.xl,
              }}
            >
              <p className="text-2xl font-bold" style={{ color: colors.brand.primary }}>100%</p>
              <p className="text-[10px]" style={{ color: colors.text.secondary }}>직접 소통</p>
            </div>
            <div
              className="flex-1 text-center p-3"
              style={{
                backgroundColor: colors.neutral.offWhite,
                borderRadius: borderRadius.xl,
              }}
            >
              <p className="text-2xl font-bold" style={{ color: colors.brand.primary }}>2주</p>
              <p className="text-[10px]" style={{ color: colors.text.secondary }}>Discovery 기간</p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-3/5 h-full flex items-center">
          <div className="grid grid-cols-2 gap-4 w-full">
            {differences.map((item, index) => (
              <div
                key={index}
                className="p-5 relative overflow-hidden"
                style={{
                  backgroundColor: colors.neutral.offWhite,
                  borderRadius: borderRadius['2xl'],
                  boxShadow: shadows.card,
                }}
              >
                {/* Number Badge */}
                <div
                  className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.brand.light }}
                >
                  <span className="text-xs font-bold" style={{ color: colors.brand.primary }}>{index + 1}</span>
                </div>

                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: colors.brand.light,
                      borderRadius: borderRadius.xl,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 pr-6">
                    <h3 className="font-bold text-sm mb-2" style={{ color: colors.text.primary }}>{item.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: colors.text.secondary }}>{item.desc}</p>
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
