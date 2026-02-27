import { Metadata } from 'next';
import ProcessContent from './ProcessContent';

export const metadata: Metadata = {
  title: '개발 프로세스',
  description: '카키스케치의 체계적인 개발 프로세스를 확인하세요. Discovery부터 런칭까지 투명하게 진행합니다.',
  openGraph: {
    title: '개발 프로세스 | KhakiSketch',
    description: '카키스케치의 체계적인 개발 프로세스를 확인하세요.',
    images: [{ url: '/opengraph-image.webp', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '개발 프로세스 | KhakiSketch',
    description: '카키스케치의 체계적인 개발 프로세스를 확인하세요.',
    images: ['/opengraph-image.webp'],
  },
  alternates: {
    canonical: 'https://khakisketch.co.kr/process',
  },
};

export default function ProcessPage() {
  return <ProcessContent />;
}
