import type { Metadata } from 'next';
import BillingInvoicesClient from './BillingInvoicesClient';

export const metadata: Metadata = {
  title: '청구/수금 | KhakiSketch Admin',
};

export default function BillingInvoicesPage(): React.ReactElement {
  return <BillingInvoicesClient />;
}
