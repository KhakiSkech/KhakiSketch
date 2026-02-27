'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SelectionCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    isSelected: boolean;
    onClick: () => void;
}

export default function SelectionCard({ icon, title, description, isSelected, onClick }: SelectionCardProps) {
    return (
        <motion.button
            onClick={onClick}
            className={`relative w-full p-6 rounded-2xl border-2 text-left transition-all duration-300 group ${isSelected
                    ? 'border-brand-secondary bg-brand-secondary/5 shadow-lg shadow-brand-secondary/10'
                    : 'border-gray-200 bg-white hover:border-brand-secondary/50 hover:shadow-md'
                }`}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Selection Indicator */}
            <motion.div
                className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center ${isSelected ? 'bg-brand-secondary' : 'border-2 border-gray-300'
                    }`}
                initial={false}
                animate={isSelected ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                {isSelected && (
                    <motion.svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </motion.svg>
                )}
            </motion.div>

            {/* Icon */}
            <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 ${isSelected
                        ? 'bg-brand-secondary/20 text-brand-secondary'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-brand-secondary/10 group-hover:text-brand-secondary'
                    }`}
            >
                {icon}
            </div>

            {/* Title */}
            <h3
                className={`font-bold text-lg mb-2 transition-colors duration-300 ${isSelected ? 'text-brand-primary' : 'text-gray-800'
                    }`}
            >
                {title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-500 leading-relaxed">{description}</p>

            {/* Glow Effect */}
            {isSelected && (
                <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        background: 'radial-gradient(circle at center, rgba(116, 153, 101, 0.1), transparent 70%)',
                    }}
                />
            )}
        </motion.button>
    );
}
