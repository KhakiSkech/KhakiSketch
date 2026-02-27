import { Metadata } from 'next';
import PortfolioContent from './PortfolioContent';

export const metadata: Metadata = {
  title: '포트폴리오',
  description: '카키스케치가 완성한 프로젝트들을 확인하세요. 스타트업 MVP, 대시보드, 자동화 시스템 등 다양한 사례.',
  openGraph: {
    title: '포트폴리오 | KhakiSketch',
    description: '카키스케치가 완성한 프로젝트들을 확인하세요.',
    images: [{ url: '/opengraph-image.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '포트폴리오 | KhakiSketch',
    description: '카키스케치가 완성한 프로젝트들을 확인하세요.',
    images: ['/opengraph-image.webp'],
  },
  alternates: {
    canonical: 'https://khakisketch.co.kr/portfolio',
  },
};

export default function PortfolioPage() {
  return <PortfolioContent />;
}
