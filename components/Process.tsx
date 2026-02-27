'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import ScrollReveal from './ui/ScrollReveal';
import { ANIMATION } from '@/lib/animation-config';

const steps = [
  {
    number: "01",
    title: "Discovery & 설계",
    description: "모호한 아이디어를 구체화하고,\n핵심 기능과 예산/일정을 확정합니다.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "디자인 & 개발",
    description: "설계를 바탕으로 구현하며,\n주간 리포트로 상황을 투명하게 공유합니다.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "테스트 & 배포",
    description: "테스트 및 QA를 거쳐 결함을 제거하고,\n안정적인 운영 환경에 배포합니다.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "안정화 & 유지보수",
    description: "배포 후 1개월간 무상 유지보수 지원,\n이후 전문적인 관리 계약이 가능합니다.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  }
];

// Step Card Component - Simplified, no infinite animations
function StepCard({ step, index, isInView }: { step: typeof steps[0]; index: number; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: ANIMATION.easing
      }}
      className="flex flex-col gap-6 bg-white h-full group relative"
    >
      {/* Step Icon - Clean, no pulse */}
      <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg bg-brand-primary text-white shadow-lg shadow-brand-primary/20 group-hover:shadow-xl group-hover:shadow-brand-primary/30 transition-shadow duration-300">
        {step.icon}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="text-brand-secondary font-mono text-sm font-bold opacity-60">
            {step.number}
          </span>
          <h3 className="font-bold text-2xl text-brand-primary group-hover:text-brand-secondary transition-colors duration-300">
            {step.title}
          </h3>
        </div>
        <p className="text-brand-muted text-lg leading-relaxed whitespace-pre-wrap break-keep">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  // once: true prevents flickering from re-triggering animations
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  return (
    <section ref={sectionRef} className="bg-white w-full py-20 lg:py-28 overflow-hidden" id="process">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col gap-16 lg:gap-24">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <ScrollReveal>
            <div className="flex flex-col gap-4">
              <span className="text-brand-secondary font-bold tracking-wider uppercase">Work Process</span>
              <h2 className="font-bold text-4xl lg:text-5xl text-brand-primary tracking-tight leading-tight">
                투명한 과정,<br />예측 가능한 결과.
              </h2>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="text-xl text-brand-muted leading-relaxed max-w-md break-keep">
              모든 과정은 클라이언트와 투명하게 공유됩니다.<br />
              전화, 문자, 카카오톡 등 익숙한 방식으로 소통합니다.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative">
          {/* Loop Steps */}
          {steps.map((step, index) => (
            <StepCard
              key={index}
              step={step}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>

        <ScrollReveal delay={600}>
          <div className="flex justify-center mt-8">
            <Link
              href="/process"
              className="group inline-flex items-center justify-center gap-3 px-10 py-4 rounded-xl border-2 border-brand-primary text-brand-primary font-bold text-lg hover:bg-brand-primary hover:text-white hover:-translate-y-0.5 active:scale-[0.98] transition-all"
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
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
