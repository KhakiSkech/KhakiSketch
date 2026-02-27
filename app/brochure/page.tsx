'use client';

import React from 'react';
import PDFExportButton from '@/components/brochure/PDFExportButton';
import PageNavigation from '@/components/brochure/PageNavigation';
import BrochureViewer from '@/components/brochure/BrochureViewer';
import { colors, borderRadius, shadows } from '@/components/brochure/brochure-design-system';

// Import all 16 pages
import CoverPageLandscape from '@/components/brochure/pages-landscape/CoverPageLandscape';
import ProblemPageLandscape from '@/components/brochure/pages-landscape/ProblemPageLandscape';
import DifferencePageLandscape from '@/components/brochure/pages-landscape/DifferencePageLandscape';
import TargetPageLandscape from '@/components/brochure/pages-landscape/TargetPageLandscape';
import ServicesPageLandscape from '@/components/brochure/pages-landscape/ServicesPageLandscape';
import Project1PageLandscape from '@/components/brochure/pages-landscape/Project1PageLandscape';
import Project2PageLandscape from '@/components/brochure/pages-landscape/Project2PageLandscape';
import Project3PageLandscape from '@/components/brochure/pages-landscape/Project3PageLandscape';
import Project4PageLandscape from '@/components/brochure/pages-landscape/Project4PageLandscape';
import ProcessPageLandscape from '@/components/brochure/pages-landscape/ProcessPageLandscape';
import CommunicationPageLandscape from '@/components/brochure/pages-landscape/CommunicationPageLandscape';
import TechStackPageLandscape from '@/components/brochure/pages-landscape/TechStackPageLandscape';
import TrustPageLandscape from '@/components/brochure/pages-landscape/TrustPageLandscape';
import TestimonialsPageLandscape from '@/components/brochure/pages-landscape/TestimonialsPageLandscape';
import FAQPageLandscape from '@/components/brochure/pages-landscape/FAQPageLandscape';
import ContactPageLandscape from '@/components/brochure/pages-landscape/ContactPageLandscape';

// Page info for navigation
const pages = [
  { id: 'page-1', title: '커버', shortTitle: '커버' },
  { id: 'page-2', title: '문제 정의', shortTitle: '문제' },
  { id: 'page-3', title: '우리의 차별점', shortTitle: '차별점' },
  { id: 'page-4', title: '대상 고객', shortTitle: '대상' },
  { id: 'page-5', title: '서비스', shortTitle: '서비스' },
  { id: 'page-6', title: '투자 대시보드', shortTitle: '사례 1' },
  { id: 'page-7', title: '자재 관리', shortTitle: '사례 2' },
  { id: 'page-8', title: '예약 시스템', shortTitle: '사례 3' },
  { id: 'page-9', title: '재고 대시보드', shortTitle: '사례 4' },
  { id: 'page-10', title: '프로세스', shortTitle: '과정' },
  { id: 'page-11', title: '소통 방식', shortTitle: '소통' },
  { id: 'page-12', title: '기술 스택', shortTitle: '기술' },
  { id: 'page-13', title: '신뢰 요소', shortTitle: '신뢰' },
  { id: 'page-14', title: '고객 후기', shortTitle: '후기' },
  { id: 'page-15', title: '자주 묻는 질문', shortTitle: 'FAQ' },
  { id: 'page-16', title: '연락처', shortTitle: '연락' },
];

export default function BrochurePage() {
  return (
    <>
      {/* PDF Export Button */}
      <PDFExportButton />

      {/* Page Navigation */}
      <PageNavigation pages={pages} />

      {/* Home Link */}
      <div className="no-print fixed top-6 left-6 z-50">
        <a
          href="/"
          className="flex items-center gap-2 px-4 py-2 font-medium transition-all hover:scale-105"
          style={{
            backgroundColor: colors.neutral.white,
            color: colors.brand.dark,
            borderRadius: borderRadius.lg,
            boxShadow: shadows.md,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">홈으로</span>
        </a>
      </div>

      {/* Brochure Content */}
      <BrochureViewer>
        <main id="brochure-content" className="brochure-container-landscape" role="main" aria-label="KhakiSketch 회사 소개서">
          <CoverPageLandscape />
          <ProblemPageLandscape />
          <DifferencePageLandscape />
          <TargetPageLandscape />
          <ServicesPageLandscape />
          <Project1PageLandscape />
          <Project2PageLandscape />
          <Project3PageLandscape />
          <Project4PageLandscape />
          <ProcessPageLandscape />
          <CommunicationPageLandscape />
          <TechStackPageLandscape />
          <TrustPageLandscape />
          <TestimonialsPageLandscape />
          <FAQPageLandscape />
          <ContactPageLandscape />
        </main>
      </BrochureViewer>
    </>
  );
}
