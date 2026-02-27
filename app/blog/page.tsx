import { Metadata } from 'next';
import BlogPageClient from './BlogPageClient';

export const metadata: Metadata = {
  title: '블로그',
  description: '카키스케치의 개발 인사이트, 가이드, 케이스 스터디. MVP 개발, 업무 자동화, 웹 개발에 대한 실용적인 글.',
  openGraph: {
    title: '블로그 | KhakiSketch',
    description: '스타트업 MVP 개발, 업무 자동화, 웹 개발에 대한 실용적인 인사이트와 가이드.',
    images: [{ url: '/opengraph-image.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '블로그 | KhakiSketch',
    description: '스타트업 MVP 개발, 업무 자동화, 웹 개발에 대한 실용적인 인사이트와 가이드.',
    images: ['/opengraph-image.webp'],
  },
  alternates: {
    canonical: 'https://khakisketch.co.kr/blog',
  },
};

export default function BlogPage() {
  return <BlogPageClient />;
}
