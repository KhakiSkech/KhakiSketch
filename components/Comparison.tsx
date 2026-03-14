'use client';

import React from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import StickyScrollSection from './ui/StickyScrollSection';
import DarkMeshBackground from './ui/DarkMeshBackground';

const badPoints = [
  '기획서 없으면 개발 불가능',
  '비즈니스 로직 이해 없이 코드 작성',
  '유지보수 고려 없는 일회성 코드',
  '개발자 얼굴도 못 보고 매니저와 소통',
];

const goodPoints = [
  'Discovery 세션으로 기획부터 참여',
  'User Flow 기반의 탄탄한 설계',
  '확장성을 고려한 모듈형 개발',
  '컴공 전공 대표 개발자와 직접 소통',
];

/* ────────────────────────────────────────────
   Mobile — 일반 스크롤 + whileInView
   ──────────────────────────────────────────── */
const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };
const listItem = { hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0, transition: { duration: 0.3 } } };

function ComparisonMobile() {
  return (
    <div className="lg:hidden motion-reduce:lg:!block relative py-20 overflow-hidden">
      <DarkMeshBackground />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="flex flex-col gap-4 mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
        >
          <span className="text-brand-secondary font-bold text-sm tracking-widest uppercase">
            Why KhakiSketch?
          </span>
          <h2 className="font-bold text-3xl text-white tracking-tight leading-tight">
            외주 개발, 이런 경험 없으셨나요?
          </h2>
          <p className="text-lg text-white/70 leading-relaxed break-keep">
            &ldquo;디자인만 예쁘고 작동은 안 해요.&rdquo;
            &ensp;&ldquo;개발자 얼굴도 못 봤어요.&rdquo;
            <br />
            외주 프로젝트 10건 중 7건이 기대 이하로 끝납니다.{' '}
            <strong className="text-white">비즈니스 이해도 부족</strong>이 원인입니다.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="flex flex-col gap-6">
          {/* Bad */}
          <motion.div
            className="flex flex-col p-7 rounded-2xl border border-white/10 bg-white/[0.08]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp}
            transition={{ duration: 0.45 }}
          >
            <span className="self-start px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-bold mb-4">
              일반적인 외주 에이전시
            </span>
            <h3 className="text-xl font-bold text-white/80 mb-5 leading-snug">
              &ldquo;그냥 시키는 대로만
              <br />
              만들어 드립니다.&rdquo;
            </h3>
            <motion.ul className="flex flex-col gap-3 text-white/70" variants={stagger}>
              {badPoints.map((p, i) => (
                <motion.li key={i} className="flex gap-3 items-start" variants={listItem}>
                  <span className="text-red-400 font-bold text-lg leading-tight shrink-0">✕</span>
                  <span className="leading-relaxed">{p}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Good */}
          <motion.div
            className="flex flex-col p-7 rounded-2xl border border-brand-secondary/40 bg-brand-secondary/15 text-white shadow-xl overflow-hidden relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            variants={fadeUp}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-brand-secondary/15 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <span className="self-start inline-block px-3 py-1 rounded-full bg-brand-secondary text-white text-sm font-bold shadow-lg mb-4">
                Khaki Sketch Studio
              </span>
              <h3 className="text-xl font-bold text-white mb-5 leading-snug">
                &ldquo;비즈니스 파트너처럼
                <br />
                함께 고민합니다.&rdquo;
              </h3>
              <motion.ul className="flex flex-col gap-3 text-white/90" variants={stagger}>
                {goodPoints.map((p, i) => (
                  <motion.li key={i} className="flex gap-3 items-start" variants={listItem}>
                    <span className="text-brand-secondary font-bold text-lg leading-tight shrink-0">✓</span>
                    <span className="leading-relaxed">{p}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
        </div>

        <motion.p
          className="text-center text-base text-white/60 mt-10 leading-relaxed break-keep"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          카키스케치는 다릅니다.{' '}
          <strong className="text-white">기획부터 함께하고,</strong> 비즈니스를 이해한 코드를 작성합니다.
        </motion.p>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Desktop — Sticky scroll-lock + crossfade + item reveal
   scrollHeight 1.5 → 뷰포트 50% 추가 스크롤만 사용
   ──────────────────────────────────────────── */
function ComparisonDesktop() {
  return (
    <div className="hidden lg:block motion-reduce:!hidden relative">
      <StickyScrollSection scrollHeight={1.5} bgColor="bg-[#1a2618]">
        {(scrollYProgress) => <DesktopContent scrollYProgress={scrollYProgress} />}
      </StickyScrollSection>
    </div>
  );
}

function DesktopContent({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const isReducedMotion = useReducedMotion();

  /* ── Left column text crossfade (crossfade overlap at 0.38-0.42) ── */
  const painOpacity = useTransform(scrollYProgress, [0, 0.30, 0.42], isReducedMotion ? [0, 0, 0] : [1, 1, 0]);
  const solutionOpacity = useTransform(scrollYProgress, [0.38, 0.50], isReducedMotion ? [1, 1] : [0, 1]);

  /* ── Bad card — fully visible initially, crossfades out ── */
  const badOpacity = useTransform(scrollYProgress, [0, 0.30, 0.42], isReducedMotion ? [0, 0, 0] : [1, 1, 0]);

  /* ── Good card — crossfades in (overlaps with bad card fade-out) ── */
  const goodOpacity = useTransform(scrollYProgress, [0.38, 0.50], isReducedMotion ? [1, 1] : [0, 1]);
  const goodScale = useTransform(scrollYProgress, [0.38, 0.50], isReducedMotion ? [1, 1] : [0.96, 1]);
  const goodY = useTransform(scrollYProgress, [0.38, 0.50], isReducedMotion ? [0, 0] : [20, 0]);

  /* ── Good card items — fast stagger, 5% intervals ──
     Each hook call corresponds to goodPoints[0..3].
     If goodPoints changes length, update these hooks to match. */
  const BASE = 0.52;
  const STEP = 0.05;
  const SPAN = 0.06;
  const rm = isReducedMotion;
  const i0Op = useTransform(scrollYProgress, [BASE, BASE + SPAN], rm ? [1, 1] : [0, 1]);
  const i0Y  = useTransform(scrollYProgress, [BASE, BASE + SPAN], rm ? [0, 0] : [10, 0]);
  const i1Op = useTransform(scrollYProgress, [BASE + STEP, BASE + STEP + SPAN], rm ? [1, 1] : [0, 1]);
  const i1Y  = useTransform(scrollYProgress, [BASE + STEP, BASE + STEP + SPAN], rm ? [0, 0] : [10, 0]);
  const i2Op = useTransform(scrollYProgress, [BASE + STEP * 2, BASE + STEP * 2 + SPAN], rm ? [1, 1] : [0, 1]);
  const i2Y  = useTransform(scrollYProgress, [BASE + STEP * 2, BASE + STEP * 2 + SPAN], rm ? [0, 0] : [10, 0]);
  const i3Op = useTransform(scrollYProgress, [BASE + STEP * 3, BASE + STEP * 3 + SPAN], rm ? [1, 1] : [0, 1]);
  const i3Y  = useTransform(scrollYProgress, [BASE + STEP * 3, BASE + STEP * 3 + SPAN], rm ? [0, 0] : [10, 0]);
  const items = [
    { opacity: i0Op, y: i0Y },
    { opacity: i1Op, y: i1Y },
    { opacity: i2Op, y: i2Y },
    { opacity: i3Op, y: i3Y },
  ];
  // Guard: items array must match goodPoints length
  if (process.env.NODE_ENV === 'development' && items.length !== goodPoints.length) {
    console.error(`[Comparison] items.length (${items.length}) !== goodPoints.length (${goodPoints.length}). Update useTransform hooks.`);
  }

  /* ── Good card glow ── */
  const glowOp = useTransform(scrollYProgress, [0.70, 0.85], [0, 0.18]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-10 xl:gap-16 items-center">
      {/* ─── LEFT: Text ─── */}
      <div className="flex flex-col gap-5">
        <span className="text-brand-secondary font-bold text-sm tracking-widest uppercase">
          Why KhakiSketch?
        </span>
        <h2 className="font-bold text-4xl xl:text-5xl text-white tracking-tight leading-tight break-keep">
          외주 개발, 이런 경험
          <br />
          없으셨나요?
        </h2>

        {/* Switchable text area */}
        <div className="relative min-h-[130px]">
          {/* Pain (synced with bad card) */}
          <motion.div className="flex flex-col gap-3" style={{ opacity: painOpacity }}>
            <p className="text-white/70 text-lg leading-relaxed break-keep">
              &ldquo;디자인만 예쁘고 작동은 안 해요.&rdquo;
              <br />
              &ldquo;개발자 얼굴도 못 봤어요.&rdquo;
            </p>
            <p className="text-white/70 text-base leading-relaxed break-keep">
              외주 프로젝트 10건 중 7건이 기대 이하로 끝납니다.{' '}
              <strong className="text-white">비즈니스 이해도 부족</strong>이 원인입니다.
            </p>
          </motion.div>

          {/* Solution (synced with good card) */}
          <motion.div className="absolute inset-0 flex flex-col gap-3" style={{ opacity: solutionOpacity }}>
            <p className="text-white text-lg leading-relaxed break-keep font-medium">
              카키스케치는 <strong className="text-brand-secondary">다릅니다.</strong>
            </p>
            <p className="text-white/70 text-base leading-relaxed break-keep">
              기획부터 함께하고, 비즈니스를 이해한 코드를 작성합니다.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ─── RIGHT: Card crossfade area ─── */}
      <div className="grid [&>*]:col-start-1 [&>*]:row-start-1">
        {/* Bad Card */}
        <motion.div
          className="flex flex-col p-8 xl:p-10 rounded-3xl border border-white/10 bg-white/[0.08]"
          style={{ opacity: badOpacity }}
        >
          <div className="mb-5">
            <span className="px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 text-sm font-bold">
              일반적인 외주 에이전시
            </span>
          </div>
          <h3 className="text-xl xl:text-2xl font-bold text-white/80 mb-6 leading-snug">
            &ldquo;그냥 시키는 대로만
            <br />
            만들어 드립니다.&rdquo;
          </h3>
          <ul className="flex flex-col gap-4 text-white/70">
            {badPoints.map((p, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="text-red-400 font-bold text-lg leading-tight shrink-0">✕</span>
                <span className="leading-relaxed">{p}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Good Card */}
        <motion.div
          className="relative flex flex-col p-8 xl:p-10 rounded-3xl border border-brand-secondary/40 bg-brand-secondary/15 text-white shadow-2xl shadow-brand-secondary/10 overflow-hidden"
          style={{ opacity: goodOpacity, scale: goodScale, y: goodY }}
        >
          {/* Glow */}
          <motion.div
            className="absolute -top-20 -right-20 w-60 h-60 bg-brand-secondary rounded-full blur-3xl pointer-events-none"
            style={{ opacity: glowOp }}
          />

          <div className="relative z-10">
            <div className="mb-5">
              <span className="inline-block px-3 py-1.5 rounded-full bg-brand-secondary text-white text-sm font-bold shadow-md">
                Khaki Sketch Studio
              </span>
            </div>
            <h3 className="text-xl xl:text-2xl font-bold text-white mb-6 leading-snug">
              &ldquo;비즈니스 파트너처럼
              <br />
              함께 고민합니다.&rdquo;
            </h3>
            <ul className="flex flex-col gap-4 text-white/90">
              {goodPoints.map((point, i) => (
                <motion.li key={i} className="flex gap-3 items-start" style={items[i] ?? {}}>
                  <span className="text-brand-secondary font-bold text-lg leading-tight shrink-0">✓</span>
                  <span className={`leading-relaxed ${i === 0 ? 'font-semibold' : ''}`}>{point}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Export
   ──────────────────────────────────────────── */
export default function Comparison() {
  return (
    <section id="comparison" className="w-full" aria-label="카키스케치와 일반 에이전시 비교">
      <ComparisonDesktop />
      <ComparisonMobile />
    </section>
  );
}
