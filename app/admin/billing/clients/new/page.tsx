import { Suspense } from 'react';
import type { Metadata } from 'next';
import NewBillingClientClient from './NewBillingClientClient';

export const metadata: Metadata = {
  title: '고객 등록 | KhakiSketch Admin',
};

export default function NewBillingClientPage(): React.ReactElement {
  return (
    <Suspense fallback={<div className="p-8 text-brand-muted">로딩 중...</div>}>
      <NewBillingClientClient />
    </Suspense>
  );
}
