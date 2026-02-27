'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useQuote } from './QuoteContext';

const steps = [
    { number: 1, title: '프로젝트 유형' },
    { number: 2, title: '상세 정보' },
    { number: 3, title: '기능/형태' },
    { number: 4, title: '상담 신청' },
];

export default function QuoteProgress() {
    const { currentStep, setCurrentStep, isComplete } = useQuote();

    return (
        <div className="w-full py-6 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Progress Bar */}
                <div className="relative mb-8">
                    {/* Background Line - Connects circle centers only */}
                    <div
                        className="absolute top-1/2 h-1 bg-gray-200 -translate-y-1/2 rounded-full"
                        style={{ left: '20px', right: '20px' }}
                    />

                    {/* Progress Line - Animated, starts from first circle center */}
                    <motion.div
                        className="absolute top-1/2 h-1 bg-gradient-to-r from-brand-secondary to-brand-primary -translate-y-1/2 rounded-full"
                        style={{ left: '20px' }}
                        initial={{ width: '0%' }}
                        animate={{
                            width: currentStep === 1
                                ? '0%'
                                : `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 40px * ${(currentStep - 1) / (steps.length - 1)})`
                        }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                    />

                    {/* Step Indicators */}
                    <div className="relative flex justify-between">
                        {steps.map((step) => {
                            const isCompleted = currentStep > step.number || isComplete;
                            const isCurrent = currentStep === step.number && !isComplete;
                            const isClickable = step.number <= currentStep;

                            return (
                                <button
                                    key={step.number}
                                    onClick={() => isClickable && setCurrentStep(step.number)}
                                    disabled={!isClickable}
                                    className={`flex flex-col items-center group ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
                                >
                                    {/* Circle */}
                                    <motion.div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${isCompleted
                                            ? 'bg-brand-secondary text-white'
                                            : isCurrent
                                                ? 'bg-brand-primary text-white ring-4 ring-brand-secondary/30'
                                                : 'bg-gray-200 text-gray-400'
                                            }`}
                                        initial={{ scale: 1 }}
                                        animate={{ scale: isCurrent ? 1.1 : 1 }}
                                        whileHover={isClickable ? { scale: 1.1 } : {}}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {isCompleted ? (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            step.number
                                        )}
                                    </motion.div>

                                    {/* Label */}
                                    <span
                                        className={`mt-2 text-xs font-medium transition-colors duration-300 hidden sm:block ${isCurrent ? 'text-brand-primary' : isCompleted ? 'text-brand-secondary' : 'text-gray-400'
                                            }`}
                                    >
                                        {step.title}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
