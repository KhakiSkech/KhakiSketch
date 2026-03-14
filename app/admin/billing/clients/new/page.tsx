import type { Metadata } from 'next';
import NewBillingClientClient from './NewBillingClientClient';

export const metadata: Metadata = {
  title: '고객 등록 | KhakiSketch Admin',
};

export default function NewBillingClientPage(): React.ReactElement {
  return <NewBillingClientClient />;
}
