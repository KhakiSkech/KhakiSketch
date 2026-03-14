import type { Metadata } from 'next';
import BillingClientsClient from './BillingClientsClient';

export const metadata: Metadata = {
  title: '고객 관리 | KhakiSketch Admin',
};

export default function BillingClientsPage(): React.ReactElement {
  return <BillingClientsClient />;
}
