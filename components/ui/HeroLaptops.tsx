'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ANIMATION } from '@/lib/animation-config';

const DEFAULT_IMAGE_BACK = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80';
const DEFAULT_IMAGE_FRONT = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80';

interface HeroLaptopsProps {
  imageBack?: string;
  imageFront?: string;
}

// SVG rocket icon replacing emoji
function RocketIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#749965"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

interface LaptopProps {
  imageUrl: string;
  imageAlt: string;
  isFront: boolean;
  isSwapped: boolean;
  onClick: () => void;
  prefersReducedMotion: boolean;
}

function Laptop({ imageUrl, imageAlt, isFront, isSwapped, onClick, prefersReducedMotion }: LaptopProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Position: front is bottom-right, back is top-left
  // After swap: they exchange positions
  const frontStyle: React.CSSProperties = isSwapped
    ? { left: 0, top: 0, width: 460, zIndex: 1 }
    : { right: 0, bottom: 0, width: 460, zIndex: 2 };

  const backStyle: React.CSSProperties = isSwapped
    ? { right: 0, bottom: 0, width: 460, zIndex: 2 }
    : { left: 0, top: 0, width: 460, zIndex: 1 };

  const positionStyle = isFront ? frontStyle : backStyle;

  // Float animation parameters differ per laptop for phase offset
  const floatAnim = prefersReducedMotion
    ? {}
    : isFront
    ? {
        y: [0, -12, 0],
        rotate: [-1, -1, -1],
        transition: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' as const },
      }
    : {
        y: [-6, -18, -6],
        rotate: [-2.5, -2.5, -2.5],
        scale: [0.85, 0.85, 0.85],
        transition: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.8 },
      };

  const hoverScale = isHovered && !prefersReducedMotion ? 1.02 : 1;
  const shadowClass = isFront
    ? isHovered
      ? 'shadow-[0_32px_64px_rgba(0,0,0,0.35)]'
      : 'shadow-2xl'
    : isHovered
    ? 'shadow-[0_20px_48px_rgba(0,0,0,0.28)]'
    : 'shadow-xl';

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={positionStyle}
      layout
      layoutId={isFront ? 'laptop-front' : 'laptop-back'}
      transition={{ duration: 0.6, ease: ANIMATION.easing }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={prefersReducedMotion ? {} : { scale: hoverScale }}
    >
      <motion.div animate={floatAnim}>
        {/* Screen bezel */}
        <div
          className={`relative rounded-t-2xl rounded-b-md overflow-hidden ${shadowClass} transition-shadow duration-300`}
          style={{
            background: '#1a1a1a',
            padding: isFront ? '12px 12px 0 12px' : '10px 10px 0 10px',
          }}
        >
          {/* Camera dot */}
          <div
            className="absolute left-1/2 -translate-x-1/2 rounded-full bg-gray-600"
            style={{ top: isFront ? 10 : 8, width: isFront ? 8 : 6, height: isFront ? 8 : 6 }}
          />
          {/* Screen */}
          <div
            className="rounded-t-lg overflow-hidden"
            style={{ background: '#0d1117', aspectRatio: '16/10' }}
          >
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </div>

        {/* Hinge */}
        <div
          className="rounded-b-xl w-full"
          style={{
            height: isFront ? 12 : 10,
            background: 'linear-gradient(180deg,#2a2a2a,#1a1a1a)',
          }}
        />

        {/* Base */}
        <div
          className="mx-auto rounded-b-2xl"
          style={{
            width: '95%',
            height: isFront ? 12 : 10,
            background: 'linear-gradient(180deg,#c8c8c8,#b0b0b0)',
          }}
        />
        <div
          className="mx-auto mt-1 rounded-sm"
          style={{
            width: '30%',
            height: isFront ? 8 : 6,
            background: 'rgba(180,180,180,0.5)',
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function HeroLaptops({
  imageBack = DEFAULT_IMAGE_BACK,
  imageFront = DEFAULT_IMAGE_FRONT,
}: HeroLaptopsProps) {
  const prefersReducedMotion = useReducedMotion();
  const [swapped, setSwapped] = useState(false);

  const handleSwap = () => setSwapped((prev) => !prev);

  return (
    <div className="relative flex items-center justify-center">
      <div className="relative" style={{ width: 560, height: 400 }}>
        <AnimatePresence mode="sync">
          {/* Back laptop */}
          <Laptop
            key="back"
            imageUrl={imageBack}
            imageAlt="프로젝트 관리 화면"
            isFront={false}
            isSwapped={swapped}
            onClick={handleSwap}
            prefersReducedMotion={prefersReducedMotion}
          />

          {/* Front laptop */}
          <Laptop
            key="front"
            imageUrl={imageFront}
            imageAlt="대시보드 화면"
            isFront={true}
            isSwapped={swapped}
            onClick={handleSwap}
            prefersReducedMotion={prefersReducedMotion}
          />
        </AnimatePresence>

        {/* Floating badge — project completion */}
        <motion.div
          className="absolute z-10 rounded-xl px-4 py-3 shadow-xl flex items-center gap-3 bg-white border border-brand-secondary/20"
          style={{ bottom: -16, left: -32 }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7, ease: ANIMATION.easing }}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-brand-secondary/15">
            <RocketIcon />
          </div>
          <div>
            <p className="text-xs font-bold text-brand-primary">프로젝트 완료</p>
            <p className="text-xs text-brand-muted">3.2개월 납기</p>
          </div>
        </motion.div>

        {/* Floating badge — live */}
        <motion.div
          className="absolute z-10 rounded-xl px-4 py-3 shadow-xl flex items-center gap-3 bg-white border border-brand-secondary/20"
          style={{ top: -16, right: -16 }}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7, ease: ANIMATION.easing }}
        >
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: '#22c55e', boxShadow: '0 0 6px #22c55e' }}
          />
          <p className="text-xs font-bold text-brand-primary">라이브 운영 중</p>
        </motion.div>

        {/* Click hint */}
        <motion.p
          className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-xs text-brand-muted/60 whitespace-nowrap select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          클릭하여 전환
        </motion.p>
      </div>
    </div>
  );
}
