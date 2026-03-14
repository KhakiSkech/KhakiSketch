'use client';

import { logger } from '@/lib/logger';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { ANIMATION } from '@/lib/animation-config';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { getStats } from '@/lib/firestore-site-settings';

// 정적 fallback 데이터 (firestore-site-settings.ts DEFAULT_STATS와 동기화)
const STATIC_STATS = [
  { value: 47, suffix: '+', label: '완료 프로젝트' },
  { value: 98, suffix: '%', label: '고객 만족도' },
  { value: 73, suffix: '%', label: '재계약/추천률' },
  { value: 3.2, suffix: '개월', label: '평균 납기' },
];

function StatItem({ value, suffix, label, index, reducedMotion }: {
  value: number;
  suffix: string;
  label: string;
  index: number;
  reducedMotion?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest));

  useEffect(() => {
    if (isInView) {
      if (reducedMotion) {
        count.set(value);
        return;
      }
      const controls = animate(count, value, {
        duration: 2.5,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [isInView, value, count, reducedMotion]);

  return (
    <motion.div
      ref={ref}
      initial={reducedMotion ? false : { opacity: 0, y: 30 }}
      animate={reducedMotion ? { opacity: 1, y: 0 } : undefined}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={reducedMotion ? undefined : { once: true, margin: '-40px' }}
      transition={reducedMotion ? { duration: 0 } : {
        duration: ANIMATION.duration.normal,
        ease: ANIMATION.easing,
        delay: index * 0.1
      }}
      className="relative flex flex-col items-center gap-4 p-6 lg:p-8 group"
    >
      {/* Number */}
      <div className="flex items-baseline gap-1">
        <motion.span
          className="font-bold text-5xl lg:text-6xl text-brand-primary tabular-nums"
        >
          {rounded}
        </motion.span>
        <motion.span
          className="font-bold text-3xl lg:text-4xl text-brand-secondary"
          initial={reducedMotion ? false : { opacity: 0, x: -10 }}
          animate={reducedMotion ? { opacity: 1, x: 0 } : undefined}
          whileInView={reducedMotion ? undefined : { opacity: 1, x: 0 }}
          viewport={reducedMotion ? undefined : { once: true, margin: '-40px' }}
          transition={reducedMotion ? { duration: 0 } : { delay: 0.5, duration: 0.4 }}
        >
          {suffix}
        </motion.span>
      </div>

      {/* Label */}
      <motion.span
        className="text-brand-muted text-base lg:text-lg font-medium text-center"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={reducedMotion ? { opacity: 1 } : undefined}
        whileInView={reducedMotion ? undefined : { opacity: 1 }}
        viewport={reducedMotion ? undefined : { once: true, margin: '-40px' }}
        transition={reducedMotion ? { duration: 0 } : { delay: 0.3 + index * 0.1 }}
      >
        {label}
      </motion.span>

      {/* Subtle underline decoration */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 h-0.5 bg-brand-secondary/40 rounded-full"
        initial={reducedMotion ? { width: '40%' } : { width: 0 }}
        animate={reducedMotion ? { width: '40%' } : undefined}
        whileInView={reducedMotion ? undefined : { width: '40%' }}
        viewport={reducedMotion ? undefined : { once: true, margin: '-40px' }}
        transition={reducedMotion ? { duration: 0 } : { delay: 0.5 + index * 0.1, duration: 0.5 }}
      />
    </motion.div>
  );
}

export default function Stats() {
  const [stats, setStats] = useState(STATIC_STATS);
  const [isLoading, setIsLoading] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getStats();
        if (data) {
          setStats([
            { value: data.completedProjects ?? 47, suffix: '+', label: '완료 프로젝트' },
            { value: data.customerSatisfaction ?? 98, suffix: '%', label: '고객 만족도' },
            { value: data.repeatOrderRate ?? 73, suffix: '%', label: '재계약/추천률' },
            { value: 3.2, suffix: '개월', label: '평균 납기' },
          ]);
        }
      } catch (error) {
        logger.warn('Stats 로드 실패, 정적 데이터 사용:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  if (isLoading) {
    return (
      <section className="w-full bg-brand-bg py-14 lg:py-20 relative overflow-hidden" aria-busy="true">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-brand-primary/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-brand-bg py-14 lg:py-20 relative overflow-hidden">
      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-brand-secondary opacity-[0.04] blur-[200px] pointer-events-none" />
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(38, 49, 34, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(38, 49, 34, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="flex flex-col items-center text-center gap-4 mb-12 lg:mb-16"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          animate={prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={prefersReducedMotion ? undefined : { once: true, margin: '-60px' }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5 }}
        >
          <span className="text-brand-secondary font-bold text-sm tracking-widest uppercase">
            Track Record
          </span>
          <h2 className="font-bold text-3xl lg:text-4xl text-brand-primary tracking-tight">
            숫자로 보는 신뢰
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={prefersReducedMotion ? { opacity: 1 } : undefined}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
          viewport={prefersReducedMotion ? undefined : { once: true, margin: '-40px' }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4 }}
        >
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              index={index}
              reducedMotion={prefersReducedMotion}
            />
          ))}
        </motion.div>

        {/* Context note */}
        <motion.p
          className="text-center text-brand-muted text-sm mt-8"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={prefersReducedMotion ? { opacity: 1 } : undefined}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
          viewport={prefersReducedMotion ? undefined : { once: true }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, delay: 0.8 }}
        >
          * 2024~2026년 누적 기준, 프로젝트 완료 후 고객 설문 결과
        </motion.p>

        {/* ── Target Audience Personas ── */}
        <div className="mt-10 lg:mt-12">
          <motion.h3
            className="text-center font-bold text-2xl lg:text-3xl text-brand-primary tracking-tight mb-8 lg:mb-10"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5 }}
          >
            이런 상황이라면, 저희가 도와드릴 수 있습니다
          </motion.h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                pain: '아이디어는 넘치는데, 개발은 어디서부터?',
                solution: 'Discovery 세션으로 기획서까지 함께 만들어드립니다',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3" />
                  </svg>
                ),
                pain: '프리랜서한테 맡겼는데, 연락이 끊겼다?',
                solution: '주간 리포트 + 카톡 실시간 소통으로 불안 제로',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                ),
                pain: '지원사업 선정! 그런데 개발은 누가?',
                solution: '예비창업패키지·초기창업 10건+ 수행 경험',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                pain: '매일 3시간 엑셀 작업, 지겹지 않으세요?',
                solution: '수작업 3시간 → 자동화 10분으로 단축',
              },
            ].map((persona, i) => (
              <motion.div
                key={i}
                className="flex flex-col gap-2 px-6 py-5 rounded-2xl bg-white border border-gray-100 shadow-sm hover:border-brand-secondary/30 hover:shadow-md transition-all duration-300"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, delay: i * 0.08 }}
              >
                <div className="flex items-center gap-3">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    {persona.icon}
                  </div>
                  <span className="text-brand-text text-[15px] lg:text-base leading-snug break-keep font-bold">
                    {persona.pain}
                  </span>
                </div>
                <span className="text-brand-secondary text-sm font-medium pl-[52px]">
                  → {persona.solution}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
