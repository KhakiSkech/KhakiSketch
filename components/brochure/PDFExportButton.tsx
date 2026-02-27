'use client';

import React, { useState } from 'react';
import { colors, borderRadius, shadows } from './brochure-design-system';

interface PDFExportButtonProps {
  className?: string;
}

export default function PDFExportButton({ className = '' }: PDFExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handlePrint = async () => {
    setIsLoading(true);

    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 200));

    // Use browser's native print functionality
    window.print();

    setIsLoading(false);
  };

  return (
    <div className={`no-print fixed top-6 right-6 z-50 ${className}`}>
      <button
        onClick={handlePrint}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        disabled={isLoading}
        className="flex items-center gap-2 px-5 py-3 font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-70"
        style={{
          backgroundColor: colors.brand.primary,
          color: colors.neutral.white,
          borderRadius: borderRadius.xl,
          boxShadow: shadows.lg,
        }}
        aria-label="PDF로 저장하거나 인쇄하기"
      >
        {isLoading ? (
          <svg
            className="animate-spin"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1" />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        )}
        <span className="hidden sm:inline">PDF 다운로드</span>
        <span className="sm:hidden">PDF</span>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div
          className="absolute top-full right-0 mt-2 p-2 text-xs whitespace-nowrap"
          style={{
            backgroundColor: colors.brand.dark,
            color: colors.neutral.white,
            borderRadius: borderRadius.lg,
          }}
        >
          브라우저 인쇄 다이얼로그에서 'PDF로 저장' 선택
          <div
            className="absolute -top-1 right-4 w-2 h-2 rotate-45"
            style={{ backgroundColor: colors.brand.dark }}
          />
        </div>
      )}
    </div>
  );
}
