import { Metadata } from 'next';
import React, { Suspense } from 'react';
import Contact from '@/components/Contact'; // Your converted client component

export const metadata: Metadata = {
  title: '문의하기',
  description: '카키스케치에 프로젝트 문의 및 상담을 요청하세요. 빠르고 친절하게 답변드립니다.',
  openGraph: {
    title: '문의하기 | KhakiSketch',
    description: '카키스케치에 프로젝트 문의 및 상담을 요청하세요.',
    images: [{ url: '/opengraph-image.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '문의하기 | KhakiSketch',
    description: '카키스케치에 프로젝트 문의 및 상담을 요청하세요.',
    images: ['/opengraph-image.webp'],
  },
  alternates: {
    canonical: 'https://khakisketch.co.kr/contact',
  },
};

// Wrapper component to handle Suspense boundary
function ContactContent() {
    return <Contact />;
}

export default function ContactPage() {
    return (
        <div className="w-full bg-brand-bg min-h-screen pt-20">
            <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">로딩 중...</div>}>
                <ContactContent />
            </Suspense>
        </div>
    );
}
