'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from './ui/ScrollReveal';
import { ANIMATION } from '@/lib/animation-config';

const badPoints = [
    "기획서 없으면 개발 불가능",
    "비즈니스 로직 이해 없이 코드 작성",
    "유지보수 고려 없는 일회성 코드",
    "개발자 얼굴도 못 보고 매니저와 소통",
];

const goodPoints = [
    "Discovery 세션으로 기획부터 참여",
    "User Flow 기반의 탄탄한 설계",
    "확장성을 고려한 모듈형 개발",
    "컴공 전공 대표 개발자와 직접 소통",
];

const Comparison = () => {
    const [activeTab, setActiveTab] = useState<'outsourcing' | 'studio'>('studio');

    const listVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.4, ease: ANIMATION.easing }
        }
    };

    return (
        <section className="bg-white w-full py-20 lg:py-28 border-t border-gray-100 overflow-hidden">
            <div className="w-full max-w-7xl mx-auto px-6 lg:px-8">

                <div className="flex flex-col lg:flex-row gap-16 items-start">
                    {/* Header */}
                    <div className="lg:w-1/3 flex flex-col gap-6 lg:sticky lg:top-24">
                        <ScrollReveal>
                            <div className="flex flex-col gap-4">
                                <span className="text-brand-secondary font-bold tracking-wider uppercase">Why KhakiSketch?</span>
                                <h2 className="font-bold text-4xl lg:text-5xl text-brand-primary tracking-tight leading-tight">
                                    왜 많은 프로젝트가<br />
                                    실패할까요?
                                </h2>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal delay={100}>
                            <p className="text-xl text-brand-muted leading-relaxed break-keep">
                                "디자인만 예쁘고 작동은 안 해요."<br />
                                "개발자와 소통이 너무 힘들어요."<br />
                                <br />
                                대부분의 외주 실패는 <strong>'비즈니스 이해도 부족'</strong>에서 시작됩니다.
                            </p>
                        </ScrollReveal>
                    </div>

                    {/* Comparison Cards */}
                    <div className="lg:w-2/3 w-full grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

                        {/* Bad Case */}
                        <ScrollReveal delay={200} className="h-full">
                            <motion.div
                                className={`relative flex flex-col h-full p-8 rounded-3xl border-2 transition-all duration-500 cursor-pointer ${activeTab === 'outsourcing'
                                    ? 'border-red-200 bg-red-50/50 shadow-xl shadow-red-100/50'
                                    : 'border-gray-100 bg-gray-50/50 opacity-50 hover:opacity-100'
                                    }`}
                                onMouseEnter={() => setActiveTab('outsourcing')}
                                whileHover={{ y: -4 }}
                                animate={{
                                    filter: activeTab === 'outsourcing' ? 'blur(0px)' : 'blur(1px)',
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Glow Effect */}
                                <AnimatePresence>
                                    {activeTab === 'outsourcing' && (
                                        <motion.div
                                            className="absolute inset-0 rounded-3xl bg-gradient-to-br from-red-100/50 to-transparent pointer-events-none"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        />
                                    )}
                                </AnimatePresence>

                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <span className="px-3 py-1.5 rounded-full bg-red-100 text-red-600 text-sm font-bold">
                                            일반적인 외주 에이전시
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-600 mb-6">
                                        "그냥 시키는 대로만<br />만들어 드립니다."
                                    </h3>

                                    <motion.ul
                                        className="flex flex-col gap-4 text-gray-500"
                                        variants={listVariants}
                                        initial="hidden"
                                        animate={activeTab === 'outsourcing' ? "visible" : "hidden"}
                                    >
                                        {badPoints.map((point, index) => (
                                            <motion.li
                                                key={index}
                                                variants={itemVariants}
                                                className="flex gap-3 items-start"
                                            >
                                                <motion.span
                                                    className="text-red-400 font-bold"
                                                    animate={{
                                                        rotate: activeTab === 'outsourcing' ? [0, -10, 10, 0] : 0
                                                    }}
                                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                                >
                                                    ✕
                                                </motion.span>
                                                <span>{point}</span>
                                            </motion.li>
                                        ))}
                                    </motion.ul>
                                </div>
                            </motion.div>
                        </ScrollReveal>

                        {/* Good Case */}
                        <ScrollReveal delay={300} className="h-full">
                            <motion.div
                                className={`relative flex flex-col h-full p-8 rounded-3xl border-2 transition-all duration-500 cursor-pointer overflow-hidden ${activeTab === 'studio'
                                    ? 'border-brand-primary bg-brand-primary text-white shadow-2xl shadow-brand-primary/30'
                                    : 'border-brand-primary/50 bg-brand-primary/90 text-white opacity-80 hover:opacity-100'
                                    }`}
                                onMouseEnter={() => setActiveTab('studio')}
                                whileHover={{ y: -4, scale: 1.02 }}
                                animate={{
                                    filter: activeTab === 'studio' ? 'blur(0px)' : 'blur(1px)',
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Animated Background Glow */}
                                <AnimatePresence>
                                    {activeTab === 'studio' && (
                                        <motion.div
                                            className="absolute -top-20 -right-20 w-60 h-60 bg-brand-secondary/30 rounded-full blur-3xl pointer-events-none"
                                            initial={{ opacity: 0, scale: 0.5 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    )}
                                </AnimatePresence>

                                <div className="relative z-10">
                                    <div className="mb-6">
                                        <motion.span
                                            className="inline-block px-3 py-1.5 rounded-full bg-brand-secondary text-white text-sm font-bold shadow-lg"
                                            animate={activeTab === 'studio' ? {
                                                boxShadow: ['0 0 0 0 rgba(135, 172, 117, 0.4)', '0 0 0 10px rgba(135, 172, 117, 0)', '0 0 0 0 rgba(135, 172, 117, 0.4)']
                                            } : {}}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            Khaki Sketch Studio
                                        </motion.span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-6">
                                        "비즈니스 파트너처럼<br />함께 고민합니다."
                                    </h3>

                                    <motion.ul
                                        className="flex flex-col gap-4 text-white/90"
                                        variants={listVariants}
                                        initial="hidden"
                                        animate={activeTab === 'studio' ? "visible" : "hidden"}
                                    >
                                        {goodPoints.map((point, index) => (
                                            <motion.li
                                                key={index}
                                                variants={itemVariants}
                                                className="flex gap-3 items-start"
                                            >
                                                <motion.span
                                                    className="text-brand-secondary font-bold"
                                                    animate={activeTab === 'studio' ? {
                                                        scale: [1, 1.3, 1],
                                                    } : {}}
                                                    transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                                                >
                                                    ✓
                                                </motion.span>
                                                <span className={index === 0 ? "font-semibold" : ""}>{point}</span>
                                            </motion.li>
                                        ))}
                                    </motion.ul>
                                </div>
                            </motion.div>
                        </ScrollReveal>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Comparison;
