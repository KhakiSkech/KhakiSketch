'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function MidCta() {
  const isReducedMotion = useReducedMotion();

  return (
    <section className="w-full bg-brand-primary py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h2 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
                내 프로젝트, 어떻게 시작해야 할지 궁금하신가요?
              </h2>
              <p className="text-white/70 text-sm lg:text-base mt-2">
                15분 무료 상담으로 방향성과 예산을 바로 확인하세요. 의무 계약 없음.
              </p>
            </div>
            <motion.a
              href="/quote"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white text-brand-primary font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 shrink-0"
              whileHover={isReducedMotion ? undefined : { scale: 1.02 }}
              whileTap={isReducedMotion ? undefined : { scale: 0.98 }}
            >
              무료 상담 신청하기
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.a>
          </div>
          <div className="flex justify-center lg:justify-start mt-4">
            <span className="inline-flex items-center gap-2 text-white/50 text-xs">
              <span className="w-2 h-2 bg-brand-secondary rounded-full animate-pulse" />
              이번 달 프로젝트 잔여 슬롯 제한 · 월 2~3건만 진행합니다
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
