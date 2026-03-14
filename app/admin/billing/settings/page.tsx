import type { Metadata } from 'next';
import BillingSettingsClient from './BillingSettingsClient';

export const metadata: Metadata = {
  title: '과금 설정 | KhakiSketch Admin',
};

export default function BillingSettingsPage(): React.ReactElement {
  return <BillingSettingsClient />;
}
