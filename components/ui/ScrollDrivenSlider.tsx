'use client';

import React, { useState, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ScrollDrivenSliderProps {
  /** Section id for anchor links */
  id?: string;
  /** Background color class */
  bgColor?: string;
  /** Left-side header content (title, subtitle, etc.) */
  header: React.ReactNode;
  /** Array of card elements to slide through */
  cards: React.ReactNode[];
  /** Optional footer content below the header (CTA links, etc.) */
  footer?: React.ReactNode;
  /** Height multiplier of viewport height. Default: cards.length + 0.5 */
  scrollHeight?: number;
  /** Dark mode — adjusts progress indicator colors for dark backgrounds */
  darkMode?: boolean;
}

// ─── Individual card with scroll-driven transforms ───

function SliderCard({
  children,
  index,
  total,
  scrollYProgress,
  reducedMotion = false,
}: {
  children: React.ReactNode;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  reducedMotion?: boolean;
}) {
  const segmentSize = 1 / total;
  const crossfade = segmentSize * 0.15; // half-duration of crossfade overlap
  const isFirst = index === 0;
  const isLast = index === total - 1;

  const segStart = index * segmentSize;
  const segEnd = (index + 1) * segmentSize;

  let xInput: number[];
  let xOutput: string[];
  let opacityInput: number[];
  let opacityOutput: number[];
  let scaleInput: number[];
  let scaleOutput: number[];

  if (reducedMotion) {
    // Reduced motion: keep scroll-driven layout, instant card switch (no slide/scale)
    const EPS = 0.005;
    xInput = [0, 1];
    xOutput = ['0%', '0%'];
    scaleInput = [0, 1];
    scaleOutput = [1, 1];
    if (total === 1) {
      opacityInput = [0, 1];
      opacityOutput = [1, 1];
    } else if (isFirst) {
      opacityInput = [segEnd - EPS, segEnd];
      opacityOutput = [1, 0];
    } else if (isLast) {
      opacityInput = [segStart, segStart + EPS];
      opacityOutput = [0, 1];
    } else {
      opacityInput = [segStart, segStart + EPS, segEnd - EPS, segEnd];
      opacityOutput = [0, 1, 1, 0];
    }
  } else if (total === 1) {
    xInput = [0, 1];
    xOutput = ['0%', '0%'];
    opacityInput = [0, 1];
    opacityOutput = [1, 1];
    scaleInput = [0, 1];
    scaleOutput = [1, 1];
  } else if (isFirst) {
    const exitStart = segEnd - crossfade;
    const exitEnd = Math.min(1, segEnd + crossfade);
    xInput = [0, exitStart, exitEnd];
    xOutput = ['0%', '0%', '-80%'];
    opacityInput = [0, exitStart, exitEnd];
    opacityOutput = [1, 1, 0];
    scaleInput = [0, exitStart, exitEnd];
    scaleOutput = [1, 1, 0.93];
  } else if (isLast) {
    const enterStart = Math.max(0, segStart - crossfade);
    const enterEnd = segStart + crossfade;
    xInput = [enterStart, enterEnd, 1];
    xOutput = ['80%', '0%', '0%'];
    opacityInput = [enterStart, enterEnd, 1];
    opacityOutput = [0, 1, 1];
    scaleInput = [enterStart, enterEnd, 1];
    scaleOutput = [0.93, 1, 1];
  } else {
    const enterStart = Math.max(0, segStart - crossfade);
    const enterEnd = segStart + crossfade;
    const exitStart = segEnd - crossfade;
    const exitEnd = Math.min(1, segEnd + crossfade);
    xInput = [enterStart, enterEnd, exitStart, exitEnd];
    xOutput = ['80%', '0%', '0%', '-80%'];
    opacityInput = [enterStart, enterEnd, exitStart, exitEnd];
    opacityOutput = [0, 1, 1, 0];
    scaleInput = [enterStart, enterEnd, exitStart, exitEnd];
    scaleOutput = [0.93, 1, 1, 0.93];
  }

  const x = useTransform(scrollYProgress, xInput, xOutput);
  const opacity = useTransform(scrollYProgress, opacityInput, opacityOutput);
  const scale = useTransform(scrollYProgress, scaleInput, scaleOutput);
  const pointerEvents = useTransform(opacity, (v) =>
    v > 0.5 ? 'auto' : 'none',
  );

  return (
    <motion.div
      className="col-start-1 row-start-1 w-full will-change-transform"
      style={{ x, opacity, scale, pointerEvents }}
    >
      {children}
    </motion.div>
  );
}

// ─── Progress indicator (01 / 03 + dots) ───

function ProgressIndicator({
  scrollYProgress,
  total,
  darkMode = false,
}: {
  scrollYProgress: MotionValue<number>;
  total: number;
  darkMode?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const idx = Math.max(0, Math.min(Math.floor(latest * total), total - 1));
    setActiveIndex(idx);
  });

  return (
    <div className="flex items-center gap-4 mt-8">
      <span className={`text-4xl font-bold font-mono tabular-nums leading-none ${darkMode ? 'text-white' : 'text-brand-primary'}`}>
        {String(activeIndex + 1).padStart(2, '0')}
      </span>
      <div className="flex flex-col gap-2">
        <span className={`text-sm font-mono ${darkMode ? 'text-white/50' : 'text-brand-muted'}`}>
          / {String(total).padStart(2, '0')}
        </span>
        <div className="flex gap-1.5">
          {Array.from({ length: total }, (_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'w-6 bg-brand-secondary'
                  : `w-1.5 ${darkMode ? 'bg-white/20' : 'bg-gray-300'}`
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───

export default function ScrollDrivenSlider({
  id,
  bgColor = '',
  header,
  cards,
  footer,
  scrollHeight: scrollHeightProp,
  darkMode = false,
}: ScrollDrivenSliderProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const isReducedMotion = useReducedMotion();
  const scrollHeight = scrollHeightProp ?? cards.length + 0.5;

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section ref={outerRef} id={id} className={`w-full ${bgColor}`}>
      {/* ─── Mobile (<lg): horizontal snap carousel ─── */}
      <div className="lg:hidden py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-6">{header}</div>
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 scrollbar-hide" role="region" aria-roledescription="carousel" aria-label="카드 캐러셀">
            {cards.map((card, i) => (
              <div key={i} className="snap-center shrink-0 w-[80vw] max-w-sm">
                {card}
              </div>
            ))}
          </div>
          {footer && <div className="mt-6">{footer}</div>}
        </div>
      </div>

      {/* ─── Desktop (lg+): scroll-driven horizontal slider ─── */}
      <div
        className="hidden lg:block relative"
        style={{ height: `${scrollHeight * 100}vh` }}
      >
        <div className="sticky top-0 min-h-screen flex items-center">
          <div className="w-full max-w-7xl mx-auto px-8 py-12">
            <div className="grid grid-cols-5 gap-12 items-start">
              {/* Left column: header + progress + footer */}
              <div className="col-span-2 flex flex-col justify-center">
                {header}
                <ProgressIndicator
                  scrollYProgress={scrollYProgress}
                  total={cards.length}
                  darkMode={darkMode}
                />
                {footer && <div className="mt-8">{footer}</div>}
              </div>

              {/* Right column: sliding cards */}
              <div className="col-span-3 grid grid-cols-1 grid-rows-1 overflow-hidden rounded-2xl">
                {cards.map((card, i) => (
                  <SliderCard
                    key={i}
                    index={i}
                    total={cards.length}
                    scrollYProgress={scrollYProgress}
                    reducedMotion={isReducedMotion}
                  >
                    {card}
                  </SliderCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
