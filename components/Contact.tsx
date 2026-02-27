'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import ScrollReveal from './ui/ScrollReveal';
import TypeWriter from './ui/TypeWriter';

export default function Contact() {
  const textRef = useRef(null);
  const isTextInView = useInView(textRef, { once: true, margin: "0px" });

  return (
    <section className="bg-brand-bg w-full" id="contact">
      {/* Main Content with Padding */}
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">

        {/* About Section - Premium Redesign */}
        <ScrollReveal>
          <div className="flex flex-col gap-12" id="about">
            {/* Header with improved typography */}
            <div className="flex flex-col gap-6 text-center lg:text-left">
              <div className="flex flex-col gap-3">
                <span className="text-brand-secondary font-bold text-xs tracking-[0.2em] uppercase">
                  Our Identity
                </span>
                <h2 className="font-bold text-brand-primary text-4xl lg:text-5xl tracking-tight leading-tight">
                  About KhakiSketch
                </h2>
              </div>
              <p ref={textRef} className="font-medium text-brand-text text-lg lg:text-xl leading-relaxed break-keep max-w-3xl lg:ml-0 mx-auto">
                컴퓨터공학 전공 2인이 시작한 기술 중심 스튜디오입니다.<br className="hidden md:block" />
                데이터 인프라부터 제품 UX까지, 각 분야의 전문성을 바탕으로 <br className="hidden md:block" />
                <span className="text-brand-primary font-bold">
                  <TypeWriter text="'우리가 직접 써도 납득되는 제품'" delay={200} speed={150} start={isTextInView} />
                </span>만을 진정성 있게 제안합니다.
              </p>
            </div>

            {/* Team Members */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              {/* 송재찬 */}
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.15 }}
                className="group relative flex flex-col sm:flex-row items-center sm:items-start gap-6 p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-brand-secondary/20 transition-shadow duration-150 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-primary/10 transition-colors duration-150" />
                <div className="w-20 h-20 rounded-3xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-150 shadow-inner">
                  <svg className="w-10 h-10 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                </div>
                <div className="flex flex-col gap-3 items-center sm:items-start text-center sm:text-left relative z-10">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-brand-primary text-2xl tracking-tight">송재찬</span>
                    <span className="px-3 py-1 bg-brand-primary/5 text-brand-primary text-xs font-bold rounded-full border border-brand-primary/10 uppercase tracking-wider">
                      Co-founder
                    </span>
                  </div>
                  <span className="text-brand-muted text-base leading-relaxed break-keep font-medium italic">
                    백엔드/데이터 인프라, 시스템 설계 담당
                  </span>
                  <p className="text-brand-text/70 text-sm leading-relaxed break-keep">
                    금융 데이터 파이프라인 및 고성능 트레이딩 시스템 개발 등 <br className="hidden lg:block" />
                    안정적이고 확장 가능한 백엔드 생태계를 구축합니다.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                    {['Python', 'FastAPI', 'PostgreSQL', 'AWS'].map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-gray-50 text-gray-400 text-[11px] rounded-lg font-bold border border-gray-200 group-hover:border-brand-secondary/30 group-hover:text-brand-secondary transition-colors duration-150">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* 정희태 */}
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.15 }}
                className="group relative flex flex-col sm:flex-row items-center sm:items-start gap-6 p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-brand-secondary/20 transition-shadow duration-150 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-secondary/10 transition-colors duration-150" />
                <div className="w-20 h-20 rounded-3xl bg-brand-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-150 shadow-inner">
                  <svg className="w-10 h-10 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122l9.37-9.445m-1.187 9.255L9.53 16.122 5.29 11.88m11.411 6.55L21.75 3.75M13.662 19L19 19M5 5l1.5-1.5" />
                  </svg>
                </div>
                <div className="flex flex-col gap-3 items-center sm:items-start text-center sm:text-left relative z-10">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-brand-primary text-2xl tracking-tight">정희태</span>
                    <span className="px-3 py-1 bg-brand-secondary/5 text-brand-secondary text-xs font-bold rounded-full border border-brand-secondary/10 uppercase tracking-wider">
                      Co-founder
                    </span>
                  </div>
                  <span className="text-brand-muted text-base leading-relaxed break-keep font-medium italic">
                    프론트엔드/제품 UX, 프로젝트 운영 담당
                  </span>
                  <p className="text-brand-text/70 text-sm leading-relaxed break-keep">
                    사용자 중심의 직관적인 인터페이스와 웹/앱 제품을 개발하며, <br className="hidden lg:block" />
                    비즈니스 목표를 실현하는 최적의 사용자 경험을 디자인합니다.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                    {['React', 'Next.js', 'Flutter', 'TypeScript'].map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-gray-50 text-gray-400 text-[11px] rounded-lg font-bold border border-gray-200 group-hover:border-brand-primary/30 group-hover:text-brand-primary transition-colors duration-150">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </ScrollReveal>

      </div>

      {/* Changed: Full-width CTA Banner moved here */}
      <ScrollReveal>
        <div className="w-full bg-brand-primary">
          <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
              {/* Text Content */}
              <div className="flex flex-col gap-4 text-center lg:text-left">
                <h3 className="text-white font-bold text-2xl lg:text-3xl tracking-tight">
                  다른 궁금한 점이 있으신가요?
                </h3>
                <p className="text-white/80 text-base lg:text-lg max-w-lg leading-relaxed">
                  프로젝트 문의부터 기술 상담까지,<br className="hidden lg:block" />
                  편하게 연락 주시면 24시간 내 답변드립니다.
                </p>
              </div>

              {/* CTA Button */}
              <Link
                href="/quote"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-brand-primary font-bold text-lg rounded-xl hover:bg-brand-bg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              >
                무료 상담 신청하기
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
