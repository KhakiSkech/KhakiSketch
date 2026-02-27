'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface ProjectCardProps {
  pattern: React.ElementType;
  imageUrl?: string;
  title: string;
  description: string;
  tag: string;
  tech?: string;
  href?: string;
  enable3DTilt?: boolean;
}

export default function ProjectCard({
  pattern: Pattern,
  imageUrl,
  title,
  description,
  tag,
  tech,
  href = '/portfolio',
  enable3DTilt = true,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Disable interactive effects on touch devices or reduced motion
  const enableEffects = enable3DTilt && !prefersReducedMotion;

  // Mouse position values for 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotation
  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 30 });

  // Transform springs to degrees
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableEffects || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const [imageLoaded, setImageLoaded] = useState(false);
  const isInternal = tag.includes('SAMPLE') || tag.includes('PROTOTYPE');

  const cardContent = (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: enableEffects ? rotateX : 0,
        rotateY: enableEffects ? rotateY : 0,
        transformStyle: "preserve-3d",
      }}
      whileHover={{
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.2)",
      }}
      className="bg-white flex flex-col rounded-2xl shadow-md w-full overflow-hidden cursor-pointer border border-gray-100 h-full relative group"
    >
      {/* Image Container */}
      <div className="h-[240px] w-full relative overflow-hidden bg-gray-50 flex items-center justify-center">
        {/* Skeleton placeholder */}
        {imageUrl && !imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center scale-105">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <Pattern />
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-brand-primary/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {isInternal && (
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider z-10">
            INTERNAL PROJECT
          </div>
        )}

        {/* CTA Button */}
        <div className="absolute px-5 py-2.5 bg-white/95 backdrop-blur-sm rounded-full text-brand-primary font-bold text-sm bottom-4 right-4 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <span className="flex items-center gap-2">
            View Case Study
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div
        className="flex flex-col gap-3 p-8 bg-white relative"
        style={{ transform: enableEffects ? "translateZ(40px)" : undefined }}
      >
        {/* Tag */}
        <span className="text-brand-secondary font-bold text-xs tracking-wider uppercase bg-brand-secondary/10 w-fit px-3 py-1.5 rounded-lg">
          {tag}
        </span>

        <h3 className="font-bold text-brand-primary text-2xl tracking-tight leading-snug group-hover:text-brand-secondary transition-colors duration-300">
          {title}
        </h3>

        <p className="font-medium text-brand-muted text-lg leading-relaxed break-keep">
          {description}
        </p>

        {tech && (
          <div className="mt-2 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {tech.split(' / ').map((item, idx) => (
                <span
                  key={idx}
                  className="text-xs text-brand-muted font-mono bg-gray-50 px-2 py-1 rounded hover:bg-brand-secondary/10 hover:text-brand-secondary transition-colors"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {isInternal && (
          <p className="text-[11px] text-gray-400 mt-2 italic">
            ※ 직접 제작한 프로토타입 예시입니다.
          </p>
        )}
      </div>
    </motion.div>
  );

  return (
    <Link href={href} className="block relative h-full" style={{ perspective: enableEffects ? "1000px" : undefined }}>
      {cardContent}
    </Link>
  );
}
