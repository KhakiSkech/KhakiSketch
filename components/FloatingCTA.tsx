'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { trackCtaClick } from '@/lib/gtag';

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/khakisketch/15min';

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Hydration mismatch 방지
  useEffect(() => {
    setIsMounted(true);
    setIsDesktop(window.innerWidth >= 768);
  }, []);

  // Throttled scroll handler with RAF
  const handleScroll = useCallback(() => {
    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      setIsVisible(window.scrollY > 300);
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  const openCalendly = useCallback(() => {
    trackCtaClick('floating_cta', '무료 상담 예약');
    // Calendly embed script 동적 로드
    if (typeof window !== 'undefined' && !(window as any).Calendly) {
      const link = document.createElement('link');
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.onload = () => {
        (window as any).Calendly?.initPopupWidget({ url: CALENDLY_URL });
      };
      document.head.appendChild(script);
    } else {
      (window as any).Calendly?.initPopupWidget({ url: CALENDLY_URL });
    }
  }, []);

  // 초기 마운트 전에는 렌더링하지 않음 (Hydration mismatch 방지)
  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openCalendly}
          aria-label="무료 상담 예약하기"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 bg-brand-primary text-white font-bold rounded-full shadow-lg transition-shadow duration-300 hover:shadow-xl"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Calendar Icon */}
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <motion.span
            initial={false}
            animate={{
              width: isHovered || isDesktop ? 'auto' : 0,
              opacity: isHovered || isDesktop ? 1 : 0,
              marginLeft: isHovered || isDesktop ? 8 : 0,
            }}
            className="overflow-hidden whitespace-nowrap"
          >
            무료 상담 예약
          </motion.span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
