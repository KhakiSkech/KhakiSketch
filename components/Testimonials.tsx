'use client';

import { logger } from '@/lib/logger';
import React, { useState, useEffect } from 'react';
import ScrollDrivenSlider from './ui/ScrollDrivenSlider';
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
    content: "트레이딩 봇 개발을 맡겼는데, API 연동부터 백테스팅 환경 구축까지 꼼꼼하게 해주셨습니다. 전략 로직에 대한 이해도도 높으셔서 커뮤니케이션이 수월했고, 덕분에 2개월 만에 실전 투입할 수 있었습니다.",
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

// Star Rating
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`5점 만점 중 ${rating}점`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-amber-400' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

// Testimonial Card
function TestimonialCard({ testimonial }: { testimonial: TestimonialItem }) {
  return (
    <div className="bg-brand-bg rounded-2xl p-5 lg:p-10 border border-gray-100 h-full flex flex-col">
      {/* Quote icon */}
      <svg className="w-10 h-10 text-brand-secondary/20 mb-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>

      {/* Star rating */}
      {testimonial.rating && <StarRating rating={testimonial.rating} />}

      {/* Content */}
      <p className="text-brand-text text-base lg:text-lg leading-relaxed flex-grow break-keep mt-4">
        &ldquo;{testimonial.content}&rdquo;
      </p>

      {/* Author */}
      <div className="flex flex-col gap-2 pt-5 border-t border-gray-100 mt-6">
        <div className="flex items-center justify-between">
          <span className="font-bold text-brand-primary">{testimonial.author}</span>
          <span className="px-3 py-1 bg-brand-secondary/10 text-brand-secondary text-xs font-medium rounded-full">
            {testimonial.projectType}
          </span>
        </div>
        <span className="text-brand-muted text-sm">{testimonial.role}</span>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(STATIC_TESTIMONIALS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const data = await getTestimonials();
        if (data && data.items && data.items.length > 0) {
          const sortedItems = [...data.items].sort((a, b) => (a.order || 0) - (b.order || 0));
          setTestimonials(sortedItems);
        }
      } catch (error) {
        logger.warn('Testimonials 로드 실패, 정적 데이터 사용:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadTestimonials();
  }, []);

  const header = (
    <div className="flex flex-col gap-4">
      <span className="text-brand-secondary font-bold text-sm tracking-widest uppercase">
        Client Feedback
      </span>
      <h2 className="font-bold text-3xl lg:text-4xl text-brand-primary tracking-tight leading-tight">
        함께한 고객들의 이야기
      </h2>
      <p className="text-lg text-brand-muted leading-relaxed break-keep">
        실제 프로젝트를 진행하신 분들의 솔직한 후기입니다.
      </p>
    </div>
  );

  const footer = (
    <p className="text-brand-muted text-sm">
      * 고객사 요청에 따라 기업명은 익명 처리하였습니다.
    </p>
  );

  // Loading state
  if (isLoading) {
    return (
      <section className="w-full bg-white py-20 lg:py-28" id="testimonials" aria-busy="true">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-10">{header}</div>
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
    <ScrollDrivenSlider
      id="testimonials"
      bgColor="bg-white"
      header={header}
      cards={testimonials.map((t) => (
        <TestimonialCard key={t.id} testimonial={t} />
      ))}
      footer={footer}
      scrollHeight={3.0}
    />
  );
}
