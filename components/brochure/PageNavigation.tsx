'use client';

import React, { useState, useEffect } from 'react';
import { colors, borderRadius, shadows } from './brochure-design-system';

interface PageInfo {
  id: string;
  title: string;
  shortTitle: string;
}

interface PageNavigationProps {
  pages: PageInfo[];
}

export default function PageNavigation({ pages }: PageNavigationProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const pageElements = pages.map(p => document.getElementById(p.id));
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (let i = pageElements.length - 1; i >= 0; i--) {
        const element = pageElements[i];
        if (element && element.offsetTop <= scrollPosition) {
          setCurrentPage(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pages]);

  const scrollToPage = (index: number) => {
    const element = document.getElementById(pages[index].id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (isMobile) setIsOpen(false);
  };

  // Mobile: Floating button + Drawer
  if (isMobile) {
    return (
      <>
        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="no-print fixed bottom-6 right-6 z-50 w-14 h-14 flex items-center justify-center"
          style={{
            backgroundColor: colors.brand.primary,
            borderRadius: borderRadius.full,
            boxShadow: shadows.xl,
          }}
          aria-label="페이지 네비게이션 열기"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Current Page Indicator */}
        <div
          className="no-print fixed bottom-6 left-6 z-50 px-3 py-2 text-xs font-medium"
          style={{
            backgroundColor: colors.neutral.white,
            color: colors.text.primary,
            borderRadius: borderRadius.lg,
            boxShadow: shadows.md,
          }}
        >
          {currentPage + 1} / {pages.length}
        </div>

        {/* Drawer */}
        {isOpen && (
          <>
            <div
              className="no-print fixed inset-0 z-50 bg-black/50"
              onClick={() => setIsOpen(false)}
            />
            <div
              className="no-print fixed bottom-0 left-0 right-0 z-50 p-4 max-h-[70vh] overflow-y-auto"
              style={{
                backgroundColor: colors.neutral.white,
                borderTopLeftRadius: borderRadius['2xl'],
                borderTopRightRadius: borderRadius['2xl'],
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg" style={{ color: colors.text.primary }}>
                  페이지 목차
                </h3>
                <button onClick={() => setIsOpen(false)} aria-label="닫기">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={colors.text.secondary} strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {pages.map((page, index) => (
                  <button
                    key={page.id}
                    onClick={() => scrollToPage(index)}
                    className="p-3 text-left transition-colors"
                    style={{
                      backgroundColor: currentPage === index ? colors.brand.light : colors.neutral.offWhite,
                      borderRadius: borderRadius.lg,
                      border: currentPage === index ? `2px solid ${colors.brand.primary}` : '2px solid transparent',
                    }}
                  >
                    <span className="text-xs font-medium" style={{ color: colors.brand.primary }}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <p className="text-sm font-medium mt-0.5" style={{ color: colors.text.primary }}>
                      {page.shortTitle}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // Desktop: Side Navigation
  return (
    <nav
      className="no-print fixed right-6 top-1/2 -translate-y-1/2 z-50 p-3"
      style={{
        backgroundColor: colors.neutral.white,
        borderRadius: borderRadius['2xl'],
        boxShadow: shadows.xl,
      }}
      aria-label="페이지 네비게이션"
    >
      <div className="flex flex-col gap-1">
        {pages.map((page, index) => (
          <button
            key={page.id}
            onClick={() => scrollToPage(index)}
            className="group flex items-center gap-2 px-2 py-1.5 transition-all"
            style={{
              backgroundColor: currentPage === index ? colors.brand.light : 'transparent',
              borderRadius: borderRadius.lg,
            }}
            title={page.title}
            aria-current={currentPage === index ? 'page' : undefined}
          >
            <span
              className="w-6 h-6 flex items-center justify-center text-xs font-bold transition-colors"
              style={{
                backgroundColor: currentPage === index ? colors.brand.primary : 'transparent',
                color: currentPage === index ? colors.neutral.white : colors.text.muted,
                borderRadius: borderRadius.md,
              }}
            >
              {index + 1}
            </span>
            <span
              className="text-xs font-medium whitespace-nowrap overflow-hidden transition-all"
              style={{
                maxWidth: currentPage === index ? '100px' : '0',
                opacity: currentPage === index ? 1 : 0,
                color: colors.text.primary,
              }}
            >
              {page.shortTitle}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
