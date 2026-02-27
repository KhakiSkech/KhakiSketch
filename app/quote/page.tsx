import React from 'react';
import type { Metadata } from 'next';
import QuoteWizard from '@/components/quote/QuoteWizard';

export const metadata: Metadata = {
    title: '견적 요청',
    description: '프로젝트 견적을 요청하세요. KhakiSketch가 최적의 솔루션을 제안해 드립니다.',
    openGraph: {
        title: '견적 요청 | KhakiSketch',
        description: '프로젝트 견적을 요청하세요. KhakiSketch가 최적의 솔루션을 제안해 드립니다.',
        images: [{ url: '/opengraph-image.webp', width: 1200, height: 630 }],
    },
    twitter: {
        card: 'summary_large_image',
        title: '견적 요청 | KhakiSketch',
        description: '프로젝트 견적을 요청하세요. KhakiSketch가 최적의 솔루션을 제안해 드립니다.',
        images: ['/opengraph-image.webp'],
    },
    alternates: {
        canonical: 'https://khakisketch.co.kr/quote',
    },
};

export default function QuotePage() {
    return (
        <div className="w-full min-h-screen pt-16">
            <QuoteWizard />
        </div>
    );
}
