'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
const FloatingCTA = dynamic(() => import('@/components/FloatingCTA'), { ssr: false });
const CursorGlow = dynamic(() => import('@/components/ui/CursorGlow'), { ssr: false });


interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps): React.ReactElement {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');


  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main id="main-content">{children}</main>
      <Footer />
      <FloatingCTA />
      <CursorGlow />
    </>
  );
}
