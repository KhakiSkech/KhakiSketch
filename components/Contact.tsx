'use client';

import React from 'react';
import Link from 'next/link';
import ScrollReveal from './ui/ScrollReveal';
import DarkMeshBackground from './ui/DarkMeshBackground';

export default function Contact() {
  return (
    <section className="w-full relative overflow-hidden" id="contact" aria-label="무료 상담 신청">
      <DarkMeshBackground />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-14 lg:py-20">
        <ScrollReveal>
          <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
            {/* Heading */}
            <h2 className="font-bold text-3xl lg:text-4xl text-white tracking-tight leading-tight">
              아직 고민되시나요?
            </h2>
            <p className="text-white/80 text-lg leading-relaxed break-keep">
              15분 상담 한 번이면, 내 프로젝트가 가능한지 바로 알 수 있습니다.
            </p>

            {/* CTA */}
            <div className="flex flex-col items-center gap-3 mt-4">
              <Link
                href="/quote"
                className="group inline-flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-white text-brand-primary font-bold text-lg shadow-lg hover:bg-brand-bg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
              >
                지금 무료 상담 시작하기
                <svg
                  className="w-5 h-5 transition-transform group-hover:translate-x-1"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <span className="text-white/60 text-sm">
                상담 후 의무 계약 없음 · 비용 0원
              </span>
            </div>

            {/* Divider */}
            <div className="w-full max-w-md border-t border-white/10 my-4" />

            {/* Contact info */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <a href="mailto:contact@khakisketch.co.kr" className="hover:text-white transition-colors">
                  contact@khakisketch.co.kr
                </a>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>평일 10:00 - 18:00</span>
              </div>
            </div>

            {/* Team tagline */}
            <p className="text-white/50 text-xs mt-2">
              컴퓨터공학 전공 2인이 직접 개발하는 기술 스튜디오, 카키스케치입니다.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
