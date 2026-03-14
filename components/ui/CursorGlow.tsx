'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Soft glowing circle that follows the mouse cursor.
 * Adds a premium interactive feel across the entire page.
 *
 * - Hidden on touch devices and mobile (<1024px)
 * - Disabled when prefers-reduced-motion
 * - pointer-events: none (no click interference)
 */
export default function CursorGlow() {
  const prefersReducedMotion = useReducedMotion();
  const isVisibleRef = useRef(false);
  const opacityValue = useMotionValue(0);

  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  // Smooth spring follow with slight lag for organic feel
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        opacityValue.set(1);
      }
    },
    [mouseX, mouseY, opacityValue],
  );

  const handleMouseLeave = useCallback(() => {
    isVisibleRef.current = false;
    opacityValue.set(0);
  }, [opacityValue]);

  useEffect(() => {
    // Skip on touch devices or narrow screens
    if (prefersReducedMotion) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.innerWidth < 1024) return;

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave, prefersReducedMotion]);

  // Don't render on reduced motion or SSR
  if (prefersReducedMotion) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] hidden lg:block"
      style={{ x, y, translateX: '-50%', translateY: '-50%', opacity: opacityValue }}
      transition={{ opacity: { duration: 0.3 } }}
    >
      {/* Outer soft glow */}
      <div
        className="w-[400px] h-[400px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(116, 153, 101, 0.07) 0%, rgba(116, 153, 101, 0.03) 40%, transparent 70%)',
        }}
      />
      {/* Inner bright core */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80px] h-[80px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(116, 153, 101, 0.08) 0%, transparent 70%)',
        }}
      />
    </motion.div>
  );
}
