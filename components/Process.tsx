'use client';

import React from 'react';
import Link from 'next/link';
import ScrollDrivenSlider from './ui/ScrollDrivenSlider';

const steps = [
  {
    number: '01',
    title: 'Discovery & 설계',
    description:
      '모호한 아이디어를 구체화하고, 핵심 기능과 예산·일정을 확정합니다.',
    details: [
      '요구사항 인터뷰 및 분석',
      '핵심 기능 도출 (Must / Nice-to-have)',
      '기술 스택 선정 및 예산·일정 확정',
      '와이어프레임 / 화면 설계',
    ],
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    number: '02',
    title: '디자인 & 개발',
    description:
      '설계를 바탕으로 구현하며, 주간 리포트로 상황을 투명하게 공유합니다.',
    details: [
      'UI/UX 디자인 → 개발 병행',
      '주간 진행 리포트 공유',
      '중간 데모를 통한 피드백 반영',
      '코드 리뷰 및 품질 관리',
    ],
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    number: '03',
    title: '테스트 & 배포',
    description:
      '테스트 및 QA를 거쳐 결함을 제거하고, 안정적인 운영 환경에 배포합니다.',
    details: [
      '기능 테스트 및 버그 수정',
      '성능 최적화 (로딩 속도, SEO)',
      '실서버 배포 및 도메인 연결',
      '운영 매뉴얼 및 교육',
    ],
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: '04',
    title: '안정화 & 유지보수',
    description:
      '배포 후 1개월간 무상 유지보수 지원, 이후 전문적인 관리 계약이 가능합니다.',
    details: [
      '1개월 무상 유지보수 포함',
      '버그 및 긴급 이슈 대응',
      '기능 추가 및 개선 협의',
      '장기 유지보수 계약 가능',
    ],
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
];

const ProcessCard = ({ step }: { step: typeof steps[number] }) => (
  <div className="bg-white rounded-2xl p-5 lg:p-10 shadow-lg border border-gray-100 h-full flex flex-col">
    {/* Step label */}
    <div className="flex items-center gap-3 mb-4 lg:mb-8">
      <span className="text-brand-secondary font-mono text-xs font-bold tracking-widest uppercase">
        Step
      </span>
      <span className="text-brand-primary font-mono text-3xl lg:text-4xl font-bold">
        {step.number}
      </span>
    </div>

    {/* Icon */}
    <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-2xl bg-brand-primary flex items-center justify-center mb-4 lg:mb-6 shadow-md shadow-brand-primary/20">
      <span className="text-white">{step.icon}</span>
    </div>

    {/* Title & description */}
    <h3 className="font-bold text-xl lg:text-3xl text-brand-primary tracking-tight mb-2 lg:mb-3">
      {step.title}
    </h3>
    <p className="text-brand-muted text-base lg:text-lg leading-relaxed break-keep mb-4 lg:mb-8">
      {step.description}
    </p>

    {/* Details list */}
    <div className="flex flex-col gap-2 lg:gap-3 mt-auto">
      {step.details.map((detail, i) => (
        <div key={i} className="flex gap-3 items-start">
          <svg
            width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="3" strokeLinecap="round"
            strokeLinejoin="round" className="text-brand-secondary shrink-0 mt-0.5"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="font-medium text-brand-primary text-sm leading-snug">
            {detail}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default function Process() {
  const header = (
    <div className="flex flex-col gap-4">
      <span className="text-brand-secondary font-bold text-sm tracking-widest uppercase">
        Work Process
      </span>
      <h2 className="font-bold text-3xl lg:text-4xl text-brand-primary tracking-tight leading-tight">
        투명한 과정, 예측 가능한 결과.
      </h2>
      <p className="text-lg text-brand-muted leading-relaxed break-keep">
        모든 과정은 클라이언트와 투명하게 공유됩니다.
      </p>
    </div>
  );

  const footer = (
    <Link
      href="/process"
      className="group inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl border-2 border-brand-primary text-brand-primary font-bold text-base hover:bg-brand-primary hover:text-white hover:-translate-y-0.5 active:scale-[0.98] transition-all"
    >
      프로세스 자세히 보기
      <svg
        className="w-5 h-5 transition-transform group-hover:translate-x-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </Link>
  );

  return (
    <ScrollDrivenSlider
      id="process"
      bgColor="bg-white"
      header={header}
      cards={steps.map((step, i) => (
        <ProcessCard key={i} step={step} />
      ))}
      footer={footer}
      scrollHeight={2.5}
    />
  );
}
