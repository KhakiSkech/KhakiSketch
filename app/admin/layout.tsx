'use client';

import { useAuth } from '@/hooks/useAuth';
import AdminAuth from '@/components/admin/AdminAuth';
import ErrorBoundary from '@/components/ErrorBoundary';
import Sidebar from '@/components/admin/Sidebar';
import NoiseTexture from '@/components/ui/NoiseTexture';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps): React.ReactElement {
  const { isAdmin, isLoading, signOutUser } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center relative">
        <NoiseTexture />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="animate-spin w-10 h-10 border-3 border-brand-primary border-t-transparent rounded-full" />
          <p className="text-brand-muted text-sm">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminAuth />;
  }

  return (
    <div className="min-h-screen bg-brand-bg relative">
      {/* Noise Texture Overlay */}
      <NoiseTexture />

      <div className="flex min-h-screen relative z-10">
        {/* Sidebar */}
        <Sidebar onLogout={signOutUser} />

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
