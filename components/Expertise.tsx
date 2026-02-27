'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import ScrollReveal from './ui/ScrollReveal';

// Icons
const MVPIcon = () => (
  <motion.svg
    variants={{
      hover: { scale: 1.1, rotate: 5, transition: { duration: 0.3 } }
    }}
    width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-secondary">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </motion.svg>
);

const AutomationIcon = () => (
  <motion.svg
    variants={{
      hover: { scale: 1.1, rotate: -5, transition: { duration: 0.3 } }
    }}
    width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-secondary">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </motion.svg>
);

const HomepageIcon = () => (
  <motion.svg
    variants={{
      hover: { scale: 1.1, y: -2, transition: { duration: 0.3 } }
    }}
    width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-secondary">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="21" x2="9" y2="9" />
  </motion.svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-brand-secondary shrink-0">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ServiceCard = ({
  icon: Icon,
  title,
  label,
  description,
  items,
  href,
}: {
  icon: React.ElementType,
  title: string,
  label: string,
  description: string,
  items: string[],
  href: string,
}) => (
  <Link href={href} className="block h-full">
    <motion.div
      whileHover="hover"
      className="bg-white flex flex-col items-center p-8 lg:p-10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full group hover:-translate-y-1 cursor-pointer"
    >
      <div className="mb-6 p-4 rounded-2xl bg-brand-bg group-hover:bg-brand-primary/5 transition-colors">
        <Icon />
      </div>

      <div className="flex flex-col gap-2 items-center text-center w-full mb-6">
        <span className="text-brand-secondary font-bold text-xs tracking-wider uppercase bg-brand-bg px-3 py-1 rounded-full">
          {label}
        </span>
        <h3 className="font-bold text-xl lg:text-2xl text-brand-primary">
          {title}
        </h3>
        <p className="text-brand-muted text-sm">
          {description}
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full mb-6 flex-grow">
        {items.map((item, index) => (
          <div key={index} className="flex gap-3 items-start">
            <CheckIcon />
            <span className="font-medium text-brand-primary text-sm text-left leading-snug">
              {item}
            </span>
          </div>
        ))}
      </div>

      <div className="w-full pt-4 border-t border-gray-100 mt-auto">
        <div className="w-full py-3 rounded-xl bg-gray-50 text-brand-primary font-semibold hover:bg-gray-100 transition-colors text-center">
          자세히 보기
        </div>
      </div>
    </motion.div>
  </Link>
);

export default function Expertise({ title = "Our Expertise" }: { title?: string }) {
  return (
    <section className="bg-brand-bg w-full py-20 lg:py-28" id="services">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-start gap-16">
        <ScrollReveal>
          <div className="flex flex-col gap-6 max-w-3xl">
            <h2 className="font-bold text-4xl lg:text-5xl text-brand-primary tracking-tight">
              {title}
            </h2>
            <p className="font-medium text-xl lg:text-2xl text-brand-primary/80 leading-relaxed whitespace-pre-wrap break-keep">
              현장의 문제를 기술로 해결합니다.{'\n'}
              단순 웹사이트 제작이 아닌, 비즈니스 로직을 담은 제품을 만듭니다.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 w-full">
          <ScrollReveal delay={100} className="h-full">
            <ServiceCard
              icon={MVPIcon}
              title="MVP / 웹·SW 개발"
              label="스타트업 / 신규 서비스"
              description="실제 작동하는 제품을 만듭니다"
              items={[
                "핵심 기능 우선(Must-have) 설계",
                "데모/런칭 일정 맞춤",
                "주간 진행 공유 및 피드백",
                "지원사업 행정/보고 지원"
              ]}
              href="/services/startup-mvp"
            />
          </ScrollReveal>
          <ScrollReveal delay={200} className="h-full">
            <ServiceCard
              icon={AutomationIcon}
              title="업무 자동화"
              label="기존 기업 / 운영 효율화"
              description="반복 업무를 시스템으로 해결합니다"
              items={[
                "현재 업무 프로세스 분석",
                "엑셀/수기 업무 웹 전환",
                "데이터 수집·리포트 자동화",
                "실시간 대시보드 구축"
              ]}
              href="/services/business-automation"
            />
          </ScrollReveal>
          <ScrollReveal delay={300} className="h-full">
            <ServiceCard
              icon={HomepageIcon}
              title="기업 홈페이지"
              label="브랜드 / 기업 소개"
              description="깔끔한 기업 소개 웹사이트"
              items={[
                "5~7페이지 구성",
                "반응형 디자인 (PC/모바일)",
                "기본 SEO 적용",
                "문의 폼 연동"
              ]}
              href="/services/corporate-website"
            />
          </ScrollReveal>
        </div>

        <div className="w-full text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-brand-secondary font-semibold hover:underline"
          >
            가격 안내 보기
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
