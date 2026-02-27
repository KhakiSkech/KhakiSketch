'use client';

import { logger } from '@/lib/logger';
import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import ScrollReveal from './ui/ScrollReveal';
import { ANIMATION } from '@/lib/animation-config';
import { getTestimonials } from '@/lib/firestore-site-settings';
import type { TestimonialItem } from '@/types/admin';

// 정적 fallback 데이터
const STATIC_TESTIMONIALS: TestimonialItem[] = [
  {
    id: '1',
    content: "처음 외주를 맡기면서 걱정이 많았는데, 요구사항 정의서를 받아보고 안심이 됐습니다. '이 정도로 꼼꼼하게 정리해주시는구나' 싶었고, 실제 개발도 그 문서대로 진행되어서 중간에 혼선이 없었습니다.",
    author: "A사 대표",
    role: "예비창업패키지 MVP 개발",
    projectType: "스타트업 MVP",
    rating: 5,
    order: 1,
  },
  {
    id: '2',
    content: "기존에 수작업으로 3시간 걸리던 일이 10분으로 줄었습니다. 처음에는 '이게 가능해?' 싶었는데, 실제로 시스템이 돌아가는 걸 보니 왜 진작 안 했나 싶더라고요. 특히 대표님이 직접 개발하시니까 소통이 빨랐습니다.",
    author: "B 기업 실장",
    role: "반복 업무 자동화 시스템",
    projectType: "업무 자동화",
    rating: 5,
    order: 2,
  },
  {
    id: '3',
    content: "여러 데이터 소스를 한 화면에서 봐야 하는데 기존 솔루션들은 다 부족했습니다. 직접 만들어야겠다 싶어서 의뢰했는데, 기대 이상으로 깔끔하게 나왔습니다. 유지보수 대응도 빠르고요.",
    author: "C사 팀장",
    role: "실시간 데이터 대시보드",
    projectType: "트레이딩/데이터",
    rating: 5,
    order: 3,
  },
  {
    id: '4',
    content: "초기 상담에서 마무리까지 답변이 빠르고 명확했습니다. 개발 진행 상황도 카카오톡으로 수시로 공유해주셔서 불안함 없이 기다릴 수 있었어요. 결과물 퀄리티도 매우 만족스럽습니다.",
    author: "D사 실장",
    role: "기업 홈페이지 리뉴얼",
    projectType: "홈페이지",
    rating: 5,
    order: 4,
  },
  {
    id: '5',
    content: "트레이딩 봇 개발을 맡겼는데, API 연동부터 백테스팅 환경 구축까지 꼼꼼하게 해주셨습니다. 전략 로직에 대한 이핏도도 높으셔서 커뮤니케이션이 수월했고, 덕분에 2개월 만에 실전 투입할 수 있었습니다.",
    author: "E 개인투자자",
    role: "암호화폐 자동매매 시스템",
    projectType: "트레이딩/자동매매",
    rating: 5,
    order: 5,
  },
  {
    id: '6',
    content: "Notion과 Google Sheets 연동 자동화를 의뢰했습니다. 매일 아침 수동으로 하던 리포트 작성이 이제 자동으로 돌아가요. 작은 프로젝트라 다른 곳에선 잘 안 받아주더라고요. 여기는 소규모도 친절하게 대응해주셔서 감사합니다.",
    author: "F사 대리",
    role: "업무 리포트 자동화",
    projectType: "업무 자동화",
    rating: 5,
    order: 6,
  },
];

// Animated Quote Icon
function QuoteIcon({ isInView, delay }: { isInView: boolean; delay: number }) {
  return (
    <motion.svg
      className="w-12 h-12 text-brand-secondary/10 group-hover:text-brand-secondary/20 transition-colors duration-500"
      fill="currentColor"
      viewBox="0 0 24 24"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: ANIMATION.easing }}
    >
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </motion.svg>
  );
}

// Testimonial Card Component
function TestimonialCard({ testimonial, index }: { testimonial: TestimonialItem; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative flex flex-col gap-5 p-6 lg:p-8 bg-brand-bg rounded-2xl border border-gray-100 hover:border-brand-secondary/30 transition-colors duration-300 h-full"
    >
      {/* Quote Icon */}
      <div className="absolute top-4 right-4">
        <QuoteIcon isInView={true} delay={0.1} />
      </div>

      {/* Content */}
      <p className="text-brand-text text-base leading-relaxed flex-grow break-keep relative z-10 pr-8">
        &ldquo;{testimonial.content}&rdquo;
      </p>

      {/* Author Info */}
      <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="font-bold text-brand-primary">
            {testimonial.author}
          </span>
          <span className="px-3 py-1 bg-brand-secondary/10 text-brand-secondary text-xs font-medium rounded-full">
            {testimonial.projectType}
          </span>
        </div>
        <span className="text-brand-muted text-sm">
          {testimonial.role}
        </span>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [currentPage, setCurrentPage] = useState(0);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(STATIC_TESTIMONIALS);
  const [isLoading, setIsLoading] = useState(true);
  
  const itemsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const currentTestimonials = testimonials.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const data = await getTestimonials();
      if (data && data.items && data.items.length > 0) {
        // order 순서대로 정렬
        const sortedItems = [...data.items].sort((a, b) => (a.order || 0) - (b.order || 0));
        setTestimonials(sortedItems);
      }
    } catch (error) {
      logger.warn('Testimonials 로드 실패, 정적 데이터 사용:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const goToPrev = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  if (isLoading) {
    return (
      <section ref={sectionRef} className="w-full bg-white py-20 lg:py-28 overflow-hidden" id="testimonials">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-brand-bg rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="w-full bg-white py-20 lg:py-28 overflow-hidden" id="testimonials">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 lg:mb-16">
            <div className="flex flex-col gap-4">
              <motion.span
                className="text-brand-secondary font-bold text-sm tracking-widest uppercase"
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
              >
                Client Feedback
              </motion.span>
              <motion.h2
                className="font-bold text-brand-primary text-3xl lg:text-4xl tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 }}
              >
                함께한 고객들의 이야기
              </motion.h2>
              <motion.p
                className="text-brand-muted text-lg max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 }}
              >
                실제 프로젝트를 진행하신 분들의 솔직한 후기입니다.
              </motion.p>
            </div>

            {/* Navigation Arrows */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
            >
              <button
                onClick={goToPrev}
                className="w-12 h-12 rounded-full border-2 border-gray-200 hover:border-brand-secondary hover:bg-brand-secondary hover:text-white text-brand-muted flex items-center justify-center transition-all duration-300"
                aria-label="이전 리뷰"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={goToNext}
                className="w-12 h-12 rounded-full border-2 border-gray-200 hover:border-brand-secondary hover:bg-brand-secondary hover:text-white text-brand-muted flex items-center justify-center transition-all duration-300"
                aria-label="다음 리뷰"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          </div>
        </ScrollReveal>

        {/* Testimonial Cards Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {currentTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  index={index}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Page Indicators */}
        <motion.div
          className="flex justify-center items-center gap-2 mt-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentPage === index
                  ? 'bg-brand-secondary w-8'
                  : 'bg-gray-300 hover:bg-gray-400'
                }`}
              aria-label={`${index + 1}페이지`}
            />
          ))}
        </motion.div>

        {/* Trust Note */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
        >
          <p className="text-brand-muted text-sm">
            * 고객사 요청에 따라 기업명은 익명 처리하였습니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
