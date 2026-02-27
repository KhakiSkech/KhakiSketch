import React from 'react';
import { colors } from './brochure-design-system';

interface BrochurePageLandscapeProps {
  children: React.ReactNode;
  pageNumber?: number;
  showPageNumber?: boolean;
  className?: string;
  bgColor?: 'white' | 'brand' | 'light';
  id?: string;
  totalPages?: number;
}

// Explicit hex colors to avoid Tailwind CSS variable issues
const bgStyles: Record<string, React.CSSProperties> = {
  white: { backgroundColor: colors.neutral.white },
  brand: { backgroundColor: colors.brand.dark, color: colors.neutral.white },
  light: { backgroundColor: colors.neutral.offWhite },
};

const pageNumberStyles: Record<string, React.CSSProperties> = {
  white: { color: 'rgba(102, 102, 102, 0.5)' },
  brand: { color: 'rgba(255, 255, 255, 0.5)' },
  light: { color: 'rgba(102, 102, 102, 0.5)' },
};

export default function BrochurePageLandscape({
  children,
  pageNumber,
  showPageNumber = true,
  className = '',
  bgColor = 'white',
  id,
  totalPages = 14,
}: BrochurePageLandscapeProps) {
  const pageId = id || (pageNumber ? `page-landscape-${pageNumber}` : undefined);

  return (
    <section
      id={pageId}
      className={`brochure-page-landscape relative overflow-hidden ${className}`}
      style={bgStyles[bgColor]}
      aria-label={pageNumber ? `페이지 ${pageNumber}` : undefined}
    >
      {children}
      {showPageNumber && pageNumber && (
        <div
          className="absolute bottom-6 right-8 text-xs font-medium"
          style={pageNumberStyles[bgColor]}
          aria-hidden="true"
        >
          {pageNumber} / {totalPages}
        </div>
      )}
    </section>
  );
}
