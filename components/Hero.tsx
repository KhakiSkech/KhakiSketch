'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ANIMATION } from '@/lib/animation-config';

import TypeWriter from './ui/TypeWriter';

// Orb configuration (reduced to 2 for performance)
const orbs = [
  { top: '10%', right: '5%', color: 'bg-brand-secondary', size: 600, blur: 140, opacity: 0.15, multiplier: 0.05 },
  { bottom: '15%', left: '5%', color: 'bg-[#445d3a]', size: 400, blur: 100, opacity: 0.12, multiplier: -0.08 },
];

const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMounted, setIsMounted] = useState(false);

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

  useEffect(() => {
    setIsMounted(true);
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

  // Framer Motion variants for text content
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

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen flex flex-col justify-center bg-brand-bg overflow-hidden pt-32 pb-20"
      aria-label="메인 배너"
    >
      {/* 1. Background Dot Pattern */}
      <div className="absolute inset-0 w-full h-full opacity-20 pointer-events-none bg-dot-pattern" />

      {/* 2. Interactive Spotlight Effect (follows mouse) */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0 opacity-40 lg:opacity-60"
        style={{
          background: useTransform(
            [spotlightX, spotlightY] as any,
            ([x, y]: [string, string]) => `radial-gradient(1000px circle at ${x} ${y}, rgba(135, 172, 117, 0.15), transparent 80%)`
          )
        }}
      />

      {/* 3. Gradient Blur Orbs */}
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full mix-blend-multiply pointer-events-none ${orb.color}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: orb.opacity }}
          style={{
            top: orb.top,
            right: orb.right,
            left: orb.left,
            bottom: orb.bottom,
            width: orb.size,
            height: orb.size,
            filter: `blur(${orb.blur}px)`,
            x: useTransform(smoothX, [0, 1], [-orb.multiplier * 200, orb.multiplier * 200]),
            y: useTransform(smoothY, [0, 1], [-orb.multiplier * 200, orb.multiplier * 200]),
            scale: useTransform(smoothY, [0, 1], [1, 1.05]),
          }}
          transition={{ opacity: { duration: 1.5 } }}
        />
      ))}

      {/* 4. Floating Particles (CSS-only for GPU compositing) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-brand-primary/10 rounded-full animate-float-particle"
            style={{
              left: `${20 + (i * 20)}%`,
              top: `${25 + (i * 12)}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i}s`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          className="flex flex-col gap-10 max-w-4xl"
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
            <span className="font-bold text-brand-primary text-4xl md:text-5xl lg:text-6xl leading-[1.15] tracking-[-0.02em] break-keep">
              일정과 범위 안에서,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">
                <TypeWriter text="실행 가능한 웹·SW" delay={1000} />
              </span>를 만듭니다.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p className="font-medium text-brand-primary/80 text-xl md:text-2xl leading-relaxed break-keep" variants={itemVariants}>
            요구사항 정의부터 개발·배포까지<br className="hidden sm:block" />
            외주 재하청 없이 직접 수행합니다.
          </motion.p>

          {/* Description */}
          <motion.p className="font-medium text-brand-muted text-base lg:text-lg leading-relaxed max-w-2xl break-keep" variants={itemVariants}>
            카키스케치는 컴퓨터공학 전공 개발자 2인이 운영하는 기술 스튜디오입니다.<br className="hidden md:block" />
            예비·초기창업 MVP, 업무 자동화 시스템, 기업 홈페이지를 만듭니다.
          </motion.p>

          {/* CTA Button */}
          <motion.div className="flex flex-col sm:flex-row gap-4 pt-2 items-start sm:items-center mb-12" variants={itemVariants}>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-brand-primary text-white font-bold text-lg shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-xl group"
              style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
              aria-label="프로젝트 상담 요청 - 문의 섹션으로 이동"
            >
              프로젝트 상담 요청
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <span className="text-sm text-brand-muted">
              15~20분 초기 상담 무료
            </span>
          </motion.div>

          {/* Trusted By Heading */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4 mt-8 opacity-40 group hover:opacity-100 transition-opacity duration-500"
          >
            <span className="w-8 h-px bg-brand-primary" />
            <span className="text-xs lg:text-sm font-bold text-brand-primary tracking-[0.2em] uppercase whitespace-nowrap">
              Trusted Technologies & Modern Stacks
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-50 hidden lg:block cursor-pointer hover:opacity-100 transition-opacity duration-300"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <a href="#services" aria-label="서비스 섹션으로 스크롤">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="#263122" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
};

export default Hero;
