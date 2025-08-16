"use client";

import Navigation from './Navigation';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { token, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.replace('/splash');
    }
  }, [isLoading, token, router]);

  if (isLoading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh' }}>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!token) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="app-layout">
      <Navigation />
      <main className="main-content">
        {children}
      </main>

      <style jsx>{`
        .app-layout {
          min-height: 100vh;
          background: var(--bg-default);
        }

        .main-content {
          padding-top: 64px; /* Navigation height */
          min-height: calc(100vh - 64px);
        }

        .loading-spinner {
          font-size: var(--fs-body-18);
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
