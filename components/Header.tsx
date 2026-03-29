'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const rafRef = useRef<number | null>(null);

  // Throttled scroll handler with RAF
  const handleScroll = useCallback(() => {
    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      setIsScrolled(window.scrollY > 10);
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [handleScroll]);

  const menuRef = useRef<HTMLDivElement>(null);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Focus trap for mobile menu
  useEffect(() => {
    if (!isMenuOpen || !menuRef.current) return;

    const menuEl = menuRef.current;
    const focusableEls = menuEl.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];

    firstEl?.focus();

    function handleKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl?.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl?.focus();
        }
      }
    }

    menuEl.addEventListener('keydown', handleKeyDown);
    return () => menuEl.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  const menuItems = [
    { name: '가격', path: '/pricing' },
    { name: '작업 방식', path: '/process' },
    { name: '포트폴리오', path: '/portfolio' },
    { name: '블로그', path: '/blog' },
    { name: '회사 소개', path: '/about' },
  ];

  return (
    <>
      <header className={`w-full border-b border-gray-100 sticky top-0 z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-brand-bg/90 backdrop-blur-md'}`}>
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer" onClick={() => setIsMenuOpen(false)}>
            <span className="font-bold text-brand-primary text-xl tracking-tight">KhakiSketch</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex gap-8 items-center h-full">
            <nav className="flex gap-6 items-center">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  className={`text-[15px] transition-all relative ${isActive(item.path) ? 'font-bold text-brand-primary' : 'font-medium text-brand-text hover:text-brand-secondary'}`}
                >
                  {item.name}
                  {isActive(item.path) && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 w-full h-0.5 bg-brand-secondary rounded-full"
                    />
                  )}
                </Link>
              ))}
            </nav>
            <Link href="/quote" className="relative bg-brand-secondary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-brand-secondary/90 hover:shadow-lg transition-all hover:-translate-y-0.5 active:scale-[0.98] shadow-md shadow-brand-secondary/25">
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
              무료 상담 신청하기
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            <Link href="/quote" className="font-bold text-brand-primary text-sm bg-brand-bg px-3 py-2 rounded-lg border border-gray-200 active:scale-95 transition-transform">
              무료 상담 신청
            </Link>
            <button
              className="text-brand-text p-2 -mr-2 focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="모바일 메뉴"
            ref={menuRef}
            className="fixed inset-0 top-20 z-40 bg-brand-bg px-6 pb-20 pt-8 lg:hidden overflow-y-auto"
          >
            <nav className="flex flex-col gap-2 text-lg font-medium text-brand-primary">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`p-4 rounded-xl transition-colors ${isActive(item.path) ? 'bg-white font-bold shadow-sm' : 'hover:bg-white/50'}`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="h-px bg-gray-200 my-4"></div>
              <Link href="/quote" onClick={() => setIsMenuOpen(false)} className="bg-brand-primary text-white text-center py-4 rounded-xl font-bold shadow-md active:scale-[0.98] transition-transform">
                무료 상담 신청하기
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
