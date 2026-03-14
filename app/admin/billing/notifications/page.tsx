import type { Metadata } from 'next';
import NotificationLogsClient from './NotificationLogsClient';

export const metadata: Metadata = {
  title: '알림 이력 | KhakiSketch Admin',
};

export default function NotificationLogsPage(): React.ReactElement {
  return <NotificationLogsClient />;
}
