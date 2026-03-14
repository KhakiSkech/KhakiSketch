'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from './ui/ScrollReveal';
import { ANIMATION } from '@/lib/animation-config';

const faqs = [
  // 프로젝트 진행 관련
  {
    id: 1,
    category: '진행',
    question: '프로젝트는 어떤 순서로 진행되나요?',
    answer: '1) 15~20분 무료 초기 상담 → 2) Discovery 세션(유료, 개발 계약 시 차감)으로 요구사항 정의서 작성 → 3) 견적 및 일정 확정 → 4) 개발 착수 및 주간 진행 공유 → 5) 테스트 및 피드백 반영 → 6) 배포 및 인수 순서로 진행됩니다.',
  },
  {
    id: 2,
    category: '진행',
    question: '개발 기간은 얼마나 걸리나요?',
    answer: 'MVP 수준의 웹 서비스는 보통 2~4개월, 업무 자동화 시스템은 1~2개월 정도 소요됩니다. 정확한 기간은 Discovery 세션 후 요구사항 범위에 따라 산정됩니다. 무리한 일정 압축보다는 현실적인 일정을 제안드립니다.',
  },
  {
    id: 3,
    category: '비용',
    question: '비용은 어떻게 산정되나요?',
    answer: '기능 단위로 공수를 산정하여 견적을 드립니다. Discovery 세션(20~30만원)을 통해 요구사항을 명확히 정리한 후, 상세 견적서를 제공합니다. Discovery 비용은 실제 개발 계약 시 전액 차감됩니다.',
  },
  {
    id: 4,
    category: '진행',
    question: '중간에 요구사항이 바뀌면 어떻게 되나요?',
    answer: '초기 요구사항 정의서에 포함된 범위 내 수정은 자유롭게 반영됩니다. 범위를 벗어나는 추가 기능은 별도 협의 후 추가 견적을 드립니다. 명확한 문서가 있어 "이건 포함이었나요?" 같은 분쟁이 거의 없습니다.',
  },
  // 기술 관련
  {
    id: 5,
    category: '기술',
    question: '어떤 기술 스택을 사용하나요?',
    answer: '프론트엔드는 React/Next.js + TypeScript, 백엔드는 Python/FastAPI 또는 Node.js, 데이터베이스는 PostgreSQL을 주로 사용합니다. 모바일 앱은 Flutter로 개발합니다. 프로젝트 특성에 맞게 최적의 스택을 제안드립니다.',
  },
  {
    id: 6,
    category: '기술',
    question: '개발 완료 후 유지보수는 어떻게 되나요?',
    answer: '배포 후 1개월간 무상 버그 수정 기간을 제공합니다. 이후에는 월 단위 유지보수 계약 또는 건별 대응 중 선택 가능합니다. 소스코드와 문서는 모두 인수하시므로 다른 개발자가 이어받는 것도 가능합니다.',
  },
  {
    id: 7,
    category: '기술',
    question: '보안은 어떻게 관리되나요?',
    answer: 'HTTPS 적용, 환경변수 관리, SQL 인젝션/XSS 방지 등 기본 보안 사항을 준수합니다. 민감한 데이터를 다루는 경우 추가 보안 조치를 협의합니다. 필요 시 보안 점검 리포트도 제공 가능합니다.',
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="w-full bg-white py-20 lg:py-28" id="faq">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal>
          <div className="flex flex-col gap-4 mb-12 lg:mb-16 text-center">
            <span className="text-brand-secondary font-bold text-sm tracking-widest uppercase">
              FAQ
            </span>
            <h2 className="font-bold text-brand-primary text-3xl lg:text-4xl tracking-tight">
              자주 묻는 질문
            </h2>
            <p className="text-brand-muted text-lg max-w-2xl mx-auto">
              프로젝트 진행 전 궁금한 점을 확인해 보세요.
            </p>
          </div>
        </ScrollReveal>

        {/* FAQ Accordion */}
        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <ScrollReveal key={faq.id} delay={index * 50}>
              <motion.div
                layout
                className="bg-white rounded-xl border border-gray-100 overflow-hidden transition-colors hover:border-brand-secondary/30"
              >
                {/* Question */}
                <button
                  id={`faq-question-${faq.id}`}
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full flex items-center justify-between gap-4 p-5 lg:p-6 text-left transition-colors hover:bg-gray-50"
                  aria-expanded={openId === faq.id}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded ${faq.category === '진행' || faq.category === '비용'
                      ? 'bg-brand-primary/10 text-brand-primary'
                      : 'bg-brand-secondary/10 text-brand-secondary'
                      }`}>
                      {faq.category}
                    </span>
                    <span className="font-semibold text-brand-primary text-base lg:text-lg">
                      {faq.question}
                    </span>
                  </div>
                  <motion.svg
                    animate={{ rotate: openId === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: ANIMATION.easing }}
                    className="w-5 h-5 text-brand-muted flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </motion.svg>
                </button>

                {/* Answer */}
                <AnimatePresence initial={false}>
                  {openId === faq.id && (
                    <motion.div
                      id={`faq-answer-${faq.id}`}
                      role="region"
                      aria-labelledby={`faq-question-${faq.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ height: { duration: 0.3, ease: ANIMATION.easing }, opacity: { duration: 0.3 } }}
                    >
                      <div className="px-5 lg:px-6 pb-5 lg:pb-6 pt-0">
                        <p className="text-brand-text leading-relaxed break-keep pl-0 lg:pl-[3.25rem]">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

