import React from 'react';
import BrochurePageLandscape from '../BrochurePageLandscape';
import { colors, borderRadius, shadows } from '../brochure-design-system';

export default function TrustPageLandscape() {
  const trustPoints = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.brand.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      title: '문서화된 코드',
      desc: '단일 담당자에 의존하지 않습니다. 모든 코드와 구조는 문서화되어 있어, 다른 개발자가 언제든 이어받을 수 있습니다.',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.brand.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 9.9-1" />
        </svg>
      ),
      title: '종속 없는 구조',
      desc: '외주 종료 후에도 고객이 자유롭게 코드를 활용할 수 있습니다. 특정 업체에 종속되지 않는 표준 기술을 사용합니다.',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.brand.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: '컴공 전공 개발자 2인 운영',
      desc: '기술적 판단이 가능한 전문가가 직접 운영합니다. 중간 단계 없이 기술 문제를 즉시 해결합니다.',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.brand.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
      title: '실제 사용되는 제품만',
      // 따옴표 제거
      desc: '직접 써도 납득되는 제품만 고객에게 제안합니다. 보여주기용이 아닌 실무용 제품을 만듭니다.',
    },
  ];

  return (
    <BrochurePageLandscape pageNumber={13} bgColor="light">
      <div className="h-full flex gap-10">
        {/* Left Section */}
        <div className="w-2/5 h-full flex flex-col justify-center">
          <span
            className="font-bold text-xs tracking-wider uppercase mb-3"
            style={{ color: colors.brand.primary }}
          >
            Why Trust Us
          </span>
          <h2
            className="text-3xl font-bold leading-tight mb-4"
            style={{ color: colors.text.primary }}
          >
            왜 우리를 선택해도<br />안전한가
          </h2>
          <p className="text-base leading-relaxed mb-6" style={{ color: colors.text.secondary }}>
            발주처가 가장 두려워하는 리스크를 제거합니다.
          </p>

          {/* Stats */}
          <div className="flex gap-6">
            {[
              { value: '100%', label: '코드 문서화율' },
              { value: '2인', label: '전문 개발자' },
              { value: '0', label: '종속 리스크' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold" style={{ color: colors.brand.primary }}>{stat.value}</p>
                <p className="text-xs" style={{ color: colors.text.secondary }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Trust Points */}
        <div className="w-3/5 h-full flex items-center">
          <div className="grid grid-cols-2 gap-4 w-full">
            {trustPoints.map((point, index) => (
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
                    className="w-12 h-12 flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: colors.brand.light,
                      borderRadius: borderRadius.xl,
                    }}
                  >
                    {point.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm mb-2" style={{ color: colors.text.primary }}>{point.title}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: colors.text.secondary }}>{point.desc}</p>
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
