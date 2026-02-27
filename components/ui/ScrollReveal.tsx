'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ANIMATION } from '@/lib/animation-config';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'left' | 'right' | 'scale';
  once?: boolean;
}

export default function ScrollReveal({
  children,
  delay = 0,
  className = "",
  direction = 'up',
  once = true,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  // If user prefers reduced motion, render without animation
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const getVariants = () => {
    switch (direction) {
      case 'left':
        return ANIMATION.variants.fadeInLeft;
      case 'right':
        return ANIMATION.variants.fadeInRight;
      case 'scale':
        return ANIMATION.variants.scaleIn;
      default:
        return ANIMATION.variants.fadeInUp;
    }
  };

  const selectedVariants = getVariants();

  return (
    <motion.div
      className={className}
      initial={selectedVariants.initial}
      whileInView={selectedVariants.animate}
      viewport={{ once, margin: "-50px" }}
      transition={{
        duration: ANIMATION.duration.normal,
        delay: delay / 1000,
        ease: ANIMATION.easing,
      }}
    >
      {children}
    </motion.div>
  );
}
