import React from 'react';
import BrochurePageLandscape from '../BrochurePageLandscape';
import { colors, borderRadius, shadows } from '../brochure-design-system';

export default function TargetPageLandscape() {
  const situations = [
    {
      emoji: '📊',
      situation: '투자 IR이 2달 후인데...',
      painPoint: 'MVP 없이 피칭이 어려워요',
      solution: '핵심 기능만 담은 MVP를 빠르게 만들어 드립니다',
      tags: ['예비창업자', '초기 스타트업'],
    },
    {
      emoji: '📁',
      situation: '매번 엑셀 파일이 꼬여요',
      painPoint: '수기 업무가 너무 비효율적이에요',
      solution: '웹 기반 시스템으로 업무를 자동화합니다',
      tags: ['성장하는 기업', '서비스업'],
    },
    {
      emoji: '🔧',
      situation: '노션·시트로는 한계가...',
      painPoint: '우리 방식에 딱 맞는 도구가 없어요',
      solution: '팀에 맞춤화된 사내 전용 시스템을 구축합니다',
      tags: ['운영 효율화', '내부 도구'],
    },
  ];

  return (
    <BrochurePageLandscape pageNumber={4} bgColor="white">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <span className="font-bold text-sm tracking-wider uppercase" style={{ color: colors.brand.primary }}>
            Target Customer
          </span>
          <h2 className="text-3xl font-bold mt-2" style={{ color: colors.text.primary }}>
            지금 이런 고민 중이신가요?
          </h2>
          <p className="text-sm mt-2" style={{ color: colors.text.secondary }}>
            아래 상황에 해당하시면, 저희가 도울 수 있습니다.
          </p>
        </div>

        {/* Situation Cards - Horizontal Layout */}
        <div className="flex-1 flex gap-6">
          {situations.map((item, index) => (
            <div
              key={index}
              className="flex-1 p-6 flex flex-col relative"
              style={{
                backgroundColor: colors.neutral.offWhite,
                borderRadius: borderRadius['2xl'],
                boxShadow: shadows.md,
                borderTop: `4px solid ${colors.brand.primary}`,
              }}
            >
              {/* Emoji */}
              <div
                className="w-14 h-14 flex items-center justify-center mb-4"
                style={{
                  backgroundColor: colors.brand.light,
                  borderRadius: borderRadius.xl,
                }}
              >
                <span className="text-3xl">{item.emoji}</span>
              </div>

              {/* Content */}
              <h3 className="font-bold text-lg mb-2" style={{ color: colors.text.primary }}>
                {item.situation}
              </h3>
              <p className="text-sm mb-3" style={{ color: colors.text.tertiary }}>
                {item.painPoint}
              </p>
              <p className="text-sm font-medium mb-4" style={{ color: colors.brand.primary }}>
                → {item.solution}
              </p>

              {/* Tags */}
              <div className="flex gap-2 mt-auto">
                {item.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: colors.neutral.white,
                      color: colors.text.secondary,
                      borderRadius: borderRadius.full,
                      border: `1px solid ${colors.neutral.gray200}`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </BrochurePageLandscape>
  );
}
