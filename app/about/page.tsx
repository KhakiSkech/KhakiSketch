import { Metadata } from 'next';
import AboutContent from './AboutContent';

export const metadata: Metadata = {
  title: '소개',
  description: '카키스케치는 스타트업 MVP, 업무 자동화, 기업 홈페이지 개발을 전문으로 하는 기술 스튜디오입니다.',
  openGraph: {
    title: '카키스케치 소개 | KhakiSketch',
    description: '카키스케치는 스타트업 MVP, 업무 자동화, 기업 홈페이지 개발을 전문으로 하는 기술 스튜디오입니다.',
    images: [{ url: '/opengraph-image.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '카키스케치 소개 | KhakiSketch',
    description: '카키스케치는 스타트업 MVP, 업무 자동화, 기업 홈페이지 개발을 전문으로 하는 기술 스튜디오입니다.',
    images: ['/opengraph-image.webp'],
  },
  alternates: {
    canonical: 'https://khakisketch.co.kr/about',
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
