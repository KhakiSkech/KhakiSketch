import type { Metadata } from 'next';
import BillingClientDetailClient from './BillingClientDetailClient';

export const metadata: Metadata = {
  title: '고객 상세 | KhakiSketch Admin',
};

export function generateStaticParams(): { id: string }[] {
  return [{ id: 'dummy' }];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BillingClientDetailPage({ params }: PageProps): Promise<React.ReactElement> {
  const { id } = await params;
  return <BillingClientDetailClient id={id} />;
}
