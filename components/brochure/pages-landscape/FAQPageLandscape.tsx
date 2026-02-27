import React from 'react';
import BrochurePageLandscape from '../BrochurePageLandscape';
import { colors, borderRadius } from '../brochure-design-system';

export default function FAQPageLandscape() {
  // 순서 재배치: 가격 → 일정 → 유지보수 → 소유권 → 소통 → 범위
  const faqs = [
    {
      icon: '💰',
      question: '견적은 어떻게 산정되나요?',
      answer: '기능 복잡도와 개발 기간을 기준으로 산정됩니다. 초기 상담 후 기능 명세서를 바탕으로 정확한 견적을 제안드립니다.',
    },
    {
      icon: '⏱️',
      question: '개발 기간은 어느 정도 걸리나요?',
      answer: 'MVP 기준 3~4개월, 간단한 웹사이트는 1~2개월 내 완료됩니다.',
    },
    {
      icon: '🔧',
      question: '유지보수는 어떻게 진행되나요?',
      answer: '배포 후 1개월간 버그 수정 무상 지원. 이후 장기 유지보수는 별도 계약으로 진행 가능합니다.',
    },
    {
      icon: '📁',
      question: '소스 코드는 넘겨받을 수 있나요?',
      answer: '네, 모든 소스 코드와 문서를 제공합니다. 다른 개발자가 이어받을 수 있습니다.',
    },
    {
      icon: '💬',
      question: '원격 협업도 가능한가요?',
      answer: 'Slack과 Notion을 통해 원격으로 투명하게 협업합니다.',
    },
    {
      icon: '🎨',
      question: '디자인도 함께 해주시나요?',
      answer: '개발에 집중합니다. 디자인은 고객이 준비하시거나, 필요 시 파트너를 연결해 드립니다.',
    },
  ];

  return (
    <BrochurePageLandscape pageNumber={15} bgColor="white">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <span
              className="font-bold text-xs tracking-wider uppercase"
              style={{ color: colors.brand.primary }}
            >
              FAQ
            </span>
            <h2
              className="text-3xl font-bold mt-1"
              style={{ color: colors.text.primary }}
            >
              자주 묻는 질문
            </h2>
          </div>
          <p className="text-sm" style={{ color: colors.text.secondary }}>
            궁금한 점이 있으시면 언제든 문의해 주세요.
          </p>
        </div>

        {/* FAQ Grid - 2 columns */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="p-4 flex items-start gap-3"
              style={{
                backgroundColor: colors.neutral.offWhite,
                borderRadius: borderRadius.xl,
              }}
            >
              <div
                className="w-8 h-8 flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: colors.brand.light,
                  borderRadius: borderRadius.lg,
                }}
              >
                <span className="text-lg">{faq.icon}</span>
              </div>
              <div className="flex-1">
                <h3
                  className="font-bold text-sm mb-1"
                  style={{ color: colors.text.primary }}
                >
                  {faq.question}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: colors.text.secondary }}
                >
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BrochurePageLandscape>
  );
}
