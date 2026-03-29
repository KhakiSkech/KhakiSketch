'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const personas = [
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
];

function PainPointCards({ variant }: { variant: 'light' | 'dark' }) {
  const prefersReducedMotion = useReducedMotion();
  const isLight = variant === 'light';

  return (
    <section
      className={`w-full py-16 lg:py-24 relative overflow-hidden ${
        isLight
          ? 'bg-brand-bg'
          : 'bg-gradient-to-b from-[#1a2618] to-[#1e2b1c]'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          className="flex flex-col items-center text-center gap-3 mb-10 lg:mb-14"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.5 }}
        >
          <span className={`font-bold text-sm tracking-widest uppercase ${
            isLight ? 'text-brand-secondary' : 'text-brand-secondary'
          }`}>
            We Can Help
          </span>
          <h2 className={`font-bold text-3xl lg:text-4xl tracking-tight ${
            isLight ? 'text-brand-primary' : 'text-white'
          }`}>
            이런 상황이라면, 저희가 도와드릴 수 있습니다
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
          {personas.map((persona, i) => (
            <motion.div
              key={i}
              className={`flex flex-col gap-2 px-6 py-5 rounded-2xl border transition-all duration-300 ${
                isLight
                  ? 'bg-white border-gray-100 shadow-sm hover:border-brand-secondary/30 hover:shadow-md'
                  : 'bg-white/[0.06] border-white/10 hover:border-brand-secondary/40 hover:bg-white/[0.1]'
              }`}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, delay: i * 0.08 }}
            >
              <div className="flex items-center gap-3">
                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                  isLight
                    ? 'bg-brand-primary/10 text-brand-primary'
                    : 'bg-white/10 text-brand-secondary'
                }`}>
                  {persona.icon}
                </div>
                <span className={`text-[15px] lg:text-base leading-snug break-keep font-bold ${
                  isLight ? 'text-brand-text' : 'text-white/90'
                }`}>
                  {persona.pain}
                </span>
              </div>
              <span className={`text-sm font-medium pl-[52px] ${
                isLight ? 'text-brand-secondary' : 'text-brand-secondary'
              }`}>
                → {persona.solution}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Stats() {
  return <PainPointCards variant="light" />;
}
