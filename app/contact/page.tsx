import { Metadata } from 'next';
import React, { Suspense } from 'react';
import Contact from '@/components/Contact'; // Your converted client component

export const metadata: Metadata = {
  title: '무료 상담 신청',
  description: '카키스케치에 무료 프로젝트 상담을 신청하세요. 15분이면 충분합니다. 상담 후 의무 계약 없음.',
  openGraph: {
    title: '무료 상담 신청 | KhakiSketch',
    description: '카키스케치에 무료 프로젝트 상담을 신청하세요. 15분이면 충분합니다.',
    images: [{ url: '/opengraph-image.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '무료 상담 신청 | KhakiSketch',
    description: '카키스케치에 무료 프로젝트 상담을 신청하세요. 15분이면 충분합니다.',
    images: ['/opengraph-image.webp'],
  },
  alternates: {
    canonical: 'https://khakisketch.co.kr/contact',
  },
};

export default function ContactPage() {
    return (
        <div className="w-full min-h-screen pt-20">
            <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">로딩 중...</div>}>
                <Contact />
            </Suspense>
        </div>
    );
}
