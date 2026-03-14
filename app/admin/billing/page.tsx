import type { Metadata } from 'next';
import BillingDashboardClient from './BillingDashboardClient';

export const metadata: Metadata = {
  title: '과금 대시보드 | KhakiSketch Admin',
};

export default function BillingDashboardPage(): React.ReactElement {
  return <BillingDashboardClient />;
}
