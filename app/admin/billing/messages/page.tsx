import type { Metadata } from 'next';
import BillingMessagesClient from './BillingMessagesClient';

export const metadata: Metadata = {
  title: '메시지 관리 | KhakiSketch Admin',
};

export default function BillingMessagesPage(): React.ReactElement {
  return <BillingMessagesClient />;
}
