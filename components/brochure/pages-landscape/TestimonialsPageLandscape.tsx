import React from 'react';
import BrochurePageLandscape from '../BrochurePageLandscape';
import { colors, borderRadius, shadows } from '../brochure-design-system';

export default function TestimonialsPageLandscape() {
  const testimonials = [
    {
      quote: '엑셀로 3년 넘게 관리하던 업무를 웹 시스템으로 전환했는데, 이제 직원 누구나 쉽게 사용할 수 있게 되었습니다.',
      author: '김OO 대표',
      company: '조경 시공업체',
      highlight: '업무 효율 50% 향상',
    },
    {
      quote: '창업 초기에 MVP 개발을 맡겼는데, 예산 내에서 핵심 기능에 집중해 빠르게 만들어주셨습니다.',
      author: '이OO CTO',
      company: '핀테크 스타트업',
      highlight: '3개월 만에 MVP 런칭',
    },
    {
      // 따옴표 제거 - "우리 방식" -> 우리 방식
      quote: '기존 SaaS로는 우리 팀 업무 방식을 담을 수 없었는데, 맞춤 시스템으로 우리 방식대로 일할 수 있게 되었습니다.',
      author: '박OO 팀장',
      company: '투자운용사',
      highlight: '리포팅 시간 80% 단축',
    },
  ];

  return (
    <BrochurePageLandscape pageNumber={14} bgColor="light">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <span
              className="font-bold text-xs tracking-wider uppercase"
              style={{ color: colors.brand.primary }}
            >
              Testimonials
            </span>
            <h2
              className="text-3xl font-bold mt-1"
              style={{ color: colors.text.primary }}
            >
              고객들의 이야기
            </h2>
          </div>
          <p className="text-sm" style={{ color: colors.text.secondary }}>
            함께 일한 분들의 솔직한 후기입니다.
          </p>
        </div>

        {/* Testimonial Cards - Horizontal */}
        <div className="flex-1 flex gap-5">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex-1 p-6 flex flex-col relative"
              style={{
                backgroundColor: colors.neutral.white,
                borderRadius: borderRadius['2xl'],
                boxShadow: shadows.lg,
              }}
            >
              {/* Quote Icon */}
              <div
                className="absolute -top-3 left-6 w-10 h-10 flex items-center justify-center"
                style={{
                  backgroundColor: colors.brand.primary,
                  borderRadius: borderRadius.xl,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Quote - 고객 후기는 인용 형태로 유지하되 따옴표 없이 */}
              <p
                className="text-sm leading-relaxed flex-1 mt-4"
                style={{ color: colors.text.secondary }}
              >
                {testimonial.quote}
              </p>

              {/* Author & Highlight */}
              <div className="pt-4 mt-auto" style={{ borderTop: `1px solid ${colors.neutral.gray200}` }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm" style={{ color: colors.text.primary }}>
                      {testimonial.author}
                    </p>
                    <p className="text-xs" style={{ color: colors.text.muted }}>
                      {testimonial.company}
                    </p>
                  </div>
                  <div
                    className="px-3 py-1.5 text-xs font-medium"
                    style={{
                      backgroundColor: colors.brand.light,
                      color: colors.brand.primary,
                      borderRadius: borderRadius.full,
                    }}
                  >
                    {testimonial.highlight}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BrochurePageLandscape>
  );
}
