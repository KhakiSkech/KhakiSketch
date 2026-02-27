'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { colors, borderRadius, shadows } from './brochure-design-system';

interface BrochureViewerProps {
  children: React.ReactNode;
}

export default function BrochureViewer({ children }: BrochureViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [viewMode, setViewMode] = useState<'scroll' | 'fit'>('scroll');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setViewMode('fit');
        setZoom(100);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 10, 150));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 10, 50));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoom(100);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          handleZoomIn();
        } else if (e.key === '-') {
          e.preventDefault();
          handleZoomOut();
        } else if (e.key === '0') {
          e.preventDefault();
          handleResetZoom();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleZoomIn, handleZoomOut, handleResetZoom]);

  return (
    <div className="relative min-h-screen">
      {/* Zoom Controls - Desktop only */}
      {!isMobile && (
        <div
          className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2"
          style={{
            backgroundColor: colors.neutral.white,
            borderRadius: borderRadius.full,
            boxShadow: shadows.lg,
          }}
        >
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-gray-100 rounded-full"
            title="축소 (Ctrl+-)"
            disabled={zoom <= 50}
            style={{ opacity: zoom <= 50 ? 0.5 : 1 }}
            aria-label="축소"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.text.secondary} strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          <button
            onClick={handleResetZoom}
            className="px-3 py-1 text-sm font-medium transition-colors hover:bg-gray-100 rounded-lg min-w-[60px]"
            title="원래 크기 (Ctrl+0)"
            style={{ color: colors.text.primary }}
          >
            {zoom}%
          </button>

          <button
            onClick={handleZoomIn}
            className="w-8 h-8 flex items-center justify-center transition-colors hover:bg-gray-100 rounded-full"
            title="확대 (Ctrl++)"
            disabled={zoom >= 150}
            style={{ opacity: zoom >= 150 ? 0.5 : 1 }}
            aria-label="확대"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.text.secondary} strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          <div className="w-px h-6 bg-gray-200 mx-2" />

          <button
            onClick={() => setViewMode(viewMode === 'scroll' ? 'fit' : 'scroll')}
            className="px-3 py-1 text-xs font-medium transition-colors hover:bg-gray-100 rounded-lg"
            title="보기 모드 전환"
            style={{ color: colors.text.secondary }}
          >
            {viewMode === 'scroll' ? '스크롤' : '맞춤'}
          </button>
        </div>
      )}

      {/* Content with zoom applied */}
      <div
        className={`transition-transform duration-200 ${viewMode === 'fit' ? 'origin-top' : ''}`}
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
        }}
      >
        {children}
      </div>
    </div>
  );
}
