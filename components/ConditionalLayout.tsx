'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingCTA from '@/components/FloatingCTA';


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
    </>
  );
}
