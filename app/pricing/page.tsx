import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const PricingContent = dynamic(() => import('@/components/PricingContent'), {
  loading: () => (
    <div className="w-full bg-brand-bg min-h-screen pt-24 pb-20 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-gray-200 rounded w-1/3"></div>
          <div className="h-6 bg-gray-100 rounded w-2/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-100 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: '가격 안내',
  description: 'KhakiSketch 서비스 가격 안내. Discovery 요구사항 정의, 기업 홈페이지, MVP 개발, 업무 자동화 시스템 견적.',
  openGraph: {
    title: '가격 안내 | KhakiSketch',
    description: 'Discovery부터 시작하는 합리적인 개발 비용. 요구사항 정의 후 정확한 견적 제공.',
    images: [{ url: '/opengraph-image.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '가격 안내 | KhakiSketch',
    description: 'Discovery부터 시작하는 합리적인 개발 비용. 요구사항 정의 후 정확한 견적 제공.',
    images: ['/opengraph-image.webp'],
  },
  alternates: {
    canonical: 'https://khakisketch.co.kr/pricing',
  },
};

export default function PricingPage() {
  return <PricingContent />;
}
