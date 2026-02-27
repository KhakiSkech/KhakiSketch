'use client';

import dynamic from 'next/dynamic';

const TechStackMarquee = dynamic(() => import('@/components/TechStackMarquee'), { ssr: false });

export default function TechStackMarqueeClient() {
  return <TechStackMarquee />;
}
