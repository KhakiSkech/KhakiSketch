'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBoxProps {
    value: string;
    onChange: (value: string) => void;
    onClear?: () => void;
    placeholder?: string;
    isSearching?: boolean;
    resultsCount?: number;
    className?: string;
}

export default function SearchBox({
    value,
    onChange,
    onClear,
    placeholder = '검색...',
    isSearching = false,
    resultsCount,
    className = '',
}: SearchBoxProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    // Cmd/Ctrl + K로 검색창 포커스
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleClear = () => {
        onChange('');
        onClear?.();
        inputRef.current?.focus();
    };

    return (
        <div className={`relative ${className}`}>
            {/* Search Input Container */}
            <div
                className={`relative flex items-center bg-white border-2 rounded-xl transition-all duration-300 ${isFocused
                        ? 'border-brand-primary shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
            >
                {/* Search Icon */}
                <div className="absolute left-4 pointer-events-none">
                    {isSearching ? (
                        <motion.svg
                            className="w-5 h-5 text-brand-primary"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </motion.svg>
                    ) : (
                        <svg
                            className="w-5 h-5 text-brand-muted"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    )}
                </div>

                {/* Input Field */}
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="w-full py-3 pl-12 pr-24 text-brand-text placeholder-brand-muted bg-transparent outline-none font-medium"
                />

                {/* Right Side: Results Count or Clear Button */}
                <div className="absolute right-4 flex items-center gap-2">
                    {/* Results Count */}
                    <AnimatePresence>
                        {value && typeof resultsCount === 'number' && (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="text-xs font-bold text-brand-muted bg-brand-bg px-2 py-1 rounded-md"
                            >
                                {resultsCount}개 결과
                            </motion.span>
                        )}
                    </AnimatePresence>

                    {/* Clear Button */}
                    <AnimatePresence>
                        {value && (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={handleClear}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                aria-label="검색어 지우기"
                            >
                                <svg
                                    className="w-4 h-4 text-brand-muted"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </motion.button>
                        )}
                    </AnimatePresence>

                    {/* Keyboard Shortcut Hint */}
                    {!isFocused && !value && (
                        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs font-mono text-brand-muted bg-brand-bg border border-gray-200 rounded">
                            <span className="text-xs">⌘</span>K
                        </kbd>
                    )}
                </div>
            </div>

            {/* Search Tips (Optional) */}
            <AnimatePresence>
                {isFocused && !value && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 top-full mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-4"
                    >
                        <p className="text-sm text-brand-muted">
                            💡 <span className="font-bold">검색 팁:</span> 프로젝트 제목, 설명, 기술 스택으로 검색할 수 있습니다.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
