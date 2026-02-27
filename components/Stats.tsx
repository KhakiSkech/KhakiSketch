'use client';

import { logger } from '@/lib/logger';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'framer-motion';
import { ANIMATION } from '@/lib/animation-config';
import { getStats } from '@/lib/firestore-site-settings';
import type { SiteStats } from '@/types/admin';

// 정적 fallback 데이터
const STATIC_STATS = [
  { value: 15, suffix: '+', label: '완료 프로젝트' },
  { value: 98, suffix: '%', label: '고객 만족도' },
  { value: 80, suffix: '%', label: '재계약/추천률' },
  { value: 2, suffix: '인', label: '전담 개발팀' },
];

function StatItem({ value, suffix, label, index }: {
  value: number;
  suffix: string;
  label: string;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: 2.5,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [isInView, value, count]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: ANIMATION.duration.normal,
        ease: ANIMATION.easing,
        delay: index * 0.1
      }}
      className="relative flex flex-col items-center gap-4 p-6 lg:p-8 group"
    >
      {/* Number */}
      <div className="flex items-baseline gap-1">
        <motion.span
          className="font-bold text-5xl lg:text-6xl text-brand-primary tabular-nums"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {rounded}
        </motion.span>
        <motion.span
          className="font-bold text-3xl lg:text-4xl text-brand-secondary"
          initial={{ opacity: 0, x: -10 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          {suffix}
        </motion.span>
      </div>

      {/* Label */}
      <motion.span
        className="text-brand-muted text-base lg:text-lg font-medium text-center"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8 + index * 0.1 }}
      >
        {label}
      </motion.span>

      {/* Subtle underline decoration */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 h-0.5 bg-brand-secondary/40 rounded-full"
        initial={{ width: 0 }}
        animate={isInView ? { width: '40%' } : {}}
        transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
      />
    </motion.div>
  );
}

export default function Stats() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [stats, setStats] = useState(STATIC_STATS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getStats();
      if (data) {
        // Firestore 데이터를 컴포넌트 형식으로 변환
        setStats([
          { value: data.completedProjects || 15, suffix: '+', label: '완료 프로젝트' },
          { value: data.customerSatisfaction || 98, suffix: '%', label: '고객 만족도' },
          { value: data.repeatOrderRate || 80, suffix: '%', label: '재계약/추천률' },
          { value: 2, suffix: '인', label: '전담 개발팀' }, // 개발팀 인원은 고정
        ]);
      }
    } catch (error) {
      logger.warn('Stats 로드 실패, 정적 데이터 사용:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section ref={sectionRef} className="w-full bg-brand-bg py-20 lg:py-20 relative overflow-hidden">
        <div className="w-full max-w-5xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-brand-primary/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="w-full bg-brand-bg py-20 lg:py-20 relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(38, 49, 34, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(38, 49, 34, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="w-full max-w-5xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
        >
          {stats.map((stat, index) => (
            <StatItem
              key={index}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
