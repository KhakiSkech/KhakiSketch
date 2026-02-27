'use client';

import React from 'react';
import Link from 'next/link';

const pricingPlans = [
  {
    id: 'discovery',
    name: 'Discovery',
    subtitle: '요구사항 정의',
    price: '30',
    priceUnit: '만원부터',
    priceType: 'starting',
    description: '무엇을 만들어야 할지 명확하게 정리합니다',
    features: [
      '요구사항 정의서 제공',
      '기능 범위·일정 명확화',
      '적합한 기술 방향 제안',
      '개발 견적 산출 기준 확보',
    ],
    highlight: '본 계약 시 비용 전액 차감',
    targetTitle: '이런 분께 추천합니다',
    targets: [
      '무엇을 만들어야 할지 아직 정리되지 않은 경우',
      '외주 견적이 제각각이라 판단이 어려운 경우',
      '일정·비용을 사전에 명확히 확정하고 싶은 경우',
    ],
    recommended: true,
    cta: '상담 요청',
    ctaLink: '/contact?type=discovery',
  },
  {
    id: 'homepage',
    name: '기업 홈페이지',
    subtitle: '패키지',
    price: '200',
    priceUnit: '만원~',
    priceType: 'starting',
    description: '깔끔한 기업 소개 웹사이트',
    features: [
      '5~7페이지 구성',
      '반응형 디자인 (PC/모바일)',
      '기본 SEO 적용',
      '문의 폼 연동',
    ],
    note: '관리자 기능, 커스텀 디자인, 추가 페이지는 별도 견적',
    recommended: false,
    cta: '문의하기',
    ctaLink: '/contact',
  },
  {
    id: 'mvp',
    name: 'MVP / 웹·SW 개발',
    subtitle: '맞춤 개발',
    price: null,
    priceUnit: null,
    priceType: 'quote',
    description: '실제 작동하는 제품을 만듭니다',
    features: [
      '기능 범위에 따라 견적 상이',
      'Discovery 이후 정확한 견적 제공',
      '일정·비용 사전 확정',
      '주간 진행 공유 및 피드백 반영',
    ],
    examples: '스타트업 MVP, SaaS, 내부 시스템',
    recommended: false,
    cta: '프로젝트 상담',
    ctaLink: '/contact?type=startup-mvp',
  },
  {
    id: 'automation',
    name: '업무 자동화',
    subtitle: '맞춤 시스템',
    price: null,
    priceUnit: null,
    priceType: 'quote',
    description: '반복 업무를 시스템으로 해결합니다',
    features: [
      '현재 업무 프로세스 분석',
      '자동화 가능 영역 도출',
      'Discovery 이후 정확한 견적 제공',
      '도입 효과 측정 가능',
    ],
    examples: '데이터 수집, 리포트 생성, 알림 시스템',
    recommended: false,
    cta: '프로젝트 상담',
    ctaLink: '/contact?type=business-automation',
  },
];

export default function PricingContent() {
  return (
    <div className="min-h-screen bg-brand-bg pt-24 pb-20">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-brand-secondary font-bold text-sm tracking-widest uppercase">
            Pricing
          </span>
          <h1 className="mt-4 font-bold text-brand-primary text-4xl lg:text-5xl tracking-tight">
            가격 안내
          </h1>
          <p className="mt-6 text-brand-muted text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            Discovery부터 시작하면 범위·일정·비용이 명확해집니다.<br />
            요구사항 정의 후 정확한 견적을 제공합니다.
          </p>
        </div>

        {/* Pricing Flow Indicator */}
        <div className="flex items-center justify-center gap-2 mb-12 text-sm flex-wrap">
          <span className="px-4 py-2 bg-brand-secondary/10 text-brand-secondary font-semibold rounded-full">
            1. Discovery
          </span>
          <svg className="w-5 h-5 text-brand-muted hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="px-4 py-2 bg-gray-100 text-brand-muted font-medium rounded-full">
            2. 견적 확정
          </span>
          <svg className="w-5 h-5 text-brand-muted hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="px-4 py-2 bg-gray-100 text-brand-muted font-medium rounded-full">
            3. 개발 착수
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              id={plan.id}
              className={`relative flex flex-col p-6 lg:p-8 rounded-2xl border transition-all duration-300 hover:shadow-lg scroll-mt-24 ${
                plan.recommended
                  ? 'bg-white border-brand-secondary shadow-md'
                  : 'bg-white border-gray-100 hover:border-brand-secondary/30'
              }`}
            >
              {/* Recommended Badge */}
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-brand-secondary text-white text-xs font-bold rounded-full">
                    추천
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <span className="text-brand-muted text-sm font-medium">
                  {plan.subtitle}
                </span>
                <h3 className="mt-1 font-bold text-brand-primary text-xl lg:text-2xl">
                  {plan.name}
                </h3>
              </div>

              {/* Price */}
              <div className="mb-6">
                {plan.priceType === 'starting' && (
                  <div className="flex items-baseline gap-1">
                    <span className="font-bold text-brand-primary text-3xl lg:text-4xl">
                      {plan.price}
                    </span>
                    <span className="text-brand-muted text-lg">
                      {plan.priceUnit}
                    </span>
                  </div>
                )}
                {plan.priceType === 'quote' && (
                  <div className="flex items-baseline">
                    <span className="font-bold text-brand-primary text-2xl">
                      상담 후 견적
                    </span>
                  </div>
                )}
                <p className="mt-2 text-brand-muted text-sm">
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <ul className="flex-grow space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-brand-text text-sm">
                    <svg className="w-5 h-5 text-brand-secondary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Highlight / Note / Examples / Targets */}
              {plan.highlight && (
                <div className="mb-4 p-3 bg-brand-secondary/10 rounded-lg">
                  <p className="text-brand-secondary text-sm font-semibold text-center">
                    ✓ {plan.highlight}
                  </p>
                </div>
              )}
              {plan.targets && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-brand-primary text-sm font-semibold mb-2">{plan.targetTitle}</p>
                  <ul className="text-brand-muted text-xs space-y-1">
                    {plan.targets.map((target, i) => (
                      <li key={i}>• {target}</li>
                    ))}
                  </ul>
                </div>
              )}
              {plan.note && (
                <p className="mb-4 text-brand-muted text-xs">
                  * {plan.note}
                </p>
              )}
              {plan.examples && (
                <p className="mb-4 text-brand-muted text-xs">
                  예시: {plan.examples}
                </p>
              )}

              {/* CTA Button */}
              <Link
                href={plan.ctaLink}
                className={`w-full py-3 rounded-xl font-bold text-center transition-colors ${
                  plan.recommended
                    ? 'bg-brand-secondary text-white hover:bg-brand-secondary/90'
                    : 'bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 max-w-7xl mx-auto">
          <div className="bg-white p-8 rounded-2xl border border-gray-100">
            <h3 className="font-bold text-brand-primary text-xl mb-6 text-center">
              자주 묻는 질문
            </h3>
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-brand-primary mb-2">
                  왜 Discovery부터 시작하나요?
                </h4>
                <p className="text-brand-muted text-sm leading-relaxed">
                  "무엇을 만들지" 명확하지 않은 상태에서 견적을 내면, 개발 중 범위가 늘어나고 비용·일정이 틀어집니다.
                  Discovery를 통해 요구사항을 정리하면 정확한 견적과 일정을 확정할 수 있습니다.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-brand-primary mb-2">
                  Discovery 비용은 본 계약에서 차감되나요?
                </h4>
                <p className="text-brand-muted text-sm leading-relaxed">
                  네, Discovery 비용은 본 개발 계약 시 전액 차감됩니다.
                  Discovery만 진행하고 개발을 진행하지 않으셔도 요구사항 정의서는 그대로 가져가실 수 있습니다.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-brand-primary mb-2">
                  초기 상담은 무료인가요?
                </h4>
                <p className="text-brand-muted text-sm leading-relaxed">
                  네, 15~20분 초기 전화/화상 상담은 무료입니다.
                  프로젝트 개요를 파악하고, Discovery가 필요한지 여부를 판단합니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-16 text-center">
          <p className="text-brand-muted mb-6">
            프로젝트에 대해 이야기 나눠보실까요?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary text-white font-bold text-lg rounded-xl hover:bg-brand-primary/90 transition-colors shadow-lg"
          >
            무료 상담 요청
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
