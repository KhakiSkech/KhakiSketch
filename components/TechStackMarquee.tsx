'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Simple SVG Logo Components
const techLogos: { [key: string]: React.FC<{ className?: string }> } = {
    'Next.js': ({ className }) => (
        <svg className={className} viewBox="0 0 180 180" fill="currentColor">
            <path d="M90 0C40.3 0 0 40.3 0 90s40.3 90 90 90 90-40.3 90-90S139.7 0 90 0zm45.9 145.9L90 90.7V45l45.9 100.9z" />
        </svg>
    ),
    'React': ({ className }) => (
        <svg className={className} viewBox="0 0 841.9 595.3" fill="currentColor">
            <g><circle cx="420.9" cy="296.5" r="45.7" /><path d="M666.3 296.5c0-32.5-40.7-63.3-103.1-82.4 14.4-63.6 8-114.2-20.2-130.4-6.5-3.8-14.1-5.6-22.4-5.6v22.3c4.6 0 8.3.9 11.4 2.6 13.6 7.8 19.5 37.5 14.9 75.7-1.1 9.4-2.9 19.3-5.1 29.4-19.6-4.8-41-8.5-63.5-10.9-13.5-18.5-27.5-35.3-41.6-50 32.6-30.3 63.2-46.9 84-46.9V22c-27.5 0-63.5 19.6-99.9 53.6-36.4-33.8-72.4-53.2-99.9-53.2v22.3c20.7 0 51.4 16.5 84 46.6-14 14.7-28 31.4-41.3 49.9-22.6 2.4-44 6.1-63.6 11-2.3-10-4-19.7-5.2-29-4.7-38.2 1.1-67.9 14.6-75.8 3-1.8 6.9-2.6 11.5-2.6V22.3c-8.4 0-16 1.8-22.6 5.6-28.1 16.2-34.4 66.7-19.9 130.1-62.2 19.2-102.7 49.9-102.7 82.3 0 32.5 40.7 63.3 103.1 82.4-14.4 63.6-8 114.2 20.2 130.4 6.5 3.8 14.1 5.6 22.5 5.6 27.5 0 63.5-19.6 99.9-53.6 36.4 33.8 72.4 53.2 99.9 53.2 8.4 0 16-1.8 22.6-5.6 28.1-16.2 34.4-66.7 19.9-130.1 62-19.1 102.5-49.9 102.5-82.3zm-130.2-66.7c-3.7 12.9-8.3 26.2-13.5 39.5-4.1-8-8.4-16-13.1-24-4.6-8-9.5-15.8-14.4-23.4 14.2 2.1 27.9 4.7 41 7.9zm-45.8 106.5c-7.8 13.5-15.8 26.3-24.1 38.2-14.9 1.3-30 2-45.2 2-15.1 0-30.2-.7-45-1.9-8.3-11.9-16.4-24.6-24.2-38-7.6-13.1-14.5-26.4-20.8-39.8 6.2-13.4 13.2-26.8 20.7-39.9 7.8-13.5 15.8-26.3 24.1-38.2 14.9-1.3 30-2 45.2-2 15.1 0 30.2.7 45 1.9 8.3 11.9 16.4 24.6 24.2 38 7.6 13.1 14.5 26.4 20.8 39.8-6.3 13.4-13.2 26.8-20.7 39.9zm32.3-13c5.4 13.4 10 26.8 13.8 39.8-13.1 3.2-26.9 5.9-41.2 8 4.9-7.7 9.8-15.6 14.4-23.7 4.6-8 8.9-16.1 13-24.1zM421.2 430c-9.3-9.6-18.6-20.3-27.8-32 9 .4 18.2.7 27.5.7 9.4 0 18.7-.2 27.8-.7-9 11.7-18.3 22.4-27.5 32zm-74.4-58.9c-14.2-2.1-27.9-4.7-41-7.9 3.7-12.9 8.3-26.2 13.5-39.5 4.1 8 8.4 16 13.1 24 4.7 8 9.5 15.8 14.4 23.4zM420.7 163c9.3 9.6 18.6 20.3 27.8 32-9-.4-18.2-.7-27.5-.7-9.4 0-18.7.2-27.8.7 9-11.7 18.3-22.4 27.5-32zm-74 58.9c-4.9 7.7-9.8 15.6-14.4 23.7-4.6 8-8.9 16-13 24-5.4-13.4-10-26.8-13.8-39.8 13.1-3.1 26.9-5.8 41.2-7.9zm-90.5 125.2c-35.4-15.1-58.3-34.9-58.3-50.6 0-15.7 22.9-35.6 58.3-50.6 8.6-3.7 18-7 27.7-10.1 5.7 19.6 13.2 40 22.5 60.9-9.2 20.8-16.6 41.1-22.2 60.6-9.9-3.1-19.3-6.5-28-10.2zM310 490c-13.6-7.8-19.5-37.5-14.9-75.7 1.1-9.4 2.9-19.3 5.1-29.4 19.6 4.8 41 8.5 63.5 10.9 13.5 18.5 27.5 35.3 41.6 50-32.6 30.3-63.2 46.9-84 46.9-4.5-.1-8.3-1-11.3-2.7zm237.2-76.2c4.7 38.2-1.1 67.9-14.6 75.8-3 1.8-6.9 2.6-11.5 2.6-20.7 0-51.4-16.5-84-46.6 14-14.7 28-31.4 41.3-49.9 22.6-2.4 44-6.1 63.6-11 2.3 10.1 4.1 19.8 5.2 29.1zm38.5-66.7c-8.6 3.7-18 7-27.7 10.1-5.7-19.6-13.2-40-22.5-60.9 9.2-20.8 16.6-41.1 22.2-60.6 9.9 3.1 19.3 6.5 28.1 10.2 35.4 15.1 58.3 34.9 58.3 50.6-.1 15.7-23 35.6-58.4 50.6z" /></g>
        </svg>
    ),
    'TypeScript': ({ className }) => (
        <svg className={className} viewBox="0 0 256 256" fill="currentColor">
            <path d="M0 128v128h256V0H0v128zm141.88-40.48h40.77v20.34h-61.48v-20.34h20.71zm-41.24 60.73c2.61 5.31 7.81 8.42 13.84 8.42 5.41 0 8.85-2.71 8.85-6.45 0-4.48-3.57-6.07-9.53-8.68l-3.27-1.4c-9.47-4.03-15.76-9.09-15.76-19.78 0-9.85 7.5-17.35 19.24-17.35 8.35 0 14.35 2.91 18.66 10.54l-10.22 6.56c-2.25-4.03-4.67-5.61-8.44-5.61-3.84 0-6.27 2.44-6.27 5.61 0 3.93 2.43 5.52 8.06 7.95l3.27 1.4c11.17 4.79 17.46 9.66 17.46 20.63 0 11.82-9.28 18.3-21.74 18.3-12.18 0-20.06-5.8-23.93-13.43l10.82-6.23z" />
        </svg>
    ),
    'Python': ({ className }) => (
        <svg className={className} viewBox="0 0 256 255" fill="currentColor">
            <defs><linearGradient id="python" x1="12%" x2="79%" y1="12%" y2="78%"><stop offset="0%" stopColor="currentColor" /><stop offset="100%" stopColor="currentColor" /></linearGradient></defs>
            <path fill="url(#python)" d="M126.916.072c-64.832 0-60.784 28.115-60.784 63.125v23.003h60.784v8.68H40.845C19.313 94.78 0 111.76 0 176.774c0 65.014 18.814 62.66 42.286 62.66h22.667v-31.918c0-25.768 22.286-48.517 48.487-48.517h60.784v-.2c22.23 0 40.197-18.292 40.197-40.522V63.197C214.421 38.429 201.286.072 126.916.072M91.94 26.428c8.285 0 15.01 6.726 15.01 15.01 0 8.286-6.725 15.01-15.01 15.01-8.285 0-15.01-6.724-15.01-15.01 0-8.284 6.725-15.01 15.01-15.01z" />
        </svg>
    ),
    'FastAPI': ({ className }) => (
        <svg className={className} viewBox="0 0 256 256" fill="currentColor">
            <rect x="0" y="0" width="256" height="256" fill="none" /><path d="M128 0L228.8 192H27.2z M128 160l-32-64h64z" />
        </svg>
    ),
    'PostgreSQL': ({ className }) => (
        <svg className={className} viewBox="0 0 256 263" fill="currentColor">
            <path d="M255.008 158.086s-23.632 17.226-67.545 17.226c-50.603 0-76.612-24.717-76.612-24.717l-5.724 12.348s23.81 30.465 81.616 30.465c60.175 0 68.265-35.322 68.265-35.322zm0 0" />
        </svg>
    ),
    'Flutter': ({ className }) => (
        <svg className={className} viewBox="0 0 256 317" fill="currentColor">
            <path d="M157.667 0L0 157.667 48.8 206.5l157.867-157.834zm0 145.467l-90.934 90.933 48.8 48.8L256 145.467z" />
        </svg>
    ),
    'Supabase': ({ className }) => (
        <svg className={className} viewBox="0 0 256 263" fill="currentColor">
            <path d="M141.03 256.2c-7.75 9.42-22.77 3.56-21.45-8.37l15.96-144.07H53.01c-11.12 0-17.65-12.45-11.37-21.69L133.51 6.86c7.75-9.42 22.77-3.56 21.45 8.37L139 159.3h82.53c11.12 0 17.65 12.45 11.37 21.69L141.03 256.2z" />
        </svg>
    ),
    'Tailwind CSS': ({ className }) => (
        <svg className={className} viewBox="0 0 256 154" fill="currentColor">
            <path d="M128 0C93.867 0 72.533 17.067 64 51.2 76.8 34.133 91.733 27.733 108.8 32c9.737 2.434 16.697 9.499 24.401 17.318C145.751 62.057 160.275 76.8 192 76.8c34.133 0 55.467-17.067 64-51.2-12.8 17.067-27.733 23.467-44.8 19.2-9.737-2.434-16.697-9.499-24.401-17.318C174.249 14.743 159.725 0 128 0zM64 76.8C29.867 76.8 8.533 93.867 0 128c12.8-17.067 27.733-23.467 44.8-19.2 9.737 2.434 16.697 9.499 24.401 17.318C81.751 138.857 96.275 153.6 128 153.6c34.133 0 55.467-17.067 64-51.2-12.8 17.067-27.733 23.467-44.8 19.2-9.737-2.434-16.697-9.499-24.401-17.318C110.249 91.543 95.725 76.8 64 76.8z" />
        </svg>
    ),
    'AWS': ({ className }) => (
        <svg className={className} viewBox="0 0 256 153" fill="currentColor">
            <path d="M72.436 122.519c0 3.585-0.459 6.482-1.339 8.639-0.906 2.157-2.27 4.391-4.088 6.702-1.537 1.92-3.073 3.328-4.638 4.226-1.564 0.899-3.407 1.357-5.528 1.357-2.963 0-5.626-1.152-7.986-3.43-2.36-2.305-3.547-5.195-3.547-8.696 0-3.533 1.187-6.397 3.547-8.639 2.36-2.203 5.023-3.328 7.986-3.328 2.121 0 3.964 0.408 5.528 1.254 1.565 0.847 3.101 2.23 4.638 4.123 1.818 2.305 3.182 4.588 4.088 6.847 0.88 2.259 1.339 5.182 1.339 8.766V122.519z" />
        </svg>
    ),
};

const techs = [
    { name: 'Next.js', color: '#000000' },
    { name: 'React', color: '#61DAFB' },
    { name: 'TypeScript', color: '#3178C6' },
    { name: 'Python', color: '#3776AB' },
    { name: 'FastAPI', color: '#009688' },
    { name: 'PostgreSQL', color: '#4169E1' },
    { name: 'Flutter', color: '#02569B' },
    { name: 'Supabase', color: '#3ECF8E' },
    { name: 'Tailwind CSS', color: '#06B6D4' },
    { name: 'AWS', color: '#FF9900' },
];

function TechItem({ tech }: { tech: { name: string; color: string } }) {
    const LogoComponent = techLogos[tech.name];
    return (
        <div className="flex items-center gap-4 group cursor-default">
            {LogoComponent && (
                <motion.div
                    className="w-8 h-8 lg:w-10 lg:h-10 transition-all duration-300"
                    style={{ color: tech.color }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                >
                    <LogoComponent className="w-full h-full grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" />
                </motion.div>
            )}
            {!LogoComponent && (
                <div
                    className="w-2 h-2 rounded-full transition-all duration-300 grayscale group-hover:grayscale-0"
                    style={{ backgroundColor: tech.color, opacity: 0.4 }}
                />
            )}
            <span className="text-lg lg:text-xl font-bold font-sans text-brand-muted group-hover:text-brand-primary transition-colors duration-300 tracking-tight">
                {tech.name}
            </span>
        </div>
    );
}

export default function TechStackMarquee() {
    const isReducedMotion = useReducedMotion();
    const [isPaused, setIsPaused] = useState(false);

    return (
        <div className="w-full py-2 lg:py-3 overflow-hidden select-none relative">
            <div
                className="relative w-full overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Fade Overlay Left */}
                <div className="absolute left-0 top-0 bottom-0 w-32 z-20 bg-gradient-to-r from-brand-bg to-transparent pointer-events-none" />
                {/* Fade Overlay Right */}
                <div className="absolute right-0 top-0 bottom-0 w-32 z-20 bg-gradient-to-l from-brand-bg to-transparent pointer-events-none" />

                <motion.div
                    className="flex whitespace-nowrap gap-12 lg:gap-20 items-center px-4 py-3"
                    animate={isReducedMotion ? {} : { x: ["0%", "-50%"] }}
                    transition={isReducedMotion ? {} : {
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: isPaused ? 80 : 40,
                            ease: "linear",
                        },
                    }}
                    style={{ width: "fit-content" }}
                >
                    {/* First Set + Duplicate for seamless loop */}
                    {[...techs, ...techs].map((tech, i) => (
                        <TechItem key={`${tech.name}-${i}`} tech={tech} />
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
