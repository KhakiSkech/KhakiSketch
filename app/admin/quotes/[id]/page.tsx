export function generateStaticParams() {
  return [{ id: 'dummy' }];
}

import QuoteDetailClient from './QuoteDetailClient';

interface QuoteDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function QuoteDetailPage({ params }: QuoteDetailPageProps) {
  const { id } = await params;
  return <QuoteDetailClient id={id} />;
}
