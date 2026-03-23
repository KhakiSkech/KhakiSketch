'use client';

import { useRef } from 'react';
import { useScroll, type MotionValue } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface StickyScrollSectionProps {
  /** Render prop that receives scrollYProgress (0-1) */
  children: (scrollYProgress: MotionValue<number>) => React.ReactNode;
  /** Height multiplier of viewport height for scroll distance. Default: 2 */
  scrollHeight?: number;
  /** Background color class. Default: '' */
  bgColor?: string;
  /** Section id for anchor links */
  id?: string;
  /** Additional classes for the outer container */
  className?: string;
  /** Additional classes for the sticky inner container */
  innerClassName?: string;
}

/**
 * Creates a tall scroll container with sticky inner content.
 * Content stays pinned while user scrolls through the extended height.
 * On mobile (<1024px), falls back to normal scrolling layout.
 */
export default function StickyScrollSection({
  children,
  scrollHeight = 2,
  bgColor = '',
  id,
  className = '',
  innerClassName = '',
}: StickyScrollSectionProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const isReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  });

  // Reduced motion: render static content at full visibility (no scroll-driven animation)
  if (isReducedMotion) {
    return (
      <section id={id} ref={outerRef} className={`w-full ${bgColor} ${className}`}>
        <div className={`max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 ${innerClassName}`}>
          {children(scrollYProgress)}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={outerRef}
      id={id}
      className={`relative w-full ${bgColor} ${className}`}
      style={{ height: `${scrollHeight * 100}vh` }}
    >
      {/* Mobile: normal flow, Desktop: sticky pinned */}
      <div
        className={`
          lg:sticky lg:top-0 lg:min-h-screen
          flex items-center
          ${innerClassName}
        `}
      >
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-12">
          {children(scrollYProgress)}
        </div>
      </div>
    </section>
  );
}
