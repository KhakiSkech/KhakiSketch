'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue, useTransform, useScroll } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ANIMATION } from '@/lib/animation-config';
import HeroLaptops from './ui/HeroLaptops';

import TypeWriter from './ui/TypeWriter';

// Framer Motion variants for text content (module-level to avoid re-creation)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: ANIMATION.easing
    }
  }
};

// Orb configuration (enhanced visibility)
const orbs = [
  { top: '5%', right: '-5%', color: 'bg-brand-secondary', size: 600, blur: 180, opacity: 0.15, multiplier: 0.05 },
  { bottom: '5%', left: '-8%', color: 'bg-[#445d3a]', size: 450, blur: 160, opacity: 0.12, multiplier: -0.08 },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<number | null>(null);

  // Mouse position values (-1 to 1)
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  // Smooth springs for mouse follow
  const springConfig = { damping: 30, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Derived transforms for more efficient rendering
  const spotlightX = useTransform(smoothX, [0, 1], ["0%", "100%"]);
  const spotlightY = useTransform(smoothY, [0, 1], ["0%", "100%"]);
  const spotlightBg = useTransform(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- framer-motion array overload has incomplete types
    [spotlightX, spotlightY] as any,
    ([x, y]: [string, string]) => `radial-gradient(1000px circle at ${x} ${y}, rgba(135, 172, 117, 0.12), transparent 80%)`
  );

  // Pre-compute orb transforms (outside JSX to avoid hooks-in-loop pattern)
  const orb0X = useTransform(smoothX, [0, 1], [-orbs[0].multiplier * 200, orbs[0].multiplier * 200]);
  const orb0Y = useTransform(smoothY, [0, 1], [-orbs[0].multiplier * 200, orbs[0].multiplier * 200]);
  const orb1X = useTransform(smoothX, [0, 1], [-orbs[1].multiplier * 200, orbs[1].multiplier * 200]);
  const orb1Y = useTransform(smoothY, [0, 1], [-orbs[1].multiplier * 200, orbs[1].multiplier * 200]);
  const orbTransforms = [
    { x: orb0X, y: orb0Y },
    { x: orb1X, y: orb1Y },
  ];

  // Scroll-driven exit: content fades out + moves up as user scrolls past hero
  const { scrollYProgress } = useScroll({
    target: sectionRef as React.RefObject<HTMLElement>,
    offset: ['start start', 'end start'],
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7], [1, 1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.3, 0.7], [0, 0, -50]);
  const orbScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.9]);
  const orbScrollFade = useTransform(scrollYProgress, [0, 0.6, 0.8], [1, 0.6, 0]);
  // Pre-compute per-orb opacity: base value × scroll fade (no initial/animate conflict)
  const orb0Opacity = useTransform(orbScrollFade, (v) => v * orbs[0].opacity);
  const orb1Opacity = useTransform(orbScrollFade, (v) => v * orbs[1].opacity);
  const orbOpacities = [orb0Opacity, orb1Opacity];
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.1], [0.5, 0]);

  useEffect(() => {
    setIsMounted(true);
    setCurrentMonth(new Date().getMonth() + 1);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const { left, top, width, height } = sectionRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    mouseX.set(x);
    mouseY.set(y);
  }, [prefersReducedMotion, mouseX, mouseY]);

  useEffect(() => {
    if (!isMounted || prefersReducedMotion) return;
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove, prefersReducedMotion, isMounted]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full flex flex-col justify-center bg-brand-bg overflow-hidden pt-24 pb-8 lg:pt-20 lg:pb-8"
      aria-label="메인 배너"
    >
      {/* 1. Background Dot Pattern */}
      <div className="absolute inset-0 w-full h-full opacity-20 pointer-events-none bg-dot-pattern" />

      {/* 2. Interactive Spotlight Effect (follows mouse) */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0 opacity-40 lg:opacity-60"
        style={{ background: spotlightBg }}
      />

      {/* 3. Gradient Blur Orbs — enhanced opacity & size */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full mix-blend-multiply pointer-events-none ${orb.color}`}
          style={{
            top: orb.top,
            right: orb.right,
            left: orb.left,
            bottom: orb.bottom,
            width: orb.size,
            height: orb.size,
            filter: `blur(${orb.blur}px)`,
            opacity: orbOpacities[i],
            x: orbTransforms[i].x,
            y: orbTransforms[i].y,
            scale: orbScale,
          }}
        />
      ))}

      {/* 4. Floating Particles — 6 particles with mixed sizes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { left: '15%', top: '20%', size: 'w-1.5 h-1.5' },
          { left: '70%', top: '30%', size: 'w-1 h-1' },
          { left: '35%', top: '65%', size: 'w-2 h-2' },
          { left: '80%', top: '55%', size: 'w-1.5 h-1.5' },
          { left: '55%', top: '15%', size: 'w-1 h-1' },
          { left: '25%', top: '80%', size: 'w-2 h-2' },
        ].map((pos, i) => (
          <div
            key={i}
            className={`absolute ${pos.size} bg-brand-primary/10 rounded-full animate-float-particle`}
            style={{
              left: pos.left,
              top: pos.top,
              animationDelay: `${i * 0.9}s`,
              animationDuration: `${4 + i * 1.2}s`,
            }}
          />
        ))}
      </div>

      {/* 5. Diagonal light ray */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          background: 'linear-gradient(135deg, transparent 30%, rgba(116, 153, 101, 0.4) 50%, transparent 70%)',
        }}
      />

      <motion.div
        className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* 2-column layout: text left, geometric right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center">
          {/* Left: Text content */}
          <motion.div
            className="flex flex-col gap-10"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Trust Badges */}
            <motion.div className="flex flex-wrap gap-3" variants={itemVariants}>
              {[
                { icon: '✓', text: '100% 직접 개발' },
                { icon: '✓', text: '대표 개발자 직접 소통' },
                { icon: '✓', text: '요구사항 정의서 제공' },
              ].map((badge, i) => (
                <div key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-brand-primary/10 shadow-sm hover:border-brand-secondary/30 transition-colors">
                  <span className="w-5 h-5 rounded-full bg-brand-secondary/20 text-brand-secondary flex items-center justify-center text-[10px] font-bold">
                    {badge.icon}
                  </span>
                  <span className="font-bold text-brand-primary/80 text-xs tracking-tight">
                    {badge.text}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Main Headline with TypeWriter */}
            <motion.h1 className="flex flex-col gap-3" variants={itemVariants}>
              <span className="font-bold text-brand-primary text-4xl md:text-5xl lg:text-[3.2rem] leading-[1.15] tracking-[-0.02em] break-keep">
                아이디어는 있는데,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                  <TypeWriter text="어디서부터 시작할지" delay={1000} />
                </span>{' '}막막하신가요?
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p className="font-medium text-brand-primary/80 text-lg md:text-xl leading-relaxed break-keep" variants={itemVariants}>
              3~4개월이면 실제 돌아가는 제품이 나옵니다.<br className="hidden sm:block" />
              재하청 없이, 대표 개발자가 직접.
            </motion.p>

            {/* Description */}
            <motion.p className="font-medium text-brand-muted text-base lg:text-lg leading-relaxed max-w-2xl break-keep" variants={itemVariants}>
              카키스케치는 컴퓨터공학 전공 개발자 2인이 운영하는 기술 스튜디오입니다.<br className="hidden md:block" />
              스타트업 MVP, 업무 자동화, 기업 홈페이지를 일정과 예산 안에서 완성합니다.
            </motion.p>

            {/* CTA Button */}
            <motion.div className="flex flex-col sm:flex-row gap-4 pt-2 items-start sm:items-center mb-6" variants={itemVariants}>
              <a
                href="/quote"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-brand-primary text-white font-bold text-lg shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-xl group"
                style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
                aria-label="무료 상담 신청 페이지로 이동"
              >
                무료 상담 신청하기
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <div className="flex flex-col gap-1">
                <span className="text-sm text-brand-muted">
                  상담 후 의무 계약 없음 · 15분이면 충분합니다
                </span>
                <span className="text-xs text-brand-secondary font-medium">
                  현재 {currentMonth !== null ? `${currentMonth}월` : ''}프로젝트 접수 중 · 월 2~3건만 진행
                </span>
              </div>
            </motion.div>

            {/* Key Stats */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-6 lg:gap-8 mt-4 pt-4 border-t border-gray-200/60"
            >
              <div className="text-center">
                <span className="block text-2xl lg:text-3xl font-bold text-brand-primary">47+</span>
                <span className="text-xs text-brand-muted">완료 프로젝트</span>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-center">
                <span className="block text-2xl lg:text-3xl font-bold text-brand-primary">3.2<span className="text-base">개월</span></span>
                <span className="text-xs text-brand-muted">평균 납기</span>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-center">
                <span className="block text-2xl lg:text-3xl font-bold text-brand-secondary">98%</span>
                <span className="text-xs text-brand-muted">고객 만족도</span>
              </div>
            </motion.div>

            {/* Trusted By Heading */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-4 mt-6 opacity-40 group hover:opacity-100 transition-opacity duration-500"
            >
              <span className="w-8 h-px bg-brand-primary" />
              <span className="text-xs lg:text-sm font-bold text-brand-primary tracking-[0.2em] uppercase whitespace-nowrap">
                Trusted Technologies & Modern Stacks
              </span>
            </motion.div>
          </motion.div>

          {/* Right: Laptop visual (desktop only) */}
          <motion.div
            className="hidden lg:flex items-center justify-center relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.5, ease: ANIMATION.easing }}
          >
            <HeroLaptops />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:block cursor-pointer"
        style={{ opacity: scrollIndicatorOpacity }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <a href="#comparison" aria-label="다음 섹션으로 스크롤">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="#263122" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
}
